(function(){
    "use strict";

    var START_YEAR = 2026;
    var STORAGE_KEY = "agenda_ale_2026_v1";

    var MONTHS_IT = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
    var DOW_IT = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];

    var CONTACT_CATEGORY_LABELS = {
      lavoro: "Lavoro",
      amici: "Amici",
      famiglia: "Famiglia",
      clienti: "Clienti",
      fornitori: "Fornitori",
      altro: "Altro"
    };

    var EVENT_CATEGORY_LABELS = {
      work: "Lavoro",
      priv: "Privato",
      sdac: "SDAC",
      other: "Altro"
    };

    var NOTE_COLOR_LABELS = {
      cream: "Crema",
      blush: "Rosa",
      sage: "Salvia",
      sky: "Azzurro",
      gold: "Oro"
    };
    var NOTE_COLOR_ORDER = ["cream","blush","sage","sky","gold"];


    function $(sel){ return document.querySelector(sel); }
    function pad2(n){ return String(n).padStart(2,"0"); }
    function isoDate(d){ return d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate()); }
    function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
    function uid(){ return Math.random().toString(16).slice(2) + Date.now().toString(16); }
    function parseISO(s){
      var p = s.split("-").map(Number);
      return new Date(p[0], p[1]-1, p[2], 12,0,0,0);
    }

    function getMonthCursorDate(){
      return new Date(currentYear, currentMonth, 1, 12, 0, 0, 0);
    }

    function shiftCalendarMonth(delta){
      var base = getMonthCursorDate();
      base.setMonth(base.getMonth() + delta);
      currentYear = base.getFullYear();
      currentMonth = base.getMonth();
    }


    function normalizeEventCategory(value){
      var raw = String(value || "").trim().toLowerCase();
      var map = {
        work: "work",
        lavoro: "work",
        priv: "priv",
        private: "priv",
        privato: "priv",
        sdac: "sdac",
        other: "other",
        altro: "other"
      };
      return map[raw] || "other";
    }

    function eventCategoryLabel(value){
      return EVENT_CATEGORY_LABELS[normalizeEventCategory(value)] || "Altro";
    }

    var ALARM_SOUND_PATH = "./sound/alarm.mp3";
    var ALARM_CHECK_MS = 20000;
    var ALARM_GRACE_MS = 30 * 60 * 1000;
    var ALARM_SNOOZE_MS = 5 * 60 * 1000;
    var ALARM_OFFSET_LABELS = {
      0: "All'orario",
      5: "5 min prima",
      15: "15 min prima",
      30: "30 min prima"
    };

    function normalizeAlarmOffset(value){
      var n = parseInt(value, 10);
      if(isNaN(n)) n = 0;
      return Object.prototype.hasOwnProperty.call(ALARM_OFFSET_LABELS, n) ? n : 0;
    }

    function normalizeEventAlarm(value){
      var a = value && typeof value === "object" ? value : {};
      var enabled = !!a.enabled;
      var offsetMinutes = normalizeAlarmOffset(a.offsetMinutes);
      return {
        enabled: enabled,
        offsetMinutes: offsetMinutes,
        snoozeUntil: typeof a.snoozeUntil === "string" ? a.snoozeUntil : "",
        lastFiredKey: typeof a.lastFiredKey === "string" ? a.lastFiredKey : ""
      };
    }

    function normalizeEvent(ev){
      var e = ev && typeof ev === "object" ? ev : {};
      e.id = e.id || uid();
      e.time = String(e.time || "");
      e.title = String(e.title || "");
      e.notes = String(e.notes || "");
      e.cat = normalizeEventCategory(e.cat);
      e.createdAt = e.createdAt || new Date().toISOString();
      e.alarm = normalizeEventAlarm(e.alarm);
      if(!e.alarm.enabled){
        e.alarm.offsetMinutes = 0;
        e.alarm.snoozeUntil = "";
        e.alarm.lastFiredKey = "";
      }
      return e;
    }

    function eventHasAlarm(ev){
      return !!(ev && ev.time && ev.alarm && ev.alarm.enabled);
    }

    function getEventAlarmLabel(ev){
      if(!eventHasAlarm(ev)) return "";
      var offset = normalizeAlarmOffset(ev.alarm.offsetMinutes);
      return ALARM_OFFSET_LABELS[offset] || ALARM_OFFSET_LABELS[0];
    }

    function normalizeContactCategory(value){
      var raw = String(value || "").trim().toLowerCase();
      var map = {
        work: "lavoro",
        lavoro: "lavoro",
        friends: "amici",
        amici: "amici",
        family: "famiglia",
        famiglia: "famiglia",
        clients: "clienti",
        clienti: "clienti",
        suppliers: "fornitori",
        fornitori: "fornitori",
        other: "altro",
        altro: "altro"
      };
      return map[raw] || "altro";
    }

    function normalizeContact(contact){
      var c = contact && typeof contact === "object" ? contact : {};
      return {
        id: c.id || uid(),
        name: String(c.name || "").trim(),
        phone: String(c.phone || "").trim(),
        email: String(c.email || "").trim(),
        category: normalizeContactCategory(c.category),
        notes: String(c.notes || "").trim()
      };
    }

    function contactCategoryLabel(value){
      return CONTACT_CATEGORY_LABELS[normalizeContactCategory(value)] || "Altro";
    }

    function normalizeNoteColor(value){
      var raw = String(value || "").trim().toLowerCase();
      return NOTE_COLOR_LABELS[raw] ? raw : "cream";
    }

    function noteColorLabel(value){
      return NOTE_COLOR_LABELS[normalizeNoteColor(value)] || "Crema";
    }

    function createImportedLegacyNote(text){
      var nowISO = new Date().toISOString();
      return {
        id: uid(),
        title: "Nota importata",
        body: String(text || "").trim(),
        color: "cream",
        favorite: false,
        position: 0,
        createdAt: nowISO,
        updatedAt: nowISO
      };
    }

    function normalizeNote(note, index){
      var n = note && typeof note === "object" ? note : {};
      var fallbackPosition = typeof index === "number" ? index : 0;
      return {
        id: n.id || uid(),
        title: String(n.title || "").trim(),
        body: String(n.body || n.text || "").trim(),
        color: normalizeNoteColor(n.color),
        favorite: !!n.favorite,
        position: Number.isFinite ? (Number.isFinite(n.position) ? n.position : fallbackPosition) : (isFinite(n.position) ? Number(n.position) : fallbackPosition),
        createdAt: n.createdAt || new Date().toISOString(),
        updatedAt: n.updatedAt || n.createdAt || new Date().toISOString()
      };
    }

    function normalizeNotesState(raw){
      var base = {
        items: [],
        currentId: null,
        draftTitle: "",
        draftBody: "",
        listOpen: true,
        editorOpen: false,
        favoritesOnly: false
      };

      if(typeof raw === "string"){
        var legacy = String(raw || "").trim();
        if(legacy){
          var imported = createImportedLegacyNote(legacy);
          base.items = [imported];
          base.currentId = imported.id;
          base.draftTitle = imported.title;
          base.draftBody = imported.body;
          base.listOpen = true;
          base.editorOpen = false;
        }
        return base;
      }

      if(Array.isArray(raw)) raw = { items: raw };
      if(!raw || typeof raw !== "object") return base;

      var items = Array.isArray(raw.items) ? raw.items.map(function(item, index){ return normalizeNote(item, index); }) : [];
      items.forEach(function(item, index){
        item.position = index;
      });

      var currentId = raw.currentId && items.some(function(item){ return item.id === raw.currentId; }) ? raw.currentId : null;
      var draftTitle = typeof raw.draftTitle === "string" ? raw.draftTitle : "";
      var draftBody = typeof raw.draftBody === "string" ? raw.draftBody : "";
      var listOpen = raw.listOpen !== false;
      var editorOpen = !!raw.editorOpen;
      var favoritesOnly = !!raw.favoritesOnly;

      if(currentId && !draftTitle && !draftBody){
        var current = items.find(function(item){ return item.id === currentId; }) || null;
        if(current){
          draftTitle = current.title || "";
          draftBody = current.body || "";
        }
      }

      return {
        items: items,
        currentId: currentId,
        draftTitle: draftTitle,
        draftBody: draftBody,
        listOpen: listOpen,
        editorOpen: editorOpen,
        favoritesOnly: favoritesOnly
      };
    }

    function normalizeLoadedState(obj){
      var next = obj && typeof obj === "object" ? obj : {};
      if(!next.events) next.events = {};
      Object.keys(next.events || {}).forEach(function(dateISO){
        next.events[dateISO] = (next.events[dateISO] || []).map(function(ev){
          return normalizeEvent(ev);
        });
      });
      if(!Array.isArray(next.todos)) next.todos = [];
      next.notes = normalizeNotesState(next.notes);
      if(!Array.isArray(next.contacts)) next.contacts = [];
      next.updatedAt = next.updatedAt || new Date().toISOString();
      return next;
    }

    function defaultState(){
      return {
        version:"v1-notes",
        updatedAt:new Date().toISOString(),
        events:{},
        todos:[],
        notes: normalizeNotesState(null),
        contacts:[]
      };
    }

    function loadState(){
      try{
        var raw = localStorage.getItem(STORAGE_KEY);
        if(!raw) return defaultState();
        var obj = JSON.parse(raw);
        if(!obj || typeof obj !== "object") return defaultState();
        return normalizeLoadedState(obj);
      }catch(e){
        return defaultState();
      }
    }

    var state = loadState();
    Object.keys(state.events || {}).forEach(function(dateISO){
      state.events[dateISO] = (state.events[dateISO] || []).map(function(ev){
        return normalizeEvent(ev);
      });
    });
    var currentMonth = 0;
    var currentYear = START_YEAR;
    var selectedISO = null;
    var saveTimer = null;
    var liveTodayISO = isoDate(getTodayDate());
    var todayViewOffset = 0;

    // --- Cloud sync (Netlify Identity + Functions + Blobs) ---
    var remoteSaveTimer = null;
    var remotePullTimer = null;
    var remoteSyncInFlight = false;
    var remotePollHandle = null;
    var remoteLastKnownUpdatedAt = null;
    var remoteLastCheckedAt = null;
    var remoteWriteLocked = false;
    var remoteLoginPrompted = false;
    var REMOTE_SYNC_DEBOUNCE_MS = 1200;
    var REMOTE_SYNC_POLL_MS = 10000;

    function isLoggedIn(){
      try{
        return !!(window.netlifyIdentity && window.netlifyIdentity.currentUser && window.netlifyIdentity.currentUser());
      }catch(e){
        return false;
      }
    }

    function formatCloudDateTime(value){
      if(!value) return "--";
      var d = value instanceof Date ? value : new Date(value);
      if(isNaN(d.getTime())) return "--";
      try{
        return new Intl.DateTimeFormat("it-IT", {
          day:"2-digit",
          month:"2-digit",
          year:"2-digit",
          hour:"2-digit",
          minute:"2-digit"
        }).format(d);
      }catch(e){
        return d.toLocaleString();
      }
    }

    function setCloudWriteLock(locked){
      remoteWriteLocked = !!locked;
      try{
        document.body.classList.toggle("cloudSyncLocked", remoteWriteLocked);
      }catch(e){}
    }

    function setCloudButtonState(kind){
      if(!btnCloudRefresh) return;
      var icon = "\u2601\uFE0F";
      if(kind === "syncing" || kind === "pending" || kind === "locked") icon = "\uD83D\uDD04";
      if(kind === "ok") icon = "\u2705";
      if(kind === "conflict" || kind === "error") icon = "\u26A0\uFE0F";
      var ico = btnCloudRefresh.querySelector(".ico");
      if(ico) ico.textContent = icon;
      btnCloudRefresh.setAttribute("data-cloud-state", kind || "idle");
      btnCloudRefresh.title = kind === "ok" ? "Cloud aggiornato: scarica di nuovo l'ultima versione" : "Scarica subito l'ultima versione dal cloud";
    }

    function setCloudStatus(kind, message){
      kind = kind || "idle";
      if(cloudSyncStatus){
        cloudSyncStatus.setAttribute("data-state", kind);
        if(message){
          cloudSyncStatus.textContent = message;
        }else if(!isLoggedIn()){
          cloudSyncStatus.textContent = "\u2601\uFE0F Cloud: non attivo";
        }else if(kind === "ok"){
          cloudSyncStatus.textContent = "☁️ Cloud aggiornato: " + formatCloudDateTime(remoteLastCheckedAt) + "\nUltima modifica: " + formatCloudDateTime(remoteLastKnownUpdatedAt || (state && state.updatedAt));
        }else if(kind === "syncing"){
          cloudSyncStatus.textContent = "\uD83D\uDD04 Cloud: aggiornamento in corso...";
        }else if(kind === "pending"){
          cloudSyncStatus.textContent = "\u2601\uFE0F Cloud: controllo necessario prima delle modifiche";
        }else if(kind === "locked"){
          cloudSyncStatus.textContent = "\uD83D\uDD04 Cloud: aggiorno i dati prima di permettere modifiche";
        }else if(kind === "conflict"){
          cloudSyncStatus.textContent = "\u26A0\uFE0F Cloud: modifiche piu recenti da un altro dispositivo";
        }else if(kind === "error"){
          cloudSyncStatus.textContent = "\u26A0\uFE0F Cloud: aggiornamento non riuscito";
        }else{
          cloudSyncStatus.textContent = "\u2601\uFE0F Cloud: non verificato";
        }
      }
      setCloudButtonState(kind);
    }

    async function getCloudAuthHeaders(forceFresh){
      try{
        if(window.AgendaAccount && typeof window.AgendaAccount.getAuthHeaders === "function"){
          return await window.AgendaAccount.getAuthHeaders(!!forceFresh);
        }
        var user = window.netlifyIdentity && window.netlifyIdentity.currentUser && window.netlifyIdentity.currentUser();
        if(user && typeof user.jwt === "function"){
          var token = await Promise.resolve(user.jwt(!!forceFresh));
          return token ? { Authorization: "Bearer " + token } : {};
        }
      }catch(e){
        console.warn("Token cloud non disponibile:", e);
      }
      return {};
    }

    async function fetchCloudWithAuth(url, options){
      options = options || {};
      var baseHeaders = options.headers || {};
      var authHeaders = await getCloudAuthHeaders(false);
      var firstOptions = Object.assign({}, options, {
        headers: Object.assign({}, baseHeaders, authHeaders)
      });
      var res = await fetch(url, firstOptions);

      if(res.status === 401){
        var freshHeaders = await getCloudAuthHeaders(true);
        if(freshHeaders && freshHeaders.Authorization){
          var retryOptions = Object.assign({}, options, {
            headers: Object.assign({}, baseHeaders, freshHeaders)
          });
          res = await fetch(url, retryOptions);
        }
      }

      return res;
    }

    function promptCloudLogin(message){
      if(remoteLoginPrompted) return;
      remoteLoginPrompted = true;
      try{
        if(window.AgendaAccount && typeof window.AgendaAccount.openQuickLogin === "function"){
          window.AgendaAccount.openQuickLogin(message || "La sessione cloud è scaduta. Accedi di nuovo per sincronizzare Agenda.", true);
        }
      }catch(e){}
    }

    async function loadRemoteEnvelope(){
      var res = await fetchCloudWithAuth("/api/agenda", {
        method:"GET",
        credentials:"same-origin",
        cache:"no-store"
      });
      if(res.status === 401) return { ok:false, unauthorized:true, data:null };
      if(!res.ok) throw new Error("Remote load failed");
      var obj = await res.json();
      return obj || { ok:true, data:null };
    }

    async function saveRemoteState(payload){
      var res = await fetchCloudWithAuth("/api/agenda", {
        method:"PUT",
        credentials:"same-origin",
        headers: { "content-type":"application/json" },
        body: JSON.stringify({
          state: payload,
          baseUpdatedAt: remoteLastKnownUpdatedAt || null
        })
      });

      var obj = null;
      try{ obj = await res.json(); }catch(e){ obj = null; }
      if(res.status === 401) return { ok:false, unauthorized:true };
      if(res.status === 409){
        var conflict = new Error((obj && (obj.message || obj.error)) || "Remote conflict");
        conflict.conflict = true;
        conflict.remoteUpdatedAt = obj && obj.remoteUpdatedAt;
        conflict.remoteData = obj && obj.data;
        throw conflict;
      }
      if(!res.ok) throw new Error((obj && (obj.message || obj.error)) || "Remote save failed");
      return obj || { ok:true };
    }

    function hasLocalData(s){
      try{
        var notesState = normalizeNotesState(s && s.notes);
        return !!(s && (
          Object.keys(s.events || {}).length ||
          (s.todos || []).length ||
          (s.contacts || []).length ||
          (notesState.items || []).length ||
          String(notesState.draftTitle || "").trim().length ||
          String(notesState.draftBody || "").trim().length
        ));
      }catch(e){ return false; }
    }

    function getStateUpdatedAt(s){
      var value = s && s.updatedAt ? Date.parse(s.updatedAt) : NaN;
      return isNaN(value) ? 0 : value;
    }

    function applyRemoteState(remote){
      if(!remote || typeof remote !== "object") return false;
      state = normalizeLoadedState(remote);
      remoteLastKnownUpdatedAt = state.updatedAt || remoteLastKnownUpdatedAt;
      try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
      syncNotesUiFromState();
      renderAll();
      updateStorageStatus(true);
      return true;
    }

    async function syncFromCloudOrSeed(forcePull, mandatory){
      if(!isLoggedIn()){
        setCloudWriteLock(false);
        setCloudStatus("idle", "\u2601\uFE0F Cloud: non attivo");
        return;
      }
      if(remoteSyncInFlight){
        if(mandatory) setCloudStatus("locked");
        return;
      }

      if(mandatory) setCloudWriteLock(true);
      remoteSyncInFlight = true;
      setCloudStatus(mandatory ? "locked" : "syncing");

      try{
        var envelope = await loadRemoteEnvelope();
        if(envelope && envelope.unauthorized){
          setCloudWriteLock(false);
          setCloudStatus("idle", "\u2601\uFE0F Cloud: accesso richiesto");
          promptCloudLogin("La sessione cloud è scaduta. Accedi di nuovo per sincronizzare Agenda.");
          return;
        }

        remoteLastCheckedAt = new Date().toISOString();
        var remote = envelope ? envelope.data : null;
        var localStamp = getStateUpdatedAt(state);
        var remoteStamp = getStateUpdatedAt(remote);

        if(remote && typeof remote === "object"){
          remoteLastKnownUpdatedAt = remote.updatedAt || null;
          if(forcePull || remoteStamp > localStamp){
            applyRemoteState(remote);
          }
          setCloudWriteLock(false);
          setCloudStatus("ok");
          return;
        }

        remoteLastKnownUpdatedAt = null;
        if(hasLocalData(state)){
          setCloudStatus("syncing", "\uD83D\uDD04 Cloud: primo salvataggio in corso...");
          scheduleRemoteSave(true, true);
        }else{
          setCloudStatus("ok");
        }
        setCloudWriteLock(false);
      }catch(e){
        console.warn("Sync cloud fallita:", e);
        if(mandatory){
          setCloudWriteLock(true);
          setCloudStatus("locked", "\u26A0\uFE0F Cloud non verificato: premi il pulsante cloud prima di modificare.");
        }else{
          setCloudStatus("error");
        }
      }finally{
        remoteSyncInFlight = false;
      }
    }

    function scheduleRemoteSave(immediate, allowWhileLocked){
      if(!isLoggedIn()) return;
      if(remoteWriteLocked && !allowWhileLocked){
        setCloudStatus("locked", "\uD83D\uDD04 Cloud: attendo l'aggiornamento iniziale prima di salvare.");
        return;
      }
      if(remoteSaveTimer) clearTimeout(remoteSaveTimer);
      remoteSaveTimer = setTimeout(function(){
        var payload = normalizeLoadedState(JSON.parse(JSON.stringify(state)));
        payload.updatedAt = new Date().toISOString();
        state.updatedAt = payload.updatedAt;
        setCloudStatus("syncing", "\uD83D\uDD04 Cloud: salvataggio in corso...");
        saveRemoteState(payload).then(function(result){
          if(result && result.unauthorized){
            setCloudStatus("idle", "\u2601\uFE0F Cloud: accesso richiesto");
            promptCloudLogin("La sessione cloud è scaduta. Accedi di nuovo per salvare nel cloud.");
            return;
          }
          var savedAt = (result && result.updatedAt) || payload.updatedAt;
          state.updatedAt = savedAt;
          remoteLastKnownUpdatedAt = savedAt;
          remoteLastCheckedAt = new Date().toISOString();
          try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
          updateStorageStatus(true);
          setCloudStatus("ok");
        }).catch(function(e){
          console.warn("Salvataggio cloud fallito:", e);
          if(e && e.conflict){
            if(e.remoteUpdatedAt) remoteLastKnownUpdatedAt = e.remoteUpdatedAt;
            setCloudStatus("conflict", "\u26A0\uFE0F Cloud piu recente su un altro dispositivo. Premi il pulsante cloud per aggiornare prima di salvare.");
            window.alert("Nel cloud ci sono modifiche piu recenti fatte da un altro dispositivo. Aggiorna dal pulsante cloud prima di continuare, cosi eviti di sovrascrivere dati nuovi.");
          }else{
            setCloudStatus("error");
          }
        });
      }, immediate ? 0 : REMOTE_SYNC_DEBOUNCE_MS);
    }

    function startRemotePolling(){
      stopRemotePolling();
      if(!isLoggedIn()) return;
      remotePollHandle = setInterval(function(){
        if(document.visibilityState === "visible" && !remoteSyncInFlight && !remoteWriteLocked){
          scheduleRemoteRefresh(false, false);
        }
      }, REMOTE_SYNC_POLL_MS);
    }

    function stopRemotePolling(){
      if(remotePollHandle){
        clearInterval(remotePollHandle);
        remotePollHandle = null;
      }
    }

    function scheduleRemoteRefresh(forcePull, mandatory){
      if(!isLoggedIn()) return;
      if(remotePullTimer) clearTimeout(remotePullTimer);
      remotePullTimer = setTimeout(function(){
        syncFromCloudOrSeed(!!forcePull, !!mandatory);
      }, mandatory ? 0 : 350);
    }

    function beginMandatoryCloudRefresh(){
      if(!isLoggedIn()){
        setCloudWriteLock(false);
        setCloudStatus("idle", "\u2601\uFE0F Cloud: non attivo");
        return;
      }
      setCloudWriteLock(true);
      setCloudStatus("locked");
      scheduleRemoteRefresh(true, true);
    }

    function handleManualCloudRefresh(){
      if(!isLoggedIn()){
        alert("Accedi prima al cloud di Agenda.");
        return;
      }
      beginMandatoryCloudRefresh();
    }
    // --- /Cloud sync ---

    // DOM
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
    var viewCalendar = $("#view-calendar");
    var viewNotebook = $("#view-notebook");
    var viewContacts = $("#view-contacts");
    var viewToday = $("#view-today");

    var calListGrid = $("#calListGrid");

    var monthTitle = $("#monthTitle");
    var prevMonth = $("#prevMonth");
    var nextMonth = $("#nextMonth");
    var jumpToday = $("#jumpToday");

    var storageStatus = $("#storageStatus");
    var cloudSyncStatus = $("#cloudSyncStatus");
    var btnCloudRefresh = $("#btnCloudRefresh");
    var agendaWeekCard = $("#agendaWeekCard");
    var todoMiniPanel = $("#todoMiniPanel");
    var toggleTodos = $("#toggleTodos");
    var openTodosBtn = $("#openTodosBtn");
    var todoActiveList = $("#todoActiveList");

    var agendaWeekCount = $("#agendaWeekCount");
    var agendaWeekList = $("#agendaWeekList");
    var btnExport = $("#btnExport");
    var importFile = $("#importFile");
    var btnReset = $("#btnReset");

    var todoSearch = $("#todoSearch");
    var todoFilter = $("#todoFilter");
    var todoText = $("#todoText");
    var todoPriority = $("#todoPriority");
    var todoTag = $("#todoTag");
    var addTodo = $("#addTodo");
    var todoTotalCount = $("#todoTotalCount");
    var todoList = $("#todoList");

    var quickNoteTitle = $("#quickNoteTitle");
    var quickNotes = $("#quickNotes");
    var btnSaveNote = $("#btnSaveNote");
    var btnNotesFavorites = $("#btnNotesFavorites");
    var btnOpenNoteEditor = $("#btnOpenNoteEditor");
    var notesListCard = $("#notesListCard");
    var notesEditorCard = $("#notesEditorCard");
    var notesList = $("#notesList");
    var notesCount = $("#notesCount");
    var notesEditorStatus = $("#notesEditorStatus");

    var todayPrevBtn = $("#todayPrevBtn");
    var todayNextBtn = $("#todayNextBtn");

    function getNotesState(){
      if(!state.notes || typeof state.notes !== "object") state.notes = normalizeNotesState(state.notes);
      return state.notes;
    }

    function getSortedNotes(){
      return getNotesState().items.slice().sort(function(a,b){
        if(!!a.favorite !== !!b.favorite) return a.favorite ? -1 : 1;
        if((a.position || 0) !== (b.position || 0)) return (a.position || 0) - (b.position || 0);
        return String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || ""));
      });
    }

    function getNoteById(id){
      return getNotesState().items.find(function(item){ return item.id === id; }) || null;
    }

    function getNextNotePosition(){
      var items = getNotesState().items;
      if(!items.length) return 0;
      return items.reduce(function(max, item){
        return Math.max(max, typeof item.position === "number" ? item.position : 0);
      }, 0) + 1;
    }

    function syncNotesUiFromState(){
      var notesState = getNotesState();
      if(quickNoteTitle) quickNoteTitle.value = notesState.draftTitle || "";
      if(quickNotes) quickNotes.value = notesState.draftBody || "";
      if(typeof setCollapsed === "function"){
        if(notesListCard) setCollapsed(notesListCard, !notesState.listOpen);
        if(notesEditorCard) setCollapsed(notesEditorCard, !notesState.editorOpen);
      }
      if(btnNotesFavorites){
        btnNotesFavorites.classList.toggle("isActive", !!notesState.favoritesOnly);
        btnNotesFavorites.setAttribute("aria-pressed", notesState.favoritesOnly ? "true" : "false");
      }
    }

    function updateNotesEditorStatus(){
      if(!notesEditorStatus) return;
      var current = getNoteById(getNotesState().currentId);
      if(current){
        notesEditorStatus.textContent = "Modifica: " + (current.title || "Nota senza titolo");
      }else{
        notesEditorStatus.textContent = "Nuova nota";
      }
    }

    function buildNotePreview(note){
      var body = String((note && note.body) || "").trim();
      if(!body) return "Nota vuota.";
      if(body.length > 140) return body.slice(0, 139) + "…";
      return body;
    }

    function renderNotes(){
      if(!notesList) return;

      syncNotesUiFromState();
      updateNotesEditorStatus();

      var notesState = getNotesState();
      var allItems = getSortedNotes();
      var items = notesState.favoritesOnly ? allItems.filter(function(note){ return !!note.favorite; }) : allItems;

      if(notesCount){
        if(!allItems.length){
          notesCount.textContent = "Nessuna nota";
        }else if(notesState.favoritesOnly){
          notesCount.textContent = items.length ? (items.length === 1 ? "1 preferita" : items.length + " preferite") : "Nessuna preferita";
        }else{
          notesCount.textContent = allItems.length === 1 ? "1 nota" : allItems.length + " note";
        }
      }
      notesList.innerHTML = "";

      if(!notesState.listOpen) return;

      if(!items.length){
        var empty = document.createElement("div");
        empty.className = "emptyState";
        empty.textContent = notesState.favoritesOnly ? "Nessuna nota preferita." : "Nessuna nota salvata.";
        notesList.appendChild(empty);
        return;
      }

      items.forEach(function(note, index){
        var item = document.createElement("div");
        item.className = "item noteItem noteColor--" + normalizeNoteColor(note.color) + (notesState.currentId === note.id ? " active" : "");
        item.setAttribute("role", "button");
        item.tabIndex = 0;
        item.title = "Apri nota";

        function openNote(){
          notesState.currentId = note.id;
          notesState.draftTitle = note.title || "";
          notesState.draftBody = note.body || "";
          notesState.editorOpen = true;
          notesState.listOpen = true;
          syncNotesUiFromState();
          updateNotesEditorStatus();
          renderNotes();
          try{ quickNoteTitle.focus(); }catch(e){}
        }

        item.addEventListener("click", function(e){
          if(e.target && e.target.closest && e.target.closest(".noteItemActions")) return;
          openNote();
        });
        item.addEventListener("keydown", function(e){
          if(e.key === "Enter" || e.key === " "){
            e.preventDefault();
            openNote();
          }
        });

        var main = document.createElement("div");
        main.className = "noteItemMain";

        var head = document.createElement("div");
        head.className = "noteItemHead";

        var title = document.createElement("div");
        title.className = "noteItemTitle";

        var titleText = document.createElement("span");
        titleText.textContent = note.title || "Nota senza titolo";
        title.appendChild(titleText);

        var actions = document.createElement("div");
        actions.className = "noteItemActions";

        function makeBtn(text, titleText, onClick, extraClass, disabled){
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "smallBtn noteActionBtn" + (extraClass ? " " + extraClass : "");
          btn.textContent = text;
          btn.title = titleText;
          btn.setAttribute("aria-label", titleText);
          if(disabled){
            btn.disabled = true;
            btn.classList.add("isDisabled");
          }
          btn.addEventListener("click", function(e){
            e.stopPropagation();
            if(disabled) return;
            onClick();
          });
          return btn;
        }

        var prev = items[index - 1] || null;
        var next = items[index + 1] || null;
        var canMoveUp = !!(prev && !!prev.favorite === !!note.favorite);
        var canMoveDown = !!(next && !!next.favorite === !!note.favorite);

        actions.appendChild(makeBtn(note.favorite ? "★" : "☆", note.favorite ? "Togli dai preferiti" : "Aggiungi ai preferiti", function(){
          note.favorite = !note.favorite;
          note.updatedAt = new Date().toISOString();
          touchAndSave();
          renderNotes();
        }, note.favorite ? "isActive" : ""));

        actions.appendChild(makeBtn("◉", "Cambia colore: " + noteColorLabel(note.color), function(){
          var currentIndex = NOTE_COLOR_ORDER.indexOf(normalizeNoteColor(note.color));
          note.color = NOTE_COLOR_ORDER[(currentIndex + 1) % NOTE_COLOR_ORDER.length];
          note.updatedAt = new Date().toISOString();
          touchAndSave();
          renderNotes();
        }));

        actions.appendChild(makeBtn("↑", "Sposta su", function(){
          moveNote(note.id, -1);
        }, "", !canMoveUp));

        actions.appendChild(makeBtn("↓", "Sposta giù", function(){
          moveNote(note.id, 1);
        }, "", !canMoveDown));

        actions.appendChild(makeBtn("✕", "Elimina nota", function(){
          deleteNote(note.id);
        }, "danger"));

        head.appendChild(title);
        head.appendChild(actions);

        var preview = document.createElement("div");
        preview.className = "noteItemPreview";
        preview.textContent = buildNotePreview(note);

        main.appendChild(head);
        main.appendChild(preview);

        item.appendChild(main);
        notesList.appendChild(item);
      });
    }

    function moveNote(id, direction){
      var items = getSortedNotes();
      var index = items.findIndex(function(item){ return item.id === id; });
      if(index < 0) return;
      var targetIndex = index + direction;
      if(targetIndex < 0 || targetIndex >= items.length) return;

      var current = items[index];
      var target = items[targetIndex];
      if(!!current.favorite !== !!target.favorite) return;

      var currentPosition = current.position || 0;
      current.position = target.position || 0;
      target.position = currentPosition;
      current.updatedAt = new Date().toISOString();
      target.updatedAt = new Date().toISOString();

      touchAndSave();
      renderNotes();
    }

    function deleteNote(id){
      var note = getNoteById(id);
      if(!note) return;
      if(!window.confirm('Vuoi eliminare "' + (note.title || "questa nota") + '"?')) return;

      var notesState = getNotesState();
      notesState.items = notesState.items.filter(function(item){ return item.id !== id; });

      if(notesState.currentId === id){
        notesState.currentId = null;
        notesState.draftTitle = "";
        notesState.draftBody = "";
      }

      notesState.items.forEach(function(item, index){
        item.position = index;
      });

      touchAndSave();
      renderNotes();
    }

    function saveCurrentNote(){
      var notesState = getNotesState();
      var title = String((quickNoteTitle && quickNoteTitle.value) || "").trim();
      var body = String((quickNotes && quickNotes.value) || "").trim();

      if(!title){
        if(quickNoteTitle) quickNoteTitle.focus();
        return;
      }

      var current = getNoteById(notesState.currentId);
      if(current){
        current.title = title;
        current.body = body;
        current.updatedAt = new Date().toISOString();
      }else{
        var nowISO = new Date().toISOString();
        current = normalizeNote({
          id: uid(),
          title: title,
          body: body,
          color: "cream",
          favorite: false,
          position: getNextNotePosition(),
          createdAt: nowISO,
          updatedAt: nowISO
        }, getNextNotePosition());
        notesState.items.push(current);
        notesState.currentId = current.id;
      }

      notesState.draftTitle = current.title;
      notesState.draftBody = current.body;
      notesState.listOpen = true;
      notesState.editorOpen = false;

      touchAndSave();
      renderNotes();
    }

    function startNewNote(){
      var notesState = getNotesState();
      notesState.currentId = null;
      notesState.draftTitle = "";
      notesState.draftBody = "";
      notesState.editorOpen = true;
      notesState.listOpen = true;
      syncNotesUiFromState();
      updateNotesEditorStatus();
      renderNotes();
      try{ quickNoteTitle.focus(); }catch(e){}
      touchAndSave();
    }

    function toggleNotesList(){
      var notesState = getNotesState();
      notesState.listOpen = !notesState.listOpen;
      syncNotesUiFromState();
      renderNotes();
      touchAndSave();
    }

    function toggleNotesFavorites(){
      var notesState = getNotesState();
      notesState.favoritesOnly = !notesState.favoritesOnly;
      notesState.listOpen = true;
      syncNotesUiFromState();
      renderNotes();
      touchAndSave();
    }

    function openNotesEditorFromList(ev){
      if(ev){
        ev.preventDefault();
        ev.stopPropagation();
      }
      startNewNote();
    }

    // Contacts
    var contactSearch = $("#contactSearch");
    var contactCategoryFilter = $("#contactCategoryFilter");
    var openContactBtn = $("#openContactBtn");
    var contactList = $("#contactList");
    var contactsMeta = $("#contactsMeta");

    var contactOverlay = $("#contactOverlay");
    var contactModalTitle = $("#contactModalTitle");
    var closeContactBtn = $("#closeContactBtn");
    var saveContactBtn = $("#saveContactBtn");
    var contactName = $("#contactName");
    var contactPhone = $("#contactPhone");
    var contactEmail = $("#contactEmail");
    var contactCategory = $("#contactCategory");
    var contactNotes = $("#contactNotes");

    var editingContactId = null;
    var expandedContactId = null;

    // Day modal
    var overlay = $("#dayOverlay");
    var dayTitle = $("#dayTitle");
    var dayEventsList = $("#dayEventsList");
    var btnCloseDay = $("#btnCloseDay");
    var btnPrintDay = $("#btnPrintDay");

    var evTime = $("#evTime");
    var evTitle = $("#evTitle");
    var evNotes = $("#evNotes");
    var evCat = $("#evCat");
    var evAlarmEnabled = $("#evAlarmEnabled");
    var evAlarmOffset = $("#evAlarmOffset");
    var btnEnableAlarmAudio = $("#btnEnableAlarmAudio");
    var alarmStatus = $("#alarmStatus");
    var alarmOverlay = $("#alarmOverlay");
    var alarmTitle = $("#alarmTitle");
    var alarmMeta = $("#alarmMeta");
    var alarmNotes = $("#alarmNotes");
    var alarmAudioHint = $("#alarmAudioHint");
    var btnAlarmStop = $("#btnAlarmStop");
    var btnAlarmSnooze = $("#btnAlarmSnooze");
    var btnAddEvent = $("#btnAddEvent");
    var btnCancelEventEdit = $("#btnCancelEventEdit");
    var addEventTitle = $("#addEventTitle");
    var editingEventId = null;
    var alarmAudio = null;
    var activeAlarmInfo = null;
    var alarmCheckHandle = null;

var addEventCard = document.getElementById("addEventCard");
var eventsCard   = document.getElementById("eventsCard");
var todoAddCard  = document.getElementById("todoAddCard");
var todoListCard = document.getElementById("todoListCard");

function setCollapsed(card, collapsed){
  if(!card) return;
  card.classList.toggle("collapsed", collapsed);
  var header = card.querySelector(".collapsibleHeader");
  if(header) header.setAttribute("aria-expanded", collapsed ? "false" : "true");
}

function wireCollapse(card){
  if(!card) return;
  var header = card.querySelector(".collapsibleHeader");
  if(!header) return;

  function toggle(){
    var isCollapsed = card.classList.contains("collapsed");
    setCollapsed(card, !isCollapsed);
    var isNowOpen = !card.classList.contains("collapsed");

    if(card.id === "notesListCard"){
  var notesState = getNotesState();
  notesState.listOpen = isNowOpen;
  renderNotes();
  touchAndSave();
}

    if(card.id === "notesEditorCard"){
      var editorState = getNotesState();
      editorState.editorOpen = isNowOpen;
      touchAndSave();
    }

    // Se sto aprendo "Aggiungi evento", metto il focus sul titolo
    if(card.id === "addEventCard" && isCollapsed){
      setTimeout(function(){
        try{ evTitle.focus(); }catch(e){}
      }, 60);
    }

    if(card.id === "todoAddCard" && isCollapsed){
      setTimeout(function(){
        try{ todoText.focus(); }catch(e){}
      }, 60);
    }

    if(card.id === "todoListCard" && isCollapsed){
      setTimeout(function(){
        try{ todoSearch.focus(); }catch(e){}
      }, 60);
    }

    if(card.id === "notesEditorCard" && isCollapsed){
      setTimeout(function(){
        try{ quickNoteTitle.focus(); }catch(e){}
      }, 60);
    }
  }

  header.addEventListener("click", function(e){
  if(e.target && e.target.closest && e.target.closest("button")) return;
  toggle();
  });
  
  header.addEventListener("keydown", function(e){
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      toggle();
    }
  });
}

function syncAlarmFormState(){
  if(!evAlarmEnabled || !evAlarmOffset) return;
  evAlarmOffset.disabled = !evAlarmEnabled.checked;
  if(alarmStatus){
    alarmStatus.textContent = evAlarmEnabled.checked
      ? "La sveglia userà il file sound/alarm.mp3."
      : "Sveglia disattivata per questo evento.";
  }
}

function buildAlarmFromForm(dateISO, eventId){
  if(!evAlarmEnabled || !evAlarmEnabled.checked){
    return normalizeEventAlarm(null);
  }

  if(!evTime || !evTime.value){
    window.alert("Per usare la sveglia devi impostare un orario per l'evento.");
    try{ evTime.focus(); }catch(e){}
    return null;
  }

  var offsetMinutes = normalizeAlarmOffset(evAlarmOffset ? evAlarmOffset.value : 0);
  var alarm = {
    enabled: true,
    offsetMinutes: offsetMinutes,
    snoozeUntil: "",
    lastFiredKey: ""
  };

  var fireAt = getEventAlarmFireDate(dateISO, evTime.value, offsetMinutes);
  if(fireAt && fireAt.getTime() <= Date.now() - 60000){
    alarm.lastFiredKey = getEventAlarmFireKey(dateISO, eventId, offsetMinutes);
  }

  return alarm;
}

function resetEventForm(){
  editingEventId = null;
  if(addEventTitle) addEventTitle.textContent = "Aggiungi evento";
  if(btnAddEvent) btnAddEvent.textContent = "Aggiungi";
  if(btnCancelEventEdit) btnCancelEventEdit.hidden = true;
  if(evTime) evTime.value = "";
  if(evTitle) evTitle.value = "";
  if(evNotes) evNotes.value = "";
  if(evCat) evCat.value = "other";
  if(evAlarmEnabled) evAlarmEnabled.checked = false;
  if(evAlarmOffset) evAlarmOffset.value = "0";
  syncAlarmFormState();
}

function startEventEdit(ev){
  if(!ev) return;
  editingEventId = ev.id || null;
  if(addEventTitle) addEventTitle.textContent = "Modifica evento";
  if(btnAddEvent) btnAddEvent.textContent = "Salva modifiche";
  if(btnCancelEventEdit) btnCancelEventEdit.hidden = false;
  if(evTime) evTime.value = ev.time || "";
  if(evTitle) evTitle.value = ev.title || "";
  if(evNotes) evNotes.value = ev.notes || "";
  if(evCat) evCat.value = normalizeEventCategory(ev.cat);
  var alarm = normalizeEventAlarm(ev.alarm);
  if(evAlarmEnabled) evAlarmEnabled.checked = !!alarm.enabled;
  if(evAlarmOffset) evAlarmOffset.value = String(normalizeAlarmOffset(alarm.offsetMinutes));
  syncAlarmFormState();

  setCollapsed(addEventCard, false);
  setCollapsed(eventsCard, false);

  setTimeout(function(){
    try{ evTitle.focus(); }catch(e){}
  }, 30);
}

function cancelEventEdit(){
  resetEventForm();
  setCollapsed(addEventCard, true);
  setCollapsed(eventsCard, false);
}

function handleEventSubmit(){
  if(editingEventId) updateEvent();
  else addEvent();
}

function iconSvg(name){
  if(name === "edit") return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>';
  if(name === "trash") return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';
  return "";
}

wireCollapse(addEventCard);
wireCollapse(eventsCard);
wireCollapse(agendaWeekCard);
wireCollapse(todoAddCard);
wireCollapse(todoListCard);
wireCollapse(notesListCard);
wireCollapse(notesEditorCard);
resetEventForm();
    function setView(view){
      tabs.forEach(function(t){ t.classList.toggle("active", t.getAttribute("data-view") === view); });
      if(viewCalendar) viewCalendar.classList.toggle("hidden", view !== "calendar");
      if(viewNotebook) viewNotebook.classList.toggle("hidden", view !== "notebook");
      if(viewContacts) viewContacts.classList.toggle("hidden", view !== "contacts");
      if(viewToday) viewToday.classList.toggle("hidden", view !== "today");

      if(view === "calendar") renderSummary();
      if(view === "notebook"){
        renderTodos();
        renderNotes();
      }
      if(view === "contacts") renderContacts();
      if(view === "today") renderTodayPanel();
    }

    function getInitialAgendaRoute(){
      var route = { view: "calendar", panel: "" };
      try{
        var params = new URLSearchParams(window.location.search || "");
        var view = String(params.get("view") || params.get("tab") || "calendar").toLowerCase();
        var panel = String(params.get("panel") || params.get("open") || "").toLowerCase();
        var allowedViews = ["calendar", "notebook", "contacts", "today"];
        if(allowedViews.indexOf(view) !== -1) route.view = view;
        route.panel = panel;
        if((window.location.hash || "").toLowerCase() === "#agenda-week") route.panel = "week";
      }catch(e){}
      return route;
    }

    function scrollToAgendaWeekPanel(){
      if(!agendaWeekCard) return;
      setCollapsed(agendaWeekCard, false);
      setTimeout(function(){
        try{
          agendaWeekCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }catch(e){
          try{ window.scrollTo(0, 0); }catch(ignore){}
        }
      }, 120);
    }

    function applyInitialAgendaRoute(){
      var route = getInitialAgendaRoute();
      setView(route.view);
      if(route.view === "calendar" && (route.panel === "week" || route.panel === "agenda-week" || route.panel === "prossimi-7-giorni")){
        scrollToAgendaWeekPanel();
      }
    }

function getTodayViewDate(){
  var base = getTodayDate();
  base.setDate(base.getDate() + todayViewOffset);
  return base;
}

function renderTodayPanel(){
  if(window.renderTodayView) window.renderTodayView(getTodayViewDate(), { offset: todayViewOffset });
}

function openNotebookToAddTodo(){
  setView("notebook");
  if(todoAddCard) setCollapsed(todoAddCard, false);
  setTimeout(function(){
    try{
      todoText.scrollIntoView({ behavior:"smooth", block:"center" });
      todoText.focus();
    }catch(e){}
  }, 50);
}


function getContactExcerpt(contact){
  var raw = String((contact && contact.notes) || "").trim();
  if(!raw) raw = String((contact && contact.phone) || (contact && contact.email) || "").trim();
  if(!raw) raw = "Nessun dettaglio aggiunto.";
  if(raw.length > 88) raw = raw.slice(0, 87) + "…";
  return raw;
}

function filteredContacts(){
  var q = String((contactSearch && contactSearch.value) || "").trim().toLowerCase();
  var cat = String((contactCategoryFilter && contactCategoryFilter.value) || "all");
  var items = (state.contacts || []).map(normalizeContact);

  if(q){
    items = items.filter(function(contact){
      return [contact.name, contact.phone, contact.email, contact.notes].some(function(value){
        return String(value || "").toLowerCase().indexOf(q) !== -1;
      });
    });
  }

  if(cat !== "all") items = items.filter(function(contact){ return contact.category === cat; });

  items.sort(function(a,b){
    return (a.name || "").localeCompare((b.name || ""), "it", { sensitivity:"base" });
  });

  return items;
}

function openContactModal(contactId){
  if(!contactOverlay) return;

  var contact = null;
  if(contactId){
    contact = (state.contacts || []).find(function(item){ return item.id === contactId; }) || null;
  }

  editingContactId = contact ? contact.id : null;
  contactModalTitle.textContent = contact ? "Modifica contatto" : "Aggiungi contatto";
  saveContactBtn.textContent = contact ? "Salva modifiche" : "Salva";

  contactName.value = contact ? (contact.name || "") : "";
  contactPhone.value = contact ? (contact.phone || "") : "";
  contactEmail.value = contact ? (contact.email || "") : "";
  contactCategory.value = contact ? normalizeContactCategory(contact.category) : "altro";
  contactNotes.value = contact ? (contact.notes || "") : "";

  contactOverlay.style.display = "flex";
  contactOverlay.setAttribute("aria-hidden", "false");

  setTimeout(function(){
    try{ contactName.focus(); }catch(e){}
  }, 30);
}

function closeContactModal(){
  if(!contactOverlay) return;
  contactOverlay.style.display = "none";
  contactOverlay.setAttribute("aria-hidden", "true");
  editingContactId = null;
}

function saveContact(){
  if(!contactName) return;

  var payload = normalizeContact({
    id: editingContactId || uid(),
    name: contactName.value,
    phone: contactPhone.value,
    email: contactEmail.value,
    category: contactCategory.value,
    notes: contactNotes.value
  });

  if(!payload.name){
    contactName.focus();
    return;
  }

  if(!Array.isArray(state.contacts)) state.contacts = [];

  var existingIndex = state.contacts.findIndex(function(item){ return item.id === payload.id; });
  if(existingIndex >= 0) state.contacts[existingIndex] = payload;
  else state.contacts.unshift(payload);

  expandedContactId = payload.id;
  touchAndSave();
  closeContactModal();
  renderContacts();
  setView("contacts");
}

function deleteContact(id){
  var contact = (state.contacts || []).find(function(item){ return item.id === id; });
  if(!contact) return;

  if(!window.confirm('Vuoi eliminare "' + (contact.name || 'questo contatto') + '"?')) return;

  state.contacts = (state.contacts || []).filter(function(item){ return item.id !== id; });
  if(expandedContactId === id) expandedContactId = null;
  touchAndSave();
  renderContacts();
}

function renderContacts(){
  if(!contactList || !contactsMeta) return;

  var total = (state.contacts || []).length;
  var items = filteredContacts();
  contactList.innerHTML = "";

  if(total === 0){
    contactsMeta.textContent = "Nessun contatto salvato.";
    var emptyState = document.createElement("div");
    emptyState.className = "emptyState";
    emptyState.innerHTML = '<div>Nessun contatto salvato.</div><div style="margin-top:6px">Tocca “Aggiungi nuovo” per creare il primo contatto.</div>';
    contactList.appendChild(emptyState);
    return;
  }

  contactsMeta.textContent = items.length + " visibili · " + total + " totali";

  if(items.length === 0){
    var noMatch = document.createElement("div");
    noMatch.className = "emptyState";
    noMatch.textContent = "Nessun contatto corrisponde ai filtri attivi.";
    contactList.appendChild(noMatch);
    return;
  }

  items.forEach(function(contact){
    var item = document.createElement("div");
    item.className = "item contactItem" + (expandedContactId === contact.id ? " expanded" : "");
    item.setAttribute("role", "button");
    item.tabIndex = 0;
    item.title = expandedContactId === contact.id ? "Chiudi dettagli" : "Apri dettagli";

    function toggle(){
      expandedContactId = expandedContactId === contact.id ? null : contact.id;
      renderContacts();
    }

    item.addEventListener("click", toggle);
    item.addEventListener("keydown", function(e){
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        toggle();
      }
    });

    var body = document.createElement("div");
    body.className = "itemText";

    var head = document.createElement("div");
    head.className = "contactHead";

    var left = document.createElement("div");
    left.style.minWidth = "0";

    var name = document.createElement("div");
    name.className = "contactName";
    name.textContent = contact.name || "Senza nome";

    var excerpt = document.createElement("div");
    excerpt.className = "contactExcerpt";
    excerpt.textContent = getContactExcerpt(contact);

    left.appendChild(name);
    left.appendChild(excerpt);

    var badge = document.createElement("span");
    badge.className = "badge contactCategory";
    badge.textContent = contactCategoryLabel(contact.category);

    head.appendChild(left);
    head.appendChild(badge);
    body.appendChild(head);

    var details = document.createElement("div");
    details.className = "contactDetails";

    function appendDetail(label, valueNode){
      var row = document.createElement("div");
      row.className = "contactDetailRow";
      var lab = document.createElement("div");
      lab.className = "contactDetailLabel";
      lab.textContent = label;
      var val = document.createElement("div");
      val.className = "contactDetailValue";
      if(typeof valueNode === "string") val.textContent = valueNode;
      else if(valueNode) val.appendChild(valueNode);
      row.appendChild(lab);
      row.appendChild(val);
      details.appendChild(row);
    }

    if(contact.phone){
      var phoneLink = document.createElement("a");
      phoneLink.href = "tel:" + contact.phone.replace(/\s+/g, "");
      phoneLink.textContent = contact.phone;
      phoneLink.addEventListener("click", function(e){ e.stopPropagation(); });
      appendDetail("Telefono", phoneLink);
    }

    if(contact.email){
      var emailLink = document.createElement("a");
      emailLink.href = "mailto:" + contact.email;
      emailLink.textContent = contact.email;
      emailLink.addEventListener("click", function(e){ e.stopPropagation(); });
      appendDetail("Email", emailLink);
    }

    if(contact.notes){
      appendDetail("Note", contact.notes);
    }

    if(!contact.phone && !contact.email && !contact.notes){
      appendDetail("Dettagli", "Nessun dettaglio aggiunto.");
    }

    var actions = document.createElement("div");
    actions.className = "contactActions";

    if(contact.phone){
      var callBtn = document.createElement("a");
      callBtn.className = "smallBtn actionBtnLink";
      callBtn.href = "tel:" + contact.phone.replace(/\s+/g, "");
      callBtn.textContent = "Chiama";
      callBtn.addEventListener("click", function(e){ e.stopPropagation(); });
      actions.appendChild(callBtn);
    }

    if(contact.email){
      var mailBtn = document.createElement("a");
      mailBtn.className = "smallBtn actionBtnLink";
      mailBtn.href = "mailto:" + contact.email;
      mailBtn.textContent = "Email";
      mailBtn.addEventListener("click", function(e){ e.stopPropagation(); });
      actions.appendChild(mailBtn);
    }

    var editBtn = document.createElement("button");
    editBtn.className = "smallBtn";
    editBtn.type = "button";
    editBtn.textContent = "Modifica";
    editBtn.addEventListener("click", function(e){
      e.stopPropagation();
      openContactModal(contact.id);
    });
    actions.appendChild(editBtn);

    var delBtn = document.createElement("button");
    delBtn.className = "smallBtn danger";
    delBtn.type = "button";
    delBtn.textContent = "Elimina";
    delBtn.addEventListener("click", function(e){
      e.stopPropagation();
      deleteContact(contact.id);
    });
    actions.appendChild(delBtn);

    details.appendChild(actions);
    body.appendChild(details);
    item.appendChild(body);
    contactList.appendChild(item);
  });
}

function syncTodoMiniPanelAria(){
  if(!toggleTodos || !todoMiniPanel) return;
  toggleTodos.setAttribute("aria-expanded", String(!todoMiniPanel.classList.contains("collapsed")));
}

function toggleTodoMiniPanel(){
  if(!todoMiniPanel) return;
  todoMiniPanel.classList.toggle("collapsed");
  syncTodoMiniPanelAria();
}

if(toggleTodos){
  toggleTodos.addEventListener("click", toggleTodoMiniPanel);
  toggleTodos.addEventListener("keydown", function(e){
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      toggleTodoMiniPanel();
    }
  });
}

if(openTodosBtn){
  openTodosBtn.addEventListener("click", function(e){
    e.stopPropagation();
    openNotebookToAddTodo();
  });
}


    function touchAndSave(){
      if(isLoggedIn() && remoteWriteLocked){
        setCloudStatus("locked", "🔄 Cloud: attendo l'aggiornamento iniziale prima di salvare.");
        window.alert("Agenda sta aggiornando il cloud. Aspetta che compaia 'Cloud aggiornato', poi modifica di nuovo.");
        return;
      }
      state.updatedAt = new Date().toISOString();
      if(saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function(){
        try{
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          updateStorageStatus(true);
          // se loggato, salva anche online (debounce separato)
          if(isLoggedIn()) scheduleRemoteSave();
        }catch(e){
          updateStorageStatus(false);
        }
      }, 120);
    }

    function updateStorageStatus(ok){
      if(!storageStatus) return;
      try{
        var raw = localStorage.getItem(STORAGE_KEY) || "";
        var size = raw.length;
        storageStatus.textContent = (ok !== false ? "ok" : "errore") + " · " + Math.round(size/1024) + " KB";
      }catch(e){
        storageStatus.textContent = "errore storage";
      }
    }

    function renderCalendar(){
      monthTitle.textContent = MONTHS_IT[currentMonth] + " " + currentYear;

      // Layout stile screenshot: righe = giorni settimana, colonne = settimane del mese
      calListGrid.innerHTML = "";

      var first = new Date(currentYear, currentMonth, 1, 12);
      var last = new Date(currentYear, currentMonth+1, 0, 12);
      var daysInMonth = last.getDate();

      // JS getDay: 0 Sun..6 Sat -> Monday-based 0..6 (Mon..Sun)
      var firstDowMon0 = (first.getDay() + 6) % 7;

      // quante "colonne settimana" servono (4/5/6 a seconda del mese)
      var weeksCount = Math.ceil((firstDowMon0 + daysInMonth) / 7);

      // Imposta griglia: 1 colonna etichette + settimane
      // (Larghezza fissa per i nomi dei giorni, poi colonne elastiche)
      calListGrid.style.gridTemplateColumns = "max-content repeat(" + weeksCount + ", 1fr)";


      // Matrice [7][weeksCount] con gli ISO date
      var matrix = [];
      for (var r=0; r<7; r++){
        matrix[r] = new Array(weeksCount).fill("");
      }

      for (var dayIndex=1; dayIndex<=daysInMonth; dayIndex++){
        var offset = firstDowMon0 + (dayIndex - 1);
        var row = offset % 7; // 0..6
        var col = Math.floor(offset / 7); // 0..weeksCount-1
        var d = new Date(currentYear, currentMonth, dayIndex, 12);
        matrix[row][col] = isoDate(d);
      }

      var now = new Date();
      var todayISO = isoDate(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0));

      // Nomi lunghi per la colonna sinistra
      var DOW_FULL = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];

      for (var r2=0; r2<7; r2++){
        // Etichetta giorno
        var lab = document.createElement("div");
        lab.className = "wlabel";
        lab.textContent = DOW_FULL[r2];
        calListGrid.appendChild(lab);

        // Celle settimane
        for (var c2=0; c2<weeksCount; c2++){
          var iso = matrix[r2][c2];

          if (!iso){
            var empty = document.createElement("div");
            empty.className = "cellEmpty";
            calListGrid.appendChild(empty);
            continue;
          }

          var el = document.createElement("div");
          el.className = "day";

          var dayNum = parseISO(iso).getDate();
          el.innerHTML = '<div class="dayNum">'+dayNum+'</div>';

          if (todayISO && iso === todayISO){
            var b = document.createElement("div");
            b.className = "today";
            b.textContent = "oggi";
            el.appendChild(b);
          }

          var list = sortedEventsFor(iso);
          var evCount = list.length;
          if (evCount > 0){
            var prev = document.createElement("div");
            prev.className = "evPreview";

            var maxLines = 2;
            var maxChars = 18;

            for (var i=0; i<Math.min(maxLines, evCount); i++){
              var line = document.createElement("div");
              var ckey = normalizeEventCategory(list[i].cat);
              line.className = "evLine cat-" + ckey;
              var txt = (list[i].title || "");
              if (txt.length > maxChars) txt = txt.slice(0, maxChars-1) + "…";
              line.textContent = (eventHasAlarm(list[i]) ? "🔔 " : "") + txt;
              prev.appendChild(line);
            }

            if (evCount > maxLines){
              var more = document.createElement("div");
              more.className = "evMore";
              more.textContent = "+" + (evCount - maxLines);
              prev.appendChild(more);
            }

            el.appendChild(prev);
          }

          (function(dateISO){
            el.addEventListener("click", function(){ openDay(dateISO); });
          })(iso);

          calListGrid.appendChild(el);
        }
      }
    }

    function sortedEventsFor(dateISO){
      var arr = (state.events[dateISO] || []).slice();
      arr.sort(function(a,b){
        var at = a.time || "";
        var bt = b.time || "";
        if(at !== bt) return at.localeCompare(bt);
        return String(a.createdAt||"").localeCompare(String(b.createdAt||""));
      });
      return arr;
    }

    function openDay(dateISO){
      selectedISO = dateISO;
      var d = parseISO(dateISO);
      var title = DOW_IT[(d.getDay()+6)%7] + " " + d.getDate() + " " + MONTHS_IT[d.getMonth()] + " " + d.getFullYear();
      dayTitle.textContent = title;

      resetEventForm();

setCollapsed(addEventCard, true);   // Aggiungi evento chiuso
setCollapsed(eventsCard, false);    // Eventi aperto


      renderDayEvents();
      overlay.style.display = "flex";
      overlay.setAttribute("aria-hidden","false");
setTimeout(function(){ try{ btnCloseDay.focus(); }catch(e){} }, 30);
    }

    function closeDay(){
      overlay.style.display = "none";
      overlay.setAttribute("aria-hidden","true");
      selectedISO = null;
      resetEventForm();
    }

    function renderDayEvents(){
      var iso = selectedISO;
      if(!iso) return;

      var events = sortedEventsFor(iso);
      dayEventsList.innerHTML = "";

      if(events.length === 0){
        var empty = document.createElement("div");
        empty.className = "hint";
        empty.textContent = "Nessun evento per questo giorno.";
        dayEventsList.appendChild(empty);
        return;
      }

      events.forEach(function(ev){
        var item = document.createElement("div");
        item.className = "item";

        var left = document.createElement("div");
        left.className = "itemMain";

        var text = document.createElement("div");
        text.className = "itemText";

        var t = document.createElement("div");
        t.className = "t";
        t.textContent = (ev.time ? ev.time + " · " : "") + (ev.title || "");

        var catKey = normalizeEventCategory(ev.cat);
        var catLabel = eventCategoryLabel(catKey);
        var badge = document.createElement("span");
        badge.className = "badge cat " + catKey;
        badge.textContent = catLabel;
        badge.style.marginRight = "8px";
        t.prepend(badge);

        if(eventHasAlarm(ev)){
          var alarmBadge = document.createElement("span");
          alarmBadge.className = "badge alarmBadge";
          alarmBadge.textContent = "🔔 " + getEventAlarmLabel(ev);
          alarmBadge.title = "Sveglia attiva";
          alarmBadge.style.marginLeft = "8px";
          t.appendChild(alarmBadge);
        }

        var s = document.createElement("div");
        s.className = "s";
        s.textContent = ev.notes || "";

        text.appendChild(t);
        if(ev.notes) text.appendChild(s);

        left.appendChild(text);

        var actions = document.createElement("div");
        actions.className = "itemActions";

        var edit = document.createElement("button");
        edit.className = "smallBtn iconBtn";
        edit.type = "button";
        edit.title = "Modifica evento";
        edit.setAttribute("aria-label", "Modifica evento");
        edit.innerHTML = iconSvg("edit");
        edit.addEventListener("click", function(){ startEventEdit(ev); });

        var del = document.createElement("button");
        del.className = "smallBtn danger iconBtn";
        del.type = "button";
        del.title = "Elimina evento";
        del.setAttribute("aria-label", "Elimina evento");
        del.innerHTML = iconSvg("trash");
        del.addEventListener("click", function(){ deleteEvent(iso, ev.id); });

        actions.appendChild(edit);
        actions.appendChild(del);

        item.appendChild(left);
        item.appendChild(actions);
        dayEventsList.appendChild(item);
      });
    }

    function getEventAlarmFireDate(dateISO, timeValue, offsetMinutes){
      if(!dateISO || !timeValue) return null;
      var dp = String(dateISO).split("-").map(Number);
      var tp = String(timeValue).split(":").map(Number);
      if(dp.length < 3 || tp.length < 2) return null;
      var d = new Date(dp[0], dp[1]-1, dp[2], tp[0], tp[1], 0, 0);
      if(isNaN(d.getTime())) return null;
      d.setMinutes(d.getMinutes() - normalizeAlarmOffset(offsetMinutes));
      return d;
    }

    function getEventAlarmFireKey(dateISO, eventId, offsetMinutes){
      return String(dateISO || "") + "|" + String(eventId || "") + "|" + String(normalizeAlarmOffset(offsetMinutes));
    }

    function getEventAlarmDueInfo(now){
      var nowMs = now.getTime();
      var best = null;

      Object.keys(state.events || {}).forEach(function(dateISO){
        (state.events[dateISO] || []).forEach(function(ev){
          if(!eventHasAlarm(ev)) return;
          ev.alarm = normalizeEventAlarm(ev.alarm);

          var fireAt = null;
          var key = "";
          if(ev.alarm.snoozeUntil){
            fireAt = new Date(ev.alarm.snoozeUntil);
            key = String(dateISO) + "|" + String(ev.id || "") + "|snooze|" + ev.alarm.snoozeUntil;
          }else{
            fireAt = getEventAlarmFireDate(dateISO, ev.time, ev.alarm.offsetMinutes);
            key = getEventAlarmFireKey(dateISO, ev.id, ev.alarm.offsetMinutes);
          }

          if(!fireAt || isNaN(fireAt.getTime())) return;
          var diff = nowMs - fireAt.getTime();
          if(diff < 0 || diff > ALARM_GRACE_MS) return;
          if(ev.alarm.lastFiredKey === key) return;

          if(!best || fireAt.getTime() < best.fireAt.getTime()){
            best = { dateISO: dateISO, event: ev, fireAt: fireAt, key: key };
          }
        });
      });

      return best;
    }

    function getAlarmAudio(){
      if(!alarmAudio){
        alarmAudio = new Audio(ALARM_SOUND_PATH);
        alarmAudio.loop = true;
        alarmAudio.preload = "auto";
      }
      return alarmAudio;
    }

    function stopAlarmSound(){
      if(!alarmAudio) return;
      try{
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
        alarmAudio.loop = true;
        alarmAudio.muted = false;
        alarmAudio.volume = 1;
      }catch(e){}
    }

    function startAlarmSound(){
      if(alarmAudioHint) alarmAudioHint.textContent = "";
      try{
        var audio = getAlarmAudio();
        audio.loop = true;
        audio.muted = false;
        audio.volume = 1;
        audio.currentTime = 0;
        var playPromise = audio.play();
        if(playPromise && typeof playPromise.catch === "function"){
          playPromise.catch(function(){
            if(alarmAudioHint){
              alarmAudioHint.textContent = "Il browser ha bloccato l'audio automatico. Tocca 'Attiva suoni / Test' e lascia Agenda aperta quando vuoi usare la sveglia.";
            }
          });
        }
      }catch(e){
        if(alarmAudioHint){
          alarmAudioHint.textContent = "Non riesco a riprodurre sound/alarm.mp3. Controlla che il file esista nella cartella sound.";
        }
      }
    }

    function enableAlarmAudio(){
      try{
        var audio = getAlarmAudio();
        audio.loop = false;
        audio.muted = false;
        audio.volume = 1;
        audio.currentTime = 0;
        var playPromise = audio.play();
        if(playPromise && typeof playPromise.then === "function"){
          playPromise.then(function(){
            if(alarmStatus) alarmStatus.textContent = "Suoni attivati. Hai sentito un breve test della sveglia.";
            setTimeout(function(){
              try{
                audio.pause();
                audio.currentTime = 0;
                audio.loop = true;
              }catch(e){}
            }, 900);
          }).catch(function(){
            if(alarmStatus) alarmStatus.textContent = "Non riesco ad avviare il suono. Verifica che sound/alarm.mp3 esista e riprova.";
          });
        }
      }catch(e){
        if(alarmStatus) alarmStatus.textContent = "File sound/alarm.mp3 non trovato o non riproducibile.";
      }

      if("Notification" in window && Notification.permission === "default"){
        try{ Notification.requestPermission(); }catch(e){}
      }
    }

    function hideAlarmOverlay(){
      stopAlarmSound();
      activeAlarmInfo = null;
      if(alarmOverlay){
        alarmOverlay.style.display = "none";
        alarmOverlay.setAttribute("aria-hidden", "true");
      }
    }

    function showAlarmOverlay(info){
      if(!info || !info.event) return;
      activeAlarmInfo = info;

      if(alarmTitle) alarmTitle.textContent = info.event.title || "Evento";
      if(alarmMeta){
        var d = parseISO(info.dateISO);
        var dateLabel = DOW_IT[(d.getDay()+6)%7] + " " + d.getDate() + " " + MONTHS_IT[d.getMonth()];
        alarmMeta.textContent = dateLabel + " · " + (info.event.time || "--:--") + " · " + getEventAlarmLabel(info.event);
      }
      if(alarmNotes){
        alarmNotes.textContent = info.event.notes || "";
        alarmNotes.style.display = info.event.notes ? "block" : "none";
      }
      if(alarmAudioHint) alarmAudioHint.textContent = "";

      if(alarmOverlay){
        alarmOverlay.style.display = "flex";
        alarmOverlay.setAttribute("aria-hidden", "false");
      }

      if("Notification" in window && Notification.permission === "granted"){
        try{
          new Notification("Agenda: " + (info.event.title || "Evento"), {
            body: (info.event.time ? info.event.time + " · " : "") + getEventAlarmLabel(info.event),
            tag: "agenda-alarm-" + info.key
          });
        }catch(e){}
      }

      startAlarmSound();
      setTimeout(function(){
        try{ if(btnAlarmStop) btnAlarmStop.focus(); }catch(e){}
      }, 30);
    }

    function checkEventAlarms(){
      if(activeAlarmInfo) return;
      var info = getEventAlarmDueInfo(new Date());
      if(!info) return;

      info.event.alarm = normalizeEventAlarm(info.event.alarm);
      info.event.alarm.lastFiredKey = info.key;
      info.event.alarm.snoozeUntil = "";
      touchAndSave();
      renderCalendar();
      if(selectedISO === info.dateISO) renderDayEvents();
      renderSummary();
      showAlarmOverlay(info);
    }

    function snoozeActiveAlarm(){
      if(!activeAlarmInfo || !activeAlarmInfo.event) return;
      activeAlarmInfo.event.alarm = normalizeEventAlarm(activeAlarmInfo.event.alarm);
      activeAlarmInfo.event.alarm.snoozeUntil = new Date(Date.now() + ALARM_SNOOZE_MS).toISOString();
      activeAlarmInfo.event.alarm.lastFiredKey = "";
      touchAndSave();
      renderCalendar();
      if(selectedISO === activeAlarmInfo.dateISO) renderDayEvents();
      renderSummary();
      hideAlarmOverlay();
    }

    function startAlarmScheduler(){
      if(alarmCheckHandle) clearInterval(alarmCheckHandle);
      alarmCheckHandle = setInterval(checkEventAlarms, ALARM_CHECK_MS);
      checkEventAlarms();
    }

    function addEvent(){
      var iso = selectedISO;
      if(!iso) return;

      var title = (evTitle.value || "").trim();
      if(!title){ evTitle.focus(); return; }

      var cat = normalizeEventCategory((evCat && evCat.value) ? evCat.value : "other");
      var eventId = uid();
      var alarm = buildAlarmFromForm(iso, eventId);
      if(!alarm) return;

      var obj = {
        id: eventId,
        time: evTime.value || "",
        title: title,
        notes: (evNotes.value || "").trim(),
        cat: cat,
        alarm: alarm,
        createdAt: new Date().toISOString()
      };

      if(!state.events[iso]) state.events[iso] = [];
      state.events[iso].push(obj);

      touchAndSave();
      renderCalendar();
      renderDayEvents();
      renderSummary();

      resetEventForm();

// chiudi come “Chiudi” e resta sul calendario
closeDay();
setView("calendar");

    }

    function updateEvent(){
      var iso = selectedISO;
      if(!iso || !editingEventId) return;

      var title = (evTitle.value || "").trim();
      if(!title){ evTitle.focus(); return; }

      var arr = state.events[iso] || [];
      var target = null;
      for(var i=0; i<arr.length; i++){
        if(arr[i].id === editingEventId){
          target = arr[i];
          break;
        }
      }

      if(!target){
        cancelEventEdit();
        renderDayEvents();
        return;
      }

      var alarm = buildAlarmFromForm(iso, target.id);
      if(!alarm) return;

      target.time = evTime.value || "";
      target.title = title;
      target.notes = (evNotes.value || "").trim();
      target.cat = normalizeEventCategory((evCat && evCat.value) ? evCat.value : "other");
      target.alarm = alarm;
      target.updatedAt = new Date().toISOString();

      touchAndSave();
      renderCalendar();
      renderDayEvents();
      renderSummary();

      cancelEventEdit();
    }

    function deleteEvent(dateISO, eventId){
      var arr = state.events[dateISO] || [];
      var next = arr.filter(function(e){ return e.id !== eventId; });
      if(next.length === 0) delete state.events[dateISO];
      else state.events[dateISO] = next;

      touchAndSave();
      renderCalendar();
      renderDayEvents();
      renderSummary();
    }

    function escapeHtml(str){
      return String(str)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
    }

    function printDay(){
      var iso = selectedISO;
      if(!iso) return;

      var d = parseISO(iso);
      var title = DOW_IT[(d.getDay()+6)%7] + " " + d.getDate() + " " + MONTHS_IT[d.getMonth()] + " " + d.getFullYear();
      var events = sortedEventsFor(iso);

      var html = '<html><head><meta charset="utf-8"><title>'+escapeHtml(title)+'</title>' +
        '<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;padding:18px}h1{font-size:18px;margin:0 0 10px}.e{border:1px solid #ddd;border-radius:10px;padding:10px;margin:8px 0}.t{font-weight:700}.n{white-space:pre-wrap;margin-top:6px;color:#444}.muted{color:#666}</style>' +
        '</head><body><h1>'+escapeHtml(title)+'</h1>';

      if(events.length){
        events.forEach(function(ev){
          html += '<div class="e"><div class="t">'+escapeHtml("[" + eventCategoryLabel(ev.cat) + "] " + ((ev.time ? ev.time+" · " : "") + (ev.title||"")))+'</div>';
          html += ev.notes ? '<div class="n">'+escapeHtml(ev.notes)+'</div>' : '<div class="muted">—</div>';
          html += '</div>';
        });
      }else{
        html += '<div class="muted">Nessun evento.</div>';
      }

      html += '<script>window.print();<\/script></body></html>';

      var w = window.open("", "_blank");
      if(w){ w.document.open(); w.document.write(html); w.document.close(); }
    }

    // Todos
    function addTodoItem(){
      var text = (todoText.value || "").trim();
      if(!text){ todoText.focus(); return; }

      var obj = {
        id: uid(),
        text: text,
        priority: todoPriority.value || "med",
        tag: (todoTag.value || "").trim(),
        done: false,
        createdAt: new Date().toISOString(),
        doneAt: ""
      };

      state.todos.unshift(obj);
      todoText.value = "";
      todoTag.value = "";
      todoPriority.value = "med";

      touchAndSave();
renderTodos();
renderSummary();

// torna “a casa”
setView("calendar");
window.scrollTo({ top: 0, behavior: "smooth" });

    }

    function toggleTodo(id, done){
      var t = state.todos.find(function(x){ return x.id === id; });
      if(!t) return;
      t.done = !!done;
      t.doneAt = t.done ? new Date().toISOString() : "";
      touchAndSave();
      renderTodos();
      renderSummary();
    }

    function deleteTodo(id){
      state.todos = state.todos.filter(function(x){ return x.id !== id; });
      touchAndSave();
      renderTodos();
      renderSummary();
    }

    function renderTodos(){
      var q = (todoSearch.value || "").trim().toLowerCase();
      var filter = todoFilter.value;

      var items = state.todos.slice();

      if(q){
        items = items.filter(function(t){
          return String(t.text||"").toLowerCase().indexOf(q) !== -1 ||
                 String(t.tag||"").toLowerCase().indexOf(q) !== -1;
        });
      }
      if(filter === "active") items = items.filter(function(t){ return !t.done; });
      if(filter === "done") items = items.filter(function(t){ return !!t.done; });

      todoList.innerHTML = "";
      todoTotalCount.textContent = items.length + " visibili · " + state.todos.length + " totali";

      if(items.length === 0){
        var empty = document.createElement("div");
        empty.className = "hint";
        empty.textContent = "Niente da mostrare.";
        todoList.appendChild(empty);
        return;
      }

      items.forEach(function(t){
        var item = document.createElement("div");
        item.className = "item";

        var left = document.createElement("div");
        left.className = "itemMain";

        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "checkbox";
        cb.checked = !!t.done;
        cb.addEventListener("change", function(){ toggleTodo(t.id, cb.checked); });

        var text = document.createElement("div");
        text.className = "itemText";

        var title = document.createElement("div");
        title.className = "t";
        title.textContent = t.text || "";
        if(t.done) title.style.textDecoration = "line-through";

        var meta = document.createElement("div");
        meta.style.display = "flex";
        meta.style.gap = "8px";
        meta.style.flexWrap = "wrap";

        var p = document.createElement("span");
        p.className = "badge " + (t.priority || "med");
        p.textContent = (t.priority === "high") ? "priorità alta" : (t.priority === "low") ? "priorità bassa" : "priorità media";
        meta.appendChild(p);

        if(t.tag){
          var tag = document.createElement("span");
          tag.className = "badge";
          tag.textContent = "#" + t.tag;
          meta.appendChild(tag);
        }

        text.appendChild(title);
        text.appendChild(meta);

        left.appendChild(cb);
        left.appendChild(text);

        var actions = document.createElement("div");
        var del = document.createElement("button");
        del.className = "smallBtn danger";
        del.textContent = "Elimina";
        del.addEventListener("click", function(){ deleteTodo(t.id); });

        actions.appendChild(del);

        item.appendChild(left);
        item.appendChild(actions);
        todoList.appendChild(item);
      });
    }

    // Summary
    function renderSummary(){
      renderActiveTodosMini();
      renderAgendaWeek();
    }

    function getTodayDate(){
      var now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
    }

    function getAgendaDayLabel(date, offset){
      if(offset === 0) return "Oggi";
      if(offset === 1) return "Domani";
      return DOW_IT[(date.getDay()+6)%7];
    }

    function getAgendaDayDateLabel(date){
      return new Intl.DateTimeFormat("it-IT", {
        weekday: "short",
        day: "numeric",
        month: "short"
      }).format(date).replace(/\./g, "");
    }

    function renderAgendaWeek(){
      if(!agendaWeekList) return;

      var start = getTodayDate();

      agendaWeekList.innerHTML = "";

      for(var offset=0; offset<7; offset++){
        var dayDate = new Date(start);
        dayDate.setDate(start.getDate() + offset);
        var iso = isoDate(dayDate);
        var events = sortedEventsFor(iso);

        var dayEl = document.createElement("div");
        dayEl.className = "agendaWeekDay" + (offset === 0 ? " isToday" : "");
        dayEl.setAttribute("role", "button");
        dayEl.setAttribute("tabindex", "0");
        dayEl.setAttribute("aria-label", "Apri " + getAgendaDayLabel(dayDate, offset) + ", " + getAgendaDayDateLabel(dayDate));

        var head = document.createElement("div");
        head.className = "agendaWeekHead";

        var meta = document.createElement("div");
        meta.className = "agendaWeekMeta";

        var title = document.createElement("div");
        title.className = "agendaWeekTitle" + (offset === 0 ? " isTodayLabel" : "");
        title.textContent = getAgendaDayLabel(dayDate, offset);

        var dateLabel = document.createElement("div");
        dateLabel.className = "agendaWeekDate";
        dateLabel.textContent = getAgendaDayDateLabel(dayDate);

        meta.appendChild(title);
        meta.appendChild(dateLabel);

        var badge = document.createElement("div");
        badge.className = "agendaWeekBadge" + (events.length ? " hasEvents" : "");
        badge.textContent = events.length ? (events.length === 1 ? "1 evento" : events.length + " eventi") : "Libero";

        head.appendChild(meta);
        head.appendChild(badge);
        dayEl.appendChild(head);

        if(events.length){
          var eventsWrap = document.createElement("div");
          eventsWrap.className = "agendaWeekEvents";

          events.forEach(function(ev){
            var line = document.createElement("div");
            line.className = "agendaWeekEvent cat-" + normalizeEventCategory(ev.cat);

            var time = document.createElement("span");
            time.className = "agendaWeekEventTime";
            time.textContent = (eventHasAlarm(ev) ? "🔔 " : "") + (ev.time || "—");

            var text = document.createElement("span");
            text.className = "agendaWeekEventText";
            text.textContent = ev.title || "Senza titolo";

            line.appendChild(time);
            line.appendChild(text);
            eventsWrap.appendChild(line);
          });

          dayEl.appendChild(eventsWrap);
        }else{
          var empty = document.createElement("div");
          empty.className = "agendaWeekEmpty";
          empty.textContent = "Nessun evento — tocca per aggiungere.";
          dayEl.appendChild(empty);
        }

        (function(dateISO, el){
          function handleOpen(){ openDay(dateISO); }
          el.addEventListener("click", handleOpen);
          el.addEventListener("keydown", function(ev){
            if(ev.key === "Enter" || ev.key === " "){
              ev.preventDefault();
              handleOpen();
            }
          });
        })(iso, dayEl);

        agendaWeekList.appendChild(dayEl);
      }

    }

    function renderActiveTodosMini(){
      var active = state.todos.filter(function(t){ return !t.done; });

      todoActiveList.innerHTML = "";
      if(active.length === 0){
        var empty = document.createElement("div");
        empty.className = "hint";
        empty.textContent = "Nessun todo attivo.";
        todoActiveList.appendChild(empty);
        return;
      }

      var show = active.slice(0,6);
      show.forEach(function(t){
        var item = document.createElement("div");
        item.className = "item";

        var left = document.createElement("div");
        left.className = "itemMain";

        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "checkbox";
        cb.checked = false;
        cb.title = "Segna come fatto";
        cb.addEventListener("change", function(){ toggleTodo(t.id, true); });

        // Rendi l'intera riga cliccabile (mobile-friendly)
        item.setAttribute("role","button");
        item.tabIndex = 0;
        item.title = "Segna come fatto";
        item.addEventListener("click", function(e){
          // se tocchi la checkbox, lascia che gestisca lei
          if(e && e.target === cb) return;
          toggleTodo(t.id, true);
        });
        item.addEventListener("keydown", function(e){
          if(e.key === "Enter" || e.key === " "){
            e.preventDefault();
            toggleTodo(t.id, true);
          }
        });

        var text = document.createElement("div");
        text.className = "itemText";

        var title = document.createElement("div");
        title.className = "t";
        title.textContent = t.text || "";

        var meta = document.createElement("div");
        meta.style.display = "flex";
        meta.style.gap = "8px";
        meta.style.flexWrap = "wrap";

        var p = document.createElement("span");
        p.className = "badge " + (t.priority || "med");
        p.textContent = (t.priority === "high") ? "alta" : (t.priority === "low") ? "bassa" : "media";
        meta.appendChild(p);

        if(t.tag){
          var tag = document.createElement("span");
          tag.className = "badge";
          tag.textContent = "#" + t.tag;
          meta.appendChild(tag);
        }

        text.appendChild(title);
        text.appendChild(meta);

        left.appendChild(text);

item.appendChild(left);
item.appendChild(cb);   // checkbox a destra, in fondo alla riga
todoActiveList.appendChild(item);

      });

      if(active.length > show.length){
        var more = document.createElement("div");
        more.className = "hint";
        more.textContent = "... e altri " + (active.length - show.length);
        todoActiveList.appendChild(more);
      }
    }

    // Export / Import / Reset
    function exportJSON(){
      try{
        var data = JSON.stringify(state, null, 2);
        var blob = new Blob([data], { type:"application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        var stamp = new Date().toISOString().slice(0,19).replace(/:/g,"-");
        a.href = url;
        a.download = "agenda-backup-"+stamp+".json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function(){ URL.revokeObjectURL(url); }, 250);
      }catch(e){}
    }

    function importJSON(e){
      var file = e.target.files && e.target.files[0];
      if(!file) return;

      var reader = new FileReader();
      reader.onload = function(){
        try{
          var obj = JSON.parse(String(reader.result || ""));
          if(!obj || typeof obj !== "object") throw new Error("invalid");

          state = normalizeLoadedState(obj);
          state.updatedAt = new Date().toISOString();

          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          syncNotesUiFromState();

          renderAll();
          updateStorageStatus(true);
          if(isLoggedIn()) scheduleRemoteSave();
        }catch(err){
          updateStorageStatus(false);
          alert("Import fallito: file non valido o corrotto.");
        }finally{
          importFile.value = "";
        }
      };
      reader.readAsText(file);
    }

    function resetAll(){
      exportJSON();
      state = defaultState();
      try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
      syncNotesUiFromState();
      var now = new Date();
      currentYear = now.getFullYear();
      currentMonth = now.getMonth();
      renderAll();
      updateStorageStatus(true);
    }

    function renderAll(){
      renderCalendar();
      renderTodos();
      renderNotes();
      renderSummary();
      renderContacts();
      renderTodayPanel();
    }

    // Wire
    tabs.forEach(function(t){
      function activateTab(){ setView(t.getAttribute("data-view")); }
      t.addEventListener("click", activateTab);
      t.addEventListener("keydown", function(ev){
        if(ev.key === "Enter" || ev.key === " "){
          ev.preventDefault();
          activateTab();
        }
      });
    });

    if(todayPrevBtn){
      todayPrevBtn.addEventListener("click", function(){
        todayViewOffset -= 1;
        renderTodayPanel();
      });
    }

    if(todayNextBtn){
      todayNextBtn.addEventListener("click", function(){
        todayViewOffset += 1;
        renderTodayPanel();
      });
    }

    prevMonth.addEventListener("click", function(){ shiftCalendarMonth(-1); renderCalendar(); });
    nextMonth.addEventListener("click", function(){ shiftCalendarMonth(1); renderCalendar(); });

    jumpToday.addEventListener("click", function(){
      var now = new Date();
      currentYear = now.getFullYear();
      currentMonth = now.getMonth();
      renderCalendar();
    });

    overlay.addEventListener("click", function(ev){ if(ev.target === overlay) closeDay(); });
    btnCloseDay.addEventListener("click", closeDay);
    document.addEventListener("keydown", function(ev){
      if(ev.key !== "Escape") return;
      if(window.AgendaAccount && window.AgendaAccount.isOpen && window.AgendaAccount.isOpen()) return;
      if(alarmOverlay && alarmOverlay.style.display === "flex") hideAlarmOverlay();
      else if(contactOverlay && contactOverlay.style.display === "flex") closeContactModal();
      else closeDay();
    });

    btnAddEvent.addEventListener("click", handleEventSubmit);
    if(btnCancelEventEdit) btnCancelEventEdit.addEventListener("click", cancelEventEdit);
    if(evAlarmEnabled) evAlarmEnabled.addEventListener("change", syncAlarmFormState);
    if(btnEnableAlarmAudio) btnEnableAlarmAudio.addEventListener("click", enableAlarmAudio);
    if(btnAlarmStop) btnAlarmStop.addEventListener("click", hideAlarmOverlay);
    if(btnAlarmSnooze) btnAlarmSnooze.addEventListener("click", snoozeActiveAlarm);
    if(alarmOverlay) alarmOverlay.addEventListener("click", function(ev){ if(ev.target === alarmOverlay) hideAlarmOverlay(); });
    btnPrintDay.addEventListener("click", printDay);

    btnExport.addEventListener("click", exportJSON);
    importFile.addEventListener("change", importJSON);
    btnReset.addEventListener("click", resetAll);

    addTodo.addEventListener("click", addTodoItem);
    todoText.addEventListener("keydown", function(ev){ if(ev.key === "Enter") addTodoItem(); });

    todoSearch.addEventListener("input", renderTodos);
    todoFilter.addEventListener("change", renderTodos);

    if(contactSearch) contactSearch.addEventListener("input", renderContacts);
    if(contactCategoryFilter) contactCategoryFilter.addEventListener("change", renderContacts);
    if(openContactBtn) openContactBtn.addEventListener("click", function(){ openContactModal(); });
    if(saveContactBtn) saveContactBtn.addEventListener("click", saveContact);
    if(closeContactBtn) closeContactBtn.addEventListener("click", closeContactModal);
    if(contactOverlay) contactOverlay.addEventListener("click", function(ev){ if(ev.target === contactOverlay) closeContactModal(); });
    if(contactName) contactName.addEventListener("keydown", function(ev){ if(ev.key === "Enter") saveContact(); });

    if(btnSaveNote) btnSaveNote.addEventListener("click", saveCurrentNote);
    if(btnNotesFavorites) btnNotesFavorites.addEventListener("click", toggleNotesFavorites);
    if(btnOpenNoteEditor) btnOpenNoteEditor.addEventListener("click", openNotesEditorFromList);

    if(quickNoteTitle){
      quickNoteTitle.addEventListener("input", function(){
        var notesState = getNotesState();
        notesState.draftTitle = quickNoteTitle.value;
        touchAndSave();
        updateNotesEditorStatus();
      });
      quickNoteTitle.addEventListener("keydown", function(ev){
        if(ev.key === "Enter"){
          ev.preventDefault();
          saveCurrentNote();
        }
      });
    }

    if(quickNotes){
      quickNotes.addEventListener("input", function(){
        var notesState = getNotesState();
        notesState.draftBody = quickNotes.value;
        touchAndSave();
      });
    }

    // Init
    var now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth();
    syncNotesUiFromState();
    renderAll();
    syncTodoMiniPanelAria();
    updateStorageStatus();
    applyInitialAgendaRoute();

    
var installBtn = document.getElementById("installBtn");
var deferredInstallPrompt = null;

function updateTodayLine(){
  var el = document.getElementById("todayLine");
  if(!el) return;

  var d = new Date();
  var s = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(d);

  s = s.charAt(0).toUpperCase() + s.slice(1);
  el.textContent = s;

  var nextTodayISO = isoDate(getTodayDate());
  if(nextTodayISO !== liveTodayISO){
    liveTodayISO = nextTodayISO;
    renderCalendar();
    renderSummary();
    renderTodayPanel();
  }
}

function isStandaloneMode(){
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isIosInstallable(){
  var ua = String(window.navigator.userAgent || "");
  var isIOS = /iphone|ipad|ipod/i.test(ua);
  var isSafari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
  return isIOS && isSafari && !isStandaloneMode();
}

function updateInstallButton(){
  if(!installBtn) return;

  if(isStandaloneMode()) {
    installBtn.classList.add("hidden");
    return;
  }

  if(deferredInstallPrompt){
    installBtn.textContent = "Installa";
    installBtn.classList.remove("hidden");
    return;
  }

  if(isIosInstallable()) {
    installBtn.textContent = "Installa";
    installBtn.classList.remove("hidden");
    return;
  }

  installBtn.classList.add("hidden");
}

async function handleInstallClick(){
  if(deferredInstallPrompt){
    deferredInstallPrompt.prompt();
    try{
      await deferredInstallPrompt.userChoice;
    }catch(e){}
    deferredInstallPrompt = null;
    updateInstallButton();
    return;
  }

  if(isIosInstallable()){
    window.alert("Per installare Agenda su iPhone o iPad: tocca Condividi in Safari e poi 'Aggiungi a Home'.");
  }
}

updateTodayLine();
setInterval(updateTodayLine, 60 * 1000);
startAlarmScheduler();
window.addEventListener("focus", checkEventAlarms);
document.addEventListener("visibilitychange", function(){
  if(document.visibilityState === "visible") checkEventAlarms();
});
updateInstallButton();

window.addEventListener("beforeinstallprompt", function(ev){
  ev.preventDefault();
  deferredInstallPrompt = ev;
  updateInstallButton();
});

window.addEventListener("appinstalled", function(){
  deferredInstallPrompt = null;
  updateInstallButton();
});

if(installBtn){
  installBtn.addEventListener("click", handleInstallClick);
}

if(btnCloudRefresh){
  btnCloudRefresh.addEventListener("click", handleManualCloudRefresh);
}
setCloudStatus("idle", "☁️ Cloud: non verificato");

if("serviceWorker" in navigator){
  window.addEventListener("load", function(){
    navigator.serviceWorker.register("./service-worker.js").catch(function(err){
      console.warn("Service worker non registrato:", err);
    });
  });
}

function switchStateForCurrentSession(){
  try{
    state = loadState();
    syncNotesUiFromState();
    renderAll();
    updateStorageStatus(true);
  }catch(e){
    console.warn("Cambio sessione non riuscito:", e);
  }
}

window.AgendaApp = {
  onIdentityInit: function(user){
    switchStateForCurrentSession();
    if(user){
      startRemotePolling();
      beginMandatoryCloudRefresh();
    }else{
      stopRemotePolling();
      setCloudWriteLock(false);
      setCloudStatus("idle", "☁️ Cloud: non attivo");
    }
  },
  onIdentityLogin: function(user){
    remoteLoginPrompted = false;
    switchStateForCurrentSession();
    startRemotePolling();
    beginMandatoryCloudRefresh();
  },
  onIdentityLogout: function(){
    remoteLoginPrompted = false;
    stopRemotePolling();
    setCloudWriteLock(false);
    switchStateForCurrentSession();
    setCloudStatus("idle", "☁️ Cloud: non attivo");
  },
  requestSoftSync: function(){
    scheduleRemoteRefresh(false, false);
  }
};

if (window.netlifyIdentity) {
  window.addEventListener("online", function(){
    scheduleRemoteRefresh(false, false);
  });

  window.addEventListener("focus", function(){
    scheduleRemoteRefresh(false, false);
  });

  window.addEventListener("pageshow", function(){
    scheduleRemoteRefresh(false, false);
  });

  document.addEventListener("visibilitychange", function(){
    if(document.visibilityState === "visible") scheduleRemoteRefresh(false, false);
  });
}


  })();
