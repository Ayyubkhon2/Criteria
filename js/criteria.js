document.querySelectorAll(".table-wrapper").forEach((wrapper) => {
    let isDown = false;
    let startX = 0;
    let startY = 0;
    let startScrollX = 0;
    let startScrollY = 0;

    let currentX = 0;
    let targetX = 0;
    let currentY = 0;
    let targetY = 0;
    let rafId = null;

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let velocityX = 0;
    let velocityY = 0;

    function clampTargetX(t) {
        return Math.max(0, Math.min(t, wrapper.scrollWidth - wrapper.clientWidth));
    }

    function clampTargetY(t) {
        return Math.max(0, Math.min(t, wrapper.scrollHeight - wrapper.clientHeight));
    }

    function startRAF() {
        if (rafId) return;

        function tick() {
            currentX += (targetX - currentX) * 0.2;
            currentY += (targetY - currentY) * 0.2;
            wrapper.scrollLeft = currentX;
            wrapper.scrollTop = currentY;

            velocityX *= 0.95;
            velocityY *= 0.95;

            if (
                Math.abs(targetX - currentX) > 0.5 ||
                Math.abs(velocityX) > 0.02 ||
                Math.abs(targetY - currentY) > 0.5 ||
                Math.abs(velocityY) > 0.02 ||
                isDown
            ) {
                rafId = requestAnimationFrame(tick);
            } else {
                rafId = null;
            }
        }
        rafId = requestAnimationFrame(tick);
    }

    // MOUSE
    wrapper.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.clientX;
        startY = e.clientY;
        startScrollX = wrapper.scrollLeft;
        startScrollY = wrapper.scrollTop;
        currentX = wrapper.scrollLeft;
        targetX = wrapper.scrollLeft;
        currentY = wrapper.scrollTop;
        targetY = wrapper.scrollTop;
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = performance.now();
        document.body.classList.add("no-select");
        startRAF();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        targetX = clampTargetX(startScrollX - dx);
        targetY = clampTargetY(startScrollY - dy);

        const now = performance.now();
        const dt = Math.max(1, now - lastTime);
        velocityX = (e.clientX - lastX) / dt;
        velocityY = (e.clientY - lastY) / dt;
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;

        startRAF();
    });

    document.addEventListener("mouseup", () => {
        if (!isDown) return;
        isDown = false;
        const momentumX = velocityX * 200;
        const momentumY = velocityY * 200;
        targetX = clampTargetX(targetX - momentumX);
        targetY = clampTargetY(targetY - momentumY);
        document.body.classList.remove("no-select");
        startRAF();
    });

    // TOUCH
    wrapper.addEventListener(
        "touchstart",
        (e) => {
            isDown = true;
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;
            startX = x;
            startY = y;
            startScrollX = wrapper.scrollLeft;
            startScrollY = wrapper.scrollTop;
            currentX = wrapper.scrollLeft;
            targetX = wrapper.scrollLeft;
            currentY = wrapper.scrollTop;
            targetY = wrapper.scrollTop;
            lastX = x;
            lastY = y;
            lastTime = performance.now();
            startRAF();
        }, { passive: true }
    );

    wrapper.addEventListener(
        "touchmove",
        (e) => {
            if (!isDown) return;
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;
            const dx = x - startX;
            const dy = y - startY;
            targetX = clampTargetX(startScrollX - dx);
            targetY = clampTargetY(startScrollY - dy);

            const now = performance.now();
            const dt = Math.max(1, now - lastTime);
            velocityX = (x - lastX) / dt;
            velocityY = (y - lastY) / dt;
            lastX = x;
            lastY = y;
            lastTime = now;

            e.preventDefault();
            startRAF();
        }, { passive: false }
    );

    wrapper.addEventListener("touchend", () => {
        if (!isDown) return;
        isDown = false;
        const momentumX = velocityX * 200;
        const momentumY = velocityY * 200;
        targetX = clampTargetX(targetX - momentumX);
        targetY = clampTargetY(targetY - momentumY);
        startRAF();
    });
});


// --------------- Translation ---------------
document.addEventListener("DOMContentLoaded", () => {
    if (typeof i18next === "undefined") {
        console.error(
            'i18next is not loaded. Make sure <script src="i18next..."></script> is included before this script.'
        );
        return;
    }

    const savedLang = localStorage.getItem("lang") || "ru";

    i18next.init({
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
                        switchet1r1: "Экономические показатели",
                        switchet1r2: "Корпоративное управление",
                        switchet1r3: "Инвестиционная активность",
                        footer: "© 2025 Все права защищены. Национальное агентство перспективных проектов",
                        h1: "Критерии",
                        h2: "Методика оценки",
                        h3: "Показатели и формулы",
                        h4: "Источник информации",
                        h5: "Периодичность данных",
                        h6: "Периодичность оценки",
                        h7: "Балл",
                        h8: "Порядок доступа",
                        t1r1b1: "Продолжительность деятельности",
                        t1r1b2: "От 3 до 5 лет - 1 балл; \n от 5 до 7 лет - 2 балла; \n свыше 7 лет - 3 балла",
                        t1r1b3: "Период осуществления деятельности",
                        t1r1b4: "Данные ЦГУ",
                        t1r1b5: "Годовой",
                        t1r1b6: "Годовой",
                        t1r1b7: "3",
                        t1r1b8: "Автомат",
                        t1r2b1: " Рентабельностmь активов (ROA)",
                        t1r2b2: " Менее 1% - вычитается 1 балл; \n от 1% до 5% - 1 балл; \n от 5% до 10% - 2 балла; \n от 10% до 15% - 3 балла; \n от 15% до 20% - 4 балла; \n свыше 20% - 5 баллов. ",
                        t1r2b3: "РА - рентабельность активов; \n ЧП - чистая прибыль Сб - среднее значение всего актива или пассива баланса Формула: РА = ЧП/СБ*100% ",
                        t1r2b4: "Годовой отчет, Финансовая отчетность, Openinfo.uz",
                        t1r2b5: "Годовой",
                        t1r2b6: "Годовой",
                        t1r2b7: "5",
                        t1r2b8: "Автомат",
                        t1r3b1: "Return on Equity (ROE)",
                        t1r3b2: "Менее 1% - вычитается 1 балл; \n от 1% до 5% - 1 балл; \n от 5% до 10% - 2 балла; \n от 10% до 15% - 3 балла; \n от 15% до 20% - 4 балла; \n свыше 20% - 5 баллов. ",
                        t1r3b3: "РСк - рентабельность собств.капитала; \n ЧП - чистая прибыль Ск - собственный капитал Формула: РСк = ЧП/Ск*100%",
                        t1r3b4: "Годовой отчет, Финансовая отчетность, Openinfo.uz",
                        t1r3b5: "Годовой",
                        t1r3b6: "Годовой",
                        t1r3b7: "5",
                        t1r3b8: "Автомат",
                        t1r4b1: "Реальный прирост прибыли ",
                        t1r4b2: "Менее 5% - баллы не начисляются; \n от 5% до 10% - 2 балла; \n от 10% до 15% - 3 балла; \n от 15% до 20% - 4 балла;  \n свыше 20% - 5 баллов.",
                        t1r4b3: "Номинальный прирост прибыли / (1 + индекс инфляции)*100%",
                        t1r4b4: "Годовой отчет, Финансовая отчетность, Openinfo.uz",
                        t1r4b5: "Годовой",
                        t1r4b6: "Годовой",
                        t1r4b7: "5",
                        t1r4b8: "Автомат",
                        t1r5b1: "Дивидендная доходность (дивиденды к рыночной цене акций)",
                        t1r5b2: "Менее 5% - баллы не начисляются; \n  от 5% до 10% - 2 балла; \n  от 10% до 15% - 3 балла; \n  от 15% до 20% - 4 балла; \n  свыше 20% - 5 баллов.",
                        t1r5b3: "ДД - дивидендная доходность Осд - общая сумма дивидендов; \n  Коа - количество обыкновенных акций; \n  Рца - рыночная цена акции. Формула: ДД = (Осд/Коа)/Рца*100%",
                        t1r5b4: "Квартальная отчетность, Openinfo.uz",
                        t1r5b5: "Годовой",
                        t1r5b6: "Квартальный",
                        t1r5b7: "5",
                        t1r5b8: "Автомат",
                        t1r6b1: "Наличие международных рейтингов/сертификатов  (например кредитный, ISO, ESG, и т.п.)",
                        t1r6b2: "При наличии рейтинга - 1 балл за каждый рейтинг/сертификат; \n  при наличии международного рейтинга - 5 баллов.",
                        t1r6b3: "Наличие рейтинга",
                        t1r6b4: "Данные эмитента, сайт эмитента",
                        t1r6b5: "Годовой",
                        t1r6b6: "Квартальный",
                        t1r6b7: "5",
                        t1r6b8: "Человеческий фактор",
                        t2r1b1: "Продолжительность деятельности",
                        t2r1b2: "От 3 до 5 лет - 1 балл; \n  от 5 до 7 лет - 2 балла; \n  свыше 7 лет - 3 балла.",
                        t2r1b3: "Период осуществления деятельности",
                        t2r1b4: "Данные ЦГУ",
                        t2r1b5: "Годовой",
                        t2r1b6: "Годовой",
                        t2r1b7: "3",
                        t2r1b8: "Автомат",
                        t2r2b1: "Наличие Комитета миноритарных акционеров (КМА)",
                        t2r2b2: "При наличии  КМА - 1 балл; \n  при отсутствии КМА - баллы не начисляются.",
                        t2r2b3: "Наличие Комитета",
                        t2r2b4: "Данные ЦГУ",
                        t2r2b5: "Годовой",
                        t2r2b6: "Годовой",
                        t2r2b7: "3",
                        t2r2b8: "Автомат",
                        t2r3b1: "Применение Кодекса корпоративного управления",
                        t2r3b2: "При наличии кодекса КУ - 1 балл; \n  при отсутствии кодекс КУ - баллы не начисляются.",
                        t2r3b3: "Наличие кодекса корпоративного управления",
                        t2r3b4: "Данные ЦГУ",
                        t2r3b5: "Годовой",
                        t2r3b6: "Годовой",
                        t2r3b7: "3",
                        t2r3b8: "Автомат",
                        t2r4b1: "Общее количество акционеров",
                        t2r4b2: "От 10 до 100 - 1 балл; \n  от 100 до 200 - 2 балла; \n  от 200 до 300 - 3 балла; \n  от 300 до 500 - 4 балла; \n  свыше 500 - 5 баллов.",
                        t2r4b3: "Количество акционеров",
                        t2r4b4: "Данные ЦГУ",
                        t2r4b5: "Годовой",
                        t2r4b6: "Годовой",
                        t2r4b7: "3",
                        t2r4b8: "Автомат",
                        t2r5b1: "Наличие нерезидентов среди акционеров",
                        t2r5b2: "От 15 до 30 - 2 балла; \n  от 30 до 50 - 3 балла; \n  более 50 процентов - 5 баллов.",
                        t2r5b3: "Количество акций,  принадлежащих нерезидентам / общее количество размещенных акций * 100% ",
                        t2r5b4: "Данные ЦГУ",
                        t2r5b5: "Годовой",
                        t2r5b6: "Годовой",
                        t2r5b7: "3",
                        t2r5b8: "Автомат",
                        t2r6b1: "Доступность информации для инвесторов вне ЕПКИ",
                        t2r6b2: "Наличие сведений на собственном вебсайте (кроме обязательных) - 1 балл; \n  Наличие сведений на сайтах инвестпосредников, биржи и др - 2 балла.",
                        t2r6b3: "Доступность информации в других источниках",
                        t2r6b4: "Данные ЦГУ",
                        t2r6b5: "Годовой",
                        t2r6b6: "Годовой",
                        t2r6b7: "3",
                        t2r6b8: "Автомат",
                        t2r7b1: "Наличие штрафов и санкций от регулятора. Подвергался ли мерам воздействия за нарушения закоонодательства об акционерных обществах и рынке ценных бумаг",
                        t2r7b2: "От 1 до 3 мер воздействия - вычытается (-1) балл; \n  от 3 до 5 мер воздействия - (-2) балла; \n  свыше 5 мер возействия - (-3) балла.",
                        t2r7b3: "Количество примененных штрафов",
                        t2r7b4: "Данные ЦГУ",
                        t2r7b5: "Годовой",
                        t2r7b6: "Годовой",
                        t2r7b7: "3",
                        t2r7b8: "Автомат",
                        t2r8b1: "Своевременность и полнота опубликования отчетности ",
                        t2r8b2: "Несвоевременное/неполное опубликование - вычытается  (-3) балла; \n  при наличии не представленного отчета - (- 5) баллов.",
                        t2r8b3: "Общее количество отчетов, которые необходимо представить; \n  Количество своевременно представленных отчетов; \n  Количество отчетов, представленных с опозданием; \n  Количество непредставленных отчетов",
                        t2r8b4: "Годовой отчет, Финансовая отчетность, Openinfo.uz",
                        t2r8b5: "Годовой",
                        t2r8b6: "Годовой",
                        t2r8b7: "5",
                        t2r8b8: "Автомат",
                        t2r9b1: "Своевременность и полнота раскрытия существенных фактов",
                        t2r9b2: "Несвоевременное/неполное опубликование - вычитается (- 3) балла; \n  при наличии не представленного отчета -  (- 5) баллов.",
                        t2r9b3: "Сверка информации из первых источников и раскрытия существенных фактов",
                        t2r9b4: "Годовой отчет, Финансовая отчетность, Openinfo.uz",
                        t2r9b5: "Годовой",
                        t2r9b6: "Годовой",
                        t2r9b7: "5",
                        t2r9b8: "Автомат",
                        t2r10b1: "Своевременность выплаты дивидендов",
                        t2r10b2: "Выплата без задержки - 1 балл; \n  при задержке: от 10 до 15 дней - (-1) балл; \n  от 16 до 20 дней - (-2 ) балла; \n  свыше 20 дней - (- 3) балла.",
                        t2r10b3: "Количество дней задержки платежа",
                        t2r10b4: "Годовой отчет, Финансовая отчетность, Openinfo.uz",
                        t2r10b5: "Годовой",
                        t2r10b6: "Годовой",
                        t2r10b7: "5",
                        t2r10b8: "Автомат",
                        t2r11b1: "Своевременное исполнение обязательств по зарегистрированным выпускам облигаций",
                        t2r11b2: "Выплата и погашение без задержек - 1 балл при задержке: от 10 до 15 дней - (-1) балл; \n  от 16 до 20 дней - (-2 ) балла; \n  свыше 20 дней - (- 3) балла.",
                        t2r11b3: "Количество дней просрочки обязательства",
                        t2r11b4: "Квартальная отчетность, Openinfo.uz",
                        t2r11b5: "Годовой",
                        t2r11b6: "Квартальный",
                        t2r11b7: "5",
                        t2r11b8: "Автомат",
                        t2r12b1: "Наличие жалоб инвесторов и акционеров",
                        t2r12b2: "За каждый случай обоснованной жалобы вычитается по (-1) баллу; \n  При этом общие вычитаемые баллы не должны превышать 3 баллов.",
                        t2r12b3: "Количество обнаруженных случаев",
                        t2r12b4: "Отчетность компании, обращения через НАПП",
                        t2r12b5: "Годовой",
                        t2r12b6: "Квартальный",
                        t2r12b7: "5",
                        t2r12b8: "Человеческий фактор",
                        t3r1b1: "Рыночная капитализация акций",
                        t3r1b2: "От 10 до 20 млрд сум - 2 балла; \n  от 20 до 50 - 3 балла; \n  более 50 - 5 баллов.",
                        t3r1b3: "Рк - рыночная капитализация; \n  Окра - общее количество размещенных акций; \n  Трца - текущая рыночная цена одной акции. Формула: Рк = Окра / Трца",
                        t3r1b4: "Данные ЦГУ",
                        t3r1b5: "Годовой",
                        t3r1b6: "Годовой",
                        t3r1b7: "3",
                        t3r1b8: "Автомат",
                        t3r2b1: "Доля акций в свободном обращении (Free-float)",
                        t3r2b2: "Менее 5% - 1 балл; \n  от 5% до 10% - 2 балла; \n  от 10% до 15% - 3 балла; \n  от 15% до 20% - 4 балла; \n  свыше 20% - 5 баллов. ",
                        t3r2b3: "Общее количество акций (А); \n  Количество акций Free-float (B); \n  Доля (S); \n  Формула: S = (B / A) * 100 ",
                        t3r2b4: "Годовой отчет, Финансовая отчетность, Openinfo.uz",
                        t3r2b5: "Годовой",
                        t3r2b6: "Годовой",
                        t3r2b7: "5",
                        t3r2b8: "Автомат",
                        t3r3b1: "Включение ценных бумаг в котировальный лист биржи",
                        t3r3b2: "Не находится в листинге - 0 балл; \n  находится в листинге - 2 балла.",
                        t3r3b3: "Включение ценных бумаг в котировальный лист биржи",
                        t3r3b4: "Годовой отчет, Финансовая отчетность, Openinfo.uz",
                        t3r3b5: "Годовой",
                        t3r3b6: "Годовой",
                        t3r3b7: "5",
                        t3r3b8: "Автомат",
                        t3r4b1: "Объем торгов на фондовой бирже ",
                        t3r4b2: "До 500 млн сум - 1 балл; \n  от 500 до 2 млрд сум - 2 балла; \n  от 2 до 10 млрд сум - 3 балла; \n  более 10 млрд сум - 5 баллов.",
                        t3r4b3: "Объем торгов",
                        t3r4b4: "Годовой отчет, Финансовая отчетность, Openinfo.uz",
                        t3r4b5: "Годовой",
                        t3r4b6: "Годовой",
                        t3r4b7: "5",
                        t3r4b8: "Автомат",
                        t3r5b1: "Доля размещенных акций на основе открытой подиской (в % от общего количества размещённых)",
                        t3r5b2: "От 10 до 30 % - 1 балл; \n  от 31% до 50% - 2 балла; \n  свыше 50% - 5 баллов.",
                        t3r5b3: "Общее количество акций (А); \n  Количество открытых акций (B); \n  Доля (S); \n  Формула: S = (B / A) * 100",
                        t3r5b4: "Квартальная отчетность, Openinfo.uz",
                        t3r5b5: "Годовой",
                        t3r5b6: "Квартальный",
                        t3r5b7: "5",
                        t3r5b8: "Автомат",
                        t3r6b1: "Наличие институциональных инвесторов среди акционеров",
                        t3r6b2: "Более 3 институциональных инвесторов (совокупно >30%) - 5 баллов; \n  2 (совокупно >15%) - 3 балла; \n  1 (совокупно >10%) - 2 балла.",
                        t3r6b3: "Наличие институциональных инвесторов",
                        t3r6b4: "Данные эмитента, сайт эмитента",
                        t3r6b5: "Годовой",
                        t3r6b6: "Квартальный",
                        t3r6b7: "5",
                        t3r6b8: "Человеческий фактор",
                    },
                },
                en: {
                    translation: {
                        nav1: "Home",
                        nav2: "Rating",
                        nav3: "Criteria",
                        login: "Login",
                        switchet1r1: "Economic Indicators",
                        switchet1r2: "Corporate Management",
                        switchet1r3: "Investment activity",
                        footer: "© 2025 All rights reserved. National Agency of Perspective Projects",
                        h1: "Criteria",
                        h2: "Assessment methodology",
                        h3: "Indicators and formulas",
                        h4: "Information source",
                        h5: "Frequency of data",
                        h6: "Frequency of assessment",
                        h7: "Score",
                        h8: "Access procedure",
                        t1r1b1: "Duration of activity",
                        t1r1b2: "From 3 to 5 years - 1 point; \n  from 5 to 7 years - 2 points; \n  over 7 years - 3 points",
                        t1r1b3: "Period of activity",
                        t1r1b4: "GSC data",
                        t1r1b5: "Annual",
                        t1r1b6: "Annual",
                        t1r1b7: "3",
                        t1r1b8: "Automatic",
                        t1r2b1: "Return on assets (ROA)",
                        t1r2b2: "Less than 1% - 1 point is deducted; \n  from 1% to 5% - 1 point; \n  from 5% to 10% - 2 points; \n  from 10% to 15% - 3 points; \n  from 15% to 20% - 4 points; \n  over 20% - 5 points. ",
                        t1r2b3: "RA - return on assets; \n  PE - net profit Sb - average value of the total asset or liability of the balance sheet Formula: RA = PE/SB*100% ",
                        t1r2b4: "Annual report, Financial statements, Openinfo.uz ",
                        t1r2b5: "Annual",
                        t1r2b6: "Annual",
                        t1r2b7: "5",
                        t1r2b8: "automatic",
                        t1r3b1: "Return on Equity (ROE)",
                        t1r3b2: "Less than 1% - 1 point is deducted; \n  from 1% to 5% - 1 point; \n  from 5% to 10% - 2 points; \n  from 10% to 15% - 3 points; \n  from 15% to 20% - 4 points; \n  over 20% - 5 points. ",
                        t1r3b3: "RSK - profitability of its own.capital; \n PE - net profit of the Uk - equity Formula: RSk = PE/Uk*100%",
                        t1r3b4: "Annual report, Financial statements, Openinfo.uz ",
                        t1r3b5: "Annual",
                        t1r3b6: "Annual",
                        t1r3b7: "5",
                        t1r3b8: "Automatic",
                        t1r4b1: "Real profit growth ",
                        t1r4b2: "Less than 5% - no points awarded; \n  from 5% to 10% - 2 points; \n  from 10% to 15% - 3 points; \n  from 15% to 20% - 4 points; \n  over 20% - 5 points.",
                        t1r4b3: "Nominal profit growth / (1 + inflation index)*100%",
                        t1r4b4: "Annual Report, Financial Statements, Openinfo.uz ",
                        t1r4b5: "Annual",
                        t1r4b6: "Annual",
                        t1r4b7: "5",
                        t1r4b8: "Automatic",
                        t1r5b1: "Dividend yield (dividends to the market price of shares)",
                        t1r5b2: "Less than 5% - no points are awarded; \n  from 5% to 10% - 2 points; \n  from 10% to 15% - 3 points; \n  from 15% to 20% - 4 points; \n  over 20% - 5 points.",
                        t1r5b3: "DD - dividend yield SD - total the amount of dividends; \n  Koa - the number of ordinary shares; \n  Rca - the market price of the share. Formula: DD = (Osd/Koa)/Rca*100%",
                        t1r5b4: "Quarterly reports, Openinfo.uz ",
                        t1r5b5: "Annual",
                        t1r5b6: "Quarterly",
                        t1r5b7: "5",
                        t1r5b8: "Automatic",
                        t1r6b1: "Availability of international ratings / certificates (for example, credit, ISO, ESG, etc.)",
                        t1r6b2: "If there is a rating - 1 point for each rating / certificate; \n  if there is an international rating - 5 points.",
                        t1r6b3: "Availability of rating",
                        t1r6b4: "Issuer's data, website of the issuer",
                        t1r6b5: "Annual",
                        t1r6b6: "Quarterly",
                        t1r6b7: "5",
                        t1r6b8: "Human factor",
                        t2r1b1: "Duration of activity",
                        t2r1b2: "From 3 to 5 years - 1 point; \n  from 5 to 7 years - 2 points; \n  over 7 years - 3 points.",
                        t2r1b3: "Period of activity",
                        t2r1b4: "GSC data",
                        t2r1b5: "Annual",
                        t2r1b6: "Annual",
                        t2r1b7: "3",
                        t2r1b8: "Automatic",
                        t2r2b1: "The existence of a Committee of Minority Shareholders (CMA)",
                        t2r2b2: "If there is a CMA, 1 point; \n  if there is no CMA, no points are awarded.",
                        t2r2b3: "Presence of a Committee",
                        t2r2b4: "GSC data",
                        t2r2b5: "Annual",
                        t2r2b6: "Annual",
                        t2r2b7: "3",
                        t2r2b8: "Automatic",
                        t2r3b1: "Application of the Corporate Governance Code",
                        t2r3b2: "If there is a code of KU, 1 point; \n  if there is no code of KU, no points are awarded.",
                        t2r3b3: "If there is a code of corporate governance",
                        t2r3b4: "GSC data",
                        t2r3b5: "Annual",
                        t2r3b6: "Annual",
                        t2r3b7: "3",
                        t2r3b8: "Automatic",
                        t2r4b1: "Total number of shareholders",
                        t2r4b2: "From 10 to 100 - 1 point; \n  from 100 to 200 - 2 points; \n  from 200 to 300 - 3 points; \n  from 300 to 500 - 4 points; \n  over 500 - 5 points.",
                        t2r4b3: "Number of shareholders",
                        t2r4b4: "GSC data",
                        t2r4b5: "Annual",
                        t2r4b6: "Annual",
                        t2r4b7: "3",
                        t2r4b8: "Automatic",
                        t2r5b1: "Presence of non-residents among shareholders",
                        t2r5b2: "From 15 to 30 - 2 points; \n  from 30 to 50 - 3 points; \n  more than 50 percent - 5 points.",
                        t2r5b3: "Number of shares owned by non-residents / total number of outstanding shares * 100%",
                        t2r5b4: "GSC data",
                        t2r5b5: "Annual",
                        t2r5b6: "Annual",
                        t2r5b7: "3",
                        t2r5b8: "Automatic",
                        t2r6b1: "Accessibility of information to investors outside the EPC",
                        t2r6b2: "Availability of information on its own website (except mandatory ones) - 1 point; \n  Availability of information on the websites of investment intermediaries, exchanges, etc. - 2 points.",
                        t2r6b3: "Availability of information in other sources",
                        t2r6b4: "GSC data",
                        t2r6b5: "Annual",
                        t2r6b6: "Annual",
                        t2r6b7: "3",
                        t2r6b8: "Automatic",
                        t2r7b1: "The presence of fines and sanctions from the regulator. Has he been subjected to measures of influence for violations of the law on joint-stock companies and the securities market",
                        t2r7b2: "from 1 to 3 measures of influence, (-1) points will be deducted; \n  from 3 to 5 measures of influence, (-2) points; \n  over 5 measures of influence, (-3) points.",
                        t2r7b3: "The number of applied fines",
                        t2r7b4: "GSC data",
                        t2r7b5: "Annual",
                        t2r7b6: "Annual",
                        t2r7b7: "3",
                        t2r7b8: "Automatic",
                        t2r8b1: "Timeliness and completeness of the publication of reports ",
                        t2r8b2: "Late/incomplete publication - deducted (-3) points; \n  if there is no submitted report - (- 5) points.",
                        t2r8b3: "Total number of reports to be submitted; \n  Number of timely submitted reports; \n  Number of reports submitted late; \n  Number of unrepresented reports",
                        t2r8b4: "Annual report, Financial statements, Openinfo.uz ",
                        t2r8b5: "Annual",
                        t2r8b6: "Annual",
                        t2r8b7: "5",
                        t2r8b8: "Automatic",
                        t2r9b1: "Timeliness and completeness of disclosure of material facts",
                        t2r9b2: "Late/incomplete publication - deducted (- 3) points; \n  if there is no submitted report - (- 5) points.",
                        t2r9b3: "Reconciliation of first-hand information and disclosure of material facts",
                        t2r9b4: "Annual Report, Financial statements, Openinfo.uz ",
                        t2r9b5: "Annual",
                        t2r9b6: "Annual",
                        t2r9b7: "5",
                        t2r9b8: "Automatic",
                        t2r10b1: "Timely payment of dividends",
                        t2r10b2: "Payment without delay - 1 point; \n  in case of delay: from 10 to 15 days - (-1) points; \n  from 16 to 20 days - (-2 ) points; \n  over 20 days - (- 3) points.",
                        t2r10b3: "Number of days payment delays",
                        t2r10b4: "Annual report, Financial Statements, Openinfo.uz ",
                        t2r10b5: "Annual",
                        t2r10b6: "Annual",
                        t2r10b7: "5",
                        t2r10b8: "Automatic",
                        t2r11b1: "Timely fulfillment of obligations on registered bond issues",
                        t2r11b2: "Payment and repayment without delay - 1 point in case of delay: from 10 to 15 days - (-1) points; \n  from 16 to 20 days - (-2 ) points; \n  over 20 days - (- 3) points.",
                        t2r11b3: "The number of days overdue obligations",
                        t2r11b4: "Quarterly reports, Openinfo.uz ",
                        t2r11b5: "Annual",
                        t2r11b6: "Quarterly",
                        t2r11b7: "5",
                        t2r11b8: "Automatic",
                        t2r12b1: "Complaints from investors and shareholders",
                        t2r12b2: "For each case of a substantiated complaint, (-1) point is deducted; \n  at the same time, the total deductible points should not exceed 3 points.",
                        t2r12b3: "Number of detected cases",
                        t2r12b4: "Company reporting, appeals through NAPP",
                        t2r12b5: "Annual",
                        t2r12b6: "Quarterly",
                        t2r12b7: "5",
                        t2r12b8: "Human factor",
                        t3r1b1: "Stock market Capitalization",
                        t3r1b2: "From 10 to 20 billion soums - 2 points; \n  from 20 to 50 - 3 points; \n  more than 50 - 5 points.",
                        t3r1b3: "Rok - market capitalization; \n  Okra - total number of outstanding shares; \n  Seca - current market price of one share. Formula: Pk = Okra / Trca",
                        t3r1b4: "GSC data",
                        t3r1b5: "Annual",
                        t3r1b6: "Annual",
                        t3r1b7: "3",
                        t3r1b8: "Automatic",
                        t3r2b1: "The share of shares in free float",
                        t3r2b2: " Less than 5% - 1 point; \n  from 5% to 10% - 2 points; \n  from 10% to 15% - 3 points; \n  from 15% to 20% - 4 points; \n  over 20% - 5 points. ",
                        t3r2b3: "Total number of shares (A); \n  Number of shares Free-float (B); \n  Share (S); \n  Formula: S = (B/A) * 100 ",
                        t3r2b4: "Annual Report, Financial Statements, Openinfo.uz ",
                        t3r2b5: "Annual",
                        t3r2b6: "Annual",
                        t3r2b7: "5",
                        t3r2b8: "Automatic",
                        t3r3b1: "Inclusion of securities in the exchange's quotation list",
                        t3r3b2: "Not listed - 0 points; \n  listed - 2 points.",
                        t3r3b3: "Inclusion of securities in the exchange's quotation list",
                        t3r3b4: "Annual Report, Financial Statements, Openinfo.uz ",
                        t3r3b5: "Annual",
                        t3r3b6: "Annual",
                        t3r3b7: "5",
                        t3r3b8: "Automatic",
                        t3r4b1: "Trading volume on the stock exchange ",
                        t3r4b2: "Up to 500 million soums - 1 point; \n  from 500 to 2 billion soums - 2 points; \n  from 2 to 10 billion soums - 3 points; \n  more than 10 billion soums - 5 points.",
                        t3r4b3: "Trading volume",
                        t3r4b4: "Annual Report, Financial Statements, Openinfo.uz ",
                        t3r4b5: "Annual",
                        t3r4b6: "Annual",
                        t3r4b7: "5",
                        t3r4b8: "Automatic",
                        t3r5b1: "The share of outstanding shares based on an open subscription (in % of the total number of outstanding shares)",
                        t3r5b2: "From 10 to 30% - 1 point; \n  from 31% to 50% - 2 points; \n  over 50% - 5 points.",
                        t3r5b3: "Total number of shares (A); \n  Number of open shares (B); \n  Share (S); \n  Formula: S = (B / A) * 100",
                        t3r5b4: "Quarterly reports, Openinfo.uz ",
                        t3r5b5: "Annual",
                        t3r5b6: "Quarterly",
                        t3r5b7: "5",
                        t3r5b8: "Automatic",
                        t3r6b1: "Presence of institutional investors among shareholders",
                        t3r6b2: "More than 3 institutional investors (total >30%) - 5 points; \n  2 (total >15%) - 3 points; \n  1 (total >10%) - 2 points.",
                        t3r6b3: "Presence of institutional investors",
                        t3r6b4: "Issuer's data, issuer's website",
                        t3r6b5: "Annual",
                        t3r6b6: "Quarterly",
                        t3r6b7: "5",
                        t3r6b8: "Human factor",
                    },
                },
                uz: {
                    translation: {
                        nav1: "Bosh sahifa",
                        nav2: "Reyting",
                        nav3: "Mezon",
                        login: "Kirish",
                        switchet1r1: "Iqtisodiy ko'rsatkichlar",
                        switchet1r2: "Korporativ boshqaruv",
                        switchet1r3: "Investitsion faollik",
                        footer: "© 2025 Barcha huquqlar himoyalangan. Istiqbolli loyihalar milliy agentligi",
                        h1: "Mezonlar",
                        h2: "Baholash metodikasi",
                        h3: "Ko'rsatkichlar va formulalar",
                        h4: "Axborot manbai",
                        h5: "Ma'lumotlar davriyligi",
                        h6: "Baholash davriyligi",
                        h7: "Ball",
                        h8: "Kirish tartibi",
                        t1r1b1: "Faoliyat davomiyligi",
                        t1r1b2: "3 yoshdan 5 yoshgacha - 1 ball; \n  5 yoshdan 7 yoshgacha - 2 ball; \n  7 yoshdan yuqori - 3 ball",
                        t1r1b3: "Faoliyatni amalga oshirish davri",
                        t1r1b4: "DXM ma'lumotlari",
                        t1r1b5: "Yillik",
                        t1r1b6: "Yillik",
                        t1r1b7: "3",
                        t1r1b8: "Avtomatik",
                        t1r2b1: "Aktivlar rentabelligi (ROA)",
                        t1r2b2: "1% dan kam - 1 ball chegiriladi; \n  1% dan 5% gacha - 1 ball; \n  5% dan 10% gacha - 2 ball; \n  10% dan 15% gacha - 3 ball; \n  15% dan 20% gacha - 4 ball; \n  20% dan yuqori - 5 ball. ",
                        t1r2b3: "RA - aktivlarning rentabelligi; \n  NP - sof foyda Sb - balansning umumiy aktivlari yoki majburiyatlarining o'rtacha qiymati. Formula: RA = NP / Sb * 100% ",
                        t1r2b4: "Yillik hisobot, Moliyaviy hisobot, Openinfo.uz",
                        t1r2b5: "Yillik",
                        t1r2b6: "Yillik",
                        t1r2b7: "5",
                        t1r2b8: "Avtomatik",
                        t1r3b1: "Kapitalning rentabelligi (ROE)",
                        t1r3b2: "1% dan kam - 1 ball chegiriladi; \n  1% dan 5% gacha - 1 ball; \n  5% dan 10% gacha - 2 ball; \n  10% dan 15% gacha - 3 ball; \n  15% dan 20% gacha - 4 ball; \n  20% dan yuqori - 5 ball. ",
                        t1r3b3: "RSc - o'z kapitalining rentabelligi; \n NP - sof foyda Sk - kapital Formula: RSc = NP/Sk*100%",
                        t1r3b4: "Yillik hisobot, Moliyaviy hisobot, Openinfo.uz",
                        t1r3b5: "Yillik",
                        t1r3b6: "Yillik",
                        t1r3b7: "5",
                        t1r3b8: "Avtomatik",
                        t1r4b1: "Real foydaning o'sishi",
                        t1r4b2: "5% dan kam - ball yo'q; \n  5% dan 10% gacha - 2 ball; \n  10% dan 15% gacha - 3 ball; \n  15% dan 20% gacha - 4 ball; \n  20% dan yuqori - 5 ball.",
                        t1r4b3: "Nominal foyda o'sishi / (1 + inflyatsiya indeksi)*100%",
                        t1r4b4: "Yillik hisobot, Moliyaviy hisobot, Openinfo.uz",
                        t1r4b5: "Yillik",
                        t1r4b6: "Yillik",
                        t1r4b7: "5",
                        t1r4b8: "Avtomatik",
                        t1r5b1: "Dividend daromadi (bozor aktsiyalari narxiga dividendlar)",
                        t1r5b2: "5% dan kam - ball yo'q; \n  5% dan 10% gacha - 2 ball; \n  10% dan 15% gacha - 3 ball; \n  15% dan 20% gacha - 4 ball; \n  20% dan yuqori - 5 ball.",
                        t1r5b3: "DD - dividend daromadi OSD - dividendlarning umumiy miqdori; \n  Koa - oddiy aksiyalar soni; \n  Rca - aksiyaning bozor narxi. Formula: DD = (OSD/Koa)/Rca*100%",
                        t1r5b4: "Choraklik hisobot, Openinfo.uz",
                        t1r5b5: "Yillik",
                        t1r5b6: "Har chorakda",
                        t1r5b7: "5",
                        t1r5b8: "Avtomatik",
                        t1r6b1: "Xalqaro reytinglar/sertifikatlarning mavjudligi (masalan, kredit, ISO, ESG va boshqalar)",
                        t1r6b2: "Agar reyting mavjud bo'lsa - har bir reyting/sertifikat uchun 1 ball; \n  xalqaro reyting mavjud bo'lsa - 5 ball.",
                        t1r6b3: "Reyting mavjudligi",
                        t1r6b4: "Emitent ma'lumotlari, emitent veb-sayti",
                        t1r6b5: "Yillik",
                        t1r6b6: "Har chorakda",
                        t1r6b7: "5",
                        t1r6b8: "Inson omili",
                        t2r1b1: "Faoliyat davomiyligi",
                        t2r1b2: "3 yoshdan 5 yoshgacha - 1 ball; \n  5 yoshdan 7 yoshgacha - 2 ball; \n  7 yoshdan katta - 3 ball.",
                        t2r1b3: "Faoliyat davomiyligi",
                        t2r1b4: "DXM ma'lumotlari",
                        t2r1b5: "Yillik",
                        t2r1b6: "Yillik",
                        t2r1b7: "3",
                        t2r1b8: "Avtomatik",
                        t2r2b1: "Minoritar aksiyadorlar qo'mitasining (MSC) mavjudligi",
                        t2r2b2: "Agar MSC mavjud bo'lsa - 1 ball; \n  MSC yo'q bo'lsa - ball berilmaydi.",
                        t2r2b3: "Qo'mitaning mavjudligi",
                        t2r2b4: "DXM ma'lumotlari",
                        t2r2b5: "Yillik",
                        t2r2b6: "Yillik",
                        t2r2b7: "3",
                        t2r2b8: "Avtomatik",
                        t2r3b1: "Korporativ boshqaruv kodeksini qo'llash",
                        t2r3b2: "Agar CG kodi bo'lsa - 1 ball; \n  agar CG kodi bo'lmasa - ball berilmaydi.",
                        t2r3b3: "Korporativ boshqaruv kodeksining mavjudligi",
                        t2r3b4: "DXM ma'lumotlari",
                        t2r3b5: "Yillik",
                        t2r3b6: "Yillik",
                        t2r3b7: "3",
                        t2r3b8: "Avtomatik",
                        t2r4b1: "Aktsiyadorlarning umumiy soni",
                        t2r4b2: "10 dan 100 gacha - 1 ball; \n  100 dan 200 gacha - 2 ball; \n  200 dan 300 gacha - 3 ball; \n  300 dan 500 gacha - 4 ball; \n  500 dan yuqori - 5 ball.",
                        t2r4b3: "Aktsiyadorlar soni",
                        t2r4b4: "DXM ma'lumotlari",
                        t2r4b5: "Yillik",
                        t2r4b6: "Yillik",
                        t2r4b7: "3",
                        t2r4b8: "Avtomatik",
                        t2r5b1: "Aktsiyadorlar orasida norezidentlarning mavjudligi",
                        t2r5b2: "15 dan 30 gacha - 2 ball; \n  30 dan 50 gacha - 3 ball; \n  50 foizdan yuqori - 5 ball.",
                        t2r5b3: "Norezidentlarga tegishli aksiyalar soni / muomaladagi aktsiyalarning umumiy soni * 100% ",
                        t2r5b4: "DXM ma'lumotlari",
                        t2r5b5: "Yillik",
                        t2r5b6: "Yillik",
                        t2r5b7: "3",
                        t2r5b8: "Avtomatik",
                        t2r6b1: "EPKIdan tashqari investorlar uchun ma'lumotlarning mavjudligi",
                        t2r6b2: "O'z veb-saytingizda ma'lumotlarning mavjudligi (majburiylaridan tashqari) - 1 ball; \n  Investitsiya vositachilari, fond birjalari va boshqalarning veb-saytlarida ma'lumotlarning mavjudligi - 2 ball.",
                        t2r6b3: "Boshqa manbalarda ma'lumotlar mavjudligi",
                        t2r6b4: "DXM ma'lumotlari",
                        t2r6b5: "Yillik",
                        t2r6b6: "Yillik",
                        t2r6b7: "3",
                        t2r6b8: "Avtomatik",
                        t2r7b1: "Nazorat qiluvchi organ tomonidan jarima va sanktsiyalar mavjudligi. Aksiyadorlik jamiyatlari va qimmatli qog'ozlar bozori to'g'risidagi qonun hujjatlarini buzganlik uchun sizga ta'sir choralari ko'rilganmi?",
                        t2r7b2: "1 balldan 3 ballgacha – (-1) ball; \n  3 balldan 5 ballgacha – (-2) ball; \n  5 tadan ortiq ta’sir chorasi – (-3) ball olib tashlanadi.",
                        t2r7b3: "Qo'llaniladigan jarimalar soni",
                        t2r7b4: "DXM ma'lumotlari",
                        t2r7b5: "Yillik",
                        t2r7b6: "Yillik",
                        t2r7b7: "3",
                        t2r7b8: "Avtomatik",
                        t2r8b1: "Hisobotni nashr etishning o'z vaqtida va to'liqligi",
                        t2r8b2: "o'z vaqtida/to'liq bo'lmagan nashr - (-3) ball olib tashlanadi; \n  agar taqdim etilmagan hisobot bo'lsa - (- 5) ball.",
                        t2r8b3: "Taqdim etilishi kerak bo'lgan hisobotlarning umumiy soni; \n  O'z vaqtida taqdim etilgan hisobotlar soni; \n  Kechiktirilgan hisobotlar soni; \n  Taqdim qilinmagan hisobotlar soni",
                        t2r8b4: "Yillik hisobot, Moliyaviy hisobot, Openinfo.uz",
                        t2r8b5: "Yillik",
                        t2r8b6: "Yillik",
                        t2r8b7: "5",
                        t2r8b8: "Avtomatik",
                        t2r9b1: "Muhim faktlarni o'z vaqtida va to'liq oshkor qilish",
                        t2r9b2: "O'z vaqtida/to'liq e'lon qilinmagan - (- 3) ball olib tashlanadi; \n  taqdim etilmagan hisobot bo'lsa - (- 5) ball.",
                        t2r9b3: "Birlamchi manbalardan olingan ma'lumotlarni solishtirish va muhim faktlarni oshkor qilish",
                        t2r9b4: "Yillik hisobot, Moliyaviy hisobot, Openinfo.uz",
                        t2r9b5: "Yillik",
                        t2r9b6: "Yillik",
                        t2r9b7: "5",
                        t2r9b8: "Avtomatik",
                        t2r10b1: "Dividendlarni o'z vaqtida to'lash",
                        t2r10b2: "Kechiktirilmagan to'lov - 1 ball; \n  kechiktirilganda: 10 kundan 15 kungacha - (-1) ball; \n  16 kundan 20 kungacha - (-2 ) ball; \n  20 kundan ortiq - (- 3) ball.",
                        t2r10b3: "To'lovni kechiktirish kunlari soni",
                        t2r10b4: "Yillik hisobot, Moliyaviy hisobot, Openinfo.uz",
                        t2r10b5: "Yillik",
                        t2r10b6: "Yillik",
                        t2r10b7: "5",
                        t2r10b8: "Avtomatik",
                        t2r11b1: "Ro'yxatdan o'tgan obligatsiyalar bo'yicha majburiyatlarni o'z vaqtida bajarish",
                        t2r11b2: "kechiktirilgan to'lov va to'lov muddati kechiktirilganda 1 ball: 10 kundan 15 kungacha – (-1) ball; \n  16 dan 20 kungacha – (-2) ball; \n  20 kundan ortiq muddatda – (- 3) ball.",
                        t2r11b3: "Majburiyat kechiktirilgan kunlar soni",
                        t2r11b4: "Choraklik hisobot, Openinfo.uz",
                        t2r11b5: "Yillik",
                        t2r11b6: "Har chorakda",
                        t2r11b7: "5",
                        t2r11b8: "Avtomatik",
                        t2r12b1: "Investorlar va aktsiyadorlardan shikoyatlarning mavjudligi",
                        t2r12b2: "Asoslangan shikoyatning har bir holati uchun (-1) ball chegiriladi; \n  chegirib tashlangan ballarning umumiy miqdori 3 balldan oshmasligi kerak.",
                        t2r12b3: "Aniqlangan holatlar soni",
                        t2r12b4: "Kompaniya hisoboti, NAPP orqali murojaatlar",
                        t2r12b5: "Yillik",
                        t2r12b6: "Har chorakda",
                        t2r12b7: "5",
                        t2r12b8: "Inson omili",
                        t3r1b1: "Aktsiyalarning bozor kapitallashuvi",
                        t3r1b2: "10 dan 20 milliard so'mgacha – 2 ball; \n  20 dan 50 gacha – 3 ball; \n  50 dan ortiq – 5 ball.",
                        t3r1b3: "Rk - bozor kapitallashuvi; \n  Okra - muomaladagi aksiyalarning umumiy soni; \n  Trtsa - bitta aksiyaning joriy bozor narxi. Formula: Rk = Okra / Trtsa",
                        t3r1b4: "DXM ma'lumotlari",
                        t3r1b5: "Yillik",
                        t3r1b6: "Yillik",
                        t3r1b7: "3",
                        t3r1b8: "Avtomatik",
                        t3r2b1: "Share free float (Free-float)",
                        t3r2b2: "5% dan kam - 1 ball; \n  5% dan 10% gacha - 2 ball; \n  10% dan 15% gacha - 3 ball; \n  15% dan 20% gacha - 4 ball; \n  20% dan yuqori - 5 ball. ",
                        t3r2b3: "Aktsiyalarning umumiy soni (A); \n  Erkin sotiladigan aktsiyalar soni (B); \n  Aksiya (S); \n  Formula: S = (B / A) * 100 ",
                        t3r2b4: "Yillik hisobot, Moliyaviy hisobot, Openinfo.uz",
                        t3r2b5: "Yillik",
                        t3r2b6: "Yillik",
                        t3r2b7: "5",
                        t3r2b8: "Avtomatik",
                        t3r3b1: "Qimmatli qog'ozlarni birjaning kotirovka ro'yxatiga kiritish",
                        t3r3b2: "ro'yxatga kiritilmagan - 0 ball; \n  sanab o'tilgan - 2 ball.",
                        t3r3b3: "Qimmatli qog'ozlarni birja kotirovkalari ro'yxatiga kiritish",
                        t3r3b4: "Yillik hisobot, Moliyaviy hisobot, Openinfo.uz",
                        t3r3b5: "Yillik",
                        t3r3b6: "Yillik",
                        t3r3b7: "5",
                        t3r3b8: "Avtomatik",
                        t3r4b1: "Birja savdolari hajmi",
                        t3r4b2: "500 million so'mgacha – 1 ball; \n  500 million so'mdan 2 milliard so'mgacha – 2 ball; \n  2 milliard so'mdan 10 milliard so'mgacha – 3 ball; \n  10 milliard so'mdan ortiq – 5 ball",
                        t3r4b3: "Savdo hajmi",
                        t3r4b4: "Yillik hisobot, Moliyaviy hisobot, Openinfo.uz",
                        t3r4b5: "Yillik",
                        t3r4b6: "Yillik",
                        t3r4b7: "5",
                        t3r4b8: "Avtomatik",
                        t3r5b1: "Ochiq taklif asosida joylashtirilgan aksiyalar ulushi (joylashtirilgan aksiyalar umumiy sonidan %)",
                        t3r5b2: "10 dan 30% gacha - 1 ball; \n  31% dan 50% gacha - 2 ball; \n  50% dan yuqori - 5 ball.",
                        t3r5b3: "Aktsiyalarning umumiy soni (A); \n  Ochiq aksiyalar soni (B); \n  Aksiya (S); \n  Formula: S = (B / A) * 100",
                        t3r5b4: "Choraklik hisobot, Openinfo.uz",
                        t3r5b5: "Yillik",
                        t3r5b6: "Har chorakda",
                        t3r5b7: "5",
                        t3r5b8: "Avtomatik",
                        t3r6b1: "Aktsiyadorlar orasida institutsional investorlarning mavjudligi",
                        t3r6b2: "3 dan ortiq institutsional investorlar (jami >30%) - 5 ball; \n  2 (jami >15%) - 3 ball; \n  1 (jami >10%) - 2 ball.",
                        t3r6b3: "Institutsional investorlarning mavjudligi",
                        t3r6b4: "Emitent ma'lumotlari, emitent veb-sayti",
                        t3r6b5: "Yillik",
                        t3r6b6: "Har chorakda",
                        t3r6b7: "5",
                        t3r6b8: "Inson omili",
                    },
                },
            },
        },
        (err, t) => {
            if (err) console.error("i18next init error", err);
            translateAll();
        }
    );

    function translateAll() {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.dataset.i18n;
            if (!key) return;

            let translated =
                i18next.t(key, { interpolation: { escapeValue: false } }) || "";
            translated = translated.replace(/\n/g, "<br>");

            if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") {
                el.innerHTML = translated;
            } else {
                el.value = translated;
            }
        });
    }

    document.querySelectorAll(".language-dropdown__option").forEach((option) => {
        option.addEventListener("click", () => {
            const lang = option.dataset.lang;
            if (!lang) return;
            localStorage.setItem("lang", lang);

            i18next.changeLanguage(lang, (err) => {
                if (err) console.error(err);
                translateAll();
            });
        });
    });
});