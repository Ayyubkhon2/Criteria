// Ripple effect + click logic + swipe 
document.addEventListener("DOMContentLoaded", () => {
  const chart = document.querySelector(".chart");
  const quarterBtns = Array.from(
    document.querySelectorAll(".chart__quarter-btn")
  );
  const yearSelectorEl = document.querySelector(".chart__header-year-selector");

  if (!chart || quarterBtns.length === 0) return;

  if (typeof window.currentYear === "undefined")
    window.currentYear = new Date().getFullYear();
  if (typeof window.currentQuarter === "undefined") window.currentQuarter = 1;

  function getSelectedYear() {
    if (!yearSelectorEl) return window.currentYear;
    const txt = yearSelectorEl.textContent.trim();
    const y = parseInt(txt, 10);
    return Number.isFinite(y) ? y : window.currentYear;
  }

  function activateQuarterIndex(idx) {
    idx = Math.max(0, Math.min(quarterBtns.length - 1, idx));
    quarterBtns.forEach((b, i) =>
      b.classList.toggle("chart__quarter-btn--active", i === idx)
    );
    window.currentQuarter =
      parseInt(quarterBtns[idx].dataset.quarter, 10) || idx + 1;
    updateChart(getSelectedYear(), window.currentQuarter);
  }

  const activeBtn = document.querySelector(
    ".chart__quarter-btn.chart__quarter-btn--active"
  );
  if (activeBtn) {
    const idx = quarterBtns.indexOf(activeBtn);
    if (idx >= 0) activateQuarterIndex(idx);
  } else {
    activateQuarterIndex(0);
  }

  //  Click + Ripple handler
  quarterBtns.forEach((btn, idx) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const circle = document.createElement("span");
      circle.className = "ripple";
      circle.style.width = circle.style.height = `${size}px`;
      const clientX =
        e.clientX !== undefined ? e.clientX : rect.left + rect.width / 2;
      const clientY =
        e.clientY !== undefined ? e.clientY : rect.top + rect.height / 2;
      circle.style.left = `${clientX - rect.left - size / 2}px`;
      circle.style.top = `${clientY - rect.top - size / 2}px`;
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 1000);

      activateQuarterIndex(idx);
    });
  });

  // Swipe  
  let startX = null;
  let pointerDown = false;

  function onPointerStart(x) {
    startX = x;
    pointerDown = true;
  }
  function onPointerEnd(x) {
    if (!pointerDown || startX === null) {
      pointerDown = false;
      startX = null;
      return;
    }
    const diff = x - startX;
    const threshold = 50;
    const currentIndex = quarterBtns.findIndex((b) =>
      b.classList.contains("chart__quarter-btn--active")
    );
    if (Math.abs(diff) > threshold) {
      if (diff > 0) activateQuarterIndex(currentIndex - 1);
      else activateQuarterIndex(currentIndex + 1);
    }
    pointerDown = false;
    startX = null;
  }

  // touch events
  chart.addEventListener(
    "touchstart",
    (e) => onPointerStart(e.touches[0].clientX),
    { passive: true }
  );
  chart.addEventListener(
    "touchend",
    (e) => onPointerEnd(e.changedTouches[0].clientX),
    { passive: true }
  );

  chart.addEventListener("mousedown", (e) => onPointerStart(e.clientX));
  window.addEventListener("mouseup", (e) => onPointerEnd(e.clientX));
  chart.addEventListener("dragstart", (e) => e.preventDefault());
});

// Parallax effect
(function () {
  const body = document.body;
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    lastScroll = window.scrollY || window.pageYOffset;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const factor = 0.12;
        body.style.transform = `translate3d(0, ${
          lastScroll * factor * -1
        }px, 0)`;
        body.style.backgroundPosition = `center calc(50% + ${
          lastScroll * factor
        }px)`;
        ticking = false;
      });
      ticking = true;
    }
  }

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (!prefersReduced) {
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();

/* Typewriter */
let typewriterTimer;

function startTypewriter() {
  const part1 = i18next.t("part1");
  const part2 = i18next.t("part2");
  const element = document.querySelector(".hero__text");
  element.innerHTML = "";

  // clear old typewriter
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

  barsContainer
    .querySelectorAll(".chart__line-container")
    .forEach((line) => line.remove());

  const stepWidth = (barsContainer.clientWidth / 500) * 45;

  for (let i = 0; i <= 10; i++) {
    const line = document.createElement("div");
    line.className = "chart__line-container";

    line.style.left = i === 0 ? "0" : `${i * stepWidth}px`;
    if (i === 0) line.style.justifyContent = "flex-start";

    line.innerHTML = `
      <div class="chart__vertical-line"></div>
      <span class="chart__line-number">${i * 50}</span>
    `;

    barsContainer.appendChild(line);
  }
}

renderChartLines();
window.addEventListener("resize", renderChartLines);

/* Mock chart data for years 2025–2020 */
const chartData = {
  2025: {
    headerNumbers: { AO: 691, OOO: 37 },
    1: {
      A: [
        {
          value: 111,
          borderValue: 16,
          tooltip: "AAA → АО — 111 | ООО — 16",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 168,
          tooltip: "AA → АО — 168 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
          borderValue: 8,
        },
        {
          value: 89,
          tooltip: "A → АО — 89 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
          borderValue: 11,
        },
      ],
      B: [
        {
          value: 100,
          tooltip: "BBB → АО — 100 | ООО — 20",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
          borderValue: 20,
        },
        {
          value: 150,
          tooltip: "BB → АО — 150 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
          borderValue: 10,
        },
        {
          value: 90,
          tooltip: "B → АО — 90 | ООО — 15",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
          borderValue: 15,
        },
      ],
      C: [
        {
          value: 120,
          tooltip: "CCC → АО — 120 | ООО — 20",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
          borderValue: 20,
        },
        {
          value: 180,
          tooltip: "CC → АО — 180 | ООО — 15",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
          borderValue: 15,
        },
        {
          value: 95,
          tooltip: "C → АО — 95 | ООО — 12",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
          borderValue: 12,
        },
      ],
      D: [
        {
          value: 130,
          tooltip: "D → АО — 130 | ООО — 18",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
          borderValue: 18,
        },
      ],
    },
    2: {
      A: [
        {
          value: 126,
          borderValue: 14,
          tooltip: "AAA → АО — 100 | ООО — 14",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 89,
          borderValue: 9,
          tooltip: "AA → АО — 120 | ООО — 9",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 75,
          borderValue: 11,
          tooltip: "A → АО — 75 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 95,
          borderValue: 16,
          tooltip: "BBB → АО — 95 | ООО — 16",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 130,
          borderValue: 7,
          tooltip: "BB → АО — 130 | ООО — 7",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 70,
          borderValue: 10,
          tooltip: "B → АО — 70 | ООО — 10",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 110,
          borderValue: 12,
          tooltip: "CCC → АО — 110 | ООО — 12",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 85,
          borderValue: 8,
          tooltip: "CC → АО — 85 | ООО — 8",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 65,
          borderValue: 9,
          tooltip: "C → АО — 65 | ООО — 9",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 90,
          borderValue: 10,
          tooltip: "D → АО — 90 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    3: {
      A: [
        {
          value: 85,
          borderValue: 13,
          tooltip: "AAA → АО — 85 | ООО — 13",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 115,
          borderValue: 11,
          tooltip: "AA → АО — 115 | ООО — 11",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 80,
          borderValue: 10,
          tooltip: "A → АО — 80 | ООО — 10",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 105,
          borderValue: 15,
          tooltip: "BBB → АО — 105 | ООО — 15",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 125,
          borderValue: 6,
          tooltip: "BB → АО — 125 | ООО — 6",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 60,
          borderValue: 8,
          tooltip: "B → АО — 60 | ООО — 8",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 95,
          borderValue: 10,
          tooltip: "CCC → АО — 95 | ООО — 10",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 100,
          borderValue: 12,
          tooltip: "CC → АО — 100 | ООО — 12",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 70,
          borderValue: 7,
          tooltip: "C → АО — 70 | ООО — 7",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 80,
          borderValue: 9,
          tooltip: "D → АО — 80 | ООО — 9",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    4: {
      A: [
        {
          value: 95,
          borderValue: 10,
          tooltip: "AAA → АО — 95 | ООО — 10",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 105,
          borderValue: 12,
          tooltip: "AA → АО — 105 | ООО — 12",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 70,
          borderValue: 11,
          tooltip: "A → АО — 70 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 110,
          borderValue: 14,
          tooltip: "BBB → АО — 110 | ООО — 14",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 120,
          borderValue: 9,
          tooltip: "BB → АО — 120 | ООО — 9",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 65,
          borderValue: 10,
          tooltip: "B → АО — 65 | ООО — 10",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 100,
          borderValue: 11,
          tooltip: "CCC → АО — 100 | ООО — 11",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 95,
          borderValue: 8,
          tooltip: "CC → АО — 95 | ООО — 8",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 60,
          borderValue: 9,
          tooltip: "C → АО — 60 | ООО — 9",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 85,
          borderValue: 10,
          tooltip: "D → АО — 85 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
  },
  2024: {
    headerNumbers: { AO: 676, OOO: 32 },
    1: {
      A: [
        {
          value: 110,
          borderValue: 12,
          tooltip: "AAA → АО — 90 | ООО — 12",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 86,
          borderValue: 9,
          tooltip: "AA → АО — 110 | ООО — 9",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 114,
          borderValue: 10,
          tooltip: "A → АО — 85 | ООО — 10",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 76,
          borderValue: 15,
          tooltip: "BBB → АО — 100 | ООО — 15",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 97,
          borderValue: 7,
          tooltip: "BB → АО — 135 | ООО — 7",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 32,
          borderValue: 8,
          tooltip: "B → АО — 60 | ООО — 8",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 120,
          borderValue: 12,
          tooltip: "CCC → АО — 85 | ООО — 12",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 56,
          borderValue: 10,
          tooltip: "CC → АО — 95 | ООО — 10",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 89,
          borderValue: 9,
          tooltip: "C → АО — 75 | ООО — 9",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 24,
          borderValue: 4,
          tooltip: "D → АО — 70 | ООО — 11",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    2: {
      A: [
        {
          value: 80,
          borderValue: 10,
          tooltip: "AAA → АО — 80 | ООО — 10",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 95,
          borderValue: 11,
          tooltip: "AA → АО — 95 | ООО — 11",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 70,
          borderValue: 9,
          tooltip: "A → АО — 70 | ООО — 9",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 105,
          borderValue: 12,
          tooltip: "BBB → АО — 105 | ООО — 12",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 115,
          borderValue: 8,
          tooltip: "BB → АО — 115 | ООО — 8",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 85,
          borderValue: 7,
          tooltip: "B → АО — 85 | ООО — 7",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 90,
          borderValue: 10,
          tooltip: "CCC → АО — 90 | ООО — 10",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 100,
          borderValue: 11,
          tooltip: "CC → АО — 100 | ООО — 11",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 65,
          borderValue: 8,
          tooltip: "C → АО — 65 | ООО — 8",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 60,
          borderValue: 9,
          tooltip: "D → АО — 60 | ООО — 9",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    3: {
      A: [
        {
          value: 105,
          borderValue: 10,
          tooltip: "AAA → АО — 105 | ООО — 10",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 120,
          borderValue: 8,
          tooltip: "AA → АО — 120 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 80,
          borderValue: 12,
          tooltip: "A → АО — 80 | ООО — 12",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 115,
          borderValue: 14,
          tooltip: "BBB → АО — 115 | ООО — 14",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 95,
          borderValue: 9,
          tooltip: "BB → АО — 95 | ООО — 9",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 70,
          borderValue: 11,
          tooltip: "B → АО — 70 | ООО — 11",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 85,
          borderValue: 10,
          tooltip: "CCC → АО — 85 | ООО — 10",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 105,
          borderValue: 8,
          tooltip: "CC → АО — 105 | ООО — 8",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 60,
          borderValue: 9,
          tooltip: "C → АО — 60 | ООО — 9",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 65,
          borderValue: 10,
          tooltip: "D → АО — 65 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    4: {
      A: [
        {
          value: 100,
          borderValue: 9,
          tooltip: "AAA → АО — 100 | ООО — 9",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 90,
          borderValue: 11,
          tooltip: "AA → АО — 90 | ООО — 11",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 75,
          borderValue: 10,
          tooltip: "A → АО — 75 | ООО — 10",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 120,
          borderValue: 12,
          tooltip: "BBB → АО — 120 | ООО — 12",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 130,
          borderValue: 9,
          tooltip: "BB → АО — 130 | ООО — 9",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 60,
          borderValue: 8,
          tooltip: "B → АО — 60 | ООО — 8",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 95,
          borderValue: 10,
          tooltip: "CCC → АО — 95 | ООО — 10",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 85,
          borderValue: 12,
          tooltip: "CC → АО — 85 | ООО — 12",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 70,
          borderValue: 10,
          tooltip: "C → АО — 70 | ООО — 10",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 50,
          borderValue: 9,
          tooltip: "D → АО — 50 | ООО — 9",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
  },
  2023: {
    headerNumbers: { AO: 651, OOO: 27 },
    1: {
      A: [
        {
          value: 85,
          borderValue: 12,
          tooltip: "AAA → АО — 85 | ООО — 12",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 95,
          borderValue: 10,
          tooltip: "AA → АО — 95 | ООО — 10",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 105,
          borderValue: 9,
          tooltip: "A → АО — 105 | ООО — 9",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 100,
          borderValue: 14,
          tooltip: "BBB → АО — 100 | ООО — 14",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 115,
          borderValue: 10,
          tooltip: "BB → АО — 115 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 80,
          borderValue: 8,
          tooltip: "B → АО — 80 | ООО — 8",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 90,
          borderValue: 9,
          tooltip: "CCC → АО — 90 | ООО — 9",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 105,
          borderValue: 11,
          tooltip: "CC → АО — 105 | ООО — 11",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 70,
          borderValue: 10,
          tooltip: "C → АО — 70 | ООО — 10",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 55,
          borderValue: 11,
          tooltip: "D → АО — 55 | ООО — 11",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    2: {
      A: [
        {
          value: 110,
          borderValue: 11,
          tooltip: "AAA → АО — 110 | ООО — 11",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 85,
          borderValue: 10,
          tooltip: "AA → АО — 85 | ООО — 10",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 70,
          borderValue: 9,
          tooltip: "A → АО — 70 | ООО — 9",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 105,
          borderValue: 13,
          tooltip: "BBB → АО — 105 | ООО — 13",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 120,
          borderValue: 8,
          tooltip: "BB → АО — 120 | ООО — 8",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 85,
          borderValue: 9,
          tooltip: "B → АО — 85 | ООО — 9",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 95,
          borderValue: 12,
          tooltip: "CCC → АО — 95 | ООО — 12",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 90,
          borderValue: 10,
          tooltip: "CC → АО — 90 | ООО — 10",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 65,
          borderValue: 8,
          tooltip: "C → АО — 65 | ООО — 8",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 60,
          borderValue: 10,
          tooltip: "D → АО — 60 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    3: {
      A: [
        {
          value: 90,
          borderValue: 10,
          tooltip: "AAA → АО — 90 | ООО — 10",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 100,
          borderValue: 12,
          tooltip: "AA → АО — 100 | ООО — 12",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 95,
          borderValue: 9,
          tooltip: "A → АО — 95 | ООО — 9",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 125,
          borderValue: 10,
          tooltip: "BBB → АО — 125 | ООО — 10",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 105,
          borderValue: 8,
          tooltip: "BB → АО — 105 | ООО — 8",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 70,
          borderValue: 11,
          tooltip: "B → АО — 70 | ООО — 11",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 85,
          borderValue: 10,
          tooltip: "CCC → АО — 85 | ООО — 10",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 95,
          borderValue: 9,
          tooltip: "CC → АО — 95 | ООО — 9",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 80,
          borderValue: 8,
          tooltip: "C → АО — 80 | ООО — 8",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 60,
          borderValue: 10,
          tooltip: "D → АО — 60 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    4: {
      A: [
        {
          value: 95,
          borderValue: 11,
          tooltip: "AAA → АО — 95 | ООО — 11",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 105,
          borderValue: 9,
          tooltip: "AA → АО — 105 | ООО — 9",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 85,
          borderValue: 10,
          tooltip: "A → АО — 85 | ООО — 10",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 120,
          borderValue: 10,
          tooltip: "BBB → АО — 120 | ООО — 10",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 95,
          borderValue: 12,
          tooltip: "BB → АО — 95 | ООО — 12",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 80,
          borderValue: 8,
          tooltip: "B → АО — 80 | ООО — 8",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 100,
          borderValue: 10,
          tooltip: "CCC → АО — 100 | ООО — 10",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 90,
          borderValue: 9,
          tooltip: "CC → АО — 90 | ООО — 9",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 70,
          borderValue: 10,
          tooltip: "C → АО — 70 | ООО — 10",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 55,
          borderValue: 11,
          tooltip: "D → АО — 55 | ООО — 11",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
  },
  2022: {
    headerNumbers: { AO: 628, OOO: 23 },
    1: {
      A: [
        {
          value: 95,
          borderValue: 10,
          tooltip: "AAA → АО — 95 | ООО — 10",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 110,
          borderValue: 9,
          tooltip: "AA → АО — 110 | ООО — 9",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 85,
          borderValue: 8,
          tooltip: "A → АО — 85 | ООО — 8",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 100,
          borderValue: 12,
          tooltip: "BBB → АО — 100 | ООО — 12",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 125,
          borderValue: 10,
          tooltip: "BB → АО — 125 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 70,
          borderValue: 9,
          tooltip: "B → АО — 70 | ООО — 9",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 90,
          borderValue: 11,
          tooltip: "CCC → АО — 90 | ООО — 11",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 80,
          borderValue: 10,
          tooltip: "CC → АО — 80 | ООО — 10",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 65,
          borderValue: 8,
          tooltip: "C → АО — 65 | ООО — 8",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 55,
          borderValue: 10,
          tooltip: "D → АО — 55 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    2: {
      A: [
        {
          value: 105,
          borderValue: 12,
          tooltip: "AAA → АО — 105 | ООО — 12",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 95,
          borderValue: 9,
          tooltip: "AA → АО — 95 | ООО — 9",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 70,
          borderValue: 11,
          tooltip: "A → АО — 70 | ООО — 11",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 115,
          borderValue: 10,
          tooltip: "BBB → АО — 115 | ООО — 10",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 120,
          borderValue: 8,
          tooltip: "BB → АО — 120 | ООО — 8",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 80,
          borderValue: 9,
          tooltip: "B → АО — 80 | ООО — 9",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 85,
          borderValue: 12,
          tooltip: "CCC → АО — 85 | ООО — 12",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 90,
          borderValue: 10,
          tooltip: "CC → АО — 90 | ООО — 10",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 65,
          borderValue: 8,
          tooltip: "C → АО — 65 | ООО — 8",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 55,
          borderValue: 10,
          tooltip: "D → АО — 55 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    3: {
      A: [
        {
          value: 90,
          borderValue: 9,
          tooltip: "AAA → АО — 90 | ООО — 9",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 100,
          borderValue: 12,
          tooltip: "AA → АО — 100 | ООО — 12",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 85,
          borderValue: 10,
          tooltip: "A → АО — 85 | ООО — 10",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 130,
          borderValue: 11,
          tooltip: "BBB → АО — 130 | ООО — 11",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 110,
          borderValue: 8,
          tooltip: "BB → АО — 110 | ООО — 8",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 60,
          borderValue: 10,
          tooltip: "B → АО — 60 | ООО — 10",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 95,
          borderValue: 12,
          tooltip: "CCC → АО — 95 | ООО — 12",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 85,
          borderValue: 10,
          tooltip: "CC → АО — 85 | ООО — 10",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 70,
          borderValue: 8,
          tooltip: "C → АО — 70 | ООО — 8",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 45,
          borderValue: 9,
          tooltip: "D → АО — 45 | ООО — 9",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    4: {
      A: [
        {
          value: 105,
          borderValue: 10,
          tooltip: "AAA → АО — 105 | ООО — 10",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 95,
          borderValue: 11,
          tooltip: "AA → АО — 95 | ООО — 11",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 80,
          borderValue: 9,
          tooltip: "A → АО — 80 | ООО — 9",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 120,
          borderValue: 10,
          tooltip: "BBB → АО — 120 | ООО — 10",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 100,
          borderValue: 8,
          tooltip: "BB → АО — 100 | ООО — 8",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 85,
          borderValue: 11,
          tooltip: "B → АО — 85 | ООО — 11",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 90,
          borderValue: 12,
          tooltip: "CCC → АО — 90 | ООО — 12",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 85,
          borderValue: 9,
          tooltip: "CC → АО — 85 | ООО — 9",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 75,
          borderValue: 10,
          tooltip: "C → АО — 75 | ООО — 10",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 50,
          borderValue: 9,
          tooltip: "D → АО — 50 | ООО — 9",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
  },
  2021: {
    headerNumbers: { AO: 601, OOO: 17 },
    1: {
      A: [
        {
          value: 110,
          borderValue: 10,
          tooltip: "AAA → АО — 110 | ООО — 10",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 95,
          borderValue: 9,
          tooltip: "AA → АО — 95 | ООО — 9",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 85,
          borderValue: 8,
          tooltip: "A → АО — 85 | ООО — 8",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 120,
          borderValue: 11,
          tooltip: "BBB → АО — 120 | ООО — 11",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 115,
          borderValue: 9,
          tooltip: "BB → АО — 115 | ООО — 9",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 75,
          borderValue: 10,
          tooltip: "B → АО — 75 | ООО — 10",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 95,
          borderValue: 10,
          tooltip: "CCC → АО — 95 | ООО — 10",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 80,
          borderValue: 9,
          tooltip: "CC → АО — 80 | ООО — 9",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 65,
          borderValue: 8,
          tooltip: "C → АО — 65 | ООО — 8",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 45,
          borderValue: 10,
          tooltip: "D → АО — 45 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    2: {
      A: [
        {
          value: 95,
          borderValue: 11,
          tooltip: "AAA → АО — 95 | ООО — 11",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 100,
          borderValue: 9,
          tooltip: "AA → АО — 100 | ООО — 9",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 85,
          borderValue: 8,
          tooltip: "A → АО — 85 | ООО — 8",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 110,
          borderValue: 12,
          tooltip: "BBB → АО — 110 | ООО — 12",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 105,
          borderValue: 8,
          tooltip: "BB → АО — 105 | ООО — 8",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 75,
          borderValue: 9,
          tooltip: "B → АО — 75 | ООО — 9",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 90,
          borderValue: 10,
          tooltip: "CCC → АО — 90 | ООО — 10",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 80,
          borderValue: 9,
          tooltip: "CC → АО — 80 | ООО — 9",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 70,
          borderValue: 8,
          tooltip: "C → АО — 70 | ООО — 8",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 50,
          borderValue: 10,
          tooltip: "D → АО — 50 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    3: {
      A: [
        {
          value: 105,
          borderValue: 10,
          tooltip: "AAA → АО — 105 | ООО — 10",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 95,
          borderValue: 9,
          tooltip: "AA → АО — 95 | ООО — 9",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 85,
          borderValue: 8,
          tooltip: "A → АО — 85 | ООО — 8",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 110,
          borderValue: 12,
          tooltip: "BBB → АО — 110 | ООО — 12",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 100,
          borderValue: 8,
          tooltip: "BB → АО — 100 | ООО — 8",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 70,
          borderValue: 9,
          tooltip: "B → АО — 70 | ООО — 9",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 90,
          borderValue: 11,
          tooltip: "CCC → АО — 90 | ООО — 11",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 75,
          borderValue: 9,
          tooltip: "CC → АО — 75 | ООО — 9",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 65,
          borderValue: 8,
          tooltip: "C → АО — 65 | ООО — 8",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 45,
          borderValue: 10,
          tooltip: "D → АО — 45 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    4: {
      A: [
        {
          value: 95,
          borderValue: 10,
          tooltip: "AAA → АО — 95 | ООО — 10",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 85,
          borderValue: 9,
          tooltip: "AA → АО — 85 | ООО — 9",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 80,
          borderValue: 8,
          tooltip: "A → АО — 80 | ООО — 8",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 115,
          borderValue: 11,
          tooltip: "BBB → АО — 115 | ООО — 11",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 100,
          borderValue: 9,
          tooltip: "BB → АО — 100 | ООО — 9",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 85,
          borderValue: 10,
          tooltip: "B → АО — 85 | ООО — 10",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 90,
          borderValue: 8,
          tooltip: "CCC → АО — 90 | ООО — 8",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 80,
          borderValue: 9,
          tooltip: "CC → АО — 80 | ООО — 9",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 65,
          borderValue: 10,
          tooltip: "C → АО — 65 | ООО — 10",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 45,
          borderValue: 10,
          tooltip: "D → АО — 45 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
  },
  2020: {
    headerNumbers: { AO: 593, OOO: 12 },
    1: {
      A: [
        {
          value: 100,
          borderValue: 11,
          tooltip: "AAA → АО — 100 | ООО — 11",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 90,
          borderValue: 9,
          tooltip: "AA → АО — 90 | ООО — 9",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 85,
          borderValue: 8,
          tooltip: "A → АО — 85 | ООО — 8",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 120,
          borderValue: 10,
          tooltip: "BBB → АО — 120 | ООО — 10",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 105,
          borderValue: 9,
          tooltip: "BB → АО — 105 | ООО — 9",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 80,
          borderValue: 11,
          tooltip: "B → АО — 80 | ООО — 11",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 95,
          borderValue: 10,
          tooltip: "CCC → АО — 95 | ООО — 10",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 85,
          borderValue: 8,
          tooltip: "CC → АО — 85 | ООО — 8",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 70,
          borderValue: 9,
          tooltip: "C → АО — 70 | ООО — 9",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 50,
          borderValue: 10,
          tooltip: "D → АО — 50 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    2: {
      A: [
        {
          value: 105,
          borderValue: 10,
          tooltip: "AAA → АО — 105 | ООО — 10",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 95,
          borderValue: 8,
          tooltip: "AA → АО — 95 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 80,
          borderValue: 9,
          tooltip: "A → АО — 80 | ООО — 9",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 110,
          borderValue: 11,
          tooltip: "BBB → АО — 110 | ООО — 11",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 100,
          borderValue: 10,
          tooltip: "BB → АО — 100 | ООО — 10",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 85,
          borderValue: 8,
          tooltip: "B → АО — 85 | ООО — 8",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 90,
          borderValue: 9,
          tooltip: "CCC → АО — 90 | ООО — 9",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 80,
          borderValue: 10,
          tooltip: "CC → АО — 80 | ООО — 10",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 70,
          borderValue: 9,
          tooltip: "C → АО — 70 | ООО — 9",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 45,
          borderValue: 10,
          tooltip: "D → АО — 45 | ООО — 10",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    3: {
      A: [
        {
          value: 100,
          borderValue: 8,
          tooltip: "AAA → АО — 100 | ООО — 8",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 90,
          borderValue: 9,
          tooltip: "AA → АО — 90 | ООО — 9",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 85,
          borderValue: 10,
          tooltip: "A → АО — 85 | ООО — 10",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 110,
          borderValue: 9,
          tooltip: "BBB → АО — 110 | ООО — 9",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 100,
          borderValue: 8,
          tooltip: "BB → АО — 100 | ООО — 8",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 85,
          borderValue: 9,
          tooltip: "B → АО — 85 | ООО — 9",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 90,
          borderValue: 10,
          tooltip: "CCC → АО — 90 | ООО — 10",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 75,
          borderValue: 9,
          tooltip: "CC → АО — 75 | ООО — 9",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 70,
          borderValue: 8,
          tooltip: "C → АО — 70 | ООО — 8",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 50,
          borderValue: 9,
          tooltip: "D → АО — 50 | ООО — 9",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
    4: {
      A: [
        {
          value: 95,
          borderValue: 9,
          tooltip: "AAA → АО — 95 | ООО — 9",
          bg: "#009A44",
          border: "hsl(146,100%,24%)",
        },
        {
          value: 90,
          borderValue: 8,
          tooltip: "AA → АО — 90 | ООО — 8",
          bg: "#91BD00",
          border: "hsl(74,100%,30%)",
        },
        {
          value: 85,
          borderValue: 9,
          tooltip: "A → АО — 85 | ООО — 9",
          bg: "#A5C91F",
          border: "hsl(73,73%,36%)",
        },
      ],
      B: [
        {
          value: 115,
          borderValue: 10,
          tooltip: "BBB → АО — 115 | ООО — 10",
          bg: "#D9B600",
          border: "hsl(50,100%,34%)",
        },
        {
          value: 100,
          borderValue: 9,
          tooltip: "BB → АО — 100 | ООО — 9",
          bg: "#D9CE04",
          border: "hsl(57,96%,34%)",
        },
        {
          value: 85,
          borderValue: 8,
          tooltip: "B → АО — 85 | ООО — 8",
          bg: "#EFE31E",
          border: "hsl(57,87%,42%)",
        },
      ],
      C: [
        {
          value: 90,
          borderValue: 8,
          tooltip: "CCC → АО — 90 | ООО — 8",
          bg: "#D96400",
          border: "hsl(28,100%,34%)",
        },
        {
          value: 80,
          borderValue: 9,
          tooltip: "CC → АО — 80 | ООО — 9",
          bg: "#D99C00",
          border: "hsl(43,100%,34%)",
        },
        {
          value: 65,
          borderValue: 9,
          tooltip: "C → АО — 65 | ООО — 9",
          bg: "#F0AE13",
          border: "hsl(42,88%,40%)",
        },
      ],
      D: [
        {
          value: 45,
          borderValue: 9,
          tooltip: "D → АО — 45 | ООО — 9",
          bg: "#D92804",
          border: "hsl(10,96%,34%)",
        },
      ],
    },
  },
};

/* Current selected year and quarter */
let currentYear = 2025;
let currentQuarter = 1;

/* Elements */
const chartBars = document.querySelectorAll(".chart__bar");
const chartHeaderNumbers = document.querySelector(".chart__header-numbers");
const chartTooltip = document.getElementById("tooltip");
const quarterButtons = document.querySelectorAll(".chart__quarter-btn");
const yearSelector = document.querySelector(".chart__header-year-selector");

/* Function to update chart */
function updateChart(year, quarter) {
  const headerNums = chartData[year].headerNumbers;
  chartHeaderNumbers.textContent = i18next.t(chartHeaderNumbers.dataset.i18n, {
    AO: headerNums.AO,
    OOO: headerNums.OOO,
  });

  // Update bars
  const quarterData = chartData[year][quarter];
  const barGroups = document.querySelectorAll(".chart__bar-group");

  barGroups.forEach((groupEl) => {
    const groupKey = groupEl.dataset.group;
    const groupData = quarterData[groupKey] || [];
    const bars = groupEl.querySelectorAll(".chart__bar");

    bars.forEach((bar, i) => {
      if (groupData[i]) {
        const d = groupData[i];

        bar.style.display = "none";
        bar.style.width = "0";

        bar.style.background = d.bg;
        bar.style.borderRight = `${d.borderValue}px solid ${d.border}`;
        bar.dataset.tooltip = d.tooltip;

        setTimeout(() => {
          bar.style.display = "block";
          requestAnimationFrame(() => {
            bar.style.width =
              (barsContainer.clientWidth / 500) * d.value + "px";
          });
        }, 50);
      } else {
        bar.style.display = "none";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const defaultYear = String(currentYear);      
  const defaultQuarter = currentQuarter;       
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
  chartTooltip.style.left = e.clientX + 15 + "px";
  chartTooltip.style.top = e.clientY - 10 + "px";
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
if (getComputedStyle(parent).position === "static")
  parent.style.position = "relative";
const leftPx = rect.left - parentRect.left + parent.scrollLeft;
const topPx = rect.bottom - parentRect.top + parent.scrollTop;
yearDropdown.style.left = Math.round(leftPx) + "px";
yearDropdown.style.top = Math.round(topPx) + "px";

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

//Rating color assigning
document
  .querySelectorAll(
    ".rating-table__score, .rating-table__category, .rating-table__category--small"
  )
  .forEach((el) => {
    const rating = el.dataset.rating?.toLowerCase();
    if (rating) {
      el.style.color = `var(--color-${rating})`;
    }
  });

/* Translation */
i18next.init(
  {
    lng: savedLang, 
    debug: true,
    interpolation: { escapeValue: false },
    resources: {
      ru: {
        translation: {
          nav1: "Главная",
          nav2: "Рейтинг",
          nav3: "Критерии",
          login: "Войти", 
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
          footer:
            "© 2025 Все права защищены. Национальное агентство перспективных проектов",
        },
      },
      en: {
        translation: {
          nav1: "Home",
          nav2: "Rating",
          nav3: "Criteria",
          login: "Login",
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
          footer:
            "© 2025 All rights reserved. National Agency of Perspective Projects",
        },
      },
      uz: {
        translation: {
          nav1: "Bosh sahifa",
          nav2: "Reyting",
          nav3: "Mezon",
          login: "Kirish",
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
          footer:
            "© 2025 Barcha huquqlar himoyalangan. Istiqbolli loyihalar milliy agentligi",
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

    if (typewriterTimer) clearTimeout(typewriterTimer);
    startTypewriter();
  });
}

