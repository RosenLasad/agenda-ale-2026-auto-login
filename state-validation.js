(function(root){
  "use strict";
  function record(v){ return v !== null && typeof v === "object" && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype; }
  function check(ok, message){ if(!ok) throw new Error(message); }
  function text(v, name, optional){ check((optional && v === undefined) || typeof v === "string", name + ": testo non valido"); }
  function list(v, name, fn){
    check(Array.isArray(v), name + ": elenco non valido");
    var ids = new Set();
    v.forEach(function(item){
      check(record(item), name + ": elemento non valido");
      text(item.id, name + ": identificativo");
      check(item.id.length > 0 && !ids.has(item.id), name + ": identificativo mancante o duplicato"); ids.add(item.id);
      fn(item);
    });
  }
  function date(v){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    var d=new Date(v + "T12:00:00Z"); return !isNaN(d.getTime()) && d.toISOString().slice(0,10) === v;
  }
  function validateState(v){
    check(record(v), "Il file non contiene un archivio Agenda");
    check(v.version === "v1-notes", "Versione del backup Agenda non riconosciuta");
    check(record(v.events), "Calendario mancante o non valido");
    var eventIds = new Set();
    Object.keys(v.events).forEach(function(day){
      check(date(day), "Data del calendario non valida: " + day);
      list(v.events[day], "Eventi", function(e){
        check(!eventIds.has(e.id), "Identificativo evento duplicato"); eventIds.add(e.id);
        text(e.title, "Titolo evento"); text(e.time, "Orario evento");
        check(e.time === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(e.time), "Orario evento non valido");
        text(e.notes, "Note evento", true);
        check(e.cat === undefined || ["work","priv","sdac","other"].indexOf(e.cat) >= 0, "Categoria evento non valida");
        if(e.alarm !== undefined){
          check(record(e.alarm) && typeof e.alarm.enabled === "boolean", "Sveglia non valida");
          check(Number.isInteger(e.alarm.offsetMinutes) && e.alarm.offsetMinutes >= 0 && e.alarm.offsetMinutes <= 10080, "Anticipo sveglia non valido");
          text(e.alarm.snoozeUntil, "Posticipo sveglia", true); text(e.alarm.lastFiredKey, "Stato sveglia", true);
          check(!e.alarm.snoozeUntil || Number.isFinite(Date.parse(e.alarm.snoozeUntil)), "Data posticipo non valida");
        }
      });
    });
    list(v.todos, "Cose da fare", function(t){ text(t.text,"Testo attività"); check(typeof t.done === "boolean", "Stato attività non valido"); check(["low","med","high"].indexOf(t.priority)>=0,"Priorità non valida");text(t.tag,"Tag",true); });
    if(typeof v.notes !== "string"){
      check(record(v.notes), "Taccuino mancante o non valido");
      list(v.notes.items,"Note",function(n){text(n.title,"Titolo nota");text(n.body,"Testo nota");check(n.favorite===undefined || typeof n.favorite === "boolean","Preferito non valido");text(n.color,"Colore nota",true);});
      ["draftTitle","draftBody","draftColor"].forEach(function(k){text(v.notes[k],"Bozza nota",true);});
    }
    list(v.contacts,"Contatti",function(c){["name","phone","email","notes"].forEach(function(k){text(c[k],"Contatto",true);});});
    if(v.actions !== undefined && v.actions !== null){
      check(record(v.actions) && Number.isFinite(v.actions.dailyGoal) && v.actions.dailyGoal > 0,"Obiettivo Azioni non valido");
      list(v.actions.items,"Azioni",function(a){
        text(a.name,"Nome azione");check(["daily","weekly","monthly"].indexOf(a.cadence)>=0,"Frequenza azione non valida");
        check(Number.isFinite(a.points) && a.points > 0,"Punti azione non validi");text(a.duration,"Durata",true);text(a.reminderTime,"Promemoria",true);
        check(a.lastCompleted == null || date(a.lastCompleted),"Data completamento non valida");
        check(Array.isArray(a.completions) && a.completions.every(date),"Completamenti non validi");
        check(a.reminderTime===undefined || a.reminderTime==="" || /^([01]\d|2[0-3]):[0-5]\d$/.test(a.reminderTime),"Orario promemoria non valido");
      });
    }
    check(v.updatedAt===undefined || Number.isFinite(Date.parse(v.updatedAt)),"Data aggiornamento non valida");
    return v;
  }
  root.AgendaStateValidation={ validateState:validateState };
})(globalThis);
