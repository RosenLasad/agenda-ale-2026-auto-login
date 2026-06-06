(function(){
  "use strict";
  var STORAGE_KEY = "agenda_actions_v1";
  var DEFAULT_ACTIONS = [
    { id:"act-frutta", name:"Mangiare frutta/verdura", cadence:"daily", points:20, duration:"30 min", reminderTime:"" },
    { id:"act-ginnastica", name:"Ginnastica", cadence:"daily", points:20, duration:"30 min", reminderTime:"" },
    { id:"act-camminata", name:"Camminata", cadence:"daily", points:20, duration:"30 min", reminderTime:"" },
    { id:"act-casa", name:"Pulizia / ordine casa", cadence:"daily", points:20, duration:"30 min", reminderTime:"" },
    { id:"act-mezzi", name:"Pulizia macchina/moto", cadence:"daily", points:20, duration:"30 min", reminderTime:"" },
    { id:"act-ufficio", name:"Ordine ufficio", cadence:"daily", points:20, duration:"30 min", reminderTime:"" },
    { id:"act-camminata-lunga", name:"Camminata lunga", cadence:"weekly", points:25, duration:"1 ora", reminderTime:"" },
    { id:"act-cinema", name:"Cinema/teatro", cadence:"weekly", points:25, duration:"1 ora", reminderTime:"" },
    { id:"act-lavatrice", name:"Lavatrice", cadence:"weekly", points:25, duration:"1 ora", reminderTime:"" },
    { id:"act-lenzuola", name:"Lenzuola", cadence:"weekly", points:25, duration:"1 ora", reminderTime:"" },
    { id:"act-pavimento", name:"Lavare per terra", cadence:"monthly", points:30, duration:"2 ore o più", reminderTime:"" },
    { id:"act-escursione", name:"Escursione/dormire fuori", cadence:"monthly", points:30, duration:"2 ore o più", reminderTime:"" }
  ];
  function $(sel){ return document.querySelector(sel); }
  function $all(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function pad2(n){ return String(n).padStart(2,"0"); }
  function uid(){ return Math.random().toString(16).slice(2) + Date.now().toString(16); }
  function todayISO(){ var d=new Date(); return d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate()); }
  function parseISO(s){ var p=String(s||"").split("-").map(Number); return new Date(p[0],p[1]-1,p[2],12,0,0,0); }
  function daysBetween(a,b){ return Math.floor((parseISO(b)-parseISO(a))/86400000); }
  function esc(str){ return String(str||"").replace(/[&<>"']/g,function(ch){return ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[ch]||ch;}); }
  function cadence(raw){ raw=String(raw||"").toLowerCase(); return raw==="weekly" ? "weekly" : (raw==="monthly" ? "monthly" : "daily"); }
  function norm(a){ a=a&&typeof a==="object"?a:{}; return { id:a.id||uid(), name:String(a.name||"").trim(), cadence:cadence(a.cadence), points:Math.max(1,parseInt(a.points,10)||20), duration:String(a.duration||"").trim(), reminderTime:String(a.reminderTime||"").trim(), lastCompleted:a.lastCompleted||null, completions:Array.isArray(a.completions)?a.completions.filter(Boolean):[], archived:!!a.archived }; }
  function load(){
    var data={dailyGoal:100,items:[]};
    try{ data=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null")||data; }catch(e){}
    data.dailyGoal=Math.max(1,parseInt(data.dailyGoal,10)||100);
    data.items=Array.isArray(data.items)?data.items.map(norm):[];
    var ids={}; data.items.forEach(function(a){ids[a.id]=true;});
    DEFAULT_ACTIONS.forEach(function(a){ if(!ids[a.id]) data.items.push(norm(a)); });
    return data;
  }
  var state=load(), editingId=null, fired={};
  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function doneToday(a,iso){ return (a.completions||[]).indexOf(iso)>=0; }
  function due(a,iso){ if(a.archived) return false; if(a.cadence==="daily") return !doneToday(a,iso); if(!a.lastCompleted) return true; return daysBetween(a.lastCompleted,iso) >= (a.cadence==="monthly"?30:7); }
  function label(c){ return c==="weekly"?"Settimanale":(c==="monthly"?"Mensile":"Quotidiana"); }
  function points(iso){ return state.items.reduce(function(sum,a){ return sum+(doneToday(a,iso)?a.points:0); },0); }
  function showView(view){
    var isActions=view==="actions";
    ["calendar","notebook","contacts","today"].forEach(function(v){ var el=$("#view-"+v); if(el) el.classList.toggle("hidden", isActions || v!==view); });
    var av=$("#view-actions"); if(av) av.classList.toggle("hidden", !isActions);
    $all(".tab").forEach(function(t){ t.classList.toggle("active", t.getAttribute("data-view")===view); });
    if(isActions) render();
  }
  function render(){
    var list=$("#actionsList"); if(!list) return;
    var iso=todayISO(), p=points(iso), goal=state.dailyGoal;
    if($("#actionsTodayPoints")) $("#actionsTodayPoints").textContent=p;
    if($("#actionsDailyGoal")) $("#actionsDailyGoal").textContent=goal;
    if($("#actionsProgressBar")) $("#actionsProgressBar").style.width=Math.min(100,Math.round(p/goal*100))+"%";
    if($("#actionsMotivation")) $("#actionsMotivation").textContent=p>=goal?"Obiettivo raggiunto. Ora puoi anche fermarti senza sensi di colpa.":"Ti mancano "+Math.max(0,goal-p)+" punti per arrivare a "+goal+".";
    var filter=$("#actionsFilter")?$("#actionsFilter").value:"due";
    var order={daily:0,weekly:1,monthly:2};
    var items=state.items.filter(function(a){ if(a.archived) return false; if(filter==="due") return due(a,iso); if(filter==="all") return true; return a.cadence===filter; }).sort(function(a,b){ var ad=due(a,iso),bd=due(b,iso); if(ad!==bd) return ad?-1:1; if(order[a.cadence]!==order[b.cadence]) return order[a.cadence]-order[b.cadence]; return a.name.localeCompare(b.name); });
    list.innerHTML="";
    if(!items.length){ list.innerHTML='<div class="empty">Nessuna azione da mostrare. Bene: hai alleggerito la giornata.</div>'; return; }
    items.forEach(function(a){
      var d=doneToday(a,iso), ready=due(a,iso), div=document.createElement("div");
      div.className="item actionItem"+(d?" actionItem--done":"")+(ready?"":" actionItem--waiting");
      var last=a.lastCompleted?" · ultima: "+a.lastCompleted:"", rem=a.reminderTime?" · promemoria "+a.reminderTime:"";
      div.innerHTML='<div class="itemMain"><input class="checkbox actionCheck" type="checkbox" '+(d?'checked':'')+'><div class="itemText"><p class="t">'+esc(a.name)+'</p><p class="s"><span class="badge '+a.cadence+'">'+label(a.cadence)+'</span> <span class="badge">'+a.points+' pt</span> '+(a.duration?'<span class="badge">'+esc(a.duration)+'</span>':'')+'<br>'+(ready?'Disponibile ora':'Non ancora in scadenza')+last+rem+'</p></div></div><div class="itemActions"><button class="smallBtn editAction" type="button">Modifica</button><button class="smallBtn danger archiveAction" type="button">Archivia</button></div>';
      div.querySelector('.actionCheck').addEventListener('change',function(ev){ complete(a.id,ev.target.checked); });
      div.querySelector('.editAction').addEventListener('click',function(){ openEditor(a.id); });
      div.querySelector('.archiveAction').addEventListener('click',function(){ a.archived=true; save(); render(); });
      list.appendChild(div);
    });
  }
  function complete(id,checked){ var iso=todayISO(), a=state.items.find(function(x){return x.id===id;}); if(!a) return; a.completions=(a.completions||[]).filter(function(x){return x!==iso;}); if(checked){a.completions.push(iso); a.lastCompleted=iso;} else if(a.lastCompleted===iso){a.lastCompleted=a.completions[a.completions.length-1]||null;} save(); render(); }
  function openEditor(id){ var a=id?state.items.find(function(x){return x.id===id;}):null; editingId=a?a.id:null; if($("#actionName")) $("#actionName").value=a?a.name:""; if($("#actionCadence")) $("#actionCadence").value=a?a.cadence:"daily"; if($("#actionPoints")) $("#actionPoints").value=a?a.points:20; if($("#actionDuration")) $("#actionDuration").value=a?a.duration:""; if($("#actionReminder")) $("#actionReminder").value=a?a.reminderTime:""; var card=$("#actionEditorCard"); if(card) card.classList.remove("collapsed"); }
  function saveEditor(){ var name=$("#actionName")?$("#actionName").value.trim():""; if(!name) return; var a=editingId?state.items.find(function(x){return x.id===editingId;}):null; if(!a){a=norm({id:uid()}); state.items.push(a);} a.name=name; a.cadence=cadence($("#actionCadence").value); a.points=Math.max(1,parseInt($("#actionPoints").value,10)||20); a.duration=$("#actionDuration").value.trim(); a.reminderTime=$("#actionReminder").value; editingId=null; var card=$("#actionEditorCard"); if(card) card.classList.add("collapsed"); save(); render(); }
  function resetToday(){ var iso=todayISO(); state.items.forEach(function(a){ if(a.cadence==="daily"){ a.completions=(a.completions||[]).filter(function(x){return x!==iso;}); if(a.lastCompleted===iso) a.lastCompleted=null; } }); save(); render(); }
  function checkReminders(){ var box=$("#actionsReminderCard"), text=$("#actionsReminderText"); if(!box||!text) return; var n=new Date(), iso=todayISO(), hm=pad2(n.getHours())+":"+pad2(n.getMinutes()); var list=state.items.filter(function(a){ var key=iso+"|"+a.id+"|"+hm; return a.reminderTime===hm && due(a,iso) && !fired[key]; }); if(!list.length) return; list.forEach(function(a){fired[iso+"|"+a.id+"|"+hm]=true;}); text.textContent="Promemoria: "+list.map(function(a){return a.name;}).join(", "); box.classList.remove("hidden"); setTimeout(function(){box.classList.add("hidden");},9000); }
  document.addEventListener("DOMContentLoaded",function(){
    $all('.tab').forEach(function(t){ t.addEventListener('click',function(){ if(t.getAttribute('data-view')==='actions') showView('actions'); else $('#view-actions') && $('#view-actions').classList.add('hidden'); }); });
    if($("#actionsFilter")) $("#actionsFilter").addEventListener("change",render);
    if($("#btnOpenActionEditor")) $("#btnOpenActionEditor").addEventListener("click",function(){openEditor(null);});
    if($("#btnSaveAction")) $("#btnSaveAction").addEventListener("click",saveEditor);
    if($("#btnCancelActionEdit")) $("#btnCancelActionEdit").addEventListener("click",function(){ var card=$("#actionEditorCard"); if(card) card.classList.add("collapsed"); });
    if($("#btnResetTodayActions")) $("#btnResetTodayActions").addEventListener("click",resetToday);
    setInterval(checkReminders,60000); checkReminders(); render();
  });
})();
