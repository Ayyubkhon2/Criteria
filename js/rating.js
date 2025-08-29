// toggle between variants logic  
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".switcher__btn");   // was ".buttons > button"
  const variants = document.querySelectorAll(".variant");

  // Initially hide all variants except the active one
  variants.forEach(v => {
    if (!v.classList.contains("variant--active")) {
      v.style.display = "none";
    }
  });

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.variant;
      const target = document.getElementById(targetId);

      if (!target) return;

      // Deactivate all buttons
      buttons.forEach(b => b.classList.remove("switcher__btn--active"));

      // Hide all variants
      variants.forEach(v => {
        v.classList.remove("variant--active");
        v.style.display = "none";
      });

      // Activate clicked button and show corresponding variant
      button.classList.add("switcher__btn--active");
      target.classList.add("variant--active");
      target.style.display = "block";
    });
  });
});



// Carousel
const track = document.querySelector(".carousel__track");           // was ".carousel-track"
const btnLeft = document.querySelector(".carousel__btn--left");     // was ".carousel-btn.left"
const btnRight = document.querySelector(".carousel__btn--right");   // was ".carousel-btn.right"

let index = 0;

btnRight.addEventListener("click", () => {
  index++;
  track.style.transform = `translateX(${-index * 240}px)`;
});

btnLeft.addEventListener("click", () => {
  if (index > 0) index--;
  track.style.transform = `translateX(${-index * 240}px)`;
});



// Temperature map
document.addEventListener("DOMContentLoaded", () => {
  const provinces = document.querySelectorAll(".map__province");

  // Tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "map__tooltip";
  document.body.appendChild(tooltip);

  // Color ranges
  function getColor(value) {
    if (value >= 99) return "#009a44";
    if (value >= 89) return "#91bd00";
    if (value >= 79) return "#a5c91f";
    if (value >= 69) return "#d9b600";
    if (value >= 59) return "#d9ce04";
    if (value >= 49) return "#efe31e";
    if (value >= 39) return "#d96400";
    if (value >= 29) return "#d99c00";
    if (value >= 9) return "#f0ae13";
    return "#D92804"; 
  }

  provinces.forEach(province => {
    const name = province.dataset.name || "Регион";
    const value = parseInt(province.dataset.value, 10) || 0;
    const baseColor = getColor(value);

    // Default fill
    province.style.fill = baseColor;

    // Hover
    province.addEventListener("mouseenter", () => {
      province.style.fill = shadeColor(baseColor, -20); // darker shade on hover
      tooltip.innerHTML = `<strong>${name}</strong><br/>${value}`;
      tooltip.style.display = "block";
    });

province.addEventListener("mousemove", e => {
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;

  let left = e.pageX + 15;
  let top  = e.pageY + 15;

  // Prevent going beyond right edge
  if (left + tooltipWidth > window.innerWidth) {
    left = e.pageX - tooltipWidth - 15; // flip to the left
  }

  // Prevent going beyond bottom edge (optional)
  if (top + tooltipHeight > window.innerHeight) {
    top = e.pageY - tooltipHeight - 15; // move above cursor
  }

  tooltip.style.left = left + "px";
  tooltip.style.top  = top  + "px";
});

    province.addEventListener("mouseleave", () => {
      if (!province.classList.contains("active")) {
        province.style.fill = baseColor; // reset
      }
      tooltip.style.display = "none";
    });

    // Click (lock selection)
    province.addEventListener("click", () => {
      provinces.forEach(p => {
        p.classList.remove("active");
        p.style.fill = getColor(parseInt(p.dataset.value, 10));
      });

      province.classList.add("active");
      province.style.fill = shadeColor(baseColor, -40); // stronger color for selected
    });
  });

  // Helper to darken/lighten colors
  function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = (R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16);
    const GG = (G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16);
    const BB = (B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16);

    return "#" + RR + GG + BB;
  }
});



// Counter
    const counters = document.querySelectorAll(".stat__value");
    const speed = 50; // lower is faster

    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute("data-target");
        const current = +counter.innerText;

        // how much to increment
        const increment = Math.ceil(target / speed);

        if (current < target) {
          counter.innerText = current + increment;
          requestAnimationFrame(updateCount); 
        } else {
          counter.innerText = target; 
        }
      };

      updateCount();
 });




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
          footer:"© 2025 Все права защищены. Национальное агентство перспективных проектов",
        },
      },
      en: {
        translation: {
          nav1: "Home",
          nav2: "Rating",
          nav3: "Criteria",
          footer:"© 2025 All rights reserved. National Agency of Perspective Projects",
        },
      },
      uz: {
        translation: {
          nav1: "Bosh sahifa",
          nav2: "Reyting",
          nav3: "Mezon",
          footer: "© 2025 Barcha huquqlar himoyalangan. Istiqbolli loyihalar milliy agentligi",
        },
      },
    },
  },
  function (err, t) {
    updateContent();
  }
);


function changeLang(lang) {
  i18next.changeLanguage(lang, () => {
    updateContent();
    const activeItem = document.querySelector(".nav__item--active");
if (activeItem) moveUnderline(activeItem);
  });
}

