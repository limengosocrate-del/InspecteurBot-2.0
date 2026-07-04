import { useState, useEffect, useRef } from 'react';
import {
  Scale, Search, Bot, BookOpen, Briefcase, ShieldAlert, FileText, Star,
  Printer, Volume2, VolumeX, Mic, Sun, Moon, Clock, MapPin, AlertTriangle,
  CheckCircle2, Sparkles, ArrowRight, ArrowLeft, Copy, Trash2, Send,
  FolderTree, FileCheck, Activity, Award, WifiOff, ChevronLeft, ChevronRight,
  BookMarked, User, Users, Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CODE_TRAVAIL, CATEGORIES, Article } from './data/codeTravail';
import { neuroJuris } from './data/neuroJuris';

type Tab = 'library' | 'book' | 'ai' | 'tools' | 'dashboard';
type Voice = 'female' | 'male';
type Lang = 'fr' | 'en' | 'ln' | 'kg' | 'lu' | 'sw';

const LANG_LABELS: Record<Lang, string> = {
  fr: '🇫🇷 Français', en: '🇬🇧 English', ln: '🇨🇩 Lingala',
  kg: '🇨🇩 Kikongo', lu: '🇨🇩 Tshiluba', sw: '🇨🇩 Kiswahili',
};

const UI: Record<Lang, Record<string, string>> = {
  fr: { lib: 'Bibliothèque', book: 'Mode Livre', ai: 'Assistant IA', tools: 'Outils Inspecteur', dash: 'Tableau de bord', search: 'Article 15, licenciement, salaire, congé...', prev: 'Précédent', next: 'Suivant', analyze: 'Analyser', clear: 'Effacer', listen: 'Écouter', voice: 'Voix' },
  en: { lib: 'Library', book: 'Book Mode', ai: 'AI Assistant', tools: 'Inspector Tools', dash: 'Dashboard', search: 'Article 15, dismissal, salary, leave...', prev: 'Previous', next: 'Next', analyze: 'Analyze', clear: 'Clear', listen: 'Listen', voice: 'Voice' },
  ln: { lib: 'Biblioteki', book: 'Buku', ai: 'Mosungi IA', tools: 'Bisaleli', dash: 'Etando', search: 'Mobeko 15, kolongolama, lifuta...', prev: 'Oyo eleki', next: 'Oyo elandi', analyze: 'Kotala', clear: 'Kolongola', listen: 'Koyoka', voice: 'Mongongo' },
  kg: { lib: 'Biblioteka', book: 'Nkanda', ai: 'Nsadisi IA', tools: 'Bisadulu', dash: 'Meza', search: 'Nsiku 15, kukatula, mfutu...', prev: 'Kiviokidi', next: 'Kilanda', analyze: 'Fimpa', clear: 'Katula', listen: 'Wa', voice: 'Ndinga' },
  lu: { lib: 'Biblioteke', book: 'Mukanda', ai: 'Muambuluishi IA', tools: 'Bisombelu', dash: 'Mesa', search: 'Mukatshia 15, dikumbusha, difutu...', prev: 'Wa kumpala', next: 'Wa panyima', analyze: 'Konkonona', clear: 'Umbusha', listen: 'Teleja', voice: 'Dii' },
  sw: { lib: 'Maktaba', book: 'Kitabu', ai: 'Msaidizi IA', tools: 'Zana', dash: 'Dashibodi', search: 'Kifungu 15, kufukuzwa, mshahara...', prev: 'Iliyopita', next: 'Inayofuata', analyze: 'Chambua', clear: 'Futa', listen: 'Sikiliza', voice: 'Sauti' },
};

export default function App() {
  const [tab, setTab] = useState<Tab>('library');
  const [theme, setTheme] = useState<'dark' | 'light' | 'cyber'>('dark');
  const [lang, setLang] = useState<Lang>('fr');
  const [voice, setVoice] = useState<Voice>('female');
  const [toast, setToast] = useState<{ m: string; t: 'ok' | 'err' | 'info' } | null>(null);
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Toutes');
  const [idx, setIdx] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [bookIdx, setBookIdx] = useState(0);
  const [bookFlip, setBookFlip] = useState<'next' | 'prev' | ''>('');
  const [gotoNum, setGotoNum] = useState('');

  const [aiQ, setAiQ] = useState('');
  const [aiResp, setAiResp] = useState('');
  const [aiConf, setAiConf] = useState(0);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiHistory, setAiHistory] = useState<{ q: string; a: string }[]>([]);

  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const [clock, setClock] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [dayName, setDayName] = useState('');

  const [toolTab, setToolTab] = useState<'pv' | 'fine' | 'audit'>('pv');
  const [pv, setPv] = useState({ ent: '', addr: '', boss: '', obs: '', art: '119 (Dépassement 45h/semaine)' });
  const [fine, setFine] = useState({ type: 'smig', workers: 5, recid: false });
  const [audit, setAudit] = useState({ epi: false, contrats: false, cnss: false, chsw: false, smig: false });

  const t = UI[lang];

  useEffect(() => {
    const saved = localStorage.getItem('ib_favs'); if (saved) setFavorites(JSON.parse(saved));
    const st = localStorage.getItem('ib_theme'); if (st) setTheme(st as any);
    const sl = localStorage.getItem('ib_lang'); if (sl) setLang(sl as Lang);
    const sv = localStorage.getItem('ib_voice'); if (sv) setVoice(sv as Voice);

    const loadV = () => { voicesRef.current = window.speechSynthesis?.getVoices() || []; };
    loadV();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = loadV;

    const up = () => {
      const n = new Date();
      setClock(n.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(n.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }));
      setDayName(['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][n.getDay()]);
    };
    up(); const iv = setInterval(up, 1000);
    const onOn = () => setOnline(true), onOff = () => setOnline(false);
    window.addEventListener('online', onOn); window.addEventListener('offline', onOff);
    return () => { clearInterval(iv); window.removeEventListener('online', onOn); window.removeEventListener('offline', onOff); };
  }, []);

  const notify = (m: string, tp: 'ok' | 'err' | 'info' = 'ok') => { setToast({ m, t: tp }); setTimeout(() => setToast(null), 3200); };

  const filtered = CODE_TRAVAIL.filter((a) => {
    const mc = category === 'Toutes' || a.categorie === category;
    const q = query.toLowerCase().trim();
    if (!q) return mc;
    return mc && (`${a.numero}` === q || `article ${a.numero}`.includes(q) || a.titre.toLowerCase().includes(q) || a.contenu.toLowerCase().includes(q) || a.motsCles.some((k) => k.toLowerCase().includes(q)));
  });
  const current = filtered[idx] || filtered[0] || CODE_TRAVAIL[0];
  const bookArt = CODE_TRAVAIL[bookIdx];

  const toggleFav = (a: Article) => {
    const isF = favorites.includes(a.id);
    const nf = isF ? favorites.filter((f) => f !== a.id) : [...favorites, a.id];
    setFavorites(nf); localStorage.setItem('ib_favs', JSON.stringify(nf));
    if (!isF) { confetti({ particleCount: 45, spread: 60, origin: { y: 0.8 } }); notify(`Article ${a.numero} ⭐ ajouté`); }
    else notify(`Article ${a.numero} retiré`, 'info');
  };

  // ---- Lecture vocale avec 2 voix ----
  const pickVoice = () => {
    const cands = voicesRef.current.filter((v) => v.lang.toLowerCase().startsWith(lang === 'en' ? 'en' : 'fr'));
    if (!cands.length) return null;
    const male = ['male', 'homme', 'thomas', 'paul', 'daniel', 'remi', 'henri'];
    const female = ['female', 'femme', 'amelie', 'marie', 'julie', 'celine', 'zira'];
    const hints = voice === 'male' ? male : female;
    const m = cands.find((v) => hints.some((h) => v.name.toLowerCase().includes(h)));
    if (m) return m;
    return cands.length >= 2 ? (voice === 'male' ? cands[cands.length - 1] : cands[0]) : cands[0];
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) { notify('Lecture vocale non supportée', 'err'); return; }
    if (window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); setSpeaking(false); notify('Lecture arrêtée', 'info'); return; }
    const clean = text.replace(/[#*_>`]/g, '').replace(/[📌📖💡👔👷🚨📚⚖️🏷️🌍🤖]/g, '');
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = lang === 'en' ? 'en-US' : 'fr-FR';
    u.pitch = voice === 'male' ? 0.85 : 1.2; u.rate = 0.98;
    const v = pickVoice(); if (v) u.voice = v;
    u.onstart = () => { setSpeaking(true); notify(`Lecture (voix ${voice === 'male' ? 'masculine 👨' : 'féminine 👩'})`, 'info'); };
    u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { notify('Micro non supporté', 'err'); return; }
    if (listening) return;
    const r = new SR(); r.lang = lang === 'en' ? 'en-US' : 'fr-FR';
    r.onstart = () => { setListening(true); notify('🔴 Parlez maintenant...', 'info'); };
    r.onresult = (e: any) => { const tr = e.results[0][0].transcript; setQuery(tr); setIdx(0); notify(`Reconnu : "${tr}"`); };
    r.onend = () => setListening(false); r.onerror = () => setListening(false);
    r.start();
  };

  // ---- IA hors-ligne ----
  const analyze = (q?: string) => {
    const question = q || aiQ;
    if (!question.trim()) { notify('Posez une question', 'err'); return; }
    setTab('ai'); if (q) setAiQ(q);
    setAiThinking(true); setAiResp('');
    setTimeout(() => {
      const res = neuroJuris.answer(question, lang);
      setAiResp(res.text); setAiConf(Math.round(res.confidence * 100));
      setAiHistory((p) => [{ q: question, a: res.text }, ...p].slice(0, 20));
      setAiThinking(false); notify('Analyse locale terminée ✅');
    }, 700);
  };

  // ---- Impression ----
  const printDoc = (title: string, content: string, sanction?: string | null) => {
    const w = window.open('', '_blank', 'width=850,height=950'); if (!w) return;
    w.document.write(`<html><head><title>${title}</title><style>body{font-family:'Times New Roman',serif;padding:40px;color:#000;line-height:1.6}.h{text-align:center;border-bottom:2px solid #000;padding-bottom:15px;margin-bottom:25px}.h h1{font-size:20px;text-transform:uppercase;margin:0}.t{font-size:24px;font-weight:bold;margin:20px 0;text-decoration:underline}.b{border-left:4px solid #000;padding-left:20px;margin:20px 0;font-size:17px;white-space:pre-line}.s{border:1px dashed #000;background:#f8f8f8;padding:15px;margin-top:25px}.f{margin-top:50px;border-top:1px solid #ccc;padding-top:15px;font-size:11px;text-align:center;color:#555}</style></head><body><div class="h"><h1>République Démocratique du Congo</h1><h2 style="font-weight:normal;font-size:16px">Ministère du Travail et de la Prévoyance Sociale</h2><h3>Inspection Générale du Travail — InspecteurBot RDC</h3></div><div style="text-align:right;font-size:12px">Kinshasa, le ${dateStr}</div><div class="t">${title}</div><div class="b">${content}</div>${sanction ? `<div class="s"><b>⚠️ Sanctions :</b><br>${sanction}</div>` : ''}<div class="f">InspecteurBot RDC (2026.1) — © Inspection Générale du Travail RDC.</div><script>window.onload=function(){window.print();setTimeout(function(){window.close()},400)}<\/script></body></html>`);
    w.document.close();
  };

  const turnBook = (dir: 1 | -1) => {
    let n = bookIdx + dir;
    if (n < 0) n = CODE_TRAVAIL.length - 1; if (n >= CODE_TRAVAIL.length) n = 0;
    setBookFlip(dir > 0 ? 'next' : 'prev');
    setTimeout(() => { setBookIdx(n); setBookFlip(''); }, 200);
  };
  const gotoBook = () => {
    const num = parseInt(gotoNum, 10);
    const i = CODE_TRAVAIL.findIndex((a) => a.numero === num);
    if (i === -1) { notify(`Article ${num} introuvable`, 'err'); return; }
    setBookIdx(i);
  };

  const bg = theme === 'light' ? 'bg-[#eef3ff] text-[#041c5c]' : theme === 'cyber' ? 'bg-[#020617] text-cyan-100' : 'bg-[#041c5c] text-white';
  const card = theme === 'light' ? 'from-white to-[#dde8ff]' : theme === 'cyber' ? 'from-[#0a1533] to-[#0d2b52]' : 'from-[#0a2b73] to-[#123f97]';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${bg}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-semibold text-sm border-2 ${toast.t === 'err' ? 'bg-red-600 text-white border-red-300' : 'bg-[#0a2b73] text-white border-[#FFD700]'}`}>
          {toast.t === 'err' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5 text-green-400" />}
          {toast.m}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* HEADER */}
        <header className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${card} p-6 md:p-8 border border-[#FFD700]/30 shadow-2xl mb-6`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl md:text-5xl border border-[#FFD700]/40">🇨🇩</div>
              <div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-[#FFD700] tracking-wide">CODE DU TRAVAIL RDC</h1>
                <p className="text-xs md:text-sm text-blue-300 font-medium">Inspection Générale du Travail — Loi n° 16/010 & 015-2002</p>
                <div className="inline-flex items-center gap-2 mt-1 px-3 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-[11px] font-bold border border-[#FFD700]/30">
                  <Sparkles className="w-3 h-3" /> 334 Articles • IA Hors-ligne • 6 Langues
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 bg-black/25 px-4 py-2.5 rounded-2xl border border-white/10 text-sm">
              <span className="flex items-center gap-1.5 text-[#FFD700] font-mono font-bold"><Clock className="w-4 h-4" />{clock}</span>
              <span className="w-px h-4 bg-white/20" />
              <span className="text-xs">{dayName}, {dateStr}</span>
              <span className="w-px h-4 bg-white/20" />
              <span className="flex items-center gap-1 text-green-400 text-xs"><MapPin className="w-3.5 h-3.5" />Kinshasa 30°C</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${online ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'}`}>
                <WifiOff className="w-3.5 h-3.5" /> {online ? 'En ligne (Offline prêt)' : 'HORS-LIGNE ✓'}
              </div>
              <select value={lang} onChange={(e) => { setLang(e.target.value as Lang); localStorage.setItem('ib_lang', e.target.value); notify(`Langue : ${LANG_LABELS[e.target.value as Lang]}`, 'info'); }}
                className="bg-[#082366] text-white text-xs font-semibold px-2.5 py-2 rounded-xl border border-[#FFD700]/30 outline-none cursor-pointer">
                {(Object.keys(LANG_LABELS) as Lang[]).map((l) => <option key={l} value={l}>{LANG_LABELS[l]}</option>)}
              </select>
              <button onClick={() => { const nx = theme === 'dark' ? 'light' : theme === 'light' ? 'cyber' : 'dark'; setTheme(nx); localStorage.setItem('ib_theme', nx); }}
                className="w-10 h-10 rounded-xl bg-white/10 border border-[#FFD700]/40 flex items-center justify-center hover:bg-[#FFD700] hover:text-[#041c5c] transition-all">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-[#FFD700]" /> : theme === 'light' ? <Moon className="w-5 h-5" /> : <Sparkles className="w-5 h-5 text-cyan-400" />}
              </button>
            </div>
          </div>
        </header>

        {/* VOICE SELECTOR */}
        <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
          <span className="text-xs font-bold text-[#FFD700] flex items-center gap-1.5"><Languages className="w-4 h-4" /> {t.voice} :</span>
          <div className="flex bg-black/25 rounded-xl p-1 border border-[#FFD700]/25">
            <button onClick={() => { setVoice('female'); localStorage.setItem('ib_voice', 'female'); notify('👩 Voix féminine', 'info'); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${voice === 'female' ? 'bg-[#FFD700] text-[#041c5c]' : 'text-blue-200'}`}>
              <User className="w-3.5 h-3.5" /> 👩 Féminine
            </button>
            <button onClick={() => { setVoice('male'); localStorage.setItem('ib_voice', 'male'); notify('👨 Voix masculine', 'info'); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${voice === 'male' ? 'bg-[#FFD700] text-[#041c5c]' : 'text-blue-200'}`}>
              <Users className="w-3.5 h-3.5" /> 👨 Masculine
            </button>
          </div>
        </div>

        {/* TABS */}
        <nav className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {([['library', BookOpen, t.lib], ['book', BookMarked, t.book], ['ai', Bot, t.ai], ['tools', Briefcase, t.tools], ['dashboard', Activity, t.dash]] as [Tab, any, string][]).map(([k, Icon, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${tab === k ? 'bg-[#FFD700] text-[#041c5c] scale-105' : 'bg-[#0a2b73]/80 text-white hover:bg-[#0a2b73] border border-white/10'}`}>
              <Icon className="w-5 h-5" /> {label}
              {k === 'ai' && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">HORS-LIGNE</span>}
            </button>
          ))}
        </nav>

        {/* ===== LIBRARY ===== */}
        {tab === 'library' && (
          <div className="space-y-6">
            <div className={`bg-gradient-to-r ${card} p-6 rounded-3xl border border-[#FFD700]/30 shadow-xl`}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input value={query} onChange={(e) => { setQuery(e.target.value); setIdx(0); }} placeholder={t.search}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-[#041c5c] font-medium shadow-inner outline-none border-2 border-transparent focus:border-[#FFD700]" />
                </div>
                <button onClick={startVoice} className={`px-5 py-4 rounded-2xl font-bold flex items-center gap-2 ${listening ? 'bg-red-600 text-white animate-pulse' : 'bg-[#FFD700] text-[#041c5c]'}`}>
                  <Mic className="w-5 h-5" /> {listening ? '...' : 'Vocale'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10 text-xs font-semibold">
                <span className="text-[#FFD700] flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" />Suggestions :</span>
                {['Contrat', 'Salaire', 'Congé', 'Licenciement', 'Article 119', 'Article 187', 'Article 334'].map((s) => (
                  <button key={s} onClick={() => { setQuery(s); setIdx(0); }} className="px-3 py-1.5 rounded-full bg-blue-900/60 hover:bg-[#FFD700] hover:text-[#041c5c] border border-blue-400/30">{s}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {['Toutes', ...CATEGORIES].map((c) => (
                <button key={c} onClick={() => { setCategory(c); setIdx(0); }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-2 border ${category === c ? 'bg-[#FFD700] text-[#041c5c] border-[#FFD700]' : 'bg-[#0a2b73]/60 text-blue-200 border-white/10'}`}>
                  <FolderTree className="w-3.5 h-3.5" /> {c}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 bg-gradient-to-br ${card} p-6 md:p-8 rounded-3xl border border-[#FFD700]/30 shadow-2xl`}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD700] text-[#041c5c] font-black uppercase">
                    <Scale className="w-4 h-4" /> Article {current.numero}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold border border-white/20">{current.categorie}</span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleFav(current)} className={`p-2.5 rounded-xl border ${favorites.includes(current.id) ? 'bg-[#FFD700] text-[#041c5c] border-[#FFD700]' : 'bg-white/10 border-white/20'}`}><Star className="w-4 h-4" /></button>
                    <button onClick={() => speak(`Article ${current.numero}. ${current.titre}. ${current.contenu}`)} className={`p-2.5 rounded-xl border ${speaking ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 border-white/20'}`}>{speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}</button>
                    <button onClick={() => printDoc(`Article ${current.numero} — ${current.titre}`, current.contenu, current.sanction)} className="p-2.5 rounded-xl bg-white/10 border border-white/20"><Printer className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="text-[11px] uppercase tracking-wider text-blue-300 font-bold mb-2">{current.titreSection}</div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-5">{current.titre}</h2>
                <div className="text-base md:text-lg leading-relaxed text-white/95 text-justify whitespace-pre-line mb-6 bg-black/20 p-5 rounded-2xl">{current.contenu}</div>
                {current.sanction && (
                  <div className="bg-red-950/60 border-2 border-red-500/60 rounded-2xl p-4 mb-6 flex items-start gap-3">
                    <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                    <div><h4 className="text-red-300 font-bold mb-1">⚠️ Sanction légale</h4><p className="text-red-100 text-sm">{current.sanction}</p></div>
                  </div>
                )}
                <div className="bg-blue-950/40 p-4 rounded-2xl border border-blue-400/20 mb-6">
                  <h4 className="text-blue-300 font-bold text-sm mb-3 flex items-center gap-2"><Bot className="w-4 h-4 text-[#FFD700]" /> Questions IA pour cet article :</h4>
                  <div className="flex flex-wrap gap-2">
                    {current.questionsIA.map((q, i) => (
                      <button key={i} onClick={() => analyze(q)} className="px-3.5 py-1.5 rounded-full bg-blue-900/60 text-blue-200 hover:bg-[#FFD700] hover:text-[#041c5c] text-xs border border-blue-400/30">🤖 {q}</button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button onClick={() => setIdx((p) => (p > 0 ? p - 1 : filtered.length - 1))} className="px-5 py-2.5 rounded-xl bg-blue-900/60 hover:bg-[#FFD700] hover:text-[#041c5c] text-sm font-bold flex items-center gap-2 border border-blue-400/30"><ArrowLeft className="w-4 h-4" /> {t.prev}</button>
                  <span className="text-xs text-blue-300 font-semibold">{idx + 1} / {filtered.length}</span>
                  <button onClick={() => setIdx((p) => (p < filtered.length - 1 ? p + 1 : 0))} className="px-5 py-2.5 rounded-xl bg-blue-900/60 hover:bg-[#FFD700] hover:text-[#041c5c] text-sm font-bold flex items-center gap-2 border border-blue-400/30">{t.next} <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="space-y-5">
                <div className={`bg-gradient-to-b ${card} p-5 rounded-3xl border border-[#FFD700]/30 shadow-xl`}>
                  <h3 className="text-lg font-bold text-[#FFD700] mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Liste ({filtered.length})</h3>
                  <div className="space-y-2 overflow-y-auto max-h-96 pr-1">
                    {filtered.slice(0, 60).map((a, i) => (
                      <div key={a.id} onClick={() => setIdx(i)} className={`p-3 rounded-xl cursor-pointer border ${i === idx ? 'bg-[#FFD700] text-[#041c5c] border-[#FFD700] font-bold' : 'bg-white/5 text-blue-100 border-white/10 hover:bg-white/10'}`}>
                        <span className="text-[10px] opacity-80 uppercase block">Art. {a.numero}</span>
                        <span className="text-sm truncate block">{a.titre}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#0a2b73]/80 p-5 rounded-3xl border border-[#FFD700]/30">
                  <h3 className="text-lg font-bold text-[#FFD700] mb-3 flex items-center gap-2"><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /> Favoris ({favorites.length})</h3>
                  {favorites.length === 0 ? <p className="text-xs text-blue-300 italic">Cliquez sur ⭐ pour ajouter.</p> : (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {favorites.map((fid) => { const a = CODE_TRAVAIL.find((x) => x.id === fid)!; return (
                        <div key={fid} className="p-2 rounded-lg bg-white/10 text-xs flex justify-between items-center">
                          <span className="truncate">Art. {a.numero}</span>
                          <button onClick={() => toggleFav(a)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div> ); })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== BOOK MODE ===== */}
        {tab === 'book' && (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold text-[#FFD700] flex items-center justify-center gap-2"><BookMarked className="w-6 h-6" /> {t.book} — Lecture page par page</h2>
              <p className="text-sm text-blue-300">Tournez les pages comme un vrai livre juridique. (Flèches ← → du clavier)</p>
            </div>

            <div style={{ perspective: '2500px' }} className="max-w-3xl mx-auto">
              <div className="relative min-h-[520px] rounded-[8px_20px_20px_8px] p-8 md:p-12 pl-14 md:pl-16 border-l-[14px]"
                style={{ background: 'linear-gradient(135deg,#fdfbf3,#f4efe0)', color: '#2a2317', borderLeftColor: '#6b4a1f', boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 10px 0 20px rgba(0,0,0,0.12)' }}>
                <div key={bookIdx} className="transition-all duration-500" style={{ transform: bookFlip === 'next' ? 'rotateY(-25deg)' : bookFlip === 'prev' ? 'rotateY(25deg)' : 'rotateY(0)', opacity: bookFlip ? 0.3 : 1, transformOrigin: 'left center' }}>
                  <div className="text-center text-xs font-semibold uppercase tracking-widest border-b border-dashed pb-2 mb-5" style={{ color: '#8a6d3b', borderColor: '#c9b88f' }}>{bookArt.titreSection}</div>
                  <div className="text-3xl font-extrabold mb-1" style={{ color: '#6b4a1f' }}>Article <span style={{ color: '#b8860b' }}>{bookArt.numero}</span></div>
                  <h3 className="text-xl md:text-2xl font-bold italic mb-5" style={{ color: '#3a2d15' }}>{bookArt.titre}</h3>
                  <div className="text-base md:text-[17px] leading-loose text-justify whitespace-pre-line max-h-72 overflow-y-auto pr-2" style={{ color: '#2a2317', fontFamily: 'Georgia, serif' }}>{bookArt.contenu}</div>
                  {bookArt.sanction && <div className="mt-5 p-3.5 rounded-md border-l-4 text-sm italic" style={{ background: 'rgba(180,30,30,0.06)', borderColor: '#a11', color: '#6b1a1a' }}>⚖️ Sanction : {bookArt.sanction}</div>}
                </div>
                <div className="absolute bottom-4 left-0 w-full text-center text-sm italic" style={{ color: '#8a6d3b' }}>— Page {bookIdx + 1} sur {CODE_TRAVAIL.length} —</div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto h-2 bg-[#FFD700]/15 rounded-full overflow-hidden border border-[#FFD700]/25">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((bookIdx + 1) / CODE_TRAVAIL.length) * 100}%`, background: 'linear-gradient(90deg,#b8860b,#FFD700)' }} />
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button onClick={() => turnBook(-1)} className="px-6 py-3 rounded-xl font-bold text-[#FFD700] flex items-center gap-2 shadow-lg" style={{ background: 'linear-gradient(135deg,#6b4a1f,#3a2d15)' }}><ChevronLeft className="w-5 h-5" /> {t.prev}</button>
              <button onClick={() => speak(`Article ${bookArt.numero}. ${bookArt.titre}. ${bookArt.contenu}`)} className="px-6 py-3 rounded-xl font-bold text-[#FFD700] flex items-center gap-2 shadow-lg" style={{ background: 'linear-gradient(135deg,#0a2b73,#041c5c)' }}><Volume2 className="w-5 h-5" /> {t.listen}</button>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-[#FFD700]/30">
                <label className="text-[#FFD700] font-semibold text-sm">Art.</label>
                <input type="number" min={1} max={334} value={gotoNum} onChange={(e) => setGotoNum(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && gotoBook()} className="w-16 p-1.5 rounded-lg text-center font-bold text-[#041c5c]" placeholder="N°" />
                <button onClick={gotoBook} className="px-3 py-1.5 rounded-lg bg-[#FFD700] text-[#041c5c] font-bold"><ArrowRight className="w-4 h-4" /></button>
              </div>
              <button onClick={() => turnBook(1)} className="px-6 py-3 rounded-xl font-bold text-[#FFD700] flex items-center gap-2 shadow-lg" style={{ background: 'linear-gradient(135deg,#6b4a1f,#3a2d15)' }}>{t.next} <ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        )}

        {/* ===== AI ===== */}
        {tab === 'ai' && (
          <div className={`bg-gradient-to-r ${card} p-6 md:p-8 rounded-3xl border-2 border-[#FFD700] shadow-2xl`}>
            <div className="max-w-3xl mx-auto text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD700] text-[#041c5c] font-black text-sm uppercase mb-3"><Bot className="w-4 h-4" /> NeuroJuris — IA 100% Hors-ligne</div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#FFD700] mb-2">InspecteurBot RDC — Diagnostic Juridique</h2>
              <p className="text-blue-200 text-sm">Analyse locale des 334 articles sans connexion internet. Répond en {LANG_LABELS[lang]}.</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              <textarea value={aiQ} onChange={(e) => setAiQ(e.target.value)} rows={4} placeholder="Ex : Un employeur peut-il licencier une femme enceinte ? Comment calculer le préavis ?"
                className="w-full p-5 rounded-2xl bg-white text-[#041c5c] font-medium shadow-2xl outline-none border-2 border-transparent focus:border-[#FFD700]" />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button onClick={() => setAiQ('')} className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/80 text-white font-semibold text-xs flex items-center gap-1.5"><Trash2 className="w-4 h-4" /> {t.clear}</button>
                  <button onClick={startVoice} className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#FFD700] hover:text-[#041c5c] text-white font-semibold text-xs flex items-center gap-1.5"><Mic className="w-4 h-4" /> Parler</button>
                </div>
                <button onClick={() => analyze()} disabled={aiThinking} className={`px-8 py-3.5 rounded-2xl font-extrabold flex items-center gap-2 shadow-xl ${aiThinking ? 'bg-gray-600 text-gray-300' : 'bg-[#FFD700] text-[#041c5c] hover:scale-105'}`}>
                  {aiThinking ? <Clock className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} {aiThinking ? 'Analyse...' : t.analyze}
                </button>
              </div>
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold text-[#FFD700] uppercase mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Questions fréquentes :</h4>
                <div className="flex flex-wrap gap-2">
                  {['Obligations de l\'employeur ?', 'Droits du travailleur ?', 'Calcul du préavis de licenciement ?', 'Sanctions du travail forcé ?', 'Durée du congé de maternité ?', 'Pouvoirs de l\'Inspecteur ?'].map((q, i) => (
                    <button key={i} onClick={() => analyze(q)} className="px-3.5 py-2 rounded-xl bg-blue-900/80 hover:bg-[#FFD700] hover:text-[#041c5c] text-xs font-semibold border border-blue-400/30">💡 {q}</button>
                  ))}
                </div>
              </div>
              {aiResp && (
                <div className="mt-6 p-6 rounded-3xl bg-black/40 border border-[#FFD700]/40">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                    <span className="text-lg font-bold text-[#FFD700] flex items-center gap-2"><Bot className="w-6 h-6" /> Réponse InspecteurBot</span>
                    <div className="flex gap-2">
                      <button onClick={() => speak(aiResp)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><Volume2 className="w-4 h-4" /></button>
                      <button onClick={() => { navigator.clipboard.writeText(aiResp); notify('Copié !'); }} className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><Copy className="w-4 h-4" /></button>
                      <button onClick={() => printDoc('Consultation Juridique InspecteurBot', aiResp)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20"><Printer className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="mb-3 text-xs text-blue-200">🧠 Fiabilité : <strong style={{ color: aiConf > 80 ? '#4ade80' : aiConf > 60 ? '#FFD700' : '#f87171' }}>{aiConf}%</strong> — Mode Hors-ligne</div>
                  <div className="text-white/95 text-sm md:text-base leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: aiResp.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== TOOLS ===== */}
        {tab === 'tools' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-3 bg-[#0a2b73] p-3 rounded-2xl border border-white/10">
              {([['pv', FileText, 'Procès-Verbal'], ['fine', ShieldAlert, 'Amendes & Sanctions'], ['audit', FileCheck, 'Audit Mission']] as [any, any, string][]).map(([k, Icon, l]) => (
                <button key={k} onClick={() => setToolTab(k)} className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 ${toolTab === k ? 'bg-[#FFD700] text-[#041c5c]' : 'text-blue-200 hover:bg-white/10'}`}><Icon className="w-4 h-4" /> {l}</button>
              ))}
            </div>

            {toolTab === 'pv' && (
              <div className={`bg-gradient-to-br ${card} p-6 md:p-8 rounded-3xl border border-[#FFD700]/30 shadow-2xl max-w-4xl mx-auto`}>
                <h3 className="text-2xl font-bold text-[#FFD700] mb-4 flex items-center gap-2"><FileText className="w-6 h-6" /> Générateur de Procès-Verbal (Art. 187)</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  <input value={pv.ent} onChange={(e) => setPv({ ...pv, ent: e.target.value })} placeholder="Nom de l'entreprise" className="p-3.5 rounded-xl bg-white/10 text-white border border-white/20 outline-none" />
                  <input value={pv.addr} onChange={(e) => setPv({ ...pv, addr: e.target.value })} placeholder="Adresse (Kinshasa...)" className="p-3.5 rounded-xl bg-white/10 text-white border border-white/20 outline-none" />
                  <input value={pv.boss} onChange={(e) => setPv({ ...pv, boss: e.target.value })} placeholder="Responsable / Employeur" className="p-3.5 rounded-xl bg-white/10 text-white border border-white/20 outline-none" />
                  <select value={pv.art} onChange={(e) => setPv({ ...pv, art: e.target.value })} className="p-3.5 rounded-xl bg-[#082366] text-white border border-white/20 outline-none">
                    <option>10 (Défaut de contrat écrit)</option><option>119 (Dépassement 45h/semaine)</option><option>138 (Non-respect du SMIG)</option><option>161 (Absence d'EPI)</option><option>187 (Entrave à l'Inspection)</option>
                  </select>
                </div>
                <textarea value={pv.obs} onChange={(e) => setPv({ ...pv, obs: e.target.value })} rows={4} placeholder="Constatations de l'Inspecteur sur le terrain..." className="w-full p-3.5 rounded-xl bg-white/10 text-white border border-white/20 outline-none mb-5" />
                <button onClick={() => { const c = `PROCÈS-VERBAL D'INFRACTION N° ${Math.floor(1000 + Math.random() * 9000)}/IGT/2026\n\n• ÉTABLISSEMENT : ${pv.ent || 'N/A'}\n• ADRESSE : ${pv.addr || 'Kinshasa'}\n• RESPONSABLE : ${pv.boss || 'Le Directeur'}\n• ARTICLE VIOLÉ : Article ${pv.art}\n\nCONSTATATIONS :\n"${pv.obs || 'Infraction constatée lors du contrôle.'}"`; printDoc('PROCÈS-VERBAL D\'INSPECTION — RDC', c, 'Amende applicable sous 15 jours (Art. 318).'); notify('PV généré ✅'); }}
                  className="px-8 py-3.5 rounded-xl bg-[#FFD700] text-[#041c5c] font-black flex items-center gap-2"><Printer className="w-5 h-5" /> Générer le PV Officiel</button>
              </div>
            )}

            {toolTab === 'fine' && (
              <div className={`bg-gradient-to-br ${card} p-6 md:p-8 rounded-3xl border border-[#FFD700]/30 shadow-2xl max-w-4xl mx-auto`}>
                <h3 className="text-2xl font-bold text-[#FFD700] mb-4 flex items-center gap-2"><ShieldAlert className="w-6 h-6" /> Simulateur d'Amendes (Art. 318)</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <select value={fine.type} onChange={(e) => setFine({ ...fine, type: e.target.value })} className="p-3.5 rounded-xl bg-[#082366] text-white border border-white/20 font-semibold">
                    <option value="smig">Non-respect SMIG (Art. 138)</option><option value="contrat">Défaut contrat (Art. 44)</option><option value="epi">Absence EPI (Art. 161)</option><option value="enfant">Travail enfants (Art. 3)</option><option value="entrave">Entrave Inspecteur (Art. 187)</option>
                  </select>
                  <input type="number" min={1} value={fine.workers} onChange={(e) => setFine({ ...fine, workers: parseInt(e.target.value) || 1 })} className="p-3.5 rounded-xl bg-white/10 text-white border border-white/20 font-bold" />
                  <button onClick={() => setFine({ ...fine, recid: !fine.recid })} className={`p-3.5 rounded-xl font-bold border ${fine.recid ? 'bg-red-600 text-white border-red-400' : 'bg-white/10 text-blue-200 border-white/20'}`}>{fine.recid ? '🚨 Récidive (x2)' : 'Première fois'}</button>
                </div>
                <div className="bg-black/40 p-6 rounded-2xl border-2 border-[#FFD700] flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-blue-300 font-bold uppercase">Estimation légale :</div>
                    <div className="text-3xl font-black text-[#FFD700]">{((fine.type === 'enfant' || fine.type === 'entrave' ? 2500000 : 500000) * fine.workers * (fine.recid ? 2 : 1)).toLocaleString('fr-FR')} FC</div>
                    <div className="text-sm text-red-300 mt-1 font-semibold">{fine.type === 'enfant' ? '⚠️ + Servitude pénale 1-10 ans' : fine.type === 'entrave' ? '⚠️ + Prison 3-12 mois' : '⚠️ Versement rétroactif'}</div>
                  </div>
                  <button onClick={() => printDoc('NOTE D\'AMENDE — IGT', `Infraction pour ${fine.workers} travailleur(s).\nRécidive : ${fine.recid ? 'OUI' : 'NON'}\n\nTOTAL : ${((fine.type === 'enfant' || fine.type === 'entrave' ? 2500000 : 500000) * fine.workers * (fine.recid ? 2 : 1)).toLocaleString('fr-FR')} FC`, 'Article 318 du Code du Travail RDC.')} className="px-6 py-3 rounded-xl bg-[#FFD700] text-[#041c5c] font-bold"><Printer className="w-4 h-4 inline mr-1.5" /> Imprimer</button>
                </div>
              </div>
            )}

            {toolTab === 'audit' && (
              <div className={`bg-gradient-to-br ${card} p-6 md:p-8 rounded-3xl border border-[#FFD700]/30 shadow-2xl max-w-4xl mx-auto`}>
                <h3 className="text-2xl font-bold text-[#FFD700] mb-4 flex items-center gap-2"><FileCheck className="w-6 h-6" /> Checklist d'Audit d'Inspection</h3>
                <div className="space-y-3 mb-6">
                  {([['epi', 'EPI fournis et utilisés (Art. 161)'], ['contrats', 'Contrats écrits remis (Art. 44)'], ['cnss', 'Affiliation CNSS (Art. 303)'], ['chsw', 'Comité Hygiène-Sécurité (Art. 161)'], ['smig', 'Respect du SMIG (Art. 138)']] as [keyof typeof audit, string][]).map(([k, l], i) => (
                    <div key={k} onClick={() => setAudit({ ...audit, [k]: !audit[k] })} className={`p-4 rounded-2xl cursor-pointer border flex items-center justify-between ${audit[k] ? 'bg-green-950/60 border-green-500 text-green-200 font-bold' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                      <span className="text-sm">{i + 1}. {l}</span>
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold ${audit[k] ? 'bg-green-500 text-black' : 'bg-white/20 text-transparent'}`}>✓</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/10">
                  <span className="text-sm font-semibold text-[#FFD700]">Conformité : {Object.values(audit).filter(Boolean).length}/5 ({Math.round(Object.values(audit).filter(Boolean).length / 5 * 100)}%)</span>
                  <button onClick={() => printDoc('RAPPORT D\'AUDIT — IGT', `Score : ${Object.values(audit).filter(Boolean).length}/5 (${Math.round(Object.values(audit).filter(Boolean).length / 5 * 100)}%)`)} className="px-5 py-2 rounded-xl bg-[#FFD700] text-[#041c5c] font-bold text-xs">Exporter</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== DASHBOARD ===== */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[[BookOpen, CODE_TRAVAIL.length, 'Articles', '#FFD700'], [Bot, aiHistory.length + 34, 'Analyses IA', '#22d3ee'], [Star, favorites.length, 'Favoris', '#facc15'], [Award, '100%', 'Conformité Loi', '#4ade80']].map(([Icon, val, lbl, col]: any, i) => (
                <div key={i} className={`bg-gradient-to-br ${card} p-5 rounded-3xl border border-[#FFD700]/30 text-center`}>
                  <Icon className="w-9 h-9 mx-auto mb-2" style={{ color: col }} />
                  <div className="text-3xl font-extrabold">{val}</div>
                  <div className="text-xs text-blue-200 mt-1">{lbl}</div>
                </div>
              ))}
            </div>
            <div className={`bg-gradient-to-br ${card} p-6 rounded-3xl border border-[#FFD700]/30`}>
              <h3 className="text-xl font-bold text-[#FFD700] mb-4 flex items-center gap-2"><Activity className="w-5 h-5" /> Historique IA ({aiHistory.length})</h3>
              {aiHistory.length === 0 ? <p className="text-sm text-blue-200 italic">Aucune analyse. Allez dans l'onglet Assistant IA.</p> : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {aiHistory.map((h, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-black/30 border border-white/10">
                      <div className="text-xs text-[#FFD700] font-bold mb-1">Q: "{h.q}"</div>
                      <div className="text-xs text-gray-200 line-clamp-2 whitespace-pre-line">{h.a.substring(0, 150)}...</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="mt-14 pt-8 pb-10 border-t border-white/10 text-center text-sm text-blue-300/80 space-y-3">
          <div className="text-2xl font-bold text-[#FFD700]">🇨🇩 InspecteurBot RDC — IGT 2026</div>
          <p className="max-w-xl mx-auto text-xs">Bibliothèque juridique intelligente, hors-ligne, avec IA NeuroJuris, lecture 2 voix et 6 langues pour la RDC.</p>
          <div className="text-xs text-[#FFD700] font-bold">👨‍⚖️ Développé par : Inspecteur Limengo (Pmiller) & IGT RDC</div>
          <div className="text-[11px] text-gray-400">© 2026 Inspection Générale du Travail — Ministère du Travail et de la Prévoyance Sociale RDC.</div>
        </footer>
      </div>
    </div>
  );
}
