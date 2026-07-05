const I18N = {
  fr: {
    province:"Province", ville:"Ville", commune:"Commune",
    enregistrer:"Enregistrer", analyser:"Analyser juridiquement",
    imprimer:"Imprimer A4", exporter:"Exporter PDF",
    dictée:"🎤 Dictée vocale", theme:"Thème Sombre/Clair",
    conclusion:"Conclusion", signatureInspecteur:"Signature Inspecteur",
    signatureEmployeur:"Signature Employeur", refus:"Refus de signature",
    infractionsDetectees:"Infractions détectées",
    pv:"Procès-verbaux", decision:"Décision administrative",
    date:"Date", heure:"Heure"
  },
  en: {
    province:"Province", ville:"City", commune:"Municipality",
    enregistrer:"Save", analyser:"Legal Analysis",
    imprimer:"Print A4", exporter:"Export PDF",
    dictée:"🎤 Voice Dictation", theme:"Dark/Light Mode",
    conclusion:"Conclusion", signatureInspecteur:"Inspector Signature",
    signatureEmployeur:"Employer Signature", refus:"Refusal to sign",
    infractionsDetectees:"Detected Offences",
    pv:"Reports", decision:"Administrative Decision",
    date:"Date", heure:"Time"
  },
  ln: {
    province:"Lokalo", ville:"Engumba", commune:"Komina",
    enregistrer:"Kobomba", analyser:"Kotala mibeko",
    imprimer:"Kosopa", exporter:"Kotinda PDF",
    dictée:"🎤 Kobola", theme:"Molili/Moleki",
    conclusion:"Nsuka", signatureInspecteur:"Kosapa ya Inspecteur",
    signatureEmployeur:"Kosapa ya Mobungi", refus:"Koboya kosapa",
    infractionsDetectees:"Mabé eye etalami",
    pv:"Mikanda ya mobeko", decision:"Mibeko ya administration",
    date:"Dati", heure:"Ngonga"
  },
  // Kikongo, Tshiluba, Swahili suivent le même schéma...
  kg:{province:"Lualanga",ville:"Kizunga",commune:"Kizunga",enregistrer:"Kubundika",analyser:"Kusala mambu ma minkanda",imprimer:"Kusoba",exporter:"Kutwala PDF",dictée:"🎤 Kububula",theme:"Lutila/Lutulu",conclusion:"Mfinda",signatureInspecteur:"Buzituwa bwa Muntu wa kuluta",signatureEmployeur:"Buzituwa bwa Mukundi",refus:"Kuvanga buzituwa",infractionsDetectees:"Bisono bibi",pv:"Minkanda ya mambu",decision:"Mambu ma minkanda",date:"Ditu",heure:"Ngonga"},
  ts:{province:"Ditunga",ville:"Tshiumbu",commune:"Mukanda",enregistrer:"Kupeta",analyser:"Kuleja maboko",imprimer:"Kutapa",exporter:"Kutuma PDF",dictée:"🎤 Kufika",theme:"Bisangilu/Bilelela",conclusion:"Mukanda",signatureInspecteur:"Tshitabu tshia muntu wa kuluta",signatureEmployeur:"Tshitabu tshia mukalanga",refus:"Kunanga tshitabu",infractionsDetectees:"Bifwa bia maboko",pv:"Mikanda ya maboko",decision:"Maboko a administration",date:"Dibu",heure:"Diba"},
  sw:{province:"Mkoa",ville:"Jiji",commune:"Manispaa",enregistrer:"Hifadhi",analyser:"Chambuzi cha kisheria",imprimer:"Chapisha",exporter:"Hamisha PDF",dictée:"🎤 Sauti",theme:"Giza/Mwanga",conclusion:"Hitimisho",signatureInspecteur:"Sahihi ya Mkaguzi",signatureEmployeur:"Sahihi ya Mwajiri",refus:"Kukataa kusaini",infractionsDetectees:"Makosa yaliyogunduliwa",pv:"Kurasa za ripoti",decision:"Uamuzi wa kiutawala",date:"Tarehe",heure:"Saa"}
};

const PROVINCES_RDC = [
  "Bas-Uele","Équateur","Haut-Katanga","Haut-Lomami","Haut-Uele","Ituri",
  "Kasaï","Kasaï Central","Kasaï Oriental","Kinshasa","Kongo Central",
  "Kwango","Kwilu","Lomami","Lualaba","Mai-Ndombe","Maniema",
  "Mongala","Nord-Kivu","Nord-Ubangi","Sankuru","Sud-Kivu","Sud-Ubangi",
  "Tanganyika","Tshopo","Tshuapa"
];

const VILLES_RDC = [
  "Kinshasa","Lubumbashi","Mbuji-Mayi","Kananga","Kisangani","Bukavu",
  "Tshikapa","Kolwezi","Likasi","Goma","Kikwit","Uvira","Bunia",
  "Kalemie","Mbandaka","Matadi","Kabinda","Butembo","Baraka","Mwene-Ditu"
];

const SECTEURS = [
  "Agriculture, sylviculture et pêche","Industrie extractive (Mines)",
  "Industrie manufacturière","BTP (Bâtiment et Travaux Publics)",
  "Commerce","Transport et entreposage","Hébergement et restauration",
  "Information et communication","Activités financières et d'assurance",
  "Activités immobilières","Activités spécialisées, scientifiques",
  "Administration publique","Enseignement","Santé humaine et action sociale",
  "Arts, spectacles et activités récréatives","Autres activités de services"
];
