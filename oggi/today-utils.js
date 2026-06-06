(function(){
  "use strict";

  var LAT = 44.4056;
  var LNG = 8.9463;
  var SUN_ZENITH = 90.833;
  var SYNODIC_MONTH = 29.53058867;
  var KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0, 0);

  function pad2(n){ return String(n).padStart(2, "0"); }
  function degToRad(d){ return d * Math.PI / 180; }
  function radToDeg(r){ return r * 180 / Math.PI; }

  function normalizeAngle(value){
    var out = value % 360;
    return out < 0 ? out + 360 : out;
  }

  function formatMMDD(date){
    return pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
  }

  function dayOfYear(date){
    var start = new Date(date.getFullYear(), 0, 0, 12, 0, 0, 0);
    return Math.floor((date - start) / 86400000);
  }

  function minutesToHM(totalMinutes){
    if(!isFinite(totalMinutes)) return "--";
    var hours = Math.floor(totalMinutes / 60);
    var minutes = Math.round(totalMinutes % 60);
    if(minutes === 60){
      hours += 1;
      minutes = 0;
    }
    return pad2(hours) + ":" + pad2(minutes);
  }

  function durationToText(totalMinutes){
    if(!isFinite(totalMinutes)) return "--";
    var h = Math.floor(totalMinutes / 60);
    var m = Math.round(totalMinutes % 60);
    if(m === 60){
      h += 1;
      m = 0;
    }
    return h + "h " + pad2(m) + "m";
  }

  function deltaToText(deltaMinutes){
    if(!isFinite(deltaMinutes)) return "--";
    var sign = deltaMinutes > 0 ? "+" : deltaMinutes < 0 ? "-" : "";
    var abs = Math.abs(deltaMinutes);
    var mins = Math.round(abs);
    return sign + mins + " min";
  }

  function getSunUTCMinutes(date, isSunrise){
    var N = dayOfYear(date);
    var lngHour = LNG / 15;
    var t = N + (((isSunrise ? 6 : 18) - lngHour) / 24);
    var M = (0.9856 * t) - 3.289;
    var L = normalizeAngle(M + (1.916 * Math.sin(degToRad(M))) + (0.020 * Math.sin(2 * degToRad(M))) + 282.634);
    var RA = normalizeAngle(radToDeg(Math.atan(0.91764 * Math.tan(degToRad(L)))));
    var Lquadrant  = Math.floor(L / 90) * 90;
    var RAquadrant = Math.floor(RA / 90) * 90;
    RA = (RA + (Lquadrant - RAquadrant)) / 15;

    var sinDec = 0.39782 * Math.sin(degToRad(L));
    var cosDec = Math.cos(Math.asin(sinDec));
    var cosH = (Math.cos(degToRad(SUN_ZENITH)) - (sinDec * Math.sin(degToRad(LAT)))) / (cosDec * Math.cos(degToRad(LAT)));

    if(cosH > 1 || cosH < -1) return null;

    var H = isSunrise ? (360 - radToDeg(Math.acos(cosH))) : radToDeg(Math.acos(cosH));
    H = H / 15;

    var T = H + RA - (0.06571 * t) - 6.622;
    var UT = (T - lngHour) % 24;
    if(UT < 0) UT += 24;

    return UT * 60;
  }

  function utcMinutesToLocalTime(date, utcMinutes){
    if(utcMinutes == null) return "--";
    var utcMs = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0) + (utcMinutes * 60000);
    var parts = new Intl.DateTimeFormat("it-IT", {
      timeZone: "Europe/Rome",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(new Date(utcMs));
    var hour = "00";
    var minute = "00";
    parts.forEach(function(part){
      if(part.type === "hour") hour = part.value;
      if(part.type === "minute") minute = part.value;
    });
    return hour + ":" + minute;
  }

  function parseHM(value){
    var bits = String(value || "").split(":");
    if(bits.length !== 2) return null;
    return (Number(bits[0]) * 60) + Number(bits[1]);
  }

  function getAstronomy(date){
    var sunriseUTC = getSunUTCMinutes(date, true);
    var sunsetUTC = getSunUTCMinutes(date, false);
    var sunrise = utcMinutesToLocalTime(date, sunriseUTC);
    var sunset = utcMinutesToLocalTime(date, sunsetUTC);
    var sunriseMin = parseHM(sunrise);
    var sunsetMin = parseHM(sunset);
    var dayLength = (sunriseMin != null && sunsetMin != null) ? (sunsetMin - sunriseMin) : null;

    var yesterday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 12, 0, 0, 0);
    var ySunrise = parseHM(utcMinutesToLocalTime(yesterday, getSunUTCMinutes(yesterday, true)));
    var ySunset = parseHM(utcMinutesToLocalTime(yesterday, getSunUTCMinutes(yesterday, false)));
    var yLength = (ySunrise != null && ySunset != null) ? (ySunset - ySunrise) : null;

    return {
      sunrise: sunrise,
      sunset: sunset,
      dayLengthMinutes: dayLength,
      dayLengthText: durationToText(dayLength),
      dayDeltaMinutes: (dayLength != null && yLength != null) ? (dayLength - yLength) : null,
      dayDeltaText: deltaToText((dayLength != null && yLength != null) ? (dayLength - yLength) : null)
    };
  }

  function getMoon(date){
    var ms = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
    var age = ((ms - KNOWN_NEW_MOON_MS) / 86400000) % SYNODIC_MONTH;
    var normalizedAge = age < 0 ? age + SYNODIC_MONTH : age;
    var phase = normalizedAge / SYNODIC_MONTH;
    var illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
    var label = "Luna nuova";

    if(phase < 0.03 || phase >= 0.97) label = "Luna nuova";
    else if(phase < 0.22) label = "Falce crescente";
    else if(phase < 0.28) label = "Primo quarto";
    else if(phase < 0.47) label = "Gibbosa crescente";
    else if(phase < 0.53) label = "Luna piena";
    else if(phase < 0.72) label = "Gibbosa calante";
    else if(phase < 0.78) label = "Ultimo quarto";
    else label = "Falce calante";

    return {
      phase: phase,
      illumination: illumination,
      label: label,
      labelWithIllumination: label + " · " + Math.round(illumination * 100) + "%"
    };
  }

  function inRange(mmdd, start, end){
    return mmdd >= start && mmdd <= end;
  }

  function findRange(mmdd, ranges){
    var list = ranges || [];
    for(var i = 0; i < list.length; i += 1){
      if(inRange(mmdd, list[i].start, list[i].end)) return list[i];
    }
    return null;
  }

  function pickByDay(date, items){
    if(!items || !items.length) return null;
    var idx = dayOfYear(date) % items.length;
    return items[idx];
  }

  function getEditorial(date){
    var data = window.AGENDA_TODAY_DATA || {};
    var key = formatMMDD(date);
    var dayData = (data.byDay && data.byDay[key]) || {};
    var season = findRange(key, data.seasonRanges);
    var food = findRange(key, data.foodRanges);
    var proverb = dayData.proverb || pickByDay(date, data.proverbFallbacks);
    var history = dayData.history || { text: pickByDay(date, data.historyFallbacks) || "" };

    return {
      key: key,
      feast: dayData.feast || null,
      history: history,
      proverb: proverb,
      season: season,
      food: food,
      foodNote: dayData.foodNote || (food && food.note) || "",
      practicalTip: dayData.practicalTip || pickByDay(date, data.practicalTips) || "",
      heroSubline: dayData.heroSubline || "Genova"
    };
  }

  function formatFullDate(date){
    var text = new Intl.DateTimeFormat("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  window.AGENDA_TODAY_UTILS = {
    formatMMDD: formatMMDD,
    formatFullDate: formatFullDate,
    getAstronomy: getAstronomy,
    getMoon: getMoon,
    getEditorial: getEditorial
  };
})();
