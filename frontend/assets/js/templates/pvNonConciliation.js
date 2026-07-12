/**
 * Rendu HTML fidèle du PV de Non-Conciliation de litige individuel (A4).
 * Peut s'étendre sur plusieurs pages A4.
 * @module templates/pvNonConciliation
 */

export function renderNonConciliation(d = {}) {
  const constatItems = (d.constat || []).map(c => `<li>${c}</li>`).join('');

  return `
  <div class="pv-document" id="pv-render">

    <!-- PAGE 1 -->
    <div class="pv-page a4">
      <header class="pv-entete">
        <div class="pv-logo"><img src="assets/img/armoirie-rdc.png" alt="RDC" class="armoirie"/><div class="igt-label">I.G.T</div></div>
        <div class="pv-entete-text">
          <p class="rdc">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>
          <p>Ministère de l'Emploi et Travail</p>
          <p class="bleu">${d.inspection || 'Inspection Générale du Travail'}</p>
          <p class="rouge">${d.administration || 'Administration Centrale'}</p>
          ${d.directionProvinciale ? `<p>${d.directionProvinciale}</p>` : ''}
        </div>
      </header>

      <h1 class="pv-titre">PROCÈS-VERBAL DE NON CONCILIATION DE LITIGE INDIVIDUEL DU TRAVAIL</h1>
      <p class="pv-numero">${d.numero || 'N°.../MET/DPS/IPT1-.../.../____'}</p>

      <div class="pv-corps">
        <p class="indent">L'an ${d.anneeLettres || 'deux mil vingt-cinq'}, le ${d.jourLettres || '.....'} jour du mois de ${d.mois || '.....'}, Nous, <strong>${d.inspecteur || '.....'}</strong>, Inspecteur Principal du Travail de 1ère Classe et Officier de Police Judiciaire à compétence restreinte en matière du Travail, dûment assermenté et identifié sous les numéros ${d.numeroAssermentation || '.....'}, affecté à l'Inspection Générale du Travail.</p>

        <p class="indent">Monsieur <strong>${d.demandeur || '.....'}</strong> ${d.demandeurAdresse || ''}, demandeur d'une part, représenté par ${d.demandeurAvocat || '.....'} Avocat Conseil.</p>

        <p class="indent">La Société <strong>${d.defendeur || '.....'}</strong> ${d.defendeurAdresse || ''} ici représentée par ${d.defendeurAvocat || '.....'} Avocat Conseil, défenderesse d'autre part ;</p>

        <p class="indent">${d.faits || 'Entendons le demandeur qui déclare .....'}</p>
      </div>
    </div>

    <!-- PAGE 2 : CONSTAT & CONCLUSION -->
    <div class="pv-page a4">
      <h2 class="pv-section">I. CONSTAT DE L'INSPECTEUR DU TRAVAIL</h2>
      <p>Il découle des déclarations des parties et de l'épluchage des pièces versées au dossier, toutes considérations faites, ce qui suit :</p>
      <ul class="constat-liste">${constatItems || '<li>.....</li>'}</ul>

      <h2 class="pv-section">II. CONCLUSION</h2>
      <p class="indent">${d.conclusion || 'Eu égard à ce qui précède, l\'action de Monsieur ..... est recevable et fondée conformément aux articles 63 et 93 du Code du Travail.'}</p>
    </div>

    <!-- PAGE 3 : PROPOSITION & DÉSACCORD -->
    <div class="pv-page a4">
      <h2 class="pv-section">III. PROPOSITION</h2>
      <p class="indent">${d.proposition || 'Réintégration du demandeur en service à défaut, paiement des dommages et intérêts sur pied de l\'article 93 du Code du Travail.'}</p>

      <h2 class="pv-section">IV. DÉSACCORD DES PARTIES</h2>
      <p class="indent">Après une tentative de conciliation, les deux parties ne sont pas parvenues à concilier leurs désaccords et nous sommes plongés du fait des dispositions de l'article 302 du Code du Travail.</p>
      <p class="indent">En foi de quoi, le présent procès-verbal est dressé et signé en quatre exemplaires par les parties et nous-mêmes, dont chacune a reçu un original.</p>
      <p class="indent">Jurons que le présent Procès-Verbal est sincère.</p>

      <div class="pv-signatures trois">
        <div class="sig-bloc">
          <p class="sig-titre">Pour la partie Demanderesse</p>
          <div class="sig-zone" data-role="demandeur">${d.signatureDemandeur ? `<img src="${d.signatureDemandeur}" class="sig-img"/>` : ''}</div>
        </div>
        <div class="sig-bloc">
          <p class="sig-titre">Pour la partie Défenderesse</p>
          <div class="sig-zone" data-role="defendeur">${d.signatureDefendeur ? `<img src="${d.signatureDefendeur}" class="sig-img"/>` : ''}</div>
        </div>
      </div>
      <div class="pv-signature-centre">
        <p>L'Inspecteur Principal du Travail de 1ère Classe</p>
        <div class="sig-zone" data-role="inspecteur">${d.signatureInspecteur ? `<img src="${d.signatureInspecteur}" class="sig-img"/>` : ''}</div>
        <p><strong>${d.inspecteur || ''}</strong></p>
        <p>${d.inspecteurTitre || 'Directeur Chef de Service'}</p>
        ${d.cachet ? `<img src="${d.cachet}" class="cachet" style="left:${d.cachetX||0}px;top:${d.cachetY||0}px"/>` : ''}
      </div>

      ${d.qrCode ? `<div class="pv-qr"><img src="${d.qrCode}" alt="QR"/><span>${d.identifiantUnique || ''}</span></div>` : ''}
    </div>
  </div>`;
          }
