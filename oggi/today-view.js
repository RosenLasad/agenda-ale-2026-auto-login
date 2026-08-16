(function(){
  "use strict";

  function byId(id){ return document.getElementById(id); }

  function setText(id, value){
    var el = byId(id);
    if(el) el.textContent = value == null || value === "" ? "—" : value;
  }

  function setHtml(id, value){
    var el = byId(id);
    if(el) el.innerHTML = value == null || value === "" ? "&mdash;" : value;
  }

  function fillFood(items){
    var el = byId("todayFoodList");
    if(!el) return;
    el.innerHTML = "";
    if(!items || !items.length){
      el.innerHTML = '<span class="todayFoodChip">Sezione pronta</span>';
      return;
    }
    items.forEach(function(item){
      var chip = document.createElement("span");
      chip.className = "todayFoodChip";
      chip.textContent = item;
      el.appendChild(chip);
    });
  }

  function getRelativeLabel(offset){
    if(offset === 0) return "Oggi";
    if(offset === -1) return "Ieri";
    if(offset === 1) return "Domani";
    if(offset < 0) return Math.abs(offset) + " giorni fa";
    return "Tra " + offset + " giorni";
  }

  function joinNonEmpty(parts){
    return (parts || []).filter(function(part){
      return part != null && String(part).trim() !== "";
    }).join(" · ");
  }

  function capitalizeFirst(value){
    var text = String(value || "").trim();
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
  }

  function fillFeast(feast, fallback){
    if(feast){
      setText("todayFeastTitle", joinNonEmpty([feast.holiday, feast.saint]));
      setText("todayFeastSubtitle", joinNonEmpty([feast.holidayAlt, capitalizeFirst(feast.saintType)]));
      setText("todaySaintBio", feast.saintBio || "");
      var quoteWrap = byId("todaySaintQuoteWrap");
      if(feast.saintQuote){
        if(quoteWrap) quoteWrap.classList.remove("hidden");
        setText("todaySaintQuote", feast.saintQuote);
      } else if(quoteWrap){
        quoteWrap.classList.add("hidden");
      }
      return;
    }

    setText("todayFeastTitle", fallback.title);
    setText("todayFeastSubtitle", fallback.subtitle);
    setText("todaySaintBio", fallback.bio);
    var wrap = byId("todaySaintQuoteWrap");
    if(wrap) wrap.classList.add("hidden");
  }

  window.renderTodayView = function(date, options){
    var d = date || new Date();
    var opts = options || {};
    var utils = window.AGENDA_TODAY_UTILS;
    var data = window.AGENDA_TODAY_DATA || {};
    if(!utils) return;

    var astronomy = utils.getAstronomy(d);
    var moon = utils.getMoon(d);
    var editorial = utils.getEditorial(d);

    setText("todayHeroKicker", getRelativeLabel(Number(opts.offset) || 0));
    setText("todayHeroDate", utils.formatFullDate(d));
    setText("todayHeroSubline", editorial.heroSubline || "Genova");

    setText("todaySunrise", astronomy.sunrise);
    setText("todaySunset", astronomy.sunset);
    setText("todayDayLength", astronomy.dayLengthText);
    setText("todayDayLengthCompact", astronomy.dayLengthText.replace(/\s+/g, "").replace(/m$/, ""));
    setText("todayDayDelta", astronomy.dayDeltaText);
    setText("todayMoonPhase", moon.labelWithIllumination);
    setText("todayMoonIllumination", Math.round(moon.illumination * 100) + "%");
    var moonItem = byId("todayMoonItem");
    if(moonItem){
      moonItem.setAttribute("title", moon.labelWithIllumination);
      moonItem.setAttribute("aria-label", "Fase lunare: " + moon.labelWithIllumination);
    }

    fillFeast(editorial.feast, data.feastFallback || {
      title: "Ricorrenza da compilare",
      subtitle: "",
      bio: ""
    });

    if(editorial.history){
      var historyText = editorial.history.year ? (editorial.history.year + " — " + editorial.history.title) : editorial.history.text;
      setText("todayOnThisDay", historyText);
    }

    if(editorial.season){
      setText("todaySeasonTitle", editorial.season.title);
      setText("todaySeasonText", editorial.season.text);
    } else {
      setText("todaySeasonTitle", "Stagione da compilare");
      setText("todaySeasonText", "Questa sezione e pronta per ospitare note stagionali e climatiche legate a Genova.");
    }

    setText("todayPracticalTip", editorial.practicalTip || "Sezione pronta per un piccolo consiglio quotidiano.");

    fillFood(editorial.food && editorial.food.items);
    setText("todayFoodNote", editorial.foodNote || "Sezione pronta per cibi di stagione e piccoli suggerimenti del giorno.");

    if(editorial.proverb){
      setText("todayProverbOriginal", editorial.proverb.original);
      setText("todayProverbTranslation", editorial.proverb.translation);
      setText("todayProverbNote", editorial.proverb.note || "");
    }
  };
})();
