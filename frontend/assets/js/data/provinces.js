/**
 * Base de données des 26 Provinces de la RDC
 * et leurs Directions Provinciales correspondantes.
 * @module data/provinces
 */

export const PROVINCES = [
  { id: "kinshasa",        nom: "Kinshasa",        direction: "Direction Provinciale de Kinshasa" },
  { id: "kongo-central",   nom: "Kongo Central",   direction: "Direction Provinciale du Kongo Central" },
  { id: "kwango",          nom: "Kwango",          direction: "Direction Provinciale du Kwango" },
  { id: "kwilu",           nom: "Kwilu",           direction: "Direction Provinciale du Kwilu" },
  { id: "mai-ndombe",      nom: "Mai-Ndombe",      direction: "Direction Provinciale du Mai-Ndombe" },
  { id: "kasai",           nom: "Kasaï",           direction: "Direction Provinciale du Kasaï" },
  { id: "kasai-central",   nom: "Kasaï Central",   direction: "Direction Provinciale du Kasaï Central" },
  { id: "kasai-oriental",  nom: "Kasaï Oriental",  direction: "Direction Provinciale du Kasaï Oriental" },
  { id: "lomami",          nom: "Lomami",          direction: "Direction Provinciale de la Lomami" },
  { id: "sankuru",         nom: "Sankuru",         direction: "Direction Provinciale du Sankuru" },
  { id: "maniema",         nom: "Maniema",         direction: "Direction Provinciale du Maniema" },
  { id: "sud-kivu",        nom: "Sud-Kivu",        direction: "Direction Provinciale du Sud-Kivu" },
  { id: "nord-kivu",       nom: "Nord-Kivu",       direction: "Direction Provinciale du Nord-Kivu" },
  { id: "ituri",           nom: "Ituri",           direction: "Direction Provinciale de l'Ituri" },
  { id: "haut-uele",       nom: "Haut-Uélé",       direction: "Direction Provinciale du Haut-Uélé" },
  { id: "bas-uele",        nom: "Bas-Uélé",        direction: "Direction Provinciale du Bas-Uélé" },
  { id: "tshopo",          nom: "Tshopo",          direction: "Direction Provinciale de la Tshopo" },
  { id: "mongala",         nom: "Mongala",         direction: "Direction Provinciale de la Mongala" },
  { id: "nord-ubangi",     nom: "Nord-Ubangi",     direction: "Direction Provinciale du Nord-Ubangi" },
  { id: "sud-ubangi",      nom: "Sud-Ubangi",      direction: "Direction Provinciale du Sud-Ubangi" },
  { id: "equateur",        nom: "Équateur",        direction: "Direction Provinciale de l'Équateur" },
  { id: "tanganyika",      nom: "Tanganyika",      direction: "Direction Provinciale du Tanganyika" },
  { id: "haut-lomami",     nom: "Haut-Lomami",     direction: "Direction Provinciale du Haut-Lomami" },
  { id: "lualaba",         nom: "Lualaba",         direction: "Direction Provinciale du Lualaba" },
  { id: "haut-katanga",    nom: "Haut-Katanga",    direction: "Direction Provinciale du Haut-Katanga" },
  { id: "tshuapa",         nom: "Tshuapa",         direction: "Direction Provinciale de la Tshuapa" }
];

/** En-tête administratif fixe */
export const ENTETE_FIXE = {
  republique: "RÉPUBLIQUE DÉMOCRATIQUE DU CONGO",
  ministere: "Ministère de l'Emploi et Travail",
  administrations: [
    "Administration Centrale",
    "Administration Provinciale"
  ],
  structures: [
    "Inspection Générale du Travail",
    "Inspection Provinciale du Travail",
    "Inspection Urbaine du Travail"
  ]
};

/**
 * Retourne la Direction Provinciale liée à une province.
 * @param {string} provinceId
 * @returns {string|null}
 */
export function getDirectionByProvince(provinceId) {
  const p = PROVINCES.find(x => x.id === provinceId);
  return p ? p.direction : null;
}

/** Liste triée pour les listes déroulantes */
export function getProvincesForSelect() {
  return [...PROVINCES].sort((a, b) => a.nom.localeCompare(b.nom));
    }
