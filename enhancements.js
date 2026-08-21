(() => {
  "use strict";

  const outfits = {
    base: { label: "база", src: "./room/anya-base-v6.webp", laptopSrc: "./room/anya-laptop-base-v5.webp", alt: "Аня в чёрной водолазке, свободных чёрных брюках и объёмном застёгнутом бордовом кардигане" },
    novinki: { label: "в новинки", src: "./room/anya-novinki-v6.webp", laptopSrc: "./room/anya-laptop-novinki-v5.webp", alt: "Аня в полностью белом образе со смирительной рубашкой" },
    botanical: { label: "в ботанический сад", src: "./room/anya-botanical-v6.webp", laptopSrc: "./room/anya-laptop-botanical-v5.webp", alt: "Аня в чёрной майке, белой шёлковой юбке и чёрных таби с бабл-ти" },
    ambulance: { label: "на смену", src: "./room/anya-ambulance-v5.webp", laptopSrc: "./room/anya-laptop-ambulance-v5.webp", alt: "Аня в бордовой форме скорой помощи с головой, повёрнутой в сторону" },
  };

  const films = {
    spider: { label: "Человек-паук", src: "./room/spider-poster.jpg", alt: "Постер Человека-паука" },
    dragon: { label: "Как приручить дракона", src: "./room/dragon-poster.jpg", alt: "Постер фильма Как приручить дракона" },
  };

  const laptopGames = {
    minecraft: { label: "Minecraft", src: "./room/laptop/minecraft-opt.jpg" },
    roblox: { label: "Roblox", src: "./room/laptop/roblox-opt.jpg" },
    terraria: { label: "Terraria", src: "./room/laptop/terraria-opt.jpg" },
    genshin: { label: "Genshin Impact", src: "./room/laptop/genshin-opt.jpg" },
  };

  const tracks = [
    { title: "Key", src: "./audio/01-key.mp3" },
    { title: "Wet Hands", src: "./audio/02-wet-hands.mp3" },
    { title: "Судно — Птахи", src: "./audio/03-sudno-ptakhi.mp3" },
    { title: "I Want Things To Be Beautiful", src: "./audio/04-beautiful.mp3" },
  ];

  const dictionaryEntries = [
    { term: "our us", options: ["наш нас", "это латынь", "уровень английского С3"], correct: 2 },
    { term: "трубакулек", options: ["трубочка со сгущёнкой", "туберкулёз", "трубопровод"], correct: 1 },
    { term: "эминем", options: ["репер", "иммунитет", "импотент"], correct: 1 },
    { term: "ну ты и фуф", options: ["ответ нелицемера", "оскорбление", "кокетничество"], correct: 0 },
    { term: "фигурный фигурист", options: ["фигурист с повышенным уровнем фигурности", "стройный фигурист", "фигурный фигурист"], correct: 2 },
    { term: "любу дала", options: ["дала Любе", "дала лыбу", "доить корову Любу"], correct: 1 },
  ];

  const defaultBooks = ["Цветы для Элджернона", "Всё ради игры", "Лето в пионерском галстуке"];
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  function waitForApp(tries = 0) {
    const room = qs(".roomSection");
    const games = qs(".gameHubSection");
    const archive = qs(".gallerySection");
    const dictionary = qs(".dictionarySection");
    const letter = qs(".letterSection");
    if (!room || !games || !archive || !dictionary || !letter) {
      if (tries < 160) window.setTimeout(() => waitForApp(tries + 1), 50);
      return;
    }
    if (document.documentElement.dataset.anyaEnhancements === "v8") return;
    document.documentElement.dataset.anyaEnhancements = "v8";
    cleanOpeningScreen();
    enhanceRoom(room);
    enhanceGames(games);
    enhanceDictionary(dictionary);
    lockArchive(archive);
    cleanThenAndNow();
    lockPastSection();
    replaceLetterWithFinale(letter);
  }

  function cleanOpeningScreen() {
    qsa(".heroDate, .secretNote, .navMonogram").forEach((element) => element.remove());
    const unwanted = new Set(["19 августа 2026 · двадцать один", "для тех, у кого есть секретная ссылка", "А · 21"]);
    qsa(".hero p, .hero a, .topNav a").forEach((element) => {
      if (unwanted.has(element.textContent.trim())) element.remove();
    });
    const finaleLink = qs('.topNav a[href="#letter"]');
    if (finaleLink) finaleLink.textContent = "сюрприз";
  }

  function enhanceDictionary(section) {
    section.innerHTML = `
      <div class="dictionaryHeading contentWidth dictionary-heading-v3">
        <div><p class="sectionKicker">локальный переводчик</p><h2>Словарь</h2></div>
        <p id="dictionaryScore" aria-live="polite">0 из ${dictionaryEntries.length}</p>
      </div>
      <div class="dictionaryQuiz contentWidth">
        ${dictionaryEntries.map((entry, entryIndex) => `
          <article class="dictionaryQuestion" data-dictionary-question="${entryIndex}">
            <h3>${escapeHtml(entry.term)}</h3>
            <div class="dictionaryOptions">
              ${entry.options.map((option, optionIndex) => `
                <button type="button" data-answer="${optionIndex}" data-correct="${optionIndex === entry.correct}">
                  <span>${String.fromCharCode(65 + optionIndex)}</span>${escapeHtml(option)}
                </button>`).join("")}
            </div>
            <p class="dictionaryFeedback" aria-live="polite"></p>
          </article>`).join("")}
      </div>`;

    const solved = new Set();
    const score = qs("#dictionaryScore", section);
    qsa("[data-dictionary-question]", section).forEach((question) => {
      const index = Number(question.dataset.dictionaryQuestion);
      const feedback = qs(".dictionaryFeedback", question);
      qsa("[data-answer]", question).forEach((button) => {
        button.addEventListener("click", () => {
          qsa("[data-answer]", question).forEach((item) => {
            item.classList.remove("correct", "wrong");
            item.removeAttribute("aria-pressed");
          });
          const isCorrect = button.dataset.correct === "true";
          button.classList.add(isCorrect ? "correct" : "wrong");
          button.setAttribute("aria-pressed", "true");
          feedback.textContent = isCorrect ? "Правильно" : "Нет, попробуй ещё раз";
          feedback.className = `dictionaryFeedback ${isCorrect ? "correct" : "wrong"}`;
          if (isCorrect) solved.add(index);
          score.textContent = `${solved.size} из ${dictionaryEntries.length}`;
        });
      });
    });
  }

  function enhanceRoom(section) {
    section.innerHTML = `
      <div class="roomHeading contentWidth room-heading-v3">
        <div><p class="sectionKicker">интерактивная комната</p><h2>Комната Ани</h2></div>
      </div>
      <div class="roomViewport room-viewport-v3 contentWidth">
        <div class="roomStage room-stage-v3" id="roomStageV3">
          <img class="roomBackdrop room-backdrop-v3" src="./room/room-front-v6.webp" alt="Комната Ани, показанная прямо спереди">
          <div class="roomHud room-hud-v3" aria-live="polite"><span class="roomDot"></span><p id="roomStatus">Нажимай прямо на предметы в комнате.</p></div>
          <div class="lamp-glow-v3" aria-hidden="true"></div>
          <div class="tv-screen-v3" aria-hidden="true"><img id="tvImage" alt="" hidden><div id="tvNoiseV3" class="tv-noise-v3"><span>тихий эфир</span></div></div>
          <div class="laptop-unit-v5" aria-hidden="true">
            <img class="laptop-shell-v5" src="./room/laptop-shell-v5.webp" alt="">
            <div class="laptop-screen-v5"><img id="laptopImage" src="${laptopGames.minecraft.src}" alt="Заставка Minecraft"></div>
          </div>
          <button type="button" class="room-object poster-object-v3" data-room-object="poster" aria-label="Рассмотреть плакат Лололошки и JDH"><img src="./room/lololoshka-jdh-poster.jpg" alt="Плакат Лололошки и JDH"><span>плакат</span></button>
          <div id="addedBookSpines" class="added-book-spines-v3" aria-label="Книги на полке"></div>
          <div class="radio-readout-v3" id="radioRoomTitle">Key</div>
          <button type="button" id="anyaStanding" class="anya-object-v3" data-room-object="anya" data-outfit="base" aria-label="Выбрать действие для Ани"><img id="anyaCharacter" src="${outfits.base.src}" alt="${outfits.base.alt}"><span>Аня</span></button>
          <button type="button" id="anyaSleeping" class="sleeping-anya-v3" data-room-object="anya" aria-label="Разбудить Аню" hidden><img src="./room/anya-sleep-v2.webp" alt="Аня спит под одеялом"><span>разбудить</span></button>
          <button type="button" id="anyaLaptop" class="laptop-anya-v3" data-room-object="anya" aria-label="Аня сидит за ноутбуком" hidden><img id="anyaLaptopImage" src="${outfits.base.laptopSrc}" alt="Аня в базовом образе сидит на табуретке у ноутбука, повернувшись к столу спиной к комнате"><span>Аня за ноутбуком</span></button>
          <button type="button" id="simaSpriteV3" class="sima-v3 walking" data-room-object="sima" aria-label="Погладить Симу"><span class="sima-visual-v5"><img src="./room/sima-walk-v2.webp" alt="Сима гуляет по комнате"></span><span class="sima-label">Сима</span><span class="sima-hearts-v3" aria-hidden="true">♡ ♡ ♡</span></button>
          <button type="button" id="simaBowlV8" class="sima-bowl-v8" data-room-object="bowl" aria-label="Миска Симы"><img src="./games/sima/bowl-empty-v8.webp" alt="Керамическая миска Симы"><span>миска Симы</span></button>
          <button type="button" id="simaFeedingV8" class="sima-feeding-v8" data-room-object="bowl" aria-label="Сима кушает из миски" hidden><img class="sima-feeding-cat-v8" src="./games/sima/sima-eat-v8.webp" alt="Сима кушает"><img class="sima-feeding-bowl-v8" src="./games/sima/bowl-full-v8.webp" alt="Миска с кормом"><span>Сима кушает</span><i aria-hidden="true">мр-р</i></button>
          <button type="button" class="room-target target-bed" data-room-object="bed" aria-label="Отправить Аню спать"><span>кровать</span></button>
          <button type="button" class="room-target target-tv" data-room-object="tv" aria-label="Управлять телевизором"><span>телевизор</span></button>
          <button type="button" class="room-target target-laptop" data-room-object="laptop" aria-label="Выбрать игру на ноутбуке"><span>ноутбук</span></button>
          <button type="button" class="room-target target-radio" data-room-object="radio" aria-label="Управлять радио"><span>радио</span></button>
          <button type="button" class="room-target target-books" data-room-object="books" aria-label="Открыть книжный шкаф"><span>книжный шкаф</span></button>
          <button type="button" class="room-target target-wardrobe" data-room-object="wardrobe" aria-label="Переодеть Аню"><span>гардероб</span></button>
          <button type="button" class="room-target target-lamp" data-room-object="lamp" aria-label="Выключить свет"><span>свет</span></button>
          <aside id="roomPanel" class="room-object-panel" aria-live="polite" hidden></aside>
          <audio id="roomAudio" preload="metadata"></audio>
          <audio id="simaPurr" src="./audio/sima-purr-v5.mp3" preload="auto"></audio>
        </div>
      </div>
      <div id="booksModal" class="room-modal room-modal-v3" role="dialog" aria-modal="true" aria-labelledby="booksTitle" hidden>
        <div class="room-modal-card"><button type="button" class="room-modal-close" aria-label="Закрыть">×</button><p class="sectionKicker">книжный шкаф</p><h3 id="booksTitle">Книги Ани</h3>
          <form id="bookForm"><label for="bookTitle">Название книги</label><div><input id="bookTitle" maxlength="60" autocomplete="off" placeholder="Название книги"><button type="submit">добавить</button></div></form>
          <ul id="bookList"></ul><small>Добавленные книги сохраняются на этом устройстве и появляются на полке.</small>
        </div>
      </div>
      <div id="posterModal" class="room-modal poster-modal-v3" role="dialog" aria-modal="true" aria-label="Плакат Лололошки и JDH" hidden>
        <div class="poster-modal-card"><button type="button" class="room-modal-close" aria-label="Закрыть">×</button><img src="./room/lololoshka-jdh-poster.jpg" alt="Плакат Лололошки и JDH крупным планом"></div>
      </div>`;

    const stage = qs("#roomStageV3", section);
    const status = qs("#roomStatus", section);
    const panel = qs("#roomPanel", section);
    const anyaStanding = qs("#anyaStanding", section);
    const anyaSleeping = qs("#anyaSleeping", section);
    const anyaLaptop = qs("#anyaLaptop", section);
    const anyaImage = qs("#anyaCharacter", section);
    const anyaLaptopImage = qs("#anyaLaptopImage", section);
    const sima = qs("#simaSpriteV3", section);
    const simaImage = qs("img", sima);
    const simaBowl = qs("#simaBowlV8", section);
    const simaFeeding = qs("#simaFeedingV8", section);
    const audio = qs("#roomAudio", section);
    const simaPurr = qs("#simaPurr", section);
    let activity = "standing";
    let currentOutfit = "base";
    let trackIndex = 0;
    let simaTimeout = 0;
    let simaIsEating = false;
    let lightsOn = true;
    let activePanelAnchor = null;

    function say(message) { status.textContent = message; }
    function closePanel() {
      panel.hidden = true;
      panel.innerHTML = "";
      panel.removeAttribute("style");
      activePanelAnchor = null;
      qsa("[data-room-object]", stage).forEach((item) => item.classList.remove("selected"));
    }
    function positionPanel(anchor) {
      if (!anchor || panel.hidden) return;
      panel.style.left = "50%";
      panel.style.top = "0";
      panel.style.bottom = "auto";
      const stageBox = stage.getBoundingClientRect();
      const anchorBox = anchor.getBoundingClientRect();
      const panelBox = panel.getBoundingClientRect();
      const gap = 12;
      const edge = 12;
      const anchorLeft = anchorBox.left - stageBox.left;
      const anchorTop = anchorBox.top - stageBox.top;
      let left = anchorLeft + anchorBox.width / 2;
      let top = anchorTop + anchorBox.height + gap;
      if (top + panelBox.height > stageBox.height - edge) top = anchorTop - panelBox.height - gap;
      left = Math.max(panelBox.width / 2 + edge, Math.min(stageBox.width - panelBox.width / 2 - edge, left));
      top = Math.max(edge, Math.min(stageBox.height - panelBox.height - edge, top));
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.setProperty("--panel-arrow-x", `${Math.max(20, Math.min(panelBox.width - 20, anchorLeft + anchorBox.width / 2 - (left - panelBox.width / 2)))}px`);
      panel.dataset.placement = top < anchorTop ? "above" : "below";
      if (window.matchMedia("(max-width: 640px)").matches) {
        window.setTimeout(() => panel.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" }), 20);
      }
    }
    function showPanel(kind, title, content) {
      panel.className = `room-object-panel panel-${kind}`;
      panel.innerHTML = `<button type="button" class="room-panel-close" aria-label="Закрыть">×</button><p>${escapeHtml(title)}</p><div>${content}</div>`;
      panel.hidden = false;
      qs(".room-panel-close", panel).addEventListener("click", closePanel);
      qsa("[data-room-object]", stage).forEach((item) => item.classList.toggle("selected", item.dataset.roomObject === kind));
      window.requestAnimationFrame(() => positionPanel(activePanelAnchor));
    }
    function setActivity(next) {
      activity = next;
      if (next === "laptop") {
        const outfit = outfits[currentOutfit];
        anyaLaptopImage.src = outfit.laptopSrc;
        anyaLaptopImage.alt = `Аня в образе «${outfit.label}» сидит на табуретке у ноутбука спиной к комнате`;
      }
      anyaStanding.hidden = next !== "standing";
      anyaSleeping.hidden = next !== "sleeping";
      anyaLaptop.hidden = next !== "laptop";
      stage.classList.toggle("anya-at-laptop", next === "laptop");
      if (next === "sleeping") say("Аня легла точно на кровать и уже спит.");
      else if (next === "laptop") say("Аня села на табуретку и устроилась за ноутбуком.");
      else say("Аня снова в комнате.");
    }
    function openAnyaPanel() {
      showPanel("anya", "Что будет делать Аня?", `<button type="button" data-anya-action="sleeping">отправить спать</button><button type="button" data-anya-action="laptop">посидеть за ноутбуком</button>${activity !== "standing" ? '<button type="button" data-anya-action="standing">вернуться в комнату</button>' : ""}`);
      qsa("[data-anya-action]", panel).forEach((button) => button.addEventListener("click", () => { setActivity(button.dataset.anyaAction); closePanel(); }));
    }
    function openBedPanel() {
      showPanel("bed", "Кровать", `<button type="button" data-bed-sleep>отправить Аню спать</button>${activity === "sleeping" ? '<button type="button" data-bed-wake>разбудить Аню</button>' : ""}`);
      qs("[data-bed-sleep]", panel).addEventListener("click", () => { setActivity("sleeping"); closePanel(); });
      qs("[data-bed-wake]", panel)?.addEventListener("click", () => { setActivity("standing"); closePanel(); });
    }
    function openWardrobePanel() {
      showPanel("wardrobe", "Гардероб", Object.entries(outfits).map(([key, outfit]) => `<button type="button" data-outfit="${key}" class="${key === currentOutfit ? "active" : ""}">${escapeHtml(outfit.label)}</button>`).join(""));
      qsa("[data-outfit]", panel).forEach((button) => button.addEventListener("click", () => {
        currentOutfit = button.dataset.outfit;
        const outfit = outfits[currentOutfit];
        anyaImage.classList.add("changing");
        window.setTimeout(() => {
          anyaStanding.dataset.outfit = currentOutfit;
          anyaImage.src = outfit.src;
          anyaImage.alt = outfit.alt;
          anyaLaptopImage.src = outfit.laptopSrc;
          anyaLaptopImage.alt = `Аня в образе «${outfit.label}» сидит на табуретке у ноутбука спиной к комнате`;
          anyaImage.classList.remove("changing");
        }, 140);
        setActivity("standing"); say(`Выбран образ «${outfit.label}».`); closePanel();
      }));
    }
    function openTvPanel() {
      showPanel("tv", "Что включить?", `${Object.entries(films).map(([key, film]) => `<button type="button" data-film="${key}">${escapeHtml(film.label)}</button>`).join("")}<button type="button" data-film="off">выключить</button>`);
      qsa("[data-film]", panel).forEach((button) => button.addEventListener("click", () => {
        const image = qs("#tvImage", section); const noise = qs("#tvNoiseV3", section); const key = button.dataset.film;
        if (key === "off") { image.hidden = true; image.removeAttribute("src"); noise.hidden = false; say("Телевизор выключен."); }
        else { image.src = films[key].src; image.alt = films[key].alt; image.hidden = false; noise.hidden = true; say(`На телевизоре — ${films[key].label}.`); }
        closePanel();
      }));
    }
    function openLaptopPanel() {
      showPanel("laptop", "Во что поиграть?", `${Object.entries(laptopGames).map(([key, game]) => `<button type="button" data-laptop-game="${key}">${escapeHtml(game.label)}</button>`).join("")}<button type="button" data-seat-anya>посадить Аню за ноутбук</button>`);
      qsa("[data-laptop-game]", panel).forEach((button) => button.addEventListener("click", () => {
        const game = laptopGames[button.dataset.laptopGame]; const image = qs("#laptopImage", section); image.classList.add("switching");
        window.setTimeout(() => { image.src = game.src; image.alt = `Заставка ${game.label}`; image.classList.remove("switching"); }, 120);
        say(`На ноутбуке выбрана игра ${game.label}.`); closePanel();
      }));
      qs("[data-seat-anya]", panel).addEventListener("click", () => { setActivity("laptop"); closePanel(); });
    }
    function loadTrack(index, shouldPlay = false) {
      trackIndex = (index + tracks.length) % tracks.length;
      const track = tracks[trackIndex]; audio.src = track.src; qs("#radioRoomTitle", section).textContent = track.title; say(`На радио выбрано: ${track.title}.`);
      if (shouldPlay) audio.play().then(() => stage.classList.add("radio-playing")).catch(() => {});
    }
    function toggleRadio() {
      if (!audio.src) loadTrack(trackIndex, false);
      if (audio.paused) audio.play().then(() => { stage.classList.add("radio-playing"); say(`Играет: ${tracks[trackIndex].title}.`); openRadioPanel(); }).catch(() => {});
      else { audio.pause(); stage.classList.remove("radio-playing"); say("Радио поставлено на паузу."); openRadioPanel(); }
    }
    function openRadioPanel() {
      showPanel("radio", "Радио", `<strong class="panel-track-title">${escapeHtml(tracks[trackIndex].title)}</strong><button type="button" data-radio="prev" aria-label="Предыдущая песня">←</button><button type="button" data-radio="play">${audio.paused ? "включить" : "пауза"}</button><button type="button" data-radio="next" aria-label="Следующая песня">→</button>`);
      qsa("[data-radio]", panel).forEach((button) => button.addEventListener("click", () => {
        if (button.dataset.radio === "prev") { loadTrack(trackIndex - 1, !audio.paused); openRadioPanel(); }
        else if (button.dataset.radio === "next") { loadTrack(trackIndex + 1, !audio.paused); openRadioPanel(); }
        else toggleRadio();
      }));
    }
    function petSima() {
      if (simaIsEating) { say("Сима занята ужином. Погладим её чуть позже."); return; }
      simaPurr.pause(); simaPurr.currentTime = 0; simaPurr.volume = .68; simaPurr.play().catch(() => {});
      window.clearTimeout(simaTimeout); sima.classList.remove("walking"); sima.classList.add("petted"); simaImage.src = "./room/sima-pet-v2.webp"; simaImage.alt = "Довольная Сима после поглаживания"; say("Сима поглажена и очень довольна.");
      simaTimeout = window.setTimeout(() => { sima.classList.remove("petted"); sima.classList.add("walking"); simaImage.src = "./room/sima-walk-v2.webp"; simaImage.alt = "Сима гуляет по комнате"; }, 4200);
    }
    function finishFeeding() {
      simaIsEating = false;
      simaFeeding.hidden = true;
      simaBowl.hidden = false;
      sima.hidden = false;
      sima.classList.add("walking");
      simaImage.src = "./room/sima-walk-v2.webp";
      simaImage.alt = "Сима гуляет по комнате";
      say("Сима всё съела и снова пошла исследовать комнату.");
    }
    function feedSima() {
      window.clearTimeout(simaTimeout);
      closePanel();
      simaIsEating = true;
      sima.classList.remove("walking", "petted");
      sima.hidden = true;
      simaBowl.hidden = true;
      simaFeeding.hidden = false;
      say("Сима пришла к миске и с удовольствием кушает.");
      simaTimeout = window.setTimeout(finishFeeding, 8500);
    }
    function openBowlPanel() {
      if (simaIsEating) {
        showPanel("bowl", "Миска Симы", '<button type="button" data-let-sima-eat>не мешать Симе кушать</button>');
        qs("[data-let-sima-eat]", panel).addEventListener("click", closePanel);
        return;
      }
      showPanel("bowl", "Миска Симы", '<button type="button" data-feed-sima>положить корм и позвать Симу</button>');
      qs("[data-feed-sima]", panel).addEventListener("click", feedSima);
    }
    function toggleLamp() {
      lightsOn = !lightsOn; stage.classList.toggle("lights-off", !lightsOn); qs(".target-lamp", section).setAttribute("aria-label", lightsOn ? "Выключить свет" : "Включить свет"); say(lightsOn ? "Свет снова включён." : "Свет выключен. В комнате остался ночной свет из окна."); closePanel();
    }
    function openPoster() { qs("#posterModal", section).hidden = false; document.body.classList.add("room-modal-open"); }

    const booksController = setupBooks(section, say);
    setupModal(qs("#posterModal", section));
    qsa("[data-room-object]", stage).forEach((button) => button.addEventListener("click", (event) => {
      event.stopPropagation(); const kind = button.dataset.roomObject; activePanelAnchor = button;
      if (kind === "anya") openAnyaPanel(); else if (kind === "bed") openBedPanel(); else if (kind === "tv") openTvPanel(); else if (kind === "laptop") openLaptopPanel(); else if (kind === "radio") openRadioPanel(); else if (kind === "books") booksController.open(); else if (kind === "wardrobe") openWardrobePanel(); else if (kind === "lamp") toggleLamp(); else if (kind === "poster") openPoster(); else if (kind === "sima") petSima(); else if (kind === "bowl") openBowlPanel();
    }));
    stage.addEventListener("click", (event) => { if (event.target === stage || event.target.classList.contains("room-backdrop-v3")) closePanel(); });
    audio.addEventListener("ended", () => { loadTrack(trackIndex + 1, true); if (!panel.hidden && panel.classList.contains("panel-radio")) openRadioPanel(); });
    loadTrack(0, false); say("Нажимай прямо на предметы в комнате.");
  }

  function setupBooks(section, say) {
    const modal = qs("#booksModal", section); const form = qs("#bookForm", section); const input = qs("#bookTitle", section); const list = qs("#bookList", section); const spines = qs("#addedBookSpines", section); const storageKey = "anya-room-books-v3"; let customBooks = [];
    try { customBooks = JSON.parse(localStorage.getItem(storageKey) || "[]"); if (!Array.isArray(customBooks)) customBooks = []; } catch { customBooks = []; }
    const allBooks = () => [...defaultBooks, ...customBooks];
    function save() { try { localStorage.setItem(storageKey, JSON.stringify(customBooks)); } catch {} }
    function render() {
      list.innerHTML = allBooks().map((book, index) => { const isDefault = index < defaultBooks.length; return `<li><span>${escapeHtml(book)}</span>${isDefault ? '<small>уже на полке</small>' : `<button type="button" data-remove-book="${index - defaultBooks.length}" aria-label="Убрать книгу ${escapeHtml(book)}">×</button>`}</li>`; }).join("");
      const colors = ["#6e405c", "#47547d", "#7a6245", "#58466f", "#3f6668", "#824d4d", "#525d85", "#765a70"];
      spines.innerHTML = allBooks().slice(0, 10).map((book, index) => `<span style="--book-index:${index};--book-color:${colors[index % colors.length]}" title="${escapeHtml(book)}"><i></i><b>${escapeHtml(book)}</b></span>`).join("");
      qsa("[data-remove-book]", list).forEach((button) => button.addEventListener("click", () => { customBooks.splice(Number(button.dataset.removeBook), 1); save(); render(); }));
    }
    function open() { modal.hidden = false; document.body.classList.add("room-modal-open"); window.setTimeout(() => input.focus(), 30); }
    function close() { modal.hidden = true; document.body.classList.remove("room-modal-open"); }
    qs(".room-modal-close", modal).addEventListener("click", close); modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
    form.addEventListener("submit", (event) => { event.preventDefault(); const value = input.value.trim(); if (!value) return; if (!allBooks().some((book) => book.toLocaleLowerCase("ru") === value.toLocaleLowerCase("ru"))) { customBooks.push(value); customBooks = customBooks.slice(-17); save(); render(); say(`Книга «${value}» появилась на полке.`); } input.value = ""; });
    render(); return { open, close };
  }

  function setupModal(modal) {
    const close = () => { modal.hidden = true; document.body.classList.remove("room-modal-open"); };
    qs(".room-modal-close", modal).addEventListener("click", close); modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
    window.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) close(); });
  }

  function lockArchive(section) {
    const grid = qs(".photoGrid", section); if (!grid) return; grid.hidden = true; section.classList.add("archive-locked"); qs(".archive-gate", section)?.remove();
    const gate = document.createElement("div"); gate.className = "archive-gate contentWidth";
    gate.innerHTML = `<div class="archive-gate-card"><span class="archive-lock-icon" aria-hidden="true">⌁</span><p class="sectionKicker">доступ к киноплёнке</p><h3>Сначала пароль</h3><p>Подсказка: напиши фрукт, который поют альты в хоре.</p><form><label for="archivePassword">Пароль</label><div><input id="archivePassword" type="text" inputmode="text" lang="ru" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Введите ответ"><button type="submit">открыть архив</button></div></form><small id="archiveMessage" aria-live="polite"></small></div>`;
    grid.before(gate); const form = qs("form", gate); const input = qs("input", gate); const message = qs("#archiveMessage", gate);
    form.addEventListener("submit", (event) => { event.preventDefault(); const answer = input.value.trim().toLocaleLowerCase("ru").normalize("NFC");
      if (answer === "манго" || answer === "mango") { gate.classList.add("unlocked"); grid.hidden = false; section.classList.remove("archive-locked"); message.textContent = "Верно. Киноплёнка открыта."; window.setTimeout(() => { gate.hidden = true; grid.scrollIntoView({ behavior: "smooth", block: "start" }); }, 450); }
      else { gate.classList.remove("wrong"); void gate.offsetWidth; gate.classList.add("wrong"); message.textContent = "Не тот фрукт. Попробуй ещё раз."; input.select(); }
    });
  }

  function cleanThenAndNow() { const section = qs(".thenNowSection"); if (!section) return; qs(".thenNowCopy .sectionKicker", section)?.remove(); qsa(".thenNowMedia figcaption", section).forEach((caption) => caption.remove()); }

  function lockPastSection() {
    const section = qs(".thenNowSection");
    if (!section || section.dataset.pastGate === "v5") return;
    section.dataset.pastGate = "v5";
    section.classList.add("past-gated-v5");

    const content = document.createElement("div");
    content.className = "past-content-v5 contentWidth";
    while (section.firstChild) content.append(section.firstChild);
    content.hidden = true;

    const gate = document.createElement("div");
    gate.className = "past-gate-v5 contentWidth";
    gate.innerHTML = `<div class="past-gate-card-v5"><span class="archive-lock-icon" aria-hidden="true">⌁</span><h2>Доступны материалы из далекого прошлого.</h2><p>Введи овощ, который добавляют в мультифруктовый сок в лучшей столовой мира.</p><form><label for="pastPassword">Пароль</label><div><input id="pastPassword" type="text" lang="ru" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Введите ответ"><button type="submit">открыть</button></div></form><small id="pastPasswordMessage" aria-live="polite"></small></div>`;
    section.append(gate, content);

    const form = qs("form", gate);
    const input = qs("input", gate);
    const message = qs("#pastPasswordMessage", gate);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const answer = input.value.trim().toLocaleLowerCase("ru").normalize("NFC");
      if (answer === "огурец") {
        gate.classList.add("unlocked");
        content.hidden = false;
        message.textContent = "Верно. Материалы открыты.";
        window.setTimeout(() => { gate.hidden = true; content.scrollIntoView({ behavior: "smooth", block: "start" }); }, 420);
      } else {
        gate.classList.remove("wrong"); void gate.offsetWidth; gate.classList.add("wrong");
        message.textContent = "Не тот овощ. Попробуй ещё раз.";
        input.select();
      }
    });
  }

  function replaceLetterWithFinale(section) { section.className = "finaleSection"; section.id = "letter"; section.innerHTML = `<button type="button" id="finalSurprise" class="celebrateButton final-surprise-button">последний сюрприз. <span>✦</span></button>`; qs("#finalSurprise", section).addEventListener("click", launchCelebration); }

  function launchCelebration() {
    qs(".site-celebration")?.remove(); const overlay = document.createElement("div"); overlay.className = "site-celebration"; overlay.setAttribute("aria-hidden", "true"); const fireworks = document.createElement("div"); fireworks.className = "site-fireworks";
    const positions = [[12,22,0],[31,16,.35],[51,27,.8],[72,15,.2],[88,29,1.1],[19,52,1.35],[43,46,1.65],[65,55,1.2],[83,48,1.85]];
    const mobileCelebration = window.matchMedia("(max-width: 640px)").matches; const particleCount = mobileCelebration ? 12 : 18;
    positions.forEach(([x,y,delay], burstIndex) => { const burst = document.createElement("span"); burst.className = "firework-burst"; burst.style.setProperty("--x", `${x}%`); burst.style.setProperty("--y", `${y}%`); burst.style.setProperty("--delay", `${delay}s`); burst.style.setProperty("--hue", `${(burstIndex * 43 + 265) % 360}`); for (let index = 0; index < particleCount; index += 1) { const particle = document.createElement("i"); particle.style.setProperty("--angle", `${index * (360 / particleCount)}deg`); particle.style.setProperty("--distance", `${(mobileCelebration ? 48 : 72) + (index % 4) * (mobileCelebration ? 11 : 18)}px`); burst.append(particle); } fireworks.append(burst); });
    overlay.innerHTML = `<div class="age-balloons"><span class="balloon-two">2</span><span class="balloon-one">1</span></div>`; overlay.prepend(fireworks); document.body.append(overlay); window.setTimeout(() => overlay.remove(), 8200);
  }

  function enhanceGames(section) {
    section.innerHTML = `<div class="gameHubHeading contentWidth game-heading-v3"><h2>Игры</h2></div><div class="gameLaunchers contentWidth">
      <button type="button" class="gameLauncher cokeLauncher" data-open-game="coke"><span>01</span><img src="./games/cocacola-zero-v2.webp" alt=""><div><b>Zero hunt</b><p>Помоги Ане собрать запас колы.</p></div><i>играть →</i></button>
      <button type="button" class="gameLauncher ambulanceLauncher" data-open-game="ambulance"><span>02</span><img src="./games/ambulance-anya.webp" alt=""><div><b>Ночная смена</b><p>Помоги Ане доехать до всех вызовов.</p></div><i>играть →</i></button>
      <button type="button" class="gameLauncher simaLauncherV8" data-open-game="sima"><span>03</span><span class="sima-launcher-art-v8" aria-hidden="true"><img class="sima-launcher-bg-v8" src="./games/sima/nook-background-v8.webp" alt=""><img class="sima-launcher-cat-v8" src="./games/sima/sima-idle-v8.webp" alt=""><img class="sima-launcher-bowl-v8" src="./games/sima/bowl-full-v8.webp" alt=""></span><div><b>Симин уголок</b><p>Проведи с Симой один идеальный уютный день.</p></div><i>зайти →</i></button>
      </div><div id="enhancedGameOverlay" class="gameOverlay enhanced-game-overlay" role="dialog" aria-modal="true" hidden></div>`;
    const overlay = qs("#enhancedGameOverlay", section); let cleanup = () => {};
    function close() { cleanup(); cleanup = () => {}; overlay.hidden = true; overlay.innerHTML = ""; document.body.style.overflow = ""; }
    qsa("[data-open-game]", section).forEach((button) => button.addEventListener("click", () => {
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
      if (button.dataset.openGame === "coke") cleanup = startCokeGame(overlay, close);
      else if (button.dataset.openGame === "ambulance") cleanup = startAmbulanceGame(overlay, close);
      else cleanup = startSimaGame(overlay, close);
    }));
    window.addEventListener("keydown", (event) => { if (event.key === "Escape" && !overlay.hidden) close(); });
  }

  function startCokeGame(root, closeGame) {
    root.innerHTML = `<div class="gamePage cokeGamePage coke-v3"><button type="button" class="gameClose">← к играм</button><div class="gameTopbar"><span>Zero hunt</span><b id="cokeScore">0 бутылок · ♥♥♥♥</b><b id="cokeTimer">01:00</b></div><div class="bottleArena coke-arena-v3"><div class="coke-room-glow" aria-hidden="true"></div><div id="cokeDrops" class="zeroDrops"></div><div id="cokeCooler" class="zeroCooler"><span>COCA-COLA</span><b>ZERO</b></div><div id="cokeStart" class="gameStartPanel"><img src="./games/cocacola-zero-v2.webp" alt="Классическая бутылка Coca-Cola Zero"><h3>Минута Zero</h3><p>Лови бутылки колы. Лёд добавляет немного времени, а Mentos отнимает жизнь. Скорость постепенно растёт.</p><small>Двигай сумку пальцем, мышью или стрелками.</small><button type="button">начать игру</button></div><div id="cokeResult" class="gameResult" hidden></div><div class="zeroControls"><button type="button" data-coke-move="left">←</button><p id="cokeMessage">Готовь холодильную сумку.</p><button type="button" data-coke-move="right">→</button></div></div></div>`;
    const arena = qs(".coke-arena-v3", root); const drops = qs("#cokeDrops", root); const cooler = qs("#cokeCooler", root); const timer = qs("#cokeTimer", root); const scoreLine = qs("#cokeScore", root); const message = qs("#cokeMessage", root); const startPanel = qs("#cokeStart", root); const result = qs("#cokeResult", root);
    let running = false, raf = 0, items = [], score = 0, lives = 4, coolerX = 50, timeLeft = 60, startAt = 0, bonusTime = 0, lastAt = 0, lastSpawn = 0;
    const formatTime = (seconds) => { const value = Math.max(0, Math.ceil(seconds)); return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`; };
    function updateHud() { timer.textContent = formatTime(timeLeft); scoreLine.textContent = `${score} бутылок · ${"♥".repeat(lives)}${"♡".repeat(4 - lives)}`; }
    function setCooler(value) { coolerX = Math.max(9, Math.min(91, value)); cooler.style.left = `${coolerX}%`; }
    function spawn(elapsed) { const random = Math.random(); const type = random < .6 ? "bottle" : random < .74 ? "ice" : "mentos"; const element = document.createElement("div"); element.className = `zeroDrop ${type}`; element.innerHTML = type === "bottle" ? '<img src="./games/cocacola-zero-v2.webp" alt="">' : type === "ice" ? '<span aria-hidden="true">❄</span>' : '<img src="./games/mentos-v3.webp" alt="">'; drops.append(element); items.push({ type, x: 7 + Math.random() * 86, y: -10, speed: 19 + Math.random() * 11 + elapsed * .12, spin: -28 + Math.random() * 56, element }); }
    function finish() { running = false; window.cancelAnimationFrame(raf); items.forEach((item) => item.element.remove()); items = []; result.hidden = false; result.innerHTML = `<strong>${lives <= 0 ? "Mentos победил" : "Минута пройдена"}</strong><p>Собрано бутылок: ${score}. ${score >= 18 ? "Запас официально внушительный." : "Можно попробовать собрать ещё больше."}</p><button type="button">сыграть ещё раз</button>`; qs("button", result).addEventListener("click", begin); }
    function frame(now) { if (!running) return; const dt = Math.min(.04, (now - lastAt) / 1000 || 0); lastAt = now; const elapsed = (now - startAt) / 1000; timeLeft = 60 + bonusTime - elapsed; const spawnDelay = Math.max(330, 570 - elapsed * 3.2); if (now - lastSpawn > spawnDelay) { lastSpawn = now; spawn(elapsed); } const next = []; items.forEach((item) => { item.y += item.speed * dt; item.element.style.left = `${item.x}%`; item.element.style.top = `${item.y}%`; item.element.style.transform = `translate(-50%, -50%) rotate(${item.spin + item.y * .65}deg)`; const caught = item.y >= 77 && item.y <= 92 && Math.abs(item.x - coolerX) < 11.5; if (caught) { if (item.type === "bottle") { score += 1; message.textContent = "Zero в запасе!"; } else if (item.type === "ice") { bonusTime = Math.min(12, bonusTime + 3); message.textContent = "+3 секунды прохлады."; } else { lives -= 1; message.textContent = "Mentos! Минус жизнь."; arena.classList.remove("coke-hit"); void arena.offsetWidth; arena.classList.add("coke-hit"); } item.element.remove(); } else if (item.y > 110) item.element.remove(); else next.push(item); }); items = next; updateHud(); if (timeLeft <= 0 || lives <= 0) finish(); else raf = window.requestAnimationFrame(frame); }
    function begin() { items.forEach((item) => item.element.remove()); items = []; score = 0; lives = 4; bonusTime = 0; timeLeft = 60; startAt = performance.now(); lastAt = startAt; lastSpawn = startAt - 300; startPanel.hidden = true; result.hidden = true; message.textContent = "Лови Zero и избегай Mentos."; running = true; updateHud(); raf = window.requestAnimationFrame(frame); }
    const moveBy = (delta) => setCooler(coolerX + delta); function keyHandler(event) { if (event.key === "ArrowLeft") moveBy(-8); if (event.key === "ArrowRight") moveBy(8); }
    arena.addEventListener("pointerdown", (event) => { if (!running) return; const box = arena.getBoundingClientRect(); setCooler(((event.clientX - box.left) / box.width) * 100); }); arena.addEventListener("pointermove", (event) => { if (!running || (!event.buttons && event.pointerType !== "touch")) return; const box = arena.getBoundingClientRect(); setCooler(((event.clientX - box.left) / box.width) * 100); });
    qsa("[data-coke-move]", root).forEach((button) => button.addEventListener("click", () => moveBy(button.dataset.cokeMove === "left" ? -10 : 10))); window.addEventListener("keydown", keyHandler); qs(".gameClose", root).addEventListener("click", closeGame); qs("#cokeStart button", root).addEventListener("click", begin); updateHud();
    return () => { running = false; window.cancelAnimationFrame(raf); window.removeEventListener("keydown", keyHandler); };
  }

  function startAmbulanceGame(root, closeGame) {
    const laneCenters = [45.5, 59, 72.5];
    root.innerHTML = `<div class="gamePage ambulanceGamePage ambulance-v3"><button type="button" class="gameClose">← к играм</button><div class="gameTopbar"><span>Ночная смена</span><b id="ambulanceScore">0 вызовов · ♥♥♥♥</b><b id="ambulanceSpeed">скорость ×1.0</b></div><div class="ambulanceArena ambulance-arena-v3"><div class="road-scroll" aria-hidden="true"></div><div id="roadEvents" class="road-events"></div><img id="ambulanceCar" class="ambulance-car-v3" src="./games/ambulance-anya.webp" alt="Скорая помощь с Аней за рулём"><div id="ambulanceStart" class="gameStartPanel ambulanceStart"><p>Перестраивайся между тремя полосами, доезжай до домиков-вызовов и объезжай конусы. Смена продолжается, пока не закончатся жизни, а дорога постепенно ускоряется.</p><button type="button">начать смену</button></div><div id="ambulanceResult" class="gameResult ambulanceResult" hidden></div><div class="laneControls"><button type="button" data-lane-move="up">↑ выше</button><p id="ambulanceMessage">Аня готова выезжать.</p><button type="button" data-lane-move="down">↓ ниже</button></div></div></div>`;
    const arena = qs(".ambulance-arena-v3", root); const road = qs(".road-scroll", root); const eventLayer = qs("#roadEvents", root); const car = qs("#ambulanceCar", root); const scoreLine = qs("#ambulanceScore", root); const speedLine = qs("#ambulanceSpeed", root); const message = qs("#ambulanceMessage", root); const startPanel = qs("#ambulanceStart", root); const result = qs("#ambulanceResult", root);
    const mobileMode = window.matchMedia("(max-width: 700px)").matches || window.matchMedia("(pointer: coarse)").matches;
    const mobileTravelBoost = mobileMode ? 1.5 : 1;
    if (mobileMode) road.style.animation = "none";
    let running = false, raf = 0, lane = 1, calls = 0, lives = 4, items = [], startAt = 0, lastAt = 0, lastSpawn = 0, roadOffset = 0;
    function updateHud(elapsed = 0) { const speedMultiplier = 1 + Math.min(elapsed, 240) / 82; scoreLine.textContent = `${calls} вызовов · ${"♥".repeat(lives)}${"♡".repeat(4 - lives)}`; speedLine.textContent = `скорость ×${speedMultiplier.toFixed(1)}`; car.style.top = `${laneCenters[lane]}%`; road.style.setProperty("--road-speed", `${Math.max(.7, 2.35 / speedMultiplier)}s`); }
    function setLane(value) { lane = Math.max(0, Math.min(2, value)); updateHud(running ? (performance.now() - startAt) / 1000 : 0); }
    function spawn() { const type = Math.random() < .6 ? "call" : "cone"; const element = document.createElement("span"); element.className = `road-event-v3 ${type}`; element.innerHTML = type === "call" ? '<img src="./games/call-house-v2.webp" alt="">' : '<img src="./games/traffic-cone-v2.webp" alt="">'; eventLayer.append(element); const eventLane = Math.floor(Math.random() * 3); element.style.top = `${laneCenters[eventLane]}%`; items.push({ type, lane: eventLane, x: 108, baseSpeed: 15 + Math.random() * 4, element }); }
    function finish() { running = false; window.cancelAnimationFrame(raf); road.classList.remove("moving"); items.forEach((item) => item.element.remove()); items = []; result.hidden = false; result.innerHTML = `<strong>Смена закончена</strong><p>Аня доехала до ${calls} ${pluralizeCalls(calls)}.</p><button type="button">ещё одна смена</button>`; qs("button", result).addEventListener("click", begin); }
    function frame(now) { if (!running) return; const dt = Math.min(.04, (now - lastAt) / 1000 || 0); lastAt = now; const elapsed = (now - startAt) / 1000; const difficulty = Math.min(elapsed, 240) * .085; const speedMultiplier = 1 + Math.min(elapsed, 240) / 82; const spawnDelay = Math.max(430, 1120 - elapsed * 5.2); if (mobileMode) { roadOffset -= arena.clientWidth * speedMultiplier * .62 * dt; road.style.backgroundPosition = `${roadOffset}px center`; } if (now - lastSpawn > spawnDelay) { lastSpawn = now; spawn(); } const next = []; items.forEach((item) => { item.x -= (item.baseSpeed + difficulty) * dt * mobileTravelBoost; item.element.style.left = `${item.x}%`; const collision = item.x <= 31 && item.x >= 16 && item.lane === lane; if (collision) { if (item.type === "call") { calls += 1; message.textContent = "Вызов принят. Едем дальше!"; } else { lives -= 1; message.textContent = "Конус! Минус жизнь."; arena.classList.remove("ambulance-hit"); void arena.offsetWidth; arena.classList.add("ambulance-hit"); } item.element.remove(); } else if (item.x < -12) item.element.remove(); else next.push(item); }); items = next; updateHud(elapsed); if (lives <= 0) finish(); else raf = window.requestAnimationFrame(frame); }
    function begin() { items.forEach((item) => item.element.remove()); items = []; lane = 1; calls = 0; lives = 4; roadOffset = 0; road.style.backgroundPosition = "0 center"; startAt = performance.now(); lastAt = startAt; lastSpawn = startAt - 520; startPanel.hidden = true; result.hidden = true; message.textContent = "Смена началась. Следи за дорогой."; road.classList.add("moving"); running = true; updateHud(0); raf = window.requestAnimationFrame(frame); }
    function keyHandler(event) { if (event.key === "ArrowUp" || event.key === "ArrowLeft") setLane(lane - 1); if (event.key === "ArrowDown" || event.key === "ArrowRight") setLane(lane + 1); }
    arena.addEventListener("pointerdown", (event) => { if (!running || event.target.closest("button")) return; const box = arena.getBoundingClientRect(); const y = ((event.clientY - box.top) / box.height) * 100; const closestLane = laneCenters.reduce((best, center, index) => Math.abs(center - y) < Math.abs(laneCenters[best] - y) ? index : best, 0); setLane(closestLane); });
    qsa("[data-lane-move]", root).forEach((button) => button.addEventListener("click", () => setLane(lane + (button.dataset.laneMove === "up" ? -1 : 1)))); window.addEventListener("keydown", keyHandler); qs(".gameClose", root).addEventListener("click", closeGame); qs("#ambulanceStart button", root).addEventListener("click", begin); updateHud(0);
    return () => { running = false; window.cancelAnimationFrame(raf); window.removeEventListener("keydown", keyHandler); };
  }

  function startSimaGame(root, closeGame) {
    const activities = [
      { id: "feed", label: "Ужин", note: "выбрать еду", asset: "bowl-full", stat: "fullness" },
      { id: "play", label: "Игра", note: "поймать игрушку", asset: "feather", stat: "joy" },
      { id: "brush", label: "Расчёсывание", note: "провести щёткой", asset: "brush", stat: "care" },
      { id: "box", label: "Коробки", note: "найти лучший домик", asset: "box", stat: "joy" },
      { id: "window", label: "Огоньки", note: "поймать светлячков", asset: "fireflies", stat: "joy" },
      { id: "sleep", label: "Сон", note: "устроить тихий час", asset: "bed", stat: "rest" },
    ];
    const poseFiles = {
      idle: "./games/sima/sima-idle-v8.webp",
      eat: "./games/sima/sima-eat-v8.webp",
      play: "./games/sima/sima-play-v8.webp",
      groom: "./games/sima/sima-groom-v8.webp",
      sleep: "./games/sima/sima-sleep-v8.webp",
      box: "./games/sima/sima-box-v8.webp",
    };
    const propFile = (name) => `./games/sima/${name}-v8.webp`;
    const storageKey = "anya-sima-nook-v8";
    const freshState = { fullness: 38, joy: 42, care: 35, rest: 46, completed: [], visited: false, celebrated: false };
    let state = { ...freshState };
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (stored && typeof stored === "object") state = { ...freshState, ...stored, completed: Array.isArray(stored.completed) ? stored.completed.filter((id) => activities.some((activity) => activity.id === id)) : [] };
    } catch {}

    root.innerHTML = `<div class="gamePage sima-game-page-v8">
      <button type="button" class="gameClose sima-game-close-v8">← к играм</button>
      <header class="gameTopbar sima-topbar-v8">
        <div class="sima-game-title-v8"><span>Симин уголок</span><small>тихий день без спешки</small></div>
        <div class="sima-needs-v8" aria-label="Состояние Симы">
          <div><span>сытость</span><i><b id="simaNeedFullness"></b></i><em id="simaNeedFullnessValue">0</em></div>
          <div><span>радость</span><i><b id="simaNeedJoy"></b></i><em id="simaNeedJoyValue">0</em></div>
          <div><span>уход</span><i><b id="simaNeedCare"></b></i><em id="simaNeedCareValue">0</em></div>
          <div><span>отдых</span><i><b id="simaNeedRest"></b></i><em id="simaNeedRestValue">0</em></div>
        </div>
        <button type="button" id="simaCollectionButton" class="sima-collection-button-v8"><span>коллекция</span><b id="simaCollectionCount">0 / 6</b></button>
      </header>
      <main id="simaNookV8" class="sima-nook-v8">
        <img class="sima-nook-background-v8" src="./games/sima/nook-background-v8.webp" alt="Уютный ночной уголок Симы">
        <div class="sima-ambient-v8" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <button type="button" class="sima-scene-prop-v8 sima-scene-box-v8" data-sima-action="box" aria-label="Исследовать коробку"><img src="./games/sima/box-v8.webp" alt="Коробка с пледом"><span>коробки</span></button>
        <button type="button" class="sima-scene-prop-v8 sima-scene-brush-v8" data-sima-action="brush" aria-label="Расчесать Симу"><img src="./games/sima/brush-v8.webp" alt="Щётка Симы"><span>щётка</span></button>
        <button type="button" class="sima-scene-prop-v8 sima-scene-bowl-v8" data-sima-action="feed" aria-label="Покормить Симу"><img id="simaSceneBowlImage" src="./games/sima/bowl-empty-v8.webp" alt="Миска Симы"><span>миска</span></button>
        <button type="button" class="sima-scene-prop-v8 sima-scene-yarn-v8" data-sima-action="play" aria-label="Поиграть с Симой"><img src="./games/sima/yarn-v8.webp" alt="Клубок Симы"><span>игрушки</span></button>
        <button type="button" class="sima-scene-prop-v8 sima-scene-bed-v8" data-sima-action="sleep" aria-label="Уложить Симу спать"><img src="./games/sima/bed-v8.webp" alt="Лежанка Симы"><span>лежанка</span></button>
        <button type="button" class="sima-window-hotspot-v8" data-sima-action="window" aria-label="Посмотреть с Симой в окно"><span>огоньки у окна</span></button>
        <div id="simaActionPropV8" class="sima-action-prop-v8" hidden><img alt=""></div>
        <button type="button" id="simaGameCatV8" class="sima-game-cat-v8" data-pose="idle" aria-label="Погладить Симу"><img src="${poseFiles.idle}" alt="Сима сидит в своём уютном уголке"><span class="sima-game-hearts-v8" aria-hidden="true">♡ ♡ ♡</span></button>
        <div id="simaSpeechV8" class="sima-speech-v8" aria-live="polite">Сима внимательно осматривает свой уголок.</div>
        <button type="button" id="simaPlayTargetV8" class="sima-play-target-v8" hidden><img alt="Игрушка Симы"></button>
        <div id="simaFirefliesV8" class="sima-fireflies-v8" aria-live="polite"></div>
        <div id="simaActivityV8" class="sima-activity-v8" hidden></div>
        <div id="simaCollectionV8" class="sima-collection-v8" role="dialog" aria-modal="true" aria-label="Коллекция Симы" hidden><div><button type="button" data-close-sima-collection aria-label="Закрыть">×</button><p>маленькие сокровища</p><h3>Коллекция Симы</h3><section id="simaCollectionGridV8"></section><small>Каждое воспоминание открывается после нового занятия с Симой.</small></div></div>
        <div id="simaWelcomeV8" class="sima-welcome-v8" ${state.visited ? "hidden" : ""}><div><img src="./games/sima/sima-idle-v8.webp" alt="Сима"><p>большая уютная игра</p><h2>Симин уголок</h2><span>Здесь не нужно побеждать и торопиться. Корми Симу, играй, расчёсывай, исследуй коробки и собирай воспоминания об идеальном тихом дне.</span><button type="button">зайти к Симе</button></div></div>
        <div id="simaCompleteV8" class="sima-complete-v8" hidden><div><span aria-hidden="true">✦</span><p>все воспоминания собраны</p><h2>Идеальный день Симы</h2><small>Сима сыта, вычесана, наигралась и совершенно довольна.</small><button type="button">остаться с Симой</button></div></div>
        <nav class="sima-action-dock-v8" aria-label="Занятия с Симой">${activities.map((activity) => `<button type="button" data-sima-action="${activity.id}"><img src="${propFile(activity.asset)}" alt=""><span>${activity.label}</span><small>${activity.note}</small><i aria-hidden="true"></i></button>`).join("")}</nav>
        <audio id="simaGamePurrV8" src="./audio/sima-purr-v5.mp3" preload="auto"></audio>
      </main>
    </div>`;

    const nook = qs("#simaNookV8", root);
    const cat = qs("#simaGameCatV8", root);
    const catImage = qs("img", cat);
    const speech = qs("#simaSpeechV8", root);
    const activityPanel = qs("#simaActivityV8", root);
    const actionProp = qs("#simaActionPropV8", root);
    const actionPropImage = qs("img", actionProp);
    const playTarget = qs("#simaPlayTargetV8", root);
    const fireflyLayer = qs("#simaFirefliesV8", root);
    const collection = qs("#simaCollectionV8", root);
    const collectionGrid = qs("#simaCollectionGridV8", root);
    const complete = qs("#simaCompleteV8", root);
    const purr = qs("#simaGamePurrV8", root);
    const timers = new Set();
    let activeActivity = "";
    let busy = false;
    let activityCleanup = () => {};

    function later(callback, delay) {
      const timer = window.setTimeout(() => { timers.delete(timer); callback(); }, delay);
      timers.add(timer);
      return timer;
    }
    function saveState() { try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {} }
    function cap(value) { return Math.max(0, Math.min(100, Math.round(value))); }
    function renderState() {
      ["fullness", "joy", "care", "rest"].forEach((key) => {
        state[key] = cap(state[key]);
        const label = key[0].toUpperCase() + key.slice(1);
        qs(`#simaNeed${label}`, root).style.width = `${state[key]}%`;
        qs(`#simaNeed${label}Value`, root).textContent = state[key];
      });
      qs("#simaCollectionCount", root).textContent = `${state.completed.length} / ${activities.length}`;
      qsa("[data-sima-action]", root).forEach((button) => button.classList.toggle("completed", state.completed.includes(button.dataset.simaAction)));
      renderCollection();
    }
    function renderCollection() {
      collectionGrid.innerHTML = activities.map((item) => {
        const unlocked = state.completed.includes(item.id);
        return `<article class="${unlocked ? "unlocked" : "locked"}"><div><img src="${propFile(item.asset)}" alt=""></div><b>${unlocked ? escapeHtml(item.label) : "ещё не найдено"}</b><span>${unlocked ? "воспоминание сохранено" : "· · ·"}</span></article>`;
      }).join("");
    }
    function setSpeech(message) { speech.textContent = message; speech.classList.remove("speaking"); void speech.offsetWidth; speech.classList.add("speaking"); }
    function setPose(pose, activity = "") {
      cat.dataset.pose = pose;
      cat.dataset.activity = activity;
      catImage.src = poseFiles[pose] || poseFiles.idle;
      catImage.alt = pose === "sleep" ? "Сима свернулась клубочком и спит" : pose === "eat" ? "Сима кушает" : pose === "play" ? "Сима играет" : pose === "box" ? "Сима выглядывает из коробки" : "Сима в своём уголке";
    }
    function showActionProp(asset, kind) {
      actionProp.hidden = false;
      actionProp.className = `sima-action-prop-v8 prop-${kind}`;
      actionPropImage.src = propFile(asset);
      actionPropImage.alt = "";
    }
    function sparkle(x = 50, y = 48) {
      const star = document.createElement("i");
      star.className = "sima-care-spark-v8";
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.textContent = Math.random() > .5 ? "✦" : "♡";
      nook.append(star);
      later(() => star.remove(), 1200);
    }
    function clearActivity(resetPose = true) {
      activityCleanup();
      activityCleanup = () => {};
      activeActivity = "";
      busy = false;
      activityPanel.hidden = true;
      activityPanel.innerHTML = "";
      playTarget.hidden = true;
      playTarget.onclick = null;
      fireflyLayer.innerHTML = "";
      actionProp.hidden = true;
      actionProp.removeAttribute("style");
      nook.classList.remove("sima-eating-v8", "sima-playing-v8", "sima-brushing-v8", "sima-boxing-v8", "sima-windowing-v8", "sima-sleeping-v8");
      cat.classList.remove("brushable");
      if (resetPose) setPose("idle");
    }
    function celebrateCare() {
      cat.classList.remove("cared-for");
      void cat.offsetWidth;
      cat.classList.add("cared-for");
      for (let index = 0; index < 7; index += 1) later(() => sparkle(42 + Math.random() * 18, 35 + Math.random() * 30), index * 95);
    }
    function award(id, changes, message) {
      Object.entries(changes).forEach(([key, gain]) => { state[key] = cap((state[key] || 0) + gain); });
      if (!state.completed.includes(id)) state.completed.push(id);
      saveState();
      renderState();
      setSpeech(message);
      celebrateCare();
      if (state.completed.length === activities.length && !state.celebrated) {
        state.celebrated = true;
        saveState();
        later(() => { complete.hidden = false; nook.classList.add("sima-day-complete-v8"); }, 900);
      }
    }
    function openPanel(title, text, body) {
      activityPanel.innerHTML = `<button type="button" class="sima-activity-close-v8" aria-label="Закрыть">×</button><p>${escapeHtml(title)}</p><h3>${escapeHtml(text)}</h3><div>${body}</div>`;
      activityPanel.hidden = false;
      qs(".sima-activity-close-v8", activityPanel).addEventListener("click", clearActivity);
    }
    function feedActivity() {
      openPanel("ужин", "Что положим в миску?", `<button type="button" data-sima-food="паштет"><img src="${propFile("bowl-full")}" alt="">куриный паштет</button><button type="button" data-sima-food="рыбку"><img src="${propFile("bowl-full")}" alt="">рыбка</button><button type="button" data-sima-food="лакомства"><img src="${propFile("treats")}" alt="">немного лакомств</button>`);
      qsa("[data-sima-food]", activityPanel).forEach((button) => button.addEventListener("click", () => {
        busy = true;
        activityPanel.hidden = true;
        setPose("eat", "feed");
        showActionProp("bowl-full", "bowl");
        qs("#simaSceneBowlImage", root).src = propFile("bowl-full");
        nook.classList.add("sima-eating-v8");
        setSpeech(`Сима одобрила ${button.dataset.simaFood}.`);
        later(() => { award("feed", { fullness: 28, care: 4 }, "Миска пуста. Ужин официально одобрен."); qs("#simaSceneBowlImage", root).src = propFile("bowl-empty"); clearActivity(); }, 3300);
      }));
    }
    function playActivity() {
      openPanel("игра", "Какую игрушку выберет Сима?", `<button type="button" data-sima-toy="feather"><img src="${propFile("feather")}" alt="">удочка с перьями</button><button type="button" data-sima-toy="yarn"><img src="${propFile("yarn")}" alt="">клубок</button><button type="button" data-sima-toy="mouse"><img src="${propFile("mouse")}" alt="">мышка</button>`);
      qsa("[data-sima-toy]", activityPanel).forEach((button) => button.addEventListener("click", () => {
        const toy = button.dataset.simaToy;
        let catches = 0;
        busy = true;
        activityPanel.hidden = true;
        setPose("play", "play");
        nook.classList.add("sima-playing-v8");
        const image = qs("img", playTarget);
        image.src = propFile(toy);
        playTarget.hidden = false;
        const moveToy = () => { playTarget.style.left = `${24 + Math.random() * 57}%`; playTarget.style.top = `${18 + Math.random() * 48}%`; };
        moveToy();
        setSpeech("Поймай игрушку пять раз — Сима уже приготовилась к прыжку.");
        playTarget.onclick = () => {
          catches += 1;
          sparkle(Number.parseFloat(playTarget.style.left), Number.parseFloat(playTarget.style.top));
          if (catches >= 5) { playTarget.hidden = true; award("play", { joy: 27, rest: -3 }, "Пять точных прыжков. Сима победила игрушку."); later(clearActivity, 1500); }
          else { setSpeech(`${catches} из 5. Сима следит за каждым движением.`); moveToy(); }
        };
      }));
    }
    function brushActivity() {
      openPanel("уход", "Расчеши пушистую шерсть", '<span class="sima-activity-instruction-v8">Проведи пальцем или мышью по Симе шесть раз.</span><button type="button" data-start-brushing>взять щётку</button>');
      qs("[data-start-brushing]", activityPanel).addEventListener("click", () => {
        let brushing = false;
        let strokes = 0;
        let lastX = 0;
        let lastY = 0;
        busy = true;
        activityPanel.hidden = true;
        setPose("groom", "brush");
        showActionProp("brush", "brush");
        nook.classList.add("sima-brushing-v8");
        cat.classList.add("brushable");
        setSpeech("Медленно проведи щёткой по шерсти Симы.");
        const moveBrush = (event) => {
          const box = nook.getBoundingClientRect();
          const x = ((event.clientX - box.left) / box.width) * 100;
          const y = ((event.clientY - box.top) / box.height) * 100;
          actionProp.style.left = `${x}%`;
          actionProp.style.top = `${y}%`;
          if (!brushing) return;
          const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
          if (distance < 42) return;
          lastX = event.clientX;
          lastY = event.clientY;
          strokes += 1;
          sparkle(x, y);
          setSpeech(`${Math.min(strokes, 6)} из 6 движений. Шерсть становится ещё пушистее.`);
          if (strokes >= 6) { brushing = false; award("brush", { care: 30, joy: 6 }, "Готово. Сима стала почти неприлично пушистой."); later(clearActivity, 1700); }
        };
        const pointerDown = (event) => { brushing = true; lastX = event.clientX; lastY = event.clientY; cat.setPointerCapture?.(event.pointerId); moveBrush(event); };
        const pointerUp = () => { brushing = false; };
        cat.addEventListener("pointerdown", pointerDown);
        cat.addEventListener("pointermove", moveBrush);
        cat.addEventListener("pointerup", pointerUp);
        cat.addEventListener("pointercancel", pointerUp);
        activityCleanup = () => { cat.removeEventListener("pointerdown", pointerDown); cat.removeEventListener("pointermove", moveBrush); cat.removeEventListener("pointerup", pointerUp); cat.removeEventListener("pointercancel", pointerUp); };
      });
    }
    function boxActivity() {
      openPanel("экспедиция", "Какая коробка достойна Симы?", `<button type="button" data-sima-box="маленькую">маленькая, но гордая</button><button type="button" data-sima-box="уютную"><img src="${propFile("box")}" alt="">с пледом</button><button type="button" data-sima-box="огромную">неприлично большая</button>`);
      qsa("[data-sima-box]", activityPanel).forEach((button) => button.addEventListener("click", () => {
        busy = true;
        activityPanel.hidden = true;
        setPose("box", "box");
        showActionProp("box", "box");
        nook.classList.add("sima-boxing-v8");
        const reactions = ["Коробка прошла проверку лапой.", "Сима заняла коробку. Теперь это недвижимость.", "Размер коробки признан безупречным."];
        later(() => { award("box", { joy: 18, rest: 7 }, reactions[Math.floor(Math.random() * reactions.length)]); later(clearActivity, 1600); }, 1700);
      }));
    }
    function windowActivity() {
      openPanel("окно", "Посчитаем ночные огоньки?", '<span class="sima-activity-instruction-v8">Найди и коснись пяти светлячков у окна.</span><button type="button" data-start-fireflies>подойти к окну</button>');
      qs("[data-start-fireflies]", activityPanel).addEventListener("click", () => {
        const positions = [[43,16],[48,24],[54,18],[58,31],[46,37],[53,42],[61,23]];
        let caught = 0;
        busy = true;
        activityPanel.hidden = true;
        setPose("idle", "window");
        nook.classList.add("sima-windowing-v8");
        setSpeech("Огоньки спрятались у окна. Нужно найти пять.");
        positions.forEach(([x, y], index) => {
          const light = document.createElement("button");
          light.type = "button";
          light.className = "sima-firefly-v8";
          light.style.left = `${x}%`;
          light.style.top = `${y}%`;
          light.style.setProperty("--firefly-delay", `${index * .17}s`);
          light.setAttribute("aria-label", "Поймать светлячка");
          light.addEventListener("click", () => {
            if (light.classList.contains("caught")) return;
            light.classList.add("caught");
            caught += 1;
            setSpeech(`${caught} из 5 огоньков. Сима наблюдает очень внимательно.`);
            if (caught >= 5) { award("window", { joy: 15, rest: 10 }, "Пять огоньков собраны. За окном снова тихая ночь."); later(clearActivity, 1700); }
          });
          fireflyLayer.append(light);
        });
      });
    }
    function sleepActivity() {
      openPanel("тихий час", "Устроим Симе сон?", '<span class="sima-activity-instruction-v8">Приглушим лампу и положим Симу на мягкую лежанку.</span><button type="button" data-start-sleep>уложить спать</button>');
      qs("[data-start-sleep]", activityPanel).addEventListener("click", () => {
        busy = true;
        setPose("sleep", "sleep");
        showActionProp("bed", "bed");
        nook.classList.add("sima-sleeping-v8");
        setSpeech("Тс-с. Сима свернулась клубочком.");
        activityPanel.innerHTML = '<p>тихий час</p><h3>Сима уснула</h3><div><span class="sima-activity-instruction-v8">Можно немного посидеть рядом, а потом тихо разбудить.</span><button type="button" data-wake-sima>разбудить Симу</button></div>';
        later(() => award("sleep", { rest: 32, care: 5 }, "Сима прекрасно выспалась и снова готова командовать."), 1800);
        qs("[data-wake-sima]", activityPanel).addEventListener("click", () => { clearActivity(); setSpeech("Сима проснулась, потянулась и осмотрела владения."); });
      });
    }
    function openActivity(id) {
      if (busy) { setSpeech("Сначала закончим начатое занятие."); return; }
      clearActivity();
      activeActivity = id;
      if (id === "feed") feedActivity();
      else if (id === "play") playActivity();
      else if (id === "brush") brushActivity();
      else if (id === "box") boxActivity();
      else if (id === "window") windowActivity();
      else if (id === "sleep") sleepActivity();
    }

    qsa("[data-sima-action]", root).forEach((button) => button.addEventListener("click", () => openActivity(button.dataset.simaAction)));
    qs("#simaCollectionButton", root).addEventListener("click", () => { renderCollection(); collection.hidden = false; });
    qs("[data-close-sima-collection]", root).addEventListener("click", () => { collection.hidden = true; });
    collection.addEventListener("click", (event) => { if (event.target === collection) collection.hidden = true; });
    cat.addEventListener("click", () => {
      if (activeActivity || busy) return;
      purr.pause(); purr.currentTime = 0; purr.volume = .62; purr.play().catch(() => {});
      state.joy = cap(state.joy + 2); saveState(); renderState(); celebrateCare();
      const lines = ["Сима разрешила себя погладить.", "Мр-р. Это было принято благосклонно.", "Сима сделала вид, что не ждала поглаживания."];
      setSpeech(lines[Math.floor(Math.random() * lines.length)]);
    });
    qs("#simaWelcomeV8 button", root)?.addEventListener("click", () => { state.visited = true; saveState(); qs("#simaWelcomeV8", root).hidden = true; setSpeech("Сима ждёт. Выбери любой предмет в комнате."); });
    qs("#simaCompleteV8 button", root).addEventListener("click", () => { complete.hidden = true; nook.classList.remove("sima-day-complete-v8"); clearActivity(); setSpeech("Идеальный день можно продолжать сколько угодно."); });
    qs(".sima-game-close-v8", root).addEventListener("click", closeGame);
    renderState();
    return () => { activityCleanup(); timers.forEach((timer) => window.clearTimeout(timer)); timers.clear(); purr.pause(); };
  }

  function pluralizeCalls(value) { const lastTwo = value % 100; const last = value % 10; if (lastTwo >= 11 && lastTwo <= 14) return "вызовов"; if (last === 1) return "вызова"; return "вызовов"; }
  function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
  if (document.readyState === "complete") waitForApp(); else window.addEventListener("load", () => waitForApp());
})();
