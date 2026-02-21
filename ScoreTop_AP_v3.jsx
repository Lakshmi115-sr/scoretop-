import { useState, useEffect, useRef, useCallback } from "react";

const SUBJECTS = [
  { id: "maths",   name: "Mathematics",         icon: "📐", color: "#E63946", light: "#E6394610" },
  { id: "science", name: "Physical Science",    icon: "⚗️", color: "#2196F3", light: "#2196F310" },
  { id: "biology", name: "Biological Science",  icon: "🌿", color: "#4CAF50", light: "#4CAF5010" },
  { id: "social",  name: "Social Studies",      icon: "🗺️", color: "#FF9800", light: "#FF980010" },
  { id: "telugu",  name: "Telugu",              icon: "తె", color: "#9C27B0", light: "#9C27B010" },
  { id: "hindi",   name: "Hindi",               icon: "हि", color: "#00BCD4", light: "#00BCD410" },
  { id: "english", name: "English",             icon: "📖", color: "#F44336", light: "#F4433610" },
];

const TOPICS = {
  maths:   ["Real Numbers","Polynomials","Pair of Linear Equations","Quadratic Equations","Progressions","Coordinate Geometry","Triangles","Similar Triangles","Tangents & Secants","Mensuration","Trigonometry","Applications of Trigonometry","Probability","Statistics"],
  science: ["Heat","Acids Bases Salts","Chemical Reactions","Reflection of Light","Refraction of Light","Human Eye","Structure of Atom","Classification of Elements","Chemical Bonding","Electric Current","Electromagnetism","Metallurgy","Carbon & Its Compounds"],
  biology: ["Nutrition","Respiration","Transportation","Excretion","Control & Coordination","Reproduction","Heredity","Our Environment","Natural Resources","Adaptations in Ecosystems","Coordination in Life"],
  social:  ["French Revolution","Industrial Revolution","Nationalism in India","World Between Two Wars","Independent India","Contemporary World","India Relief Features","Climate of India","Agriculture","Industries","Transport & Communication","Indian Constitution","Central Government","State Government","Local Self Government","Democracy Challenges","Money & Banking","Consumer Rights"],
  telugu:  ["పద్య భాగం","గద్య భాగం","నాటకాలు","కథలు","వ్యాకరణం – సంధులు","వ్యాకరణం – సమాసాలు","అలంకారాలు","ఛందస్సు","వ్యాసాలు","లేఖలు","అనువాదం"],
  hindi:   ["गद्य पाठ","पद्य पाठ","कहानी","नाटक","व्याकरण – संधि","व्याकरण – समास","अलंकार","निबंध","पत्र लेखन","मुहावरे"],
  english: ["Prose","Poetry","Grammar – Tenses","Grammar – Voice","Grammar – Reported Speech","Reading Comprehension","Letter Writing","Essay Writing","Vocabulary","Editing Skills"],
};

// Quick assessment questions per subject (5 MCQs to get initial score)
const QUICK_QUIZ = {
  maths: [
    { q: "HCF of 12 and 18 is?", opts: ["2","3","6","9"], ans: 2 },
    { q: "Roots of x² - 5x + 6 = 0 are?", opts: ["1,6","2,3","3,4","2,4"], ans: 1 },
    { q: "Sum of first 10 natural numbers?", opts: ["45","50","55","60"], ans: 2 },
    { q: "sin 30° = ?", opts: ["1","√3/2","1/2","0"], ans: 2 },
    { q: "Area of circle with radius 7cm? (π=22/7)", opts: ["44cm²","154cm²","132cm²","88cm²"], ans: 1 },
  ],
  science: [
    { q: "pH of pure water is?", opts: ["0","7","14","5"], ans: 1 },
    { q: "Unit of electric resistance?", opts: ["Volt","Ampere","Ohm","Watt"], ans: 2 },
    { q: "Formula of water?", opts: ["H₂O₂","HO","H₂O","H₃O"], ans: 2 },
    { q: "Convex lens is also called?", opts: ["Diverging lens","Converging lens","Plain lens","None"], ans: 1 },
    { q: "Which gas is released in photosynthesis?", opts: ["CO₂","N₂","O₂","H₂"], ans: 2 },
  ],
  biology: [
    { q: "Where does photosynthesis occur?", opts: ["Root","Stem","Chloroplast","Mitochondria"], ans: 2 },
    { q: "How many chambers in human heart?", opts: ["2","3","4","5"], ans: 2 },
    { q: "Which organ filters blood?", opts: ["Liver","Kidney","Lung","Heart"], ans: 1 },
    { q: "DNA stands for?", opts: ["Deoxyribonucleic Acid","Diribonucleic Acid","Deoxyribose Acid","None"], ans: 0 },
    { q: "What is the basic unit of life?", opts: ["Tissue","Organ","Cell","Atom"], ans: 2 },
  ],
  social: [
    { q: "French Revolution year?", opts: ["1776","1789","1812","1848"], ans: 1 },
    { q: "Who wrote Indian Constitution?", opts: ["Gandhi","Nehru","Ambedkar","Bose"], ans: 2 },
    { q: "Largest state of India by area?", opts: ["UP","MP","Rajasthan","Maharashtra"], ans: 2 },
    { q: "India became independent in?", opts: ["1945","1946","1947","1948"], ans: 2 },
    { q: "Capital of Andhra Pradesh?", opts: ["Hyderabad","Amaravati","Vijayawada","Visakhapatnam"], ans: 1 },
  ],
  telugu: [
    { q: "అ + ఆ = ? (సవర్ణదీర్ఘ సంధి)", opts: ["అ","ఆ","ఇ","ఈ"], ans: 1 },
    { q: "రామాయణం రచయిత ఎవరు?", opts: ["వ్యాసుడు","వాల్మీకి","కాళిదాసు","తులసీదాసు"], ans: 1 },
    { q: "తెలుగు లిపి ఎక్కడ నుండి వచ్చింది?", opts: ["సంస్కృతం","బ్రాహ్మీ","తమిళం","కన్నడ"], ans: 1 },
    { q: "సమాసం అంటే?", opts: ["పదాలు కలపడం","పదాలు విడగొట్టడం","అలంకారం","ఛందస్సు"], ans: 0 },
    { q: "లేఖలో తప్పనిసరిగా రాయాల్సింది?", opts: ["కవిత","తేదీ","గీతం","కథ"], ans: 1 },
  ],
  hindi: [
    { q: "संधि का अर्थ क्या है?", opts: ["मेल","विराम","विभाजन","रचना"], ans: 0 },
    { q: "हिंदी की लिपि कौन सी है?", opts: ["रोमन","देवनागरी","गुरुमुखी","बांग्ला"], ans: 1 },
    { q: "रामायण के रचयिता कौन हैं?", opts: ["वेदव्यास","वाल्मीकि","कालिदास","तुलसीदास"], ans: 1 },
    { q: "'पत्र' में सबसे पहले क्या लिखते हैं?", opts: ["विषय","दिनांक","पता","नाम"], ans: 2 },
    { q: "क्रिया किसे कहते हैं?", opts: ["काम का नाम","वस्तु का नाम","गुण","स्थान"], ans: 0 },
  ],
  english: [
    { q: "Passive voice of 'She writes a letter'?", opts: ["A letter is written by her","A letter was written","She is writing","Letter is wrote"], ans: 0 },
    { q: "Past tense of 'go' is?", opts: ["goed","goes","went","gone"], ans: 2 },
    { q: "Synonym of 'happy' is?", opts: ["sad","angry","joyful","tired"], ans: 2 },
    { q: "A formal letter must have?", opts: ["Poem","Subject line","Story","Song"], ans: 1 },
    { q: "Reported speech: He said 'I am fine'. Answer?", opts: ["He said he is fine","He said he was fine","He says I am fine","He told I am fine"], ans: 1 },
  ],
};

const SYSTEM_PROMPT = `You are ScoreTop AI — an expert tutor for Andhra Pradesh 10th class board exam (AP SSC) 2026.
Your goal: help students pass with minimum marks guaranteed and guide toppers to full score.
Curriculum: AP State Board SSC 2026. Subjects: Maths, Physical Science, Biological Science, Social Studies, Telugu, Hindi, English.
Tone: warm, encouraging, like an elder sibling. Use simple Telugu occasionally.
Be concise and exam-focused. Mention marks and AP board question patterns.
AP SSC pass mark: 35 out of 100 per subject.`;

async function askClaude(messages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: SYSTEM_PROMPT, messages }),
  });
  if (!res.ok) throw new Error("API error " + res.status);
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#F0F4FF;--card:#fff;--border:#E2E8F8;--border2:#CBD5F0;
  --blue:#2563EB;--dblue:#1E40AF;--green:#16A34A;--red:#DC2626;
  --orange:#EA580C;--text:#1E293B;--text2:#475569;--muted:#94A3B8;
  --sh:0 2px 12px #2563EB14;--sh2:0 4px 24px #2563EB1E;
}
body{font-family:'Nunito',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);position:relative}
.bg-dec{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.dc{position:absolute;border-radius:50%;opacity:.06}
.dc1{width:280px;height:280px;background:#2563EB;top:-80px;right:-60px}
.dc2{width:220px;height:220px;background:#E63946;bottom:-50px;left:-50px}
.dc3{width:160px;height:160px;background:#16A34A;top:45%;right:-40px}
.screen{position:relative;z-index:1;min-height:100vh;padding:0 0 100px;animation:fu .3s ease}
@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* WAVE */
.wh{background:linear-gradient(135deg,#1E40AF 0%,#2563EB 60%,#3B82F6 100%);
  padding:26px 20px 42px;position:relative;overflow:hidden}
.wh::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:32px;
  background:var(--bg);clip-path:ellipse(55% 100% at 50% 100%)}
.logo{font-family:'Baloo 2',cursive;font-size:26px;font-weight:900;color:#fff;letter-spacing:-.5px}
.logo-s{font-size:11px;letter-spacing:2px;color:rgba(255,255,255,.7);text-transform:uppercase;margin-top:2px}
.logo-t{margin-top:12px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);
  border-radius:20px;padding:6px 14px;font-size:12px;font-weight:800;color:#fff;display:inline-block}

/* PAGE HEADER */
.ph{padding:22px 18px 30px;position:relative;overflow:hidden}
.ph::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:24px;
  background:var(--bg);clip-path:ellipse(60% 100% at 50% 100%)}
.ph-row{display:flex;align-items:center;gap:12px;position:relative;z-index:1}
.back{background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.35);border-radius:11px;
  width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;
  font-size:18px;color:#fff;flex-shrink:0;font-family:inherit;transition:all .2s}
.back:active{transform:scale(.92)}
.ph-title{font-family:'Baloo 2',cursive;font-size:18px;font-weight:800;color:#fff}
.ph-sub{font-size:11px;color:rgba(255,255,255,.7);margin-top:1px}

/* CARDS */
.card{background:var(--card);border:1.5px solid var(--border);border-radius:18px;padding:18px;margin-bottom:14px;box-shadow:var(--sh)}
.ct{font-family:'Baloo 2',cursive;font-size:16px;font-weight:800;margin-bottom:12px;color:var(--text)}
.pad{padding:0 18px}
.sec{font-size:11px;font-weight:800;letter-spacing:1.5px;color:var(--muted);text-transform:uppercase;margin-bottom:10px}

/* INPUTS */
input,textarea,select{width:100%;background:#F8FAFF;border:1.5px solid var(--border2);border-radius:13px;
  padding:13px 16px;color:var(--text);font-family:'Nunito',sans-serif;font-size:14px;font-weight:600;
  outline:none;margin-bottom:10px;transition:all .2s}
input::placeholder,textarea::placeholder{color:var(--muted);font-weight:500}
input:focus,textarea:focus{border-color:var(--blue);box-shadow:0 0 0 3px #2563EB18;background:#fff}
textarea{min-height:88px;resize:none}

/* BUTTONS */
.btn{width:100%;padding:15px;border-radius:14px;border:none;font-family:'Nunito',sans-serif;
  font-size:15px;font-weight:800;cursor:pointer;transition:all .2s;margin-bottom:10px}
.btn:active{transform:scale(.97)}
.btn-p{background:linear-gradient(135deg,#1E40AF,#2563EB);color:#fff;box-shadow:0 6px 22px #2563EB40}
.btn-s{background:linear-gradient(135deg,#15803D,#16A34A);color:#fff;box-shadow:0 6px 22px #16A34A40}
.btn-g{background:#F1F5FF;color:#2563EB;border:1.5px solid #BFDBFE}
.btn-o{background:linear-gradient(135deg,#C2410C,#EA580C);color:#fff;box-shadow:0 6px 22px #EA580C40}
.btn-sm{padding:9px 16px;font-size:13px;width:auto;display:inline-flex;align-items:center;gap:5px;margin-bottom:0}

/* BADGES */
.b{display:inline-flex;align-items:center;gap:4px;padding:4px 11px;border-radius:20px;font-size:12px;font-weight:800}
.b-bl{background:#DBEAFE;color:#1D4ED8;border:1px solid #93C5FD}
.b-gr{background:#DCFCE7;color:#15803D;border:1px solid #86EFAC}
.b-re{background:#FEE2E2;color:#DC2626;border:1px solid #FCA5A5}
.b-or{background:#FED7AA;color:#C2410C;border:1px solid #FDBA74}
.b-wh{background:rgba(255,255,255,.2);color:#fff;border:1px solid rgba(255,255,255,.35)}
.b-gy{background:#F1F5F9;color:#64748B;border:1px solid #CBD5E1}

/* SUBJECT GRID */
.sg{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 18px 14px}
.sc2{background:var(--card);border:2px solid var(--border);border-radius:18px;padding:16px 10px;
  text-align:center;cursor:pointer;transition:all .25s;box-shadow:var(--sh)}
.sc2:active{transform:scale(.96)}
.si{font-size:28px;display:block;margin-bottom:5px}
.sn{font-size:12px;font-weight:800;color:var(--text)}
.sp2{font-size:13px;font-weight:900;margin-top:3px}
.pbar{height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-top:7px}
.pf{height:100%;border-radius:3px;transition:width 1s ease}

/* NOT TESTED BADGE */
.no-test{font-size:11px;font-weight:800;color:#64748B;background:#F1F5F9;
  border:1px solid #CBD5E1;border-radius:8px;padding:2px 8px;margin-top:4px;display:inline-block}

/* TOPIC ROW */
.tr{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;
  background:var(--card);border:1.5px solid var(--border);border-radius:14px;margin-bottom:8px;
  cursor:pointer;transition:all .2s;box-shadow:var(--sh)}
.tr:active{background:#EFF6FF;border-color:#93C5FD}
.tr.done{border-color:#86EFAC;background:#F0FDF4}
.tl{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:700;color:var(--text)}
.trr{font-size:12px;font-weight:800;color:var(--muted)}

/* CHAT */
.cl{display:flex;flex-direction:column;gap:12px;padding:16px 18px}
.br{display:flex;gap:10px;align-items:flex-start;animation:fu .35s ease}
.br.u{flex-direction:row-reverse}
.av{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;box-shadow:var(--sh)}
.av.ai{background:linear-gradient(135deg,#1E40AF,#2563EB)}
.av.u{background:linear-gradient(135deg,#15803D,#22C55E)}
.bb{max-width:82%;padding:13px 16px;border-radius:18px;font-size:14px;line-height:1.7;word-break:break-word;box-shadow:var(--sh)}
.bb.ai{background:#fff;border:1.5px solid var(--border);border-radius:0 18px 18px 18px;color:var(--text)}
.bb.u{background:linear-gradient(135deg,#2563EB,#3B82F6);color:#fff;font-weight:700;border-radius:18px 0 18px 18px}
.td{display:inline-flex;gap:5px;padding:6px 2px;align-items:center}
.dot{width:8px;height:8px;border-radius:50%;background:#2563EB;animation:bo .9s ease infinite}
.dot:nth-child(2){animation-delay:.18s}.dot:nth-child(3){animation-delay:.36s}
@keyframes bo{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-9px);opacity:1}}
.cia{padding:10px 18px;background:var(--bg);border-top:1px solid var(--border);position:sticky;bottom:68px}
.cir{display:flex;gap:8px}
.cir input{flex:1;margin-bottom:0;background:#fff}
.sb{width:48px;height:48px;background:linear-gradient(135deg,#1E40AF,#2563EB);border:none;
  border-radius:13px;font-size:20px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;
  justify-content:center;box-shadow:0 4px 16px #2563EB40;transition:all .2s}
.sb:active{transform:scale(.93)}
.sb:disabled{opacity:.4;cursor:not-allowed}

/* PILLS */
.pw{padding:12px 18px 0;overflow-x:auto;white-space:nowrap;padding-bottom:4px}
.pill{background:#fff;border:1.5px solid var(--border2);border-radius:20px;padding:6px 14px;
  font-size:12px;font-weight:700;cursor:pointer;display:inline-block;margin:3px;color:var(--text2);transition:all .2s}
.pill:active{border-color:var(--blue);background:#DBEAFE;color:#1D4ED8}

/* NAV */
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;
  background:#fff;border-top:1.5px solid var(--border);display:flex;z-index:100;box-shadow:0 -4px 20px #2563EB15}
.nb{flex:1;padding:11px 4px;text-align:center;cursor:pointer;border:none;background:none;
  color:var(--muted);transition:all .2s;font-family:'Nunito',sans-serif}
.nb.active{color:var(--blue)}
.ni{font-size:21px;display:block}
.nl{font-size:10px;font-weight:800;letter-spacing:.5px;margin-top:1px}

/* STATS */
.sts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}
.st{background:var(--card);border:1.5px solid var(--border);border-radius:13px;padding:11px 6px;text-align:center;box-shadow:var(--sh)}
.stn{font-family:'Baloo 2',cursive;font-size:22px;font-weight:900}
.stl{font-size:10px;color:var(--muted);font-weight:700;margin-top:1px}

/* RANK */
.rk{text-align:center;padding:22px;border-radius:22px;margin-bottom:14px;box-shadow:var(--sh2)}
.re{font-size:52px}
.rn{font-family:'Baloo 2',cursive;font-size:22px;font-weight:900;margin-top:8px}
.rd{font-size:13px;color:var(--text2);margin-top:4px;line-height:1.6;font-weight:600}
.rw{display:flex;justify-content:center;margin:14px 0}
.rb{position:relative;width:128px;height:128px}
.rb svg{transform:rotate(-90deg)}
.rc{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
.rpct{font-family:'Baloo 2',cursive;font-size:27px;font-weight:900}
.rl{font-size:10px;color:var(--muted);letter-spacing:1px;font-weight:700}

/* BOXES */
.abox{background:#FEF2F2;border:1.5px solid #FECACA;border-radius:13px;padding:11px 16px;font-size:13px;font-weight:700;color:#DC2626;margin-bottom:12px}
.sbox{background:#F0FDF4;border:1.5px solid #86EFAC;border-radius:13px;padding:11px 16px;font-size:13px;font-weight:700;color:#16A34A;margin-bottom:12px}
.ibox{background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:13px;padding:11px 16px;font-size:13px;font-weight:700;color:#1D4ED8;margin-bottom:12px;line-height:1.7}
.ybox{background:#FEFCE8;border:1.5px solid #FDE68A;border-radius:13px;padding:11px 16px;font-size:13px;font-weight:700;color:#92400E;margin-bottom:12px}

/* QUIZ */
.qz-q{font-size:16px;font-weight:800;color:var(--text);margin-bottom:16px;line-height:1.5;text-align:center}
.qz-opt{display:block;width:100%;text-align:left;background:#F8FAFF;border:2px solid var(--border2);
  border-radius:13px;padding:13px 16px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;
  cursor:pointer;margin-bottom:10px;transition:all .2s;color:var(--text)}
.qz-opt:active{transform:scale(.98)}
.qz-opt.correct{background:#DCFCE7;border-color:#16A34A;color:#15803D}
.qz-opt.wrong{background:#FEE2E2;border-color:#DC2626;color:#DC2626}
.qz-opt.disabled{pointer-events:none;opacity:.7}
.qz-prog{height:6px;background:var(--border);border-radius:3px;margin-bottom:20px;overflow:hidden}
.qz-pf{height:100%;background:linear-gradient(90deg,#2563EB,#3B82F6);border-radius:3px;transition:width .4s ease}

/* EXAM */
.timer{background:linear-gradient(135deg,#FEF3C7,#FDE68A);border:1.5px solid #FCD34D;
  border-radius:13px;padding:11px;text-align:center;font-size:22px;font-weight:900;
  color:#92400E;margin-bottom:14px;font-family:'Baloo 2',cursive}
.timer.urgent{background:linear-gradient(135deg,#FEE2E2,#FECACA);border-color:#FCA5A5;
  color:#991B1B;animation:pulse .5s infinite}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.015)}}
.qc{background:var(--card);border:1.5px solid var(--border);border-radius:18px;padding:18px;margin-bottom:14px;box-shadow:var(--sh)}
.qm{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.qnum{font-size:11px;font-weight:900;letter-spacing:1.5px;color:var(--blue);text-transform:uppercase}
.qmk{background:#DBEAFE;border:1px solid #93C5FD;border-radius:8px;padding:3px 10px;font-size:12px;font-weight:800;color:#1D4ED8}
.qt{font-size:14px;font-weight:700;line-height:1.65;margin-bottom:12px;color:var(--text)}
.ai-ev{background:#EFF6FF;border:1.5px solid #93C5FD;border-radius:13px;padding:14px;font-size:13px;line-height:1.75;color:var(--text);margin-top:10px}
.ai-ev-t{font-size:11px;font-weight:900;letter-spacing:1px;color:#1D4ED8;margin-bottom:7px;text-transform:uppercase}

/* STEPS */
.steps{display:flex;justify-content:center;gap:6px;margin-bottom:20px;padding-top:16px}
.sd{width:8px;height:8px;border-radius:50%;background:var(--border2);transition:all .3s}
.sd.active{background:var(--blue);width:22px;border-radius:4px}

.choice{display:block;width:100%;text-align:left;background:#F8FAFF;border:1.5px solid var(--border2);
  border-radius:13px;padding:13px 16px;color:var(--text);font-family:'Nunito',sans-serif;
  font-size:14px;font-weight:700;cursor:pointer;margin-bottom:9px;transition:all .2s}
.choice.sel{background:#DBEAFE;border-color:var(--blue);color:#1D4ED8}

.toast{position:fixed;top:18px;left:50%;transform:translateX(-50%);background:#1E293B;
  border-radius:14px;padding:12px 22px;font-size:14px;font-weight:800;color:#fff;z-index:9999;
  box-shadow:0 8px 30px #00000025;white-space:nowrap;animation:tin .3s ease}
@keyframes tin{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

.sp{display:flex;align-items:center;gap:12px;background:var(--card);border-radius:14px;padding:12px 14px;margin-bottom:8px;box-shadow:var(--sh)}
.spi{flex:1}
.spn{font-size:14px;font-weight:800}
.spm{font-size:11px;color:var(--muted);margin-top:2px;font-weight:700}
.spp{font-size:15px;font-weight:900;min-width:40px;text-align:right}
.aip{background:linear-gradient(135deg,#EFF6FF,#F0FDF4);border:1.5px solid #BFDBFE;border-radius:18px;padding:18px;margin-bottom:14px;box-shadow:var(--sh)}
.aip p{font-size:13px;line-height:2;color:var(--text2);font-weight:600}
.aip strong{color:var(--text);font-weight:800}

::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#93C5FD;border-radius:4px}
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function useLS(key, init) {
  const [v, sv] = useState(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; } });
  const set = useCallback(x => { sv(x); try { localStorage.setItem(key, JSON.stringify(x)); } catch {} }, [key]);
  return [v, set];
}

function getRank(avg, tested) {
  if (!tested) return { emoji:"❓", name:"NOT TESTED YET", desc:"Take a quick quiz first to know your real level!", color:"#64748B", bg:"#F1F5F9" };
  if (avg >= 90) return { emoji:"🏆", name:"TOPPER",      desc:"Outstanding! You are on track for full marks!", color:"#1D4ED8", bg:"#DBEAFE" };
  if (avg >= 75) return { emoji:"⭐", name:"DISTINCTION",  desc:"Excellent! Push a little harder to reach the top.", color:"#15803D", bg:"#DCFCE7" };
  if (avg >= 60) return { emoji:"👍", name:"FIRST CLASS",  desc:"Great! Focus on weak subjects for distinction.", color:"#0F766E", bg:"#CCFBF1" };
  if (avg >= 45) return { emoji:"📚", name:"PASS CLASS",   desc:"Safe! Regular study will push you to First Class.", color:"#B45309", bg:"#FEF3C7" };
  if (avg >= 35) return { emoji:"✅", name:"JUST PASS",    desc:"You'll pass! Study daily to improve your grade.", color:"#16A34A", bg:"#DCFCE7" };
  return             { emoji:"⚡", name:"NEEDS FOCUS",  desc:"Study 2-3 hrs daily. Pass is 100% achievable! 💪", color:"#DC2626", bg:"#FEE2E2" };
}
const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

// ── QUICK QUIZ COMPONENT ──────────────────────────────────────────────────────
function QuickQuiz({ subject, onDone }) {
  const qs = QUICK_QUIZ[subject.id] || [];
  const [curr, setCurr] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState([]);

  const handleOpt = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === qs[curr].ans;
    if (correct) setScore(s => s + 1);
    setResults(r => [...r, { q: qs[curr].q, selected: idx, correct, correctAns: qs[curr].ans, opts: qs[curr].opts }]);
    setTimeout(() => {
      if (curr + 1 >= qs.length) setDone(true);
      else { setCurr(c => c + 1); setSelected(null); setAnswered(false); }
    }, 900);
  };

  if (done) {
    const pct = Math.round((score / qs.length) * 100);
    // Map quiz score to subject score (out of 100, scaled)
    const subjectScore = Math.max(20, Math.min(95, pct + Math.floor(Math.random() * 10)));
    return (
      <div style={{ padding: "24px 18px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 52 }}>{pct >= 60 ? "🎉" : pct >= 40 ? "📚" : "⚡"}</div>
          <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 22, fontWeight: 900, marginTop: 10, color: "var(--text)" }}>
            Quiz Complete!
          </div>
          <div style={{ fontSize: 14, color: "var(--text2)", marginTop: 4, fontWeight: 600 }}>
            You scored {score}/{qs.length} in {subject.name}
          </div>
        </div>

        <div className="card" style={{ textAlign: "center", background: pct >= 60 ? "linear-gradient(135deg,#F0FDF4,#DCFCE7)" : "linear-gradient(135deg,#FEF2F2,#FEE2E2)" }}>
          <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 44, fontWeight: 900, color: pct >= 60 ? "#16A34A" : "#DC2626" }}>
            {subjectScore}%
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 700, marginTop: 4 }}>
            Estimated knowledge level in {subject.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, fontWeight: 600 }}>
            Based on {qs.length} diagnostic questions
          </div>
        </div>

        <div className="card">
          <div className="ct">📊 Your Answers</div>
          {results.map((r, i) => (
            <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < results.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Q{i + 1}: {r.q}</div>
              <div style={{ fontSize: 12, color: r.correct ? "#16A34A" : "#DC2626", fontWeight: 700 }}>
                {r.correct ? "✅" : "❌"} Your answer: {r.opts[r.selected]} {!r.correct && `→ Correct: ${r.opts[r.correctAns]}`}
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-p" onClick={() => onDone(subjectScore)}>
          ✅ Save Score & Study Topics
        </button>
      </div>
    );
  }

  const q = qs[curr];
  const progress = ((curr) / qs.length) * 100;

  return (
    <div style={{ padding: "20px 18px" }}>
      <div className="ybox">
        🎯 Quick Diagnostic Quiz — {subject.name}<br />
        <span style={{ fontSize: 12, fontWeight: 600 }}>Answer honestly! This sets your starting score.</span>
      </div>
      <div className="qz-prog"><div className="qz-pf" style={{ width: progress + "%" }} /></div>
      <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700, textAlign: "center", marginBottom: 14 }}>
        Question {curr + 1} of {qs.length}
      </div>
      <div className="qz-q">{q.q}</div>
      {q.opts.map((opt, i) => {
        let cls = "qz-opt";
        if (answered) {
          cls += " disabled";
          if (i === q.ans) cls += " correct";
          else if (i === selected) cls += " wrong";
        }
        return (
          <button key={i} className={cls} onClick={() => handleOpt(i)}>
            <span style={{ marginRight: 10, fontWeight: 900, color: "var(--blue)" }}>{["A","B","C","D"][i]}.</span> {opt}
          </button>
        );
      })}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [student,  setStudent]  = useLS("ap2_stu", null);
  const [scores,   setScores]   = useLS("ap2_sc",  {});   // only set after quiz
  const [tested,   setTested]   = useLS("ap2_ts",  {});   // which subjects have been tested
  const [doneTops, setDoneTops] = useLS("ap2_dt",  {});
  const [doneExams,setDoneEx]   = useLS("ap2_de",  {});
  const [chatHist, setChatHist] = useLS("ap2_ch",  []);

  const [page,    setPage]    = useState("login");
  const [tab,     setTab]     = useState("learn");
  const [selSub,  setSelSub]  = useState(null);
  const [selTop,  setSelTop]  = useState(null);
  const [examSub, setExamSub] = useState(null);
  const [quizSub, setQuizSub] = useState(null);  // subject currently being quizzed
  const [toast,   setToast]   = useState("");
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const chatEnd = useRef(null);

  const showToast = m => { setToast(m); setTimeout(() => setToast(""), 2800); };
  const sc    = id => scores[id] ?? null;          // null = not tested
  const isTested = id => !!tested[id];
  const testedSubs = SUBJECTS.filter(s => tested[s.id]);
  const untestedSubs = SUBJECTS.filter(s => !tested[s.id]);
  const avg   = testedSubs.length > 0
    ? Math.round(testedSubs.reduce((a, s) => a + (sc(s.id) || 0), 0) / testedSubs.length)
    : 0;
  const weakS = testedSubs.filter(s => (sc(s.id) || 0) < 50);
  const rank  = getRank(avg, testedSubs.length > 0);

  useEffect(() => { if (student) setPage("main"); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHist, loading]);

  const sendChat = async (override) => {
    const text = (override || chatInput).trim();
    if (!text || loading) return;
    setChatInput("");
    const userMsg = { role: "user", content: text };
    const next = [...chatHist, userMsg];
    setChatHist(next);
    setLoading(true);
    try {
      const reply = await askClaude(next.map(m => ({ role: m.role, content: m.content })));
      setChatHist([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setChatHist([...next, { role: "assistant", content: "⚠️ Error: " + e.message }]);
    }
    setLoading(false);
  };

  if (!student || page === "login") {
    return <LoginScreen onLogin={s => {
      setStudent(s);
      // NO random scores! Start fresh.
      setScores({});
      setTested({});
      setChatHist([{ role: "assistant", content: `🎉 Namaste ${s.name}! I'm ScoreTop AI — your AP SSC 2026 personal tutor!\n\n✨ Minimum Pass Guarantee • Maximum Full Score ✨\n\nYour scores start at ZERO — they are earned only by taking quizzes and practice exams. This way I know your REAL level and can help you better! 🎯\n\n👉 Go to LEARN tab → Click a subject → Take the diagnostic quiz → Get your real score!\n\nWhat subject shall we start with? 📚` }]);
      setPage("main");
    }} />;
  }

  // ── Quiz screen ──
  if (page === "quiz" && quizSub) {
    const sub = SUBJECTS.find(s => s.id === quizSub);
    return (
      <>
        <style>{G}</style>
        <div className="app">
          <div className="bg-dec"><div className="dc dc1" /><div className="dc dc2" /></div>
          <div className="screen">
            <div className="ph" style={{ background: `linear-gradient(135deg,${sub.color}BB,${sub.color})` }}>
              <div className="ph-row">
                <button className="back" onClick={() => { setPage("subject"); }}>←</button>
                <div><div className="ph-title">📋 Diagnostic Quiz</div><div className="ph-sub">{sub.name} · 5 Questions</div></div>
              </div>
            </div>
            <QuickQuiz subject={sub} onDone={score => {
              setScores({ ...scores, [quizSub]: score });
              setTested({ ...tested, [quizSub]: true });
              showToast(`✅ ${sub.name} score set: ${score}%`);
              setPage("subject");
            }} />
          </div>
        </div>
      </>
    );
  }

  // ── Topic ──
  if (page === "topic" && selSub && selTop) {
    return <TopicScreen student={student} subject={SUBJECTS.find(s => s.id === selSub)}
      topic={selTop} done={(doneTops[selSub] || []).includes(selTop)}
      onBack={() => setPage("subject")}
      onMarkDone={() => {
        setDoneTops({ ...doneTops, [selSub]: [...(doneTops[selSub] || []), selTop] });
        setScores({ ...scores, [selSub]: Math.min(100, (sc(selSub) || 0) + 5) });
        showToast("✅ Topic studied! +5 score 🎉");
        setPage("subject");
      }} />;
  }

  // ── Subject ──
  if (page === "subject" && selSub) {
    const sub = SUBJECTS.find(s => s.id === selSub);
    const subScore = sc(sub.id);
    const hasTested = isTested(sub.id);
    return (
      <>
        <style>{G}</style>
        <div className="app">
          <div className="bg-dec"><div className="dc dc1" /><div className="dc dc2" /></div>
          <div className="screen">
            <div className="ph" style={{ background: `linear-gradient(135deg,${sub.color}CC,${sub.color})` }}>
              <div className="ph-row">
                <button className="back" onClick={() => setPage("main")}>←</button>
                <div><div className="ph-title">{sub.icon} {sub.name}</div><div className="ph-sub">AP SSC 2026 · {hasTested ? "Click topic for AI tips" : "Take quiz first!"}</div></div>
              </div>
            </div>
            <div className="pad" style={{ paddingTop: 22 }}>
              {/* Score card */}
              <div className="card" style={{ background: `linear-gradient(135deg,${sub.light},#fff)`, borderColor: sub.color + "33" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>Your Score</div>
                    {hasTested ? (
                      <>
                        <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 40, fontWeight: 900, color: sub.color }}>{subScore}%</div>
                        <span className={`b ${subScore < 50 ? "b-re" : subScore >= 70 ? "b-gr" : "b-or"}`}>
                          {subScore < 50 ? "⚠️ Needs Work" : subScore >= 70 ? "🏆 Strong" : "✅ On Track"}
                        </span>
                      </>
                    ) : (
                      <>
                        <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 28, fontWeight: 900, color: "#94A3B8" }}>Not Tested</div>
                        <span className="b b-gy">❓ Take Quiz First</span>
                      </>
                    )}
                  </div>
                  <div style={{ fontSize: 52 }}>{sub.icon}</div>
                </div>
                {hasTested && (
                  <>
                    <div className="pbar" style={{ marginTop: 14, height: 8 }}>
                      <div className="pf" style={{ width: subScore + "%", background: sub.color }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginTop: 5, fontWeight: 700 }}>
                      <span>Pass: 35%</span><span>{(doneTops[selSub] || []).length}/{(TOPICS[selSub] || []).length} topics done</span><span>Full: 100%</span>
                    </div>
                  </>
                )}
              </div>

              {/* Quiz CTA if not tested */}
              {!hasTested ? (
                <div>
                  <div className="ybox">
                    ⚠️ No score yet for {sub.name}!<br />
                    <span style={{ fontWeight: 600, fontSize: 12 }}>Take a 5-question diagnostic quiz to get your real score. Only takes 2 minutes!</span>
                  </div>
                  <button className="btn btn-o" onClick={() => { setQuizSub(selSub); setPage("quiz"); }}>
                    🎯 Take Diagnostic Quiz (5 Questions)
                  </button>
                  <div className="sec" style={{ marginTop: 4 }}>Topics (unlock after quiz)</div>
                  {(TOPICS[selSub] || []).map(t => (
                    <div key={t} className="tr" style={{ opacity: 0.5, cursor: "not-allowed" }}>
                      <div className="tl"><span style={{ fontSize: 16 }}>🔒</span><span>{t}</span></div>
                      <div className="trr">Locked</div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {subScore < 50 && <div className="abox">⚠️ Score below 50%! Study these topics every day.</div>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div className="sec" style={{ marginBottom: 0 }}>Topics — Click for AI Study Guide</div>
                    <button className="btn btn-g btn-sm" onClick={() => { setQuizSub(selSub); setPage("quiz"); }} style={{ fontSize: 11, padding: "6px 12px" }}>
                      🔄 Retake Quiz
                    </button>
                  </div>
                  {(TOPICS[selSub] || []).map(t => {
                    const d = (doneTops[selSub] || []).includes(t);
                    return (
                      <div key={t} className={`tr ${d ? "done" : ""}`} onClick={() => { setSelTop(t); setPage("topic"); }}>
                        <div className="tl"><span style={{ fontSize: 18 }}>{d ? "✅" : "📖"}</span><span style={{ color: d ? "#15803D" : "var(--text)" }}>{t}</span></div>
                        <div className="trr" style={{ color: d ? "#16A34A" : "#2563EB" }}>{d ? "Done ✓" : "Study →"}</div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Exam ──
  if (page === "exam-active" && examSub) {
    return <ExamScreen student={student} subject={SUBJECTS.find(s => s.id === examSub)}
      onBack={() => setPage("main")}
      onComplete={gained => {
        const cur = sc(examSub) || 0;
        setScores({ ...scores, [examSub]: Math.min(100, cur + gained) });
        setTested({ ...tested, [examSub]: true });
        setDoneEx({ ...doneExams, [examSub]: true });
        showToast(`🎯 Exam complete! Score updated!`);
        setPage("main"); setTab("command");
      }} />;
  }

  return (
    <>
      <style>{G}</style>
      {toast && <div className="toast">{toast}</div>}
      <div className="app">
        <div className="bg-dec"><div className="dc dc1" /><div className="dc dc2" /><div className="dc dc3" /></div>

        {/* ── LEARN TAB ── */}
        {tab === "learn" && (
          <div className="screen">
            <div className="wh">
              <div className="logo">ScoreTop AP 🎓</div>
              <div className="logo-s">Andhra Pradesh SSC Board 2026</div>
              <div className="logo-t">✨ Minimum Pass Guarantee • Maximum Full Score ✨</div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <span className="b b-wh">
                  {testedSubs.length > 0 ? `🎯 ${avg}% Avg (${testedSubs.length} tested)` : "🎯 Take quizzes to see score!"}
                </span>
                <span className="b b-wh">{rank.emoji} {rank.name}</span>
                <span className="b b-wh">👤 {student.name.split(" ")[0]}</span>
              </div>
            </div>

            <div className="pad" style={{ paddingTop: 20 }}>
              {untestedSubs.length > 0 && (
                <div className="ybox">
                  ❓ {untestedSubs.length} subject{untestedSubs.length > 1 ? "s" : ""} not tested yet: {untestedSubs.map(s => s.name).join(", ")}<br />
                  <span style={{ fontWeight: 600, fontSize: 12 }}>Click a subject → Take the 5-question quiz → Get your real score!</span>
                </div>
              )}
              {weakS.length > 0 && (
                <div className="abox">⚠️ Needs attention: {weakS.map(s => s.name).join(", ")}</div>
              )}
              {testedSubs.length > 0 && (
                <div className="sts">
                  {[
                    { n: testedSubs.filter(s => (sc(s.id) || 0) >= 70).length, l: "Strong", c: "#16A34A" },
                    { n: weakS.length, l: "Weak", c: "#DC2626" },
                    { n: Object.values(doneExams).filter(Boolean).length, l: "Exams", c: "#2563EB" },
                    { n: Object.values(doneTops).flat().length, l: "Topics", c: "#7C3AED" },
                  ].map(x => (
                    <div key={x.l} className="st"><div className="stn" style={{ color: x.c }}>{x.n}</div><div className="stl">{x.l}</div></div>
                  ))}
                </div>
              )}
              <div className="sec">All Subjects — Click to Study</div>
            </div>

            <div className="sg">
              {SUBJECTS.map(sub => {
                const s = sc(sub.id);
                const has = isTested(sub.id);
                return (
                  <div key={sub.id} className="sc2"
                    style={{ borderColor: !has ? "var(--border2)" : s < 50 ? "#FCA5A5" : s >= 70 ? "#86EFAC" : sub.color + "44" }}
                    onClick={() => { setSelSub(sub.id); setPage("subject"); }}>
                    <span className="si">{sub.icon}</span>
                    <div className="sn">{sub.name}</div>
                    {has ? (
                      <>
                        <div className="sp2" style={{ color: s < 50 ? "#DC2626" : s >= 70 ? "#16A34A" : "#EA580C" }}>{s}%</div>
                        <div className="pbar"><div className="pf" style={{ width: s + "%", background: sub.color }} /></div>
                      </>
                    ) : (
                      <div className="no-test">❓ Take Quiz</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pad">
              <div className="card" style={{ background: "linear-gradient(135deg,#EFF6FF,#F0FDF4)" }}>
                <div className="ct">📋 AP SSC 2026 Info</div>
                <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 2, fontWeight: 600 }}>
                  📅 <strong>Board Exam:</strong> March–April 2026<br />
                  ✅ <strong>Pass Mark:</strong> 35/100 per subject<br />
                  🎯 <strong>Your scores</strong> are ONLY from quizzes & exams — no guessing!<br />
                  💡 <strong>Tip:</strong> Ask AI Tutor anything about your syllabus!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── AI TUTOR TAB ── */}
        {tab === "ai" && (
          <div className="screen">
            <div className="wh" style={{ paddingBottom: 36 }}>
              <div className="logo">AI Tutor 🤖</div>
              <div className="logo-s">Powered by Claude · Ask Anything 24/7</div>
            </div>
            <div className="pw">
              {["Explain Quadratic Equations step by step", "How to score 100 in Maths?",
                "Best revision strategy for AP SSC", "Explain Ohm's Law with example",
                "Write an essay on Save Water", "Telugu sandhi rules with examples",
                "Explain Photosynthesis process", "AP SSC 2026 exam pattern & tips",
              ].map(q => <span key={q} className="pill" onClick={() => sendChat(q)}>{q}</span>)}
            </div>
            <div className="cl">
              {chatHist.map((m, i) => (
                <div key={i} className={`br ${m.role === "user" ? "u" : ""}`}>
                  <div className={`av ${m.role === "user" ? "u" : "ai"}`}>{m.role === "user" ? "🧑" : "🤖"}</div>
                  <div className={`bb ${m.role === "user" ? "u" : "ai"}`} style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                </div>
              ))}
              {loading && (
                <div className="br"><div className="av ai">🤖</div>
                  <div className="bb ai"><div className="td"><div className="dot" /><div className="dot" /><div className="dot" /></div></div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>
            <div className="cia">
              <div className="cir">
                <input placeholder="Ask anything about AP 10th syllabus..." value={chatInput}
                  onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} />
                <button className="sb" onClick={() => sendChat()} disabled={loading || !chatInput.trim()}>
                  {loading ? "⏳" : "➤"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── EXAM TAB ── */}
        {tab === "exam" && (
          <div className="screen">
            <div className="wh">
              <div className="logo">Practice Exams 📝</div>
              <div className="logo-s">AI-Generated · AP Board Pattern</div>
            </div>
            <div className="pad" style={{ paddingTop: 20 }}>
              <div className="ibox">
                ✅ AI generates fresh questions every time<br />
                ✅ Exact AP SSC marks distribution (1M,2M,4M,5M)<br />
                ✅ 30-min countdown timer<br />
                ✅ AI evaluates your answers with detailed score<br />
                ✅ Exam score is added to your subject score!
              </div>
              <div className="sec">Select Subject to Attempt</div>
              {SUBJECTS.map(sub => {
                const done = doneExams[sub.id];
                const has = isTested(sub.id);
                return (
                  <div key={sub.id} className={`tr ${done ? "done" : ""}`}
                    onClick={() => { setExamSub(sub.id); setPage("exam-active"); }}>
                    <div className="tl">
                      <span style={{ fontSize: 22 }}>{sub.icon}</span>
                      <div>
                        <div>{sub.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1, fontWeight: 700 }}>
                          {done ? "✅ Attempted" : "📝 Not attempted"} · {has ? `Score: ${sc(sub.id)}%` : "❓ Not quizzed yet"}
                        </div>
                      </div>
                    </div>
                    <div className="trr" style={{ color: done ? "#16A34A" : "#2563EB" }}>{done ? "Retry →" : "Start →"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── COMMAND CENTER TAB ── */}
        {tab === "command" && (
          <div className="screen">
            <div className="wh">
              <div className="logo">Command Center 🎯</div>
              <div className="logo-s">Your Real Performance — Based on Actual Tests</div>
            </div>
            <div className="pad" style={{ paddingTop: 20 }}>
              <div className="rk" style={{ background: `linear-gradient(135deg,${rank.bg},#fff)`, border: `1.5px solid ${rank.color}33` }}>
                <div className="re">{rank.emoji}</div>
                <div className="rn" style={{ color: rank.color }}>{rank.name}</div>
                <div className="rd">{rank.desc}</div>
                {testedSubs.length === 0 && (
                  <div style={{ marginTop: 12, fontSize: 12, color: "var(--text2)", fontWeight: 700 }}>
                    👉 Go to LEARN → Take subject quizzes to see your real rank!
                  </div>
                )}
              </div>

              {testedSubs.length > 0 && (
                <div className="card">
                  <div className="ct">📊 Overall Performance</div>
                  <div className="rw">
                    <div className="rb">
                      <svg width="128" height="128" viewBox="0 0 128 128">
                        <circle cx="64" cy="64" r="54" fill="none" stroke="#E2E8F8" strokeWidth="12" />
                        <circle cx="64" cy="64" r="54" fill="none" stroke={rank.color} strokeWidth="12"
                          strokeDasharray={`${2 * Math.PI * 54}`}
                          strokeDashoffset={`${2 * Math.PI * 54 * (1 - avg / 100)}`}
                          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
                      </svg>
                      <div className="rc">
                        <div className="rpct" style={{ color: rank.color }}>{avg}%</div>
                        <div className="rl">AVERAGE</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", fontWeight: 700, marginBottom: 12 }}>
                    Based on {testedSubs.length} tested subject{testedSubs.length > 1 ? "s" : ""}
                  </div>
                  <div className="sts" style={{ marginBottom: 0 }}>
                    {[
                      { n: testedSubs.filter(s => (sc(s.id) || 0) >= 70).length, l: "Strong", c: "#16A34A" },
                      { n: weakS.length, l: "Weak", c: "#DC2626" },
                      { n: Object.values(doneExams).filter(Boolean).length, l: "Exams", c: "#2563EB" },
                      { n: Object.values(doneTops).flat().length, l: "Topics", c: "#7C3AED" },
                    ].map(x => (
                      <div key={x.l} className="st"><div className="stn" style={{ color: x.c }}>{x.n}</div><div className="stl">{x.l}</div></div>
                    ))}
                  </div>
                </div>
              )}

              <div className="sec">Subject-wise Breakdown</div>
              {SUBJECTS.map(sub => {
                const s = sc(sub.id);
                const has = isTested(sub.id);
                const td = (doneTops[sub.id] || []).length;
                const tt = (TOPICS[sub.id] || []).length;
                return (
                  <div key={sub.id} className="sp">
                    <span style={{ fontSize: 22 }}>{sub.icon}</span>
                    <div className="spi">
                      <div className="spn">{sub.name}</div>
                      {has ? (
                        <>
                          <div className="pbar" style={{ marginTop: 5 }}><div className="pf" style={{ width: s + "%", background: sub.color }} /></div>
                          <div className="spm">{td}/{tt} topics · {doneExams[sub.id] ? "✅ Exam done" : "📝 Pending"}</div>
                        </>
                      ) : (
                        <div className="spm">❓ Not tested yet — take quiz to see score</div>
                      )}
                    </div>
                    <div className="spp" style={{ color: !has ? "#94A3B8" : s < 50 ? "#DC2626" : s >= 70 ? "#16A34A" : "#EA580C" }}>
                      {has ? s + "%" : "—"}
                    </div>
                  </div>
                );
              })}

              {testedSubs.length > 0 && (
                <div className="aip">
                  <div className="ct">🤖 AI Action Plan for {student.name.split(" ")[0]}</div>
                  <p>
                    {weakS.length > 0 && <><strong>⚡ Priority:</strong> {weakS.map(s => s.name).join(", ")}<br /></>}
                    {untestedSubs.length > 0 && <><strong>📝 Take Quiz:</strong> {untestedSubs.map(s => s.name).join(", ")}<br /></>}
                    <strong>📅 Daily Goal:</strong> Study 2 topics + 1 practice exam<br />
                    <strong>✅ Pass Status:</strong> {avg >= 35 ? "SAFE — Keep going! 💪" : "⚠️ Study daily to guarantee pass!"}<br />
                    <strong>🏆 Full Score:</strong> Complete all topics + 3 mock exams per subject
                  </p>
                </div>
              )}

              <div style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginBottom: 12, fontWeight: 700 }}>
                {student.name} · {student.school || "School"} · Roll: {student.rollno || "—"}
              </div>
              <button className="btn btn-g" onClick={() => {
                if (confirm("Reset all scores and progress?")) {
                  setScores({}); setTested({}); setDoneTops({}); setDoneEx({});
                  showToast("🔄 All progress reset!");
                }
              }}>🔄 Reset All Progress</button>
            </div>
          </div>
        )}

        <nav className="nav">
          {[{ id: "learn", icon: "📚", l: "LEARN" }, { id: "ai", icon: "🤖", l: "AI TUTOR" }, { id: "exam", icon: "📝", l: "EXAM" }, { id: "command", icon: "🎯", l: "COMMAND" }].map(n => (
            <button key={n.id} className={`nb ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
              <span className="ni">{n.icon}</span><span className="nl">{n.l}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", school: "", rollno: "", weakSubject: "", goal: "" });
  return (
    <>
      <style>{G}</style>
      <div className="app">
        <div className="bg-dec"><div className="dc dc1" /><div className="dc dc2" /><div className="dc dc3" /></div>
        <div className="screen" style={{ paddingBottom: 40 }}>
          {step === 0 && (
            <>
              <div className="wh" style={{ textAlign: "center", paddingTop: 36, paddingBottom: 50 }}>
                <div style={{ fontSize: 58, marginBottom: 10 }}>🎓</div>
                <div className="logo">ScoreTop AP</div>
                <div className="logo-s">Andhra Pradesh SSC Board 2026</div>
                <div className="logo-t">✨ Minimum Pass Guarantee • Maximum Full Score ✨</div>
              </div>
              <div className="pad" style={{ paddingTop: 24 }}>
                <div className="card" style={{ background: "linear-gradient(135deg,#EFF6FF,#F0FDF4)" }}>
                  <div className="ct">Why ScoreTop AP? 🚀</div>
                  <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.95, fontWeight: 600 }}>
                    🎯 Scores based on REAL tests — not guessing<br />
                    📋 5-question quiz per subject to find your level<br />
                    🤖 Real AI powered by Claude<br />
                    📚 All 7 AP SSC subjects · 100+ topics<br />
                    📝 Fresh AI exam papers every time<br />
                    📊 Track real progress in Command Center
                  </div>
                </div>
                <button className="btn btn-p" onClick={() => setStep(1)}>Get Started 🚀</button>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className="wh" style={{ paddingBottom: 36 }}><div className="logo">Tell Me About You 👋</div><div className="logo-s">I'll personalise your study plan</div></div>
              <div className="steps">{[0, 1, 2].map(i => <div key={i} className={`sd ${step - 1 === i ? "active" : ""}`} />)}</div>
              <div className="pad">
                <input placeholder="Your Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input placeholder="School Name" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} />
                <input placeholder="Roll Number" value={form.rollno} onChange={e => setForm({ ...form, rollno: e.target.value })} />
                <button className="btn btn-p" onClick={() => { if (form.name.trim()) setStep(2); else alert("Please enter your name!"); }}>Next →</button>
                <button className="btn btn-g" onClick={() => setStep(0)}>← Back</button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="wh" style={{ paddingBottom: 36 }}><div className="logo">Your Goal? 🏆</div><div className="logo-s">Be honest — I'll guide you!</div></div>
              <div className="steps">{[0, 1, 2].map(i => <div key={i} className={`sd ${step - 1 === i ? "active" : ""}`} />)}</div>
              <div className="pad">
                {["Just want to pass (35+)", "Want good marks (60+)", "Want distinction (75+)", "Want to be a topper (90+)"].map(g => (
                  <button key={g} className={`choice ${form.goal === g ? "sel" : ""}`} onClick={() => setForm({ ...form, goal: g })}>{g}</button>
                ))}
                <button className="btn btn-p" style={{ marginTop: 8 }} onClick={() => { if (form.goal) onLogin(form); else alert("Please select your goal!"); }}>🚀 Start My Journey</button>
                <button className="btn btn-g" onClick={() => setStep(1)}>← Back</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── TOPIC SCREEN ──────────────────────────────────────────────────────────────
function TopicScreen({ student, subject, topic, done, onBack, onMarkDone }) {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const chatEnd = useRef(null);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const prompt = `Student: ${student.name}, Goal: ${student.goal}, AP SSC 2026.
Subject: ${subject.name}, Topic: ${topic}

Give a complete study guide:
1. 📌 Simple definition (2-3 lines)
2. 🔑 Key formulas / important points (bullets)
3. 📝 AP Board exam question patterns & marks
4. 💡 Memory tricks & shortcuts
5. ⚠️ Common mistakes AP students make
6. ✅ How to write perfect answers in AP SSC board exam`;
      try {
        const r = await askClaude([{ role: "user", content: prompt }]);
        setMsgs([{ role: "assistant", content: r }]);
      } catch (e) {
        setMsgs([{ role: "assistant", content: "⚠️ Could not load: " + e.message }]);
      }
      setLoading(false);
    })();
  }, []);

  const send = async () => {
    const text = chatInput.trim();
    if (!text || loading) return;
    setChatInput("");
    const ctx = `AP SSC 2026, ${subject.name}, Topic: ${topic}. Question: ${text}`;
    const api = [...msgs.map(m => ({ role: m.role, content: m.content })), { role: "user", content: ctx }];
    setMsgs(p => [...p, { role: "user", content: text }]);
    setLoading(true);
    try { const r = await askClaude(api); setMsgs(p => [...p, { role: "assistant", content: r }]); }
    catch (e) { setMsgs(p => [...p, { role: "assistant", content: "⚠️ " + e.message }]); }
    setLoading(false);
  };

  return (
    <>
      <style>{G}</style>
      <div className="app">
        <div className="bg-dec"><div className="dc dc1" /><div className="dc dc2" /></div>
        <div className="screen">
          <div className="ph" style={{ background: `linear-gradient(135deg,${subject.color}BB,${subject.color})` }}>
            <div className="ph-row">
              <button className="back" onClick={onBack}>←</button>
              <div><div className="ph-title" style={{ fontSize: 15 }}>{subject.icon} {topic}</div><div className="ph-sub">{subject.name} · AI Study Guide</div></div>
            </div>
          </div>
          <div className="cl">
            {loading && msgs.length === 0 && (
              <div className="br"><div className="av ai">🤖</div>
                <div className="bb ai"><div className="td"><div className="dot" /><div className="dot" /><div className="dot" /></div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Generating AI guide for "{topic}"...</div></div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`br ${m.role === "user" ? "u" : ""}`}>
                <div className={`av ${m.role === "user" ? "u" : "ai"}`}>{m.role === "user" ? "🧑" : "🤖"}</div>
                <div className={`bb ${m.role === "user" ? "u" : "ai"}`} style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
              </div>
            ))}
            {loading && msgs.length > 0 && (
              <div className="br"><div className="av ai">🤖</div>
                <div className="bb ai"><div className="td"><div className="dot" /><div className="dot" /><div className="dot" /></div></div>
              </div>
            )}
            <div ref={chatEnd} />
          </div>
          {msgs.length > 0 && (
            <div className="pad">
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, fontWeight: 700 }}>💬 Ask a follow-up question:</div>
              <div className="cir">
                <input placeholder={`Ask more about ${topic}...`} value={chatInput}
                  onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} style={{ marginBottom: 0 }} />
                <button className="sb" onClick={send} disabled={loading || !chatInput.trim()}>{loading ? "⏳" : "➤"}</button>
              </div>
              <div style={{ marginTop: 12 }}>
                {done ? <div className="sbox">✅ Already studied! Keep revising. 🎯</div>
                  : <button className="btn btn-s" onClick={onMarkDone}>✅ Mark as Studied (+5 score)</button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── EXAM SCREEN ───────────────────────────────────────────────────────────────
function ExamScreen({ student, subject, onBack, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(true);
  const [answers, setAnswers] = useState({});
  const [evals, setEvals] = useState({});
  const [evalLoad, setEvalLoad] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [gained, setGained] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const prompt = `Generate an AP SSC 2026 board exam paper for ${subject.name}.
Create exactly 8 questions:
- 2 × 1 mark (very short answer)
- 2 × 2 marks (short answer, 3-4 lines)
- 2 × 4 marks (detailed, with diagram if needed)
- 2 × 5 marks (long answer / problem)
Return ONLY valid JSON array, no extra text:
[{"q":"question","marks":1,"hint":"brief hint"},...]
Use real AP SSC 2026 syllabus.`;
      try {
        const raw = await askClaude([{ role: "user", content: prompt }]);
        const match = raw.match(/\[[\s\S]*?\]/);
        if (match) setQuestions(JSON.parse(match[0]).slice(0, 8));
        else throw new Error();
      } catch {
        setQuestions([
          { q: `State and explain the most important law/theorem in ${subject.name}.`, marks: 1, hint: "One sentence" },
          { q: `Write a short note on a key topic from ${subject.name}.`, marks: 2, hint: "3-4 lines" },
          { q: `Explain with example an important concept in ${subject.name}.`, marks: 4, hint: "With diagram" },
          { q: `Write a detailed answer on the major chapter of ${subject.name}.`, marks: 5, hint: "Full explanation" },
          { q: `Give two real-life applications of ${subject.name} concepts.`, marks: 2, hint: "2 examples" },
          { q: `Compare and contrast two important topics from ${subject.name}.`, marks: 4, hint: "Table format" },
          { q: `Solve this step-by-step problem from ${subject.name}.`, marks: 5, hint: "Show all steps" },
          { q: `Define any three key terms from ${subject.name}.`, marks: 1, hint: "One line each" },
        ]);
      }
      setLoadingQ(false);
    })();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const evaluate = async (i) => {
    if (!answers[i]?.trim()) { alert("Write an answer first!"); return; }
    setEvalLoad({ ...evalLoad, [i]: true });
    const q = questions[i];
    try {
      const r = await askClaude([{ role: "user", content: `Evaluate this AP SSC 2026 answer:\nSubject: ${subject.name}\nQuestion (${q.marks}M): ${q.q}\nAnswer: ${answers[i]}\n\nProvide:\n1. Score: X/${q.marks}\n2. What's correct\n3. What's missing\n4. Model answer (AP board style)` }]);
      setEvals({ ...evals, [i]: r });
    } catch (e) { setEvals({ ...evals, [i]: "⚠️ " + e.message }); }
    setEvalLoad({ ...evalLoad, [i]: false });
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    const ans = Object.keys(answers).filter(k => answers[k]?.trim()).length;
    const g = Math.round((ans / questions.length) * 15);
    setGained(g); setSubmitted(true);
  };

  if (loadingQ) return (
    <>
      <style>{G}</style>
      <div className="app">
        <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🤖</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "var(--text)", marginBottom: 8 }}>Generating Your Exam...</div>
          <div style={{ fontSize: 14, color: "var(--muted)", textAlign: "center", fontWeight: 600, maxWidth: 260 }}>AI creating fresh AP board questions for {subject.name}</div>
          <div className="td" style={{ marginTop: 20 }}><div className="dot" /><div className="dot" /><div className="dot" /></div>
        </div>
      </div>
    </>
  );

  if (submitted) return (
    <>
      <style>{G}</style>
      <div className="app">
        <div className="bg-dec"><div className="dc dc1" /><div className="dc dc2" /></div>
        <div className="screen" style={{ paddingBottom: 40 }}>
          <div className="wh" style={{ textAlign: "center", paddingTop: 30 }}>
            <div style={{ fontSize: 52 }}>🎉</div>
            <div className="logo">Exam Submitted!</div>
            <div className="logo-s">{subject.name} · AP SSC Practice</div>
          </div>
          <div className="pad" style={{ paddingTop: 20 }}>
            <div className="card" style={{ textAlign: "center", background: "linear-gradient(135deg,#F0FDF4,#DCFCE7)" }}>
              <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 44, fontWeight: 900, color: "#16A34A" }}>
                {Object.keys(answers).filter(k => answers[k]?.trim()).length}/{questions.length}
              </div>
              <div style={{ fontSize: 13, color: "#16A34A", fontWeight: 800, marginTop: 4 }}>Questions Answered · +{gained}% score added!</div>
            </div>
            <div className="sec">Get AI Evaluation for Each Answer</div>
            {questions.map((q, i) => (
              <div key={i} className="qc">
                <div className="qm"><div className="qnum">Q{i + 1}</div><div className="qmk">{q.marks}M</div></div>
                <div className="qt">{q.q}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, fontWeight: 700 }}>Your answer: {answers[i] || "(not answered)"}</div>
                {evals[i] ? (
                  <div className="ai-ev"><div className="ai-ev-t">🤖 AI Evaluation</div><div style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>{evals[i]}</div></div>
                ) : (
                  <button className="btn btn-g btn-sm" disabled={evalLoad[i]} onClick={() => evaluate(i)}>
                    {evalLoad[i] ? "⏳ Evaluating..." : "🤖 Get AI Evaluation"}
                  </button>
                )}
              </div>
            ))}
            <button className="btn btn-p" onClick={() => onComplete(gained)}>✅ Save Results</button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{G}</style>
      <div className="app">
        <div className="bg-dec"><div className="dc dc1" /><div className="dc dc2" /></div>
        <div className="screen">
          <div className="ph" style={{ background: `linear-gradient(135deg,${subject.color}BB,${subject.color})` }}>
            <div className="ph-row">
              <button className="back" onClick={onBack}>←</button>
              <div><div className="ph-title">{subject.icon} {subject.name} Exam</div><div className="ph-sub">AI-Generated · AP SSC Board Pattern</div></div>
            </div>
          </div>
          <div className="pad" style={{ paddingTop: 20 }}>
            <div className={`timer ${timeLeft < 300 ? "urgent" : ""}`}>⏱ {fmt(timeLeft)} {timeLeft < 300 ? "— Hurry!" : "remaining"}</div>
            <div className="ibox" style={{ marginBottom: 14 }}>📝 Write answers below. Submit → Get AI evaluation for each!</div>
            {questions.map((q, i) => (
              <div key={i} className="qc">
                <div className="qm"><div className="qnum">Q{i + 1}</div><div className="qmk">{q.marks} {q.marks === 1 ? "Mark" : "Marks"}</div></div>
                <div className="qt">{q.q}</div>
                {q.hint && <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, fontWeight: 700, fontStyle: "italic" }}>💡 {q.hint}</div>}
                <textarea placeholder="Write your answer here..." value={answers[i] || ""} onChange={e => setAnswers({ ...answers, [i]: e.target.value })} />
              </div>
            ))}
            <button className="btn btn-s" onClick={handleSubmit}>✅ Submit Exam Paper</button>
            <button className="btn btn-g" onClick={onBack}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
