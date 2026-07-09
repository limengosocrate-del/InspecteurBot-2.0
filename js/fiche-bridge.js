/* ============================================================
   js/fiche-bridge.js
   Injecte l'assistant IA sur les fiches F01–F07 / S01–S03
   EXISTANTES sans modifier leur logique métier
   ============================================================ */

(function () {
  "use strict";

  function detectFicheCode() {
    const path = (location.pathname || "").toUpperCase();
    const m = path.match(/([FS])0?([1-7])/);
    if (m) return m[1] + m[2].padStart(2, "0");
    const t = (document.title || "").toUpperCase();
    const m2 = t.match(/([FS])0?([1-7])/);
    if (m2) return m2[1] + m2[2].padStart(2, "0");
    return "F01";
  }

  function collectFormSnapshot() {
    const data = {};
    document.querySelectorAll("input, select, textarea").forEach((el, i) => {
      const key = el.name || el.id || ("field_" + i);
      if (el.type === "checkbox" || el.type === "radio") {
        if (el.checked) data[key] = el.value || true;
      } else if (el.value) {
        data[key] = el.value;
      }
    });
    return data;
  }

  function ensureDeps(cb) {
    // chemins relatifs depuis F01/F01.html → ../js/
    const base = document.currentScript?.src
      ? document.currentScript.src.replace(/fiche-bridge\.js.*$/, "")
      : "../js/";
    const files = ["smig-data.js", "utils.js", "decompte-engine.js", "knowledge-base.js", "knowledge-base-ext.js", "ai-engine.js"];
    let i = 0;
    function next() {
      if (window.InspecteurAI && window.KnowledgeBase) return cb();
      if (i >= files.length) return cb();
      const s = document.createElement("script");
      s.src = base + files[i++];
      s.onload = next;
      s.onerror = next;
      document.head.appendChild(s);
    }
    if (window.InspecteurAI) cb();
    else next();
  }

  function mount() {
    const code = detectFicheCode();
    if (!document.getElementById("ibt-ai-css")) {
      const l = document.createElement("link");
      l.id = "ibt-ai-css";
      l.rel = "stylesheet";
      l.href = (document.currentScript?.src || "").includes("/js/")
        ? "../assets/inject-ai.css"
        : "assets/inject-ai.css";
      // fallback path
      if (!l.href || l.href.endsWith("null")) l.href = "../assets/inject-ai.css";
      document.head.appendChild(l);
    }

    const root = document.createElement("div");
    root.id = "ibt-ai-fab";
    root.innerHTML = `
      <div id="ibt-ai-panel">
        <h4>🤖 IA — Fiche ${code}</h4>
        <pre id="ibt-ai-out">Chargement de l'expertise locale…</pre>
        <input id="ibt-ai-q" placeholder="Question sur cette fiche / le Code du Travail…">
        <div class="row">
          <button type="button" data-act="check">Checklist</button>
          <button type="button" data-act="errors">Détecter erreurs</button>
          <button type="button" data-act="reco">Recommandations</button>
          <button type="button" data-act="pv">Modèle PV</button>
          <button type="button" data-act="ask">Demander</button>
          <button type="button" data-act="close">Fermer</button>
        </div>
      </div>
      <button type="button" class="fab-btn" id="ibt-ai-toggle">🤖 IA ${code}</button>
    `;
    document.body.appendChild(root);

    const panel = root.querySelector("#ibt-ai-panel");
    const out = root.querySelector("#ibt-ai-out");
    const q = root.querySelector("#ibt-ai-q");

    root.querySelector("#ibt-ai-toggle").onclick = () => {
      panel.classList.toggle("open");
      if (panel.classList.contains("open")) run("check");
    };

    function run(act) {
      ensureDeps(() => {
        if (window.KnowledgeBaseExt) KnowledgeBaseExt.install();
        const snap = collectFormSnapshot();
        if (act === "close") return panel.classList.remove("open");
        if (act === "check") {
          const a = KnowledgeBase.assistFormFiche(code, snap);
          out.textContent = a.ok
            ? `📋 ${code} — ${a.fiche.titre}\n\nChecklist :\n${a.checklist.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\nManquants probables : ${a.missing.join(", ") || "—"}\n\nReco :\n${a.recommendations.map(r => "• " + r).join("\n")}`
            : a.message;
          return;
        }
        if (act === "errors") {
          const issues = [];
          if (!Object.keys(snap).length) issues.push("Formulaire vide — renseigner l'identification employeur et la date.");
          const blob = JSON.stringify(snap).toLowerCase();
          if (blob.includes("smig") || /salaire|paie/.test(blob)) {
            issues.push("Contrôler les salaires vs Décret 25/22 (module SMIG / décompte).");
          }
          const ai = InspecteurAI.analyzeDocument(JSON.stringify(snap, null, 2));
          out.textContent = "Détection d'incohérences :\n" +
            (issues.length ? issues.map(x => "⚠ " + x).join("\n") : "• Pas d'alerte structurelle automatique") +
            "\n\n" + ai.findings.map(f => `[${f.level}] ${f.msg}`).join("\n");
          return;
        }
        if (act === "reco") {
          const f = KnowledgeBase.getFiche(code);
          const ai = InspecteurAI.ask(`Recommandations d'inspection pour la fiche ${code} ${f ? f.titre : ""}`);
          out.textContent = ai.text;
          return;
        }
        if (act === "pv") {
          out.textContent = InspecteurAI.genererDocument("génère un PV pour fiche " + code, {
            employeur: snap.employeur || snap.nom_employeur || snap.entreprise || "[EMPLOYEUR]",
            inspecteur: snap.inspecteur || "[INSPECTEUR]",
            lieu: snap.lieu || snap.ville || "RDC"
          });
          return;
        }
        if (act === "ask") {
          const question = q.value.trim() || `Explique la fiche ${code}`;
          const ai = InspecteurAI.ask(question, { module: code, form: snap });
          out.textContent = ai.text;
        }
      });
    }

    root.querySelectorAll("[data-act]").forEach(btn => {
      btn.addEventListener("click", () => run(btn.getAttribute("data-act")));
    });
    q.addEventListener("keydown", e => { if (e.key === "Enter") run("ask"); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
