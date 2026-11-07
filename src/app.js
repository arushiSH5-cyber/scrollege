import { post } from "./api.js";
import { loadSettings, saveSettings, saveDeck, loadDeck, listDecks, deleteDeck, addReview, passReview, dueToday, dropDeckReviews, dayKey } from "./store.js";
const INK="#4a3f3a";
const RM=(()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}})();
/* ---------- original kawaii art ---------- */
function rotty(m="happy",s=40){
  const F={happy:`<circle cx="32" cy="45" r="2.8" fill="${INK}"/><circle cx="48" cy="45" r="2.8" fill="${INK}"/><path d="M36 51q4 4 8 0" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`,
   excited:`<path d="M28 46q4-5 8 0M44 46q4-5 8 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="M35 50q5 8 10 0z" fill="#e48a9c" stroke="${INK}" stroke-width="2"/>`,
   sleepy:`<path d="M28 46h8M44 46h8" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="M38 52h4" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><text x="58" y="26" font-size="11" font-weight="800" fill="${INK}">z</text><text x="64" y="18" font-size="9" font-weight="800" fill="${INK}">z</text>`,
   thinking:`<circle cx="33" cy="44" r="2.8" fill="${INK}"/><circle cx="49" cy="44" r="2.8" fill="${INK}"/><path d="M37 52h6" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`,
   proud:`<path d="M28 46q4-4 8 0M44 46q4-4 8 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="M36 51q4 4 8 0" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`}[m];
  return `<svg width="${s}" height="${s}" viewBox="0 0 80 80" aria-hidden="true"><path d="M40 20v-7" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M40 15q-10-9-16-1q8 6 16 1z" fill="#bfe0cf" stroke="${INK}" stroke-width="2"/><path d="M12 50c0-19 12-30 28-30s28 11 28 30c0 13-11 20-28 20s-28-7-28-20z" fill="#fffaf0" stroke="${INK}" stroke-width="2.6"/><ellipse cx="24" cy="52" rx="5" ry="3.2" fill="#f3b9c6"/><ellipse cx="56" cy="52" rx="5" ry="3.2" fill="#f3b9c6"/>${F}</svg>`}
function sq(k,s=40){
  const base=(fill,extra,front="")=>`<svg width="${s}" height="${s}" viewBox="0 0 80 80" aria-hidden="true">${extra}<rect x="13" y="20" width="54" height="48" rx="13" fill="${fill}" stroke="${INK}" stroke-width="2.6"/>${front}<ellipse cx="25" cy="50" rx="4.5" ry="3" fill="#f3b9c6"/><ellipse cx="55" cy="50" rx="4.5" ry="3" fill="#f3b9c6"/><circle cx="32" cy="43" r="2.7" fill="${INK}"/><circle cx="48" cy="43" r="2.7" fill="${INK}"/><path d="M36 50q2 2.5 4 0q2 2.5 4 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></svg>`;
  return {frog:base("#c9e2b0",`<circle cx="27" cy="22" r="10" fill="#c9e2b0" stroke="${INK}" stroke-width="2.6"/><circle cx="53" cy="22" r="10" fill="#c9e2b0" stroke="${INK}" stroke-width="2.6"/>`,`<circle cx="27" cy="22" r="5" fill="#fff" stroke="${INK}" stroke-width="1.6"/><circle cx="53" cy="22" r="5" fill="#fff" stroke="${INK}" stroke-width="1.6"/><circle cx="27" cy="23" r="2" fill="${INK}"/><circle cx="53" cy="23" r="2" fill="${INK}"/>`),
   chick:base("#f6e3a6",`<path d="M38 20q-2-8 4-9M42 20q3-7 8-6" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`,`<path d="M36 47h8l-4 5z" fill="#f2a65a" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`),
   bear:base("#e3c9b4",`<circle cx="21" cy="23" r="8" fill="#e3c9b4" stroke="${INK}" stroke-width="2.6"/><circle cx="59" cy="23" r="8" fill="#e3c9b4" stroke="${INK}" stroke-width="2.6"/>`),
   bunny:base("#fbe5ec",`<ellipse cx="29" cy="14" rx="6" ry="13" fill="#fbe5ec" stroke="${INK}" stroke-width="2.6"/><ellipse cx="51" cy="14" rx="6" ry="13" fill="#fbe5ec" stroke="${INK}" stroke-width="2.6"/>`),
   penguin:base("#fffdf8","",`<path d="M13 40V33q0-13 13-13h28q13 0 13 13v7q-8-9-27-9t-27 9z" fill="#6b605a" stroke="${INK}" stroke-width="2.2"/><path d="M37 47h6l-3 4z" fill="#f2a65a" stroke="${INK}" stroke-width="1.4"/>`),
   cat:base("#e7dcf3",`<path d="M17 28l4-16 12 9M63 28l-4-16-12 9" fill="#e7dcf3" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`)}[k]}
const L=`stroke="${INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"`;
const SC=[
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><circle cx="178" cy="36" r="20" fill="#f6e3a6" ${L}/><path d="M178 6v-4M206 36h4M198 16l3-3M158 16l-3-3" ${L}/><path d="M40 130 C40 70 110 40 160 60 C150 110 100 140 40 130z" fill="#c9e2b0" ${L}/><path d="M48 124 Q100 96 152 64" fill="none" ${L}/><path d="M168 54 l-26 14" ${L} stroke-dasharray="4 5"/></svg>`,
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><circle cx="40" cy="38" r="20" fill="#f6e3a6" ${L}/><path d="M110 20c-12 20-18 30-18 40a18 18 0 0 0 36 0c0-10-6-20-18-40z" fill="#b9d8ea" ${L}/><circle cx="172" cy="48" r="20" fill="#e6eefb" ${L}/><text x="160" y="54" font-family="Fredoka" font-weight="700" font-size="15" fill="${INK}">CO₂</text><path d="M30 130h160" ${L}/><path d="M60 120l40-30M110 120V92M160 120l-30-30" ${L} stroke-dasharray="4 5"/></svg>`,
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><rect x="20" y="40" width="180" height="84" rx="42" fill="#bfe0cf" ${L}/>${[55,90,125,160].map(x=>`<g>${[0,9,18].map(d=>`<ellipse cx="${x}" cy="${68+d}" rx="14" ry="5" fill="#9cc58a" ${L}/>`).join("")}</g>`).join("")}</svg>`,
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><path d="M70 40l26 15v30l-26 15-26-15V55z" fill="#f6e3a6" ${L}/><text x="49" y="80" font-family="Fredoka" font-weight="700" font-size="13" fill="${INK}">sugar</text>${[[150,50,18],[180,90,13],[140,110,15]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#c9cdf0" ${L}/><text x="${x-9}" y="${y+5}" font-family="Fredoka" font-weight="700" font-size="12" fill="${INK}">O₂</text>`).join("")}</svg>`,
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><circle cx="110" cy="80" r="56" fill="#b9d8ea" ${L}/><path d="M70 60q20-14 34 0t26 18-10 30q-26 6-40-10t-10-38z" fill="#c9e2b0" ${L}/><path d="M138 50q16 6 12 22-14 0-12-22z" fill="#c9e2b0" ${L}/></svg>`];
/* ---------- demo deck (accurate, simplified biology) ---------- */
const DEMO_DECK={demo:true,id:"demo",title:"Photosynthesis",reels:[
 {t:"What is photosynthesis?",a:"#e6f4ec",cap:["Plants make their own food","using sunlight","light → sugar energy"],read:["Plants, algae and some bacteria do it","It turns light energy into chemical energy stored in sugar","It happens mostly in the leaves"],simple:"Plants use sunlight to cook their own food.",story:["Leafy the leaf wakes up hungry.","The sun says: catch my light!","Leafy turns it into a sugar snack."],pod:[["Rotty","So plants just… eat sunlight?"],["Pip","Kind of! They use sunlight to make sugar, which is their food."]],q:["What does photosynthesis make for the plant?",["Food (sugar)","Soil","Rain"],0,"Plants turn light energy into sugar they can use."],jingle:["Sun comes down, the leaf says yum,","light to sugar, here it comes!"],line:1},
 {t:"What goes in",a:"#e6f1f8",cap:["Sunlight","water from the roots","carbon dioxide from the air"],read:["Sunlight: the energy","Water (H₂O): pulled up from the roots","Carbon dioxide (CO₂): enters through tiny leaf pores called stomata"],simple:"Plants need three things: light, water and carbon dioxide.",story:["Roots sip water like a straw.","Tiny leaf doors called stomata open wide.","Carbon dioxide floats right in."],pod:[["Rotty","What's on the shopping list?"],["Pip","Sunlight, water and carbon dioxide. That's it!"]],q:["Which gas does a plant take IN?",["Carbon dioxide","Oxygen","Helium"],0,"Plants take in carbon dioxide through stomata."],jingle:["Light and water, CO₂,","that's the recipe, through and through!"],line:2},
 {t:"Where it happens",a:"#f1eaf7",cap:["Inside chloroplasts","full of chlorophyll","that's why leaves look green"],read:["Chloroplasts are tiny parts inside plant cells","They contain chlorophyll, a green pigment","Chlorophyll absorbs mostly red and blue light and reflects green"],simple:"Little green kitchens called chloroplasts do the cooking.",story:["Inside each leaf are tiny green kitchens.","Their chef is called chlorophyll.","It loves red and blue light, and bounces green away."],pod:[["Rotty","Why are leaves green, though?"],["Pip","Chlorophyll soaks up red and blue light and reflects green back to your eyes."]],q:["Why are most leaves green?",["Chlorophyll reflects green light","They're painted","Water is green"],0,"Chlorophyll absorbs red and blue light and reflects green."],jingle:["Chloroplast, a kitchen green,","chlorophyll's the cooking team!"],line:3},
 {t:"What comes out",a:"#fcf3d6",cap:["Glucose: plant food","oxygen: into the air","we breathe that oxygen!"],read:["Glucose (C₆H₁₂O₆) stores energy for the plant","Oxygen (O₂) is released into the air","Word equation: carbon dioxide + water → glucose + oxygen, using light"],simple:"Out comes sugar for the plant and oxygen for us.",story:["The kitchen bakes a sugar treat.","Leftover oxygen floats out the door.","A kid nearby takes a big breath. Thanks, leaf!"],pod:[["Rotty","And what comes out of the kitchen?"],["Pip","Glucose for the plant, and oxygen, which we breathe."]],q:["What does a plant release that we breathe?",["Oxygen","Carbon dioxide","Glucose"],0,"Oxygen is released as a by-product."],jingle:["Sugar stays and oxygen goes,","every breath, a leaf bestows!"],line:4},
 {t:"Why it matters",a:"#fbe5e5",cap:["Food chains start with plants","they add oxygen to the air","and take in carbon dioxide"],read:["Plants are producers: most food chains start with them","Photosynthesis puts oxygen into the air","It removes carbon dioxide from the air"],simple:"No photosynthesis means no food and much less oxygen.",story:["A rabbit eats the leaf.","A fox, well… you get it.","It all started with sunshine."],pod:[["Rotty","Why should I care?"],["Pip","Almost every food chain starts with a plant making food from light!"]],q:["Why do most food chains start with plants?",["They make their own food from light","They eat animals","They sleep a lot"],0,"Plants are producers: they make food from light."],jingle:["From the sun to the plant to you,","that's the chain, and now you knew!"],line:5}]};
const ROAD=`<svg viewBox="0 0 220 120" style="width:200px" aria-hidden="true"><path d="M80 10h60l60 110H20z" fill="#d9c6e6" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M100 10L80 120M120 10l20 110" stroke="#fffaf0" stroke-width="3" stroke-dasharray="8 8"/>${[[88,40,"#bfe0cf"],[110,40,"#f6e3a6"],[132,40,"#f3b9c6"]].map(([x,y,c])=>`<rect x="${x-10}" y="${y}" width="20" height="14" rx="3" fill="${c}" stroke="${INK}" stroke-width="2"/>`).join("")}<rect x="98" y="86" width="24" height="22" rx="6" fill="#f6e3a6" stroke="${INK}" stroke-width="2.4"/><circle cx="106" cy="96" r="1.8" fill="${INK}"/><circle cx="114" cy="96" r="1.8" fill="${INK}"/></svg>`;
const SORT=[["Sunlight","in"],["Water","in"],["CO₂","in"],["Oxygen","out"],["Glucose","out"]];
const STEPS=["Roots take in water","Leaves take in CO₂","Chlorophyll catches sunlight","The plant makes glucose","Oxygen is released"];
DEMO_DECK.sort=SORT;DEMO_DECK.steps=STEPS;
let DECK=DEMO_DECK;
const REEL_BG=["#e6f4ec","#e6f1f8","#f1eaf7","#fcf3d6","#fbe5e5","#fbe9dc","#eceefb"];
function useDeck(d){DECK=d;DECK.reels.forEach((r,i)=>{if(!r.a)r.a=REEL_BG[i%REEL_BG.length]})}
const did=()=>DECK.id||"demo";
const later=i=>{addReview(S,did(),i);S.later.add(i);saveSettings(S)};
const missed=i=>{addReview(S,did(),i);if(!S.wrong.includes(i))S.wrong.push(i);saveSettings(S)};
const learned=i=>{S.got.add(i);S.later.delete(i);if(passReview(S,did(),i))toast("🔁 Review done! It'll come back later to keep it fresh.");saveSettings(S)};
const pileN=()=>(S.review||[]).length,dueN=()=>(S.review||[]).filter(x=>x.due<=dayKey()).length;
/* today's feed: reels due for review come first, then the rest, up to the daily limit */
function feedOrder(){const due=dueToday(S,did()).filter(i=>i<DECK.reels.length),rest=DECK.reels.map((_,i)=>i).filter(i=>!due.includes(i));return due.concat(rest).slice(0,Math.max(1,S.limit||5))}
const hasSteps=()=>Array.isArray(DECK.steps)&&DECK.steps.length>=3;
/* where a reel came from: "your notes, line 3" / "slides.pdf, page 4" */
function srcRef(r){
  if(DECK.demo)return esc(S.src)+(S.src==="your notes"?`, line ${r.line}`:S.pdf&&S.src===S.pdf.name?`, page ${Math.min(S.pdf.n,r.line)}`:"");
  const L=(DECK.lines||[]).find(l=>l.n===r.line);
  if(L&&L.page)return esc(DECK.sourceLabel)+`, page ${L.page}`;
  return esc(DECK.sourceLabel||S.src)+(DECK.sourceType==="notes"&&r.line?`, line ${r.line}`:"");
}
function lineText(n){const L=(DECK.lines||[]).find(l=>l.n===n);return L?L.text:""}
const NOTES=`Photosynthesis (Bio Ch. 4)
1. Plants make food (sugar) using light energy.
2. Inputs: sunlight, water (roots), carbon dioxide (stomata).
3. Happens in chloroplasts; chlorophyll absorbs red/blue light, reflects green.
4. Outputs: glucose + oxygen. CO2 + H2O -> glucose + O2.
5. Plants are producers; food chains start with them.`;

/* ---------- state ---------- */
const S={review:[],limit:5,deckId:"demo",onboarded:false,lastDay:null,tapQuiz:false,night:false,pet:"chick",petName:"Mochi",vibe:"chill",learn:new Set(["watch"]),hard:new Set(),mode:"watch",calm:false,dys:false,bionic:false,ruler:false,tint:"none",big:false,notimer:false,sound:true,voice:false,lang:"English",jr:false,
 src:"your notes",idx:0,seen:new Set(),got:new Set(),later:new Set(),wrong:[],xp:0,streak:3,tab:"feed",hist:[],test:null,story:false,simple:new Set(),built:false};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],screen=$("#screen");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
function toast(m){$$(".toast").forEach(x=>x.remove());const t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.textContent=m;screen.appendChild(t);setTimeout(()=>t.remove(),2600)}
let AC;function beep(f=660,d=.09,type="sine",when=0){if(!S.sound||S.calm)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.0001,AC.currentTime+when);g.gain.exponentialRampToValueAtTime(.12,AC.currentTime+when+.01);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+when+d);o.connect(g).connect(AC.destination);o.start(AC.currentTime+when);o.stop(AC.currentTime+when+d+.02)}catch(e){}}
function yay(){beep(660);beep(880,.1,"sine",.08);beep(1100,.12,"sine",.16);if(S.calm||RM)return;const c=$("#confetti"),cols=["#f6e3a6","#f3b9c6","#bfe0cf","#c9cdf0","#b9d8ea","#f3cfb4"];for(let i=0;i<26;i++){const x=document.createElement("i");x.style.left=(20+Math.random()*60)+"%";x.style.top="18%";x.style.background=cols[i%6];x.style.setProperty("--dx",(Math.random()*240-120)+"px");x.style.animationDelay=Math.random()*.2+"s";c.appendChild(x);setTimeout(()=>x.remove(),1800)}}
function say(t,rate){if(S.calm&&!rate)rate=.9;try{hush();const u=new SpeechSynthesisUtterance(t);u.rate=rate||1;speechSynthesis.speak(u);return u}catch(e){return null}}
function openSheet(h){$("#sheet").innerHTML='<div class="grab"></div><button class="x" aria-label="Close">✕</button>'+h;$("#sheet .x").onclick=closeSheet;$("#sheet").classList.add("on");$("#scrim").classList.add("on")}
function closeSheet(){hush();$("#sheet").classList.remove("on");$("#scrim").classList.remove("on")}
$("#scrim").onclick=closeSheet;
const bion=t=>t.split(" ").map(w=>{const n=Math.ceil(w.length/2);return `<b>${esc(w.slice(0,n))}</b>${esc(w.slice(n))}`}).join(" ");
const txt=t=>S.bionic?bion(t):esc(t);
$("#tm").innerHTML=rotty("happy",26);

/* ---------- settings appliers ---------- */
function apply(){document.documentElement.classList.toggle("night",S.night);document.querySelector('meta[name=theme-color]').content=S.night?"#151b36":"#fbf7ee";screen.classList.toggle("calm",S.calm);screen.classList.toggle("dys",S.dys);screen.classList.toggle("big",S.big);$("#calmBtn").setAttribute("aria-pressed",S.calm);
 $("#tint").style.background={none:"transparent",peach:"rgba(243,207,180,.35)",blue:"rgba(185,216,234,.35)",lilac:"rgba(217,198,230,.35)",mint:"rgba(191,224,207,.35)"}[S.tint];saveSettings(S)}
$("#themeBtn").onclick=()=>{S.night=!S.night;apply();toast(S.night?"🌙 Night notebook":"☀️ Pastel notebook");beep(S.night?440:660)};
$("#calmBtn").onclick=()=>{S.calm=!S.calm;apply();toast(S.calm?"🍃 Calm mode: no motion, no sounds, softer colors":"Calm mode off");if(S.tab==="feed")renderFeed(true)};

/* ---------- onboarding: gamified brain quiz ---------- */
const LEARN=[["watch","👀","Watch","videos & pictures"],["listen","🎧","Listen","hear it out loud"],["read","📖","Read","short notes"],["play","🎮","Play","learn by doing"]];
const HARD=[["start","🚀","Getting started"],["reading","🔤","Reading walls of text"],["noise","🔊","Noise & surprises"],["numbers","🔢","Numbers & steps"],["writing","✍️","Writing or typing"],["time","⏱","Timers & pressure"],["english","🌎","English is new"],["bored","🥱","It's just boring"]];
const PETS=[["chick","Mochi"],["frog","Pickle"],["penguin","Waddles"],["bunny","Boba"],["bear","Toast"],["cat","Miso"]];
const STAGES=[[0,"🥚 Egg","Hatches at 30 XP"],[30,"🍼 Baby","Grows at 80 XP"],[80,"🎒 Student","Graduates at 150 XP"],[150,"🎓 Graduate","Unlocks a hat!"]];
const stageOf=x=>[...STAGES].reverse().find(s=>x>=s[0]);
function petCard(){const st=stageOf(S.xp),i=STAGES.indexOf(st),nx=STAGES[i+1],pct=nx?Math.round((S.xp-st[0])/(nx[0]-st[0])*100):100;
  return `<div class="card" style="background:var(--mint2)"><div class="pet"><div class="bob" style="position:relative">${sq(S.pet,68)}${i===3?'<span style="position:absolute;top:-8px;left:22px;font-size:24px">🎓</span>':""}</div><div style="flex:1;display:grid;gap:4px"><b style="font-family:var(--head);font-size:19px">${esc(S.petName)} · ${st[1]}</b><div class="bar"><i style="width:${pct}%"></i></div><small class="muted">${st[2]}. Every reel you learn feeds ${esc(S.petName)}. ${esc(S.petName)} naps when you're away, never sad.</small></div></div></div>`}
const ONS={start:["Just 1 reel start button","Study with Rotty (body double)"],reading:["Listen first, with karaoke words","Easy-read font + line ruler"],noise:["Calm mode: no motion or sounds"],numbers:["Step-by-step reels + Stack the Steps"],writing:["Answer by voice"],time:["No-timer mode"],english:["Translate any reel"],bored:["Game breaks more often"]};
function onboard(){
  const o=document.createElement("div");o.className="onb";screen.appendChild(o);let step=0;
  const xpbar=()=>`<div class="xprow"><span>⭐</span><div class="xp"><i id="xpI" style="width:${Math.min(100,S.xp*2)}%"></i></div><span id="xpN">${S.xp} XP</span></div>`;
  const gain=(el,n)=>{S.xp=Math.max(0,S.xp+n);const r=el.getBoundingClientRect(),q=o.getBoundingClientRect(),f=document.createElement("span");f.className="plus";f.textContent=(n>0?"+":"")+n;f.style.left=(r.left-q.left+r.width/2-10)+"px";f.style.top=(r.top-q.top+o.scrollTop)+"px";o.appendChild(f);setTimeout(()=>f.remove(),900);const I=$("#xpI"),N=$("#xpN");if(I)I.style.width=Math.min(100,S.xp*2)+"%";if(N)N.textContent=S.xp+" XP";beep(n>0?760:420)};
  const draw=()=>{
    if(step===0){o.innerHTML=`<div class="hello"><div class="bob">${rotty("excited",120)}</div><h3>Hi! I'm Rotty.</h3><p class="muted" style="margin:0;max-width:30ch">I turn your notes into a feed that fits <b>your</b> brain.</p><div class="parade">${["chick","frog","penguin","bunny","bear"].map(k=>`<span>${sq(k,46)}</span>`).join("")}</div></div>
      <div class="lbl" style="text-align:center">Pick your look</div><div class="tiles"><button class="tile" data-th="0" aria-pressed="${!S.night}"><span class="em">☀️</span>Pastel</button><button class="tile" data-th="1" aria-pressed="${S.night}"><span class="em">🌙</span>Night</button></div>
      <button class="cta" id="nx">Let's go!</button><button class="cta alt" id="jrBtn" style="margin-top:0">🧸 StudyRot Jr (for kids)</button>`;
      o.querySelectorAll("[data-th]").forEach(b=>b.onclick=()=>{S.night=b.dataset.th==="1";apply();o.querySelectorAll("[data-th]").forEach(x=>x.setAttribute("aria-pressed",x===b))});
      $("#nx").onclick=()=>{step=1;draw()};$("#jrBtn").onclick=()=>{S.jr=true;S.calm=false;toast("StudyRot Jr: bigger buttons, simpler words");S.big=true;apply();step=1;draw()};return}
    const back=`<button class="back" id="obBack" aria-label="Back">←</button>`;
    if(step===1){o.innerHTML=`${back}<div class="prog"><i class="on"></i><i></i><i></i></div>${xpbar()}<div style="display:flex;gap:8px;align-items:center">${sq("chick",56)}<div><h3>How does your brain like to learn?</h3><span class="muted" style="font-size:14px">Pick all that feel good. +10 XP each!</span></div></div>
      <div class="tiles">${LEARN.map(([k,e,t,d])=>`<button class="tile" data-l="${k}" aria-pressed="${S.learn.has(k)}"><span class="em">${e}</span>${t}<small>${d}</small></button>`).join("")}</div>
      <button class="cta" id="nx">Level up →</button>`;
      o.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{const k=b.dataset.l,on=!S.learn.has(k);on?S.learn.add(k):S.learn.delete(k);b.setAttribute("aria-pressed",on);gain(b,on?10:-10)});
      $("#nx").onclick=()=>{if(!S.learn.size)return toast("Pick at least one!");yay();toast("⭐ Level 2!");step=2;draw()}}
    else if(step===2){o.innerHTML=`${back}<div class="prog"><i class="on"></i><i class="on"></i><i></i></div>${xpbar()}<div style="display:flex;gap:8px;align-items:center">${sq("cat",56)}<div><h3>What makes studying hard?</h3><span class="muted" style="font-size:14px">No diagnosis needed. Just pick what's true.</span></div></div>
      <div class="tiles">${HARD.map(([k,e,t])=>`<button class="tile" data-h="${k}" aria-pressed="${S.hard.has(k)}"><span class="em">${e}</span>${t}</button>`).join("")}</div>
      <button class="cta" id="nx">Make my brain card ✨</button>`;
      o.querySelectorAll("[data-h]").forEach(b=>b.onclick=()=>{const k=b.dataset.h,on=!S.hard.has(k);on?S.hard.add(k):S.hard.delete(k);b.setAttribute("aria-pressed",on);gain(b,on?5:-5)});
      $("#nx").onclick=()=>{step=3;draw()}}
    else{const H=S.hard;S.calm=H.has("noise");S.dys=H.has("reading");S.ruler=H.has("reading");S.notimer=H.has("time");S.voice=H.has("writing");
      S.mode=H.has("reading")&&S.learn.has("listen")?"listen":S.learn.has("watch")?"watch":[...S.learn][0];apply();
      const lead=S.learn.has("listen")?["🎧","Audio Explorer"]:S.learn.has("play")?["🎮","Game Brain"]:S.learn.has("read")?["📖","Page Turner"]:["👀","Visual Thinker"];
      const ons=[...H].flatMap(k=>ONS[k]);
      o.innerHTML=`${back}<div class="prog"><i class="on"></i><i class="on"></i><i class="on"></i></div><div class="hello" style="margin-top:6px"><h3>Your brain card!</h3></div>
       <div class="bcard"><div class="bob">${rotty("proud",80)}</div><span class="lbl" style="margin:0">You are a</span><h4>${lead[0]} ${lead[1]}</h4>
        <div class="chips" style="justify-content:center">${[...S.learn].map(k=>`<span>${LEARN.find(x=>x[0]===k)[1]} ${LEARN.find(x=>x[0]===k)[2]}</span>`).join("")}${S.calm?"<span>🌙 Calm</span>":""}</div>
        <div class="on-list">${(ons.length?ons:["Everything on default. Change anything in Me."]).map(x=>`<div class="chips"><span style="background:var(--mint2)">✓ ${x}</span></div>`).join("")}</div>
        <span class="chips"><span>⭐ ${S.xp} XP</span></span></div>
        <div class="lbl">Pick a study buddy to raise</div><div class="tiles t3">${PETS.map(([k,n])=>`<button class="tile" data-pet="${k}" aria-pressed="${S.pet===k}">${sq(k,44)}${n}</button>`).join("")}</div>
       <button class="cta" id="nx">Make my first feed 🍳</button>`;
      o.querySelectorAll("[data-pet]").forEach(b=>b.onclick=()=>{S.pet=b.dataset.pet;S.petName=PETS.find(x=>x[0]===S.pet)[1];o.querySelectorAll("[data-pet]").forEach(x=>x.setAttribute("aria-pressed",x===b));beep(880)});
      $("#nx").onclick=()=>{o.remove();S.onboarded=true;saveSettings(S);yay();show("make")}}
    const bb=$("#obBack");if(bb)bb.onclick=()=>{step--;draw()};
  };draw();
}

/* ---------- nav ---------- */
const NAV=[["feed","📱","Feed"],["make","➕","Make"],["me","🧸","Me"]];
$("#nav").innerHTML=NAV.map(([k,e,t])=>`<button data-v="${k}"><span class="e">${e}</span>${t}</button>`).join("");
$("#nav").onclick=e=>{const b=e.target.closest("button");if(b)show(b.dataset.v)};
function show(v,fromBack){if(!fromBack&&S.tab&&S.tab!==v)S.hist.push(S.tab);hush();closeSheet();S.tab=v;saveSettings(S);
  $$("#nav button").forEach(b=>b.dataset.v===v?b.setAttribute("aria-current","page"):b.removeAttribute("aria-current"));
  screen.classList.toggle("feedon",v==="feed");
  const V=$("#views");if(v==="feed"){V.innerHTML=`<section class="view feed" id="feedV" aria-label="Study feed"></section>`;renderFeed();return}
  V.innerHTML=`<section class="view"><div class="pad" id="P"></div></section>`;({make:renderMake,focus:renderFocus,me:renderMe})[v]()}
const P=()=>$("#P");
function goBack(){const ov=[...screen.querySelectorAll(".ov,.onb")].pop();if(ov){const b=ov.querySelector(".back");if(b)return b.click();return}
  if($("#sheet").classList.contains("on"))return closeSheet();if(S.hist.length)return show(S.hist.pop(),true);onboard()}
$("#backBtn").onclick=goBack;

/* ---------- make a feed ---------- */
function renderMake(){
  P().innerHTML=`<h2>Make a feed</h2><span class="muted" style="margin-top:-8px">Give Rotty anything. Get 5 bite-size reels.</span>
   <div class="input-tabs" role="group" aria-label="What are you giving Rotty?">${[["pdf","📄","PDF"],["notes","📝","Notes"],["link","🔗","Link"],["photo","📷","Photo"]].map(([k,e,t],i)=>`<button class="tile" data-in="${k}" aria-pressed="${i===0}"><span class="em">${e}</span>${t}</button>`).join("")}</div>
   <div id="inBox"></div>
   <div class="card" style="background:var(--lilac2)"><b>🗓 Test coming up?</b><div class="row2"><input class="in" id="tName" placeholder="Bio quiz" aria-label="Test name" value="${S.test?esc(S.test.n):""}"><input class="in" id="tDate" type="date" aria-label="Test date" value="${S.test?S.test.d:""}"></div><small class="muted">Rotty spreads your reels out so you review a little each day.</small></div>
   <button class="cta pink" id="go">Cook my feed 🍳</button>`;
  let mode="pdf";const box=()=>{$("#inBox").innerHTML={pdf:`<label class="cta alt" style="text-align:center;cursor:pointer;display:block">📄 Upload a PDF<br><small class="muted">Slides, class notes or a textbook chapter</small><input type="file" accept="application/pdf" id="inPdf" hidden></label><div id="pdfOut"></div>`,notes:`<textarea class="in" id="inT" aria-label="Your notes">${NOTES}</textarea>`,
    link:`<input class="in" id="inL" value="https://en.wikipedia.org/wiki/Photosynthesis" aria-label="Link"><small class="muted">🔥 Firecrawl reads the page and turns it into clean text. Each reel links back to it.</small>`,
    photo:`<label class="cta alt" style="text-align:center;cursor:pointer">📷 Snap your notes or a textbook page<input type="file" accept="image/*" capture="environment" id="inP" hidden></label><div id="pPrev"></div>`,
    voice:`<button class="cta alt" id="inV">🎤 Tap and explain the topic out loud</button><div id="vOut" class="muted"></div>`}[mode];
    const pf=$("#inPdf");if(pf)pf.onchange=e=>readPdf(e.target.files[0]);
    const ip=$("#inP");if(ip)ip.onchange=e=>{const f=e.target.files[0];if(!f)return;shrinkImage(f).then(u=>{S.photo=u;$("#pPrev").innerHTML=`<img src="${u}" alt="Your photo" style="width:100%;max-height:150px;object-fit:cover;border-radius:14px;border:2px solid ${INK}">`}).catch(()=>toast("Couldn't open that photo"))};
    const iv=$("#inV");if(iv)iv.onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){$("#vOut").textContent="Voice isn't supported here. Try Chrome.";return}const rec=new SR();rec.onresult=e=>$("#vOut").textContent="“"+e.results[0][0].transcript+"”";try{rec.start();$("#vOut").textContent="Listening…"}catch(e){}}};
  box();P().querySelectorAll("[data-in]").forEach(b=>b.onclick=()=>{mode=b.dataset.in;P().querySelectorAll("[data-in]").forEach(x=>x.setAttribute("aria-pressed",x===b));box()});
  $("#go").onclick=()=>{const n=$("#tName").value.trim(),d=$("#tDate").value;if(n&&d)S.test={n,d};
    if(mode==="pdf"&&!S.pdf)return toast("Upload a PDF first (or try Notes)");
    if(mode==="photo"&&!S.photo)return toast("Snap or pick a photo first");
    let req;
    if(mode==="pdf")req=S.pdf.scanned?{type:"pdf-scan",data:{name:S.pdf.name,images:S.pdf.images}}:{type:"pdf",data:{name:S.pdf.name,pages:S.pdf.pages.map((t,k)=>({n:k+1,text:t}))}};
    else if(mode==="notes")req={type:"notes",data:$("#inT").value};
    else if(mode==="link")req={type:"link",data:$("#inL").value.trim()};
    else req={type:"photo",data:S.photo};
    if(mode==="notes"&&req.data.trim().length<40)return toast("Add a few more lines of notes first");
    S.src={pdf:S.pdf?S.pdf.name:"your PDF",notes:"your notes",link:"the link (via Firecrawl)",photo:"your photo"}[mode];cook(req)};
}
/* shrink a photo so it uploads fast (long edge 1600px, jpeg) */
function shrinkImage(file,max=1600){return new Promise((res,rej)=>{const img=new Image(),u=URL.createObjectURL(file);img.onload=()=>{const k=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement("canvas");c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL("image/jpeg",.85))};img.onerror=rej;img.src=u})}
const PDF_MAX_PAGES=40,PDF_MAX_MB=15,SCAN_MAX=20;
async function readPdf(f){if(!f)return;const out=$("#pdfOut");S.pdf=null;
  if(!window.pdfjsLib){out.innerHTML='<span class="muted">PDF reader is still loading. Try again in a second.</span>';return}
  if(f.size>PDF_MAX_MB*1024*1024){out.innerHTML=`<div class="card" style="box-shadow:none;background:var(--blush2)"><b>That PDF is a big one (${(f.size/1048576).toFixed(1)} MB)</b><span>Rotty can read up to ${PDF_MAX_MB} MB for now. Try one chapter at a time.</span></div>`;return}
  out.innerHTML=`<div class="card" style="box-shadow:none"><span class="muted" id="pdfProg">📖 Reading ${esc(f.name)}…</span></div>`;
  try{
   const doc=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise,n=doc.numPages,pages=[];
   if(n>PDF_MAX_PAGES){out.innerHTML=`<div class="card" style="box-shadow:none;background:var(--blush2)"><b>${n} pages is a lot!</b><span>Rotty reads up to ${PDF_MAX_PAGES} pages for now. Try splitting it into chapters.</span></div>`;return}
   for(let k=1;k<=n;k++){const pg=await doc.getPage(k),tc=await pg.getTextContent();pages.push(tc.items.map(x=>x.str).join(" ").replace(/\s+/g," ").trim());const pr=$("#pdfProg");if(pr)pr.textContent=`📖 Reading page ${k} of ${n}…`}
   const all=pages.join(" "),words=all.split(" ").filter(Boolean).length;
   const empty=pages.filter(t=>t.split(" ").filter(Boolean).length<3).length,scanned=empty>n/2;/* most pages have no text layer */S.pdf={name:f.name,pages,n,scanned};
   if(scanned){const m=Math.min(n,SCAN_MAX),images=[];
     for(let k=1;k<=m;k++){const pr=$("#pdfProg");if(pr)pr.textContent=`📷 No text layer. Snapping page ${k} of ${m} for Rotty to read…`;
       const pg=await doc.getPage(k),vp0=pg.getViewport({scale:1}),sc=Math.min(2,1400/Math.max(vp0.width,vp0.height)),vp=pg.getViewport({scale:sc}),c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;
       await pg.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;images.push({n:k,dataUrl:c.toDataURL("image/jpeg",.8)})}
     S.pdf.images=images;
     out.innerHTML=`<div class="card" style="box-shadow:none;background:var(--butter2)"><b>📷 ${esc(f.name)}</b><span>${n} page${n===1?"":"s"} · scanned (no text layer)</span><small class="muted">Rotty will read ${m===n?"the pages":"the first "+m+" pages"} with AI vision when you cook. Only the page pictures are sent, nothing else.</small></div>`;beep(700);return}
   out.innerHTML=`<div class="card" style="box-shadow:none;background:var(--mint2)"><b>✓ ${esc(f.name)}</b><span>${n} page${n===1?"":"s"} · ${words.toLocaleString()} words</span><div class="box" style="max-width:none;box-shadow:none;font-size:13.5px">${esc(all.slice(0,280))}…</div><small class="muted">Each reel will link to its page number. Only the text is sent, never the file.</small></div>`;beep(880)}
  catch(e){out.innerHTML=e&&e.name==="PasswordException"?`<div class="card" style="box-shadow:none;background:var(--blush2)"><b>🔒 This PDF has a password</b><span>Open it, save a copy without the password, then upload that.</span></div>`:`<span class="muted">Couldn't read that PDF. Is it a real PDF file?</span>`}}
function cook(req){const o=document.createElement("div");o.className="ov";o.innerHTML=`<div class="bob">${rotty("thinking",100)}</div><h3>Rotty is cooking your feed…</h3>
  <div class="cook">${["📖 Reading "+(req.type==="link"?"the page":req.type.startsWith("pdf")&&S.pdf?S.pdf.n+" PDF pages":req.type==="photo"?"your photo":"your notes"),"🔑 Finding the 5 big ideas","🎬 Making reels: watch, listen, read","🎮 Building games","📎 Checking every reel against your source"].map(x=>`<div>${x}</div>`).join("")}</div>
  <small class="muted" id="cookNote" aria-live="polite"></small>`;screen.appendChild(o);
  const rows=[...o.querySelectorAll(".cook div")];let k=0,anim=false,result=null;
  const finish=()=>{if(!anim||!result)return;o.remove();
    if(result.err){toast(result.err);return}
    if(!result.deck.id)result.deck.id="d"+Date.now();useDeck(result.deck);S.deckId=DECK.id;S.src=DECK.sourceLabel||S.src;S.built=true;S.idx=0;S.got=new Set();S.later=new Set();S.wrong=[];S.simple=new Set();S.seen=new Set();
    saveDeck(DECK);saveSettings(S);yay();show("feed");toast(result.note||"Your feed is ready! Swipe up 👆")};
  const t=setInterval(()=>{if(k>0)rows[k-1].className="ok";if(k<rows.length-1||(k===rows.length-1&&result)){rows[k].className="on";beep(500+k*90);k++}else if(k>=rows.length){clearInterval(t);anim=true;setTimeout(finish,350)}},S.calm?700:520);
  buildDeck(req,msg=>{const c=$("#cookNote");if(c)c.textContent=msg}).then(r=>{result=r;if(k>=rows.length){anim=true;finish()}});
}
/* Make -> /api/source -> /api/deck. Falls back to the sample deck in DEMO_MODE or offline. */
async function buildDeck(req,note){
  const demo=(why)=>({deck:{...DEMO_DECK,id:"demo",reels:DEMO_DECK.reels.map(r=>({...r}))},note:why});
  let src;
  if(req.type==="pdf-scan"){ // scanned PDF: Claude vision copies each page, one page per request
    const all=[];for(const [k,img] of req.data.images.entries()){note(`📷 Reading page ${img.n} of ${req.data.images.length}…`);
      const r=await post("source",{type:"photo",data:img.dataUrl,page:img.n,name:req.data.name},{timeoutMs:120000});
      if(r.demo||r.offline||(r.error&&k===0)){src=r;break}if(!r.error)all.push(...r.lines)}
    if(!src)src=all.length?{text:all.map(l=>l.text).join("\n"),lines:all.map((l,i)=>({...l,n:i+1})),sourceLabel:req.data.name}:{error:"Rotty couldn't read any of those pages."};
  }else src=await post("source",req);
  if(src.offline)return demo("📴 Offline, so here's the sample deck. Your real one cooks when you're back online.");
  if(src.error)return {err:"😕 "+src.error};
  if(src.demo)return demo("Demo mode: here's the sample Photosynthesis deck. Add API keys to cook your own!");
  note("✓ Read "+src.lines.length+" lines from "+src.sourceLabel+". Writing reels…");
  const brain={learn:[...S.learn],hard:[...S.hard],jr:S.jr,lang:S.lang};
  const dk=await post("deck",{text:src.text,lines:src.lines,brain,sourceLabel:src.sourceLabel},{timeoutMs:180000});
  if(dk.offline)return {err:"📴 Lost connection while cooking. Try again?"};
  if(dk.error)return {err:"😕 "+dk.error};
  if(dk.demo)return demo("Demo mode: here's the sample deck.");
  return {deck:{...dk.deck,sourceLabel:src.sourceLabel,sourceType:req.type.startsWith("pdf")?"pdf":req.type,lines:src.lines,text:src.text}};
}

/* ---------- feed ---------- */
function stage(r,i){
  const m=S.mode;
  if(m==="listen")return `<div class="box" data-pod="${i}"><div class="row2" style="align-items:center"><button class="cta" style="flex:none;width:52px;height:52px;padding:0;border-radius:50%" data-play aria-label="Play">▶</button><div class="wave">${Array.from({length:16},(_,k)=>`<i style="animation-delay:${(k%6)*.1}s"></i>`).join("")}</div></div>
    <div class="kar" id="kar${i}">${r.pod.map(([w,t])=>`<p style="margin:4px 0"><b>${w}:</b> ${t.split(" ").map(x=>`<w>${esc(x)}</w>`).join(" ")}</p>`).join("")}</div>
    <div class="chips">${[.75,1,1.25].map(sp=>`<button data-spd="${sp}" style="${sp===1?"background:var(--pink)":""}">${sp}×</button>`).join("")}</div>
    <div class="vibes chips">${[["chill","😌 Chill"],["hype","📣 Hype coach"],["cozy","🧸 Cozy"],["gamer","🎮 Gamer"]].map(([k,t])=>`<button data-vibe="${k}" style="${S.vibe===k?"background:var(--pink)":""}">${t}</button>`).join("")}</div></div>`;
  if(m==="read"){const simple=S.simple.has(i);return `<div class="box ${S.ruler?"ruled":""}" data-read="${i}"><span class="ruler" aria-hidden="true"></span><b style="font-family:var(--head);font-size:19px">${esc(r.t)}</b>
    ${simple?`<p style="margin:0;font-size:17px">${txt(r.simple)}</p>`:`<ul>${r.read.map(x=>`<li>${txt(x)}</li>`).join("")}</ul>`}
    <div class="chips"><button data-simple>${simple?"↩ Full version":"🧸 Simpler please"}</button><button data-bion>${S.bionic?"✓ ":""}Bionic</button><button data-rul>${S.ruler?"✓ ":""}Ruler</button><button data-ra>🔊 Read aloud</button></div></div>`}
  if(m==="play"&&!S.tapQuiz)return `<div class="box" style="text-align:center;justify-items:center">${ROAD}<b style="font-family:var(--head);font-size:20px">Quiz Run 3D</b><span class="muted" style="font-size:14px">Run through the gate with the right answer!${S.notimer?" The gates wait for you.":""}</span><button class="cta pink" data-run>▶ Play</button><button class="cta alt" style="padding:9px" data-tapq>Prefer a simple tap quiz?</button></div>`;
  if(m==="play"){return `<div class="box" data-quiz="${i}"><b style="font-family:var(--head);font-size:18px">${esc(r.q[0])}</b><div class="opts">${r.q[1].map((o,k)=>`<button class="opt" data-ans="${k}">${esc(o)}</button>`).join("")}</div>
    ${S.voice?`<button class="cta alt" data-vans style="padding:10px">🎤 Say your answer</button>`:""}<small class="muted">${S.notimer?"No timer. Take your time.":"No rush. Retries are free."}</small><button class="chips" style="justify-self:start" data-run><span>🎮 Play it in 3D instead</span></button></div>`}
  const lines=S.story?r.story:r.cap;return `<div style="width:100%;text-align:center">${DECK.demo?SC[i]:`<div class="gen-scene bob">${sq(PETS[i%PETS.length][0],130)}</div>`}<div class="cap" data-cap="${i}" aria-live="polite"></div>${S.story?'<div class="chips" style="justify-content:center;margin-top:6px"><span>📖 Story mode</span></div>':""}</div>`;
}
function renderFeed(keep){
  const V=$("#feedV");if(!V)return;
  if(!S.built){V.innerHTML=`<div class="pad" style="align-items:center;text-align:center;padding-top:110px">${rotty("sleepy",110)}<h2>No feed yet</h2><p class="muted" style="margin:0">Drop your notes, a link or a photo and Rotty makes one.</p><button class="cta pink" onclick="show('make')">➕ Make my feed</button><button class="cta alt" onclick="S.built=true;renderFeed()">Try the sample (Photosynthesis)</button></div>`;return}
  const top=keep?V.scrollTop:0;
  const ord=feedOrder(),due=dueToday(S,did()),slots=[];ord.forEach((i,pos)=>{slots.push(reel(DECK.reels[i],i,pos,ord,due.includes(i)));if(pos===2)slots.push(gameSlot())});slots.push(limitSlot(ord.length));
  V.innerHTML=slots.join("");V.scrollTop=top;bindFeed();tickCaps();
}
function reel(r,i,pos=i,ord=DECK.reels.map((_,k)=>k),isRev=false){const n=DECK.reels[ord[pos+1]];return `<article class="slot" data-i="${i}" style="--a:${r.a}">
  <div class="modes" role="group" aria-label="How do you want to learn this?">${[["watch","👀"],["listen","🎧"],["read","📖"],["play","🎮"]].map(([k,e])=>`<button data-m="${k}" aria-pressed="${S.mode===k}">${e} ${k[0].toUpperCase()+k.slice(1)}</button>`).join("")}</div>
  <div class="dots3" aria-hidden="true">${ord.map((_,k)=>`<i class="${k<=pos?"on":""}"></i>`).join("")}</div>
  <div class="stage">${stage(r,i)}</div>
  <div class="info"><span class="num">${pos+1} of ${ord.length} · ${esc(DECK.title)}${isRev?" · 🔁 Review":""}</span><h3>${esc(r.t)}</h3><span class="src">📎 From ${srcRef(r)}</span>${S.calm&&n?`<span class="next">Next: ${esc(n.t)}</span>`:""}</div>
  <div class="rail"><button class="rb ${S.got.has(i)?"on":""}" data-a="got"><span class="o">✅</span>Got it</button><button class="rb" data-a="g3"><span class="o">🎮</span>3D quiz</button><button class="rb" data-a="ask"><span class="o">💬</span>Ask</button><button class="rb" data-a="more"><span class="o">⋯</span>More</button></div></article>`}
function gameSlot(){return `<article class="slot" data-game style="--a:#f1eaf7"><div class="pad" style="padding-top:64px;padding-right:16px">
  <div style="display:flex;gap:8px;align-items:center">${sq("frog",54)}<div><h2 style="font-size:26px">Game time! 🎮</h2><span class="muted" style="font-size:14px">Real 3D games made from your ${esc(S.src)}.</span></div></div>
  <button class="card" data-g="run" style="text-align:left;cursor:pointer;background:var(--butter2)"><b>🏃 Quiz Run 3D</b><span>Dash down the track and run through the gate with the right answer.</span>${ROAD}</button>
  ${hasSteps()?`<button class="card" data-g="tower" style="text-align:left;cursor:pointer;background:var(--mint2)"><b>🧱 Step Tower 3D</b><span>Stack the steps of ${esc(DECK.title.toLowerCase())} in the right order. Tall tower = you know it!</span></button>`:""}
  <small class="muted">Use ← → keys, swipe, or tap the answer buttons. ${S.notimer?"No-timer mode is on: the game waits for you.":""}</small></div></article>`}
function limitSlot(cnt=DECK.reels.length){const rv=pileN();return `<article class="slot" data-limit style="--a:#fcf3d6"><div class="pad" style="align-items:center;text-align:center;padding-top:90px">${rotty("sleepy",120)}<h2>That's your ${cnt} for today! 🎉</h2>
  <p class="muted" style="margin:0">You showed up for your brain today. Rotty's napping now. Brains need breaks too.</p>
  <div class="stats" style="width:100%"><div><b>${S.xp}</b><small>XP</small></div><div><b>${S.streak}</b><small>day streak</small></div><div><b>${rv}</b><small>in review pile</small></div></div>
  <div style="width:100%;text-align:left">${petCard()}</div><button class="cta" onclick="show('me')">🧸 See my buddy</button><button class="cta alt" onclick="toast('Shared! Your friend gets the same 5 reels to beat your score.')">⚔️ Duel a friend</button></div></article>`}
let capK=0;function tickCaps(){$$("[data-cap]").forEach(el=>{const r=DECK.reels[+el.dataset.cap],lines=S.story?r.story:r.cap,l=lines[capK%lines.length];el.innerHTML=l.split(" ").map((w,k)=>`<span style="animation-delay:${k*.07}s">${esc(w)}</span>`).join(" ")})}
setInterval(()=>{capK++;tickCaps()},S.calm?3600:2700);
function bindFeed(){
  const V=$("#feedV");
  V.onclick=ev=>{const slot=ev.target.closest(".slot");if(!slot)return;
    if(slot.hasAttribute("data-game")){const g=ev.target.closest("[data-g]");if(g)return g.dataset.g==="run"?quizRun(0):stepTower();return}
    if(!slot.dataset.i)return;const i=+slot.dataset.i,r=DECK.reels[i];
    const mb=ev.target.closest("[data-m]");if(mb){S.mode=mb.dataset.m;hush();slot.querySelectorAll("[data-m]").forEach(b=>b.setAttribute("aria-pressed",b===mb));slot.querySelector(".stage").innerHTML=stage(r,i);tickCaps();beep(600);return}
    if(ev.target.closest("[data-play]"))return podcast(slot,r,i,1);
    const vb=ev.target.closest("[data-vibe]");if(vb){S.vibe=vb.dataset.vibe;slot.querySelectorAll("[data-vibe]").forEach(x=>x.style.background=x===vb?"var(--pink)":"");return podcast(slot,r,i,1)}
    const sp=ev.target.closest("[data-spd]");if(sp){slot.querySelectorAll("[data-spd]").forEach(x=>x.style.background=x===sp?"var(--pink)":"");return podcast(slot,r,i,+sp.dataset.spd)}
    if(ev.target.closest("[data-simple]")){S.simple.has(i)?S.simple.delete(i):S.simple.add(i);slot.querySelector(".stage").innerHTML=stage(r,i);return}
    if(ev.target.closest("[data-bion]")){S.bionic=!S.bionic;slot.querySelector(".stage").innerHTML=stage(r,i);return}
    if(ev.target.closest("[data-rul]")){S.ruler=!S.ruler;slot.querySelector(".stage").innerHTML=stage(r,i);return}
    if(ev.target.closest("[data-ra]"))return say(S.simple.has(i)?r.simple:r.t+". "+r.read.join(". "));
    if(ev.target.closest("[data-run]"))return quizRun(i);
    if(ev.target.closest("[data-tapq]")){S.tapQuiz=true;slot.querySelector(".stage").innerHTML=stage(r,i);return}
    const an=ev.target.closest("[data-ans]");if(an)return answer(slot,r,i,+an.dataset.ans);
    if(ev.target.closest("[data-vans]")){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast("Voice isn't supported here. Try Chrome.");const rec=new SR();rec.onresult=e=>{const heard=e.results[0][0].transcript.toLowerCase(),k=r.q[1].findIndex(o=>heard.includes(o.toLowerCase().split(" ")[0]));toast("Heard: “"+heard+"”");answer(slot,r,i,k<0?99:k)};try{rec.start();toast("Listening…")}catch(e){}return}
    const a=ev.target.closest("[data-a]")?.dataset.a;if(!a)return;
    if(a==="got"){learned(i);S.xp+=5;ev.target.closest(".rb").classList.add("on");yay();toast("Nice! +5 XP");return}
    if(a==="later"){later(i);ev.target.closest(".rb").classList.add("on");toast("Saved. It'll come back tomorrow 🔁");return}
    if(a==="jingle")return jingle(r);
    if(a==="ask")return ask(r);
    if(a==="g3")return quizRun(i);
    if(a==="more")return more(r,i);
  };
  const rule=(t,cy)=>{const b=t.closest&&t.closest(".box.ruled");if(!b)return;const ru=b.querySelector(".ruler"),y=cy-b.getBoundingClientRect().top+b.scrollTop-20;ru.style.top=Math.max(0,y)+"px"};
  V.onpointermove=e=>rule(e.target,e.clientY);V.ontouchmove=e=>{const t=e.touches[0];if(t)rule(e.target,t.clientY)};
  let last=-1;V.onscroll=()=>{const k=Math.round(V.scrollTop/V.clientHeight);if(k!==last){last=k;hush();S.seen.add(k)}};
}
function answer(slot,r,i,k){const ok=k===r.q[2];slot.querySelectorAll("[data-ans]").forEach(b=>{b.disabled=true;if(+b.dataset.ans===r.q[2])b.classList.add("right");else if(+b.dataset.ans===k)b.classList.add("wrong")});
  const box=slot.querySelector("[data-quiz]");box.insertAdjacentHTML("beforeend",`<div class="opt ${ok?"right":"wrong"}" style="display:block"><b>${ok?"🎉 Yes!":"💛 Not quite, that's okay."}</b> <small>${esc(r.q[3])}</small></div>${ok?"":`<button class="cta alt" style="padding:10px" data-retry>Try again</button>`}`);
  if(ok){S.xp+=10;learned(i);yay()}else{missed(i);beep(330,.15,"triangle")}
  const rt=box.querySelector("[data-retry]");if(rt)rt.onclick=()=>{slot.querySelector(".stage").innerHTML=stage(r,i)}}
let podT;function podcast(slot,r,i,rate){const box=slot.querySelector("[data-pod]");clearTimeout(podT);hush();box.classList.add("on");
  const words=[...box.querySelectorAll("w")];words.forEach(w=>w.classList.remove("on"));const all=r.pod.map(p=>p[1]).join(" ");
  const V={chill:[1,1],hype:[1.15,1.25],cozy:[.9,.85],gamer:[1.1,1.4]}[S.vibe]||[1,1];const intro={hype:"Let's GO! ",cozy:"Okay, get comfy. ",gamer:"New quest unlocked. ",chill:""}[S.vibe]||"";
  const u=say(intro+all,rate*V[0]);if(u)u.pitch=V[1];let n=0;const step=()=>{words.forEach(w=>w.classList.remove("on"));if(n<words.length){words[n].classList.add("on");n++;podT=setTimeout(step,330/rate)}else box.classList.remove("on")};step();
  if(u){u.onboundary=e=>{if(e.name!=="word")return;clearTimeout(podT);const idx=(intro+all).slice(0,e.charIndex).split(" ").length-1-(intro?intro.trim().split(" ").length:0);words.forEach((w,k)=>w.classList.toggle("on",k===idx))};u.onend=()=>{clearTimeout(podT);box.classList.remove("on");words.forEach(w=>w.classList.remove("on"))}}}
function game(ev,slot){
  const it=ev.target.closest("[data-it]");if(it){slot.querySelectorAll("[data-it]").forEach(x=>x.setAttribute("aria-pressed",x===it));beep(620);return}
  const bk=ev.target.closest("[data-b]");if(bk){const sel=slot.querySelector('[data-it][aria-pressed="true"]');if(!sel)return toast("Tap a word first");const [w,g]=(DECK.sort||SORT)[+sel.dataset.it];
    if(g===bk.dataset.b){bk.insertAdjacentHTML("beforeend",`<span class="itm" style="background:var(--mint)">${w}</span>`);sel.remove();S.xp+=4;beep(880);if(!slot.querySelector("[data-it]")){yay();toast("Sort Drop cleared! +20 XP");S.xp+=20}}
    else{sel.classList.add("stp");sel.classList.add("shake");setTimeout(()=>sel.classList.remove("shake","stp"),400);toast(w+(g==="in"?" goes IN":" comes OUT")+". Try again!");beep(300,.15,"triangle")}return}
  const st=ev.target.closest(".stp[data-k]");if(st){const need=slot.querySelectorAll(".stp.done").length;if(+st.dataset.k===need){st.classList.add("done");st.querySelector(".n").textContent=need+1;beep(700+need*80);if(need+1===DECK.steps.length){yay();S.xp+=20;toast("Stacked! +20 XP")}}
    else{st.classList.add("shake");setTimeout(()=>st.classList.remove("shake"),400);beep(300,.15,"triangle")}}}

/* ---------- jingle (Create) ---------- */
const BEATS={lofi:{bpm:78,notes:[392,440,494,440,392,330,349,392],type:"triangle"},pop:{bpm:118,notes:[523,587,659,587,523,659,784,659],type:"square"},lull:{bpm:64,notes:[330,392,440,392,330,294,262,294],type:"sine"}};
function jingle(r){let beat="lofi",T=[];const stop=()=>{T.forEach(clearTimeout);T=[];hush()};
  openSheet(`<h4 id="sheetTitle">🎵 Jingle: ${esc(r.t)}</h4><p class="sub">A catchy rhyme to remember it. Pick a beat!</p>
   <div class="chips" style="margin-bottom:10px">${[["lofi","☁️ Lo-fi"],["pop","✨ Pop"],["lull","🌙 Lullaby"]].map(([k,t])=>`<button data-bt="${k}" style="${k===beat?"background:var(--pink)":""}">${t}</button>`).join("")}</div>
   <div class="card" style="text-align:center">${r.jingle.map((l,k)=>`<div class="lyric" data-ly="${k}">${esc(l)}</div>`).join("")}</div>
   <div class="row2" style="margin-top:10px"><button class="cta" id="jPlay">▶ Play jingle</button><button class="cta alt" id="jSave">💾 Save to Me</button></div>
   ${DECK.demo?"":`<button class="cta alt" id="jNew" style="margin-top:8px;padding:10px">✨ New rhyme</button>`}`);
  const jn=$("#jNew");if(jn)jn.onclick=async()=>{jn.disabled=true;jn.textContent="✍️ Writing…";const j=await post("jingle",{reel:{t:r.t,read:r.read,jingle:r.jingle}});jn.disabled=false;jn.textContent="✨ New rhyme";
    if(j.error||j.demo||!j.jingle)return toast(j.error?"😕 "+j.error:"Needs an API key");r.jingle=j.jingle;saveDeck(DECK);$("#sheet").querySelectorAll("[data-ly]").forEach((x,k)=>x.textContent=r.jingle[k]||"")};
  $("#sheet").querySelectorAll("[data-bt]").forEach(b=>b.onclick=()=>{beat=b.dataset.bt;$("#sheet").querySelectorAll("[data-bt]").forEach(x=>x.style.background=x===b?"var(--pink)":"")});
  $("#sheet .x").onclick=()=>{stop();closeSheet()};$("#jSave").onclick=()=>{saveDeck(DECK);toast("Saved to your jingles 🎵")};
  $("#jPlay").onclick=()=>{stop();const B=BEATS[beat],sp=60/B.bpm;const wasCalm=S.calm;S.calm=false;
    B.notes.concat(B.notes).forEach((f,k)=>beep(f,sp*.8,B.type,k*sp));S.calm=wasCalm;
    r.jingle.forEach((l,k)=>T.push(setTimeout(()=>{$$("[data-ly]").forEach(x=>x.classList.toggle("on",+x.dataset.ly===k));say(l,beat==="lull"?.85:beat==="pop"?1.15:1)},k*sp*8*1000)));
    T.push(setTimeout(()=>$$("[data-ly]").forEach(x=>x.classList.remove("on")),r.jingle.length*sp*8*1000))}}

/* ---------- ask (grounded) ---------- */
function localAsk(q){const words=q.toLowerCase().match(/[a-z]{4,}/g)||[];let best=null,score=0;
  DECK.reels.forEach(rr=>rr.read.concat(rr.simple).forEach(line=>{const s=words.filter(w=>line.toLowerCase().includes(w.replace(/s$/,""))).length;if(s>score){score=s;best={line,rr}}}));
  if(DECK.demo&&/green/.test(q.toLowerCase())){best={line:DECK.reels[2].read[2],rr:DECK.reels[2]};score=2}
  return score?{answer:best.line,line:best.rr.line,ref:srcRef(best.rr)}:{answer:null}}
function ask(r){const chips=DECK.demo?["Why are leaves green?","What goes in?","What comes out?","Who was Darwin?"]:DECK.reels.slice(0,3).map(x=>x.t.replace(/[?.!]*$/,"?"));
  openSheet(`<h4 id="sheetTitle">💬 Ask Rotty</h4><p class="sub">I only answer from your ${DECK.demo?"notes":esc(DECK.sourceType==="pdf"?"PDF":DECK.sourceType==="link"?"page":"notes")}, and I show where it came from.</p>
  <div class="chips">${chips.map(q=>`<button data-q>${esc(q)}</button>`).join("")}</div>
  <div class="chat" id="chat" aria-live="polite"></div><form class="ask" id="af"><input id="aq" placeholder="Ask about ${esc(DECK.title)}…" aria-label="Your question"><button>Ask</button></form>`);
  const go=async q=>{$("#chat").insertAdjacentHTML("beforeend",`<div class="me">${esc(q)}</div>`);
    let res=null;if(!DECK.demo){const j=await post("ask",{question:q,deck:{title:DECK.title,reels:DECK.reels.map(x=>({t:x.t,read:x.read,line:x.line}))},lines:DECK.lines||[]});if(!j.error&&!j.demo)res={answer:j.answer,line:j.line,ref:j.line?srcAt(j.line):esc(DECK.sourceLabel)}}
    if(!res){await new Promise(r=>setTimeout(r,400));res=localAsk(q)}
    const c=$("#chat");if(!c)return;
    c.insertAdjacentHTML("beforeend",res.answer?`<div class="bot">${esc(res.answer)}<br><span class="src" style="display:inline-block;margin-top:6px">📎 ${res.ref}</span></div>`:`<div class="bot">That's not in your notes, so I won't guess. 🙈</div>`)};
  $("#sheet").querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>go(b.textContent));$("#af").onsubmit=e=>{e.preventDefault();const q=$("#aq").value.trim();if(q){$("#aq").value="";go(q)}}}
function srcAt(n){const L=(DECK.lines||[]).find(l=>l.n===n);if(L&&L.page)return esc(DECK.sourceLabel)+", page "+L.page;return esc(DECK.sourceLabel)+(DECK.sourceType==="notes"?", line "+n:"")}

/* ---------- more ---------- */
function more(r,i){openSheet(`<h4 id="sheetTitle">More</h4><p class="sub">${esc(r.t)}</p><div style="display:grid;gap:8px">
  <button class="opt" data-mo="story">📖 ${S.story?"Turn off story mode":"Story mode: tell it as a story"}</button>
  <button class="opt" data-mo="jingle">🎵 Make it a jingle</button>
  <button class="opt" data-mo="later">🔁 Review this tomorrow</button>
  <button class="opt" data-mo="teach">🧑‍🏫 Teach it back to Rotty</button>
  <button class="opt" data-mo="simple">🧸 Explain it simpler</button>
  <div class="opt">🌎 Translate <select id="lang" style="border:2px solid ${INK};border-radius:10px;padding:4px;background:var(--card)">${["English","Español","中文","Tiếng Việt","हिन्दी","العربية"].map(l=>`<option ${l===S.lang?"selected":""}>${l}</option>`).join("")}</select></div>
  <button class="opt" data-mo="src">📎 See the source</button>
  <button class="opt" data-mo="class">👩‍🏫 Share with my class (teacher page)</button>
  <button class="opt" data-mo="flag">🚩 Report a mistake</button></div>`);
  $("#lang").onchange=async e=>{const lang=e.target.value;closeSheet();
    if(DECK.demo){S.lang=lang;return toast("Reels will play in "+lang+" (demo)")}
    if(!DECK.original)DECK.original=JSON.parse(JSON.stringify({title:DECK.title,reels:DECK.reels,steps:DECK.steps,sort:DECK.sort}));
    if(lang==="English"){Object.assign(DECK,DECK.original);S.lang=lang;saveDeck(DECK);renderFeed(true);return toast("Back to English")}
    toast("🌎 Translating to "+lang+"…");const j=await post("translate",{deck:DECK.original,lang},{timeoutMs:120000});
    if(j.error||j.demo)return toast(j.demo?"Translate needs an API key (demo mode)":"😕 "+j.error);
    Object.assign(DECK,{title:j.deck.title,reels:j.deck.reels.map((x,k)=>({...DECK.original.reels[k],...x})),steps:j.deck.steps||DECK.steps,sort:j.deck.sort||DECK.sort});S.lang=lang;saveDeck(DECK);saveSettings(S);renderFeed(true);toast("🌎 Now in "+lang)};
  $("#sheet").querySelectorAll("[data-mo]").forEach(b=>b.onclick=()=>{const k=b.dataset.mo;closeSheet();
    if(k==="story"){S.story=!S.story;S.mode="watch";renderFeed(true);toast(S.story?"📖 Story mode on":"Story mode off")}
    if(k==="teach")return teach(r);
    if(k==="jingle")return jingle(r);
    if(k==="later"){later(i);return toast("Saved. It'll come back tomorrow 🔁")}
    if(k==="simple"){S.simple.add(i);S.mode="read";renderFeed(true)}
    if(k==="src")openSheet(`<h4 id="sheetTitle">📎 Source</h4><p class="sub">Every reel is checked against where it came from.</p>${DECK.demo?`<div class="card"><b>${esc(S.src)}</b><span>${S.src==="your notes"?esc(NOTES.split("\n")[r.line]):"“"+esc(r.read[0])+"…”"}</span></div>`:`<div class="card"><b>📎 ${srcRef(r)}</b>${lineText(r.line)?`<span>${esc(lineText(r.line))}</span>`:""}${(r.quotes||[]).length?`<small class="muted">Quotes this reel is built on:</small>${r.quotes.map(q=>`<span class="bot" style="font-size:14px">“${esc(q)}”</span>`).join("")}`:""}</div>`}`);
    if(k==="class")toast("Class link copied. Teachers see the deck and class progress (built with Lovable).");
    if(k==="flag")toast("Thanks! Rotty will double-check this reel.")})}

function teach(r){const keys=[...new Set(r.read.join(" ").toLowerCase().match(/[a-zé₂₆₁]{5,}/g))].filter(w=>!["their","there","about","which","mostly","called","inside","plants","contain","tiny"].includes(w)).slice(0,8);
  openSheet(`<h4 id="sheetTitle">🧑‍🏫 Teach Rotty</h4><p class="sub">Explain “${esc(r.t)}” like Rotty is 5. Teaching it is the best way to remember it!</p>
   <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">${rotty("thinking",56)}<span class="bot" style="flex:1">I'm listening! What is it? 🤔</span></div>
   <textarea class="in" id="tb" placeholder="Type or tap 🎤 and say it…"></textarea><div class="row2" style="margin-top:8px"><button class="cta alt" id="tbMic">🎤 Say it</button><button class="cta" id="tbGo">Teach!</button></div><div id="tbR" style="margin-top:10px"></div>`);
  $("#tbMic").onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast("Voice isn't supported here. Try Chrome.");const rec=new SR();rec.onresult=e=>{$("#tb").value=e.results[0][0].transcript};try{rec.start();toast("Listening…")}catch(e){}};
  $("#tbGo").onclick=async()=>{const raw=$("#tb").value,t=raw.toLowerCase();if(t.length<8)return toast("Tell Rotty a bit more!");
    if(!DECK.demo){$("#tbR").innerHTML=`<span class="muted">🤔 Rotty is thinking…</span>`;const j=await post("teach",{reel:{t:r.t,read:r.read,simple:r.simple},explanation:raw});
      if(!j.error&&!j.demo&&j.stars){const st=Math.max(1,Math.min(3,j.stars));S.xp+=st*5;if(st===3)yay();else beep(700);
        $("#tbR").innerHTML=`<div class="card" style="box-shadow:none"><b>${"⭐".repeat(st)}${"☆".repeat(3-st)} ${["","Good start!","Nice teaching!","You're a pro teacher!"][st]}</b>${(j.mentioned||[]).length?`<span>✓ You mentioned: ${esc(j.mentioned.slice(0,4).join(", "))}</span>`:""}${(j.missing||[]).length?`<span>💡 Try adding: ${esc(j.missing.slice(0,3).join(", "))}</span>`:""}</div>`;return}}
    const hit=keys.filter(k=>t.includes(k.slice(0,5))),miss=keys.filter(k=>!hit.includes(k)).slice(0,3),stars=Math.min(3,Math.max(1,Math.ceil(hit.length/Math.max(1,keys.length)*3+(t.length>60?1:0))));
    S.xp+=stars*5;if(stars===3)yay();else beep(700);
    $("#tbR").innerHTML=`<div class="card" style="box-shadow:none"><b>${"⭐".repeat(stars)}${"☆".repeat(3-stars)} ${["","Good start!","Nice teaching!","You're a pro teacher!"][stars]}</b>${hit.length?`<span>✓ You mentioned: ${hit.slice(0,4).join(", ")}</span>`:""}${miss.length?`<span>💡 Try adding: ${miss.join(", ")}</span>`:""}</div>`}}
/* ---------- focus ---------- */
function renderFocus(){
  const days=S.test?Math.max(0,Math.ceil((new Date(S.test.d)-new Date())/864e5)):null;
  P().innerHTML=`<h2>Focus</h2><span class="muted" style="margin-top:-8px">Small steps. No guilt.</span>${petCard()}
   <button class="card" id="one" style="background:var(--butter);text-align:left;cursor:pointer"><b>▶ Just 1 reel</b><span>Starting is the hardest part. Do one, then decide.</span></button>
   <div class="card" style="background:var(--mint2)"><b>👯 Study with Rotty</b><span class="muted" style="font-size:14px">Rotty studies next to you, so it's easier to stay on track.</span>
    <div class="row2">${[5,10,15].map(m=>`<button class="tile" data-bd="${m}"><span class="em">${m===5?"🌱":m===10?"🌿":"🌳"}</span>${m} min</button>`).join("")}</div></div>
   <div class="card" style="background:var(--lilac2)"><b>🗓 Test countdown</b>${S.test?`<span><b>${esc(S.test.n)}</b> in <b>${days}</b> day${days===1?"":"s"}</span><span class="muted" style="font-size:14px">Plan: 5 reels a day + your review pile. Rotty reminds you gently.</span>`:`<span class="muted">Add a test date in Make, and Rotty plans your days.</span>`}</div>
   <div class="card"><b>🔁 Review pile</b><span>${pileN()} reel${pileN()===1?"":"s"} in your pile (things you saved or missed). ${dueN()} due today.</span></div>
   <button class="cta alt" onclick="breathe()">😮‍💨 I'm overwhelmed</button>`;
  $("#one").onclick=()=>{if(!S.built)S.built=true;show("feed");toast("Just this one. You've got it 💪")};
  P().querySelectorAll("[data-bd]").forEach(b=>b.onclick=()=>buddy(+b.dataset.bd));
}
function buddy(min){const o=document.createElement("div");o.className="ov";let sec=min*60,pause=false;
  o.innerHTML=`<button class="back" aria-label="Stop">←</button><div class="bob">${rotty("thinking",120)}</div><h3>Rotty is studying with you</h3>
   <div style="font-family:var(--head);font-size:48px" id="bt">${S.notimer?"🌱":min+":00"}</div><span class="muted">${S.notimer?"No timer. Rotty taps you gently when time's up.":"Phone down, brain on. You can do this."}</span>
   <div class="row2" style="width:100%;max-width:300px"><button class="cta alt" id="bp">⏸ Pause</button><button class="cta" id="bdone">I'm done</button></div>`;screen.appendChild(o);
  const t=setInterval(()=>{if(pause)return;sec--;const e=$("#bt");if(e&&!S.notimer)e.textContent=Math.floor(sec/60)+":"+String(sec%60).padStart(2,"0");if(sec<=0)fin()},1000);
  const fin=()=>{clearInterval(t);o.remove();S.xp+=15;yay();toast("Focus level complete! +15 XP 🌳")};
  o.querySelector(".back").onclick=()=>{clearInterval(t);o.remove()};$("#bp").onclick=e=>{pause=!pause;e.target.textContent=pause?"▶ Resume":"⏸ Pause"};$("#bdone").onclick=fin}
function breathe(){const o=document.createElement("div");o.className="ov";o.innerHTML=`<button class="back" aria-label="Close">←</button><h3>Let's breathe together</h3><div class="breath">${rotty("proud",90)}</div><div style="font-family:var(--head);font-size:24px" id="bw">Breathe in…</div><span class="muted">3 slow breaths. Nothing else matters right now.</span><button class="cta" id="tiny" hidden style="max-width:300px">One tiny step: watch 1 reel</button><button class="cta alt" id="rest" hidden style="max-width:300px">Take a real break instead</button>`;screen.appendChild(o);
  let k=0;const t=setInterval(()=>{k++;const w=$("#bw");if(w)w.textContent=k%2?"Breathe out…":"Breathe in…";if(k>=5){clearInterval(t);if(w)w.textContent="Nice. You're okay. 💛";$("#tiny").hidden=false;$("#rest").hidden=false}},S.calm?4000:4000);
  o.querySelector(".back").onclick=()=>{clearInterval(t);o.remove()};$("#tiny").onclick=()=>{o.remove();S.built=true;show("feed")};$("#rest").onclick=()=>{o.remove();toast("Good call. Rotty will be here when you're back 🌙")}}
$("#ovBtn").onclick=breathe;

/* ---------- me ---------- */
function renderMe(){const lead=S.learn.has("listen")?"🎧 Audio Explorer":S.learn.has("play")?"🎮 Game Brain":S.learn.has("read")?"📖 Page Turner":"👀 Visual Thinker";
  const T=(k,t,d)=>`<div class="tgl"><span>${t}<small>${d}</small></span><button class="sw" role="switch" data-set="${k}" aria-checked="${!!S[k]}" aria-label="${t}"></button></div>`;
  P().innerHTML=`<div style="display:flex;gap:10px;align-items:center">${rotty("proud",70)}<div><h2>My brain</h2><span class="muted">${lead}</span></div></div>
   <div class="stats"><div><b>${S.xp}</b><small>XP</small></div><div><b>${S.streak}</b><small>day streak · breaks are OK</small></div><div><b>${S.got.size}</b><small>reels mastered</small></div></div>
   ${petCard()}
   <details class="more"><summary>🎯 Focus tools</summary><div class="in"><button class="opt" onclick="S.built=true;show('feed');toast('Just this one. You\'ve got it 💪')">▶ Just 1 reel <small>when starting is hard</small></button><button class="opt" onclick="buddy(10)">👯 Study with Rotty, 10 min <small>a body double</small></button><button class="opt" onclick="breathe()">😮‍💨 I'm overwhelmed <small>breathe, then one tiny step</small></button><span>${S.test?`🗓 <b>${esc(S.test.n)}</b>: Rotty spreads your reels out until then.`:"🗓 Add a test date in Make."}</span><span>🔁 ${pileN()} reel${pileN()===1?"":"s"} in your review pile, ${dueN()} due today. Missed reels come back tomorrow, then in 3 days, then a week.</span>
     <div class="tgl" style="border:0"><span>📏 Reels per day<small>Rotty stops after this many. Brains need breaks.</small></span><div class="chips" style="flex:none">${[3,5].map(n=>`<button data-limit="${n}" aria-pressed="${S.limit===n}" style="${S.limit===n?"background:var(--pink)":""}">${n}</button>`).join("")}</div></div></div></details>
   <details class="more" id="decksFold"><summary>📚 My decks</summary><div class="in" id="deckList"><span class="muted">Loading…</span></div></details>
   <details class="more"><summary>🧠 Brain modes</summary><div class="in">
    ${T("night","🌗 Night look","Navy doodle notebook instead of pastel")}
    ${T("calm","🍃 Calm mode","No motion or sounds, softer colors, shows what's next")}
    ${T("dys","🔤 Easy-read font","Wider letters and spacing")}
    ${T("bionic","𝗕 Bionic reading","Bold word starts to guide your eyes")}
    ${T("ruler","📏 Line ruler","A highlight band follows your reading")}
    ${T("big","🔍 Big text","Everything a bit larger")}
    ${T("notimer","⏱ No-timer mode","No countdowns anywhere")}
    ${T("voice","🎤 Answer by voice","Say answers instead of tapping or typing")}
    ${T("sound","🔈 Sounds","Little happy beeps")}
    <div class="tgl"><span>🎨 Color tint<small>Some readers find a tint easier</small></span><div class="row2" style="flex:none">${[["none","#fffdf8"],["peach","#f3cfb4"],["blue","#b9d8ea"],["lilac","#d9c6e6"],["mint","#bfe0cf"]].map(([k,c])=>`<button class="swatch" data-tint="${k}" aria-pressed="${S.tint===k}" style="background:${c}" aria-label="${k} tint"></button>`).join("")}</div></div>
   </div></details>
   <details class="more"><summary>🧸 StudyRot Jr</summary><div class="in"><span>Bigger buttons, simpler words and no social features. For younger kids, with a grown-up.</span>${T("jr","StudyRot Jr","Kid mode")}</div></details>
   <details class="more"><summary>👩‍🏫 Teacher and parent page</summary><div class="in"><span>Share a deck with a class and see progress. Built with Lovable. Students' brain settings stay private.</span><button class="cta alt" onclick="toast('Teacher page link copied (demo)')">Copy class link</button></div></details>
   <details class="more"><summary>🔒 Privacy</summary><div class="in"><span>Your notes and brain settings stay yours. No ads. Kids' mode has no accounts or chat.</span></div></details>
   <details class="more"><summary>🐣 Change study buddy</summary><div class="in"><div class="tiles t3">${PETS.map(([k,n])=>`<button class="tile" data-pet2="${k}" aria-pressed="${S.pet===k}">${sq(k,40)}${n}</button>`).join("")}</div></div></details>
   <button class="cta alt" id="redo">🔄 Retake the brain quiz</button>`;
  P().querySelectorAll("[data-pet2]").forEach(b=>b.onclick=()=>{S.pet=b.dataset.pet2;S.petName=PETS.find(x=>x[0]===S.pet)[1];renderMe();toast("Say hi to "+S.petName+"!")});
  P().querySelectorAll("[data-set]").forEach(b=>b.onclick=()=>{const k=b.dataset.set;S[k]=!S[k];b.setAttribute("aria-checked",S[k]);if(k==="jr"){S.big=S.jr}apply();toast(b.getAttribute("aria-label")+(S[k]?" on":" off"))});
  P().querySelectorAll("[data-tint]").forEach(b=>b.onclick=()=>{S.tint=b.dataset.tint;P().querySelectorAll("[data-tint]").forEach(x=>x.setAttribute("aria-pressed",x===b));apply()});
  $("#redo").onclick=()=>{S.xp=0;onboard()};
  P().querySelectorAll("[data-limit]").forEach(b=>b.onclick=()=>{S.limit=+b.dataset.limit;saveSettings(S);P().querySelectorAll("[data-limit]").forEach(x=>{x.setAttribute("aria-pressed",x===b);x.style.background=x===b?"var(--pink)":""});toast(`${S.limit} reels a day`)});
  drawDecks()}
async function drawDecks(){const el=$("#deckList");if(!el)return;const ds=await listDecks();if(!$("#deckList"))return;
  if(!ds.length){el.innerHTML=`<span class="muted">No saved decks yet. Make one and it stays on this device.</span>`;return}
  el.innerHTML=ds.map(d=>`<div class="opt" style="cursor:default"><span>${d.id===did()&&S.built?"▶ ":""}${esc(d.title)}<small>${esc(d.sourceLabel||(d.demo?"sample deck":""))} · ${d.n} reels${d.savedAt?" · "+new Date(d.savedAt).toLocaleDateString():""}</small></span>
    <span class="chips" style="flex:none"><button data-open="${esc(d.id)}" aria-label="Open ${esc(d.title)}">Open</button><button data-del="${esc(d.id)}" aria-label="Delete ${esc(d.title)}">🗑</button></span></div>`).join("");
  el.querySelectorAll("[data-open]").forEach(b=>b.onclick=async()=>{const d=await loadDeck(b.dataset.open);if(!d)return toast("Couldn't open that deck");useDeck(d);S.deckId=d.id;S.src=d.sourceLabel||(d.demo?"your notes":S.src);S.built=true;S.got=new Set();S.later=new Set();S.wrong=[];S.simple=new Set();saveSettings(S);show("feed");toast("📚 "+d.title)});
  el.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{const d=ds.find(x=>x.id===b.dataset.del);if(!confirm(`Delete "${d.title}" from this device? This can't be undone.`))return;
    await deleteDeck(d.id);dropDeckReviews(S,d.id);if(d.id===did()){useDeck(DEMO_DECK);S.deckId="demo";S.built=false}saveSettings(S);toast("Deleted");drawDecks()})}

/* ---------- help explainers ---------- */
$("#helpBtn").onclick=()=>{const H={feed:["👀 Watch, 🎧 Listen, 📖 Read or 🎮 Play: tap at the top to switch.","🎮 3D quiz turns any reel into a runner game.","💬 Ask only uses your notes. ⋯ More has jingles, story mode and Teach Rotty."],make:["Upload a PDF, paste notes or a link, or snap a photo.","Rotty makes 5 reels and 3D games, each linked to its page.","Add a test date and Rotty spreads it out."],me:["Turn on any brain mode, anytime.","Calm mode, easy-read, bionic, ruler, tints, no-timer.","Collect critter stickers as you learn."]}[S.tab]||[];
  openSheet(`<h4 id="sheetTitle">▶ How this works</h4><div style="display:grid;gap:8px">${H.map((h,k)=>`<div class="card" style="box-shadow:none">${["1️⃣","2️⃣","3️⃣"][k]} ${h}</div>`).join("")}</div><button class="cta" style="margin-top:10px" onclick="say(${JSON.stringify(H.join(' ')).replace(/"/g,'&quot;')})">🔊 Read it to me</button>`)};

/* ---------- 3D games (Three.js) ---------- */
function rrect(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function wrapT(x,t,max){const ws=String(t).split(" "),out=[];let cur="";ws.forEach(w=>{const tst=cur?cur+" "+w:w;if(x.measureText(tst).width>max&&cur){out.push(cur);cur=w}else cur=tst});out.push(cur);return out.slice(0,3)}
function texT(text,bg,w=512,h=256,fs=46){const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");x.fillStyle=bg;rrect(x,10,10,w-20,h-20,40);x.fill();x.lineWidth=12;x.strokeStyle=INK;x.stroke();x.fillStyle=INK;x.font=`700 ${fs}px Fredoka, Nunito, sans-serif`;x.textAlign="center";x.textBaseline="middle";const ls=wrapT(x,text,w-70),lh=fs*1.15;ls.forEach((l,k)=>x.fillText(l,w/2,h/2+(k-(ls.length-1)/2)*lh));const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
function g3shell(title){
  if(!window.THREE){toast("3D needs a moment to load. Try again.");return null}
  let gl=false;try{const c=document.createElement("canvas");gl=!!(c.getContext("webgl2")||c.getContext("webgl"))}catch(e){}
  if(!gl){toast("3D isn't available on this device, so here's the tap quiz");S.tapQuiz=true;S.mode="play";if(S.tab==="feed")renderFeed(true);return null}
  const o=document.createElement("div");o.className="g3";o.innerHTML=`<canvas aria-label="${esc(title)} 3D game"></canvas><div class="g3top"><button class="back" aria-label="Quit game">←</button><div class="g3q" id="g3q" aria-live="polite">${esc(title)}</div><div class="g3s" id="g3s">⭐ 0</div></div><div class="g3m" id="g3m" aria-live="assertive"></div><div class="g3pad" id="g3pad"></div>`;screen.appendChild(o);
  const cv=o.querySelector("canvas"),W=o.clientWidth,H=o.clientHeight;
  const R3=new THREE.WebGLRenderer({canvas:cv,antialias:true});R3.setPixelRatio(Math.min(2,devicePixelRatio||1));R3.setSize(W,H,false);R3.outputEncoding=THREE.sRGBEncoding;R3.shadowMap.enabled=true;R3.shadowMap.type=THREE.PCFSoftShadowMap;
  const sc=new THREE.Scene(),night=S.night,sky=night?0x1b2246:0xcfe6f3;sc.background=new THREE.Color(sky);sc.fog=new THREE.Fog(sky,18,60);
  const cam=new THREE.PerspectiveCamera(55,W/H,.1,120);
  sc.add(new THREE.HemisphereLight(night?0x9fb0ff:0xfff6e6,night?0x2a2f55:0xc9e2b0,night?.6:.6));
  const sun=new THREE.DirectionalLight(night?0xcfd6ff:0xffffff,night?.6:.75);sun.position.set(5,12,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:1,far:40});sc.add(sun);
  let raf=0,last=performance.now(),alive=true;const tickers=[];
  const loop=t=>{if(!alive)return;if(document.hidden){last=t;raf=requestAnimationFrame(loop);return}const dt=Math.min(.05,(t-last)/1000);last=t;tickers.forEach(f=>f(dt,t/1000));R3.render(sc,cam);raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
  const onRs=()=>{const w=o.clientWidth,h=o.clientHeight;if(!w||!h)return;R3.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()};window.addEventListener("resize",onRs);
  const close=()=>{alive=false;cancelAnimationFrame(raf);document.removeEventListener("keydown",kd);window.removeEventListener("resize",onRs);sc.traverse(x=>{if(x.geometry)x.geometry.dispose();const ms=Array.isArray(x.material)?x.material:x.material?[x.material]:[];ms.forEach(m=>{if(m.map)m.map.dispose();m.dispose()})});R3.dispose();o.remove();hush()};
  let kd=()=>{};o.querySelector(".back").onclick=close;
  const msg=(h,ms=1400)=>{const m=o.querySelector("#g3m");m.innerHTML=h;m.classList.add("on");clearTimeout(m._t);if(ms)m._t=setTimeout(()=>m.classList.remove("on"),ms)};
  const score=n=>{o.querySelector("#g3s").textContent="⭐ "+n};
  return {o,sc,cam,R3,tickers,close,msg,score,setKey:f=>{kd=f;document.addEventListener("keydown",kd)}}
}
function critter3D(color){const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color,roughness:.6});const body=new THREE.Mesh(new THREE.BoxGeometry(1,1,.9),m);body.castShadow=true;g.add(body);
  const eyeM=new THREE.MeshStandardMaterial({color:0x4a3f3a,roughness:.4});[-.22,.22].forEach(x=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.07,12,12),eyeM);e.position.set(x,.1,-.46);g.add(e)});
  const blM=new THREE.MeshStandardMaterial({color:0xf3b9c6,roughness:.9});[-.32,.32].forEach(x=>{const b=new THREE.Mesh(new THREE.SphereGeometry(.07,12,12),blM);b.scale.set(1.4,.7,.4);b.position.set(x,-.04,-.46);g.add(b)});
  [-.28,.28].forEach(x=>{const ear=new THREE.Mesh(new THREE.SphereGeometry(.14,12,12),m);ear.position.set(x,.55,0);ear.castShadow=true;g.add(ear)});return g}
const PASTELS=[0xbfe0cf,0xf6e3a6,0xf3b9c6,0xc9cdf0,0xb9d8ea,0xf3cfb4];
function quizRun(start){
  const G=g3shell("Quiz Run");if(!G)return;const {sc,cam,tickers,msg}=G;let pts=0,right=0;
  const queue=DECK.reels.map((r,i)=>i).slice(start).concat(DECK.reels.map((r,i)=>i).slice(0,start)),missedQ=new Set();
  const LX=[-2.2,0,2.2];
  const road=new THREE.Mesh(new THREE.BoxGeometry(7.4,.4,140),new THREE.MeshStandardMaterial({color:S.night?0x3a3566:0xc4ade0,roughness:.85}));road.position.set(0,-.2,-50);road.receiveShadow=true;sc.add(road);
  const grass=new THREE.Mesh(new THREE.PlaneGeometry(80,160),new THREE.MeshStandardMaterial({color:S.night?0x23304f:0x9fcb85,roughness:1}));grass.rotation.x=-Math.PI/2;grass.position.set(0,-.39,-50);grass.receiveShadow=true;sc.add(grass);
  const stripes=[];for(let k=0;k<24;k++){[-1.1,1.1].forEach(x=>{const st=new THREE.Mesh(new THREE.BoxGeometry(.12,.02,1.6),new THREE.MeshStandardMaterial({color:0xfffaf0}));st.position.set(x,.01,-k*5);sc.add(st);stripes.push(st)})}
  const props=[];for(let k=0;k<16;k++){const side=k%2?1:-1,tree=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.15,.2,1,8),new THREE.MeshStandardMaterial({color:0xc9a27e}));trunk.position.y=.5;
    const top=new THREE.Mesh(k%3?new THREE.SphereGeometry(.9,16,16):new THREE.ConeGeometry(.9,1.8,12),new THREE.MeshStandardMaterial({color:PASTELS[k%6],roughness:.7}));top.position.y=1.6;top.castShadow=true;trunk.castShadow=true;tree.add(trunk,top);tree.position.set(side*(5+Math.random()*3),-.4,-k*8);sc.add(tree);props.push(tree)}
  const me=critter3D(0xf6e3a6);me.scale.setScalar(.75);me.position.set(0,.5,1.5);me.rotation.y=Math.PI;sc.add(me);
  cam.position.set(0,5.6,9.8);cam.lookAt(0,.6,-9);
  let lane=1,gate=null,gz=-46,order=[0,1,2],qi=null,locked=false,busy=false;const speed=(S.calm||RM)?7:10.5;
  const pad=G.o.querySelector("#g3pad");
  const setLane=l=>{lane=Math.max(0,Math.min(2,l));pad.querySelectorAll("button").forEach((b,k)=>b.classList.toggle("sel",k===lane));beep(520+lane*60,.05);if(S.notimer)locked=true};
  function spawn(){if(!queue.length){return finish()}qi=queue.shift();const r=DECK.reels[qi];order=[0,1,2].sort(()=>Math.random()-.5);
    gate=new THREE.Group();order.forEach((opt,k)=>{const mats=[...Array(6)].map(()=>new THREE.MeshStandardMaterial({color:PASTELS[(k+qi)%6],roughness:.6}));mats[4]=new THREE.MeshStandardMaterial({map:texT(r.q[1][opt],["#bfe0cf","#f6e3a6","#f3b9c6"][k]),roughness:.7});
      const panel=new THREE.Mesh(new THREE.BoxGeometry(2,1.2,.25),mats);panel.position.set(LX[k],1.5,0);panel.castShadow=true;gate.add(panel);
      [-.95,.95].forEach(dx=>{const post=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1.6,8),new THREE.MeshStandardMaterial({color:0x4a3f3a}));post.position.set(LX[k]+dx,.6,0);gate.add(post)})});
    gz=-46;gate.position.z=gz;sc.add(gate);locked=false;
    $("#g3q").textContent=r.q[0];pad.innerHTML=order.map((opt,k)=>`<button>${["⬅","⬆","➡"][k]} ${esc(r.q[1][opt])}</button>`).join("");pad.querySelectorAll("button").forEach((b,k)=>b.onclick=()=>setLane(k));setLane(lane);locked=false;
    if(S.notimer)msg("Pick a lane. The gate waits for you 🌱",1800)}
  function resolve(){busy=true;const r=DECK.reels[qi],pick=order[lane],ok=pick===r.q[2];const panel=gate.children.find(c=>c.geometry&&c.geometry.type==="BoxGeometry"&&Math.abs(c.position.x-LX[lane])<.1);
    if(ok){pts+=10;right++;S.xp+=10;learned(qi);G.score(pts);msg("🎉 Yes! +10");yay();if(panel)panel.material[4].color.set(0xbfffc8)}
    else{missedQ.add(qi);missed(qi);queue.push(qi);msg(`💛 Not quite.<br><small>${esc(r.q[3])}</small>`,2600);beep(300,.2,"triangle");if(panel)panel.material[4].color.set(0xffc9c9);me.rotation.z=.4}
    setTimeout(()=>{sc.remove(gate);gate=null;me.rotation.z=0;busy=false;spawn()},ok?900:2400)}
  function finish(){const pct=Math.round(right/Math.max(1,right+missedQ.size)*100);msg(`<b style="font-family:var(--head);font-size:24px">Run complete! 🏁</b><br>⭐ ${pts} · ${right} right${missedQ.size?` · ${missedQ.size} to review`:""}<br><button class="cta" style="margin-top:10px;padding:10px" onclick="this.closest('.g3').querySelector('.back').click()">Done</button>`,0);yay();$("#g3q").textContent="You did it!";pad.innerHTML=""}
  let tx=0;G.o.addEventListener("pointerdown",e=>{tx=e.clientX});G.o.addEventListener("pointerup",e=>{const d=e.clientX-tx;if(Math.abs(d)>40&&!e.target.closest("button"))setLane(lane+(d>0?1:-1))});
  G.setKey(e=>{if(e.key==="ArrowLeft")setLane(lane-1);if(e.key==="ArrowRight")setLane(lane+1);if(["1","2","3"].includes(e.key))setLane(+e.key-1)});
  tickers.push((dt,t)=>{const mv=busy?speed*.15:speed;stripes.forEach(st=>{st.position.z+=mv*dt;if(st.position.z>8)st.position.z-=120});props.forEach(p=>{p.position.z+=mv*dt;if(p.position.z>10)p.position.z-=128});
    me.position.x+=(LX[lane]-me.position.x)*Math.min(1,dt*10);me.position.y=.45+((S.calm||RM)?0:Math.abs(Math.sin(t*11))*.16);
    if(gate&&!busy){const hold=S.notimer&&!locked&&gz>-5;if(!hold)gz+=speed*dt;gate.position.z=gz;if(gz>=1.2)resolve()}});
  setTimeout(spawn,500);msg("Run through the right answer! ⬅ ➡",1600);
}
function stepTower(){
  const G=g3shell("Step Tower");if(!G)return;const {sc,cam,tickers,msg}=G;
  const ground=new THREE.Mesh(new THREE.CylinderGeometry(6,6,.4,48),new THREE.MeshStandardMaterial({color:S.night?0x2a3460:0x9fcb85,roughness:1}));ground.position.y=-.2;ground.receiveShadow=true;sc.add(ground);
  const base=new THREE.Mesh(new THREE.BoxGeometry(3.6,.3,1.6),new THREE.MeshStandardMaterial({color:0xe3c9b4}));base.position.set(0,.15,-1);base.castShadow=base.receiveShadow=true;sc.add(base);
  const pet=critter3D(0xc9e2b0);pet.scale.setScalar(.7);pet.position.set(2.6,.4,-.6);pet.rotation.y=Math.PI+.5;sc.add(pet);
  let done=0,camY=2.6,pts=0;const H=.85,blocks=[],anim=[];
  function mk(k){const mats=[...Array(6)].map(()=>new THREE.MeshStandardMaterial({color:PASTELS[k%6],roughness:.55}));mats[4]=new THREE.MeshStandardMaterial({map:texT(DECK.steps[k],["#bfe0cf","#f6e3a6","#f3b9c6","#c9cdf0","#b9d8ea"][k%5],512,170,40),roughness:.6});const b=new THREE.Mesh(new THREE.BoxGeometry(3.2,.8,1.2),mats);b.castShadow=b.receiveShadow=true;b.userData.k=k;return b}
  const pad=G.o.querySelector("#g3pad");
  function offer(){blocks.forEach(b=>sc.remove(b));blocks.length=0;if(done>=DECK.steps.length)return win();
    const left=[...Array(DECK.steps.length).keys()].filter(k=>k>=done),pick=[done,...left.filter(k=>k!==done).sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);
    pick.forEach((k,j)=>{const b=mk(k);b.position.set((j-1)*1.15,done*H+1.4,1.8);b.scale.setScalar(.34);b.userData.float=j;b.userData.x=(j-1)*1.15;sc.add(b);blocks.push(b)});
    $("#g3q").textContent=`Step ${done+1} of ${DECK.steps.length}: what comes next?`;pad.innerHTML=pick.map(k=>`<button data-k="${k}" style="background:${["#bfe0cf","#f6e3a6","#f3b9c6","#c9cdf0","#b9d8ea"][k%5]};color:#1b2140">${esc(DECK.steps[k])}</button>`).join("");pad.querySelectorAll("button").forEach(b=>b.onclick=()=>choose(+b.dataset.k))}
  function choose(k){const b=blocks.find(x=>x.userData.k===k);if(!b)return;
    if(k===done){pts+=10;S.xp+=8;G.score(pts);blocks.splice(blocks.indexOf(b),1);anim.push({b,from:b.position.clone(),to:new THREE.Vector3(0,.3+H/2+done*H,-1),t:0});done++;beep(600+done*80);setTimeout(offer,550)}
    else{b.userData.shake=.5;msg("🤔 Not yet! Think: what has to happen first?",1500);beep(300,.2,"triangle")}}
  function win(){msg(`<b style="font-family:var(--head);font-size:24px">Tower complete! 🏆</b><br>⭐ ${pts} · You know all ${DECK.steps.length} steps.<br><button class="cta" style="margin-top:10px;padding:10px" onclick="this.closest('.g3').querySelector('.back').click()">Done</button>`,0);yay();pad.innerHTML="";$("#g3q").textContent=DECK.title+", mastered!"}
  const ray=new THREE.Raycaster(),v=new THREE.Vector2();G.o.querySelector("canvas").addEventListener("pointerdown",e=>{const r=e.target.getBoundingClientRect();v.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(v,cam);const hit=ray.intersectObjects(blocks)[0];if(hit)choose(hit.object.userData.k)});
  G.setKey(e=>{const btns=[...pad.querySelectorAll("button")];if(["1","2","3"].includes(e.key)&&btns[+e.key-1])btns[+e.key-1].click()});
  tickers.push((dt,t)=>{blocks.forEach(b=>{b.position.y=done*H+1.4+((S.calm||RM)?0:Math.sin(t*2+b.userData.float)*.1);b.position.x=b.userData.x;b.rotation.y=(S.calm||RM)?0:Math.sin(t+b.userData.float)*.15;if(b.userData.shake>0){b.userData.shake-=dt;b.position.x=b.userData.x+Math.sin(t*60)*.06}});
    anim.forEach(a=>{a.t=Math.min(1,a.t+dt*2.4);const e=1-Math.pow(1-a.t,3);a.b.position.lerpVectors(a.from,a.to,e);a.b.position.y+=Math.sin(e*Math.PI)*1.2;a.b.rotation.y=0;a.b.scale.setScalar(.34+.66*e);if(a.t>=1&&!a.b.userData.placed){a.b.userData.placed=true;if(!sc.children.includes(a.b))sc.add(a.b)}});
    camY+=((done*H+2.6)-camY)*Math.min(1,dt*3);cam.position.set(Math.sin(t*.25)*((S.calm||RM)?0:1.2),camY+1.6,7.5);cam.lookAt(0,camY-.6,-.5);pet.position.y=.4+((S.calm||RM)?0:Math.abs(Math.sin(t*4))*.15)});
  offer();msg("Tap the block that comes next 🧱",1600);
}

screen.addEventListener("scroll",()=>{if(screen.scrollTop)screen.scrollTop=0});

/* ---------- keyboard (desktop) ---------- */
document.addEventListener("keydown",e=>{
  if(e.target.closest&&e.target.closest("input,textarea,select,[contenteditable]"))return;
  if(screen.querySelector(".g3"))return; // the 3D game owns the keys
  if(e.key==="Escape"){if($("#sheet").classList.contains("on"))return closeSheet();const ov=[...screen.querySelectorAll(".ov")].pop();if(ov){const b=ov.querySelector(".back");if(b)b.click()}return}
  if(S.tab!=="feed"||$("#sheet").classList.contains("on")||screen.querySelector(".ov,.onb"))return;
  const V=$("#feedV");if(!V)return;
  if(["ArrowDown","PageDown","j"," "].includes(e.key)){e.preventDefault();V.scrollBy({top:V.clientHeight,behavior:RM||S.calm?"auto":"smooth"})}
  if(["ArrowUp","PageUp","k"].includes(e.key)){e.preventDefault();V.scrollBy({top:-V.clientHeight,behavior:RM||S.calm?"auto":"smooth"})}
});

/* ---------- start ---------- */
Object.assign(window,{S,show,renderFeed,toast,breathe,buddy,say});
const today=new Date().toDateString();
const had=loadSettings(S);
// days you showed up. Missing a day quietly restarts at 1: no guilt, no "you lost it!" screens.
if(!had)S.streak=1;
if(S.lastDay!==today){S.streak=S.lastDay===new Date(Date.now()-864e5).toDateString()?(S.streak||0)+1:1;S.lastDay=today}
S.tab="feed";S.hist=[];
apply();show("feed");if(!S.onboarded)onboard();
(async()=>{let d=await loadDeck(S.deckId||"demo");
  if(!d){const old=await loadDeck("current");if(old){old.id=old.demo?"demo":"d"+(old.savedAt||Date.now());await saveDeck(old);await deleteDeck("current");d=old;S.deckId=old.id}}
  if(d&&d.reels&&d.reels.length){useDeck(d);S.src=d.sourceLabel||S.src;if(S.tab==="feed")renderFeed()}})();
window.addEventListener("pagehide",()=>saveSettings(S));
document.addEventListener("visibilitychange",()=>{if(document.hidden)saveSettings(S)});
