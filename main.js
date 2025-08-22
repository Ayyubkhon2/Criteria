

/* Nav animation */
const navItems = document.querySelectorAll(".nav__item");
const navUnderline = document.querySelector(".nav__underline");

function moveUnderline(el) {
  navUnderline.style.width = el.offsetWidth + "px";
  navUnderline.style.left = el.offsetLeft + "px";
}

moveUnderline(document.querySelector(".nav__item--active"));

navItems.forEach(item => {
  item.addEventListener("click", () => {
    document.querySelector(".nav__item--active").classList.remove("nav__item--active");
    item.classList.add("nav__item--active");
    moveUnderline(item);
  });
});



/* Language dropdown */
const languageDropdown = document.querySelector(".language-dropdown");
const languageBtn = languageDropdown.querySelector(".language-dropdown__btn");
const languageOptions = languageDropdown.querySelectorAll(".language-dropdown__option");

let currentLanguage = "Русский";

languageBtn.addEventListener("click", () => {
  const isActive = languageDropdown.classList.toggle("active");
  languageBtn.textContent = isActive ? "Выберите язык" : currentLanguage;
});

languageOptions.forEach(option => {
  option.addEventListener("click", () => {
    currentLanguage = option.textContent;
    languageBtn.textContent = currentLanguage;
    languageDropdown.classList.remove("active");
    console.log("Language switched to:", option.dataset.lang);
  });
});



/* Translation */
i18next.init({
  lng: "ru",
   debug: true, // optional: helps see logs
  interpolation: { escapeValue: false },
  resources: {
    ru: { translation: { nav1: "Главная", nav2: "Рейтинг", nav3: "Критерии", part1: "Рейтинг эмитентов в", part2: "сфере рынка ценных бумаг", emitent: "Общее количество эмитентов:", AO: "AO: {{AO}}; OOO: {{OOO}}", year: "Выберите год", q1: "1 квартал", q2: "2 квартал", q3: "3 квартал", q4: "4 квартал"  }},
    en: { translation: { nav1: "Home", nav2: "Rating", nav3: "Criteria", part1: "Issuer rating in", part2: "the securities market", emitent: "Total number of issuers:", AO: "JSC: {{AO}}; LLC: {{OOO}}", year: "Choose a year", q1: "1 quarter", q2: "2 quarters", q3: "3 quarters", q4: "4 quarters" }},
    uz: { translation: { nav1: "Bosh sahifa", nav2: "Reyting", nav3: "Mezon", part1: "Emitentlar reytingi", part2: "qimmatli qog'ozlar bozorida", emitent: "Emitentlar umumiy soni:", AO: "AJ: {{AO}}; MChJ: {{OOO}}", year: "Yilni tanlang", q1: "1 chorak", q2: "2 chorak", q3: "3 chorak", q4: "4 chorak" }}
  }
}, function(err, t) {
   
  updateContent();
  startTypewriter();
});

function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = i18next.t(el.getAttribute("data-i18n"));
  });
}

function changeLang(lang) {
  i18next.changeLanguage(lang, () => {
    updateContent();
    startTypewriter();
  });
}

document.querySelector(".language-dropdown__menu").addEventListener("click", e => {
  const li = e.target.closest("li");
  if (li && li.dataset.lang) changeLang(li.dataset.lang);
});

/* Typewriter */
function startTypewriter() {
  const part1 = i18next.t("part1");
  const part2 = i18next.t("part2");
  const element = document.querySelector(".hero__text");
  element.innerHTML = "";
  let index = 0, part = 1;

  function type() {
    if (part === 1 && index < part1.length) {
      element.innerHTML += part1.charAt(index);
      index++;
      setTimeout(type, 100);
    } else if (part === 1 && index === part1.length) {
      element.innerHTML += "<br>";
      index = 0;
      part = 2;
      setTimeout(type, 500);
    } else if (part === 2 && index < part2.length) {
      element.innerHTML += part2.charAt(index);
      index++;
      setTimeout(type, 100);
    }
  }
  type();
}




/* Chart lines */
const barsContainer = document.querySelector(".chart__bars");
for (let i = 0; i <= 10; i++) {
  const line = document.createElement("div");
  line.className = "line-container";
  line.style.left = i === 0 ? "0" : `${i * 104}px`;
  if (i === 0) line.style.justifyContent = "flex-start";
  line.innerHTML = `<div class="vertical-line"></div><span class="line-number">${i * 50}</span>`;
  barsContainer.appendChild(line);
}



/* Legend label offset */
document.querySelectorAll(".legend__label").forEach(label => {
  if (label.dataset.offset) label.style.top = label.dataset.offset + "px";
});



/* Mock chart data for years 2025–2020 */
const chartData = {
  2025: {
    headerNumbers: { AO: 691, OOO: 37 },
     1: {
      A: [
        { width: 40, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 55, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 20, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 35, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 50, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 30, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 45, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 60, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 25, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 50, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     2: {
      A: [
        { width: 20, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 25, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 30, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 15, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 30, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 40, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 15, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 20, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 35, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 40, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     3: {
      A: [
        { width: 30, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 35, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 30, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 15, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 40, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 20, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 15, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 50, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 15, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 30, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     4: {
      A: [
        { width: 40, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 35, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 10, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 35, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 40, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 30, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 25, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 30, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 25, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 40, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    }
  },
  2024: {
    headerNumbers: { AO: 676, OOO: 32 },
     1: {
      A: [
        { width: 40, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 55, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 20, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 35, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 50, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 30, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 45, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 60, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 25, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 50, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     2: {
      A: [
        { width: 20, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 25, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 30, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 15, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 30, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 40, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 15, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 20, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 35, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 40, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     3: {
      A: [
        { width: 30, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 35, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 30, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 15, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 40, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 20, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 15, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 50, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 15, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 30, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     4: {
      A: [
        { width: 40, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 35, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 10, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 35, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 40, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 30, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 25, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 30, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 25, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 40, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    }
  },
  2023: {
    headerNumbers: { AO: 651, OOO: 27 },
     1: {
      A: [
        { width: 40, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 55, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 20, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 35, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 50, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 30, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 45, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 60, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 25, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 50, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     2: {
      A: [
        { width: 20, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 25, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 30, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 15, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 30, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 40, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 15, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 20, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 35, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 40, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     3: {
      A: [
        { width: 30, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 35, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 30, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 15, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 40, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 20, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 15, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 50, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 15, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 30, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     4: {
      A: [
        { width: 40, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 35, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 10, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 35, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 40, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 30, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 25, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 30, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 25, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 40, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    }
  },
  2022: {
    headerNumbers: { AO: 628, OOO: 23 },
     1: {
      A: [
        { width: 40, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 55, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 20, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 35, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 50, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 30, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 45, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 60, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 25, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 50, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     2: {
      A: [
        { width: 20, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 25, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 30, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 15, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 30, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 40, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 15, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 20, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 35, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 40, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     3: {
      A: [
        { width: 30, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 35, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 30, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 15, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 40, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 20, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 15, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 50, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 15, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 30, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     4: {
      A: [
        { width: 40, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 35, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 10, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 35, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 40, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 30, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 25, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 30, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 25, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 40, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    }
  },
  2021: {
    headerNumbers: { AO: 601, OOO: 17 },
     1: {
      A: [
        { width: 40, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 55, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 20, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 35, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 50, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 30, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 45, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 60, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 25, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 50, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     2: {
      A: [
        { width: 20, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 25, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 30, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 15, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 30, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 40, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 15, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 20, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 35, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 40, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     3: {
      A: [
        { width: 30, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 35, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 30, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 15, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 40, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 20, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 15, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 50, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 15, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 30, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     4: {
      A: [
        { width: 40, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 35, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 10, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 35, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 40, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 30, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 25, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 30, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 25, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 40, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    }
  },
  2020: {
    headerNumbers: { AO: 593, OOO: 12 },
     1: {
      A: [
        { width: 40, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 55, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 20, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 35, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 50, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 30, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 45, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 60, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 25, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 50, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     2: {
      A: [
        { width: 20, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 25, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 30, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 15, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 30, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 40, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 15, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 20, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 35, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 40, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     3: {
      A: [
        { width: 30, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 35, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 30, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 15, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 40, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 20, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 15, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 50, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 15, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 30, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    },
     4: {
      A: [
        { width: 40, tooltip: "AAA → АО — 111 | ООО — 16", bg: "#009A44", border: "hsl(146,100%,24%)", borderWidth: 16 },
        { width: 35, tooltip: "AA → АО — 168 | ООО — 8", bg: "#91BD00", border: "hsl(74,100%,30%)", borderWidth: 8 },
        { width: 10, tooltip: "A → АО — 89 | ООО — 11", bg: "#A5C91F", border: "hsl(73,73%,36%)", borderWidth: 11 },
      ],
      B: [
        { width: 35, tooltip: "BBB → АО — 100 | ООО — 20", bg: "#D9B600", border: "hsl(50,100%,34%)", borderWidth: 16 },
        { width: 40, tooltip: "BB → АО — 150 | ООО — 10", bg: "#D9CE04", border: "hsl(57,96%,34%)", borderWidth: 8 },
        { width: 30, tooltip: "B → АО — 90 | ООО — 15", bg: "#EFE31E", border: "hsl(57,87%,42%)", borderWidth: 11 },
      ],
      C: [
        { width: 25, tooltip: "CCC → АО — 120 | ООО — 20", bg: "#D96400", border: "hsl(28,100%,34%)", borderWidth: 16 },
        { width: 30, tooltip: "CC → АО — 180 | ООО — 15", bg: "#D99C00", border: "hsl(43,100%,34%)", borderWidth: 8 },
        { width: 25, tooltip: "C → АО — 95 | ООО — 12", bg: "#F0AE13", border: "hsl(42,88%,40%)", borderWidth: 11 },
      ],
      D: [
        { width: 40, tooltip: "DDD → АО — 130 | ООО — 18", bg: "#D92804", border: "hsl(10,96%,34%)", borderWidth: 16 }
      ]
    }
  }
  
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
  OOO: headerNums.OOO
});



  // Update bars
  const quarterData = chartData[year][quarter];
  const barGroups = document.querySelectorAll(".bar-group");

  barGroups.forEach(groupEl => {
    const groupKey = groupEl.dataset.group;   // "A" / "B" / "C" / "D"
    const groupData = quarterData[groupKey] || [];
    const bars = groupEl.querySelectorAll(".bar");

    bars.forEach((bar, i) => {
      if (groupData[i]) {
        const d = groupData[i];
        bar.style.width = d.width + "%";
        bar.style.background = d.bg;
        bar.style.borderRight = `${d.borderWidth}px solid ${d.border}`;
        bar.dataset.tooltip = d.tooltip;
        bar.style.display = "block";
      } else {
        bar.style.display = "none"; // hide unused bars
      }
    });
  });
}


/* Quarter buttons click */
quarterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    quarterButtons.forEach(b => b.classList.remove("chart__quarter-btn--active"));
    btn.classList.add("chart__quarter-btn--active");
    currentQuarter = parseInt(btn.dataset.quarter);
    updateChart(currentYear, currentQuarter);
  });
});

/* Tooltip */
chartBars.forEach(bar => {
  bar.addEventListener("mouseenter", () => {
    chartTooltip.innerText = bar.dataset.tooltip;
    chartTooltip.style.display = "block";
    chartTooltip.style.background = getComputedStyle(bar).backgroundColor;
  });
  bar.addEventListener("mousemove", e => {
    chartTooltip.style.left = e.pageX + 15 + "px";
    chartTooltip.style.top = e.pageY - 10 + "px";
  });
  bar.addEventListener("mouseleave", () => chartTooltip.style.display = "none");
});

/* Year selector dropdown logic */
const yearDropdown = document.createElement("ul");
yearDropdown.classList.add("chart__year-dropdown");
const rect = yearSelector.getBoundingClientRect();
const parentRect = yearSelector.parentElement.getBoundingClientRect();

yearDropdown.style.position = "absolute";
yearDropdown.style.top = rect.bottom - parentRect.top + "px";
yearDropdown.style.left = rect.left - parentRect.left + "px";
yearSelector.parentElement.style.position = "relative";   
yearDropdown.style.background = "#fff";
yearDropdown.style.border = "1px solid #ccc";
yearDropdown.style.listStyle = "none";
yearDropdown.style.padding = "0";
yearDropdown.style.display = "none";
yearDropdown.style.borderRadius = "16px";
yearDropdown.style.top = "100%";            // directly below yearSelector
yearSelector.parentElement.appendChild(yearDropdown);

/* Populate years */
for (let y = 2025; y >= 2020; y--) {
  const li = document.createElement("li");
  li.textContent = y;
  li.style.padding = "5px 10px";
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
  yearDropdown.style.display = yearDropdown.style.display === "block" ? "none" : "block";
});

/* Initial render */
updateChart(currentYear, currentQuarter);
