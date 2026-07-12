/**
 * Rendu HTML fidèle du PV de Constat d'Obstruction (format A4).
 * Basé sur Art. 322 CT & Ord.-loi N°16/010 du 15/07/2016.
 * @module templates/pvObstruction
 */

export function renderObstruction(d = {}) {
  return `
  <div class="pv-page a4" id="pv-render">
    <header class="pv-entete">
      <div class="pv-logo">
        <img src="assets/img/armoirie-rdc.png" alt="RDC" class="armoirie"/>
        <div class="igt-label">I.G.T</div>
      </div>
      <div class="pv-entete-text">
        <p class="rdc">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>
        <p>Ministère de l'Emploi et Travail</p>
        <p class="bleu">${d.inspection || 'Inspection Générale du Travail'}</p>
        <p class="rouge">${d.administration || 'Administration Centrale'}</p>
        ${d.directionProvinciale ? `<p>${d.directionProvinciale}</p>` : ''}
      </div>
    </header>

    <h1 class="pv-titre">PROCÈS-VERBAL DE CONSTAT D'OBSTRUCTION</h1>
    <p class="pv-numero">${d.numero || 'N°.../METPS/IGT/IT-.../OPJ/.../____'}</p>

    <div class="pv-corps">
      <p class="indent">L'an ${d.anneeLettres || 'deux mille vingt-cinq'}, le ${d.jourLettres || '.....'} jour du mois de ${d.mois || '.....'} ;</p>

      <p class="indent">Par devant nous, <strong>${d.inspecteur || '.....'}</strong> Inspecteur du Travail et Officier de Police Judiciaire à compétence restreinte en matière du travail près l'Inspection Générale du Travail, dûment assermenté ${d.assermentation || 'à la Cour d\'Appel de Kinshasa/Gombe'}, avons été en visite d'Inspection Spéciale du Travail sous l'ordre de Mission Collectif ${d.ordreMission || '.....'} de Monsieur le Ministre National de l'Emploi et Travail au sein de la <strong>${d.entreprise || '.....'}</strong> sise sur ${d.adresse || '.....'}, Commune de ${d.commune || '.....'}, Quartier ${d.quartier || '.....'}, en date du ${d.dateControle || '.....'}.</p>

      <p class="indent">En effet, nous étions dans l'impossibilité d'accomplir la mission qui nous est dévolue par la loi et nous avons été l'objet d'une obstruction totale par le responsable de la société susmentionnée, Sieur ${d.responsable || '.....'} ${d.responsableFonction || ''} ; me référant aux dispositions de l'Ordonnance-loi N°16/010 du 15 Juillet 2016 modifiant et complétant la Loi N°015-2002 portant Code du Travail à son Article 322 et à la lettre de son Excellence Monsieur le Premier Ministre du 04 Janvier 2012, demandant à tous les employeurs le respect strict du Code du Travail et ses mesures d'application.</p>

      <p class="indent">En foi de quoi, nous avons établi ce procès-verbal de constat d'obstruction en trois ampliations dont chacune sera remise au Ministère ayant la Charge de l'Emploi et Travail, au Procureur près le Parquet de Grande Instance, ${d.parquet || 'Kinshasa/Gombe'} pour disposition et au Contrevenant.</p>

      <p class="indent">Nous jurons que ce procès-verbal est sincère.</p>
    </div>

    <div class="pv-signatures">
      <div class="sig-bloc">
        <p class="sig-titre">Contrevenant</p>
        <div class="sig-zone" data-role="contrevenant">${d.signatureContrevenant ? `<img src="${d.signatureContrevenant}" class="sig-img"/>` : ''}</div>
      </div>
      <div class="sig-bloc">
        <p class="sig-titre">L'Inspecteur du Travail</p>
        <p><strong>${d.inspecteur || ''}</strong></p>
        <p>Officier de Police Judiciaire</p>
        <div class="sig-zone" data-role="inspecteur">${d.signatureInspecteur ? `<img src="${d.signatureInspecteur}" class="sig-img"/>` : ''}</div>
        ${d.cachet ? `<img src="${d.cachet}" class="cachet" style="left:${d.cachetX||0}px;top:${d.cachetY||0}px"/>` : ''}
      </div>
    </div>

    ${d.qrCode ? `<div class="pv-qr"><img src="${d.qrCode}" alt="QR"/><span>${d.identifiantUnique || ''}</span></div>` : ''}
  </div>`;
}
