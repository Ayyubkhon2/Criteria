// ---------------  Nav ---------------

const navItems = document.querySelectorAll(".header__nav-item");
const navUnderline = document.querySelector(".header__nav-underline");

function moveUnderline(item) {
    navUnderline.style.width = item.offsetWidth + "px";
    navUnderline.style.transform = `translateX(${item.offsetLeft}px)`;
}

const activeItem = document.querySelector(".header__nav-item--active");
if (activeItem) moveUnderline(activeItem);

navItems.forEach((item) => {
    const link = item.querySelector("a");

    link.addEventListener("click", function() {
        const currentActive = document.querySelector(".header__nav-item--active");
        if (currentActive) { currentActive.classList.remove("header__nav-item--active"); }
        item.classList.add("header__nav-item--active");
        moveUnderline(item);
    });
});



// ---------------  Variants ---------------

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".switcher__btn");
    const variants = document.querySelectorAll(".variant");

    variants.forEach((v) => {
        if (!v.classList.contains("variant--active")) {
            v.style.display = "none";
        }
    });

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.variant;
            const target = document.getElementById(targetId);

            if (!target) return;

            buttons.forEach((b) => b.classList.remove("switcher__btn--active"));

            variants.forEach((v) => {
                v.classList.remove("variant--active");
                v.style.display = "none";
            });

            button.classList.add("switcher__btn--active");
            target.classList.add("variant--active");
            target.style.display = "block";
        });
    });

    const hash = window.location.hash.substring(1);
    if (hash) {
        const target = document.getElementById(hash);
        const button = document.querySelector(`[data-variant="${hash}"]`);

        if (target) {

            variants.forEach((v) => {
                v.classList.remove("variant--active");
                v.style.display = "none";
            });

            target.classList.add("variant--active");
            target.style.display = "block";

            if (button) {
                buttons.forEach((b) => b.classList.remove("switcher__btn--active"));
                button.classList.add("switcher__btn--active");
            }
        }
    }
});


// ---------------  Reveal ---------------

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }
);

reveals.forEach((el) => observer.observe(el));

// ---------------  Magnetic button ---------------

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

// ---------------  Lang dropdown ---------------

function changeLang(lang) {
    i18next.changeLanguage(lang, () => {
        updateContent();
    });
}

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
document.documentElement.setAttribute("lang", savedLang);
let currentLanguage = getReadableLanguage(savedLang);

document.addEventListener("DOMContentLoaded", () => {
    const languageDropdown = document.querySelector(".language-dropdown");
    if (!languageDropdown) return;

    const languageBtn = languageDropdown.querySelector(".language-dropdown__btn");
    const langMenu = document.querySelector(".language-dropdown__menu");

    languageBtn.textContent = currentLanguage;
    i18next.on('initialized', () => {
        i18next.changeLanguage(savedLang, () => updateContent());
    });

    languageBtn.addEventListener("click", () => {
        const isActive = languageDropdown.classList.toggle("active");
        languageBtn.textContent = isActive ? selectLanguageText[savedLang] : currentLanguage;
    });

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
});


function updateContent() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        el.textContent = i18next.t(el.getAttribute("data-i18n"));
    });
}

// ---------------  Burger ---------------

const burger = document.getElementById("burger");
const dropdown = document.getElementById("dropdown");

burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    dropdown.classList.toggle("active");
});