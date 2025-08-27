/* Nav animation */
const navItems = document.querySelectorAll(".nav__item");
const navUnderline = document.querySelector(".nav__underline");

function moveUnderline(el) {
  navUnderline.style.width = el.offsetWidth + "px";
  navUnderline.style.left = el.offsetLeft + "px";
}

moveUnderline(document.querySelector(".nav__item--active"));

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelector(".nav__item--active")
      .classList.remove("nav__item--active");
    item.classList.add("nav__item--active");
    moveUnderline(item);
  });
});


/* Reveal animation */

// Select all elements with .reveal
const reveals = document.querySelectorAll('.reveal');

// Set up an observer
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');   // trigger animation
      observer.unobserve(entry.target);        // stop observing once visible
    }
  });
}, {
  threshold: 0.1   // trigger when 10% of the element is visible
});

// Observe each element
reveals.forEach(el => observer.observe(el));


/* Magnetic button*/
const buttons = document.querySelectorAll('.button');

buttons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
  });
});


/* Language dropdown */
const languageDropdown = document.querySelector(".language-dropdown");
const languageBtn = languageDropdown.querySelector(".language-dropdown__btn");
const languageOptions = document.querySelectorAll(".language-dropdown__option");

// dictionary for "Select language" in different languages
const selectLanguageText = {
  ru: "Выберите язык",
  uz: "Tilni tanlang",
  en: "Select language",
};

// helper to map code -> readable name
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

// detect saved language or fallback
let savedLang = localStorage.getItem("lang") || "ru";
let currentLanguage = getReadableLanguage(savedLang);

// show current language at startup
languageBtn.textContent = currentLanguage;

// toggle dropdown
languageBtn.addEventListener("click", () => {
  const isActive = languageDropdown.classList.toggle("active");
  languageBtn.textContent = isActive
    ? selectLanguageText[savedLang]
    : currentLanguage;
});

// handle clicks on options
languageOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const newLang = option.dataset.lang; // "ru", "uz", "en"
    localStorage.setItem("lang", newLang);
    savedLang = newLang;

    currentLanguage = option.textContent; // show readable name
    languageBtn.textContent = currentLanguage;

    languageDropdown.classList.remove("active");
    console.log("Language switched to:", newLang);
  });
});


// Burger logic
const burger = document.getElementById("burger");
const dropdown = document.getElementById("dropdown");

burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  dropdown.classList.toggle("active");
});



// Component  
    