function initF02(){ initForm('F02'); }
function runIAnalysis(){
  const data = { cnss: true, enfants: 0, expat: true, contratONEM: false };
  const res = detectInfractions(data);
  alert("Analyse IA :\n" + JSON.stringify(res, null, 2));
}
