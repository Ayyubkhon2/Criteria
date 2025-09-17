

// --------------- Cards generation ---------------
const carouselData = [
  {
    org: "ABC Invest",
    region: "andijan", 
    score: "68.9",
    rating: "AAA",
    status: "active",
    image: "assets/emitter-photo.png",
  },
  {
    org: "ABC Invest",
    region: "namangan", 
    score: "57.3",
    rating: "AA",
    status: "inactive",
    image: "",
  },
  {
    org: "ABC Invest",
   region: "navoiy", 
    score: "54.5",
    rating: "A",
    status: "active",
    image: "",
  },
  {
    org: "ABC Invest",
    region: "tashkent", 
    score: "49.4",
    rating: "BBB",
    status: "active",
    image: "",
  },
  {
    org: "ABC Invest",
    region: "surkhandarya", 
    score: "43.0",
    rating: "BB",
    status: "active",
    image: "",
  },
  {
    org: "ABC Invest",
   region: "kashkadarya", 
    score: "37.2",
    rating: "B",
    status: "inactive",
    image: "",
  },
  {
    org: "ABC Invest",
    region: "syrdarya", 
    score: "32.5",
    rating: "CCC",
    status: "active",
    image: "",
  },
  {
    org: "ABC Invest",
    region: "khorezm", 
    score: "27.4",
    rating: "CC",
    status: "active",
    image: "",
  },
  {
    org: "ABC Invest",
    region: "samarkand", 
    score: "22.0",
    rating: "C",
    status: "inactive",
    image: "",
  },
  {
    org: "ABC Invest",
    region: "tashkent_city", 
    score: "17.9",
    rating: "D",
    status: "active",
    image: "",
  },
];

function ratingColor(rating) {
  const map = {
    AAA: "#009a44",
    AA: "#91bd00",
    A: "#a5c91f",
    BBB: "#d9b600",
    BB: "#d9ce04",
    B: "#efe31e",
    CCC: "#d96400",
    CC: "#d99c00",
    C: "#f0ae13",
    D: "#d92804",
  };
  return map[rating] || "#000";
}

function populateCard(card, item, type = "carousel") {

const root = card.querySelector(`.${type}__card`) || card.firstElementChild;
if (root) {
  root.style.setProperty("--circle-color", ratingColor(item.rating));
}


  card.querySelector(`.${type}__name`).textContent = item.org;

  card.querySelector(`.${type}__grade`).textContent = item.rating;
  card.querySelector(`.${type}__score`).textContent = item.score;

  card.querySelector(`.${type}__region`).textContent =
    i18next.t(`regions.${item.region}`);

  card.querySelector(`.${type}__status`).textContent =
    i18next.t(`card_status.${item.status}`);

  const photo = card.querySelector(`.${type}__photo`);
  if (photo) {
    photo.src = item.image || "assets/Placeholder.jpg";
  }

  const circle = card.querySelector(`.${type}__circle`);
  if (circle) {
    circle.style.setProperty("--circle-color", ratingColor(item.rating));
  }
}


const track = document.querySelector(".carousel__track");
const template = document.getElementById("card-template");

function updateContent() {
  track.innerHTML = "";

  carouselData.forEach((item) => {
    const card = template.content.cloneNode(true);
    populateCard(card, item, "carousel");
    track.appendChild(card);
  });
}

function renderTopEmitters() {
  function getTopAndWorstEmitters(data, n = 3) {
    const sorted = [...data].sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
    return {
      best: sorted.slice(0, n),
      worst: sorted.slice(-n).reverse() 
    };
  }

  const { best, worst } = getTopAndWorstEmitters(carouselData, 3);

  const containers = document.querySelectorAll(".top-emitter__list");
  if (containers.length < 2) return;

  const containerBest = containers[0];
  const containerWorst = containers[1];

  const template = document.getElementById("emitter-card-template");
  if (!template) return;

  containerBest.innerHTML = "";
  containerWorst.innerHTML = "";

  // Best emitters
  best.forEach((item) => {
    const card = template.content.cloneNode(true);
    populateCard(card, item, "top-emitter");
    containerBest.appendChild(card);
  });

  // Worst emitters
  worst.forEach((item) => {
    const card = template.content.cloneNode(true);
    populateCard(card, item, "top-emitter");
    containerWorst.appendChild(card); 
  });
}



function updateTopEmitters() {
  document.querySelectorAll(".top-emitter__card").forEach((card, index) => {
    const item = carouselData[index];
    if (item) {
      populateCard(card, item, "top-emitter");
    }
  });
}



// Slider logic

let isVertical = false; 
function initSlider() {
  const btnLeft = document.querySelector(".carousel__btn--left");
  const btnRight = document.querySelector(".carousel__btn--right");
  if (!track || !btnLeft || !btnRight) return;

  let cardWidth = 0;
let gap = 0;

  let groupSize = 3;
  let index = 0;
  let baseOffset = 0;
  let autoplayTimer;
  let scrollCooldown = false;

function measure() {
  const cards = Array.from(track.querySelectorAll(".carousel__card"));
  if (!cards.length) return 0;

  const r0 = cards[0].getBoundingClientRect();
  const r1 = cards[1]?.getBoundingClientRect();

  // detect vertical layout
  isVertical = r1 && (r1.top - (r0.top + r0.height)) > 0;

  if (isVertical) {
    cardHeight = r0.height + gap;
    groupSize = 1; // slide one card at a time vertically
  } else {
    cardWidth = r0.width + gap;
    if (window.innerWidth >= 1200) groupSize = 3;
    else if (window.innerWidth >= 800) groupSize = 2;
    else groupSize = 1;
  }

  return cards.length;
}

function applyTransform() {
  const offset = index * (isVertical ? cardHeight : cardWidth) * groupSize;
  track.style.transform = isVertical
    ? `translateY(-${offset}px)`
    : `translateX(-${offset}px)`;
}




function goRight() {
  const cardsLength = measure();
  const maxIndex = Math.ceil(cardsLength / groupSize) - 1;
  if (index < maxIndex) index++;
  else index = 0;
  applyTransform();
}

function goLeft() {
  const cardsLength = measure();
  const maxIndex = Math.ceil(cardsLength / groupSize) - 1;
  if (index > 0) index--;
  else index = 0;
  applyTransform();
}


  track.style.transition = "transform 600ms ease-out";

  function resetAutoplay() {
    clearTimeout(autoplayTimer);
    autoplayTimer = setTimeout(goRight, 10000);
  }

  btnRight.addEventListener("click", () => {
    goRight();
    resetAutoplay();
  });
  btnLeft.addEventListener("click", () => {
    goLeft();
    resetAutoplay();
  });

  track.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (scrollCooldown) return;
      scrollCooldown = true;

      clearTimeout(autoplayTimer);

      const cardsLength = measure();
const maxIndex = Math.ceil(cardsLength / groupSize) - 1;


      if (e.deltaY > 0) {
        if (index < maxIndex) index++;
      } else {
        if (index > 0) index--;
      }

      applyTransform();
      autoplayTimer = setTimeout(resetAutoplay, 3000);

      setTimeout(() => {
        scrollCooldown = false;
      }, 400);
    },
    { passive: false }
  );

  track.addEventListener("mouseenter", () => {
    clearTimeout(autoplayTimer);
  });
  track.addEventListener("mouseleave", resetAutoplay);

 


  measure();
applyTransform();
  resetAutoplay();

window.addEventListener("resize", () => {
  const cardsLength = measure();
  const maxIndex = Math.ceil(cardsLength / groupSize) - 1;
  if (index > maxIndex) index = maxIndex; 
  applyTransform();
});
}


// --------------- Temperature map ---------------
document.addEventListener("DOMContentLoaded", () => {
  const provinces = document.querySelectorAll(".map__province");

  // Tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "map__tooltip";
  document.body.appendChild(tooltip);

  function getColor(value) {
    if (value >= 99) return "#1f7a46ff";
    if (value >= 89) return "#7d9726ff";
    if (value >= 79) return "#9dbc2fff";
    if (value >= 69) return "#af9a2cff";
    if (value >= 59) return "#afa92cff";
    if (value >= 49) return "#cfc83fff";
    if (value >= 39) return "#af692cff";
    if (value >= 29) return "#eedfbaff";
    if (value >= 9) return "#cda037ff";
    return "#af422cff";
  }

  provinces.forEach((province) => {
    const regionKey = province.dataset.region;
    const value = parseInt(province.dataset.value, 10) || 0;
    const baseColor = getColor(value);

    province.style.fill = baseColor;

    // Hover
province.addEventListener("mouseenter", () => {
  const translatedName = regionKey
    ? i18next.t(`regions.${regionKey}`)
    : i18next.t("regions.unknown");

  province.style.fill = shadeColor(baseColor, -20);
  tooltip.innerHTML = `<strong>${translatedName}</strong><br/>${value}`;
  tooltip.style.display = "block";
});


    province.addEventListener("mousemove", (e) => {
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;

      let left = e.clientX + 15;
let top = e.clientY + 15;

      if (left + tooltipWidth > window.innerWidth) {
        left = e.pageX - tooltipWidth - 15;
      }

      if (top + tooltipHeight > window.innerHeight) {
        top = e.pageY - tooltipHeight - 15;
      }

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    });

    province.addEventListener("mouseleave", () => {
      if (!province.classList.contains("active")) {
        province.style.fill = baseColor;
      }
      tooltip.style.display = "none";
    });

    // Click (lock selection)
    province.addEventListener("click", () => {
      provinces.forEach((p) => {
        p.classList.remove("active");
        p.style.fill = getColor(parseInt(p.dataset.value, 10));
      });

      province.classList.add("active");
      province.style.fill = shadeColor(baseColor, -40);
    });
  });

  // Helper for RGB colors
  function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    const RR =
      R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
    const GG =
      G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
    const BB =
      B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

    return "#" + RR + GG + BB;
  }
});

// --------------- Counter ---------------
function startCounters(container) {
  const counters = container.querySelectorAll(".stats__stat-value");
  const duration = 2000; // duration in ms, lower = faster

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    let start = null;

    const updateCount = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const progressRatio = Math.min(progress / duration, 1);

      counter.innerText = Math.floor(progressRatio * target);

      if (progress < duration) {
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target;
      }
    };

    requestAnimationFrame(updateCount);
  });
}

let countersStarted = false;

document.querySelectorAll(".switcher__btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const variantId = btn.getAttribute("data-variant");

    if (variantId === "overview" && !countersStarted) {
      const overview = document.getElementById("overview");
      startCounters(overview);
      countersStarted = true;
    }
  });
});

// Progress bar and label
document.querySelectorAll("tr").forEach((row) => {
  const ratingCell = row.querySelector(".categories__rating");
  const progressValue = row.querySelector(".categories__progress-value");

  if (ratingCell && progressValue) {
    const ratingClass = [...ratingCell.classList].find((c) =>
      c.startsWith("categories__rating--")
    );

    if (ratingClass) {
      const key = ratingClass.replace("categories__rating--", "");
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue(`--color-${key}`)
        .trim();

      progressValue.style.backgroundColor = color;

      const progressLabel = row.querySelector(".categories__progress-label");
      if (progressLabel) {
        progressLabel.style.color = color;
      }
    }
  }
});

// Progress bar animation
const progressObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressValue = entry.target.querySelector(
          ".categories__progress-value"
        );
        if (progressValue) {
          const width = progressValue.dataset.width;
          if (width) {
            progressValue.style.width = width + "%";
          }
        }
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".categories__progress-bar").forEach((bar) => {
  progressObserver.observe(bar);
});

//Emitter circle color
document
  .querySelectorAll(".top-emitter__card, .carousel__card")
  .forEach((card) => {
    const rating = card.dataset.rating;
    if (rating) {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue(`--color-${rating}`)
        .trim();

      if (color) {
        const circle = card.querySelector(
          ".top-emitter__circle, .carousel__circle"
        );
        if (circle) {
          circle.style.setProperty("--circle-color", color);
        }

        const icon = card.querySelector(".top-emitter__icon");
        if (icon) {
          icon.style.backgroundColor = color;
        }
      }
    }
  });

// --------------- Table generation ---------------
const data = [
  {
    org: "ABC Invest",
   region: "andijan", 
    score: "68.9",
    rating: "AAA",
  },
  {
    org: "ABC Invest",
    region: "namangan", 
    score: "57.3",
    rating: "AA",
  },
  {
    org: "ABC Invest",
    region: "navoiy", 
    score: "54.5",
    rating: "A",
  },
  {
    org: "ABC Invest",
    region: "tashkent", 
    score: "49.4",
    rating: "BBB",
  },
  {
    org: "ABC Invest",
    region: "surkhandarya", 
    score: "43.0",
    rating: "BB",
  },
  {
    org: "ABC Invest",
    region: "kashkadarya", 
    score: "37.2",
    rating: "B",
  },
  {
    org: "ABC Invest",
    region: "syrdarya", 
    score: "32.5",
    rating: "CCC",
  },
  {
    org: "ABC Invest",
    region: "khorezm", 
    score: "27.4",
    rating: "CC",
  },
  {
    org: "ABC Invest",
    region: "samarkand", 
    score: "22.0",
    rating: "C",
  },
  {
    org: "ABC Invest",
    region: "tashkent_city", 
    score: "17.9",
    rating: "D",
  },
];

const tbody = document.getElementById("table-body");

function updateTable() {
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.classList.add("table__row");

    row.innerHTML = `
      <td class="table__body-number">${index + 1}</td>
      <td class="table__body-name">${item.org}</td>
      <td class="table__body-region">${i18next.t(`regions.${item.region}`)}</td>
      <td class="table__body-score">${item.score}</td>
      <td class="table__body-rating">
        <span class="rating rating--${item.rating.toLowerCase()}">${item.rating}</span>
      </td>
    `;

    tbody.appendChild(row);
  });
}


function updateStaticTexts() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = i18next.t(key);
  });
}

// --------------- Translation ---------------
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
          switcher_table: "Таблица",
          switcher_cards: "Карточки",
          switcher_overview: "Обзор",
          table_no: "№",
          table_org: "Организация",
          table_region: "Регион",
          table_score: "Оценка",
          table_rating: "Рейтинг",
          card_status: "Действующее предприятие",
          overview_title: "Обзор активности компаний",
          overview_subtitle: "Общая статистика",
          stats_companies: "Число компаний",
          stats_new: "Новые за месяц",
          stats_in_a: 'В категории "A"',
          stats_in_b: 'В категории "B"',
          top3_best: "Топ-3 лучших эмитента",
          top3_worst: "Топ-3 худших эмитента",
          map_title: "Температурная карта эмитентов",
          categories_title: "По категориям надежности",
          categories_rating: "Рейтинг",
          categories_amount: "Количество",
          categories_percent: "Процент",
          footer:
            "© 2025 Все права защищены. Национальное агентство перспективных проектов",
          regions: {
            karakalpakstan: "Республика Каракалпакстан",
            andijan: "Андижанская область",
            bukhara: "Бухарская область",
            fergana: "Ферганская область",
            jizzakh: "Джизакская область",
            namangan: "Наманганская область",
            navoiy: "Навоийская область",
            kashkadarya: "Кашкадарьинская область",
            samarkand: "Самаркандская область",
            surkhandarya: "Сурхандарьинская область",
            syrdarya: "Сырдарьинская область",
            tashkent: "Ташкентская область",
            tashkent_city: "г. Ташкент",
            khorezm: "Хорезмская область",
          },
          card_status: {
            active: "Действующее предприятие",
            inactive: "Бездействующее предприятие",
          },
        },
      },
      en: {
        translation: {
          nav1: "Home",
          nav2: "Rating",
          nav3: "Criteria",
          login: "Login",
          switcher_table: "Table",
          switcher_cards: "Cards",
          switcher_overview: "Overview",
          table_no: "No",
          table_org: "Organization",
          table_region: "Region",
          table_score: "Score",
          table_rating: "Rating",
          card_status: "Operating enterprise",
          overview_title: "Company activity overview",
          overview_subtitle: "General statistics",
          stats_companies: "Number of companies",
          stats_new: "New this month",
          stats_in_a: 'In category "A"',
          stats_in_b: 'In category "B"',
          top3_best: "Top-3 best issuers",
          top3_worst: "Top-3 worst issuers",
          map_title: "Issuer heat map",
          categories_title: "By reliability categories",
          categories_rating: "Rating",
          categories_amount: "Amount",
          categories_percent: "Percent",
          footer:
            "© 2025 All rights reserved. National Agency of Perspective Projects",
          regions: {
            karakalpakstan: "Republic of Karakalpakstan",
            andijan: "Andijan Region",
            bukhara: "Bukhara Region",
            fergana: "Fergana Region",
            jizzakh: "Jizzakh Region",
            namangan: "Namangan Region",
            navoiy: "Navoi Region",
            kashkadarya: "Kashkadarya Region",
            samarkand: "Samarkand Region",
            surkhandarya: "Surkhandarya Region",
            syrdarya: "Syrdarya Region",
            tashkent: "Tashkent Region",
            tashkent_city: "Tashkent City",
            khorezm: "Khorezm Region",
          },
          card_status: {
            active: "Operating enterprise",
            inactive: "Inactive enterprise",
          },
        },
      },
      uz: {
        translation: {
          nav1: "Bosh sahifa",
          nav2: "Reyting",
          nav3: "Mezon",
          login: "Kirish",
          switcher_table: "Jadval",
          switcher_cards: "Kartalar",
          switcher_overview: "Umumiy ko‘rinish",
          table_no: "№",
          table_org: "Tashkilot",
          table_region: "Hudud",
          table_score: "Baholash",
          table_rating: "Reyting",
          card_status: "Faol korxona",
          overview_title: "Kompaniyalar faoliyatiga umumiy ko‘rinish",
          overview_subtitle: "Umumiy statistika",
          stats_companies: "Kompaniyalar soni",
          stats_new: "Oy davomida yangilari",
          stats_in_a: '"A" toifasida',
          stats_in_b: '"B" toifasida',
          top3_best: "Eng yaxshi 3 ta emitent",
          top3_worst: "Eng yomon 3 ta emitent",
          map_title: "Emitentlarning xarita-ko‘rinishi",
          categories_title: "Ishonchlilik toifalari bo‘yicha",
          categories_rating: "Reyting",
          categories_amount: "Miqdor",
          categories_percent: "Foiz",
          footer:
            "© 2025 Barcha huquqlar himoyalangan. Istiqbolli loyihalar milliy agentligi",
          regions: {
            karakalpakstan: "Qoraqalpog‘iston Respublikasi",
            andijan: "Andijon viloyati",
            bukhara: "Buxoro viloyati",
            fergana: "Farg‘ona viloyati",
            jizzakh: "Jizzax viloyati",
            namangan: "Namangan viloyati",
            navoiy: "Navoiy viloyati",
            kashkadarya: "Qashqadaryo viloyati",
            samarkand: "Samarqand viloyati",
            surkhandarya: "Surxondaryo viloyati",
            syrdarya: "Sirdaryo viloyati",
            tashkent: "Toshkent viloyati",
            tashkent_city: "Toshkent shahri",
            khorezm: "Xorazm viloyati",
          },
          card_status: {
            active: "Faol korxona",
            inactive: "Nofaol korxona",
          },
        },
      },
    },
  },
  function (err, t) {
     updateStaticTexts();
    updateContent();
      updateTable();
      updateTopEmitters();
    initSlider();
    renderTopEmitters();     
  }
);

function changeLang(lang) {
  i18next.changeLanguage(lang, () => {
     updateStaticTexts();
    updateContent();
      updateTable();
      updateTopEmitters();
    initSlider();
    renderTopEmitters();    
    const activeItem = document.querySelector(".nav__item--active");
    if (activeItem) moveUnderline(activeItem);
  });
}
