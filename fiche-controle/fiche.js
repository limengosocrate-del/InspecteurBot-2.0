document.addEventListener("DOMContentLoaded", function () {
    initTheme();

    renderCards();

    const lang = document.getElementById("langSwitcher");

    if (lang) {
        lang.addEventListener("change", function (e) {
            setLang(e.target.value);
        });
    }
});

const FORMS = [
  {code:'F01', title:'Contrôle de la Main d\'Œuvre', type:'F'},
  {code:'F02', title:'Contrôle de la Main d\'Œuvre Étrangère', type:'F'},
  {code:'F03', title:'Hygiène et Santé au Travail', type:'F'},
  {code:'F04', title:'Sécurité Technique dans le BTP', type:'F'},
  {code:'F05', title:'Sécurité Technique dans les Mines', type:'F'},
  {code:'F06', title:'Sécurité Technique Hauts Risques', type:'F'},
  {code:'F07', title:'Protection Sociale', type:'F'},
  {code:'S01', title:'Visite d\'Inspection Spéciale', type:'S'},
  {code:'S02', title:'Contre-Enquête', type:'S'},
  {code:'S03', title:'Administration et Finance', type:'S'}
];

function renderCards(){

    console.log("renderCards lancé");

    const grid = document.querySelector(".grid");

    if(!grid){
        console.log("Grid introuvable");
        return;
    }

    grid.innerHTML = "";

    FORMS.forEach(f=>{
      
function renderCards(){
  const grid = $('.grid');
  FORMS.forEach(f=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML=`
      <span class="badge">${f.code}</span>
      <h3>${f.title}</h3>
      <p>Formulaire officiel de l'Inspection Générale du Travail RDC. Remplissage numérique, analyse IA et signature électronique.</p>
    `;
    card.onclick = ()=> location.href = `./${f.code}/${f.code}.html`;
    grid.appendChild(card);
  });
}
