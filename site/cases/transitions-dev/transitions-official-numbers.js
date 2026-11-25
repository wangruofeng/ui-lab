import { t } from "../../app/locale.js";

/* Transitions.dev by Jakub Antalik, P9 and P26 public demos.
 * Source: https://transitions.dev/detail.html (2026-11-24 snapshot).
 * See transitions-dev-LICENSE.md.
 */

// The UI Lab adapter scopes token reads and event listeners to the mounted demo.
// Read a CSS time variable ("--foo-dur") and return it as ms.
function readMs(el, name, fallback) {
  var raw = getComputedStyle(el)
    .getPropertyValue(name).trim();
  if (!raw) return fallback;
  if (raw.slice(-2) === "ms") return parseFloat(raw);
  if (raw.slice(-1) === "s")  return parseFloat(raw) * 1000;
  var n = parseFloat(raw);
  return isNaN(n) ? fallback : n;
}

function p9Set(el, str) {
  var prev = el.getAttribute("data-value");
  if (prev === null) {
    prev = Array.prototype.map.call(el.children, function (c) { return c.textContent; }).join("");
  }
  var same = 0;
  while (same < prev.length && same < str.length && prev[same] === str[same]) same++;
  el.setAttribute("data-value", str);
  el.classList.remove("is-animating");
  el.textContent = "";
  str.split("").forEach(function (ch, i) {
    var fresh = document.createElement("span");
    fresh.className = "p9-char";
    fresh.textContent = ch;
    var fromEnd = str.length - 1 - i;
    var stagger = fromEnd === 1 ? "1" : fromEnd === 0 ? "2" : null;
    if (i < same || ch < "0" || ch > "9") {
      fresh.setAttribute("data-same", "");
      el.appendChild(fresh);
      return;
    }
    var slot = document.createElement("span");
    slot.className = "p9-slot";
    if (stagger) slot.setAttribute("data-stagger", stagger);
    var oldCh = prev[prev.length - (str.length - i)];
    if (oldCh !== undefined && oldCh >= "0" && oldCh <= "9") {
      var old = document.createElement("span");
      old.className = "p9-old";
      old.setAttribute("aria-hidden", "true");
      old.textContent = oldCh;
      slot.appendChild(old);
    }
    slot.appendChild(fresh);
    el.appendChild(slot);
  });
  // Force reflow so re-adding the class replays.
  // eslint-disable-next-line no-unused-expressions
  el.offsetHeight;
  el.classList.add("is-animating");
}

/* ── Prototype 26: Spinning counter ────────────────────────
   Each digit is a drum of 0-9. A rAF loop rolls it through the
   numbers up to its target (plus --p26-spins extra full turns, 0 by
   default), --p26-step-dur per number with --p26-ease across the
   whole roll, and places every digit from its distance to the
   middle: the middle one is on top at --p26-center-scale /
   --p26-center-blur, the ones above and below sit behind it at
   --p26-side-scale / --p26-side-blur / --p26-side-opacity. The target
   lands while still travelling in: it eases to --p26-antic-scale and
   pulls back against the roll, then a spring snaps it into the middle,
   blur clears, the neighbours fade, and it bounces past 100%. */
var P26_STEP = 50 * Math.PI / 180; // drum angle between two digits
var P26_ENTER_MS = 120;            // rest to rolling
var P26_FADE_END = 1.8;            // steps from the middle where a digit is gone
var P26_LAND_AT = 0.6;             // steps from the middle where the target starts landing
var P26_ARRIVE_AT = 0.29;          // share of the spring where it reaches the middle
var P26_CLEAR_MS = 200;            // blur + neighbours clearing at the start of the spring
var P26_SPRING_DAMP = 3;
var P26_SPRING_FREQ = 3;
function p26ReadNum(el, name, fallback) {
  var v = parseFloat(
    getComputedStyle(el).getPropertyValue(name));
  return isNaN(v) ? fallback : v;
}
// Length tokens are in em (and blur is a max() curve), so they are
// measured in px on the drum itself, at its own font size.
function p26ReadLen(el, name, fallbackEm) {
  var probe = document.createElement("span");
  probe.style.cssText = "position:absolute;visibility:hidden;width:var(" + name + ")";
  el.appendChild(probe);
  var px = probe.getBoundingClientRect().width;
  probe.remove();
  return px || fallbackEm * (parseFloat(getComputedStyle(el).fontSize) || 24);
}
// cubic-bezier(...) string to a progress function. Falls back to linear.
function p26Curve(el, name, fallback) {
  var raw = getComputedStyle(el).getPropertyValue(name).trim() || fallback;
  var m = raw.match(/cubic-bezier\(([^)]+)\)/);
  var n = m ? m[1].split(",").map(parseFloat) : [0, 0, 1, 1];
  function at(a, b, t) {
    return 3 * a * t * (1 - t) * (1 - t) + 3 * b * t * t * (1 - t) + t * t * t;
  }
  return function (x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var lo = 0, hi = 1, t = x;
    for (var i = 0; i < 20; i++) {
      if (at(n[0], n[2], t) < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return at(n[1], n[3], t);
  };
}
// Damped wave over s = 0-1: starts at 1, crosses 0, swings negative
// (the bounce), rebounds once, ends at 0.
function p26Wave(s) {
  if (s >= 1) return 0;
  return Math.exp(-P26_SPRING_DAMP * s) * Math.cos(P26_SPRING_FREQ * Math.PI * s) * (1 - s);
}
// Deepest negative swing, so --p26-land-peak can set the bounce exactly.
var P26_WAVE_TROUGH = (function () {
  var low = 0;
  for (var i = 1; i < 400; i++) low = Math.min(low, p26Wave(i / 400));
  return -low;
})();
function p26Build(el, str) {
  el.innerHTML = "";
  var cols = [];
  for (var c = 0; c < str.length; c++) {
    var ch = str[c];
    if (ch >= "0" && ch <= "9") {
      var col = document.createElement("span");
      col.className = "p26-col";
      var sizer = document.createElement("span");
      sizer.className = "p26-sizer";
      sizer.textContent = "0";
      col.appendChild(sizer);
      var cells = [];
      for (var k = 0; k < 10; k++) {
        var cell = document.createElement("span");
        cell.className = "p26-digit";
        cell.textContent = String(k);
        col.appendChild(cell);
        cells.push(cell);
      }
      el.appendChild(col);
      cols.push({ cells: cells, digit: +ch });
    } else {
      var sep = document.createElement("span");
      sep.className = "p26-sep";
      sep.textContent = ch;
      el.appendChild(sep);
    }
  }
  return cols;
}
// Shows one digit at rest: no blur, no neighbours, 100%.
function p26Rest(col, digit) {
  col.cells.forEach(function (cell, d) {
    cell.style.transform = "none";
    cell.style.filter = "none";
    cell.style.zIndex = "";
    cell.style.opacity = d === digit ? "1" : "0";
  });
}
function p26Smooth(x) {
  x = Math.max(0, Math.min(1, x));
  return x * x * (3 - 2 * x);
}
// How a digit looks purely from its distance to the middle of the drum.
function p26Look(dist, middle, o) {
  var angle = Math.min(dist * P26_STEP, Math.PI / 2);
  // 1 in the middle, 0 at one step away, below 0 further back.
  var face = (Math.cos(angle) - Math.cos(P26_STEP)) / (1 - Math.cos(P26_STEP));
  return {
    angle: angle,
    scale: o.sideScale + (middle - o.sideScale) * face,
    back: dist <= 1
      ? 1 + (o.sideOpacity - 1) * dist
      : o.sideOpacity * (1 - (dist - 1) / (P26_FADE_END - 1))
  };
}
// Places the ten digits for drum position `pos`. `spread` 0-1 is how
// spun-up the drum is (neighbours + blur); `middle` is the middle
// digit's scale. `land` overrides the target digit while it lands.
function p26Place(col, pos, spread, middle, o, land) {
  var radius = o.offset / Math.sin(P26_STEP);
  col.cells.forEach(function (cell, d) {
    var p = ((d - pos) % 10 + 10) % 10;
    if (p > 5) p -= 10;
    var dist = Math.abs(p);
    if (dist >= P26_FADE_END) { cell.style.opacity = "0"; return; }
    var look = p26Look(dist, middle, o);
    // Upcoming digits sit above the middle, so the drum turns downward.
    var y = (p < 0 ? 1 : -1) * radius * Math.sin(look.angle);
    var blur = (o.centerBlur + (o.sideBlur - o.centerBlur) * Math.min(dist, 1)) * spread;
    // Only digits away from the middle follow `spread`.
    var away = Math.max(0, Math.min(1, (dist - 0.3) / 0.5));
    var opacity = look.back * (1 - (1 - spread) * away);
    var scale = look.scale;
    var z = 100 - Math.round(dist * 10);
    if (land && d === col.digit) {
      y = y * land.arrive + land.lift;
      scale = land.scale;
      opacity = land.opacity;
      z = 200;
    }
    cell.style.transform = "translateY(" + y.toFixed(2) + "px) scale(" + scale.toFixed(4) + ")";
    cell.style.filter = blur > 0.01 ? "blur(" + blur.toFixed(2) + "px)" : "none";
    cell.style.opacity = opacity.toFixed(3);
    cell.style.zIndex = String(z);
  });
}
function p26Spin(el) {
  // First run: --p26-from to --p26-target. After that it carries on from
  // the number on screen to a random three-digit one.
  var from = el._p26Value;
  var target;
  if (from === undefined) {
    from = Math.round(p26ReadNum(el, "--p26-from", 100));
    target = Math.round(p26ReadNum(el, "--p26-target", 178));
  } else {
    do { target = 100 + Math.floor(Math.random() * 900); } while (target === from);
  }
  el._p26Value = target;
  var str = target.toLocaleString("en-US");
  var spins = Math.max(0, Math.round(p26ReadNum(el, "--p26-spins", 0)));
  var stepDur = readMs(el, "--p26-step-dur", 130);
  var stagger = readMs(el, "--p26-stagger", 90);
  var anticDur = readMs(el, "--p26-antic-dur", 100);
  var landDur = readMs(el, "--p26-land-dur", 740);
  var anticScale = p26ReadNum(el, "--p26-antic-scale", 0.94);
  var anticLift = p26ReadLen(el, "--p26-antic-lift", 0.125);
  var landPeak = p26ReadNum(el, "--p26-land-peak", 1.03);
  var centerScale = p26ReadNum(el, "--p26-center-scale", 0.9);
  var ease = p26Curve(el, "--p26-ease", "cubic-bezier(0.35, -0.02, 0.43, 1)");
  var o = {
    offset: p26ReadLen(el, "--p26-side-offset", 0.52),
    sideScale: p26ReadNum(el, "--p26-side-scale", 0.7),
    sideBlur: p26ReadLen(el, "--p26-side-blur", 0.083),
    sideOpacity: p26ReadNum(el, "--p26-side-opacity", 0.17),
    centerBlur: p26ReadLen(el, "--p26-center-blur", 0.042)
  };
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.setAttribute("aria-label", str);
  if (el._p26RafId) window.cancelAnimationFrame(el._p26RafId);
  var cols = p26Build(el, str);
  if (reduce) {
    cols.forEach(function (c) { p26Rest(c, c.digit); });
    return;
  }
  // Each column starts on its digit of the old number, aligned from the right.
  var fromDigits = String(from).padStart(cols.length, "0").slice(-cols.length);
  cols.forEach(function (c, i) {
    c.from = +fromDigits[i];
    p26Rest(c, c.from);
    // A digit that doesn't change has nothing to do.
    if (spins === 0 && c.from === c.digit) c.done = true;
  });
  var t0 = performance.now();
  (function tick() {
    if (!el.isConnected) return;
    var t = performance.now() - t0;
    var running = false;
    cols.forEach(function (c, i) {
      if (c.done) return;
      var local = t - i * stagger;
      if (local <= 0) { running = true; return; }
      var total = spins * 10 + ((c.digit - c.from + 10) % 10);
      // Time per number is fixed, so a longer roll takes longer.
      var pos = c.from + total * ease(local / (total * stepDur));
      var enter = Math.min(1, local / P26_ENTER_MS);
      if (c.landAt === undefined && c.from + total - pos < P26_LAND_AT) c.landAt = t;
      var since = c.landAt === undefined ? -1 : t - c.landAt;
      if (since >= anticDur + landDur) {
        p26Rest(c, c.digit);
        c.done = true;
        return;
      }
      running = true;
      var middle = 1 + (centerScale - 1) * enter;
      var spread = enter;
      var land = null;
      if (since >= 0) {
        // Start from how the target looks right now, so nothing jumps.
        if (!c.landFrom) c.landFrom = p26Look(c.from + total - pos, middle, o);
        var arrive = 1 - p26Smooth(since / (anticDur + landDur * P26_ARRIVE_AT));
        if (since < anticDur) {
          var a = p26Smooth(since / anticDur);
          land = {
            scale: c.landFrom.scale + (anticScale - c.landFrom.scale) * a,
            lift: -anticLift * a,
            opacity: c.landFrom.back + (1 - c.landFrom.back) * a,
            arrive: arrive
          };
        } else {
          var sp = since - anticDur;
          var sn = sp / landDur;
          var wave = p26Wave(sn);
          // Before the first crossing it rises out of the dip; after that
          // the wave swings around 100%, peaking at --p26-land-peak.
          land = {
            scale: sn < 1 / (2 * P26_SPRING_FREQ)
              ? 1 + (anticScale - 1) * wave
              : 1 - (landPeak - 1) * wave / P26_WAVE_TROUGH,
            lift: -anticLift * wave,
            opacity: 1,
            arrive: arrive
          };
          spread = 1 - Math.min(1, sp / P26_CLEAR_MS);
        }
      }
      p26Place(c, pos, spread, middle, o, land);
    });
    el._p26RafId = running ? window.requestAnimationFrame(tick) : null;
  })();
}

export const transitionsOfficialNumberDemos = {
  "number-pop-in": {
    markup: `<div class="td-stack td-official-number">
      <div class="p9-number" data-proto-number aria-live="polite"><span class="p9-char">6</span><span class="p9-char">5</span><span class="p9-char">.</span><span class="p9-char">7</span><span class="p9-char">8</span></div>
      <button type="button" data-demo-toolbar>${t("更新数字", "Update")}</button>
    </div>`,
    connect(stage) {
      const number = stage.querySelector("[data-proto-number]");
      stage.querySelector("button").addEventListener("click", () => {
        const integer = Math.floor(Math.random() * 90) + 10;
        const decimal = Math.floor(Math.random() * 100);
        p9Set(number, String(integer) + "." + String(decimal).padStart(2, "0"));
      });
    },
  },
  "spinning-counter": {
    markup: `<div class="td-stack td-official-number">
      <div class="p26-value" data-proto-reel aria-label="${t("计数", "Count")}"></div>
      <button type="button" data-demo-toolbar>${t("更新数字", "Update")}</button>
    </div>`,
    connect(stage) {
      const reel = stage.querySelector("[data-proto-reel]");
      const initial = Math.round(p26ReadNum(reel, "--p26-from", 100)).toLocaleString("en-US");
      reel.setAttribute("aria-label", initial);
      p26Build(reel, initial).forEach(column => p26Rest(column, column.digit));
      stage.querySelector("button").addEventListener("click", () => p26Spin(reel));
    },
  },
};
