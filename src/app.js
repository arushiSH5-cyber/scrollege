import { post } from "./api.js";
import { loadSettings, saveSettings, saveDeck, loadDeck, listDecks, deleteDeck, addReview, passReview, dueToday, dropDeckReviews, dayKey } from "./store.js";
const INK="#4a3f3a";/* ---------- hand-drawn doodle icons ---------- */
const ICP={feed:"M7.5 3.4q4.6-.7 9.2 0q1.7.3 1.7 2v13.2q0 1.8-1.7 2.1q-4.6.7-9.2 0q-1.7-.3-1.7-2.1V5.4q0-1.7 1.7-2zM10.6 17.9q1.4.3 2.8 0",
 make:"M12.2 4.6q-.5 7.4-.1 14.9M4.7 12.3q7.3-.6 14.7-.1",
 me:"M5.2 19.3q-2.4-6 .8-10.3l-.8-5.1 4.1 2.9q2.9-1 5.6.1l4.2-3-.9 5.2q3.1 4.3.7 10.3q-6.9 1.6-13.7-.1zM9.6 12.4v.6M14.4 12.4v.6M10.9 15.3q1.1 1.1 2.2 0",
 watch:"M2.6 12.2q4.3-7.1 9.5-7t9.4 7q-4.4 6.9-9.5 6.9t-9.4-6.9zM12 9.3q2.9-.1 2.9 2.8t-2.9 2.9-2.8-2.9 2.8-2.8z",
 listen:"M4.4 15.2v-3.4q.2-7.6 7.7-7.8 7.5.2 7.6 7.8v3.4M4.3 14q1.6-.2 3.1.1l-.1 5.9q-1.4.3-2.3 0-.8-.3-.7-1.4zM19.7 14q-1.6-.2-3.1.1l.1 5.9q1.4.3 2.3 0 .8-.3.7-1.4z",
 read:"M3.2 6.2q4.4-2.3 8.8 1 4.5-3.2 8.8-.9l-.1 11.9q-4.3-2.2-8.7 1-4.4-3.3-8.8-1.1zM12 7.3l.1 11.8",
 play:"M6.1 8.9q6-2.1 11.9.1 3 1.2 3.1 6.1 0 3.1-2 3.1-1.9.1-3.1-2.1H8q-1.1 2.2-3 2.1-2-.1-2-3.2.1-4.9 3.1-6.1zM8.2 11.1v3.2M6.6 12.7h3.2M15.4 11.9h.2M17.4 13.9h.2",
 ask:"M4.1 6.2q7.9-3.3 15.9-.1 1.3 4.8-.1 9.1-5 2.1-10.1 1.1l-3.9 3 .1-4.1Q3.1 11 4.1 6.2zM8.7 10.6h.2M12 10.6h.2M15.3 10.6h.2",
 more:"M5.8 12.1h.3M12 12h.3M18.1 11.9h.3",
 v3:"M4.3 9.2h15.4l-.1 9.6q-7.6 1.2-15.2.1zM4.3 9.2l.8-3.9 14.7.9-.4 3M8.4 5.6l1.8 3.4M13.2 5.9l1.9 3.2M10.4 12.3l4 1.9-4 2z",
 compass:"M12 3.3q8.6.2 8.7 8.7-.1 8.6-8.7 8.7-8.6-.1-8.7-8.7.2-8.5 8.7-8.7zM14.9 9.1l-1.6 4.3-4.2 1.6 1.6-4.3z",
 notes:"M6.2 3.6l9.4-.2 3 3.1.2 13.9q-6.3.6-12.5 0zM15.5 3.5v3.2h3.1M9 10.2h6.2M9 13.4h6M9 16.5h3.8",
 run:"M7.6 20.4l3.2-16.6h2.4l3.3 16.6M12.1 6.8v1.5M12.1 10.8v1.8M12.1 15.2v2",
 tower:"M6.4 20.2h11.3v-4.4H6.5zM7.6 15.8h8.9v-4.2H7.7zM9 11.6h6.1V7.3H9z",
 bubble:"M9.4 4.6q4.8.1 4.9 4.9-.1 4.8-4.9 4.9-4.7-.1-4.8-4.9.1-4.8 4.8-4.9zM16.6 12.6q3.2.1 3.3 3.3-.1 3.2-3.3 3.2-3.1-.1-3.2-3.2.1-3.2 3.2-3.3zM7.7 7.6q.6-1 1.6-1.2",
 memory:"M3.9 6.3l6.9-.9 1.6 12.6-6.9.9zM13 5.1l6.9.9-1.7 12.6-6.8-.9M14.8 10.6q1-1.3 2.1-.2.6 1.1-1 2.2",
fish:"M3.4 12q4.8-6.2 11.6-3.6 3 1.2 4.4 3.6-1.4 2.4-4.4 3.6Q8.2 18.2 3.4 12zM19.4 12l2.2-3.4v6.8zM14.6 10.9h.2M9.8 9.6q1.1 2.4 0 4.8",
 whack:"M4.6 20.4q7.4 1.2 14.8 0M7.2 20q-.6-4.6 4.8-4.9 5.4.3 4.8 4.9M10.3 17.6h.2M13.6 17.6h.2M13.4 3.6l6.2 6.1-2.4 2.3-6.1-6.1zM15.2 9l-5.1 5",
 hoop:"M5.6 7.4h12.8M7 7.4l1.6 6.1h6.8L17 7.4M9.6 9.8l.8 3.6M14.4 9.8l-.8 3.6M12 15.6q3.4.1 3.4 3.4 0 1.6-3.4 1.6t-3.4-1.6q0-3.3 3.4-3.4zM12 3.4v4",
 sort:"M3.6 13.8h6.8l-1 6.3H4.6zM13.6 13.8h6.8l-1 6.3h-4.8zM12 3.6q1.8.1 1.9 1.9-.1 1.8-1.9 1.9-1.8-.1-1.9-1.9.1-1.8 1.9-1.9zM11.5 8.3q-3.3 1.4-4.4 4.1M12.6 8.3q3.3 1.4 4.3 4.1"};
function ic(k,s=24){return `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICP[k]||ICP.more}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`}

const HAS_GL=(()=>{try{const c=document.createElement("canvas");return !!(c.getContext("webgl2")||c.getContext("webgl"))}catch(e){return false}})();
const RM=(()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}})();
/* ---------- original kawaii art ---------- */
function rotty(m="happy",s=40){
  const F={happy:`<circle cx="32" cy="45" r="2.8" fill="${INK}"/><circle cx="48" cy="45" r="2.8" fill="${INK}"/><path d="M36 51q2 2.4 4 0q2 2.4 4 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
   excited:`<path d="M28 46q4-5 8 0M44 46q4-5 8 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="M35 50q5 8 10 0z" fill="#e9967a" stroke="${INK}" stroke-width="2"/>`,
   sleepy:`<path d="M28 46q4 3 8 0M44 46q4 3 8 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="M38 52h4" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><text x="62" y="22" font-size="11" font-weight="800" fill="${INK}">z</text><text x="68" y="14" font-size="9" font-weight="800" fill="${INK}">z</text>`,
   thinking:`<circle cx="33" cy="44" r="2.8" fill="${INK}"/><circle cx="49" cy="44" r="2.8" fill="${INK}"/><path d="M37 52q3-2 6 0" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`,
   proud:`<path d="M28 46q4-4 8 0M44 46q4-4 8 0" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="M36 51q2 2.4 4 0q2 2.4 4 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`}[m]||"";
  return `<svg width="${s}" height="${s}" viewBox="0 0 80 80" aria-hidden="true"><path d="M63 63q13-1 11-14q-1-5-5-4" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="M40 22v-8" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M40 16q-9-8-15-1q7 6 15 1z" fill="#b9dcc4" stroke="${INK}" stroke-width="1.9"/><path d="M40 15q7-7 12-2q-6 5-12 2z" fill="#cfe8d4" stroke="${INK}" stroke-width="1.9"/><path d="M15 67c-4-11-3-23 2-32l-2-16.5c0-1 1-1.6 2-1l12 9c7-2.6 15-2.6 22 .2l12-9.2c1-.6 2 0 2 1l-2 16.5c5.5 9 6.2 21 2.2 32c-1.6 3.6-7 5-25.2 5s-23.4-1.4-25.2-5z" fill="#fffefa" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><path d="M20 22l2 9M60 22l-2 9" stroke="#f6cdb0" stroke-width="3" stroke-linecap="round"/><ellipse cx="25" cy="52" rx="4.5" ry="2.8" fill="#f6c8b8"/><ellipse cx="55" cy="52" rx="4.5" ry="2.8" fill="#f6c8b8"/><path d="M9 47l9 2M9 54l9-1M71 47l-9 2M71 54l-9-1" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/><path d="M30 71q0-5 4-5M50 71q0-5-4-5" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>${F}</svg>`}
function sq(k,s=40){
  const B=`M15 63c-3.5-11-2.6-25 3.6-33.4c6.6-8.4 37.2-8.6 43.6.2c6.1 8.6 7 22.3 3.4 33.6c-1.8 5.6-11.5 7.6-25.4 7.6s-23.4-2.2-25.2-8z`;
  const base=(fill,extra,front="")=>`<svg width="${s}" height="${s}" viewBox="0 0 80 80" aria-hidden="true">${extra}<path d="${B}" fill="${fill}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>${front}<ellipse cx="24.5" cy="51" rx="4.3" ry="2.6" fill="#f6c8b8"/><ellipse cx="55.5" cy="51" rx="4.3" ry="2.6" fill="#f6c8b8"/><path d="M31 44.5q1-.2 1.4.9M48.6 44.5q1-.2 1.4.9" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M36.2 51.2q1.9 2.4 3.8 0q1.9 2.4 3.8 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><path d="M22 64q2 4 0 6M58 64q-2 4 0 6" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></svg>`;
  return {frog:base("#cfe6b8",`<path d="M17 30q-1-12 10-12q10 .5 9 12M44 30q-1-11.5 9.5-11.8Q64 18.6 63 30" fill="#cfe6b8" stroke="${INK}" stroke-width="2.5"/>`,`<path d="M23 27q4-4 7 0M50 27q4-4 7 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`),
   chick:base("#f8e7ae",`<path d="M37.5 22q-3-8.5 3.5-9.6M41.5 22q3.5-7.6 8.6-6" fill="none" stroke="${INK}" stroke-width="2.3" stroke-linecap="round"/>`,`<path d="M35.8 47.4q4.2-1.4 8.4.2q-1.6 4-4.3 4.6q-2.6-.8-4.1-4.8z" fill="#f2b06a" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 52q-6 0-6-5M66 52q6 0 6-5" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`),
   bear:base("#e6cfbb",`<path d="M14.5 27q-3-9.6 5.6-10.2q8.2.4 7 8.5M65.5 27q3-9.6-5.6-10.2q-8.2.4-7 8.5" fill="#e6cfbb" stroke="${INK}" stroke-width="2.5"/>`),
   bunny:base("#eef3fa",`<path d="M27 25q-6-19 2-21q7 2 5 21M46 25q-1-19 6.5-20.6q7.5 2.4 1.5 21" fill="#eef3fa" stroke="${INK}" stroke-width="2.5"/>`),
   penguin:base("#fffdf8","",`<path d="M15.5 40q-.6-10 9-12h31q9.6 2 9 12q-8.6-8.4-24.5-8.4T15.5 40z" fill="#5e6b7a" stroke="${INK}" stroke-width="2.1"/><path d="M37 47h6l-3 4z" fill="#f2b06a" stroke="${INK}" stroke-width="1.4"/>`),
   cat:base("#e8eef6",`<path d="M18 30l3.6-15.5 11.8 9M62 30l-3.6-15.5-11.8 9" fill="#e8eef6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`)}[k]}
const L=`stroke="${INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"`;
const SC=[
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true">${[[18,30,"#f6e3a6"],[18,66,"#c9cdf0"],[18,102,"#f6cdb0"]].map(([x,y,c])=>`<rect x="${x}" y="${y}" width="44" height="28" rx="7" fill="${c}" ${L}/><path d="M${x+8} ${y+10}h28M${x+8} ${y+18}h18" ${L}/>`).join("")}<path d="M70 80h28" ${L}/><path d="M92 74l7 6-7 6" fill="none" ${L}/><rect x="104" y="46" width="62" height="58" rx="16" fill="#bfe0cf" ${L}/><circle cx="124" cy="72" r="4" fill="${INK}"/><circle cx="146" cy="72" r="4" fill="${INK}"/><path d="M128 86q7 6 14 0" fill="none" ${L}/><path d="M135 46v-10" ${L}/><circle cx="135" cy="33" r="5" fill="#f6cdb0" ${L}/><path d="M172 76h12" ${L}/><circle cx="198" cy="70" r="13" fill="#fff3b0" ${L}/><path d="M193 86h10" ${L}/></svg>`,
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><rect x="14" y="22" width="192" height="116" rx="16" fill="#fffaf0" ${L}/><rect x="146" y="22" width="60" height="116" rx="0" fill="#fdf0c4"/><rect x="14" y="22" width="192" height="116" rx="16" fill="none" ${L}/><path d="M14 52h192M60 22v116M104 22v116M146 22v116" ${L}/>${[["size",37],["rooms",82],["ward",125]].slice(0,2).map(([t,x])=>`<text x="${x}" y="42" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="13" fill="${INK}">${t}</text>`).join("")}<text x="125" y="42" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="13" fill="${INK}">age</text><text x="176" y="42" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="13" fill="#c94f84">price ⭐</text>${[[72,"1200","3","10","$400k"],[100,"900","2","25","$310k"],[126,"1600","4","5","$560k"]].map(([y,...v])=>[37,82,125,176].map((x,k)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="12" fill="${INK}">${v[k]}</text>`).join("")).join("")}</svg>`,
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><rect x="8" y="20" width="98" height="120" rx="16" fill="#fffaf0" ${L}/><rect x="114" y="20" width="98" height="120" rx="16" fill="#fffaf0" ${L}/>${[[30,50,"#f6cdb0","🐱"],[60,70,"#c9cdf0","🐶"],[34,100,"#f6cdb0","🐱"],[76,112,"#c9cdf0","🐶"]].map(([x,y,c,e])=>`<circle cx="${x}" cy="${y}" r="10" fill="${c}" ${L}/><text x="${x+10}" y="${y-8}" font-size="12">${e}</text>`).join("")}<ellipse cx="140" cy="62" rx="20" ry="22" fill="none" stroke="#3d8fc4" stroke-width="2.4" stroke-dasharray="5 4"/><ellipse cx="184" cy="106" rx="20" ry="22" fill="none" stroke="#7fc79f" stroke-width="2.4" stroke-dasharray="5 4"/>${[[134,54],[148,66],[136,72],[178,100],[190,110],[182,116]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#f6e3a6" ${L}/>`).join("")}<text x="57" y="155" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="11" fill="${INK}">labels ✓</text><text x="163" y="155" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="11" fill="${INK}">no labels</text></svg>`,
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><rect x="14" y="56" width="152" height="46" rx="14" fill="#bfe0cf" ${L}/><rect x="166" y="56" width="40" height="46" rx="14" fill="#f6cdb0" ${L}/><text x="90" y="85" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="15" fill="${INK}">train 80%</text><text x="186" y="85" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="12" fill="${INK}">test</text><path d="M186 104v18" ${L}/><text x="186" y="138" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="11" fill="${INK}">never seen 👀</text><path d="M60 50q30-28 60 0" fill="none" ${L} stroke-dasharray="4 5"/><text x="90" y="24" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="12" fill="${INK}">learn here 📚</text></svg>`,
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><rect x="10" y="30" width="92" height="40" rx="12" fill="#f6cdb0" ${L}/><text x="56" y="55" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="13" fill="${INK}">spam 🚫</text><rect x="10" y="80" width="92" height="40" rx="12" fill="#bfe0cf" ${L}/><text x="56" y="105" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="13" fill="${INK}">not spam ✓</text><text x="56" y="142" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="11" fill="${INK}">classification</text><path d="M120 92h90" ${L}/>${[120,140,160,180,200].map(x=>`<path d="M${x} 86v12" ${L}/>`).join("")}<circle cx="172" cy="92" r="8" fill="#f6e3a6" ${L}/><text x="172" y="72" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="14" fill="${INK}">72°</text><text x="165" y="142" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="11" fill="${INK}">regression</text></svg>`];
/* ---------- demo deck: ML class notes (accurate, simplified) ---------- */
const DEMO_DECK={demo:true,id:"demo",title:"ML Basics",stepsOf:"an ML project",steps:["Define the question","Collect data","Pick features and labels","Train on the training set","Evaluate on the test set"],reels:[
 {t:"What is machine learning?",a:"#e6f4ec",cap:["Computers learn from examples","instead of hand-written rules","to predict new things"],read:["Machine learning lets computers learn patterns from data","Instead of writing every rule, we show the computer examples","The goal is good predictions on new data"],simple:"You show the computer lots of examples, and it learns the pattern.",story:["Robo wants to spot spam emails.","Nobody writes every rule for it.","It studies tons of examples and learns!"],pod:[["Scrolly","So we don't program every rule?"],["Pip","Nope! We give it examples, and it figures out the pattern."]],q:["What does machine learning learn from?",["Examples (data)","Magic","Only hand-written rules"],0,"It learns patterns from example data."],jingle:["Show it examples, lots of them too,","it learns the pattern and guesses for you!"],line:1},
 {t:"Features and labels",a:"#fcf3d6",cap:["Features are the clues","the label is the answer","clues → answer"],read:["Features are the input details, like a house's size and number of rooms","The label is what we want to predict, like the house's price","A model learns how the features relate to the label"],simple:"Features are the clues. The label is the answer we want to guess.",story:["Detective Pip looks at clues: size, rooms, age.","The mystery: what's the price?","Clues are features. The price is the label."],pod:[["Scrolly","What's a label?"],["Pip","It's the answer you want the model to predict, like a price!"]],q:["Predicting house prices: what is the label?",["The price","The number of rooms","The size"],0,"The label is the thing we predict: the price."],jingle:["Features are the clues you see,","the label's what the answer will be!"],line:2},
 {t:"Supervised vs unsupervised",a:"#f1eaf7",cap:["Supervised: answers included","unsupervised: no answers","it finds groups by itself"],read:["Supervised learning uses labeled examples: inputs with the right answers","Unsupervised learning finds patterns in data with no labels, like grouping similar things","Spam detection uses labels; grouping customers by habits doesn't"],simple:"Supervised has an answer key. Unsupervised finds groups on its own.",story:["Class A gets flashcards with answers.","Class B gets a pile with no answers.","Class B sorts them into groups anyway!"],pod:[["Scrolly","What if my data has no answers?"],["Pip","Then it's unsupervised. The model finds groups on its own!"]],q:["Grouping songs by similarity, with no labels, is…",["Unsupervised learning","Supervised learning","Not machine learning"],0,"No labels means unsupervised."],jingle:["With answers given, it's supervised,","no labels? Then it's unsupervised!"],line:3},
 {t:"Training and test sets",a:"#e6f1f8",cap:["Split your data","learn from the training set","check on the test set"],read:["We split data into a training set and a test set","The model learns from the training set only","The test set checks how it does on data it has never seen"],simple:"Study with some data, then take a test with new data.",story:["Pip studies the practice problems.","The teacher keeps some questions secret.","The secret ones show what Pip really learned."],pod:[["Scrolly","Why not test on the same data?"],["Pip","That's like grading a test you already saw. Use new data!"]],q:["Why keep a separate test set?",["To check how it does on new, unseen data","To make training faster","To store backups"],0,"It shows how the model does on data it hasn't seen."],jingle:["Train on some and test the rest,","unseen data is the real test!"],line:4},
 {t:"Classification vs regression",a:"#fdeedd",cap:["Is the answer a category?","that's classification","a number? regression"],read:["Classification predicts a category, like spam or not spam","Regression predicts a number, like a price or a temperature","Pick based on what your answer looks like"],simple:"Category answer? Classification. Number answer? Regression.",story:["Spam or not? Robo picks a bucket.","How warm tomorrow? Robo picks a number.","Buckets: classification. Numbers: regression."],pod:[["Scrolly","How do I know which one?"],["Pip","Look at the answer: a category means classification, a number means regression."]],q:["Predicting tomorrow's temperature is…",["Regression","Classification","Clustering"],0,"Temperature is a number, so it's regression."],jingle:["A category? Classify away,","a number? Regression saves the day!"],line:5}]};
const ROAD=`<svg viewBox="0 0 220 120" style="width:200px" aria-hidden="true"><path d="M80 10h60l60 110H20z" fill="#d9c6e6" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M100 10L80 120M120 10l20 110" stroke="#fffaf0" stroke-width="3" stroke-dasharray="8 8"/>${[[88,40,"#bfe0cf"],[110,40,"#f6e3a6"],[132,40,"#f6cdb0"]].map(([x,y,c])=>`<rect x="${x-10}" y="${y}" width="20" height="14" rx="3" fill="${c}" stroke="${INK}" stroke-width="2"/>`).join("")}<rect x="98" y="86" width="24" height="22" rx="6" fill="#f6e3a6" stroke="${INK}" stroke-width="2.4"/><circle cx="106" cy="96" r="1.8" fill="${INK}"/><circle cx="114" cy="96" r="1.8" fill="${INK}"/></svg>`;
const SORT=[["Sunlight","in"],["Water","in"],["CO₂","in"],["Oxygen","out"],["Glucose","out"]];
const STEPS=DEMO_DECK.steps;
const XSC=[
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><path d="M30 20v115h170" fill="none" ${L}/>${[[50,118],[70,104],[92,100],[110,84],[128,80],[150,62],[172,50],[188,40]].map(([x,y],k)=>`<circle cx="${x}" cy="${y}" r="6" fill="${["#f6cdb0","#c9cdf0","#f6e3a6","#bfe0cf"][k%4]}" ${L}/>`).join("")}<path d="M38 124L200 32" stroke="#3d8fc4" stroke-width="4" stroke-linecap="round"/><text x="140" y="140" font-family="Fredoka" font-weight="700" font-size="14" fill="${INK}">y = mx + b</text></svg>`,
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><path d="M10 40 Q60 40 90 100 T150 132 Q190 120 210 60" fill="#c9e2b0" ${L}/><circle cx="64" cy="52" r="11" fill="#f6e3a6" ${L}/><path d="M80 62 l18 22" ${L} stroke-dasharray="4 5"/><path d="M98 84l-2-9M98 84l-9-1" ${L}/><text x="120" y="152" font-family="Fredoka" font-weight="700" font-size="12" fill="${INK}">lowest error ⭐</text></svg>`,
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><path d="M20 20v120h185" fill="none" ${L}/>${[[45,110],[70,96],[95,104],[120,72],[145,80],[170,52],[192,58]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5.5" fill="#c9cdf0" ${L}/>`).join("")}<path d="M45 110 L70 96 L95 104 L120 72 L145 80 L170 52 L192 58" fill="none" stroke="#3d8fc4" stroke-width="3" stroke-linejoin="round"/><path d="M40 112 L198 50" stroke="#7fc79f" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 6"/></svg>`,
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true">${(()=>{const L1=[40,80,120],L2=[30,65,100,135],L3=[60,100];let e="";L1.forEach(a=>L2.forEach(b=>e+=`<path d="M40 ${a}L110 ${b}" stroke="#c9b8d6" stroke-width="1.6"/>`));L2.forEach(a=>L3.forEach(b=>e+=`<path d="M110 ${a}L180 ${b}" stroke="#c9b8d6" stroke-width="1.6"/>`));return e+L1.map(y=>`<circle cx="40" cy="${y}" r="11" fill="#bfe0cf" ${L}/>`).join("")+L2.map(y=>`<circle cx="110" cy="${y}" r="11" fill="#f6e3a6" ${L}/>`).join("")+L3.map(y=>`<circle cx="180" cy="${y}" r="11" fill="#f6cdb0" ${L}/>`).join("")})()}</svg>`,
 `<svg class="scene" viewBox="0 0 220 160" aria-hidden="true"><rect x="16" y="30" width="188" height="80" rx="22" fill="#fffaf0" ${L}/><path d="M50 110l-8 22 26-22" fill="#fffaf0" ${L}/>${[["The",28,"#c9cdf0"],["cat",76,"#bfe0cf"],["sat",118,"#f6e3a6"],["…?",160,"#f6cdb0"]].map(([t,x,c])=>`<rect x="${x}" y="54" width="${t==="The"?42:36}" height="30" rx="9" fill="${c}" ${L}/><text x="${x+(t==="The"?21:18)}" y="75" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="15" fill="${INK}">${t}</text>`).join("")}</svg>`];
SC.push(...XSC);
DEMO_DECK.sort=SORT;DEMO_DECK.steps=STEPS;DEMO_DECK.chips=["What is a label?","What is a test set?","What is regression?","Who was Darwin?"];
["sort","scatter","cluster","split","sort"].forEach((k,i)=>DEMO_DECK.reels[i].v3=k);
[["Machine learning","Learns from examples, not rules"],["Label","The answer we want to predict"],["Unsupervised","Finds groups with no answers given"],["Test set","Data the model never trained on"],["Regression","Predicts a number"]].forEach((m,i)=>DEMO_DECK.reels[i].mm=m);
DEMO_DECK.sortG={a:"Classification",b:"Regression",items:[["Spam or not spam?",0,"It's a category."],["Tomorrow's temperature",1,"It's a number."],["Cat or dog photo?",0,"It's a category."],["A house's price",1,"It's a number."],["Pass or fail?",0,"It's a category."],["Minutes you'll study",1,"It's a number."]]};
/* MINE = the student's own deck (My notes). DECK = whatever the feed shows right now (mine or an Explore pack). */
let MINE=DEMO_DECK,DECK=DEMO_DECK,PACK=null;
const local=()=>DECK.demo||DECK.pack; /* sample deck and Explore packs answer offline, without the AI */
const REEL_BG=["#e6f4ec","#e6f1f8","#f1eaf7","#fcf3d6","#fbe5e5","#fbe9dc","#eceefb"];
function useDeck(d){MINE=d;MINE.reels.forEach((r,i)=>{if(!r.a)r.a=REEL_BG[i%REEL_BG.length];if(!Array.isArray(r.mm))r.mm=[r.t,r.cap?.[0]||r.simple||""]});if(S.feed!=="explore")DECK=MINE}
function showing(){DECK=S.feed==="explore"&&PACK?PACK:MINE;return DECK}
async function loadPack(){try{const ix=await (await fetch("/packs/index.json")).json(),f=ix.packs[0];PACK=await (await fetch("/packs/"+f.file)).json();PACK.id=PACK.id||f.id;if(S.tab==="feed"&&S.feed==="explore")renderFeed()}catch(e){}}
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
  if(DECK.pack)return "Explore: "+esc(r.t);
  if(DECK.demo)return esc(S.src)+(S.src==="your notes"?`, line ${r.line}`:S.pdf&&S.src===S.pdf.name?`, page ${Math.min(S.pdf.n,r.line)}`:"");
  const L=(DECK.lines||[]).find(l=>l.n===r.line);
  if(L&&L.page)return esc(DECK.sourceLabel)+`, page ${L.page}`;
  return esc(DECK.sourceLabel||S.src)+(DECK.sourceType==="notes"&&r.line?`, line ${r.line}`:"");
}
function lineText(n){const L=(DECK.lines||[]).find(l=>l.n===n);return L?L.text:""}
const NOTES=`ML Basics (CS lecture 2)
1. ML: computers learn patterns from example data instead of hand-written rules.
2. Features = inputs (size, rooms). Label = what we predict (price).
3. Supervised = labeled data. Unsupervised = no labels, finds groups.
4. Split data: learn from the training set, evaluate on the test set (unseen).
5. Classification = predict a category. Regression = predict a number.`;

/* ---------- state ---------- */
const S={feed:"mine",review:[],limit:5,deckId:"demo",onboarded:false,lastDay:null,tapQuiz:false,night:false,theme:"sky",music:true,haptics:true,vol:.8,cards:[],pet:"chick",petName:"Mochi",vibe:"chill",learn:new Set(["watch"]),hard:new Set(),mode:"watch",calm:false,dys:false,bionic:false,ruler:false,tint:"none",big:false,notimer:false,sound:true,voice:false,lang:"English",jr:false,
 src:"your notes",idx:0,seen:new Set(),got:new Set(),later:new Set(),wrong:[],xp:0,streak:3,tab:"feed",hist:[],test:null,story:false,simple:new Set(),built:false};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],screen=$("#screen");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const hush=()=>{try{speechSynthesis.cancel()}catch(e){}};
function toast(m){$$(".toast").forEach(x=>x.remove());const t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.textContent=m;screen.appendChild(t);setTimeout(()=>t.remove(),2600)}
/* ---------- sound: soft synth SFX + lo-fi game music (WebAudio, no files) ---------- */
let AC,MST,FX;
function actx(){if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();MST=AC.createGain();MST.connect(AC.destination);
  const d=AC.createDelay(),fb=AC.createGain(),wet=AC.createGain();d.delayTime.value=.18;fb.gain.value=.25;wet.gain.value=.18;FX=AC.createGain();FX.connect(MST);FX.connect(d);d.connect(fb).connect(d);d.connect(wet).connect(MST)}
  MST.gain.value=S.vol;if(AC.state==="suspended")AC.resume();return AC}
const sndOn=()=>S.sound&&!S.calm;
function tone(f,d=.1,type="sine",vol=.1,when=0,to=0,dest){try{const a=actx(),t=a.currentTime+when,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(dest||FX);o.start(t);o.stop(t+d+.05)}catch(e){}}
function noise(d=.1,vol=.15,freq=2000,when=0,to=0,q=1,dest){try{const a=actx(),t=a.currentTime+when,n=Math.floor(a.sampleRate*d),b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);for(let k=0;k<n;k++)x[k]=Math.random()*2-1;
  const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=b;f.type="bandpass";f.Q.value=q;f.frequency.setValueAtTime(freq,t);if(to)f.frequency.exponentialRampToValueAtTime(to,t+d);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f).connect(g).connect(dest||FX);s.start(t)}catch(e){}}
const SFXL={
 tap:()=>tone(620,.05,"sine",.05),
 open:()=>noise(.18,.06,600,0,1800,.8),
 close:()=>noise(.15,.05,1600,0,500,.8),
 pop:()=>{noise(.06,.22,2600,0,0,2);tone(700,.07,"sine",.08,0,1500)},
 right:()=>[784,988,1319].forEach((f,k)=>tone(f,.16,"triangle",.07,k*.07)),
 wrong:()=>{tone(330,.14,"sine",.06,0,262);tone(262,.18,"sine",.05,.12,220)},
 flip:()=>noise(.07,.12,3800,0,1800,1.4),
 whoosh:()=>noise(.3,.12,400,0,2400,.7),
 swish:()=>noise(.22,.14,5000,0,2500,1.2),
 splash:()=>{noise(.45,.22,900,0,300,.6);noise(.2,.12,3000,.05,0,2)},
 bonk:()=>{tone(220,.09,"square",.04,0,110);noise(.05,.15,1200)},
 boing:()=>tone(240,.35,"sine",.07,0,520),
 coin:()=>{tone(988,.07,"square",.035);tone(1319,.2,"square",.035,.07)},
 combo:()=>[523,659,784,1047,1319].forEach((f,k)=>tone(f,.12,"triangle",.06,k*.05)),
 cheer:()=>{[523,659,784,1047].forEach((f,k)=>tone(f,.25,"triangle",.06,k*.09));noise(.6,.05,4000,.3,0,.5)},
 cast:()=>{noise(.25,.1,2400,0,700,1);tone(1200,.25,"sine",.03,0,500)},
 tick:()=>tone(1800,.02,"square",.02)};
function sfx(k){if(!sndOn())return;SFXL[k]&&SFXL[k]();if(S.haptics&&navigator.vibrate)try{navigator.vibrate(k==="wrong"?[18,40,18]:k==="right"||k==="combo"?12:6)}catch(e){}}
/* old beep() calls now play through the same soft synth */
function beep(f=660,d=.09,type="sine",when=0){if(!sndOn())return;if(type==="triangle"&&f<=340)return sfx("wrong");tone(f,d+.04,type==="sine"?"triangle":type,.06,when)}
/* lo-fi loop: soft chords, plucky pentatonic melody, gentle hat. 76 bpm */
const MUS={on:false,t:null,bus:null,step:0,next:0};
function musicStart(){if(MUS.on||!S.music||!sndOn())return;const a=actx();MUS.bus=a.createGain();MUS.bus.gain.value=.0001;MUS.bus.connect(MST);MUS.bus.gain.exponentialRampToValueAtTime(.55,a.currentTime+1.5);MUS.on=true;MUS.step=0;MUS.next=a.currentTime+.1;
  const CH=[[261.6,329.6,392,493.9],[220,261.6,329.6,392],[174.6,220,261.6,329.6],[196,246.9,293.7,349.2]],PEN=[523.3,587.3,659.3,784,880],spb=60/76/2;
  MUS.t=setInterval(()=>{while(MUS.next<a.currentTime+.25){const s=MUS.step,t=MUS.next-a.currentTime,bar=Math.floor(s/8)%4;
    if(s%8===0)CH[bar].forEach(f=>tone(f/2,spb*7.5,"sine",.035,t,0,MUS.bus));
    if(s%2===0)noise(.05,.025,7000,t,0,1,MUS.bus);
    if(s%4===0)tone(65,.18,"sine",.12,t,45,MUS.bus);
    if(Math.random()<.42)tone(PEN[Math.floor(Math.random()*5)],.35,"triangle",.03,t,0,MUS.bus);
    MUS.step++;MUS.next+=spb}},60)}
function musicStop(){if(!MUS.on)return;MUS.on=false;clearInterval(MUS.t);try{const b=MUS.bus;b.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+.6);setTimeout(()=>b.disconnect(),800)}catch(e){}}

function yay(){beep(660);beep(880,.1,"sine",.08);beep(1100,.12,"sine",.16);if(S.calm||RM)return;const c=$("#confetti"),cols=["#f6e3a6","#f6cdb0","#bfe0cf","#c9cdf0","#b9d8ea","#f3cfb4"];for(let i=0;i<26;i++){const x=document.createElement("i");x.style.left=(20+Math.random()*60)+"%";x.style.top="18%";x.style.background=cols[i%6];x.style.setProperty("--dx",(Math.random()*240-120)+"px");x.style.animationDelay=Math.random()*.2+"s";c.appendChild(x);setTimeout(()=>x.remove(),1800)}}
function say(t,rate){if(S.calm&&!rate)rate=.9;try{hush();const u=new SpeechSynthesisUtterance(t);u.rate=rate||1;speechSynthesis.speak(u);return u}catch(e){return null}}
function openSheet(h){sfx("open");$("#sheet").innerHTML='<div class="grab"></div><button class="x" aria-label="Close">✕</button>'+h;$("#sheet .x").onclick=closeSheet;$("#sheet").classList.add("on");$("#scrim").classList.add("on")}
function closeSheet(){hush();$("#sheet").classList.remove("on");$("#scrim").classList.remove("on")}
$("#scrim").onclick=closeSheet;
const bion=t=>t.split(" ").map(w=>{const n=Math.ceil(w.length/2);return `<b>${esc(w.slice(0,n))}</b>${esc(w.slice(n))}`}).join(" ");
const txt=t=>S.bionic?bion(t):esc(t);
$("#tm").innerHTML=rotty("happy",26);
function deco(){const c="var(--doo)",st=(x)=>`<svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 2l2.6 6.3 6.8.5-5.2 4.4 1.7 6.6L12 16.3 6.1 19.8l1.7-6.6L2.6 8.8l6.8-.5z" fill="none" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/></svg>`,sp=`<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 1q1.5 9.5 11 11q-9.5 1.5-11 11q-1.5-9.5-11-11q9.5-1.5 11-11z" fill="${S.theme==="ink"?"#fff6c8":"#fff"}" stroke="${c}" stroke-width="1.4"/></svg>`,cl=`<svg width="46" height="26" viewBox="0 0 46 26"><path d="M8 24q-7 0-6-7q1-6 8-5q1-9 11-9q9 0 11 8q8-2 10 5q1 8-7 8z" fill="#fff" stroke="${c}" stroke-width="1.6"/></svg>`,bf=`<svg width="26" height="22" viewBox="0 0 26 22"><path d="M13 11q-6-12-11-7q-2 6 11 7q-9 4-6 9q5 2 6-9q1 11 6 9q3-5-6-9q13-1 11-7q-5-5-11 7z" fill="#fff6c8" stroke="${c}" stroke-width="1.4" stroke-linejoin="round"/></svg>`,bu=`<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="rgba(255,255,255,.35)" stroke="${c}" stroke-width="1.3"/><path d="M6 8q1-3 4-3" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>`,mo=`<svg width="30" height="30" viewBox="0 0 30 30"><path d="M20 3a12 12 0 1 0 7 17A10 10 0 0 1 20 3z" fill="#fff6c8" stroke="${c}" stroke-width="1.6"/></svg>`;
  const L={sky:[[cl,6,13],[sp,84,11],[st(),88,30],[cl,72,58],[sp,8,48],[st(),12,82],[sp,58,90]],sage:[[bf,8,14],[bu,86,12],[bu,90,40],[bf,80,62],[bu,6,52],[sp,14,84],[bu,60,90]],ink:[[mo,82,10],[st(),8,14],[sp,90,36],[st(),86,64],[sp,6,50],[st(),14,84],[sp,60,92]]}[S.theme]||[];
  $("#deco").innerHTML=L.map(([s,x,y],k)=>`<span style="left:${x}%;top:${y}%;animation-delay:${k*.7}s">${s}</span>`).join("")}

/* ---------- settings appliers ---------- */
function apply(){S.night=S.theme==="ink";const D=document.documentElement;D.classList.toggle("night",S.night);D.classList.toggle("th-sage",S.theme==="sage");document.querySelector('meta[name=theme-color]').content={sky:"#cfe6f7",sage:"#d7ecd2",ink:"#16204a"}[S.theme];if(deco._t!==S.theme){deco._t=S.theme;deco()}screen.classList.toggle("calm",S.calm);screen.classList.toggle("dys",S.dys);screen.classList.toggle("big",S.big);$("#calmBtn").setAttribute("aria-pressed",S.calm);
 $("#tint").style.background={none:"transparent",peach:"rgba(243,207,180,.35)",blue:"rgba(185,216,234,.35)",lilac:"rgba(217,198,230,.35)",mint:"rgba(191,224,207,.35)"}[S.tint];saveSettings(S)}
const LOOKS=[["sky","☁️","Sky","linear-gradient(160deg,#c9e4f6,#fff4d4)"],["sage","🌿","Sage","linear-gradient(160deg,#d7ecd2,#fbf3dc)"],["ink","🌙","Ink night","linear-gradient(160deg,#1b2a5e,#2a3c78)"]];
$("#themeBtn").onclick=()=>{const k=LOOKS.findIndex(l=>l[0]===S.theme),n=LOOKS[(k+1)%3];S.theme=n[0];apply();toast(n[1]+" "+n[2]+" look");beep(S.theme==="ink"?440:660);if(S.tab==="feed"&&window.THREE===undefined)return};
$("#calmBtn").onclick=()=>{S.calm=!S.calm;apply();toast(S.calm?"🍃 Calm mode: no motion, no sounds, softer colors":"Calm mode off");if(S.tab==="feed")renderFeed(true)};

/* ---------- onboarding: gamified brain quiz ---------- */
const LEARN=[["watch","👀","Watch","videos & pictures"],["listen","🎧","Listen","hear it out loud"],["read","📖","Read","short notes"],["play","🎮","Play","learn by doing"]];
const HARD=[["start","🚀","Getting started"],["reading","🔤","Reading walls of text"],["noise","🔊","Noise & surprises"],["numbers","🔢","Numbers & steps"],["writing","✍️","Writing or typing"],["time","⏱","Timers & pressure"],["english","🌎","English is new"],["bored","🥱","It's just boring"]];
const PETS=[["chick","Mochi"],["frog","Pickle"]];
const STAGES=[[0,"🥚 Egg","Hatches at 30 XP"],[30,"🍼 Baby","Grows at 80 XP"],[80,"🎒 Student","Graduates at 150 XP"],[150,"🎓 Graduate","Unlocks a hat!"]];
const stageOf=x=>[...STAGES].reverse().find(s=>x>=s[0]);
function petCard(){const st=stageOf(S.xp),i=STAGES.indexOf(st),nx=STAGES[i+1],pct=nx?Math.round((S.xp-st[0])/(nx[0]-st[0])*100):100;
  return `<div class="card" style="background:var(--mint2)"><div class="pet"><div class="bob" style="position:relative">${sq(S.pet,68)}${i===3?'<span style="position:absolute;top:-8px;left:22px;font-size:24px">🎓</span>':""}</div><div style="flex:1;display:grid;gap:4px"><b style="font-family:var(--head);font-size:19px">${esc(S.petName)} · ${st[1]}</b><div class="bar"><i style="width:${pct}%"></i></div><small class="muted">${st[2]}. Every reel you learn feeds ${esc(S.petName)}. ${esc(S.petName)} naps when you're away, never sad.</small></div></div></div>`}
const ONS={start:["Just 1 reel start button","Study with Scrolly (body double)"],reading:["Listen first, with karaoke words","Easy-read font + line ruler"],noise:["Calm mode: no motion or sounds"],numbers:["Step-by-step reels + Stack the Steps"],writing:["Answer by voice"],time:["No-timer mode"],english:["Translate any reel"],bored:["Game breaks more often"]};
function onboard(){
  const o=document.createElement("div");o.className="onb";screen.appendChild(o);let step=0;
  const xpbar=()=>`<div class="xprow"><span>⭐</span><div class="xp"><i id="xpI" style="width:${Math.min(100,S.xp*2)}%"></i></div><span id="xpN">${S.xp} XP</span></div>`;
  const gain=(el,n)=>{S.xp=Math.max(0,S.xp+n);const r=el.getBoundingClientRect(),q=o.getBoundingClientRect(),f=document.createElement("span");f.className="plus";f.textContent=(n>0?"+":"")+n;f.style.left=(r.left-q.left+r.width/2-10)+"px";f.style.top=(r.top-q.top+o.scrollTop)+"px";o.appendChild(f);setTimeout(()=>f.remove(),900);const I=$("#xpI"),N=$("#xpN");if(I)I.style.width=Math.min(100,S.xp*2)+"%";if(N)N.textContent=S.xp+" XP";beep(n>0?760:420)};
  const draw=()=>{
    if(step===0){o.innerHTML=`<div class="hello"><div class="bob">${rotty("excited",120)}</div><h3>Hi! I'm Scrolly 👋</h3><p class="muted" style="margin:0;max-width:28ch">Let's turn boring notes into a fun feed.</p></div>
      <div class="lbl" style="text-align:center">Pick your look</div><div class="tiles t3">${LOOKS.map(([k,e,n,g])=>`<button class="tile" data-th="${k}" aria-pressed="${S.theme===k}"><span class="em" style="background:${g};width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-size:22px">${e}</span>${n}</button>`).join("")}</div>
      <button class="cta" id="nx">Let's go!</button><button class="cta alt" id="jrBtn" style="margin-top:0">🧸 Scrollege Jr (for kids)</button>`;
      o.querySelectorAll("[data-th]").forEach(b=>b.onclick=()=>{S.theme=b.dataset.th;apply();o.querySelectorAll("[data-th]").forEach(x=>x.setAttribute("aria-pressed",x===b))});
      $("#nx").onclick=()=>{step=1;draw()};$("#jrBtn").onclick=()=>{S.jr=true;S.calm=false;toast("Scrollege Jr: bigger buttons, simpler words");S.big=true;apply();step=1;draw()};return}
    const back=`<button class="back" id="obBack" aria-label="Back">←</button>`;
    if(step===1){o.innerHTML=`${back}<div class="prog"><i class="on"></i><i></i></div>${xpbar()}<div style="display:flex;gap:8px;align-items:center">${sq("chick",56)}<div><h3>How do you like to learn?</h3></div></div>
      <div class="tiles">${LEARN.map(([k,e,t,d])=>`<button class="tile" data-l="${k}" aria-pressed="${S.learn.has(k)}"><span class="em">${ic(k,36)}</span>${t}<small>${d}</small></button>`).join("")}</div>
      <button class="cta" id="nx">Level up →</button>`;
      o.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{const k=b.dataset.l,on=!S.learn.has(k);on?S.learn.add(k):S.learn.delete(k);b.setAttribute("aria-pressed",on);gain(b,on?10:-10)});
      $("#nx").onclick=()=>{if(!S.learn.size)return toast("Pick at least one!");yay();toast("⭐ Level up!");step=3;draw()}}
    else if(step===2){o.innerHTML=`${back}<div class="prog"><i class="on"></i><i class="on"></i><i></i></div>${xpbar()}<div style="display:flex;gap:8px;align-items:center">${sq("cat",56)}<div><h3>What makes studying hard?</h3><span class="muted" style="font-size:14px">Pick any. No pressure 💛</span></div></div>
      <div class="tiles">${HARD.map(([k,e,t])=>`<button class="tile" data-h="${k}" aria-pressed="${S.hard.has(k)}"><span class="em">${e}</span>${t}</button>`).join("")}</div>
      <button class="cta" id="nx">Make my brain card ✨</button>`;
      o.querySelectorAll("[data-h]").forEach(b=>b.onclick=()=>{const k=b.dataset.h,on=!S.hard.has(k);on?S.hard.add(k):S.hard.delete(k);b.setAttribute("aria-pressed",on);gain(b,on?5:-5)});
      $("#nx").onclick=()=>{step=3;draw()}}
    else{const H=S.hard;S.calm=H.has("noise");S.dys=H.has("reading");S.ruler=H.has("reading");S.notimer=H.has("time");S.voice=H.has("writing");
      S.mode=H.has("reading")&&S.learn.has("listen")?"listen":S.learn.has("watch")?"watch":[...S.learn][0];apply();
      const lead=S.learn.has("listen")?[ic("listen",26),"Audio Explorer"]:S.learn.has("play")?[ic("play",26),"Game Brain"]:S.learn.has("read")?[ic("read",26),"Page Turner"]:[ic("watch",26),"Visual Thinker"];
      const ons=[...H].flatMap(k=>ONS[k]);
      o.innerHTML=`${back}<div class="prog"><i class="on"></i><i class="on"></i></div><div class="hello" style="margin-top:6px"><h3>Your brain card!</h3></div>
       <div class="bcard"><div class="bob">${rotty("proud",80)}</div><span class="lbl" style="margin:0">You are a</span><h4>${lead[0]} ${lead[1]}</h4>
        <div class="chips" style="justify-content:center">${[...S.learn].map(k=>`<span>${ic(k,15)} ${LEARN.find(x=>x[0]===k)[2]}</span>`).join("")}${S.calm?"<span>🌙 Calm</span>":""}</div>
        <div class="on-list">${(ons.length?ons:["Everything on default. Change anything in Me."]).map(x=>`<div class="chips"><span style="background:var(--mint2)">✓ ${x}</span></div>`).join("")}</div>
        <span class="chips"><span>⭐ ${S.xp} XP</span></span></div>
        <div class="lbl">Pick a study buddy to raise</div><div class="tiles t3">${PETS.map(([k,n])=>`<button class="tile" data-pet="${k}" aria-pressed="${S.pet===k}">${sq(k,44)}${n}</button>`).join("")}</div>
       <button class="cta" id="nx">Make my first feed 🍳</button>`;
      o.querySelectorAll("[data-pet]").forEach(b=>b.onclick=()=>{S.pet=b.dataset.pet;S.petName=PETS.find(x=>x[0]===S.pet)[1];o.querySelectorAll("[data-pet]").forEach(x=>x.setAttribute("aria-pressed",x===b));beep(880)});
      $("#nx").onclick=()=>{o.remove();S.onboarded=true;saveSettings(S);yay();show("make")}}
    const bb=$("#obBack");if(bb)bb.onclick=()=>{step=step===3?1:step-1;draw()};
  };draw();
}

/* ---------- nav ---------- */
const NAV=[["feed",ic("feed",24),"Feed"],["make",ic("make",24),"Make"],["me",ic("me",24),"Me"]];
$("#nav").innerHTML=NAV.map(([k,e,t])=>`<button data-v="${k}"><span class="e">${e}</span>${t}</button>`).join("");
$("#nav").onclick=e=>{const b=e.target.closest("button");if(b){sfx("tap");show(b.dataset.v)}};
function show(v,fromBack){if(!fromBack&&S.tab&&S.tab!==v)S.hist.push(S.tab);hush();closeSheet();S.tab=v;saveSettings(S);
  $$("#nav button").forEach(b=>b.dataset.v===v?b.setAttribute("aria-current","page"):b.removeAttribute("aria-current"));
  screen.classList.toggle("feedon",v==="feed");
  const V=$("#views");if(v==="feed"){V.innerHTML=`<section class="view feed" id="feedV" aria-label="Study feed"></section>`;renderFeed();return}
  V.innerHTML=`<section class="view"><div class="pad" id="P"></div></section>`;({make:renderMake,focus:renderFocus,me:renderMe})[v]()}
const P=()=>$("#P");
function goBack(){const ov=[...screen.querySelectorAll(".ov,.onb")].pop();if(ov){const b=ov.querySelector(".back");if(b)return b.click();return}
  if($("#sheet").classList.contains("on"))return closeSheet();if(S.tab==="feed"&&S.feed==="explore"){S.feed="around";hush();return renderFeed()}if(S.hist.length)return show(S.hist.pop(),true);if(S.tab!=="feed")return show("feed",true);if(S.feed!=="mine"){S.feed="mine";return renderFeed()}toast("You're home 🏠")}
$("#backBtn").onclick=goBack;

/* ---------- make a feed ---------- */
function renderMake(){
  P().innerHTML=`<h2>Make a feed</h2><span class="muted" style="margin-top:-8px">Drop anything. Get 5 snack-size reels 🍪</span>
   <div class="input-tabs" role="group" aria-label="What are you giving Scrolly?">${[["pdf","📄","PDF"],["notes","📝","Notes"],["photo","📷","Photo"]].map(([k,e,t],i)=>`<button class="tile" data-in="${k}" aria-pressed="${i===0}"><span class="em">${e}</span>${t}</button>`).join("")}</div>
   <div id="inBox"></div>
   <details class="more"><summary>🗓 Got a test coming up?</summary><div class="in"><div class="row2"><input class="in" id="tName" placeholder="ML quiz" aria-label="Test name" value="${S.test?esc(S.test.n):""}"><input class="in" id="tDate" type="date" aria-label="Test date" value="${S.test?S.test.d:""}"></div><small class="muted">Scrolly spreads your reels out so you review a little each day.</small></div></details>
   <button class="cta pink" id="go">Cook my feed 🍳</button>`;
  let mode="pdf";const box=()=>{$("#inBox").innerHTML={pdf:`<label class="cta alt" style="text-align:center;cursor:pointer;display:block">📄 Upload a PDF<br><small class="muted">Slides, class notes or a textbook chapter</small><input type="file" accept="application/pdf" id="inPdf" hidden></label><div id="pdfOut"></div>`,notes:`<textarea class="in" id="inT" aria-label="Your notes">${NOTES}</textarea>`,
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
    else req={type:"photo",data:S.photo};
    if(mode==="notes"&&req.data.trim().length<40)return toast("Add a few more lines of notes first");
    S.src={pdf:S.pdf?S.pdf.name:"your PDF",notes:"your notes",photo:"your photo"}[mode];cook(req)};
}
/* shrink a photo so it uploads fast (long edge 1600px, jpeg) */
function shrinkImage(file,max=1600){return new Promise((res,rej)=>{const img=new Image(),u=URL.createObjectURL(file);img.onload=()=>{const k=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement("canvas");c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL("image/jpeg",.85))};img.onerror=rej;img.src=u})}
const PDF_MAX_PAGES=40,PDF_MAX_MB=15,SCAN_MAX=20;
async function readPdf(f){if(!f)return;const out=$("#pdfOut");S.pdf=null;
  if(!window.pdfjsLib){out.innerHTML='<span class="muted">PDF reader is still loading. Try again in a second.</span>';return}
  if(f.size>PDF_MAX_MB*1024*1024){out.innerHTML=`<div class="card" style="box-shadow:none;background:var(--blush2)"><b>That PDF is a big one (${(f.size/1048576).toFixed(1)} MB)</b><span>Scrolly can read up to ${PDF_MAX_MB} MB for now. Try one chapter at a time.</span></div>`;return}
  out.innerHTML=`<div class="card" style="box-shadow:none"><span class="muted" id="pdfProg">📖 Reading ${esc(f.name)}…</span></div>`;
  try{
   const doc=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise,n=doc.numPages,pages=[];
   if(n>PDF_MAX_PAGES){out.innerHTML=`<div class="card" style="box-shadow:none;background:var(--blush2)"><b>${n} pages is a lot!</b><span>Scrolly reads up to ${PDF_MAX_PAGES} pages for now. Try splitting it into chapters.</span></div>`;return}
   for(let k=1;k<=n;k++){const pg=await doc.getPage(k),tc=await pg.getTextContent();pages.push(tc.items.map(x=>x.str).join(" ").replace(/\s+/g," ").trim());const pr=$("#pdfProg");if(pr)pr.textContent=`📖 Reading page ${k} of ${n}…`}
   const all=pages.join(" "),words=all.split(" ").filter(Boolean).length;
   const empty=pages.filter(t=>t.split(" ").filter(Boolean).length<3).length,scanned=empty>n/2;/* most pages have no text layer */S.pdf={name:f.name,pages,n,scanned};
   if(scanned){const m=Math.min(n,SCAN_MAX),images=[];
     for(let k=1;k<=m;k++){const pr=$("#pdfProg");if(pr)pr.textContent=`📷 No text layer. Snapping page ${k} of ${m} for Scrolly to read…`;
       const pg=await doc.getPage(k),vp0=pg.getViewport({scale:1}),sc=Math.min(2,1400/Math.max(vp0.width,vp0.height)),vp=pg.getViewport({scale:sc}),c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;
       await pg.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;images.push({n:k,dataUrl:c.toDataURL("image/jpeg",.8)})}
     S.pdf.images=images;
     out.innerHTML=`<div class="card" style="box-shadow:none;background:var(--butter2)"><b>📷 ${esc(f.name)}</b><span>${n} page${n===1?"":"s"} · scanned (no text layer)</span><small class="muted">Scrolly will read ${m===n?"the pages":"the first "+m+" pages"} with AI vision when you cook. Only the page pictures are sent, nothing else.</small></div>`;beep(700);return}
   out.innerHTML=`<div class="card" style="box-shadow:none;background:var(--mint2)"><b>✓ ${esc(f.name)}</b><span>${n} page${n===1?"":"s"} · ${words.toLocaleString()} words</span><div class="box" style="max-width:none;box-shadow:none;font-size:13.5px">${esc(all.slice(0,280))}…</div><small class="muted">Each reel will link to its page number. Only the text is sent, never the file.</small></div>`;beep(880)}
  catch(e){out.innerHTML=e&&e.name==="PasswordException"?`<div class="card" style="box-shadow:none;background:var(--blush2)"><b>🔒 This PDF has a password</b><span>Open it, save a copy without the password, then upload that.</span></div>`:`<span class="muted">Couldn't read that PDF. Is it a real PDF file?</span>`}}
function cook(req){const o=document.createElement("div");o.className="ov";o.innerHTML=`<div class="bob">${rotty("thinking",100)}</div><h3>Scrolly is cooking your feed…</h3>
  <div class="cook">${["📖 Reading "+(req.type.startsWith("pdf")&&S.pdf?S.pdf.n+" PDF pages":req.type==="photo"?"your photo":"your notes"),"🔑 Finding the 5 big ideas","🎬 Making reels: watch, listen, read","🎮 Building games","📎 Checking every reel against your source"].map(x=>`<div>${x}</div>`).join("")}</div>
  <small class="muted" id="cookNote" aria-live="polite"></small>`;screen.appendChild(o);
  const rows=[...o.querySelectorAll(".cook div")];let k=0,anim=false,result=null;
  const finish=()=>{if(!anim||!result)return;o.remove();
    if(result.err){toast(result.err);return}
    if(!result.deck.id)result.deck.id="d"+Date.now();S.feed="mine";useDeck(result.deck);S.deckId=MINE.id;S.src=MINE.sourceLabel||S.src;S.built=true;S.idx=0;S.got=new Set();S.later=new Set();S.wrong=[];S.simple=new Set();S.seen=new Set();
    saveDeck(MINE);saveSettings(S);yay();show("feed");toast(result.note||"Your feed is ready! Swipe up 👆")};
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
    if(!src)src=all.length?{text:all.map(l=>l.text).join("\n"),lines:all.map((l,i)=>({...l,n:i+1})),sourceLabel:req.data.name}:{error:"Scrolly couldn't read any of those pages."};
  }else src=await post("source",req);
  if(src.offline)return demo("📴 Offline, so here's the sample deck. Your real one cooks when you're back online.");
  if(src.error)return {err:"😕 "+src.error};
  if(src.demo)return demo("Demo mode: here's the sample ML Basics deck. Add API keys to cook your own!");
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
    ${r.tryit?`<button class="cta pink" style="padding:10px" data-try>🧪 Try it: fit the line yourself</button>`:""}<div class="chips"><button data-simple>${simple?"↩ Full version":"🧸 Simpler please"}</button><button data-bion>${S.bionic?"✓ ":""}Bionic</button><button data-rul>${S.ruler?"✓ ":""}Ruler</button><button data-ra>🔊 Read aloud</button></div></div>`}
  if(m==="play"&&!S.tapQuiz){const g=GAMES.find(x=>x[0]===FEAT[i%FEAT.length]);return `<div class="box playcard" style="background:${g[3]}">${ic(g[0],44)}<b style="font-family:var(--head);font-size:22px">${g[1]}</b><span class="muted" style="font-size:14px">${g[2]}. Made from this reel.</span><button class="cta pink" data-run="${g[0]}">▶ Play</button><div class="chips" style="justify-content:center"><button data-gp>🎮 Other games</button><button data-tapq>Simple tap quiz</button></div></div>`}
  if(m==="play"){return `<div class="box" data-quiz="${i}"><b style="font-family:var(--head);font-size:18px">${esc(r.q[0])}</b><div class="opts">${r.q[1].map((o,k)=>`<button class="opt" data-ans="${k}">${esc(o)}</button>`).join("")}</div>
    ${S.voice?`<button class="cta alt" data-vans style="padding:10px">🎤 Say your answer</button>`:""}<small class="muted">${S.notimer?"No timer. Take your time.":"No rush. Retries are free."}</small><button class="chips" style="justify-self:start" data-run="${FEAT[i%FEAT.length]}"><span>🎮 Play it as a game instead</span></button></div>`}
  const lines=S.story?r.story:r.cap;return `<div style="width:100%;text-align:center">${(DECK.demo||DECK.pack)&&SC[r.sc??i]?SC[r.sc??i]:`<div class="gen-scene bob">${sq(PETS[i%PETS.length][0],130)}</div>`}<div class="cap" data-cap="${i}" aria-live="polite"></div>${r.tryit?`<div class="wbtns"><button class="cta pink" data-try>🧪 Try it yourself</button></div>`:""}${S.story?'<div class="chips" style="justify-content:center;margin-top:6px"><span>📖 Story mode</span></div>':""}</div>`;
}
function renderFeed(keep){
  const V=$("#feedV");if(!V)return;showing();
  const tabs=`<div class="ftabs" role="tablist" aria-label="Feed"><button role="tab" data-ft="mine" aria-selected="${S.feed==="mine"}">${ic("notes",16)} My notes</button>${S.feed==="explore"?`<button role="tab" data-ft="around" class="backtab" aria-selected="true">← Explore</button>`:`<button role="tab" data-ft="around" aria-selected="${S.feed==="around"}">${ic("compass",16)} Explore</button>`}</div>`;
  const putTabs=()=>{$$("#views .ftabs,#views .topfade,#views .fdots").forEach(x=>x.remove());$("#views").insertAdjacentHTML("beforeend",tabs);bindTabs()};
  if(!S.built&&S.feed==="mine"){putTabs();V.innerHTML=`<div class="pad" style="align-items:center;text-align:center;padding-top:110px">${rotty("sleepy",110)}<h2>No feed yet</h2><p class="muted" style="margin:0">Drop your notes, a PDF or a photo and Scrolly makes one.</p><button class="cta pink" onclick="show('make')">➕ Make my feed</button><button class="cta alt" onclick="S.feed='around';renderFeed()">🧭 Explore what's new in AI</button><button class="cta alt" onclick="S.built=true;renderFeed()">Try a sample (ML Basics notes)</button></div>`;return}
  V.classList.toggle("free",S.feed==="around");
  if(S.feed==="around"){putTabs();$("#views").insertAdjacentHTML("beforeend",'<div class="topfade" aria-hidden="true"></div>');renderAround(V);V.scrollTop=S.aTop||0;V.onscroll=()=>{S.aTop=V.scrollTop};return}
  if(S.feed==="explore"&&!PACK){putTabs();V.innerHTML=`<div class="pad" style="align-items:center;text-align:center;padding-top:110px">${rotty("thinking",100)}<h2>Loading fun facts…</h2></div>`;loadPack();return}
  const top=keep?V.scrollTop:0;
  const ord=feedOrder(),due=dueToday(S,did()),slots=[];ord.forEach((i,pos)=>{slots.push(reel(DECK.reels[i],i,pos,ord,due.includes(i)));if(pos===2)slots.push(gameSlot())});slots.push(limitSlot(ord.length));
  putTabs();$("#views").insertAdjacentHTML("beforeend",`<div class="fdots" id="fdots" aria-hidden="true">${ord.map(()=>"<i></i>").join("")}</div>`);V.innerHTML=slots.join("");V.scrollTop=top;bindFeed();tickCaps();setTimeout(dotsNow,30);
}
function bindTabs(){$$("[data-ft]").forEach(b=>b.onclick=e=>{e.stopPropagation();S.feed=b.dataset.ft;saveSettings(S);hush();renderFeed();beep(640);if(S.feed==="around")toast("🧭 Explore: news, next topics and projects")})}
function reel(r,i,pos=i,ord=DECK.reels.map((_,k)=>k),isRev=false){const n=DECK.reels[ord[pos+1]];return `<article class="slot" data-i="${i}" data-pos="${pos}" style="--a:${r.a}">
  <div class="modes" role="group" aria-label="How do you want to learn this?">${["watch","listen","read","play"].map(k=>`<button data-m="${k}" aria-pressed="${S.mode===k}">${ic(k,15)} ${k[0].toUpperCase()+k.slice(1)}</button>`).join("")}</div>
    <div class="stage">${stage(r,i)}</div>
  <div class="info"><h3>${esc(r.t)}</h3>${isRev?`<span class="next">🔁 Back for review</span>`:""}<span class="src">${DECK.pack?esc(DECK.label||DECK.title):"📎 From "+srcRef(r)}</span>${S.calm&&n?`<span class="next">Next: ${esc(n.t)}</span>`:""}</div>
  <div class="rail">${r.v3&&HAS_GL?`<button class="rb" data-a="v3"><span class="o">${ic("v3",26)}</span>Watch 3D</button>`:""}<button class="rb" data-a="g3"><span class="o">${ic("play",26)}</span>Games</button><button class="rb" data-a="ask"><span class="o">${ic("ask",26)}</span>Ask</button><button class="rb" data-a="more"><span class="o">${ic("more",26)}</span>More</button></div></article>`}
function gameSlot(){return `<article class="slot" data-game style="--a:#f1eaf7"><div class="pad" style="padding-top:100px;padding-right:16px;height:100%;overflow-y:auto">
  <div style="display:flex;gap:8px;align-items:center">${sq("frog",54)}<div><h2 style="font-size:26px">Game time!</h2><span class="muted" style="font-size:14px">${gameList().length} tiny 3D games from ${DECK.pack?"these "+esc(DECK.title):esc(S.src)}.</span></div></div>
  ${gameGrid()}<small class="muted">Keys, swipes or the big buttons all work. ${S.notimer?"No-timer mode is on: games wait for you.":""}</small></div></article>`}
function limitSlot(cnt=DECK.reels.length){const rv=pileN();return `<article class="slot" data-limit style="--a:#fcf3d6"><div class="pad" style="align-items:center;text-align:center;padding-top:90px">${rotty("sleepy",84)}<h2>That's your ${cnt} for today! 🎉</h2><button class="mback" onclick="pullCard()" aria-label="Flip your meme card">?</button><b style="font-family:var(--head)">🃏 Tap to flip your meme card</b>
  <p class="muted" style="margin:0">You showed up for your brain today. Scrolly's napping now. Brains need breaks too.</p>
  <div class="stats" style="width:100%"><div><b>${S.xp}</b><small>XP</small></div><div><b>${S.streak}</b><small>day streak</small></div><div><b>${rv}</b><small>in review pile</small></div></div>
  <div style="width:100%;text-align:left">${petCard()}</div><button class="cta" onclick="show('me')">🧸 See my buddy</button><button class="cta alt" onclick="toast('Shared! Your friend gets the same 5 reels to beat your score.')">⚔️ Duel a friend</button></div></article>`}
let capK=0;function tickCaps(){$$("[data-cap]").forEach(el=>{const r=DECK.reels[+el.dataset.cap],lines=S.story?r.story:r.cap,l=lines[capK%lines.length];el.innerHTML=l.split(" ").map((w,k)=>`<span style="animation-delay:${k*.07}s">${esc(w)}</span>`).join(" ")})}
setInterval(()=>{capK++;tickCaps()},S.calm?3600:2700);
function dotsNow(){const V=$("#feedV"),D=$("#fdots");if(!V||!D)return;const sl=V.children[Math.round(V.scrollTop/V.clientHeight)];const p=sl&&sl.dataset.pos!==undefined?+sl.dataset.pos:-1;D.style.opacity=p<0?0:1;if(p>=0)[...D.children].forEach((d,k)=>d.className=k===p?"on":k<p?"seen":"")}
function bindFeed(){
  const V=$("#feedV");
  V.onclick=ev=>{const slot=ev.target.closest(".slot");if(!slot)return;
    if(slot.hasAttribute("data-game")){const g=ev.target.closest("[data-g]");if(g)return playGame(g.dataset.g,0);return}
    if(!slot.dataset.i)return;const i=+slot.dataset.i,r=DECK.reels[i];
    const mb=ev.target.closest("[data-m]");if(mb){S.mode=mb.dataset.m;hush();$$("#feedV .slot[data-i]").forEach(s=>{const j=+s.dataset.i;s.querySelectorAll("[data-m]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===S.mode));s.querySelector(".stage").innerHTML=stage(DECK.reels[j],j)});tickCaps();beep(600);return}
    if(ev.target.closest("[data-play]"))return podcast(slot,r,i,1);
    const vb=ev.target.closest("[data-vibe]");if(vb){S.vibe=vb.dataset.vibe;slot.querySelectorAll("[data-vibe]").forEach(x=>x.style.background=x===vb?"var(--pink)":"");return podcast(slot,r,i,1)}
    const sp=ev.target.closest("[data-spd]");if(sp){slot.querySelectorAll("[data-spd]").forEach(x=>x.style.background=x===sp?"var(--pink)":"");return podcast(slot,r,i,+sp.dataset.spd)}
    if(ev.target.closest("[data-simple]")){S.simple.has(i)?S.simple.delete(i):S.simple.add(i);slot.querySelector(".stage").innerHTML=stage(r,i);return}
    if(ev.target.closest("[data-bion]")){S.bionic=!S.bionic;slot.querySelector(".stage").innerHTML=stage(r,i);return}
    if(ev.target.closest("[data-rul]")){S.ruler=!S.ruler;slot.querySelector(".stage").innerHTML=stage(r,i);return}
    if(ev.target.closest("[data-ra]"))return say(S.simple.has(i)?r.simple:r.t+". "+r.read.join(". "));
    if(ev.target.closest("[data-v3]"))return video3d(r);
    if(ev.target.closest("[data-try]"))return fitLab();
    const rn=ev.target.closest("[data-run]");if(rn)return playGame(rn.dataset.run||"run",i);
    if(ev.target.closest("[data-gp]"))return gamePicker(i);
    if(ev.target.closest("[data-tapq]")){S.tapQuiz=true;slot.querySelector(".stage").innerHTML=stage(r,i);return}
    const an=ev.target.closest("[data-ans]");if(an)return answer(slot,r,i,+an.dataset.ans);
    if(ev.target.closest("[data-vans]")){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast("Voice isn't supported here. Try Chrome.");const rec=new SR();rec.onresult=e=>{const heard=e.results[0][0].transcript.toLowerCase(),k=r.q[1].findIndex(o=>heard.includes(o.toLowerCase().split(" ")[0]));toast("Heard: “"+heard+"”");answer(slot,r,i,k<0?99:k)};try{rec.start();toast("Listening…")}catch(e){}return}
    const a=ev.target.closest("[data-a]")?.dataset.a;if(!a)return;
    if(a==="got"){learned(i);S.xp+=5;ev.target.closest(".rb").classList.add("on");yay();toast("Nice! +5 XP");return}
    if(a==="later"){later(i);ev.target.closest(".rb").classList.add("on");toast("Saved. It'll come back tomorrow 🔁");return}
    if(a==="jingle")return jingle(r);
    if(a==="ask")return ask(r);
    if(a==="g3")return gamePicker(i);
    if(a==="v3")return video3d(r);
    if(a==="more")return more(r,i);
  };
  const rule=(t,cy)=>{const b=t.closest&&t.closest(".box.ruled");if(!b)return;const ru=b.querySelector(".ruler"),y=cy-b.getBoundingClientRect().top+b.scrollTop-20;ru.style.top=Math.max(0,y)+"px"};
  V.onpointermove=e=>rule(e.target,e.clientY);V.ontouchmove=e=>{const t=e.touches[0];if(t)rule(e.target,t.clientY)};
  let last=-1;V.onscroll=()=>{const k=Math.round(V.scrollTop/V.clientHeight);if(k!==last){last=k;hush();S.seen.add(k);dotsNow()}};
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
   ${local()?"":`<button class="cta alt" id="jNew" style="margin-top:8px;padding:10px">✨ New rhyme</button>`}`);
  const jn=$("#jNew");if(jn)jn.onclick=async()=>{jn.disabled=true;jn.textContent="✍️ Writing…";const j=await post("jingle",{reel:{t:r.t,read:r.read,jingle:r.jingle}});jn.disabled=false;jn.textContent="✨ New rhyme";
    if(j.error||j.demo||!j.jingle)return toast(j.error?"😕 "+j.error:"Needs an API key");r.jingle=j.jingle;saveDeck(DECK);$("#sheet").querySelectorAll("[data-ly]").forEach((x,k)=>x.textContent=r.jingle[k]||"")};
  $("#sheet").querySelectorAll("[data-bt]").forEach(b=>b.onclick=()=>{beat=b.dataset.bt;$("#sheet").querySelectorAll("[data-bt]").forEach(x=>x.style.background=x===b?"var(--pink)":"")});
  $("#sheet .x").onclick=()=>{stop();closeSheet()};$("#jSave").onclick=()=>{saveDeck(DECK);toast("Saved to your jingles 🎵")};
  $("#jPlay").onclick=()=>{stop();const B=BEATS[beat],sp=60/B.bpm;const wasCalm=S.calm;S.calm=false;
    B.notes.concat(B.notes).forEach((f,k)=>beep(f,sp*.8,B.type,k*sp));S.calm=wasCalm;
    r.jingle.forEach((l,k)=>T.push(setTimeout(()=>{$$("[data-ly]").forEach(x=>x.classList.toggle("on",+x.dataset.ly===k));say(l,beat==="lull"?.85:beat==="pop"?1.15:1)},k*sp*8*1000)));
    T.push(setTimeout(()=>$$("[data-ly]").forEach(x=>x.classList.remove("on")),r.jingle.length*sp*8*1000))}}

function fitLab(){let pts=[[1,2],[2,2.6],[3,3.1],[4,4.4],[5,4.8],[6,6.1]];
  openSheet(`<h4 id="sheetTitle">🧪 Fit the line</h4><p class="sub">Tap the graph to add dots. Watch the best-fit line move!</p><canvas id="fit" width="600" height="420" style="width:100%;border-radius:22px;background:var(--card);touch-action:none;cursor:crosshair" aria-label="Scatter plot. Tap to add points."></canvas>
   <div class="card" style="margin-top:10px;text-align:center"><b id="eq" style="font-size:22px">y = …</b><span id="err" class="muted"></span></div><div class="row2" style="margin-top:8px"><button class="cta alt" id="fitClear">🧹 Clear</button><button class="cta alt" id="fitOut">🙃 Add a weird dot</button></div>
   <small class="muted">This is real least-squares math, running in your browser.</small>`);
  const c=$("#fit"),x=c.getContext("2d"),W=600,H=420,P=40,X=v=>P+v/8*(W-2*P),Y=v=>H-P-v/8*(H-2*P);
  const draw=()=>{x.clearRect(0,0,W,H);x.strokeStyle="#d9cbe0";x.lineWidth=2;for(let k=0;k<=8;k++){x.beginPath();x.moveTo(X(k),Y(0));x.lineTo(X(k),Y(8));x.moveTo(X(0),Y(k));x.lineTo(X(8),Y(k));x.stroke()}
    const n=pts.length;let m=0,b=0,err=0;if(n>=2){const mx=pts.reduce((a,p)=>a+p[0],0)/n,my=pts.reduce((a,p)=>a+p[1],0)/n,sxx=pts.reduce((a,p)=>a+(p[0]-mx)**2,0),sxy=pts.reduce((a,p)=>a+(p[0]-mx)*(p[1]-my),0);m=sxx?sxy/sxx:0;b=my-m*mx;err=pts.reduce((a,p)=>a+(p[1]-(m*p[0]+b))**2,0)/n;
      pts.forEach(p=>{x.strokeStyle="#f6cdb0";x.lineWidth=3;x.setLineDash([6,6]);x.beginPath();x.moveTo(X(p[0]),Y(p[1]));x.lineTo(X(p[0]),Y(m*p[0]+b));x.stroke();x.setLineDash([])});
      x.strokeStyle="#3d8fc4";x.lineWidth=6;x.lineCap="round";x.beginPath();x.moveTo(X(0),Y(b));x.lineTo(X(8),Y(m*8+b));x.stroke()}
    pts.forEach(p=>{x.fillStyle="#c9cdf0";x.strokeStyle="#5b4b45";x.lineWidth=3;x.beginPath();x.arc(X(p[0]),Y(p[1]),10,0,7);x.fill();x.stroke()});
    $("#eq").textContent=n>=2?`y = ${m.toFixed(2)}x ${b<0?"−":"+"} ${Math.abs(b).toFixed(2)}`:"Add 2+ dots";$("#err").textContent=n>=2?`Average squared error: ${err.toFixed(2)} (smaller = better fit)`:""};
  c.onpointerdown=e=>{const r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width*W,py=(e.clientY-r.top)/r.height*H;const vx=(px-P)/(W-2*P)*8,vy=(H-P-py)/(H-2*P)*8;if(vx<0||vx>8||vy<0||vy>8)return;pts.push([vx,vy]);beep(700);draw()};
  $("#fitClear").onclick=()=>{pts=[];draw()};$("#fitOut").onclick=()=>{pts.push([7,1]);beep(300,.15,"triangle");draw();toast("See how one weird dot (an outlier) pulls the line?")};draw();S.xp+=5}
/* ---------- ask (grounded) ---------- */
function localAsk(q){const words=q.toLowerCase().match(/[a-z]{4,}/g)||[];let best=null,score=0;
  DECK.reels.forEach(rr=>rr.read.concat(rr.simple).forEach(line=>{const s=words.filter(w=>line.toLowerCase().includes(w.replace(/s$/,""))).length;if(s>score){score=s;best={line,rr}}}));
  return score?{answer:best.line,line:best.rr.line,ref:srcRef(best.rr)}:{answer:null}}
function ask(r){const chips=DECK.chips?DECK.chips.concat(DECK.pack?["Who invented the iPhone?"]:[]):DECK.reels.slice(0,3).map(x=>x.t.replace(/[?.!]*$/,"?"));
  openSheet(`<h4 id="sheetTitle">💬 Ask Scrolly</h4><p class="sub">I only answer from ${DECK.pack?"this feed":DECK.sourceType==="pdf"?"your PDF":"your notes"}, and I show where it came from.</p>
  <div class="chips">${chips.map(q=>`<button data-q>${esc(q)}</button>`).join("")}</div>
  <div class="chat" id="chat" aria-live="polite"></div><form class="ask" id="af"><input id="aq" placeholder="Ask about ${esc(DECK.title)}…" aria-label="Your question"><button>Ask</button></form>`);
  const go=async q=>{$("#chat").insertAdjacentHTML("beforeend",`<div class="me">${esc(q)}</div>`);
    let res=null;if(!local()){const j=await post("ask",{question:q,deck:{title:DECK.title,reels:DECK.reels.map(x=>({t:x.t,read:x.read,line:x.line}))},lines:DECK.lines||[]});if(!j.error&&!j.demo)res={answer:j.answer,line:j.line,ref:j.line?srcAt(j.line):esc(DECK.sourceLabel)}}
    if(!res){await new Promise(r=>setTimeout(r,400));res=localAsk(q)}
    const c=$("#chat");if(!c)return;
    c.insertAdjacentHTML("beforeend",res.answer?`<div class="bot">${esc(res.answer)}<br><span class="src" style="display:inline-block;margin-top:6px">📎 ${res.ref}</span></div>`:`<div class="bot">That's not in ${DECK.pack?"this feed":"your notes"}, so I won't guess. 🙈</div>`)};
  $("#sheet").querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>go(b.textContent));$("#af").onsubmit=e=>{e.preventDefault();const q=$("#aq").value.trim();if(q){$("#aq").value="";go(q)}}}
function srcAt(n){const L=(DECK.lines||[]).find(l=>l.n===n);if(L&&L.page)return esc(DECK.sourceLabel)+", page "+L.page;return esc(DECK.sourceLabel)+(DECK.sourceType==="notes"?", line "+n:"")}

/* ---------- more ---------- */
function more(r,i){openSheet(`<h4 id="sheetTitle">More</h4><p class="sub">${esc(r.t)}</p><div style="display:grid;gap:8px">
  <button class="opt" data-mo="story">📖 ${S.story?"Turn off story mode":"Story mode: tell it as a story"}</button>
  <button class="opt" data-mo="jingle">🎵 Make it a jingle</button>

  <button class="opt" data-mo="teach">🧑‍🏫 Teach it back to Scrolly</button>
  <button class="opt" data-mo="simple">🧸 Explain it simpler</button>
  <div class="opt">🌎 Translate <select id="lang" style="border:2px solid ${INK};border-radius:10px;padding:4px;background:var(--card)">${["English","Español","中文","Tiếng Việt","हिन्दी","العربية"].map(l=>`<option ${l===S.lang?"selected":""}>${l}</option>`).join("")}</select></div>
  <button class="opt" data-mo="src">📎 See the source</button>

  <button class="opt" data-mo="flag">🚩 Report a mistake</button></div>`);
  $("#lang").onchange=async e=>{const lang=e.target.value;closeSheet();
    if(local()){S.lang=lang;return toast("Reels will play in "+lang+" (demo)")}
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
    if(k==="flag")toast("Thanks! Scrolly will double-check this reel.")})}

function teach(r){const keys=[...new Set(r.read.join(" ").toLowerCase().match(/[a-zé₂₆₁]{5,}/g))].filter(w=>!["their","there","about","which","mostly","called","inside","plants","contain","tiny"].includes(w)).slice(0,8);
  openSheet(`<h4 id="sheetTitle">🧑‍🏫 Teach Scrolly</h4><p class="sub">Explain “${esc(r.t)}” like Scrolly is 5. Teaching it is the best way to remember it!</p>
   <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">${rotty("thinking",56)}<span class="bot" style="flex:1">I'm listening! What is it? 🤔</span></div>
   <textarea class="in" id="tb" placeholder="Type or tap 🎤 and say it…"></textarea><div class="row2" style="margin-top:8px"><button class="cta alt" id="tbMic">🎤 Say it</button><button class="cta" id="tbGo">Teach!</button></div><div id="tbR" style="margin-top:10px"></div>`);
  $("#tbMic").onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast("Voice isn't supported here. Try Chrome.");const rec=new SR();rec.onresult=e=>{$("#tb").value=e.results[0][0].transcript};try{rec.start();toast("Listening…")}catch(e){}};
  $("#tbGo").onclick=async()=>{const raw=$("#tb").value,t=raw.toLowerCase();if(t.length<8)return toast("Tell Scrolly a bit more!");
    if(!local()){$("#tbR").innerHTML=`<span class="muted">🤔 Scrolly is thinking…</span>`;const j=await post("teach",{reel:{t:r.t,read:r.read,simple:r.simple},explanation:raw});
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
   <div class="card" style="background:var(--mint2)"><b>👯 Study with Scrolly</b><span class="muted" style="font-size:14px">Scrolly studies next to you, so it's easier to stay on track.</span>
    <div class="row2">${[5,10,15].map(m=>`<button class="tile" data-bd="${m}"><span class="em">${m===5?"🌱":m===10?"🌿":"🌳"}</span>${m} min</button>`).join("")}</div></div>
   <div class="card" style="background:var(--lilac2)"><b>🗓 Test countdown</b>${S.test?`<span><b>${esc(S.test.n)}</b> in <b>${days}</b> day${days===1?"":"s"}</span><span class="muted" style="font-size:14px">Plan: 5 reels a day + your review pile. Scrolly reminds you gently.</span>`:`<span class="muted">Add a test date in Make, and Scrolly plans your days.</span>`}</div>
   <div class="card"><b>🔁 Review pile</b><span>${pileN()} reel${pileN()===1?"":"s"} in your pile (things you saved or missed). ${dueN()} due today.</span></div>
   <button class="cta alt" onclick="breathe()">😮‍💨 I'm overwhelmed</button>`;
  $("#one").onclick=()=>{if(!S.built)S.built=true;show("feed");toast("Just this one. You've got it 💪")};
  P().querySelectorAll("[data-bd]").forEach(b=>b.onclick=()=>buddy(+b.dataset.bd));
}
function buddy(min){const o=document.createElement("div");o.className="ov";let sec=min*60,pause=false;
  o.innerHTML=`<button class="back" aria-label="Stop">←</button><div class="bob">${rotty("thinking",120)}</div><h3>Scrolly is studying with you</h3>
   <div style="font-family:var(--head);font-size:48px" id="bt">${S.notimer?"🌱":min+":00"}</div><span class="muted">${S.notimer?"No timer. Scrolly taps you gently when time's up.":"Phone down, brain on. You can do this."}</span>
   <div class="row2" style="width:100%;max-width:300px"><button class="cta alt" id="bp">⏸ Pause</button><button class="cta" id="bdone">I'm done</button></div>`;screen.appendChild(o);
  const t=setInterval(()=>{if(pause)return;sec--;const e=$("#bt");if(e&&!S.notimer)e.textContent=Math.floor(sec/60)+":"+String(sec%60).padStart(2,"0");if(sec<=0)fin()},1000);
  const fin=()=>{clearInterval(t);o.remove();S.xp+=15;yay();toast("Focus level complete! +15 XP 🌳")};
  o.querySelector(".back").onclick=()=>{clearInterval(t);o.remove()};$("#bp").onclick=e=>{pause=!pause;e.target.textContent=pause?"▶ Resume":"⏸ Pause"};$("#bdone").onclick=fin}
/* ---------- 🫧 break bubble: real, physical relax activities ---------- */
const RELAX=[
 ["box","Box breathing","1 min · calm your body","#dbeefa","breathe",[["Breathe in through your nose",4],["Hold gently",4],["Breathe out slowly",4],["Hold, then again",4],["Breathe in",4],["Hold",4],["Breathe out",4],["Hold",4],["In…",4],["Hold…",4],["Out…",4],["Nice. Notice your shoulders drop.",4]]],
 ["stretch","Desk stretch","2 min · unstiffen","#e3f2e8","stretch",[["Sit tall. Feet flat on the floor.",6],["Tilt your right ear toward your right shoulder",10],["Now the left side",10],["Roll your shoulders back, slowly, 5 times",12],["Reach both arms up high and stretch",10],["Gently twist to look behind you, right side",10],["Now the left side",10],["Wiggle your fingers and circle your wrists",10],["Done! Stop any move that hurts.",5]]],
 ["squeeze","Squeeze & let go","1 min · melt tension","#ebe7f8","squeeze",[["Make tight fists… hold",5],["Let go. Feel the difference.",6],["Shoulders up to your ears… hold",5],["Drop them. Ahh.",6],["Scrunch your whole face… hold",5],["Relax it all",6],["Press your feet into the floor… hold",5],["Let go. You're softer now.",6]]],
 ["eyes","Eye break 20-20-20","20 sec · rest screen eyes","#fff3c9","eyes",[["Look away from your screen",3],["Find something far away (about 20 feet)",4],["Keep looking at it… softly",13],["Blink slowly a few times",4],["Welcome back 👀",3]]],
 ["ground","5-4-3-2-1","1 min · come back to now","#fdeedd","ground",[["Name 5 things you can SEE",12],["4 things you can FEEL (chair, socks, air…)",12],["3 things you can HEAR",10],["2 things you can SMELL",8],["1 thing you can TASTE",6],["You're here. You're okay.",4]]],
 ["move","Water + wiggle","2 min · reset","#d9f0ee","move",[["Stand up if you can",5],["Go get a glass of water",30],["Take a few sips",10],["Shake out your hands and arms",8],["Walk around the room once",25],["Roll your ankles, one then the other",10],["Okay! Your brain got fresh blood and water.",5]]],
 ["wrap","Bubble wrap","as long as you like · pop pop","#e4f2fb","wrap",null]];
const RIC={breathe:"M3.4 9.4h10.2q3.4-.2 3.4-3.1-.2-2.6-2.7-2.7M3.4 13.4h14.4q3.2.2 3.2 3.1-.2 2.8-2.9 2.9M3.4 17.2h7",
 stretch:"M12 3.2q1.7 0 1.7 1.7T12 6.6t-1.7-1.7T12 3.2zM5.2 4.6l4.4 4.6h4.8l4.4-4.6M12 9.2v5.4M12 14.6l-3 6M12 14.6l3 6",
 squeeze:"M7 11.6V7.4q0-1.4 1.4-1.4t1.4 1.4v3.4M9.8 10.4V6q0-1.4 1.4-1.4T12.6 6v4.2M12.6 10.2V7q0-1.4 1.4-1.4t1.4 1.4v4M15.4 11V9.4q0-1.3 1.3-1.3T18 9.4v4q0 6.4-6 6.6-5.4-.2-6.4-4.8L4.8 13q-.3-1.4 1-1.6 1.1-.1 1.6 1.2",
 eyes:"M2.6 12.2q4.3-7.1 9.5-7t9.4 7q-4.4 6.9-9.5 6.9t-9.4-6.9zM12 9.3q2.9-.1 2.9 2.8t-2.9 2.9-2.8-2.9 2.8-2.8z",
 ground:"M7.4 12.4V5.6q0-1.3 1.2-1.3T9.8 5.6v5.6M9.8 10.8V4.2q0-1.3 1.2-1.3t1.2 1.3v6.6M12.2 10.8V4.8q0-1.3 1.2-1.3t1.2 1.3v6.6M14.6 11.4V7q0-1.3 1.2-1.3T17 7v7q-.3 6.6-6.2 6.8-4.4-.2-6-4.4l-1.4-3.4q-.4-1.2.7-1.6 1-.3 1.6.8l1.7 2.8",
 move:"M7.2 4.2h9.6l-1.4 15.4q-3.4.8-6.8 0zM7.6 8.6q4.4 1.6 8.8 0M10.4 12.4q.9-1.4 1.6 0",
 wrap:"M7 5q2.4.1 2.4 2.4T7 9.8 4.6 7.4 7 5zM17 5q2.4.1 2.4 2.4T17 9.8t-2.4-2.4T17 5zM12 10q2.4.1 2.4 2.4T12 14.8t-2.4-2.4T12 10zM7 15q2.4.1 2.4 2.4T7 19.8t-2.4-2.4T7 15zM17 15q2.4.1 2.4 2.4T17 19.8t-2.4-2.4T17 15z"};
const ric=(k,s=30)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path d="${RIC[k]}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function breathe(){hush();const o=document.createElement("div");o.className="ov relax";screen.appendChild(o);sfx("open");
  const menu=()=>{o.innerHTML=`<button class="back" aria-label="Close">←</button><div class="rhead">${rotty("proud",74)}<div><h3>Need a break?</h3><span class="muted">Pick one. Your feed will wait for you.</span></div></div>
    <div class="rmood"><span>How do you feel?</span>${[["thinking","stressed","box"],["sleepy","tired","move"],["excited","stiff","stretch"],["happy","okay","eyes"]].map(([e,t,k])=>`<button data-mood="${k}">${rotty(e,34)}${t}</button>`).join("")}</div>
    <div class="rgrid">${RELAX.map(([k,n,d,c,ik])=>`<button class="rcard" data-rx="${k}" style="background:${c}">${ric(ik)}<b>${n}</b><small>${d}</small></button>`).join("")}</div>
    <small class="muted" style="max-width:32ch">If you feel really low or unsafe, please talk to someone you trust or your school counselor. 💛</small>`;
    o.querySelector(".back").onclick=()=>{stop();o.remove();sfx("close")};
    o.querySelectorAll("[data-rx]").forEach(b=>b.onclick=()=>run(RELAX.find(r=>r[0]===b.dataset.rx)));
    o.querySelectorAll("[data-mood]").forEach(b=>b.onclick=()=>{const c=o.querySelector(`[data-rx="${b.dataset.mood}"]`);o.querySelectorAll(".rcard").forEach(x=>x.classList.toggle("pick",x===c));c.scrollIntoView({block:"center",behavior:"smooth"});sfx("tap");toast("Try this one 👇")})};
  let T=null;const stop=()=>{clearInterval(T);T=null;hush()};
  const done=()=>{stop();sfx("cheer");o.innerHTML=`<button class="back" aria-label="Back">←</button><div class="bob">${rotty("happy",110)}</div><h3>Nice break 💛</h3><span class="muted">How about one tiny step now?</span><button class="cta" id="tiny" style="max-width:300px">▶ Watch just 1 reel</button><button class="cta alt" id="again" style="max-width:300px">Another break</button><button class="cta alt" id="rest" style="max-width:300px">I'm done for today</button>`;
    o.querySelector(".back").onclick=menu;$("#again").onclick=menu;$("#tiny").onclick=()=>{o.remove();S.built=true;show("feed")};$("#rest").onclick=()=>{o.remove();toast("Good call. Scrolly will be here when you're back 🌙")}};
  function run([k,n,d,c,ik,steps]){stop();if(k==="wrap")return wrap();let s=0,left=steps[0][1],paused=false;const total=steps.reduce((a,x)=>a+x[1],0);let gone=0;
    o.innerHTML=`<button class="back" aria-label="Back">←</button><div class="rbar"><i id="rb"></i></div><div class="rstage ${k}" style="--c:${c}"><div class="rbuddy">${rotty(k==="eyes"?"thinking":k==="squeeze"?"excited":"proud",120)}</div>${k==="box"?'<div class="rbox"><i></i></div>':""}</div>
      <h3 id="rt" aria-live="polite"></h3><div class="rsec" id="rs"></div><div class="row2" style="max-width:300px;width:100%"><button class="cta alt" id="rp">⏸ Pause</button><button class="cta" id="rn">Next →</button></div>`;
    const show1=()=>{$("#rt").textContent=steps[s][0];left=steps[s][1];$("#rs").textContent=left+"s";o.querySelector(".rstage").dataset.step=s%4;if(S.sound&&!S.calm)say(steps[s][0],.9);sfx("tick")};
    const nxt=()=>{s++;if(s>=steps.length)return done();show1()};
    show1();T=setInterval(()=>{if(paused)return;left--;gone++;const b=$("#rb");if(b)b.style.width=Math.min(100,gone/total*100)+"%";const r=$("#rs");if(r)r.textContent=Math.max(0,left)+"s";if(left<=0)nxt()},1000);
    o.querySelector(".back").onclick=()=>{stop();menu()};$("#rn").onclick=()=>{gone+=left;nxt()};$("#rp").onclick=e=>{paused=!paused;e.target.textContent=paused?"▶ Resume":"⏸ Pause";if(paused)hush()}}
  function wrap(){let popped=0;o.innerHTML=`<button class="back" aria-label="Back">←</button><h3>Pop pop pop 🫧</h3><span class="muted" id="wc">Pop them all, or just a few.</span><div class="wrapg">${Array.from({length:30},(_,k)=>`<button class="wb" aria-label="Bubble ${k+1}"></button>`).join("")}</div><button class="cta alt" id="wd" style="max-width:300px">I feel better</button>`;
    o.querySelectorAll(".wb").forEach(b=>b.onclick=()=>{if(b.classList.contains("p"))return;b.classList.add("p");popped++;sfx("pop");$("#wc").textContent=popped+" popped"+(popped===30?" · all of them! 🎉":"");if(popped===30)done()});
    o.querySelector(".back").onclick=menu;$("#wd").onclick=done}
  menu()}

$("#ovBtn").onclick=breathe;$("#breakBtn").onclick=breathe;

/* ---------- 🌍 Around: news, next topics, projects ---------- */
const NEWS=[["An AI model found and patched hundreds of Linux security bugs","OpenAI says an upcoming security model found, checked and patched 948 Linux privilege bugs in one run.","Why it matters: AI can now help find bugs, but people still check the fixes.","OpenAI via AI Weekly · Nov 5, 2026","https://aiweekly.co/ai-news-today/edition/2026-11-05"],
 ["Anthropic pays the AP for real-time election data","Its first licensing deal with a digital news publisher.","Why it matters: where a model's data comes from (and who gets paid) is a big topic in AI.","Adweek via AI Weekly · Nov 5, 2026","https://aiweekly.co/ai-news-today/edition/2026-11-05"],
 ["OpenAI says it will pay full electricity costs at its own data centers","It also says it will stop signing NDAs with public officials.","Why it matters: training and running models uses a lot of energy.","CNBC via AI Weekly · Nov 5, 2026","https://aiweekly.co/ai-news-today/edition/2026-11-05"]];
const NEXT=[["🧮","Logistic regression","Classification's best friend",null],["🌳","Decision trees","Yes/no questions that predict",null],["🫧","k-means clustering","Unsupervised groups",null],["🧠","Neural networks","Layers that learn",3],["📉","Overfitting","Memorizing ≠ learning",2],["📈","Linear regression","The best-fit line",0]];
const PROJ=[["😴","Sleep vs. grades line","Linear regression","Beginner · 1 hr",["Log your sleep hours and quiz scores for 2 weeks","Put them in a spreadsheet (x = sleep, y = score)","Add a trendline (that's linear regression!)","Write 3 sentences: what does the slope mean?"]],
 ["📧","Mini spam detector","Classification","Starter · 2 hrs",["Collect 20 spam-ish and 20 normal messages","Pick features: links, ALL CAPS, the word “free”","Train a simple classifier (Teachable Machine or scikit-learn)","Test it on 10 new messages it hasn't seen"]],
 ["🎧","Cluster your playlist","Unsupervised (k-means)","Starter · 2 hrs",["Export 50 songs with tempo and energy","Plot tempo vs energy","Run k-means with k = 3","Name your clusters (gym? study? sleepy?)"]]];
function renderAround(V){
  V.innerHTML=`<div class="pad around" style="padding-top:102px">
   <div class="ahead">${rotty("excited",64)}<div><h2 style="font-size:26px">Explore ${esc(MINE.title)}</h2><span class="muted" style="font-size:14px">What's new, what's next, and what to build.</span></div></div>
   <button class="card fun" data-xp style="text-align:left;cursor:pointer"><b>🤯 AI fun facts</b><span>5 quick reels: regression, gradient descent, overfitting, neural nets, chatbots</span><span class="chips"><span>▶ Swipe them</span></span></button>
   <div class="lbl">📰 Fresh in AI</div>
   ${NEWS.map(([h,s,w,src,u])=>`<article class="card news"><b>${esc(h)}</b><span style="font-size:14.5px">${esc(s)}</span><span class="why">${esc(w)}</span><a class="srcl" href="${u}" target="_blank" rel="noopener">📎 ${esc(src)}</a></article>`).join("")}
   <small class="muted">Picked for the demo from real headlines. The real app pulls fresh news linked to your notes, with sources.</small>
   <div class="lbl">🧭 Next topics for you</div>
   <div class="nexts">${NEXT.map(([e,t,d,k],j)=>`<button class="tile" data-nx="${j}"><span class="em">${e}</span>${t}<small>${d}</small></button>`).join("")}</div>
   <div class="lbl">🛠 Try a project</div>
   ${PROJ.map(([e,t,topic,lvl],j)=>`<button class="card proj" data-pj="${j}" style="text-align:left;cursor:pointer"><span style="font-size:30px">${e}</span><span><b>${t}</b><br><span class="muted" style="font-size:13.5px">${topic} · ${lvl}</span></span><span class="go">→</span></button>`).join("")}
  </div>`;
  V.querySelector("[data-xp]").onclick=()=>{S.feed="explore";renderFeed();toast("🤯 AI fun facts")};
  V.querySelectorAll("[data-nx]").forEach(b=>b.onclick=()=>{const n=NEXT[+b.dataset.nx];if(n[3]!==null){S.feed="explore";renderFeed();const f=$("#feedV");setTimeout(()=>f.scrollTop=f.clientHeight*(n[3]>2?n[3]+1:n[3]),50);toast(n[1]+" ✨")}else{toast(`Cooking a mini feed on ${n[1]}… (demo)`);beep(700)}});
  V.querySelectorAll("[data-pj]").forEach(b=>b.onclick=()=>{const p=PROJ[+b.dataset.pj];openSheet(`<h4 id="sheetTitle">${p[0]} ${esc(p[1])}</h4><p class="sub">${esc(p[2])} · ${esc(p[3])}</p><ol class="steps2">${p[4].map(x=>`<li>${esc(x)}</li>`).join("")}</ol><button class="cta" style="margin-top:10px" onclick="closeSheet();toast('Saved to your projects 🛠')">Save this project</button>`)})}

/* ---------- 🃏 meme cards ---------- */
const CARDS={mine:[["Overfit Trap","TRAP CARD","sweat","Activate when a friend memorizes the practice test. They must explain the pattern out loud instead."],["Test Set Shield","SPELL CARD","shield","No peeking! While this card is face-up, nobody trains on the test set."],["Label Detective","SPELL CARD","detective","Point at any table and name the label in 3 seconds. Gain +10 brain."]],
 explore:[["Gradient Slide","SPELL CARD","slide","Take one tiny step downhill. Your error drops. Your vibes rise."],["Next Token, Please","TRAP CARD","talk","Activate when someone finishes your sentence. They are now a language model."],["Outlier Alert","TRAP CARD","shock","One weird dot appears. Every best-fit line on the field tilts dramatically."]]};
function cardArt(kind){const m={sweat:"thinking",shield:"proud",detective:"thinking",slide:"excited",talk:"excited",shock:"excited"}[kind]||"happy";
  const extra={sweat:`<text x="60" y="26" font-size="16">💦</text><rect x="4" y="52" width="16" height="20" rx="3" fill="#fff" stroke="#2f2a28" stroke-width="2"/>`,shield:`<path d="M60 40l14 5v10c0 9-7 15-14 17-7-2-14-8-14-17V45z" fill="#b9dcf2" stroke="#2f2a28" stroke-width="2.4"/>`,detective:`<circle cx="66" cy="54" r="9" fill="#fff6" stroke="#2f2a28" stroke-width="2.6"/><path d="M72 61l7 7" stroke="#2f2a28" stroke-width="3" stroke-linecap="round"/>`,slide:`<path d="M2 70q30-30 76-8" fill="none" stroke="#7fb8de" stroke-width="3"/>`,talk:`<text x="56" y="22" font-size="14">💬</text>`,shock:`<text x="58" y="22" font-size="16">❗</text>`}[kind]||"";
  return `<svg viewBox="0 0 80 80" width="120" height="120" aria-hidden="true">${rotty(m,80).replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,"")}${extra}</svg>`}
function memeCard(c,small){const [t,type,art,fx]=c;return `<div class="mcard ${type.startsWith("TRAP")?"trap":"spell"} ${small?"small":""}"><div class="mtitle"><b>${esc(t)}</b><span class="mic">${type.startsWith("TRAP")?"⚡":"✨"}</span></div><div class="mtype">[ ${type} ]</div><div class="mart">${cardArt(art)}</div><div class="mfx">${esc(fx)}</div><div class="mfoot">SCROLLEGE · STUDY CARD</div></div>`}
function pullCard(){sfx("flip");setTimeout(()=>sfx("cheer"),300);const pool=DECK.cards||CARDS[DECK.pack?"explore":"mine"],left=pool.filter(c=>!S.cards.some(x=>x[0]===c[0])),c=(left.length?left:pool)[Math.floor(Math.random()*(left.length||pool.length))];if(!S.cards.some(x=>x[0]===c[0]))S.cards.push(c);saveSettings(S);
  openSheet(`<h4 id="sheetTitle">🃏 You pulled a card!</h4><p class="sub">Collect them all in your binder. Share the funny ones.</p><div class="flipwrap">${memeCard(c)}</div><div class="row2" style="margin-top:12px"><button class="cta alt" onclick="toast('Card saved to your photos (demo)')">💾 Save</button><button class="cta" onclick="toast('Shared to your story! (demo)')">📤 Share</button></div>`);yay()}

/* ---------- 🎬 3D video reels ---------- */
function video3d(r){
  const G=g3shell(r.t);if(!G)return;const {sc,cam,tickers,o}=G;o.classList.add("vid");musicStop();o.querySelector(".g3mu").remove();
  o.querySelector("#g3pad").innerHTML=`<div class="vbar"><i id="vb"></i></div><div class="vcap" id="vcap" aria-live="polite"></div>`;
  const kind=r.v3||"scatter",N=r.cap.length,T=N*(S.calm?5.6:4.2);let el=0,ci=-1;
  const floor=new THREE.Mesh(new THREE.CircleGeometry(14,48),new THREE.MeshStandardMaterial({color:S.night?0x22305a:(S.theme==="sage"?0xe9f3e1:0xeef5fb),roughness:1}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;sc.add(floor);
  const ball=(c,rad=.22)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(rad,20,20),new THREE.MeshStandardMaterial({color:c,roughness:.45}));m.castShadow=true;return m};
  const C=[0x7fb8de,0xf2cf63,0x9fd3b5,0xb7a9e0,0xf0a37a];const objs=[],upd=[];
  if(kind==="scatter"||kind==="overfit"){const pts=[...Array(9)].map((_,k)=>{const x=-3+k*.75,y=.6+(x+3)*.45+(Math.sin(k*2.3)*.45);return new THREE.Vector3(x,y,0)});
    pts.forEach((p,k)=>{const b=ball(C[k%5]);b.position.copy(p);b.scale.setScalar(0);sc.add(b);objs.push(b);upd.push(t=>{b.scale.setScalar(Math.min(1,Math.max(0,(t-k*.25)*3)))})});
    const ax=new THREE.Mesh(new THREE.BoxGeometry(7,.05,.05),new THREE.MeshStandardMaterial({color:0x3d4a5c}));ax.position.set(0,.3,0);sc.add(ax);const ay=new THREE.Mesh(new THREE.BoxGeometry(.05,4.6,.05),ax.material);ay.position.set(-3.4,2.5,0);sc.add(ay);
    if(kind==="overfit"){const tube=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),80,.06,8),new THREE.MeshStandardMaterial({color:0xf0a37a}));sc.add(tube);tube.visible=false;upd.push(t=>{tube.visible=t>N*1.4})}
    const line=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,1,12),new THREE.MeshStandardMaterial({color:0x4fa3d6}));line.castShadow=true;sc.add(line);
    const a=new THREE.Vector3(-3.2,.45,0),b=new THREE.Vector3(3.2,.6+6.2*.45,0),mid=a.clone().add(b).multiplyScalar(.5),len=a.distanceTo(b);line.position.copy(mid);line.lookAt(b);line.rotateX(Math.PI/2);
    upd.push(t=>{const g=Math.min(1,Math.max(0,(t-(kind==="overfit"?N*2.8:N*1.3))/1.5));line.scale.set(1,len*g+.001,1)})}
  if(kind==="hill"){const g=new THREE.PlaneGeometry(8,8,40,40);g.rotateX(-Math.PI/2);const P=g.attributes.position;for(let k=0;k<P.count;k++){const x=P.getX(k),z=P.getZ(k);P.setY(k,(x*x+z*z)*.12)}g.computeVertexNormals();
    const hill=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:S.night?0x3b5a8a:(S.theme==="sage"?0x9fd3a8:0x86bfe3),roughness:.8,flatShading:true}));hill.receiveShadow=true;sc.add(hill);const b=ball(0xf2cf63,.3);sc.add(b);
    let pos=new THREE.Vector2(3.2,2.6);const trail=[];upd.push((t,dt)=>{if(t>1){pos.multiplyScalar(1-dt*(S.calm?.35:.6))}const y=(pos.x*pos.x+pos.y*pos.y)*.12+.3;b.position.set(pos.x,y,pos.y);if(Math.random()<.2&&trail.length<60){const d=ball(0xffffff,.06);d.position.copy(b.position);sc.add(d);trail.push(d)}})}
  if(kind==="net"){const L=[[-2.4,3],[0,4],[2.4,2]],nodes=[];L.forEach(([x,n],li)=>{for(let k=0;k<n;k++){const b=ball(C[li*2%5],.32);b.position.set(x,1+k*1.1+(4-n)*.55,0);sc.add(b);nodes.push({b,li})}});
    const edges=[];nodes.forEach(a=>nodes.forEach(c=>{if(c.li===a.li+1){const d=c.b.position.clone().sub(a.b.position),m=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,d.length(),6),new THREE.MeshStandardMaterial({color:0x9aa8bd}));m.position.copy(a.b.position.clone().add(c.b.position).multiplyScalar(.5));m.lookAt(c.b.position);m.rotateX(Math.PI/2);sc.add(m);edges.push([a.b.position,c.b.position])}}));
    const pulses=[...Array(10)].map(()=>{const p=ball(0xffe27a,.1);sc.add(p);return {p,e:edges[Math.floor(Math.random()*edges.length)],o:Math.random()}});
    upd.push(t=>{pulses.forEach(q=>{const f=((t*.7+q.o)%1);q.p.position.lerpVectors(q.e[0],q.e[1],f);if(f<.02)q.e=edges[Math.floor(Math.random()*edges.length)]});nodes.forEach((n,k)=>n.b.scale.setScalar(1+Math.max(0,Math.sin(t*3-n.li*1.2))*.18))})}
  if(kind==="tokens"){const words=["The","cat","sat","on","the","mat"];words.forEach((w,k)=>{const mats=[...Array(6)].map(()=>new THREE.MeshStandardMaterial({color:C[k%5]}));mats[4]=new THREE.MeshStandardMaterial({map:texT(w,["#b9dcf2","#fbe7a6","#c6e8d4","#d9d2f2","#f7cdb3"][k%5],256,160,64)});
    const b=new THREE.Mesh(new THREE.BoxGeometry(1.1,.7,.5),mats);b.castShadow=true;const bx=-1.25+(k%3)*1.25,by=k<3?2.5:1.3;b.position.set(bx,8,0);sc.add(b);upd.push(t=>{const s=k*(T/7)+.4;const f=Math.min(1,Math.max(0,(t-s)*2));b.position.y=by+(1-f)*6})})}
  if(kind==="split"){for(let k=0;k<20;k++){const b=new THREE.Mesh(new THREE.BoxGeometry(.45,.45,.45),new THREE.MeshStandardMaterial({color:k<16?0x9fd3b5:0xf0a37a,roughness:.5}));b.castShadow=true;const sx=-1.4+(k%5)*.6,sz=-1+Math.floor(k/5)*.6;sc.add(b);
    const tx=k<16?-2.6+(k%4)*.55:2+(k%2)*.55,tz=k<16?-1+Math.floor(k/4)*.55:-.3+Math.floor((k-16)/2)*.55;upd.push(t=>{const f=Math.min(1,Math.max(0,(t-N*1.2-k*.05)/1.2)),e=f*f*(3-2*f);b.position.set(sx+(tx-sx)*e,.25+Math.sin(e*Math.PI)*1.2,sz+(tz-sz)*e)})}
    [["train 80%",-1.8,0x9fd3b5],["test 20%",2.3,0xf0a37a]].forEach(([w,x,c])=>{const pad=new THREE.Mesh(new THREE.BoxGeometry(x<0?2.6:1.5,.06,2.6),new THREE.MeshStandardMaterial({color:c,transparent:true,opacity:.35}));pad.position.set(x,.03,0);sc.add(pad);const lb=new THREE.Mesh(new THREE.PlaneGeometry(1.8,.6),new THREE.MeshBasicMaterial({map:texT(w,"#ffffff",320,110,52),transparent:true}));lb.position.set(x,2.4,-1);sc.add(lb)})}
  if(kind==="sort"||kind==="cluster"){const bins=[[-2,0x7fb8de,"A"],[2,0xf2cf63,"B"]];if(kind==="sort")bins.forEach(([x,c])=>{const bin=new THREE.Mesh(new THREE.CylinderGeometry(1,.8,1,24,1,true),new THREE.MeshStandardMaterial({color:c,side:THREE.DoubleSide,transparent:true,opacity:.75}));bin.position.set(x,.5,0);sc.add(bin)});
    for(let k=0;k<14;k++){const g=k%2,b=ball(bins[g][1],.24);const sx=(Math.random()-.5)*5,sz=(Math.random()-.5)*2;sc.add(b);const tx=bins[g][0]+(Math.random()-.5)*(kind==="sort"?.8:1.4),tz=(Math.random()-.5)*(kind==="sort"?.8:1.4);
      upd.push(t=>{const f=Math.min(1,Math.max(0,(t-1-k*.15)/1.6)),e=f*f*(3-2*f);b.position.set(sx+(tx-sx)*e,(kind==="sort"?1+(1-e)*3.5:.3+(1-e)*2.2)+Math.sin(e*Math.PI)*.8,sz+(tz-sz)*e)})}}
  const HW={tokens:2.6,net:3.3,scatter:3.9,overfit:3.9,split:3.6,sort:3.4,cluster:3.2,hill:4.4}[kind]||3.6,hf=Math.atan(Math.tan(cam.fov*Math.PI/360)*cam.aspect),D=Math.max(8,HW/Math.tan(hf)),OC={split:.4,sort:.8,cluster:.5,tokens:1.9,net:2.6,scatter:2,overfit:2,hill:1}[kind]??1.5,CY=OC-.12*D;
  cam.position.set(0,CY+D*.36,D);cam.lookAt(0,CY,0);
  tickers.push((dt,t)=>{el+=dt;upd.forEach(f=>f(el,dt));const a=S.calm?0:Math.sin(el*.25)*.35;cam.position.set(Math.sin(a)*D,CY+D*.36,Math.cos(a)*D);cam.lookAt(0,CY,0);
    const k=Math.min(N-1,Math.floor(el/(T/N)));if(k!==ci){ci=k;const c=$("#vcap");if(c){c.innerHTML=r.cap[k].split(" ").map((w,j)=>`<span style="animation-delay:${j*.07}s">${esc(w)}</span>`).join(" ")}say(r.cap[k],S.calm?.85:1)}
    const vb=$("#vb");if(vb)vb.style.width=Math.min(100,el/T*100)+"%";if(el>T+1.2&&!o._done){o._done=true;G.msg(`<b style="font-family:var(--head);font-size:22px">That's the idea! 🎬</b><br><button class="cta" style="margin-top:8px;padding:9px" data-replay>↻ Replay</button> <button class="cta alt" style="margin-top:8px;padding:9px" onclick="this.closest('.g3').querySelector('.back').click()">Done</button>`,0);const rp=o.querySelector("[data-replay]");if(rp)rp.onclick=()=>{G.close();video3d(r)}}});
}

/* ---------- me ---------- */
function renderMe(){const lead=S.learn.has("listen")?"🎧 Audio Explorer":S.learn.has("play")?"🎮 Game Brain":S.learn.has("read")?"📖 Page Turner":"👀 Visual Thinker";
  const T=(k,t,d)=>`<div class="tgl"><span>${t}<small>${d}</small></span><button class="sw" role="switch" data-set="${k}" aria-checked="${!!S[k]}" aria-label="${t}"></button></div>`;
  P().innerHTML=`<div style="display:flex;gap:10px;align-items:center">${rotty("proud",70)}<div><h2>My brain</h2><span class="muted">${lead}</span></div></div>
   <div class="stats"><div><b>${S.xp}</b><small>XP</small></div><div><b>${S.streak}</b><small>day streak · breaks are OK</small></div><div><b>${S.got.size}</b><small>reels mastered</small></div></div>
   ${petCard()}
   <details class="more" ${S.cards.length?"open":""}><summary>🃏 My card binder (${S.cards.length}/6)</summary><div class="in">${S.cards.length?`<div class="binder">${S.cards.map(c=>memeCard(c,1)).join("")}</div>`:"<span>Finish a feed to pull your first meme card.</span>"}</div></details>
   <details class="more"><summary>🎯 Focus tools</summary><div class="in"><button class="opt" onclick="S.built=true;show('feed');toast('Just this one. You\'ve got it 💪')">▶ Just 1 reel <small>when starting is hard</small></button><button class="opt" onclick="buddy(10)">👯 Study with Scrolly, 10 min <small>a body double</small></button><button class="opt" onclick="breathe()">😮‍💨 I'm overwhelmed <small>breathe, then one tiny step</small></button><span>${S.test?`🗓 <b>${esc(S.test.n)}</b>: Scrolly spreads your reels out until then.`:"🗓 Add a test date in Make."}</span><span>🔁 ${pileN()} reel${pileN()===1?"":"s"} in your review pile, ${dueN()} due today. Missed reels come back tomorrow, then in 3 days, then a week.</span>
     <div class="tgl" style="border:0"><span>📏 Reels per day<small>Scrolly stops after this many. Brains need breaks.</small></span><div class="chips" style="flex:none">${[3,5].map(n=>`<button data-limit="${n}" aria-pressed="${S.limit===n}" style="${S.limit===n?"background:var(--pink)":""}">${n}</button>`).join("")}</div></div></div></details>
   <details class="more" id="decksFold"><summary>📚 My decks</summary><div class="in" id="deckList"><span class="muted">Loading…</span></div></details>
   <details class="more"><summary>🧠 Brain modes</summary><div class="in">
    <div class="tgl"><span>🎨 Look<small>Sky, Sage or Ink night</small></span><div class="looks">${LOOKS.map(([k,e,n,g])=>`<button data-look="${k}" aria-pressed="${S.theme===k}" style="background:${g}" aria-label="${n} look">${e}</button>`).join("")}</div></div>
    ${T("calm","🍃 Calm mode","No motion or sounds, softer colors, shows what's next")}
    ${T("dys","🔤 Easy-read font","Wider letters and spacing")}
    ${T("bionic","𝗕 Bionic reading","Bold word starts to guide your eyes")}
    ${T("ruler","📏 Line ruler","A highlight band follows your reading")}
    ${T("big","🔍 Big text","Everything a bit larger")}
    ${T("notimer","⏱ No-timer mode","No countdowns anywhere")}
    ${T("voice","🎤 Answer by voice","Say answers instead of tapping or typing")}
    ${T("sound","🔈 Sounds","Soft pops, chimes and swooshes")}
    ${T("music","♫ Game music","A chill lo-fi loop while you play")}
    ${T("haptics","📳 Haptics","Tiny buzz on phones")}
    <div class="tgl"><span>🔊 Volume<small>${Math.round(S.vol*100)}%</small></span><input type="range" min="0" max="1" step=".05" value="${S.vol}" id="volR" aria-label="Volume" style="width:120px;accent-color:var(--pop2)"></div>
    <div class="row2" style="gap:6px;flex-wrap:wrap">${["pop","right","wrong","swish","splash","cheer"].map(k=>`<button class="chipb" data-try-s="${k}">▶ ${k}</button>`).join("")}</div>
    <div class="tgl"><span>🎨 Color tint<small>Some readers find a tint easier</small></span><div class="row2" style="flex:none">${[["none","#fffdf8"],["peach","#f3cfb4"],["blue","#b9d8ea"],["lilac","#d9c6e6"],["mint","#bfe0cf"]].map(([k,c])=>`<button class="swatch" data-tint="${k}" aria-pressed="${S.tint===k}" style="background:${c}" aria-label="${k} tint"></button>`).join("")}</div></div>
   </div></details>
   <details class="more"><summary>🧸 Scrollege Jr</summary><div class="in"><span>Bigger buttons, simpler words and no social features. For younger kids, with a grown-up.</span>${T("jr","Scrollege Jr","Kid mode")}</div></details>
   <details class="more"><summary>👩‍🏫 Teacher and parent page</summary><div class="in"><span>Share a deck with a class and see progress. Built with Lovable. Students' brain settings stay private.</span><button class="cta alt" onclick="toast('Teacher page link copied (demo)')">Copy class link</button></div></details>
   <details class="more" id="qrFold"><summary>📱 Open on your phone</summary><div class="in"><span>Scan to open Scrollege on your phone, then "Add to Home Screen" to install it.</span><div id="qrBox" style="display:grid;place-items:center;padding:6px"></div><small class="muted" id="qrUrl"></small></div></details>
   <details class="more"><summary>🔒 Privacy</summary><div class="in"><span>Your notes and brain settings stay yours. No ads. Kids' mode has no accounts or chat.</span></div></details>
   <details class="more"><summary>🐣 Change study buddy</summary><div class="in"><div class="tiles t3">${PETS.map(([k,n])=>`<button class="tile" data-pet2="${k}" aria-pressed="${S.pet===k}">${sq(k,40)}${n}</button>`).join("")}</div></div></details>
   <button class="cta alt" id="redo">🔄 Retake the brain quiz</button>`;
  P().querySelectorAll("[data-pet2]").forEach(b=>b.onclick=()=>{S.pet=b.dataset.pet2;S.petName=PETS.find(x=>x[0]===S.pet)[1];renderMe();toast("Say hi to "+S.petName+"!")});
  P().querySelectorAll("[data-set]").forEach(b=>b.onclick=()=>{const k=b.dataset.set;S[k]=!S[k];b.setAttribute("aria-checked",S[k]);if(k==="jr"){S.big=S.jr}apply();toast(b.getAttribute("aria-label")+(S[k]?" on":" off"))});
  const vr=$("#volR");if(vr)vr.oninput=e=>{S.vol=+e.target.value;if(MST)MST.gain.value=S.vol;e.target.previousElementSibling.querySelector("small").textContent=Math.round(S.vol*100)+"%"};vr&&(vr.onchange=()=>sfx("pop"));
  P().querySelectorAll("[data-try-s]").forEach(b=>b.onclick=()=>sfx(b.dataset.tryS));
  P().querySelectorAll("[data-look]").forEach(b=>b.onclick=()=>{S.theme=b.dataset.look;apply();const open=[...P().querySelectorAll("details")].map(d=>d.open);renderMe();P().querySelectorAll("details").forEach((d,k)=>{if(open[k])d.open=true});P().querySelector(`[data-look="${S.theme}"]`)?.focus()});
  P().querySelectorAll("[data-tint]").forEach(b=>b.onclick=()=>{S.tint=b.dataset.tint;P().querySelectorAll("[data-tint]").forEach(x=>x.setAttribute("aria-pressed",x===b));apply()});
  $("#redo").onclick=()=>{S.xp=0;onboard()};
  P().querySelectorAll("[data-limit]").forEach(b=>b.onclick=()=>{S.limit=+b.dataset.limit;saveSettings(S);P().querySelectorAll("[data-limit]").forEach(x=>{x.setAttribute("aria-pressed",x===b);x.style.background=x===b?"var(--pink)":""});toast(`${S.limit} reels a day`)});
  const qf=$("#qrFold");if(qf)qf.addEventListener("toggle",()=>{if(qf.open&&!$("#qrBox").firstChild)drawQR()});
  drawDecks()}
/* QR for whatever address the app is open on (on localhost, scan won't work from a phone: use the Network address Vite prints) */
async function drawQR(){const url=location.origin+"/",box=$("#qrBox");try{const {default:QR}=await import("qrcode");box.innerHTML=`<img alt="QR code for ${esc(url)}" width="200" height="200" style="border-radius:18px;background:#fff;padding:8px" src="${await QR.toDataURL(url,{width:400,margin:1,color:{dark:"#3b4252",light:"#ffffff"}})}">`;$("#qrUrl").textContent=url+(/localhost|127\.0\.0\.1/.test(url)?" (this only opens on this computer)":"")}catch(e){box.textContent="Couldn't make the QR code."}}
async function drawDecks(){const el=$("#deckList");if(!el)return;const ds=await listDecks();if(!$("#deckList"))return;
  if(!ds.length){el.innerHTML=`<span class="muted">No saved decks yet. Make one and it stays on this device.</span>`;return}
  el.innerHTML=ds.map(d=>`<div class="opt" style="cursor:default"><span>${d.id===(MINE.id||"demo")&&S.built?"▶ ":""}${esc(d.title)}<small>${esc(d.sourceLabel||(d.demo?"sample deck":""))} · ${d.n} reels${d.savedAt?" · "+new Date(d.savedAt).toLocaleDateString():""}</small></span>
    <span class="chips" style="flex:none"><button data-open="${esc(d.id)}" aria-label="Open ${esc(d.title)}">Open</button><button data-del="${esc(d.id)}" aria-label="Delete ${esc(d.title)}">🗑</button></span></div>`).join("");
  el.querySelectorAll("[data-open]").forEach(b=>b.onclick=async()=>{const d=await loadDeck(b.dataset.open);if(!d)return toast("Couldn't open that deck");S.feed="mine";useDeck(d);S.deckId=d.id;S.src=d.sourceLabel||(d.demo?"your notes":S.src);S.built=true;S.got=new Set();S.later=new Set();S.wrong=[];S.simple=new Set();saveSettings(S);show("feed");toast("📚 "+d.title)});
  el.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{const d=ds.find(x=>x.id===b.dataset.del);if(!confirm(`Delete "${d.title}" from this device? This can't be undone.`))return;
    await deleteDeck(d.id);dropDeckReviews(S,d.id);if(d.id===(MINE.id||"demo")){useDeck(DEMO_DECK);S.deckId="demo";S.built=false}saveSettings(S);toast("Deleted");drawDecks()})}

/* ---------- help explainers ---------- */
$("#helpBtn").onclick=()=>{const H={feed:["👀 Watch, 🎧 Listen, 📖 Read or 🎮 Play: tap at the top to switch.","🎮 3D quiz turns any reel into a runner game.","💬 Ask only uses your notes. ⋯ More has jingles, story mode and Teach Scrolly."],make:["Upload a PDF, paste notes, or snap a photo.","Scrolly makes 5 reels and 3D games, each linked to its page.","Add a test date and Scrolly spreads it out."],me:["Turn on any brain mode, anytime.","Calm mode, easy-read, bionic, ruler, tints, no-timer.","Collect critter stickers as you learn."]}[S.tab]||[];
  openSheet(`<h4 id="sheetTitle">▶ How this works</h4><div style="display:grid;gap:8px">${H.map((h,k)=>`<div class="card" style="box-shadow:none">${["1️⃣","2️⃣","3️⃣"][k]} ${h}</div>`).join("")}</div><button class="cta" style="margin-top:10px" onclick="say(${JSON.stringify(H.join(' ')).replace(/"/g,'&quot;')})">🔊 Read it to me</button>`)};


/* ---------- more games ---------- */
const GAMES=[["run","Quiz Run","Run through the right answer","#fff3c9"],["tower","Step Tower","Stack the steps in order","#e3f2e8"],["bubble","Bubble Pop","Pop the word that matches","#dbeefa"],["memory","Memory Match","Flip cards, find the pairs","#ebe7f8"],["sort","Catch & Sort","Send each one to the right bin","#fdeedd"],["fish","Gone Fishing","Calm: catch the right fish","#d9f0ee"],["whack","Whack-a-Word","Bonk the right critter","#e3f2e8"],["hoop","Hoop Shot","Swipe up, score the answer","#fff3c9"]];
const FEAT=["run","bubble","whack","hoop","fish"];
function playGame(k,i=0){sfx("tap");({run:()=>quizRun(i),tower:stepTower,bubble:bubblePop,memory:memoryMatch,sort:catchSort,fish:goFish,whack:whackWord,hoop:hoopShot})[k]()}
function gameList(){return GAMES.filter(([k])=>!(k==="sort"&&!DECK.sortG)&&!(k==="tower"&&!hasSteps()))}
function gameGrid(){return `<div class="ggrid">${gameList().map(([k,n,d,c])=>`<button class="gtile" data-g="${k}" style="background:${c}">${ic(k,30)}<b>${n}</b><small>${d}</small></button>`).join("")}</div>`}
function gamePicker(i){openSheet(`<h4 id="sheetTitle">Pick a game</h4><p class="sub">All 3D, all made from ${DECK.pack?"these AI facts":"your notes"}.</p>${gameGrid()}`);$("#sheet").querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>{closeSheet();playGame(b.dataset.g,i)})}
function gameEnd(G,pts,line){musicStop();sfx("cheer");G.msg(`<b style="font-family:var(--head);font-size:24px">Nice one! 🏆</b><br>⭐ ${pts}${line?" · "+line:""}<br><button class="cta alt" style="margin-top:10px;padding:9px" data-again>↻ Again</button> <button class="cta" style="margin-top:10px;padding:9px" onclick="this.closest('.g3').querySelector('.back').click()">Done</button>`,0);yay();G.o.querySelector("#g3pad").innerHTML="";return G.o.querySelector("[data-again]")}
function floor3(sc,col){const f=new THREE.Mesh(new THREE.CylinderGeometry(7,7,.4,48),new THREE.MeshStandardMaterial({color:S.night?0x2a3460:(col||0xcfe6c4),roughness:1}));f.position.y=-.2;f.receiveShadow=true;sc.add(f);return f}
function fitCam(cam,hw,cy){const hf=Math.atan(Math.tan(cam.fov*Math.PI/360)*cam.aspect),D=Math.max(7,hw/Math.tan(hf)),ly=cy-.1*D;cam.position.set(0,ly+D*.3,D);cam.lookAt(0,ly,0);return D}
const shuf=a=>[...a].sort(()=>Math.random()-.5);

/* Bubble Pop: a meaning shows at the top; pop the bubble with the matching word */
function bubblePop(){const G=g3shell("Bubble Pop");if(!G)return;const {sc,cam,tickers,msg}=G;floor3(sc);fitCam(cam,3,2.6);
  const R=DECK.reels,order=shuf(R.map((_,k)=>k));let n=0,pts=0,bubs=[],parts=[];const pad=G.o.querySelector("#g3pad");
  function round(){bubs.forEach(b=>sc.remove(b));bubs=[];if(n>=order.length){const a=gameEnd(G,pts,`${order.length} words popped`);a.onclick=()=>{G.close();bubblePop()};return}
    const k=order[n],opts=shuf([k,...shuf(R.map((_,j)=>j).filter(j=>j!==k)).slice(0,2)]);$("#g3q").textContent="Pop: “"+R[k].mm[1]+"”";
    opts.forEach((j,p)=>{const g=new THREE.Group(),s=new THREE.Mesh(new THREE.SphereGeometry(.85,32,32),new THREE.MeshStandardMaterial({color:[0xbfe3f7,0xd6f0dc,0xfbe9b0][p],transparent:true,opacity:.55,roughness:.1,metalness:.1}));g.add(s);
      const hl=new THREE.Mesh(new THREE.SphereGeometry(.18,12,12),new THREE.MeshBasicMaterial({color:0xffffff}));hl.position.set(-.45,.5,.7);g.add(hl);
      const lb=new THREE.Sprite(new THREE.SpriteMaterial({map:texT(R[j].mm[0],"#ffffff",512,220,54),transparent:true,depthTest:false}));lb.renderOrder=5;lb.scale.set(1.8,.78,1);lb.position.z=.9;g.add(lb);
      g.position.set((p-1)*1.95,S.notimer?2.6:1-p*.9,0);g.userData={j,ok:j===k,ph:p*2,v:.55+p*.08};sc.add(g);bubs.push(g)});
    pad.innerHTML=opts.map(j=>`<button data-j="${j}">${esc(R[j].mm[0])}</button>`).join("");pad.querySelectorAll("button").forEach(b=>b.onclick=()=>hit(bubs.find(x=>x.userData.j===+b.dataset.j)))}
  function hit(b){if(!b)return;if(b.userData.ok){pts+=10;S.xp+=5;G.score(pts);sfx("pop");setTimeout(()=>sfx("right"),80);
      for(let q=0;q<14;q++){const d=new THREE.Mesh(new THREE.SphereGeometry(.08,8,8),new THREE.MeshBasicMaterial({color:0xffffff}));d.position.copy(b.position);d.userData.v=new THREE.Vector3(Math.random()-.5,Math.random()-.2,Math.random()-.5).multiplyScalar(5);d.userData.life=.7;sc.add(d);parts.push(d)}
      sc.remove(b);bubs=bubs.filter(x=>x!==b);n++;setTimeout(round,600)}
    else{b.userData.wob=.6;msg("Close! Read the meaning again 🙂",1300);sfx("boing")}}
  const ray=new THREE.Raycaster(),v=new THREE.Vector2();G.o.querySelector("canvas").addEventListener("pointerdown",e=>{const r=e.target.getBoundingClientRect();v.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(v,cam);const h=ray.intersectObjects(bubs,true)[0];if(h){let o=h.object;while(o.parent&&!bubs.includes(o))o=o.parent;hit(o)}});
  G.setKey(e=>{const b=[...pad.querySelectorAll("button")];if(["1","2","3"].includes(e.key)&&b[+e.key-1])b[+e.key-1].click()});
  tickers.push((dt,t)=>{bubs.forEach(b=>{const u=b.userData;if(!S.notimer&&!S.calm){b.position.y+=dt*u.v*.7;if(b.position.y>5.4)b.position.y=.9}else if(S.notimer)b.position.y=2.6+Math.sin(t+u.ph)*.15;b.position.x=(bubs.indexOf(b)-1)*1.95+Math.sin(t*1.3+u.ph)*.12;
      const w=u.wob>0?(u.wob-=dt,1+Math.sin(t*40)*.06):1+Math.sin(t*2+u.ph)*.03;b.scale.set(w,2-w,w)});
    parts.forEach(d=>{d.userData.life-=dt;d.position.addScaledVector(d.userData.v,dt);d.scale.setScalar(Math.max(.01,d.userData.life));if(d.userData.life<=0)sc.remove(d)});parts=parts.filter(d=>d.userData.life>0)});
  round();msg("Pop the bubble that matches 🫧",1500)}

/* Memory Match: 3 pairs of word ↔ meaning cards */
function memoryMatch(){const G=g3shell("Memory Match");if(!G)return;const {sc,cam,tickers,msg}=G;floor3(sc,0xdbe8f3);fitCam(cam,2.8,1.85);
  const R=shuf(DECK.reels).slice(0,3),cards=[];let open=[],found=0,pts=0,tries=0,lock=false;const pad=G.o.querySelector("#g3pad");
  const items=shuf(R.flatMap((r,p)=>[[r.mm[0],p,"#dbeefa"],[r.mm[1],p,"#fff3c9"]]));
  const backTex=(()=>{const c=document.createElement("canvas");c.width=256;c.height=340;const x=c.getContext("2d");x.fillStyle="#5aa9d6";x.fillRect(0,0,256,340);x.strokeStyle="#7fbde2";x.lineWidth=14;for(let k=-340;k<256;k+=34){x.beginPath();x.moveTo(k,0);x.lineTo(k+340,340);x.stroke()}x.fillStyle="#fff";x.font="700 120px Fredoka, sans-serif";x.textAlign="center";x.textBaseline="middle";x.fillText("?",128,175);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t})();
  items.forEach(([txt,p,bg],k)=>{const side=new THREE.MeshStandardMaterial({color:0xffffff}),mats=[side,side,side,side,new THREE.MeshStandardMaterial({map:texT(txt,bg,300,400,40)}),new THREE.MeshStandardMaterial({map:backTex})];
    const c=new THREE.Mesh(new THREE.BoxGeometry(1.45,1.85,.12),mats);c.castShadow=true;c.position.set((k%3-1)*1.7,k<3?3:.9,0);c.rotation.y=Math.PI;c.userData={p,k,want:Math.PI,done:false,txt};sc.add(c);cards.push(c)});
  const sync=()=>{pad.innerHTML=cards.map((c,k)=>`<button data-k="${k}" ${c.userData.done?"disabled":""} style="${c.userData.done?"opacity:.45":""}">${c.userData.want===0?esc(c.userData.txt):"Card "+(k+1)}</button>`).join("");pad.querySelectorAll("button").forEach(b=>b.onclick=()=>flip(cards[+b.dataset.k]))};
  function flip(c){if(lock||c.userData.done||open.includes(c))return;c.userData.want=0;open.push(c);sfx("flip");sync();
    if(open.length===2){lock=true;tries++;const [a,b]=open;if(a.userData.p===b.userData.p){setTimeout(()=>{a.userData.done=b.userData.done=true;a.userData.hop=b.userData.hop=.6;pts+=10;S.xp+=5;found++;G.score(pts);sfx("right");open=[];lock=false;sync();
        if(found===3){const btn=gameEnd(G,pts,`${tries} tries`);btn.onclick=()=>{G.close();memoryMatch()}}},450)}
      else setTimeout(()=>{a.userData.want=b.userData.want=Math.PI;sfx("flip");open=[];lock=false;sync();msg("Not a pair. Remember where they are 🧠",1100)},1000)}}
  const ray=new THREE.Raycaster(),v=new THREE.Vector2();G.o.querySelector("canvas").addEventListener("pointerdown",e=>{const r=e.target.getBoundingClientRect();v.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(v,cam);const h=ray.intersectObjects(cards)[0];if(h)flip(h.object)});
  tickers.push((dt,t)=>cards.forEach(c=>{const u=c.userData;c.rotation.y+=(u.want-c.rotation.y)*Math.min(1,dt*9);const by=u.k<3?3:.9;if(u.hop>0){u.hop-=dt;c.position.y=by+Math.sin((.6-u.hop)/.6*Math.PI)*.5}else c.position.y=by+(S.calm?0:Math.sin(t*1.5+u.k)*.04)}));
  sync();$("#g3q").textContent="Match each word with its meaning";msg("Flip two cards 🃏",1400)}

/* Catch & Sort: each item floats down; send it to the right bin */
function catchSort(){const G=g3shell("Catch & Sort");if(!G)return;const {sc,cam,tickers,msg}=G;floor3(sc,0xe8f0d8);fitCam(cam,3.3,2.4);
  const D=DECK.sortG,items=shuf(D.items);let n=0,pts=0,cur=null,fly=null;const pad=G.o.querySelector("#g3pad");
  [[-1.9,0x7fb8de,D.a],[1.9,0xf2cf63,D.b]].forEach(([x,c,w])=>{const bin=new THREE.Mesh(new THREE.CylinderGeometry(1.15,.9,1.3,28,1,true),new THREE.MeshStandardMaterial({color:c,side:THREE.DoubleSide,roughness:.5}));bin.position.set(x,.65,0);bin.castShadow=true;sc.add(bin);
    const bot=new THREE.Mesh(new THREE.CircleGeometry(.9,28),new THREE.MeshStandardMaterial({color:c}));bot.rotation.x=-Math.PI/2;bot.position.set(x,.02,0);sc.add(bot);
    const lb=new THREE.Sprite(new THREE.SpriteMaterial({map:texT(w,"#ffffff",512,200,44),transparent:true}));lb.scale.set(2.3,.9,1);lb.position.set(x,1.9,.6);sc.add(lb)});
  function next(){if(n>=items.length){const b=gameEnd(G,pts,"all sorted!");b.onclick=()=>{G.close();catchSort()};return}
    const [txt]=items[n];cur=new THREE.Sprite(new THREE.SpriteMaterial({map:texT(txt,"#ffffff",512,200,46),transparent:true}));cur.scale.set(2.6,1,1);cur.position.set(0,6.4,0);sc.add(cur);
    $("#g3q").textContent=`${n+1} of ${items.length}: which bin?`;pad.innerHTML=`<button data-s="0" style="background:#d7ecfa">← ${esc(D.a)}</button><button disabled style="opacity:.0"></button><button data-s="1" style="background:#fff1c2">${esc(D.b)} →</button>`;pad.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>pick(+b.dataset.s))}
  function pick(s){if(!cur||fly)return;const [txt,ans,why]=items[n],ok=s===ans;fly={o:cur,from:cur.position.clone(),to:new THREE.Vector3(s?1.9:-1.9,.9,0),t:0,ok};cur=null;sfx("whoosh");
    if(ok){pts+=10;S.xp+=5;G.score(pts);setTimeout(()=>sfx("right"),350)}else{msg(`Hmm, that one's ${ans?D.b:D.a}. ${esc(why)}`,2200);setTimeout(()=>sfx("wrong"),350);items.push(items[n])}n++}
  G.setKey(e=>{if(e.key==="ArrowLeft")pick(0);if(e.key==="ArrowRight")pick(1)});
  let sx=null;G.o.querySelector("canvas").addEventListener("pointerdown",e=>sx=e.clientX);G.o.querySelector("canvas").addEventListener("pointerup",e=>{if(sx!==null&&Math.abs(e.clientX-sx)>30)pick(e.clientX>sx?1:0);sx=null});
  tickers.push((dt,t)=>{if(cur){const floorY=S.notimer?3.2:2.3;cur.position.y=Math.max(floorY,cur.position.y-dt*(S.calm?.6:1));cur.position.x=S.calm?0:Math.sin(t*1.6)*.25}
    if(fly){fly.t=Math.min(1,fly.t+dt*2.2);const e=fly.t;fly.o.position.lerpVectors(fly.from,fly.to,e);fly.o.position.y+=Math.sin(e*Math.PI)*1.2;fly.o.scale.set(2.6*(1-e*.7),1-e*.7,1);if(fly.t>=1){sc.remove(fly.o);fly=null;setTimeout(next,250)}}});
  next();msg("Swipe or tap: left bin or right bin? 🗑",1600)}
/* Gone Fishing (calm): fish carry answers; catch the right one */
function goFish(){const G=g3shell("Gone Fishing");if(!G)return;const {sc,cam,tickers,msg}=G;const pad=G.o.querySelector("#g3pad");
  const hf=Math.atan(Math.tan(cam.fov*Math.PI/360)*cam.aspect),D=Math.max(7,3.4/Math.tan(hf));cam.position.set(0,D*.78,D*.7);cam.lookAt(0,-.4,0);
  const shore=new THREE.Mesh(new THREE.CylinderGeometry(7,7,.3,48),new THREE.MeshStandardMaterial({color:S.night?0x2a3460:0xd9edc8,roughness:1}));shore.position.y=-.25;shore.receiveShadow=true;sc.add(shore);
  const water=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.4,.12,64),new THREE.MeshStandardMaterial({color:S.night?0x2b5a9e:0x8cc8ec,roughness:.15,metalness:.1,transparent:true,opacity:.92}));water.position.y=-.02;sc.add(water);
  for(let k=0;k<5;k++){const lily=new THREE.Mesh(new THREE.CircleGeometry(.32,20,0,Math.PI*1.75),new THREE.MeshStandardMaterial({color:0x8fcf8c,side:THREE.DoubleSide}));lily.rotation.x=-Math.PI/2;const a=k*1.3;lily.position.set(Math.cos(a)*2.9,.06,Math.sin(a)*2.9);sc.add(lily)}
  const rings=[];const R=DECK.reels,order=shuf(R.map((_,k)=>k));let n=0,pts=0,fish=[],busy=false,jumps=[];
  function mkFish(c){const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:c,roughness:.5});const b=new THREE.Mesh(new THREE.SphereGeometry(.42,20,16),m);b.scale.set(1.35,.8,.7);b.castShadow=true;g.add(b);
    const tail=new THREE.Mesh(new THREE.ConeGeometry(.28,.45,12),m);tail.rotation.z=Math.PI/2;tail.position.x=-.68;g.add(tail);g.userData.tail=tail;
    const e=new THREE.Mesh(new THREE.SphereGeometry(.06,10,10),new THREE.MeshStandardMaterial({color:0x2f3646}));e.position.set(.35,.1,.22);g.add(e);const e2=e.clone();e2.position.z=-.22;g.add(e2);return g}
  function round(){fish.forEach(f=>{sc.remove(f);sc.remove(f.userData.lb)});fish=[];if(n>=order.length){const b=gameEnd(G,pts,"what a catch! 🎣");b.onclick=()=>{G.close();goFish()};return}
    const r=R[order[n]];$("#g3q").textContent=r.q[0];
    r.q[1].forEach((o,j)=>{const f=mkFish([0xf2b880,0xf6dc7c,0xb7a9e0][j]);const lb=new THREE.Sprite(new THREE.SpriteMaterial({map:texT(o,"#ffffff",512,190,42),transparent:true,depthTest:false}));lb.renderOrder=5;lb.scale.set(2.3,.85,1);sc.add(lb);
      Object.assign(f.userData,{j,ok:j===r.q[2],a:j*2.1,rad:1.1+j*.75,sp:(S.calm?.18:.32)*(j%2?-1:1),lb});f.userData.why=r.q[3];sc.add(f);fish.push(f)});
    pad.innerHTML=r.q[1].map((o,j)=>`<button data-j="${j}">${esc(o)}</button>`).join("");pad.querySelectorAll("button").forEach(b=>b.onclick=()=>catchF(fish.find(f=>f.userData.j===+b.dataset.j)));busy=false}
  function catchF(f){if(!f||busy)return;sfx("cast");if(f.userData.ok){busy=true;pts+=10;S.xp+=5;G.score(pts);jumps.push({f,t:0,y0:f.position.y});setTimeout(()=>{sfx("splash");sfx("right")},350);n++;setTimeout(round,1500)}
    else{f.userData.sp*=2.6;f.userData.flee=1;setTimeout(()=>sfx("wrong"),250);msg("Not this fish 🐟 "+esc(f.userData.why),2000)}}
  const ray=new THREE.Raycaster(),v=new THREE.Vector2();G.o.querySelector("canvas").addEventListener("pointerdown",e=>{const r=e.target.getBoundingClientRect();v.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(v,cam);const h=ray.intersectObjects(fish,true)[0];if(h){let o=h.object;while(o.parent&&!fish.includes(o))o=o.parent;catchF(o)}});
  G.setKey(e=>{const b=[...pad.querySelectorAll("button")];if(["1","2","3"].includes(e.key)&&b[+e.key-1])b[+e.key-1].click()});
  tickers.push((dt,t)=>{fish.forEach(f=>{const u=f.userData;if(jumps.some(j=>j.f===f))return;if(u.flee>0){u.flee-=dt;if(u.flee<=0)u.sp/=2.6}u.a+=u.sp*dt*(S.notimer?.6:1);f.position.set(Math.cos(u.a)*u.rad,.12+Math.sin(t*2+u.j)*.04,Math.sin(u.a)*u.rad);f.rotation.y=-u.a+(u.sp>0?-Math.PI/2:Math.PI/2);u.tail.rotation.y=Math.sin(t*10)*.4;u.lb.position.set(f.position.x,f.position.y+.95,f.position.z)});
    jumps.forEach(j=>{j.t+=dt*1.1;const e=Math.min(1,j.t);j.f.position.y=j.y0+Math.sin(e*Math.PI)*2.4;j.f.rotation.z=e*Math.PI*2;j.f.userData.lb.position.set(j.f.position.x,j.f.position.y+.95,j.f.position.z);
      if(j.t>.5&&!j.r){j.r=1;const ring=new THREE.Mesh(new THREE.TorusGeometry(.3,.03,8,32),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true}));ring.rotation.x=Math.PI/2;ring.position.set(j.f.position.x,.08,j.f.position.z);sc.add(ring);rings.push({ring,t:0})}});jumps=jumps.filter(j=>j.t<1.3);
    rings.forEach(r=>{r.t+=dt;r.ring.scale.setScalar(1+r.t*4);r.ring.material.opacity=Math.max(0,1-r.t*1.5)});water.position.y=-.02+Math.sin(t*1.5)*.01});
  round();msg("Catch the fish with the right answer 🎣",1600)}

/* Whack-a-Word: critters pop up holding answers; bonk the right one */
function whackWord(){const G=g3shell("Whack-a-Word");if(!G)return;const {sc,cam,tickers,msg}=G;floor3(sc,0xcfe6c4);fitCam(cam,3,1.1);const pad=G.o.querySelector("#g3pad");
  const R=DECK.reels,order=shuf(R.map((_,k)=>k));let n=0,pts=0,streak=0,ms=[],stars=[];const HX=[-1.9,0,1.9];
  HX.forEach(x=>{const h=new THREE.Mesh(new THREE.CylinderGeometry(.75,.75,.06,32),new THREE.MeshStandardMaterial({color:0x3b4252}));h.position.set(x,.03,0);sc.add(h);const rim=new THREE.Mesh(new THREE.TorusGeometry(.78,.12,10,32),new THREE.MeshStandardMaterial({color:0xc8b08f,roughness:.9}));rim.rotation.x=Math.PI/2;rim.position.set(x,.06,0);sc.add(rim)});
  const mallet=new THREE.Group();const hd=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.8,20),new THREE.MeshStandardMaterial({color:0xf2cf63}));hd.rotation.z=Math.PI/2;mallet.add(hd);const hn=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,1.6,10),new THREE.MeshStandardMaterial({color:0xc8a27a}));hn.position.y=.8;mallet.add(hn);mallet.visible=false;sc.add(mallet);let mt=0,mx=0;
  function round(){ms.forEach(m=>{sc.remove(m)});ms=[];if(n>=order.length){const b=gameEnd(G,pts,streak>2?"🔥 streak "+streak:"");b.onclick=()=>{G.close();whackWord()};return}
    const r=R[order[n]];$("#g3q").textContent=r.q[0];
    r.q[1].forEach((o,j)=>{const c=critter3D([0xbfe0cf,0xf6e3a6,0xc9cdf0][j]);c.scale.setScalar(.95);const lb=new THREE.Sprite(new THREE.SpriteMaterial({map:texT(o,"#fffdf6",512,200,44),transparent:true,depthTest:false}));lb.renderOrder=5;lb.scale.set(1.75,.68,1);lb.position.set(0,1.25,.3);c.add(lb);
      c.position.set(HX[j],-.8,0);c.rotation.y=Math.PI;c.userData={j,ok:j===r.q[2],ph:j*1.7,h:0,bonk:0,why:r.q[3]};sc.add(c);ms.push(c)});
    pad.innerHTML=r.q[1].map((o,j)=>`<button data-j="${j}">${esc(o)}</button>`).join("");pad.querySelectorAll("button").forEach(b=>b.onclick=()=>bonk(ms.find(m=>m.userData.j===+b.dataset.j)))}
  function bonk(m){if(!m||m.userData.bonk)return;mallet.visible=true;mt=.35;mx=m.position.x;sfx("bonk");
    if(m.userData.ok){m.userData.bonk=1;streak++;pts+=10+(streak>2?5:0);S.xp+=5;G.score(pts);setTimeout(()=>sfx(streak>2?"combo":"right"),90);if(streak===3)msg("🔥 3 in a row! +5 bonus each",1200);
      for(let q=0;q<8;q++){const s=new THREE.Mesh(new THREE.OctahedronGeometry(.1),new THREE.MeshBasicMaterial({color:0xffe27a}));s.position.set(m.position.x,1.2,.2);s.userData={v:new THREE.Vector3(Math.cos(q)*2.5,2+Math.random()*2,Math.sin(q)*1.5),l:.8};sc.add(s);stars.push(s)}
      n++;setTimeout(round,1100)}
    else{streak=0;m.userData.wob=.7;setTimeout(()=>sfx("boing"),80);msg("Hehe, not me! "+esc(m.userData.why),1900)}}
  const ray=new THREE.Raycaster(),v=new THREE.Vector2();G.o.querySelector("canvas").addEventListener("pointerdown",e=>{const r=e.target.getBoundingClientRect();v.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(v,cam);const h=ray.intersectObjects(ms,true)[0];if(h){let o=h.object;while(o.parent&&!ms.includes(o))o=o.parent;bonk(o)}});
  G.setKey(e=>{const b=[...pad.querySelectorAll("button")];if(["1","2","3"].includes(e.key)&&b[+e.key-1])b[+e.key-1].click()});
  tickers.push((dt,t)=>{ms.forEach(m=>{const u=m.userData;const up=S.notimer||S.calm?1:Math.max(0,Math.min(1,Math.sin(t*1.4+u.ph)*1.6+.9));const tgt=u.bonk?-1.2:-.75+up*1.25;m.position.y+=(tgt-m.position.y)*Math.min(1,dt*(u.bonk?6:9));
      if(u.wob>0){u.wob-=dt;m.rotation.z=Math.sin(t*30)*.2}else m.rotation.z=0;if(u.bonk)m.scale.y=Math.max(.4,m.scale.y-dt*3)});
    if(mt>0){mt-=dt;const e=1-mt/.35;mallet.position.set(mx+.6,1.9-Math.sin(e*Math.PI)*.8,.6);mallet.rotation.z=.9-Math.sin(e*Math.PI)*1.1}else mallet.visible=false;
    stars.forEach(s=>{s.userData.l-=dt;s.userData.v.y-=dt*7;s.position.addScaledVector(s.userData.v,dt);s.rotation.y+=dt*8;if(s.userData.l<=0)sc.remove(s)});stars=stars.filter(s=>s.userData.l>0)});
  round();msg("Bonk the critter with the right answer 🔨",1600)}

/* Hoop Shot: shoot into the hoop with the right answer; 3 in a row = on fire */
function hoopShot(){const G=g3shell("Hoop Shot");if(!G)return;const {sc,cam,tickers,msg}=G;floor3(sc,0xf3e2c7);fitCam(cam,3.1,1.9);const pad=G.o.querySelector("#g3pad");
  const R=DECK.reels,order=shuf(R.map((_,k)=>k));let n=0,pts=0,streak=0,shot=null,hoops=[];const HX=[-2,0,2];
  const ball=new THREE.Mesh(new THREE.SphereGeometry(.3,24,24),new THREE.MeshStandardMaterial({color:0xf0a35e,roughness:.6,emissive:0x000000}));ball.castShadow=true;sc.add(ball);const home=new THREE.Vector3(0,.5,2.6);ball.position.copy(home);
  const seam=new THREE.Mesh(new THREE.TorusGeometry(.3,.015,6,32),new THREE.MeshBasicMaterial({color:0x6b4a2f}));ball.add(seam);
  HX.forEach((x,j)=>{const g=new THREE.Group();const pole=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,3.2,10),new THREE.MeshStandardMaterial({color:0x9aa8bd}));pole.position.set(0,1.6,-.55);g.add(pole);
    const board=new THREE.Mesh(new THREE.PlaneGeometry(1.85,1.2),new THREE.MeshStandardMaterial({color:0xffffff}));board.position.set(0,3.25,-.5);g.add(board);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(.38,.04,10,32),new THREE.MeshStandardMaterial({color:[0x5aa9d6,0xe2b93b,0x9b8bd6][j]}));rim.rotation.x=Math.PI/2;rim.position.set(0,2.85,-.1);g.add(rim);
    const net=new THREE.Mesh(new THREE.CylinderGeometry(.37,.24,.45,16,1,true),new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:.7}));net.position.set(0,2.6,-.1);g.add(net);
    g.position.set(x,0,-1.2);g.userData={j,board,rim,net};sc.add(g);hoops.push(g)});
  function round(){if(n>=order.length){const b=gameEnd(G,pts,streak>2?"🔥 on fire!":"");b.onclick=()=>{G.close();hoopShot()};return}
    const r=R[order[n]];$("#g3q").textContent=r.q[0];hoops.forEach((h,j)=>{h.userData.board.material.map=texT(r.q[1][j],"#ffffff",512,330,56);h.userData.board.material.needsUpdate=true;h.userData.ok=j===r.q[2];h.userData.why=r.q[3]});
    pad.innerHTML=r.q[1].map((o,j)=>`<button data-j="${j}">${["←","↑","→"][j]} ${esc(o)}</button>`).join("");pad.querySelectorAll("button").forEach(b=>b.onclick=()=>shoot(+b.dataset.j))}
  function shoot(j){if(shot)return;const h=hoops[j],ok=h.userData.ok,rimP=new THREE.Vector3(HX[j],2.85,-1.3);shot={j,ok,t:0,from:ball.position.clone(),to:ok?rimP:rimP.clone().add(new THREE.Vector3(.42,.05,0)),h};sfx("whoosh")}
  function land(){const s=shot;shot=null;if(s.ok){streak++;pts+=10+(streak>2?5:0);S.xp+=5;G.score(pts);sfx("swish");setTimeout(()=>sfx(streak>2?"combo":"right"),120);s.h.userData.netT=.6;
      if(streak===3){msg("🔥 On fire! Bonus points",1200);ball.material.emissive.setHex(0xff7a1a);ball.material.emissiveIntensity=.6}n++;setTimeout(()=>{ball.position.copy(home);round()},700)}
    else{streak=0;ball.material.emissive.setHex(0x000000);sfx("bonk");msg("Clank! "+esc(s.h.userData.why),2000);setTimeout(()=>ball.position.copy(home),900)}}
  let sy=null,sx=0;G.o.querySelector("canvas").addEventListener("pointerdown",e=>{sy=e.clientY;sx=e.clientX});G.o.querySelector("canvas").addEventListener("pointerup",e=>{if(sy!==null&&sy-e.clientY>30){const r=e.target.getBoundingClientRect(),fx=(e.clientX-r.left)/r.width;shoot(fx<.36?0:fx>.64?2:1)}sy=null});
  G.setKey(e=>{const m={ArrowLeft:0,ArrowUp:1,ArrowRight:2,"1":0,"2":1,"3":2}[e.key];if(m!==undefined)shoot(m)});
  tickers.push((dt,t)=>{if(shot){shot.t=Math.min(1,shot.t+dt*1.5);const e=shot.t;ball.position.lerpVectors(shot.from,shot.to,e);ball.position.y+=Math.sin(e*Math.PI)*2.2;ball.rotation.x-=dt*12;
      if(shot.t>=1){if(!shot.ok){ball.position.y-=.2}land()}}
    else if(ball.position.distanceTo(home)<.01)ball.position.y=.5+(S.calm?0:Math.abs(Math.sin(t*3))*.25);
    hoops.forEach(h=>{if(h.userData.netT>0){h.userData.netT-=dt;h.userData.net.scale.y=1+Math.sin(h.userData.netT*20)*.25}})});
  round();msg("Swipe up or tap a hoop with the right answer 🏀",1700)}

/* ---------- 3D games (Three.js) ---------- */
function rrect(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function wrapT(x,t,max){const ws=String(t).split(" "),out=[];let cur="";ws.forEach(w=>{const tst=cur?cur+" "+w:w;if(x.measureText(tst).width>max&&cur){out.push(cur);cur=w}else cur=tst});out.push(cur);return out.slice(0,3)}
function texT(text,bg,w=512,h=256,fs=46){const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");x.fillStyle=bg;rrect(x,10,10,w-20,h-20,40);x.fill();x.lineWidth=12;x.strokeStyle=INK;x.stroke();x.fillStyle=INK;x.font=`700 ${fs}px Fredoka, Nunito, sans-serif`;x.textAlign="center";x.textBaseline="middle";const ls=wrapT(x,text,w-70),lh=fs*1.15;ls.forEach((l,k)=>x.fillText(l,w/2,h/2+(k-(ls.length-1)/2)*lh));const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
function g3shell(title){
  if(!window.THREE){toast("3D needs a moment to load. Try again.");return null}
  let gl=false;try{const c=document.createElement("canvas");gl=!!(c.getContext("webgl2")||c.getContext("webgl"))}catch(e){}
  if(!gl){toast("3D isn't available on this device, so here's the tap quiz");S.tapQuiz=true;S.mode="play";if(S.tab==="feed")renderFeed(true);return null}
  const o=document.createElement("div");o.className="g3";o.innerHTML=`<canvas aria-label="${esc(title)} 3D game"></canvas><div class="g3top"><button class="back" aria-label="Quit game">←</button><div class="g3q" id="g3q" aria-live="polite">${esc(title)}</div><button class="g3mu" aria-pressed="${!!S.music}" aria-label="Game music" title="Game music">♫</button><div class="g3s" id="g3s">⭐ 0</div></div><div class="g3m" id="g3m" aria-live="assertive"></div><div class="g3pad" id="g3pad"></div>`;screen.appendChild(o);
  const cv=o.querySelector("canvas"),W=o.clientWidth,H=o.clientHeight;
  const R3=new THREE.WebGLRenderer({canvas:cv,antialias:true});R3.setPixelRatio(Math.min(2,devicePixelRatio||1));R3.setSize(W,H,false);R3.outputEncoding=THREE.sRGBEncoding;R3.shadowMap.enabled=true;R3.shadowMap.type=THREE.PCFSoftShadowMap;
  const sc=new THREE.Scene(),night=S.night,sky=night?0x1b2246:0xcfe6f3;sc.background=new THREE.Color(sky);sc.fog=new THREE.Fog(sky,18,60);
  const cam=new THREE.PerspectiveCamera(55,W/H,.1,120);
  sc.add(new THREE.HemisphereLight(night?0x9fb0ff:0xfff6e6,night?0x2a2f55:0xc9e2b0,night?.6:.6));
  const sun=new THREE.DirectionalLight(night?0xcfd6ff:0xffffff,night?.6:.75);sun.position.set(5,12,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:1,far:40});sc.add(sun);
  let raf=0,last=performance.now(),alive=true;const tickers=[];
  const loop=t=>{if(!alive)return;if(document.hidden){last=t;raf=requestAnimationFrame(loop);return}const dt=Math.min(.05,(t-last)/1000);last=t;tickers.forEach(f=>f(dt,t/1000));R3.render(sc,cam);raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
  const onRs=()=>{const w=o.clientWidth,h=o.clientHeight;if(!w||!h)return;R3.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()};window.addEventListener("resize",onRs);
  const close=()=>{musicStop();sfx("close");alive=false;cancelAnimationFrame(raf);document.removeEventListener("keydown",kd);window.removeEventListener("resize",onRs);sc.traverse(x=>{if(x.geometry)x.geometry.dispose();const ms=Array.isArray(x.material)?x.material:x.material?[x.material]:[];ms.forEach(m=>{if(m.map)m.map.dispose();m.dispose()})});R3.dispose();o.remove();hush()};
  let kd=()=>{};o.querySelector(".back").onclick=close;sfx("open");musicStart();const mu=o.querySelector(".g3mu");if(mu)mu.onclick=e=>{S.music=!S.music;e.currentTarget.setAttribute("aria-pressed",S.music);S.music?musicStart():musicStop();toast(S.music?"♫ Music on":"Music off")};
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
    gate=new THREE.Group();order.forEach((opt,k)=>{const mats=[...Array(6)].map(()=>new THREE.MeshStandardMaterial({color:PASTELS[(k+qi)%6],roughness:.6}));mats[4]=new THREE.MeshStandardMaterial({map:texT(r.q[1][opt],["#bfe0cf","#f6e3a6","#f6cdb0"][k]),roughness:.7});
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
  function mk(k){const mats=[...Array(6)].map(()=>new THREE.MeshStandardMaterial({color:PASTELS[k%6],roughness:.55}));mats[4]=new THREE.MeshStandardMaterial({map:texT(DECK.steps[k],["#bfe0cf","#f6e3a6","#f6cdb0","#c9cdf0","#b9d8ea"][k%5],512,170,40),roughness:.6});const b=new THREE.Mesh(new THREE.BoxGeometry(3.2,.8,1.2),mats);b.castShadow=b.receiveShadow=true;b.userData.k=k;return b}
  const pad=G.o.querySelector("#g3pad");
  function offer(){blocks.forEach(b=>sc.remove(b));blocks.length=0;if(done>=DECK.steps.length)return win();
    const left=[...Array(DECK.steps.length).keys()].filter(k=>k>=done),pick=[done,...left.filter(k=>k!==done).sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);
    pick.forEach((k,j)=>{const b=mk(k);b.position.set((j-1)*1.15,done*H+1.4,1.8);b.scale.setScalar(.34);b.userData.float=j;b.userData.x=(j-1)*1.15;sc.add(b);blocks.push(b)});
    $("#g3q").textContent=`Step ${done+1} of ${DECK.steps.length}: what comes next?`;pad.innerHTML=pick.map(k=>`<button data-k="${k}" style="background:${["#bfe0cf","#f6e3a6","#f6cdb0","#c9cdf0","#b9d8ea"][k%5]};color:#1b2140">${esc(DECK.steps[k])}</button>`).join("");pad.querySelectorAll("button").forEach(b=>b.onclick=()=>choose(+b.dataset.k))}
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
Object.assign(window,{S,show,renderFeed,toast,breathe,buddy,say,pullCard,closeSheet,playGame,sfx});
const today=new Date().toDateString();
const had=loadSettings(S);
// days you showed up. Missing a day quietly restarts at 1: no guilt, no "you lost it!" screens.
if(!had)S.streak=1;
if(S.lastDay!==today){S.streak=S.lastDay===new Date(Date.now()-864e5).toDateString()?(S.streak||0)+1:1;S.lastDay=today}
S.tab="feed";S.hist=[];
apply();show("feed");if(!S.onboarded)onboard();loadPack();
(async()=>{let d=await loadDeck(S.deckId||"demo");
  if(!d){const old=await loadDeck("current");if(old){old.id=old.demo?"demo":"d"+(old.savedAt||Date.now());await saveDeck(old);await deleteDeck("current");d=old;S.deckId=old.id}}
  if(d&&d.reels&&d.reels.length){useDeck(d);S.src=d.sourceLabel||S.src;if(S.tab==="feed")renderFeed()}})();
window.addEventListener("pagehide",()=>saveSettings(S));
document.addEventListener("visibilitychange",()=>{if(document.hidden)saveSettings(S)});
