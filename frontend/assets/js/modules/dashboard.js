/**
 * Tableau de bord du module PV.
 * @module modules/dashboard
 */
import store from '../core/store.js';
import { STATUTS } from './pvManager.js';

export function calculerIndicateurs() {
  const pvs = store.get('pvs');
  const archives = store.get('archives') || [];
  const entreprises = new Set(pvs.map(p => (p.entreprise || '').trim().toLowerCase()).filter(Boolean));
  const totalInfractions = pvs.reduce((s, p) => s + (p.infractions?.length || 0), 0);
  const totalAmendes = pvs.reduce((s, p) => s + (p.totalGeneral || 0), 0);

  return {
    total: pvs.length,
    enCours: pvs.filter(p => p.statut === STATUTS.EN_COURS).length,
    brouillons: pvs.filter(p => p.statut === STATUTS.BROUILLON).length,
    signes: pvs.filter(p => p.statut === STATUTS.SIGNE).length,
    transmis: pvs.filter(p => p.statut === STATUTS.TRANSMIS).length,
    archives: archives.length,
    entreprisesControlees: entreprises.size,
    totalInfractions,
    totalAmendes,
    totalAmendesAffiche: totalAmendes.toLocaleString('fr-FR') + ' $',
    derniersPV: [...pvs].sort((a,b) => new Date(b.dateCreation) - new Date(a.dateCreation)).slice(0, 5),
    activiteRecente: (store.get('journal') || []).slice(-10).reverse()
  };
}

export function renderDashboard() {
  const k = calculerIndicateurs();
  return `
  <section class="dashboard">
    <h1>Tableau de bord — Procès-Verbaux</h1>
    <div class="kpi-grid">
      ${kpi('Total PV', k.total, '📄')}
      ${kpi('En cours', k.enCours, '⏳')}
      ${kpi('Brouillons', k.brouillons, '✏️')}
      ${kpi('Signés', k.signes, '✅')}
      ${kpi('Transmis', k.transmis, '📤')}
      ${kpi('Archivés', k.archives, '🗄️')}
      ${kpi('Entreprises contrôlées', k.entreprisesControlees, '🏢')}
      ${kpi('Total infractions', k.totalInfractions, '⚖️')}
      ${kpi('Total amendes', k.totalAmendesAffiche, '💰')}
    </div>
    <div class="dash-cols">
      <div class="card">
        <h2>Derniers PV créés</h2>
        <ul class="liste-pv">
          ${k.derniersPV.map(p => `<li><a href="#editer/${p.id}">${p.numero || p.titre}</a><span class="badge ${p.statut}">${p.statut}</span></li>`).join('') || '<li>Aucun PV.</li>'}
        </ul>
      </div>
      <div class="card">
        <h2>Activité récente</h2>
        <ul class="activite">
          ${k.activiteRecente.map(a => `<li><em>${new Date(a.date).toLocaleString('fr-FR')}</em> — ${a.description}</li>`).join('') || '<li>Aucune activité.</li>'}
        </ul>
      </div>
    </div>
  </section>`;
}

const kpi = (label, val, ico) =>
  `<div class="kpi"><div class="kpi-ico">${ico}</div><div class="kpi-val">${val}</div><div class="kpi-lbl">${label}</div></div>`;
