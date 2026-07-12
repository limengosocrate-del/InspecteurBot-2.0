/**
 * Rendu HTML fidèle de la Mise en Demeure (format lettre A4).
 * @module templates/miseEnDemeure
 */

export function renderMiseEnDemeure(d = {}) {
  const copies = (d.copies || []).map(c => `<li>${c}</li>`).join('');

  return `
  <div class="pv-page a4 lettre" id="pv-render">
    <p class="lettre-date">${d.lieu || 'Kinshasa'} le ${d.date || '../../....'}</p>

    <header class="pv-entete lettre-entete">
      <div class="pv-logo"><img src="assets/img/logo-igt.png" alt="IGT" class="armoirie-ronde"/></div>
      <div class="pv-entete-text">
        <p>République Démocratique du Congo</p>
        <p>Ministère de l'Emploi, Travail</p>
        <p class="bleu"><strong>INSPECTION GÉNÉRALE DU TRAVAIL</strong></p>
        ${d.directionProvinciale ? `<p>${d.directionProvinciale}</p>` : ''}
      </div>
    </header>

    <div class="lettre-cols">
      <div class="lettre-expediteur">
        <p><strong>OPJ :</strong> ${d.opj || '.....'}</p>
        <p>Inspecteur du Travail</p>
        <p>Adresse : ${d.opjAdresse || '.....'}</p>
      </div>
      <div class="lettre-copies">
        <p>Transmis copie pour Information</p>
        <ul>${copies || '<li>.....</li>'}</ul>
      </div>
    </div>

    <div class="lettre-objet-dest">
      <div class="lettre-objet">
        <p><u><em>Concerne</em></u> : <strong>${d.objet || 'MISE EN DEMEURE'}</strong></p>
        <p>${d.objetDetail || ''}</p>
        <p><strong>${d.numero || 'N°.../MET/IGT/.../____'}</strong></p>
      </div>
      <div class="lettre-destinataire">
        <p>${d.destinataire || 'Au Responsable de .....'}</p>
        <p>${d.destinataireAdresse || ''}</p>
      </div>
    </div>

    <div class="lettre-corps">
      <p>Monsieur,</p>
      <p class="indent">${d.corps || 'Je vous écris suite à notre échange concernant notre ordre de mission .....'}</p>
      <p class="indent">Ce refus de nous recevoir constitue une violation au regard des dispositions des <strong>${d.articlesReferences || 'articles 186, 187, 197'}</strong> du code du travail Congolais.</p>
      <p class="indent">Par la présente, je vous mets en demeure de donner accès libre à notre mission et de nous fournir les documents demandés dans un délai de <strong>${d.delai || '24h'}</strong>, à compter de la réception de ce courrier.</p>
      <p class="indent">Je vous rappelle qu'en l'absence de réponse ou en cas de maintien de votre refus de contrôle, je me verrai contraint de saisir la juridiction compétente ou d'appliquer les sanctions prévues dans l'arrêté N°CAB/MIN/ETPS/CNM/HMK/JBI/006/09/2023 et N°CAB/MIN/FINANCES/127/09/2023 DU 03/10/2023 portant fixation des taux des droits, taxes et redevances à percevoir à l'initiative du Ministère de l'Emploi, Travail et Prévoyance Sociale.</p>
      <p class="indent">Veuillez considérer cette lettre comme une mise en demeure formelle.</p>
      <p>Cordialement.</p>
    </div>

    <div class="lettre-signature">
      <p>Fait à ${d.lieu || 'Kinshasa'} le ${d.date || '../../....'}</p>
      <div class="sig-zone" data-role="opj">${d.signatureOpj ? `<img src="${d.signatureOpj}" class="sig-img"/>` : ''}</div>
      <p><strong>OPJ ${d.opj || '.....'}</strong></p>
      ${d.cachet ? `<img src="${d.cachet}" class="cachet" style="left:${d.cachetX||0}px;top:${d.cachetY||0}px"/>` : ''}
    </div>

    ${d.qrCode ? `<div class="pv-qr"><img src="${d.qrCode}" alt="QR"/><span>${d.identifiantUnique || ''}</span></div>` : ''}
  </div>`;
}
