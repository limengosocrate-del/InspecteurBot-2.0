import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "pvs.json");

app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

/* -------------------------------------------------------------------------- */
/*                                BASE JSON                                   */
/* -------------------------------------------------------------------------- */

async function ensureDatabase() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify(
        {
          pvs: [],
          sequences: {}
        },
        null,
        2
      )
    );
  }
}

async function readDatabase() {
  await ensureDatabase();

  const raw = await fs.readFile(DATA_FILE, "utf8");

  return JSON.parse(raw);
}

async function writeDatabase(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

/* -------------------------------------------------------------------------- */
/*                              ARCHIVES API                                  */
/* -------------------------------------------------------------------------- */

app.get("/api/pvs", async (req, res) => {
  try {
    const db = await readDatabase();

    res.json(db.pvs || []);
  } catch (error) {
    res.status(500).json({
      message: "Impossible de charger les PV."
    });
  }
});

app.get("/api/pvs/:id", async (req, res) => {
  try {
    const db = await readDatabase();

    const pv = db.pvs.find((item) => item.id === req.params.id);

    if (!pv) {
      return res.status(404).json({
        message: "PV introuvable."
      });
    }

    res.json(pv);
  } catch {
    res.status(500).json({
      message: "Erreur serveur."
    });
  }
});

app.put("/api/pvs/:id", async (req, res) => {
  try {
    const document = req.body;

    if (!document?.id) {
      return res.status(400).json({
        message: "Document PV invalide."
      });
    }

    const db = await readDatabase();

    const index = db.pvs.findIndex((item) => item.id === req.params.id);

    if (index >= 0) {
      db.pvs[index] = document;
    } else {
      db.pvs.push(document);
    }

    await writeDatabase(db);

    res.json({
      ok: true,
      id: document.id
    });
  } catch {
    res.status(500).json({
      message: "Impossible d’enregistrer le PV."
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                         NUMEROTATION AUTOMATIQUE                           */
/* -------------------------------------------------------------------------- */

app.post("/api/references/reserve", async (req, res) => {
  try {
    const {
      format = "N°{sequence:3}/IPT/{provinceCode}/{year}",
      year,
      provinceCode = "KIN",
      serviceCode = "IPT"
    } = req.body || {};

    const db = await readDatabase();

    const key = `${year}-${provinceCode}-${format}`;

    db.sequences[key] = Number(db.sequences[key] || 0) + 1;

    const sequence = db.sequences[key];

    const reference = format
      .replace(/\{sequence(?::(\d+))?\}/g, (_, digits) =>
        String(sequence).padStart(Number(digits || 1), "0")
      )
      .replaceAll("{year}", String(year))
      .replaceAll("{provinceCode}", provinceCode)
      .replaceAll("{serviceCode}", serviceCode);

    await writeDatabase(db);

    res.json({
      reference,
      sequence
    });
  } catch {
    res.status(500).json({
      message: "Impossible de générer la référence."
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                            VERIFICATION QR CODE                            */
/* -------------------------------------------------------------------------- */

app.get("/api/verify/:token", async (req, res) => {
  try {
    const db = await readDatabase();

    const pv = db.pvs.find((item) => item.qrToken === req.params.token);

    if (!pv) {
      return res.status(404).json({
        valid: false,
        message: "Document introuvable ou QR Code invalide."
      });
    }

    res.json({
      valid: pv.status === "final" || pv.status === "archived",
      reference: pv.reference,
      type: pv.modelName,
      status: pv.status,
      uniqueId: pv.uniqueId,
      finalizedAt: pv.finalizedAt,
      integrityHash: pv.integrityHash
    });
  } catch {
    res.status(500).json({
      valid: false,
      message: "Erreur de vérification."
    });
  }
});

/* -------------------------------------------------------------------------- */
/*                          GENERATION PDF PLAYWRIGHT                         */
/* -------------------------------------------------------------------------- */

app.post("/api/pdf", async (req, res) => {
  let browser;

  try {
    const { html, title = "proces-verbal" } = req.body || {};

    if (!html) {
      return res.status(400).json({
        message: "HTML du document manquant."
      });
    }

    browser = await chromium.launch({
      headless: true
    });

    const page = await browser.newPage({
      viewport: {
        width: 1240,
        height: 1754
      }
    });

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <link rel="stylesheet" href="http://localhost:${PORT}/styles.css">
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    await page.setContent(fullHtml, {
      waitUntil: "networkidle"
    });

    await page.emulateMedia({
      media: "print"
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0mm",
        bottom: "0mm",
        left: "0mm",
        right: "0mm"
      }
    });

    const safeTitle = String(title)
      .replace(/[^\w.-]+/g, "_")
      .slice(0, 100);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeTitle}.pdf"`
    );

    res.send(pdf);
  } catch (error) {
    console.error("PDF ERROR:", error);

    res.status(500).json({
      message: "Impossible de générer le PDF."
    });
  } finally {
    if (browser) await browser.close();
  }
});

/* -------------------------------------------------------------------------- */
/*                        IA D'ASSISTANCE A LA REDACTION                      */
/* -------------------------------------------------------------------------- */

app.post("/api/ai/pv-suggestions", async (req, res) => {
  const { facts, target, type, limit = 30 } = req.body || {};

  if (!facts) {
    return res.status(400).json({
      message: "Les faits sont obligatoires."
    });
  }

  /*
    Pour utiliser une IA réelle :
    définir les variables environnement :

    OPENAI_API_KEY=...
    OPENAI_MODEL=gpt-4.1-mini

    Sans clé API, le navigateur utilise automatiquement des suggestions locales.
  */

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      message: "IA distante non configurée."
    });
  }

  try {
    const systemPrompt = `
Tu assistes un Inspecteur du Travail dans la rédaction d’un Procès-Verbal.
Tu dois respecter strictement les règles suivantes :

1. Ne modifie jamais les titres officiels.
2. Ne modifie jamais les articles de loi cités dans le modèle.
3. Ne modifie jamais les mentions légales fixes.
4. Ne crée jamais de faits non fournis.
5. Ne présente jamais une hypothèse comme un fait établi.
6. Ne remplace jamais l’appréciation juridique de l’Inspecteur.
7. Propose seulement des formulations administratives prudentes.
8. Réponds uniquement avec un tableau JSON contenant exactement ${limit} chaînes.
9. Chaque proposition doit rester en français administratif.
10. Chaque proposition doit être adaptée à une zone dynamique : ${target}.
`;

    const userPrompt = `
Type de PV : ${type}
Zone dynamique : ${target}
Faits fournis :
${facts}
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
          temperature: 0.35,
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content || "[]";

    const clean = content
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    const ideas = JSON.parse(clean);

    res.json({
      ideas: Array.isArray(ideas) ? ideas.slice(0, limit) : []
    });
  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      message: "Erreur lors de la génération IA."
    });
  }
});

app.listen(PORT, async () => {
  await ensureDatabase();

  console.log(`InspecteurBot PV disponible : http://localhost:${PORT}`);
});
