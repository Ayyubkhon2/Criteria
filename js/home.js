
/* Ripple effect + click logic + swipe */
document.addEventListener('DOMContentLoaded', () => {
  const chart = document.querySelector('.chart');
  const quarterBtns = Array.from(document.querySelectorAll('.chart__quarter-btn'));
  const yearSelectorEl = document.querySelector('.chart__header-year-selector');

  if (!chart || quarterBtns.length === 0) return; // safety

  // Use global currentYear/currentQuarter if present; fallback if not
  if (typeof window.currentYear === 'undefined') window.currentYear = (new Date()).getFullYear();
  if (typeof window.currentQuarter === 'undefined') window.currentQuarter = 1;

  // Helper: get year numeric value (adjust if your yearSelector is a <select>)
  function getSelectedYear() {
    if (!yearSelectorEl) return window.currentYear;
    // if yearSelector is a button showing year text:
    const txt = yearSelectorEl.textContent.trim();
    const y = parseInt(txt, 10);
    return Number.isFinite(y) ? y : window.currentYear;
  }

  // Activate quarter by zero-based index
  function activateQuarterIndex(idx) {
    idx = Math.max(0, Math.min(quarterBtns.length - 1, idx));
    quarterBtns.forEach((b, i) => b.classList.toggle('chart__quarter-btn--active', i === idx));
    // update global currentQuarter (1-based)
    window.currentQuarter = parseInt(quarterBtns[idx].dataset.quarter, 10) || (idx + 1);
    // call your existing chart update
    updateChart(getSelectedYear(), window.currentQuarter);
    // debug: console.log('Activated quarter', window.currentQuarter);
  }

  // --- initialize from existing active button (if any) ---
  const activeBtn = document.querySelector('.chart__quarter-btn.chart__quarter-btn--active');
  if (activeBtn) {
    const idx = quarterBtns.indexOf(activeBtn);
    if (idx >= 0) activateQuarterIndex(idx);
  } else {
    activateQuarterIndex(0);
  }

  // --- Click + Ripple handler ---
  quarterBtns.forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      // ripple (safe clientX/clientY fallback)
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const circle = document.createElement('span');
      circle.className = 'ripple';
      circle.style.width = circle.style.height = `${size}px`;
      const clientX = (e.clientX !== undefined) ? e.clientX : (rect.left + rect.width / 2);
      const clientY = (e.clientY !== undefined) ? e.clientY : (rect.top + rect.height / 2);
      circle.style.left = `${clientX - rect.left - size / 2}px`;
      circle.style.top = `${clientY - rect.top - size / 2}px`;
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);

      // activate
      activateQuarterIndex(idx);
    });
  });

  // --- Swipe (touch + mouse drag) ---
  let startX = null;
  let pointerDown = false;

  function onPointerStart(x) {
    startX = x;
    pointerDown = true;
  }
  function onPointerEnd(x) {
    if (!pointerDown || startX === null) { pointerDown = false; startX = null; return; }
    const diff = x - startX;
    const threshold = 50;
    const currentIndex = quarterBtns.findIndex(b => b.classList.contains('chart__quarter-btn--active'));
    if (Math.abs(diff) > threshold) {
      if (diff > 0) activateQuarterIndex(currentIndex - 1); // swipe right -> prev
      else activateQuarterIndex(currentIndex + 1);         // swipe left -> next
    }
    pointerDown = false;
    startX = null;
  }

  // touch events
  chart.addEventListener('touchstart', e => onPointerStart(e.touches[0].clientX), { passive: true });
  chart.addEventListener('touchend', e => onPointerEnd(e.changedTouches[0].clientX), { passive: true });

  // mouse drag support (for desktop testing)
  chart.addEventListener('mousedown', e => onPointerStart(e.clientX));
  window.addEventListener('mouseup', e => onPointerEnd(e.clientX));
  // optional: prevent text selection when dragging
  chart.addEventListener('dragstart', e => e.preventDefault());
});



// Parallax effect
(function() {
  const body = document.body;
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    lastScroll = window.scrollY || window.pageYOffset;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // small parallax factor (smaller = more subtle)
        const factor = 0.12;
        // translateY is hardware-accelerated and performant:
        body.style.transform = `translate3d(0, ${lastScroll * factor * -1}px, 0)`;
        // keep a fallback background-position tweak (optional)
        body.style.backgroundPosition = `center calc(50% + ${lastScroll * factor}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();



/* Typewriter */
let typewriterTimer; // global timer reference

function startTypewriter() {
  const part1 = i18next.t("part1");
  const part2 = i18next.t("part2");
  const element = document.querySelector(".hero__text");
  element.innerHTML = "";

  // clear any old typewriter
  if (typewriterTimer) clearTimeout(typewriterTimer);

  let index = 0,
    part = 1;

  function type() {
    if (part === 1 && index < part1.length) {
      element.innerHTML += part1.charAt(index);
      index++;
      typewriterTimer = setTimeout(type, 75);
    } else if (part === 1 && index === part1.length) {
      element.innerHTML += "<br>";
      index = 0;
      part = 2;
      typewriterTimer = setTimeout(type, 100);
    } else if (part === 2 && index < part2.length) {
      element.innerHTML += part2.charAt(index);
      index++;
      typewriterTimer = setTimeout(type, 75);
    }
  }

  type();
}

/* Chart lines */
const barsContainer = document.querySelector(".chart__bars");

function renderChartLines() {
  if (!barsContainer) return;

  // Clear only the old lines (not the whole bars container if it has other children)
  barsContainer
    .querySelectorAll(".line-container")
    .forEach((line) => line.remove());

  // determine scale factor based on window size
  let scale = 1;
  if (window.innerWidth < 400) {
    scale = 0.17;
  } else if (window.innerWidth < 450) {
    scale = 0.19;
  } else if (window.innerWidth < 500) {
    scale = 0.22;
  } else if (window.innerWidth < 550) {
    scale = 0.26;
  } else if (window.innerWidth < 600) {
    scale = 0.29;
  } else if (window.innerWidth < 650) {
    scale = 0.32;
  } else if (window.innerWidth < 700) {
    scale = 0.35;
  } else if (window.innerWidth < 750) {
    scale = 0.38;
  } else if (window.innerWidth < 800) {
    scale = 0.41;
  } else if (window.innerWidth < 850) {
    scale = 0.43;
  } else if (window.innerWidth < 900) {
    scale = 0.45;
  } else if (window.innerWidth < 950) {
    scale = 0.5;
  } else if (window.innerWidth < 1000) {
    scale = 0.55;
  } else if (window.innerWidth < 1050) {
    scale = 0.62;
  } else if (window.innerWidth < 1100) {
    scale = 0.66;
  } else if (window.innerWidth < 1150) {
    scale = 0.78;
  } else if (window.innerWidth < 1200) {
    scale = 0.83;
  } else if (window.innerWidth < 1250) {
    scale = 0.93;
  }

  // base step (104px) × scale
  const stepWidth = 104 * scale;

  for (let i = 0; i <= 10; i++) {
    const line = document.createElement("div");
    line.className = "line-container";

    line.style.left = i === 0 ? "0" : `${i * stepWidth}px`;
    if (i === 0) line.style.justifyContent = "flex-start";

    line.innerHTML = `
      <div class="vertical-line"></div>
      <span class="line-number">${i * 50}</span>
    `;

    barsContainer.appendChild(line);
  }
}

// render once and update on resize
renderChartLines();
window.addEventListener("resize", renderChartLines);

/* Legend label offset */
document.querySelectorAll(".legend__label").forEach((label) => {
  if (label.dataset.offset) label.style.top = label.dataset.offset + "px";
});

/* Mock chart data for years 2025–2020 */
const chartData = {
  2025: {
    headerNumbers: { AO: 691, OOO: 37 },
    1: {
      A: [
        {
          width: 40,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 55,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 20,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 35,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 50,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 45,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 60,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 25,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 50,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    2: {
      A: [
        {
          width: 20,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 25,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 15,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 30,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 40,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 15,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 20,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 35,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 40,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    3: {
      A: [
        {
          width: 30,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 35,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 15,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 40,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 20,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 15,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 50,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 15,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 30,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    4: {
      A: [
        {
          width: 40,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 35,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 10,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 35,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 40,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 25,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 30,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 25,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 40,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
  },
  2024: {
    headerNumbers: { AO: 676, OOO: 32 },
    1: {
      A: [
        {
          width: 40,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 55,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 20,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 35,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 50,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 45,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 60,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 25,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 50,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    2: {
      A: [
        {
          width: 20,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 25,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 15,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 30,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 40,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 15,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 20,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 35,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 40,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    3: {
      A: [
        {
          width: 30,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 35,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 15,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 40,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 20,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 15,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 50,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 15,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 30,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    4: {
      A: [
        {
          width: 40,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 35,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 10,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 35,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 40,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 25,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 30,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 25,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 40,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
  },
  2023: {
    headerNumbers: { AO: 651, OOO: 27 },
    1: {
      A: [
        {
          width: 40,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 55,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 20,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 35,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 50,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 45,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 60,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 25,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 50,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    2: {
      A: [
        {
          width: 20,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 25,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 15,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 30,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 40,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 15,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 20,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 35,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 40,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    3: {
      A: [
        {
          width: 30,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 35,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 15,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 40,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 20,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 15,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 50,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 15,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 30,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    4: {
      A: [
        {
          width: 40,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 35,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 10,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 35,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 40,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 25,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 30,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 25,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 40,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
  },
  2022: {
    headerNumbers: { AO: 628, OOO: 23 },
    1: {
      A: [
        {
          width: 40,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 55,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 20,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 35,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 50,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 45,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 60,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 25,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 50,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    2: {
      A: [
        {
          width: 20,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 25,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 15,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 30,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 40,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 15,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 20,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 35,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 40,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    3: {
      A: [
        {
          width: 30,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 35,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 15,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 40,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 20,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 15,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 50,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 15,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 30,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    4: {
      A: [
        {
          width: 40,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 35,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 10,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 35,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 40,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 25,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 30,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 25,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 40,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
  },
  2021: {
    headerNumbers: { AO: 601, OOO: 17 },
    1: {
      A: [
        {
          width: 40,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 55,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 20,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 35,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 50,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 45,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 60,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 25,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 50,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    2: {
      A: [
        {
          width: 20,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 25,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 15,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 30,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 40,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 15,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 20,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 35,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 40,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    3: {
      A: [
        {
          width: 30,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 35,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 15,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 40,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 20,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 15,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 50,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 15,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 30,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    4: {
      A: [
        {
          width: 40,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 35,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 10,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 35,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 40,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 25,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 30,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 25,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 40,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
  },
  2020: {
    headerNumbers: { AO: 593, OOO: 12 },
    1: {
      A: [
        {
          width: 40,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 55,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 20,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 35,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 50,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 45,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 60,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 25,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 50,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    2: {
      A: [
        {
          width: 20,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 25,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 15,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 30,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 40,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 15,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 20,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 35,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 40,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    3: {
      A: [
        {
          width: 30,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 35,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 15,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 40,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 20,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 15,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 50,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 15,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 30,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
    4: {
      A: [
        {
          width: 40,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
          borderWidth: 16,
        },
        {
          width: 35,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderWidth: 8,
        },
        {
          width: 10,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderWidth: 11,
        },
      ],
      B: [
        {
          width: 35,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 40,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderWidth: 8,
        },
        {
          width: 30,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderWidth: 11,
        },
      ],
      C: [
        {
          width: 25,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderWidth: 16,
        },
        {
          width: 30,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderWidth: 8,
        },
        {
          width: 25,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderWidth: 11,
        },
      ],
      D: [
        {
          width: 40,
          tooltip: "DDD → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderWidth: 16,
        },
      ],
    },
  },
};

/* Current selected year and quarter */
let currentYear = 2025;
let currentQuarter = 1;

/* Elements */
const chartBars = document.querySelectorAll(".bar");
const chartHeaderNumbers = document.querySelector(".chart__header-numbers");
const chartTooltip = document.getElementById("tooltip");
const quarterButtons = document.querySelectorAll(".chart__quarter-btn");
const yearSelector = document.querySelector(".chart__header-year-selector");

/* Function to update chart */
function updateChart(year, quarter) {
  const headerNums = chartData[year].headerNumbers;
  const chartHeaderNumbers = document.querySelector(".chart__header-numbers");

  chartHeaderNumbers.textContent = i18next.t(chartHeaderNumbers.dataset.i18n, {
    AO: headerNums.AO,
    OOO: headerNums.OOO,
  });

  // Update bars
  const quarterData = chartData[year][quarter];
  const barGroups = document.querySelectorAll(".bar-group");

  barGroups.forEach((groupEl) => {
    const groupKey = groupEl.dataset.group; // "A" / "B" / "C" / "D"
    const groupData = quarterData[groupKey] || [];
    const bars = groupEl.querySelectorAll(".bar");

    bars.forEach((bar, i) => {
      if (groupData[i]) {
        const d = groupData[i];

        // Hide first to allow re-animation
        bar.style.display = "none";
        bar.style.width = "0";

        // Apply styles
        bar.style.background = d.bg;
        bar.style.borderRight = `${d.borderWidth}px solid ${d.border}`;
        bar.dataset.tooltip = d.tooltip;

        // Force reflow, then animate
        setTimeout(() => {
          bar.style.display = "block";
          requestAnimationFrame(() => {
            bar.style.width = d.width + "%";
          });
        }, 50);

      } else {
        bar.style.display = "none";
      }
    });
  });
}

// ✅ Trigger animation once when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const defaultYear = Object.keys(chartData)[0];
  const defaultQuarter = Object.keys(chartData[defaultYear])[0];
  updateChart(defaultYear, defaultQuarter);
});


/* Tooltip */
chartBars.forEach((bar) => {
  bar.addEventListener("mouseenter", () => {
    chartTooltip.innerText = bar.dataset.tooltip;
    chartTooltip.classList.add("visible");
    chartTooltip.style.background = getComputedStyle(bar).backgroundColor;
  });

  bar.addEventListener("mousemove", (e) => {
    chartTooltip.style.left = e.pageX + 15 + "px";
    chartTooltip.style.top = e.pageY - 10 + "px";
  });

  bar.addEventListener("mouseleave", () => {
    chartTooltip.classList.remove("visible");
  });
});


/* Year selector dropdown logic */
const yearDropdown = document.createElement("ul");
yearDropdown.classList.add("chart__year-dropdown");
const rect = yearSelector.getBoundingClientRect();
const parentRect = yearSelector.parentElement.getBoundingClientRect();

yearDropdown.style.position = "absolute";
const parent = yearSelector.parentElement;
if (getComputedStyle(parent).position === "static") parent.style.position = "relative";
const leftPx = rect.left - parentRect.left + parent.scrollLeft;
const topPx  = rect.bottom - parentRect.top + parent.scrollTop;
yearDropdown.style.left = Math.round(leftPx) + "px";
yearDropdown.style.top  = Math.round(topPx)  + "px";


yearSelector.parentElement.style.position = "relative";
yearDropdown.style.background = "#fff";
yearDropdown.style.border = "0.1rem solid #ccc";  
yearDropdown.style.listStyle = "none";
yearDropdown.style.padding = "0";
yearDropdown.style.display = "none";
yearDropdown.style.borderRadius = "1rem";

const style = document.createElement("style");
style.innerHTML = `
  .chart__year-dropdown li:hover {
    background-color: #f0f0f0;  
    cursor: pointer;  
    border-radius: 1rem;   
  }
`;
document.head.appendChild(style);


yearSelector.parentElement.appendChild(yearDropdown);

/* Populate years */
for (let y = 2025; y >= 2020; y--) {
  const li = document.createElement("li");
  li.textContent = y;
  li.style.padding = "0.313rem 0.625rem";
  li.style.cursor = "pointer";
  li.addEventListener("click", () => {
    currentYear = y;
    yearSelector.textContent = y;
    yearDropdown.style.display = "none";
    updateChart(currentYear, currentQuarter);
  });
  yearDropdown.appendChild(li);
}

yearSelector.addEventListener("click", () => {
  yearDropdown.style.display =
    yearDropdown.style.display === "block" ? "none" : "block";
});

/* Initial render */
updateChart(currentYear, currentQuarter);

/* Translation */
i18next.init(
  {
    lng: "ru",
    debug: true,
    interpolation: { escapeValue: false },
    resources: {
      ru: {
        translation: {
          nav1: "Главная",
          nav2: "Рейтинг",
          nav3: "Критерии",
          part1: "Рейтинг эмитентов в",
          part2: "сфере рынка ценных бумаг",
          emitent: "Общее количество эмитентов:",
          AO: "AO: {{AO}}; OOO: {{OOO}}",
          year: "Выберите год",
          q1: "1 квартал",
          q2: "2 квартал",
          q3: "3 квартал",
          q4: "4 квартал",
          rating: "Что оцениваем",
          finance: "Финансово-экономические показатели",
          corporate: "Корпоративное управление",
          investment: "Инвестиционная привлекательность",
          category: "Категория надежности",
          score: "Рейтинговая оценка",
          level: "Уровень надежности",
          points: "Баллы",
          level_a1: "Уровень 1 - высокий",
          level_a2: "Уровень 2 - высокий",
          level_a3: "Уровень 3 - высокий",
          points_a1: "61-71 баллов",
          points_a2: "56-60 баллов",
          points_a3: "51-55 баллов",
          level_b1: "Уровень 1 - средний",
          level_b2: "Уровень 2 - средний",
          level_b3: "Уровень 3 - средний",
          points_b1: "46-50 баллов",
          points_b2: "41-45 баллов",
          points_b3: "36-40 баллов",
          level_c1: "Уровень 1 - удовлетворительный",
          level_c2: "Уровень 2 - удовлетворительный",
          level_c3: "Уровень 3 - удовлетворительный",
          points_c1: "31-35 баллов",
          points_c2: "26-30 баллов",
          points_c3: "21-25 баллов",
          level_d: "низкий",
          points_d: "менее 20 баллов",
          footer:"© 2025 Все права защищены. Национальное агентство перспективных проектов",
        },
      },
      en: {
        translation: {
          nav1: "Home",
          nav2: "Rating",
          nav3: "Criteria",
          part1: "Issuer rating in",
          part2: "the securities market",
          emitent: "Total number of issuers:",
          AO: "JSC: {{AO}}; LLC: {{OOO}}",
          year: "Choose a year",
          q1: "1 quarter",
          q2: "2 quarters",
          q3: "3 quarters",
          q4: "4 quarters",
          rating: "What we are grading",
          finance: "Financial and Economic Indicators",
          corporate: "Corporate Governance",
          investment: "Investment Attractiveness",
          category: "Reliability category",
          score: "Rating Assessment",
          level: "Reliability level",
          points: "Points",
          level_a1: "Level 1 - high",
          level_a2: "Level 2 - high",
          level_a3: "Level 3 - high",
          points_a1: "61-71 points",
          points_a2: "56-60 points",
          points_a3: "51-55 points",
          level_b1: "Level 1 - Medium",
          level_b2: "Level 2 - Medium",
          level_b3: "Level 3 - Medium",
          points_b1: "46-50 points",
          points_b2: "41-45 points",
          points_b3: "36-40 points",
          level_c1: "Level 1 - satisfactory",
          level_c2: "Level 2 - satisfactory",
          level_c3: "Level 3 - satisfactory",
          points_c1: "31-35 points",
          points_c2: "26-30 points",
          points_c3: "21-25 points",
          level_d: "low",
          points_d: "under 20 points",
          footer:"© 2025 All rights reserved. National Agency of Perspective Projects",
        },
      },
      uz: {
        translation: {
          nav1: "Bosh sahifa",
          nav2: "Reyting",
          nav3: "Mezon",
          part1: "Emitentlar reytingi",
          part2: "qimmatli qog’ozlar bozorida",
          emitent: "Emitentlar umumiy soni:",
          AO: "AJ: {{AO}}; MChJ: {{OOO}}",
          year: "Yilni tanlang",
          q1: "1 chorak",
          q2: "2 chorak",
          q3: "3 chorak",
          q4: "4 chorak",
          rating: "Nimani baholaymiz",
          finance: "Moliyaviy-iqtisodiy ko‘rsatkichlar",
          corporate: "Korporativ boshqaruv",
          investment: "Investitsion jozibadorlik",
          category: "Ishonchlilik toifasi",
          score: "Reyting bahosi",
          level: "Ishonchlilik darajasi",
          points: "Ballar",
          level_a1: "1-daraja yuqori",
          level_a2: "2-daraja - yuqori",
          level_a3: "3-daraja yuqori",
          points_a1: "61-71 ball",
          points_a2: "56-60 ball",
          points_a3: "51-55 ball",
          level_b1: "1-daraja - o‘rta",
          level_b2: "2-daraja - o‘rta",
          level_b3: "3-daraja - o‘rta",
          points_b1: "46-50 ball",
          points_b2: "41-45 ball",
          points_b3: "36-40 ball",
          level_c1: "1-daraja qoniqarli",
          level_c2: "2-daraja - qoniqarli",
          level_c3: "3-daraja qoniqarli",
          points_c1: "31-35 ball",
          points_c2: "26-30 ball",
          points_c3: "21-25 ball",
          level_d: "past",
          points_d: "20 balldan kam",
          footer: "© 2025 Barcha huquqlar himoyalangan. Istiqbolli loyihalar milliy agentligi",
        },
      },
    },
  },
  function (err, t) {
    updateContent();
    updateChart(currentYear, currentQuarter);
    startTypewriter();
  }
);

function changeLang(lang) {
  i18next.changeLanguage(lang, () => {
    updateContent();
    updateChart(currentYear, currentQuarter);

    // stop old typewriter before starting new one
    if (typewriterTimer) clearTimeout(typewriterTimer);
    startTypewriter();
  });
}

