/* Nav animation */
const navItems = document.querySelectorAll(".header__nav-item");
const navUnderline = document.querySelector(".header__nav-underline");

function moveUnderline(el) {
  navUnderline.style.width = el.offsetWidth + "px";
  navUnderline.style.left = el.offsetLeft + "px";
}

const activeItem = document.querySelector(".header__nav-item--active");
if (activeItem) moveUnderline(activeItem);

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelector(".header__nav-item--active").classList.remove("header__nav-item--active");
    item.classList.add("header__nav-item--active");
    moveUnderline(item);
  });
});

/* Reveal animation */
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

reveals.forEach((el) => observer.observe(el));

/* Magnetic button */
const buttons = document.querySelectorAll(".magnetic-button");

buttons.forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0,0)";
  });
});

/* Language dropdown */
const languageDropdown = document.querySelector(".language-dropdown");
const languageBtn = languageDropdown.querySelector(".language-dropdown__btn");

const selectLanguageText = {
  ru: "Выберите язык",
  uz: "Tilni tanlang",
  en: "Select language",
};

function getReadableLanguage(code) {
  switch (code) {
    case "ru":
      return "Русский";
    case "uz":
      return "O‘zbekcha";
    case "en":
      return "English";
    default:
      return "Русский";
  }
}

let savedLang = localStorage.getItem("lang") || "ru";
let currentLanguage = getReadableLanguage(savedLang);

languageBtn.textContent = currentLanguage;

// toggle dropdown
languageBtn.addEventListener("click", () => {
  const isActive = languageDropdown.classList.toggle("active");
  languageBtn.textContent = isActive
    ? selectLanguageText[savedLang]
    : currentLanguage;
});

function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = i18next.t(el.getAttribute("data-i18n"));
  });
}

const langMenu = document.querySelector(".language-dropdown__menu");
if (langMenu) {
langMenu.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (li && li.dataset.lang) {
    savedLang = li.dataset.lang;
    currentLanguage = getReadableLanguage(savedLang);
    localStorage.setItem("lang", savedLang);
   
    languageBtn.textContent = currentLanguage;

    languageDropdown.classList.remove("active");
    changeLang(savedLang); 
  }
});

}

/* Burger logic */
const burger = document.getElementById("burger");
const dropdown = document.getElementById("dropdown");

burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  dropdown.classList.toggle("active");
});
