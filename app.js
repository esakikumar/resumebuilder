/* Resume Studio: client-side resume builder. No backend, no tracking. */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KEY="resume-studio:v1";
const SAMPLE=()=>({name:"Sneha Jain",title:"Product Designer",loc:"Bangalore",email:"iamsnehajain@gmail.com",phone:"+91 98765 43210",link:"linkedin.com/in/sneha-jain",file:"Sneha Jain_resume",st:{},
tpl:"classic",accent:"#1f4e79",nid:10,s:[
{id:1,t:"text",title:"Summary",on:1,items:["Product designer with 8 years of experience shipping design systems and B2B products used by millions of people."]},
{id:2,t:"exp",title:"Experience",on:1,items:[
{a:"Atlassian",b:"Lead Product Designer",c:"2024 - Present",u:["Built a cross-platform design system that cut delivery time by 30% across 12 teams.","Led design for 3 launches that reached 2M+ users."]},
{a:"Zendesk",b:"Senior Product Designer",c:"2021 - 2024",u:["Ran rollout of network updates and 4 rounds of usability testing.","Refined Analytics Automation, raising weekly active use by 18%."]},
{a:"Health 24/7",b:"Product Designer",c:"2019 - 2021",u:["Stress-tested the Admin App and Portal MVP, cutting reported bugs by 40%."]}]},
{id:3,t:"skills",title:"Skills",on:1,items:["Systems thinking","Leadership","Product ownership","User research","Visual design"]},
{id:4,t:"exp",title:"Education",on:1,items:[{a:"National Institute of Design (NIT), Bengaluru",b:"B.Des, Product Design",c:"2017 - 2018",u:[]}]}]});
let D;try{D=JSON.parse(localStorage.getItem(KEY))||SAMPLE()}catch(e){D=SAMPLE()}
const SUG=[["Projects","exp"],["Certificates","list"],["Awards & Achievements","list"],["Volunteer Experience","exp"],["Interests","skills"]];
const TPL=[["classic","Classic","ats"],["modern","Modern","ats"],["compact","Compact","ats dense"],["split","Split columns","split"]];
const COLORS=["#1f4e79","#0f766e","#7c2d12","#5b21b6","#222222"];
let sel=null,open={},hist=[],hi=-1,zoom=95;

/* ---------- state helpers ---------- */
function ref(p){const k=p.split(".");let o=D;if(k[0]=="s"){o=D.s.find(x=>x.id==k[1]);k.splice(0,2)}for(let i=0;i<k.length-1;i++)o=o[k[i]];return[o,k[k.length-1]]}
const get=p=>{const[o,k]=ref(p);return o[k]},set=(p,v)=>{const[o,k]=ref(p);o[k]=v};
function snap(){const j=JSON.stringify(D);if(hist[hi]===j)return;hist=hist.slice(0,hi+1);hist.push(j);if(hist.length>80)hist.shift();hi=hist.length-1;try{localStorage.setItem(KEY,j)}catch(e){}btns()}
function go(n){if(hi+n<0||hi+n>=hist.length)return;hi+=n;D=JSON.parse(hist[hi]);render();btns()}
const btns=()=>{$("#undo").disabled=hi<1;$("#redo").disabled=hi>=hist.length-1};

/* ---------- canvas ---------- */
function ed(p,v){const s=D.st[p]||{};const css=[s.size&&`font-size:${s.size}px`,s.color&&`color:${s.color}`,s.ff&&`font-family:${s.ff}`,s.b&&"font-weight:700",s.i&&"font-style:italic",(s.u||s.s)&&`text-decoration:${[s.u&&"underline",s.s&&"line-through"].filter(Boolean).join(" ")}`,s.op&&`opacity:${s.op/100}`].filter(Boolean).join(";");
  return `<span class="ed${sel==p?" sel":""}" contenteditable="plaintext-only" spellcheck="true" data-p="${p}" style="${css}">${esc(v)}</span>`}
function block(s,i){const q=`s.${s.id}.items`;let h=`<h2>${ed(`s.${s.id}.title`,s.title)}</h2>`;
  if(s.t=="text")h+=`<p>${ed(q+".0",s.items[0]||"")}</p>`;
  if(s.t=="skills")h+=`<div class="sk">${s.items.map((x,j)=>ed(`${q}.${j}`,x)).join("")}</div><button class="add" data-add="${s.id}">+ item</button>`;
  if(s.t=="list")h+=`<ul>${s.items.map((x,j)=>`<li>${ed(`${q}.${j}`,x)}</li>`).join("")}</ul><button class="add" data-add="${s.id}">+ item</button>`;
  if(s.t=="exp")h+=s.items.map((x,j)=>`<div class="row"><div class="hd"><b>${ed(`${q}.${j}.a`,x.a)}</b><div class="rd">${ed(`${q}.${j}.b`,x.b)}<small>${ed(`${q}.${j}.c`,x.c)}</small></div></div>${x.u.length?`<ul>${x.u.map((b,k)=>`<li>${ed(`${q}.${j}.u.${k}`,b)}</li>`).join("")}</ul>`:""}<button class="add" data-bul="${s.id}.${j}">+ bullet</button></div>`).join("")+`<button class="add" data-add="${s.id}">+ entry</button>`;
  return `<div style="text-align:${(D.st["blk"+s.id]||{}).al||"left"}">${h}</div>`}
function render(keepFocus){
  const P=$("#paper");P.className=D.tpl;P.style.setProperty("--a",D.accent);
  P.innerHTML=`<div class="top"></div><h1>${ed("name",D.name)}</h1><div class="sub">${ed("title",D.title)}${D.loc?", "+ed("loc",D.loc):""}</div><div class="ct">${ed("email",D.email)}${ed("phone",D.phone)}${ed("link",D.link)}</div>`+D.s.filter(s=>s.on).map(block).join("");
  $("#fileName").textContent=D.file;layers();tpls();health();props();fit();
}
function fit(){const z=zoom/100;$("#zw").style.transform=`scale(${z})`;$("#zw").style.marginBottom=`${(z-1)*$("#paper").offsetHeight}px`;$("#zw").style.width="798px"}

/* ---------- left panel ---------- */
const kids=s=>s.t=="text"?[[`s.${s.id}.items.0`,s.items[0]]]:s.t=="exp"?s.items.map((x,j)=>[`s.${s.id}.items.${j}.a`,x.a]):s.items.map((x,j)=>[`s.${s.id}.items.${j}`,x]);
function layers(){
  const row=(key,title,ch,extra)=>`<div class="lay" ${extra||""}><div class="lh"><span class="g">⠿</span><b>${esc(title)}</b>${extra?`<input type="checkbox" aria-label="Show ${esc(title)}" data-on="${key}" ${(D.s.find(x=>x.id==key)||{}).on?"checked":""}>`:""}<button data-open="${key}" aria-label="Expand">${open[key]?"⌃":"⌄"}</button></div>${open[key]?`<div class="kids">${ch.map(k=>`<button data-go="${k[0]}">T&nbsp; ${esc(k[1]||"(empty)")}</button>`).join("")}</div>`:""}</div>`;
  $("#layers").innerHTML=row("info","Name & Information",[["name",D.name],["title",D.title],["link",D.link]])+D.s.map(s=>row(s.id,s.title,kids(s),`draggable="true" data-i="${s.id}"`)).join("");
  const have=D.s.map(s=>s.title.toLowerCase());
  $("#sugs").innerHTML=SUG.map((x,i)=>have.includes(x[0].toLowerCase())?"":`<button class="sug" data-sug="${i}">${x[0]}<span>+</span></button>`).join("")||'<p class="note">All suggested layers added.</p>';
}
function tpls(){$("#tpls").innerHTML=TPL.map(t=>`<button class="tpl ${t[2]} ${D.tpl==t[0]?"on":""}" data-tpl="${t[0]}" style="--tc:${D.accent}"><i class="h"></i><i class="c"></i>${"<i></i>".repeat(t[2].includes("dense")?14:9)}<span>${t[1]}${t[2].includes("split")?" · not ATS-safe":""}</span></button>`).join("")}
$$(".seg button").forEach(b=>b.onclick=()=>{$$(".seg button").forEach(x=>x.classList.toggle("on",x==b));$("#tab-layers").hidden=b.dataset.tab!="layers";$("#tab-templates").hidden=b.dataset.tab!="templates"});
$("#layers").onclick=e=>{const o=e.target.closest("[data-open]"),g=e.target.closest("[data-go]");
  if(o){open[o.dataset.open]=!open[o.dataset.open];layers()}
  if(g){const el=$(`.ed[data-p="${g.dataset.go}"]`);if(el){el.scrollIntoView({block:"center",behavior:"smooth"});el.focus()}}};
$("#layers").onchange=e=>{const k=e.target.dataset.on;if(!k)return;D.s.find(x=>x.id==k).on=e.target.checked?1:0;snap();render()};
let drag=null;
$("#layers").ondragstart=e=>{drag=+e.target.closest(".lay")?.dataset.i};
$("#layers").ondragover=e=>{e.preventDefault();$$(".lay").forEach(l=>l.classList.remove("over"));e.target.closest(".lay[data-i]")?.classList.add("over")};
$("#layers").ondrop=e=>{e.preventDefault();const t=e.target.closest(".lay[data-i]");if(!t||!drag)return;const a=D.s.findIndex(x=>x.id==drag),b=D.s.findIndex(x=>x.id==+t.dataset.i);const[m]=D.s.splice(a,1);D.s.splice(b,0,m);drag=null;snap();render()};
$("#sugs").onclick=e=>{const b=e.target.closest("[data-sug]");if(!b)return;const[n,t]=SUG[b.dataset.sug];D.s.push({id:D.nid++,t,title:n,on:1,items:t=="exp"?[{a:"Name",b:"Role",c:"Year",u:["Describe the outcome with a number"]}]:["New item"]});snap();render()};
$("#tpls").onclick=e=>{const b=e.target.closest("[data-tpl]");if(b){D.tpl=b.dataset.tpl;snap();render()}};
$("#hide").onclick=()=>{$("#left").classList.toggle("collapsed");$("#right").classList.toggle("collapsed")};
$("#fileBtn").onclick=()=>{const n=prompt("File name",D.file);if(n){D.file=n.trim()||D.file;snap();render()}};

/* upload: JSON export or plain text with headings */
$("#up").onchange=async e=>{const f=e.target.files[0];if(!f)return;const t=await f.text();
  try{if(f.name.endsWith(".json")){const j=JSON.parse(t);if(!j.s)throw 0;D=j}else D=parseText(t);snap();render()}catch(x){alert("Could not read that file. Use a .json export from this tool or a .txt resume with headings like Experience and Skills.")}e.target.value=""};
function parseText(t){const L=t.split(/\r?\n/).map(x=>x.trim()).filter(Boolean),d=SAMPLE();d.s=[];d.name=L[0]||"Your name";d.title=L[1]||"";d.loc="";d.email=(t.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)||[""])[0];d.phone=(t.match(/\+?\d[\d\s\-()]{7,}\d/)||[""])[0];d.link=(t.match(/(?:linkedin\.com|github\.com)\/\S+/)||[""])[0];
  const H=/^(summary|profile|experience|work experience|education|skills|projects|certifications|awards)$/i;let cur=null;
  L.slice(2).forEach(l=>{if(H.test(l)){cur={id:D.nid++||d.s.length+20,t:/skill/i.test(l)?"skills":/summary|profile/i.test(l)?"text":"list",title:l[0].toUpperCase()+l.slice(1).toLowerCase(),on:1,items:[]};d.s.push(cur)}else if(cur)cur.items.push(l.replace(/^[•\-*]\s*/,""))});
  d.s.forEach((s,i)=>{s.id=i+1;if(s.t=="skills")s.items=s.items.join(",").split(/[,;|]/).map(x=>x.trim()).filter(Boolean)});return d}

/* ---------- editing ---------- */
$("#paper").addEventListener("input",e=>{const t=e.target.closest(".ed");if(!t)return;set(t.dataset.p,t.textContent);$("#txt").value=t.textContent;clearTimeout(window._s);window._s=setTimeout(()=>{snap();health();layers()},300)});
$("#paper").addEventListener("keydown",e=>{if(e.key=="Enter")e.preventDefault()});
$("#paper").addEventListener("focusin",e=>{const t=e.target.closest(".ed");if(t){sel=t.dataset.p;$$(".ed.sel").forEach(x=>x.classList.remove("sel"));t.classList.add("sel");props()}});
$("#paper").addEventListener("click",e=>{const b=e.target;
  if(b.dataset.add){const s=D.s.find(x=>x.id==b.dataset.add);s.t=="exp"?s.items.push({a:"Organisation",b:"Role",c:"Year - Year",u:["Describe the outcome with a number"]}):s.items.push("New item");snap();render()}
  if(b.dataset.bul){const[i,j]=b.dataset.bul.split(".");D.s.find(x=>x.id==i).items[j].u.push("Describe the outcome with a number");snap();render()}});
const st=()=>sel?(D.st[sel]=D.st[sel]||{}):null;
function props(){const s=sel&&D.st[sel]||{};$("#txt").value=sel?get(sel):"";$("#ff").value=s.ff||"";$("#fs").value=s.size||"";$("#fill").value=s.color||"#1b1b1b";$("#op").value=s.op||100;$$("#fmt button").forEach(b=>b.classList.toggle("on",!!s[b.dataset.f]))}
$("#txt").oninput=e=>{if(!sel)return;set(sel,e.target.value);const el=$(`.ed[data-p="${sel}"]`);if(el)el.textContent=e.target.value;health();clearTimeout(window._s);window._s=setTimeout(()=>{snap();layers()},300)};
const sty=(k,v)=>{const s=st();if(!s)return;s[k]=v;snap();const y=sel;render();$(`.ed[data-p="${y}"]`)?.classList.add("sel")};
$("#ff").onchange=e=>sty("ff",e.target.value);$("#fs").onchange=e=>sty("size",+e.target.value||0);$("#fill").onchange=e=>sty("color",e.target.value);$("#op").onchange=e=>sty("op",+e.target.value);
$("#fmt").onclick=e=>{const b=e.target.closest("[data-f]");if(b&&sel)sty(b.dataset.f,!(D.st[sel]||{})[b.dataset.f])};
$("#align").onclick=e=>{const b=e.target.closest("[data-al]");if(!b||!sel)return;const m=sel.match(/^s\.(\d+)/);const k=m?"blk"+m[1]:"blk0";D.st[k]={...(D.st[k]||{}),al:b.dataset.al};snap();render()};
$("#sw").innerHTML=COLORS.map(c=>`<button style="background:${c}" data-c="${c}" aria-label="Accent ${c}"></button>`).join("");
$("#sw").onclick=e=>{if(e.target.dataset.c){D.accent=e.target.dataset.c;snap();render()}};

/* ---------- toolbar ---------- */
$("#undo").onclick=()=>go(-1);$("#redo").onclick=()=>go(1);
addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()=="z"){e.preventDefault();go(e.shiftKey?1:-1)}});
$("#addText").onclick=()=>{D.s.push({id:D.nid++,t:"text",title:"About",on:1,items:["Write something here"]});snap();render()};
$("#outline").onclick=e=>{document.body.classList.toggle("boxes");e.currentTarget.classList.toggle("on")};
$("#fix").onclick=()=>{D.s.forEach(s=>{if(s.t=="skills"){const seen=new Set;s.items=s.items.map(x=>x.trim()).filter(x=>x&&!seen.has(x.toLowerCase())&&seen.add(x.toLowerCase()))}});snap();render()};
$("#zoom").onchange=e=>{zoom=+e.target.value;fit()};

/* ---------- resume health ---------- */
const STD=["summary","profile","professional summary","experience","work experience","education","skills","projects","certifications","certificates","awards","awards & achievements","volunteer experience","interests","languages","about"];
const STOP=new Set("the and for with you will are our this that have from your who what their they has been more can all not but its into other than about also such per use any able work team role years year experience skills strong including within across ability etc".split(" "));
const words=t=>(t.toLowerCase().match(/[a-z][a-z+#.\-]{2,}/g)||[]).map(w=>w.replace(/[.\-]+$/,""));
const allText=()=>[D.name,D.title,...D.s.filter(s=>s.on).flatMap(s=>s.items.flatMap(x=>typeof x=="string"?[x]:[x.a,x.b,x.c,...x.u]))].join(" ");
function health(){const vis=D.s.filter(s=>s.on),R=[];
  const em=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(D.email.trim()),ph=D.phone.replace(/\D/g,"").length>=8;
  R.push(["Contact details",em&&ph?1:em||ph?.5:0,em&&ph?"Email and phone found":"Add a valid "+(em?"phone number":"email address")]);
  const bad=vis.filter(s=>!STD.includes(s.title.trim().toLowerCase()));
  R.push(["Standard headings",1-bad.length/Math.max(1,vis.length),bad.length?`Rename "${bad[0].title}" to a common heading`:"All headings are recognisable"]);
  R.push(["Single-column layout",D.tpl=="split"?.3:1,D.tpl=="split"?"Columns can scramble text in some parsers. Use Classic or Modern":"Reads top to bottom, safest for parsers"]);
  const bl=vis.filter(s=>s.t=="exp").flatMap(s=>s.items.flatMap(x=>x.u)),q=bl.filter(b=>/\d/.test(b)).length;
  R.push(["Quantified results",Math.min(1,(bl.length?q/bl.length:0)/.4),bl.length?`${q} of ${bl.length} bullets include a number`:"Add bullets under your roles"]);
  const long=bl.filter(b=>b.split(/\s+/).length>30).length;
  R.push(["Concise bullets",bl.length?1-long/bl.length:1,long?`${long} bullet(s) run over 30 words`:"Bullets are easy to scan"]);
  const sk=vis.filter(s=>s.t=="skills").flatMap(s=>s.items.map(x=>x.trim().toLowerCase())),dup=sk.length-new Set(sk).size;
  R.push(["No duplicate skills",dup?.4:1,dup?`${dup} skill(s) listed twice`:"No repeats"]);
  const small=Object.values(D.st).some(x=>x.size&&x.size<11)||D.tpl=="compact"&&false;
  R.push(["Readable text size",small?.5:1,small?"Some text is under 11 px. Raise it":"Text sizes are readable"]);
  const jd=$("#jd").value.trim();let kw="";
  if(jd){const f={};words(jd).filter(w=>w.length>3&&!STOP.has(w)).forEach(w=>f[w]=(f[w]||0)+1);const top=Object.entries(f).sort((a,b)=>b[1]-a[1]).slice(0,14).map(x=>x[0]),have=new Set(words(allText())),hit=top.filter(w=>have.has(w));
    R.push(["Job keyword match",top.length?hit.length/top.length:1,`${hit.length} of ${top.length} keywords found`]);kw=top.map(w=>`<span class="${have.has(w)?"":"miss"}">${esc(w)}</span>`).join("")}
  $("#kw").innerHTML=kw;
  const sc=Math.round(R.reduce((a,x)=>a+x[1],0)/R.length*100);
  $("#pill").innerHTML=`<b>${sc}</b>/100`;$("#bar").style.width=sc+"%";$("#bar").className=sc<70?"low":"";
  $("#checks").innerHTML=R.map(x=>{const c=x[1]>=.9?"ok":x[1]>=.5?"wn":"bd";return `<div class="chk ${c}"><em>${c=="ok"?"✓":c=="wn"?"!":"✕"}</em><div>${x[0]}<small>${esc(x[2])}</small></div></div>`}).join("")}
$("#hhead").onclick=()=>$("#hbody").hidden=!$("#hbody").hidden;
$("#jd").oninput=()=>{clearTimeout(window._j);window._j=setTimeout(health,250)};

/* ---------- export ---------- */
const fname=()=>D.file.replace(/\s+/g,"_");
const dlBlob=(name,blob)=>{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)};
const say=t=>$("#msg").textContent=t;
$("#exportBtn").onclick=()=>{$("#modal").hidden=false;say("")};
const close=()=>$("#modal").hidden=true;$("#x").onclick=close;$("#cancel").onclick=close;
$("#modal").onclick=e=>{if(e.target.id=="modal")close()};
$("#fmtSel").onchange=()=>$("#scaleRow").hidden=$("#fmtSel").value!="png";
$("#copy").onclick=async()=>{try{await navigator.clipboard.writeText(location.href);say("Link copied")}catch(e){say("Copy failed")}};
$("#dl").onclick=async()=>{const f=$("#fmtSel").value;
  try{if(f=="json")dlBlob(fname()+".json",new Blob([JSON.stringify(D,null,2)],{type:"application/json"}));
    if(f=="pdf"){close();setTimeout(()=>print(),100)}
    if(f=="png"){say("Rendering…");const z=$("#zw"),old=z.style.transform;z.style.transform="none";
      try{const u=await htmlToImage.toPng($("#paper"),{pixelRatio:+$("#scale").value,backgroundColor:"#fff",filter:n=>!(n.classList&&n.classList.contains("add"))});dlBlob(`${fname()}@${$("#scale").value}x.png`,await(await fetch(u)).blob())}finally{z.style.transform=old}}
    if(f=="docx")dlBlob(fname()+".docx",await docx());
    if(f!="pdf")say("Downloaded")}catch(e){say("Export failed: "+(e.message||"try again"))}};
async function docx(){const sz=22,col=D.accent.slice(1),esc2=esc;
  const r=(t,o={})=>`<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>${o.b?"<w:b/>":""}${o.c?`<w:color w:val="${o.c}"/>`:""}<w:sz w:val="${o.s||sz}"/></w:rPr><w:t xml:space="preserve">${esc2(t)}</w:t></w:r>`;
  const p=(x,o={})=>`<w:p><w:pPr>${o.bul?'<w:ind w:left="360" w:hanging="220"/>':""}<w:spacing w:before="${o.bf||0}" w:after="${o.af||40}"/>${o.bd?`<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="${col}"/></w:pBdr>`:""}</w:pPr>${x}</w:p>`;
  let b=p(r(D.name,{b:1,s:56}))+p(r([D.title,D.loc].filter(Boolean).join(", ")))+p(r([D.email,D.phone,D.link].filter(Boolean).join("  |  "),{s:20}),{af:120});
  D.s.filter(s=>s.on).forEach(s=>{b+=p(r(s.title,{b:1,c:col}),{bf:200,bd:1});
    if(s.t=="text")b+=p(r(s.items[0]||""));if(s.t=="skills")b+=p(r(s.items.join(", ")));
    if(s.t=="list")s.items.forEach(x=>b+=p(r("• "+x),{bul:1}));
    if(s.t=="exp")s.items.forEach(x=>{b+=p(r(x.a,{b:1})+r("  "+[x.b,x.c].filter(Boolean).join(" | ")),{bf:80});x.u.forEach(u=>b+=p(r("• "+u),{bul:1}))})});
  const z=new JSZip();
  z.file("[Content_Types].xml",'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
  z.file("_rels/.rels",'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  z.file("word/document.xml",`<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${b}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="900" w:right="1000" w:bottom="900" w:left="1000"/></w:sectPr></w:body></w:document>`);
  return z.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"})}

render();snap();
