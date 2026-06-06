(function(){
  "use strict";

  var loginBtn = document.getElementById("loginBtn");

  var accountOverlay = document.getElementById("accountOverlay");
  var closeAccountBtn = document.getElementById("closeAccountBtn");
  var accountModalTitle = document.getElementById("accountModalTitle");
  var accountStatus = document.getElementById("accountStatus");
  var accountGuestView = document.getElementById("accountGuestView");
  var accountUserView = document.getElementById("accountUserView");
  var accountTabLogin = document.getElementById("accountTabLogin");
  var accountTabSignup = document.getElementById("accountTabSignup");
  var accountLoginPane = document.getElementById("accountLoginPane");
  var accountSignupPane = document.getElementById("accountSignupPane");
  var accountLoginEmail = document.getElementById("accountLoginEmail");
  var accountLoginPassword = document.getElementById("accountLoginPassword");
  var accountSignupEmail = document.getElementById("accountSignupEmail");
  var accountSignupPassword = document.getElementById("accountSignupPassword");
  var accountSignupPassword2 = document.getElementById("accountSignupPassword2");
  var btnAccountLogin = document.getElementById("btnAccountLogin");
  var btnAccountSignup = document.getElementById("btnAccountSignup");
  var btnAccountRecover = document.getElementById("btnAccountRecover");
  var btnAccountContinueFreeLogin = document.getElementById("btnAccountContinueFreeLogin");
  var btnAccountContinueFreeSignup = document.getElementById("btnAccountContinueFreeSignup");
  var btnAccountPlanFree = document.getElementById("btnAccountPlanFree");
  var btnAccountPlanPremium = document.getElementById("btnAccountPlanPremium");
  var accountUserEmail = document.getElementById("accountUserEmail");
  var accountUserPlan = document.getElementById("accountUserPlan");
  var accountUserSync = document.getElementById("accountUserSync");
  var accountUserCtaTitle = document.getElementById("accountUserCtaTitle");
  var accountUserCtaText = document.getElementById("accountUserCtaText");
  var btnAccountManagePremium = document.getElementById("btnAccountManagePremium");
  var btnAccountLogout = document.getElementById("btnAccountLogout");

  var quickLoginOverlay = document.getElementById("quickLoginOverlay");
  var closeQuickLoginBtn = document.getElementById("closeQuickLoginBtn");
  var quickLoginStatus = document.getElementById("quickLoginStatus");
  var quickLoginEmail = document.getElementById("quickLoginEmail");
  var quickLoginPassword = document.getElementById("quickLoginPassword");
  var toggleQuickLoginPassword = document.getElementById("toggleQuickLoginPassword");
  var btnQuickLogin = document.getElementById("btnQuickLogin");
  var btnQuickLoginSkip = document.getElementById("btnQuickLoginSkip");
  var btnQuickLoginFullAccount = document.getElementById("btnQuickLoginFullAccount");
  var toggleAccountLoginPassword = document.getElementById("toggleAccountLoginPassword");

  var accountCurrentTab = "login";
  var LAST_LOGIN_EMAIL_KEY = "agenda_last_login_email";
  var QUICK_LOGIN_DISMISSED_KEY = "agenda_quick_login_dismissed";

  function callAgendaHook(name, arg){
    try{
      if(window.AgendaApp && typeof window.AgendaApp[name] === "function"){
        window.AgendaApp[name](arg);
      }
    }catch(e){}
  }

  function getIdentityUser(){
    try{
      return window.netlifyIdentity && window.netlifyIdentity.currentUser && window.netlifyIdentity.currentUser();
    }catch(e){
      return null;
    }
  }

  function getIdentityClient(){
    try{
      return window.netlifyIdentity && (window.netlifyIdentity.gotrue || window.netlifyIdentity);
    }catch(e){
      return null;
    }
  }

  function storageGet(storage, key){
    try{
      return storage.getItem(key) || "";
    }catch(e){
      return "";
    }
  }

  function storageSet(storage, key, value){
    try{
      storage.setItem(key, value);
    }catch(e){}
  }

  function storageRemove(storage, key){
    try{
      storage.removeItem(key);
    }catch(e){}
  }

  function getLastLoginEmail(){
    return String(storageGet(window.localStorage, LAST_LOGIN_EMAIL_KEY) || "").trim();
  }

  function rememberLoginEmail(email){
    email = String(email || "").trim();
    if(email) storageSet(window.localStorage, LAST_LOGIN_EMAIL_KEY, email);
  }

  function markQuickLoginDismissed(){
    storageSet(window.sessionStorage, QUICK_LOGIN_DISMISSED_KEY, "1");
  }

  function clearQuickLoginDismissed(){
    storageRemove(window.sessionStorage, QUICK_LOGIN_DISMISSED_KEY);
  }

  function isQuickLoginDismissed(){
    return storageGet(window.sessionStorage, QUICK_LOGIN_DISMISSED_KEY) === "1";
  }

  function getUserEmail(user){
    return String((user && user.email) || "").trim();
  }

  function getBestKnownEmail(){
    var user = getIdentityUser();
    return getUserEmail(user) || getLastLoginEmail();
  }

  function prefillLoginEmails(email){
    var hasExplicitEmail = typeof email === "string" && String(email).trim().length > 0;
    email = String(email || getBestKnownEmail() || "").trim();
    if(!email) return;
    if(accountLoginEmail && (hasExplicitEmail || !String(accountLoginEmail.value || "").trim())) accountLoginEmail.value = email;
    if(quickLoginEmail && (hasExplicitEmail || !String(quickLoginEmail.value || "").trim())) quickLoginEmail.value = email;
  }

  function refreshIdentitySession(){
    var user = getIdentityUser();
    if(!user) return Promise.resolve(null);

    if(window.netlifyIdentity && typeof window.netlifyIdentity.refresh === "function"){
      try{
        return Promise.resolve(window.netlifyIdentity.refresh()).then(function(refreshed){
          return getIdentityUser() || refreshed || user;
        });
      }catch(e){
        return Promise.reject(e);
      }
    }

    if(typeof user.jwt === "function"){
      return Promise.resolve(user.jwt(true)).then(function(){
        return getIdentityUser() || user;
      });
    }

    return Promise.resolve(user);
  }

  function getAuthHeaders(forceFresh){
    var user = getIdentityUser();
    if(!user) return Promise.resolve({});

    var ready = forceFresh ? refreshIdentitySession().catch(function(){
      return getIdentityUser() || user;
    }) : Promise.resolve(user);

    return ready.then(function(refreshedUser){
      user = refreshedUser || getIdentityUser() || user;
      if(!user || typeof user.jwt !== "function") return {};
      return Promise.resolve(user.jwt(!!forceFresh)).then(function(token){
        return token ? { Authorization: "Bearer " + token } : {};
      });
    }).catch(function(){
      return {};
    });
  }

  function getAccountPlan(user){
    if(!user) return "free";
    var appMeta = user.app_metadata || {};
    var userMeta = user.user_metadata || {};
    var roles = Array.isArray(appMeta.roles) ? appMeta.roles : [];
    var plan = String(appMeta.plan || userMeta.plan || "").toLowerCase();
    if(plan === "premium" || roles.indexOf("premium") !== -1) return "premium";
    return "free";
  }

  function refreshLoginBtn(){
    if(!loginBtn) return;
    var user = getIdentityUser();
    loginBtn.textContent = user ? "Cloud" : "Login";
  }

  function setAccountMessage(text, type){
    if(!accountStatus) return;
    if(!text){
      accountStatus.textContent = "";
      accountStatus.className = "accountStatus hidden";
      return;
    }
    accountStatus.textContent = text;
    accountStatus.className = "accountStatus accountStatus--" + (type || "info");
  }

  function setQuickLoginMessage(text, type){
    if(!quickLoginStatus) return;
    if(!text){
      quickLoginStatus.textContent = "";
      quickLoginStatus.className = "quickLoginStatus hidden";
      return;
    }
    quickLoginStatus.textContent = text;
    quickLoginStatus.className = "quickLoginStatus quickLoginStatus--" + (type || "info");
  }

  function isQuickLoginOpen(){
    return !!(quickLoginOverlay && quickLoginOverlay.style.display === "flex");
  }

  function openQuickLogin(message, force){
    if(!quickLoginOverlay) return;
    if(getIdentityUser() && !force) return;
    if(!force && isQuickLoginDismissed()) return;

    prefillLoginEmails();
    setQuickLoginMessage(message || "", message ? "info" : "info");
    quickLoginOverlay.style.display = "flex";
    quickLoginOverlay.setAttribute("aria-hidden", "false");

    setTimeout(function(){
      try{
        if(quickLoginEmail && !String(quickLoginEmail.value || "").trim()) quickLoginEmail.focus();
        else if(quickLoginPassword) quickLoginPassword.focus();
      }catch(e){}
    }, 30);
  }

  function closeQuickLogin(rememberDismissed){
    if(!quickLoginOverlay) return;
    quickLoginOverlay.style.display = "none";
    quickLoginOverlay.setAttribute("aria-hidden", "true");
    setQuickLoginMessage("", "info");
    if(rememberDismissed) markQuickLoginDismissed();
  }

  function maybeOpenQuickLogin(message){
    if(getIdentityUser()) return;
    if(!getBestKnownEmail()) return;
    if(isQuickLoginDismissed()) return;

    setTimeout(function(){
      if(!getIdentityUser()) openQuickLogin(message || "", false);
    }, 220);
  }

  function setAccountTab(tab){
    accountCurrentTab = tab === "signup" ? "signup" : "login";
    if(accountTabLogin){
      accountTabLogin.classList.toggle("isActive", accountCurrentTab === "login");
      accountTabLogin.setAttribute("aria-selected", accountCurrentTab === "login" ? "true" : "false");
    }
    if(accountTabSignup){
      accountTabSignup.classList.toggle("isActive", accountCurrentTab === "signup");
      accountTabSignup.setAttribute("aria-selected", accountCurrentTab === "signup" ? "true" : "false");
    }
    if(accountLoginPane) accountLoginPane.classList.toggle("hidden", accountCurrentTab !== "login");
    if(accountSignupPane) accountSignupPane.classList.toggle("hidden", accountCurrentTab !== "signup");
  }

  function renderAccountModal(){
    if(!accountOverlay) return;
    var user = getIdentityUser();
    var plan = getAccountPlan(user);

    if(accountModalTitle) accountModalTitle.textContent = user ? "Il tuo account" : "Account Agenda";
    if(accountGuestView) accountGuestView.classList.toggle("hidden", !!user);
    if(accountUserView) accountUserView.classList.toggle("hidden", !user);

    if(user){
      if(accountUserEmail) accountUserEmail.textContent = user.email || "—";
      if(accountUserPlan) accountUserPlan.textContent = "Cloud";
      if(accountUserSync) accountUserSync.textContent = "Attiva";
      if(accountUserCtaTitle) accountUserCtaTitle.textContent = "Cloud Agenda attivo";
      if(accountUserCtaText) accountUserCtaText.textContent = "La sincronizzazione cloud è attiva: gli eventi, le note e la rubrica vengono salvati sul cloud dell'account in uso e possono essere recuperati sugli altri dispositivi.";
      if(btnAccountManagePremium) btnAccountManagePremium.textContent = "Gestisci cloud";
    }else{
      setAccountTab(accountCurrentTab || "login");
    }

    refreshLoginBtn();
  }

  function openAccountModal(tab){
    if(!accountOverlay) return;
    if(tab) setAccountTab(tab);
    prefillLoginEmails();
    closeQuickLogin(false);
    setAccountMessage("", "info");
    renderAccountModal();
    accountOverlay.style.display = "flex";
    accountOverlay.setAttribute("aria-hidden", "false");

    setTimeout(function(){
      try{
        if(getIdentityUser()){
          if(btnAccountManagePremium) btnAccountManagePremium.focus();
        }else if(accountCurrentTab === "signup"){
          if(accountSignupEmail) accountSignupEmail.focus();
        }else{
          if(accountLoginEmail) accountLoginEmail.focus();
        }
      }catch(e){}
    }, 30);
  }

  function closeAccountModal(){
    if(!accountOverlay) return;
    accountOverlay.style.display = "none";
    accountOverlay.setAttribute("aria-hidden", "true");
    setAccountMessage("", "info");
  }

  function isAccountModalOpen(){
    return !!(accountOverlay && accountOverlay.style.display === "flex");
  }

  function handlePremiumIntent(){
    if(getIdentityUser()){
      window.alert("La sincronizzazione cloud di Agenda è già attiva su questo account.");
      return;
    }
    setAccountTab("signup");
    setAccountMessage("Crea un account o accedi per attivare la sincronizzazione cloud.", "info");
    openAccountModal("signup");
  }

  function loginWithCredentials(email, password, setMessage, onInvalid){
    var auth = getIdentityClient();
    if(!auth || !auth.login){
      setMessage("Accesso non disponibile in questo momento.", "error");
      return;
    }

    email = String(email || "").trim();
    password = String(password || "");

    if(!email || !password){
      setMessage("Inserisci email e password.", "error");
      if(typeof onInvalid === "function") onInvalid(email, password);
      return;
    }

    setMessage("Accesso in corso...", "info");
    auth.login(email, password, true).then(function(){
      rememberLoginEmail(email);
      clearQuickLoginDismissed();
      if(accountLoginEmail) accountLoginEmail.value = email;
      if(quickLoginEmail) quickLoginEmail.value = email;
      if(accountLoginPassword) accountLoginPassword.value = "";
      if(quickLoginPassword) quickLoginPassword.value = "";
      setMessage("Accesso effettuato.", "success");
      closeQuickLogin(false);
      renderAccountModal();
      refreshLoginBtn();
    }).catch(function(error){
      var msg = (error && ((error.json && error.json.error_description) || error.message)) || "Accesso non riuscito.";
      setMessage(msg, "error");
    });
  }

  function handleAccountLogin(){
    loginWithCredentials(
      accountLoginEmail && accountLoginEmail.value,
      accountLoginPassword && accountLoginPassword.value,
      setAccountMessage,
      function(email){
        if(!email && accountLoginEmail) accountLoginEmail.focus();
        else if(accountLoginPassword) accountLoginPassword.focus();
      }
    );
  }

  function handleQuickLogin(){
    loginWithCredentials(
      quickLoginEmail && quickLoginEmail.value,
      quickLoginPassword && quickLoginPassword.value,
      setQuickLoginMessage,
      function(email){
        if(!email && quickLoginEmail) quickLoginEmail.focus();
        else if(quickLoginPassword) quickLoginPassword.focus();
      }
    );
  }

  function handleAccountSignup(){
    var auth = getIdentityClient();
    if(!auth || !auth.signup){
      setAccountMessage("Registrazione non disponibile in questo momento.", "error");
      return;
    }

    var email = String((accountSignupEmail && accountSignupEmail.value) || "").trim();
    var password = String((accountSignupPassword && accountSignupPassword.value) || "");
    var password2 = String((accountSignupPassword2 && accountSignupPassword2.value) || "");

    if(!email || !password || !password2){
      setAccountMessage("Compila tutti i campi per creare l'account.", "error");
      return;
    }
    if(password !== password2){
      setAccountMessage("Le password non coincidono.", "error");
      if(accountSignupPassword2) accountSignupPassword2.focus();
      return;
    }
    if(password.length < 6){
      setAccountMessage("Scegli una password di almeno 6 caratteri.", "error");
      if(accountSignupPassword) accountSignupPassword.focus();
      return;
    }

    setAccountMessage("Creazione account in corso...", "info");
    auth.signup(email, password).then(function(){
      rememberLoginEmail(email);
      setAccountMessage("Account creato. Controlla la tua email per confermare la registrazione, poi accedi.", "success");
      setAccountTab("login");
      if(accountLoginEmail) accountLoginEmail.value = email;
      if(quickLoginEmail) quickLoginEmail.value = email;
      if(accountLoginPassword) accountLoginPassword.value = "";
    }).catch(function(error){
      var msg = (error && ((error.json && error.json.msg) || (error.json && error.json.error_description) || error.message)) || "Registrazione non riuscita.";
      setAccountMessage(msg, "error");
    });
  }

  function handleAccountRecovery(){
    var auth = getIdentityClient();
    if(!auth || !auth.requestPasswordRecovery){
      setAccountMessage("Recupero password non disponibile in questo momento.", "error");
      return;
    }

    var email = "";
    if(accountCurrentTab === "signup"){
      email = String((accountSignupEmail && accountSignupEmail.value) || "").trim();
    } else {
      email = String((accountLoginEmail && accountLoginEmail.value) || "").trim();
    }

    if(!email){
      setAccountMessage("Inserisci la tua email per ricevere il link di recupero.", "error");
      if(accountCurrentTab === "signup" && accountSignupEmail) accountSignupEmail.focus();
      else if(accountLoginEmail) accountLoginEmail.focus();
      return;
    }

    setAccountMessage("Invio email di recupero...", "info");
    auth.requestPasswordRecovery(email).then(function(){
      setAccountMessage("Ti abbiamo inviato un'email per reimpostare la password.", "success");
    }).catch(function(error){
      var msg = (error && ((error.json && error.json.msg) || (error.json && error.json.error_description) || error.message)) || "Invio email non riuscito.";
      setAccountMessage(msg, "error");
    });
  }

  function handleAccountLogout(){
    var user = getIdentityUser();
    if(user && user.email) rememberLoginEmail(user.email);
    markQuickLoginDismissed();
    if(!window.netlifyIdentity || !window.netlifyIdentity.logout) return;
    window.netlifyIdentity.logout().then(function(){
      setAccountMessage("Sei uscito dal tuo account.", "success");
      closeQuickLogin(false);
      renderAccountModal();
    }).catch(function(){
      setAccountMessage("Logout non riuscito.", "error");
    });
  }

  function setupPasswordToggle(input, button){
    if(!input || !button) return;
    button.addEventListener("click", function(){
      var show = input.getAttribute("type") === "password";
      input.setAttribute("type", show ? "text" : "password");
      button.textContent = show ? "🙈" : "👁";
      button.setAttribute("aria-label", show ? "Nascondi password" : "Mostra password");
      button.setAttribute("aria-pressed", show ? "true" : "false");
      try{ input.focus(); }catch(e){}
    });
  }

  function handleIdentityInit(user){
    prefillLoginEmails(getUserEmail(user));
    if(user && user.email) rememberLoginEmail(user.email);
    refreshLoginBtn();
    renderAccountModal();

    if(!user){
      callAgendaHook("onIdentityInit", null);
      maybeOpenQuickLogin();
      return;
    }

    refreshIdentitySession().then(function(refreshedUser){
      refreshedUser = getIdentityUser() || refreshedUser || user;
      if(refreshedUser && refreshedUser.email) rememberLoginEmail(refreshedUser.email);
      closeQuickLogin(false);
      refreshLoginBtn();
      renderAccountModal();
      callAgendaHook("onIdentityInit", refreshedUser);
    }).catch(function(err){
      console.warn("Refresh sessione Identity non riuscito:", err);
      refreshLoginBtn();
      renderAccountModal();
      callAgendaHook("onIdentityInit", getIdentityUser() || user);
    });
  }

  window.AgendaAccount = {
    open: openAccountModal,
    close: closeAccountModal,
    isOpen: isAccountModalOpen,
    openQuickLogin: openQuickLogin,
    closeQuickLogin: closeQuickLogin,
    isQuickLoginOpen: isQuickLoginOpen,
    getAuthHeaders: getAuthHeaders,
    refreshSession: refreshIdentitySession
  };

  if (window.netlifyIdentity) {
    if(loginBtn){
      loginBtn.addEventListener("click", function(){
        openAccountModal("login");
      });
    }

    if(accountTabLogin) accountTabLogin.addEventListener("click", function(){ setAccountTab("login"); });
    if(accountTabSignup) accountTabSignup.addEventListener("click", function(){ setAccountTab("signup"); });
    if(closeAccountBtn) closeAccountBtn.addEventListener("click", closeAccountModal);
    if(closeQuickLoginBtn) closeQuickLoginBtn.addEventListener("click", function(){ closeQuickLogin(true); });
    if(btnAccountLogin) btnAccountLogin.addEventListener("click", handleAccountLogin);
    if(btnQuickLogin) btnQuickLogin.addEventListener("click", handleQuickLogin);
    if(btnQuickLoginSkip) btnQuickLoginSkip.addEventListener("click", function(){ closeQuickLogin(true); });
    if(btnQuickLoginFullAccount) btnQuickLoginFullAccount.addEventListener("click", function(){
      closeQuickLogin(false);
      openAccountModal("login");
    });
    if(btnAccountSignup) btnAccountSignup.addEventListener("click", handleAccountSignup);
    if(btnAccountRecover) btnAccountRecover.addEventListener("click", handleAccountRecovery);
    if(btnAccountContinueFreeLogin) btnAccountContinueFreeLogin.addEventListener("click", closeAccountModal);
    if(btnAccountContinueFreeSignup) btnAccountContinueFreeSignup.addEventListener("click", closeAccountModal);
    if(btnAccountPlanFree) btnAccountPlanFree.addEventListener("click", closeAccountModal);
    if(btnAccountPlanPremium) btnAccountPlanPremium.addEventListener("click", handlePremiumIntent);
    if(btnAccountManagePremium) btnAccountManagePremium.addEventListener("click", handlePremiumIntent);
    if(btnAccountLogout) btnAccountLogout.addEventListener("click", handleAccountLogout);

    if(accountOverlay){
      accountOverlay.addEventListener("click", function(ev){
        if(ev.target === accountOverlay) closeAccountModal();
      });
    }

    if(quickLoginOverlay){
      quickLoginOverlay.addEventListener("click", function(ev){
        if(ev.target === quickLoginOverlay) closeQuickLogin(true);
      });
    }

    setupPasswordToggle(accountLoginPassword, toggleAccountLoginPassword);
    setupPasswordToggle(quickLoginPassword, toggleQuickLoginPassword);

    prefillLoginEmails();

    if(accountLoginPassword){
      accountLoginPassword.addEventListener("keydown", function(ev){
        if(ev.key === "Enter") handleAccountLogin();
      });
    }
    if(accountSignupPassword2){
      accountSignupPassword2.addEventListener("keydown", function(ev){
        if(ev.key === "Enter") handleAccountSignup();
      });
    }
    if(quickLoginPassword){
      quickLoginPassword.addEventListener("keydown", function(ev){
        if(ev.key === "Enter") handleQuickLogin();
      });
    }

    window.netlifyIdentity.on("init", function(user){
      handleIdentityInit(user);
    });

    window.netlifyIdentity.on("login", function(user){
      if(user && user.email) rememberLoginEmail(user.email);
      clearQuickLoginDismissed();
      closeQuickLogin(false);
      refreshLoginBtn();
      renderAccountModal();
      callAgendaHook("onIdentityLogin", user);
    });

    window.netlifyIdentity.on("logout", function(){
      refreshLoginBtn();
      renderAccountModal();
      closeQuickLogin(false);
      callAgendaHook("onIdentityLogout");
    });

    window.netlifyIdentity.on("error", function(err){
      var msg = (err && ((err.json && err.json.error_description) || err.message)) || "Operazione non riuscita.";
      setAccountMessage(msg, "error");
    });

    window.netlifyIdentity.init();
  } else if(loginBtn) {
    loginBtn.classList.add("hidden");
  }

  document.addEventListener("keydown", function(ev){
    if(ev.key === "Escape"){
      if(isQuickLoginOpen()) closeQuickLogin(true);
      else if(isAccountModalOpen()) closeAccountModal();
    }
  });
})();
