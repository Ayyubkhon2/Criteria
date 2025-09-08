// toggle between variants logic  
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".switcher__btn");   
  const variants = document.querySelectorAll(".variant");
 
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
   
      buttons.forEach(b => b.classList.remove("switcher__btn--active"));

      variants.forEach(v => {
        v.classList.remove("variant--active");
        v.style.display = "none";
      });
      
      button.classList.add("switcher__btn--active");
      target.classList.add("variant--active");
      target.style.display = "block";
    });
  });
});



// Carousel
(() => {
  const track = document.querySelector('.carousel__track');
  const btnLeft = document.querySelector('.carousel__btn--left');
  const btnRight = document.querySelector('.carousel__btn--right');
  if (!track || !btnLeft || !btnRight) return;

  const cards = Array.from(track.querySelectorAll('.carousel__card'));
  if (cards.length === 0) return;

  const step = 300; 
  let index = 0;

  function measureStart() {
  return 0;
}

  let baseOffset = measureStart();


  function applyTransform() {
    track.style.transform = `translateX(${baseOffset - index * step}px)`;
  }

 function goRight() {
  const containerWidth = track.parentElement.clientWidth;
  const visibleCount = Math.floor(containerWidth / step);
  const maxIndex = cards.length - visibleCount;

  if (index < maxIndex) {
    index++;
    applyTransform();
  }
}

  function goLeft() {
    if (index > 0) {
      index--;
      applyTransform();
    }
  }

  track.style.transition = 'transform 400ms ease';

  btnRight.addEventListener('click', goRight);
  btnLeft.addEventListener('click', goLeft);

  window.addEventListener('resize', () => {
    baseOffset = measureStart();
    applyTransform();
  });

  window.addEventListener('load', () => {
    baseOffset = measureStart();
    applyTransform();
  });
})();




// Temperature map
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

  provinces.forEach(province => {
    const name = province.dataset.name || "Регион";
    const value = parseInt(province.dataset.value, 10) || 0;
    const baseColor = getColor(value);

    province.style.fill = baseColor;

    // Hover
    province.addEventListener("mouseenter", () => {
      province.style.fill = shadeColor(baseColor, -20); 
      tooltip.innerHTML = `<strong>${name}</strong><br/>${value}`;
      tooltip.style.display = "block";
    });

province.addEventListener("mousemove", e => {
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;

  let left = e.pageX + 15;
  let top  = e.pageY + 15;

  if (left + tooltipWidth > window.innerWidth) {
    left = e.pageX - tooltipWidth - 15; 
  }

  if (top + tooltipHeight > window.innerHeight) {
    top = e.pageY - tooltipHeight - 15; 
  }

  tooltip.style.left = left + "px";
  tooltip.style.top  = top  + "px";
});

    province.addEventListener("mouseleave", () => {
      if (!province.classList.contains("active")) {
        province.style.fill = baseColor; 
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
      province.style.fill = shadeColor(baseColor, -40); 
    });
  });

  // Helper for RGB colors
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
const counters = document.querySelectorAll(".stats__stat-value");
const duration = 1500; // duration in ms

counters.forEach(counter => {
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




// Progress bar and label
document.querySelectorAll("tr").forEach(row => {
  const ratingCell = row.querySelector(".categories__rating");
  const progressValue = row.querySelector(".categories__progress-value");

  if (ratingCell && progressValue) {
    const ratingClass = [...ratingCell.classList].find(c =>
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
const progressObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressValue = entry.target.querySelector(".categories__progress-value");
      if (progressValue) {
        const width = progressValue.dataset.width;
        if (width) {
          progressValue.style.width = width + "%";
        }
      }
      observer.unobserve(entry.target); 
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll(".categories__progress-bar").forEach(bar => {
  progressObserver.observe(bar);
});



//Emitter circle color 
document.querySelectorAll(".top-emitter__card, .carousel__card").forEach(card => {
  const rating = card.dataset.rating;
  if (rating) {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue(`--color-${rating}`)
      .trim();

    if (color) {
      const circle = card.querySelector(".top-emitter__circle, .carousel__circle");
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

