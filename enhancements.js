(() => {
  "use strict";

  const outfits = {
    base: {
      label: "база",
      src: "./room/anya-base-v2.webp",
      alt: "Аня в чёрной водолазке, чёрных брюках и бордовом кардигане",
    },
    novinki: {
      label: "в новинки",
      src: "./room/anya-novinki-v2.webp",
      alt: "Аня в полностью белом образе со смирительной рубашкой",
    },
    botanical: {
      label: "в ботанический сад",
      src: "./room/anya-botanical-v2.webp",
      alt: "Аня в чёрной майке, белой шёлковой юбке и чёрных таби с бабл-ти",
    },
    ambulance: {
      label: "на смену",
      src: "./room/anya-ambulance-v2.webp",
      alt: "Аня в бордовой форме скорой помощи",
    },
  };

  const films = {
    spider: {
      label: "Человек-паук",
      src: "./room/spider-poster.jpg",
      alt: "Постер Человека-паука",
    },
    dragon: {
      label: "Как приручить дракона",
      src: "./room/dragon-poster.jpg",
      alt: "Постер Как приручить дракона",
    },
  };

  const laptopGames = {
    minecraft: {
      label: "Minecraft",
      src: "./room/laptop/minecraft-opt.jpg",
    },
    roblox: {
      label: "Roblox",
      src: "./room/laptop/roblox-opt.jpg",
    },
    terraria: {
      label: "Terraria",
      src: "./room/laptop/terraria-opt.jpg",
    },
    genshin: {
      label: "Genshin Impact",
      src: "./room/laptop/genshin-opt.jpg",
    },
  };

  const tracks = [
    { title: "Key", src: "./audio/01-key.mp3" },
    { title: "Wet Hands", src: "./audio/02-wet-hands.mp3" },
    { title: "Судно — Птахи", src: "./audio/03-sudno-ptakhi.mp3" },
    {
      title: "I Want Things To Be Beautiful",
      src: "./audio/04-beautiful.mp3",
    },
  ];

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  function waitForApp(tries = 0) {
    const room = qs(".roomSection");
    const games = qs(".gameHubSection");
    const archive = qs(".gallerySection");
    if (!room || !games || !archive) {
      if (tries < 120) window.setTimeout(() => waitForApp(tries + 1), 50);
      return;
    }

    enhanceRoom(room);
    enhanceGames(games);
    lockArchive(archive);
    cleanThenAndNow();
  }

  function enhanceRoom(section) {
    section.innerHTML = `
      <div class="roomHeading contentWidth room-heading-v2">
        <div>
          <p class="sectionKicker">интерактивная комната</p>
          <h2>Комната Ани</h2>
        </div>
        <p>Выбирай образы, фильмы, игры и музыку. Книги можно добавлять прямо на полку, а Сима теперь гуляет по комнате.</p>
      </div>

      <div class="wardrobeBar contentWidth wardrobe-v2" aria-label="Переодеть Аню">
        <span>гардероб Ани</span>
        <div class="wardrobe-buttons">
          ${Object.entries(outfits)
            .map(
              ([key, outfit], index) =>
                `<button type="button" data-outfit="${key}" class="${index === 0 ? "active" : ""}">${outfit.label}</button>`,
            )
            .join("")}
        </div>
        <b id="wardrobeState">выбран: база</b>
      </div>

      <div class="roomViewport room-viewport-v2 contentWidth">
        <div class="roomStage room-stage-v2">
          <img class="roomBackdrop room-backdrop-v2" src="./room/room-front.webp" alt="Комната Ани, показанная прямо спереди">

          <div class="roomHud room-hud-v2" aria-live="polite">
            <span class="roomDot"></span>
            <p id="roomStatus">Осмотрись: здесь почти всё можно нажать.</p>
          </div>

          <img id="anyaCharacter" class="anya-v2" src="${outfits.base.src}" alt="${outfits.base.alt}">
          <img id="sleepingAnya" class="sleeping-anya" src="./room/anya-sleep-v2.webp" alt="Аня спит под одеялом" hidden>

          <button type="button" class="bookcase-hotspot" aria-label="Открыть книжный шкаф"></button>
          <div id="addedBookSpines" class="added-book-spines" aria-hidden="true"></div>

          <div class="tv-screen-v2" aria-label="Экран телевизора">
            <img id="tvImage" alt="" hidden>
            <div id="tvNoiseV2" class="tv-noise-v2"><span>тихий эфир</span></div>
          </div>

          <button type="button" class="ship-poster-v2" aria-label="Плакат Лололошка и JDH">
            <img src="./room/lololoshka-jdh-poster.jpg" alt="Лололошка и JDH">
          </button>

          <div class="laptop-prop" aria-label="Ноутбук с играми">
            <div class="laptop-screen">
              <img id="laptopImage" src="${laptopGames.minecraft.src}" alt="Заставка Minecraft">
              <span id="laptopLabel">Minecraft</span>
            </div>
            <div class="laptop-base"><i></i></div>
          </div>

          <button type="button" class="radio-prop" id="radioProp" aria-label="Включить или остановить радио">
            <span class="radio-speaker"></span>
            <span class="radio-display" id="radioMiniTitle">Key</span>
            <span class="radio-dial"></span>
          </button>

          <button type="button" id="simaSpriteV2" class="sima-v2 walking" aria-label="Погладить Симу">
            <img src="./room/sima-walk-v2.webp" alt="Сима гуляет по комнате">
            <span class="sima-hearts" aria-hidden="true">♡ ♡</span>
          </button>
        </div>
      </div>

      <div class="room-control-deck contentWidth">
        <section class="room-control-card tv-card">
          <p>ламповый ТВ</p>
          <div>
            <button type="button" data-film="spider">Человек-паук</button>
            <button type="button" data-film="dragon">Как приручить дракона</button>
            <button type="button" data-film="off">выкл.</button>
          </div>
        </section>

        <section class="room-control-card laptop-card">
          <p>ноутбук</p>
          <div>
            ${Object.entries(laptopGames)
              .map(
                ([key, game], index) =>
                  `<button type="button" data-laptop-game="${key}" class="${index === 0 ? "active" : ""}">${game.label}</button>`,
              )
              .join("")}
          </div>
        </section>

        <section class="room-control-card radio-card">
          <p>радио</p>
          <strong id="radioTitle">Key</strong>
          <div>
            <button type="button" id="radioPrev" aria-label="Предыдущая песня">←</button>
            <button type="button" id="radioPlay">включить</button>
            <button type="button" id="radioNext" aria-label="Следующая песня">→</button>
          </div>
          <audio id="roomAudio" preload="metadata"></audio>
        </section>

        <section class="room-control-card actions-card">
          <p>что сделать</p>
          <div>
            <button type="button" id="petSima">погладить Симу</button>
            <button type="button" id="sleepAnya">отправить Аню спать</button>
            <button type="button" id="openBooks">добавить книгу</button>
          </div>
        </section>
      </div>

      <div id="booksModal" class="room-modal" role="dialog" aria-modal="true" aria-labelledby="booksTitle" hidden>
        <div class="room-modal-card">
          <button type="button" class="room-modal-close" aria-label="Закрыть">×</button>
          <p class="sectionKicker">книжный шкаф</p>
          <h3 id="booksTitle">Добавить книгу на полку</h3>
          <form id="bookForm">
            <label for="bookTitle">Название книги</label>
            <div>
              <input id="bookTitle" maxlength="60" autocomplete="off" placeholder="Например, новая любимая книга">
              <button type="submit">добавить</button>
            </div>
          </form>
          <ul id="bookList"></ul>
          <small>Книги сохраняются на этом устройстве.</small>
        </div>
      </div>
    `;

    const status = qs("#roomStatus", section);
    const anya = qs("#anyaCharacter", section);
    const sleeping = qs("#sleepingAnya", section);
    const sleepButton = qs("#sleepAnya", section);
    const simaButton = qs("#simaSpriteV2", section);
    const simaImage = qs("img", simaButton);
    let asleep = false;
    let simaPetTimeout;

    qsa("[data-outfit]", section).forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.outfit;
        const outfit = outfits[key];
        qsa("[data-outfit]", section).forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        anya.classList.add("changing");
        window.setTimeout(() => {
          anya.src = outfit.src;
          anya.alt = outfit.alt;
          anya.classList.remove("changing");
        }, 150);
        qs("#wardrobeState", section).textContent = `выбран: ${outfit.label}`;
        if (asleep) setSleep(false);
        status.textContent = `Образ «${outfit.label}» выбран.`;
      });
    });

    qsa("[data-film]", section).forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.film;
        const image = qs("#tvImage", section);
        const noise = qs("#tvNoiseV2", section);
        qsa("[data-film]", section).forEach((item) => item.classList.remove("active"));
        if (key === "off") {
          image.hidden = true;
          image.removeAttribute("src");
          noise.hidden = false;
          status.textContent = "Телевизор снова тихо шуршит.";
          return;
        }
        const film = films[key];
        button.classList.add("active");
        image.src = film.src;
        image.alt = film.alt;
        image.hidden = false;
        noise.hidden = true;
        status.textContent = `На экране — ${film.label}.`;
      });
    });

    qsa("[data-laptop-game]", section).forEach((button) => {
      button.addEventListener("click", () => {
        const game = laptopGames[button.dataset.laptopGame];
        qsa("[data-laptop-game]", section).forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const image = qs("#laptopImage", section);
        image.classList.add("switching");
        window.setTimeout(() => {
          image.src = game.src;
          image.alt = `Заставка ${game.label}`;
          qs("#laptopLabel", section).textContent = game.label;
          image.classList.remove("switching");
        }, 130);
        status.textContent = `На ноутбуке выбрана игра ${game.label}.`;
      });
    });

    function setSleep(value) {
      asleep = value;
      anya.hidden = value;
      sleeping.hidden = !value;
      sleepButton.textContent = value ? "разбудить Аню" : "отправить Аню спать";
      status.textContent = value ? "Аня уже спит под одеялом. Тише." : "Аня проснулась и вернулась в комнату.";
    }

    sleepButton.addEventListener("click", () => setSleep(!asleep));

    function petSima() {
      window.clearTimeout(simaPetTimeout);
      simaButton.classList.remove("walking");
      simaButton.classList.add("petted");
      simaImage.src = "./room/sima-pet-v2.webp";
      simaImage.alt = "Довольная Сима после поглаживания";
      status.textContent = "Сима поглажена. Разрешение получено.";
      simaPetTimeout = window.setTimeout(() => {
        simaButton.classList.remove("petted");
        simaButton.classList.add("walking");
        simaImage.src = "./room/sima-walk-v2.webp";
        simaImage.alt = "Сима гуляет по комнате";
      }, 4200);
    }

    simaButton.addEventListener("click", petSima);
    qs("#petSima", section).addEventListener("click", petSima);

    setupRadio(section, status);
    setupBooks(section, status);
  }

  function setupRadio(section, status) {
    const audio = qs("#roomAudio", section);
    const title = qs("#radioTitle", section);
    const miniTitle = qs("#radioMiniTitle", section);
    const play = qs("#radioPlay", section);
    let trackIndex = 0;

    function loadTrack(index, shouldPlay = false, announce = true) {
      trackIndex = (index + tracks.length) % tracks.length;
      const track = tracks[trackIndex];
      audio.src = track.src;
      title.textContent = track.title;
      miniTitle.textContent = track.title;
      if (announce) status.textContent = `На радио выбрано: ${track.title}.`;
      if (shouldPlay) {
        audio.play().then(() => {
          play.textContent = "пауза";
          qs("#radioProp", section).classList.add("playing");
        }).catch(() => {});
      }
    }

    function toggle() {
      if (!audio.src) loadTrack(trackIndex);
      if (audio.paused) {
        audio.play().then(() => {
          play.textContent = "пауза";
          qs("#radioProp", section).classList.add("playing");
          status.textContent = `Играет: ${tracks[trackIndex].title}.`;
        }).catch(() => {});
      } else {
        audio.pause();
        play.textContent = "включить";
        qs("#radioProp", section).classList.remove("playing");
        status.textContent = "Радио поставлено на паузу.";
      }
    }

    qs("#radioPrev", section).addEventListener("click", () => loadTrack(trackIndex - 1, !audio.paused));
    qs("#radioNext", section).addEventListener("click", () => loadTrack(trackIndex + 1, !audio.paused));
    play.addEventListener("click", toggle);
    qs("#radioProp", section).addEventListener("click", toggle);
    audio.addEventListener("ended", () => loadTrack(trackIndex + 1, true));
    loadTrack(0, false, false);
  }

  function setupBooks(section, status) {
    const modal = qs("#booksModal", section);
    const form = qs("#bookForm", section);
    const input = qs("#bookTitle", section);
    const list = qs("#bookList", section);
    const spines = qs("#addedBookSpines", section);
    const storageKey = "anya-room-books-v2";
    let books = [];

    try {
      books = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(books)) books = [];
    } catch {
      books = [];
    }

    function save() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(books));
      } catch {}
    }

    function render() {
      list.innerHTML = books.length
        ? books
            .map(
              (book, index) =>
                `<li><span>${escapeHtml(book)}</span><button type="button" data-remove-book="${index}" aria-label="Убрать книгу ${escapeHtml(book)}">×</button></li>`,
            )
            .join("")
        : "<li class=\"empty-books\">Здесь появятся добавленные книги.</li>";

      spines.innerHTML = books
        .slice(-8)
        .map(
          (book, index) =>
            `<span style="--book:${index}" title="${escapeHtml(book)}">${escapeHtml(book)}</span>`,
        )
        .join("");

      qsa("[data-remove-book]", list).forEach((button) => {
        button.addEventListener("click", () => {
          books.splice(Number(button.dataset.removeBook), 1);
          save();
          render();
        });
      });
    }

    function open() {
      modal.hidden = false;
      document.body.classList.add("room-modal-open");
      window.setTimeout(() => input.focus(), 30);
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove("room-modal-open");
    }

    qs("#openBooks", section).addEventListener("click", open);
    qs(".bookcase-hotspot", section).addEventListener("click", open);
    qs(".room-modal-close", modal).addEventListener("click", close);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) close();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      books.push(value);
      books = books.slice(-20);
      input.value = "";
      save();
      render();
      status.textContent = `Книга «${value}» добавлена на полку.`;
    });

    render();
  }

  function lockArchive(section) {
    const grid = qs(".photoGrid", section);
    if (!grid) return;
    grid.hidden = true;
    section.classList.add("archive-locked");

    const gate = document.createElement("div");
    gate.className = "archive-gate contentWidth";
    gate.innerHTML = `
      <div class="archive-gate-card">
        <span class="archive-lock-icon" aria-hidden="true">⌁</span>
        <p class="sectionKicker">доступ к фотоплёнке</p>
        <h3>Сначала пароль</h3>
        <p>Подсказка: напиши фрукт, который поют альты в хоре.</p>
        <form>
          <label for="archivePassword">Пароль</label>
          <div>
            <input id="archivePassword" type="password" autocomplete="off" placeholder="Введите ответ">
            <button type="submit">открыть архив</button>
          </div>
        </form>
        <small id="archiveMessage" aria-live="polite"></small>
      </div>
    `;
    grid.before(gate);

    const form = qs("form", gate);
    const input = qs("input", gate);
    const message = qs("#archiveMessage", gate);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (input.value.trim().toLocaleLowerCase("ru") === "манго") {
        gate.classList.add("unlocked");
        grid.hidden = false;
        section.classList.remove("archive-locked");
        message.textContent = "Верно. Архив открыт.";
        window.setTimeout(() => {
          gate.hidden = true;
          grid.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 500);
      } else {
        gate.classList.remove("wrong");
        void gate.offsetWidth;
        gate.classList.add("wrong");
        message.textContent = "Не тот фрукт. Попробуй ещё раз.";
        input.select();
      }
    });
  }

  function cleanThenAndNow() {
    const section = qs(".thenNowSection");
    if (!section) return;
    qs(".thenNowCopy .sectionKicker", section)?.remove();
    qsa(".thenNowMedia figcaption", section).forEach((caption) => caption.remove());
  }

  function enhanceGames(section) {
    section.innerHTML = `
      <div class="gameHubHeading contentWidth">
        <div>
          <p class="sectionKicker">игровая зона</p>
          <h2>Игры</h2>
        </div>
        <p>Теперь обе игры идут дольше: минута Zero hunt и полноценная длинная ночная смена.</p>
      </div>
      <div class="gameLaunchers contentWidth">
        <button type="button" class="gameLauncher cokeLauncher" data-open-game="coke">
          <span>01</span>
          <img src="./games/cocacola-bottle.webp" alt="">
          <div><b>Zero hunt</b><p>Продержись минуту и собери запас</p></div>
          <i>играть →</i>
        </button>
        <button type="button" class="gameLauncher ambulanceLauncher" data-open-game="ambulance">
          <span>02</span>
          <img src="./games/ambulance-anya.webp" alt="">
          <div><b>Ночная смена</b><p>Долгая дорога, вызовы и три полосы</p></div>
          <i>играть →</i>
        </button>
      </div>
      <div id="enhancedGameOverlay" class="gameOverlay enhanced-game-overlay" role="dialog" aria-modal="true" hidden></div>
    `;

    const overlay = qs("#enhancedGameOverlay", section);
    let cleanup = () => {};

    function close() {
      cleanup();
      cleanup = () => {};
      overlay.hidden = true;
      overlay.innerHTML = "";
      document.body.style.overflow = "";
    }

    qsa("[data-open-game]", section).forEach((button) => {
      button.addEventListener("click", () => {
        overlay.hidden = false;
        document.body.style.overflow = "hidden";
        cleanup = button.dataset.openGame === "coke" ? startCokeGame(overlay, close) : startAmbulanceGame(overlay, close);
      });
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) close();
    });
  }

  function startCokeGame(root, closeGame) {
    root.innerHTML = `
      <div class="gamePage cokeGamePage coke-v2">
        <button type="button" class="gameClose">← к играм</button>
        <div class="gameTopbar">
          <span>Zero hunt</span>
          <b id="cokeScore">0 бутылок · ♥♥♥♥</b>
          <b id="cokeTimer">01:00</b>
        </div>
        <div class="bottleArena coke-arena-v2">
          <div class="bottleGlow bottleGlowOne"></div>
          <div class="bottleGlow bottleGlowTwo"></div>
          <div id="cokeDrops" class="zeroDrops"></div>
          <div id="cokeCooler" class="zeroCooler"><span>COCA-COLA</span><b>ZERO</b></div>
          <div id="cokeStart" class="gameStartPanel">
            <img src="./games/cocacola-bottle.webp" alt="Классическая бутылка Coca-Cola">
            <h3>Минута Zero</h3>
            <p>Лови бутылки целую минуту. Лёд добавляет немного времени, а Mentos отнимает жизнь. Скорость постепенно растёт.</p>
            <small>Двигай сумку пальцем, мышью или стрелками.</small>
            <button type="button">начать игру</button>
          </div>
          <div id="cokeResult" class="gameResult" hidden></div>
          <div class="zeroControls">
            <button type="button" data-coke-move="left">←</button>
            <p id="cokeMessage">Готовь холодильную сумку.</p>
            <button type="button" data-coke-move="right">→</button>
          </div>
        </div>
      </div>
    `;

    const arena = qs(".coke-arena-v2", root);
    const drops = qs("#cokeDrops", root);
    const cooler = qs("#cokeCooler", root);
    const timer = qs("#cokeTimer", root);
    const scoreLine = qs("#cokeScore", root);
    const message = qs("#cokeMessage", root);
    const startPanel = qs("#cokeStart", root);
    const result = qs("#cokeResult", root);
    let running = false;
    let raf = 0;
    let items = [];
    let score = 0;
    let lives = 4;
    let coolerX = 50;
    let timeLeft = 60;
    let startAt = 0;
    let bonusTime = 0;
    let lastAt = 0;
    let lastSpawn = 0;

    function formatTime(seconds) {
      const value = Math.max(0, Math.ceil(seconds));
      return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
    }

    function updateHud() {
      timer.textContent = formatTime(timeLeft);
      scoreLine.textContent = `${score} бутылок · ${"♥".repeat(lives)}${"♡".repeat(4 - lives)}`;
    }

    function setCooler(value) {
      coolerX = Math.max(9, Math.min(91, value));
      cooler.style.left = `${coolerX}%`;
    }

    function spawn(elapsed) {
      const random = Math.random();
      const type = random < 0.58 ? "bottle" : random < 0.72 ? "ice" : "mentos";
      const element = document.createElement("div");
      element.className = `zeroDrop ${type}`;
      element.innerHTML = type === "bottle" ? '<img src="./games/cocacola-bottle.webp" alt="">' : type === "ice" ? "<span>◆</span>" : "<b>MENTOS</b>";
      drops.append(element);
      items.push({
        type,
        x: 7 + Math.random() * 86,
        y: -10,
        speed: 19 + Math.random() * 12 + elapsed * 0.12,
        spin: -35 + Math.random() * 70,
        element,
      });
    }

    function finish() {
      running = false;
      window.cancelAnimationFrame(raf);
      items.forEach((item) => item.element.remove());
      items = [];
      result.hidden = false;
      result.innerHTML = `<strong>${lives <= 0 ? "Mentos победил" : "Минута пройдена"}</strong><p>Собрано бутылок: ${score}. ${score >= 18 ? "Запас официально внушительный." : "Можно попробовать собрать ещё больше."}</p><button type="button">сыграть ещё раз</button>`;
      qs("button", result).addEventListener("click", begin);
    }

    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.04, (now - lastAt) / 1000 || 0);
      lastAt = now;
      const elapsed = (now - startAt) / 1000;
      timeLeft = 60 + bonusTime - elapsed;
      const spawnDelay = Math.max(330, 570 - elapsed * 3.2);
      if (now - lastSpawn > spawnDelay) {
        lastSpawn = now;
        spawn(elapsed);
      }

      const next = [];
      items.forEach((item) => {
        item.y += item.speed * dt;
        item.element.style.left = `${item.x}%`;
        item.element.style.top = `${item.y}%`;
        item.element.style.transform = `translate(-50%, -50%) rotate(${item.spin + item.y * 0.7}deg)`;
        const caught = item.y >= 77 && item.y <= 92 && Math.abs(item.x - coolerX) < 11.5;
        if (caught) {
          if (item.type === "bottle") {
            score += 1;
            message.textContent = "Zero в запасе!";
          } else if (item.type === "ice") {
            bonusTime = Math.min(12, bonusTime + 3);
            message.textContent = "+3 секунды прохлады.";
          } else {
            lives -= 1;
            message.textContent = "Mentos! Минус жизнь.";
            arena.classList.remove("coke-hit");
            void arena.offsetWidth;
            arena.classList.add("coke-hit");
          }
          item.element.remove();
        } else if (item.y > 110) {
          item.element.remove();
        } else {
          next.push(item);
        }
      });
      items = next;
      updateHud();
      if (timeLeft <= 0 || lives <= 0) finish();
      else raf = window.requestAnimationFrame(frame);
    }

    function begin() {
      items.forEach((item) => item.element.remove());
      items = [];
      score = 0;
      lives = 4;
      bonusTime = 0;
      timeLeft = 60;
      startAt = performance.now();
      lastAt = startAt;
      lastSpawn = startAt - 300;
      startPanel.hidden = true;
      result.hidden = true;
      message.textContent = "Лови Zero и избегай Mentos.";
      running = true;
      updateHud();
      raf = window.requestAnimationFrame(frame);
    }

    function moveBy(delta) {
      setCooler(coolerX + delta);
    }

    function keyHandler(event) {
      if (event.key === "ArrowLeft") moveBy(-8);
      if (event.key === "ArrowRight") moveBy(8);
    }

    arena.addEventListener("pointerdown", (event) => {
      if (!running) return;
      const box = arena.getBoundingClientRect();
      setCooler(((event.clientX - box.left) / box.width) * 100);
    });
    arena.addEventListener("pointermove", (event) => {
      if (!running || (!event.buttons && event.pointerType !== "touch")) return;
      const box = arena.getBoundingClientRect();
      setCooler(((event.clientX - box.left) / box.width) * 100);
    });
    qsa("[data-coke-move]", root).forEach((button) => button.addEventListener("click", () => moveBy(button.dataset.cokeMove === "left" ? -10 : 10)));
    window.addEventListener("keydown", keyHandler);
    qs(".gameClose", root).addEventListener("click", closeGame);
    qs("#cokeStart button", root).addEventListener("click", begin);
    updateHud();

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", keyHandler);
    };
  }

  function startAmbulanceGame(root, closeGame) {
    root.innerHTML = `
      <div class="gamePage ambulanceGamePage ambulance-v2">
        <button type="button" class="gameClose">← к играм</button>
        <div class="gameTopbar">
          <span>Ночная смена</span>
          <b id="ambulanceScore">0 вызовов · ♥♥♥♥</b>
          <b id="ambulanceTimer">01:15</b>
        </div>
        <div class="ambulanceArena ambulance-arena-v2">
          <div class="road-scroll" aria-hidden="true"></div>
          <div class="road-lanes" aria-hidden="true"><i></i><i></i></div>
          <div id="roadEvents" class="road-events"></div>
          <img id="ambulanceCar" class="ambulance-car-v2" src="./games/ambulance-anya.webp" alt="Скорая помощь с Аней за рулём">
          <div id="ambulanceStart" class="gameStartPanel ambulanceStart">
            <p>Смена длится 75 секунд. Перестраивайся между тремя полосами, принимай светящиеся вызовы и объезжай конусы. Дорога будет двигаться всё быстрее.</p>
            <button type="button">начать смену</button>
          </div>
          <div id="ambulanceResult" class="gameResult ambulanceResult" hidden></div>
          <div class="laneControls">
            <button type="button" data-lane-move="up">↑ выше</button>
            <p id="ambulanceMessage">Аня готова выезжать.</p>
            <button type="button" data-lane-move="down">↓ ниже</button>
          </div>
        </div>
      </div>
    `;

    const arena = qs(".ambulance-arena-v2", root);
    const road = qs(".road-scroll", root);
    const eventLayer = qs("#roadEvents", root);
    const car = qs("#ambulanceCar", root);
    const scoreLine = qs("#ambulanceScore", root);
    const timer = qs("#ambulanceTimer", root);
    const message = qs("#ambulanceMessage", root);
    const startPanel = qs("#ambulanceStart", root);
    const result = qs("#ambulanceResult", root);
    let running = false;
    let raf = 0;
    let lane = 1;
    let calls = 0;
    let lives = 4;
    let items = [];
    let startAt = 0;
    let lastAt = 0;
    let lastSpawn = 0;
    let timeLeft = 75;

    function formatTime(seconds) {
      const value = Math.max(0, Math.ceil(seconds));
      return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
    }

    function updateHud() {
      timer.textContent = formatTime(timeLeft);
      scoreLine.textContent = `${calls} вызовов · ${"♥".repeat(lives)}${"♡".repeat(4 - lives)}`;
      car.style.setProperty("--lane", lane);
    }

    function setLane(value) {
      lane = Math.max(0, Math.min(2, value));
      updateHud();
    }

    function spawn(elapsed) {
      const type = Math.random() < 0.62 ? "call" : "cone";
      const element = document.createElement("span");
      element.className = `road-event-v2 ${type}`;
      element.textContent = type === "call" ? "✦" : "▲";
      eventLayer.append(element);
      items.push({
        type,
        lane: Math.floor(Math.random() * 3),
        x: 106,
        speed: 14 + Math.random() * 6 + elapsed * 0.055,
        element,
      });
    }

    function finish() {
      running = false;
      window.cancelAnimationFrame(raf);
      road.classList.remove("moving");
      items.forEach((item) => item.element.remove());
      items = [];
      result.hidden = false;
      result.innerHTML = `<strong>${lives <= 0 ? "Смена прервана" : "Смена окончена"}</strong><p>Принято вызовов: ${calls}. ${calls >= 12 ? "Ночь прошла очень продуктивно." : "Можно выйти ещё на одну смену."}</p><button type="button">ещё одна смена</button>`;
      qs("button", result).addEventListener("click", begin);
    }

    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.04, (now - lastAt) / 1000 || 0);
      lastAt = now;
      const elapsed = (now - startAt) / 1000;
      timeLeft = 75 - elapsed;
      const spawnDelay = Math.max(650, 1050 - elapsed * 4.5);
      if (now - lastSpawn > spawnDelay) {
        lastSpawn = now;
        spawn(elapsed);
      }

      const next = [];
      items.forEach((item) => {
        item.x -= item.speed * dt;
        item.element.style.left = `${item.x}%`;
        item.element.style.setProperty("--event-lane", item.lane);
        const collision = item.x <= 31 && item.x >= 17 && item.lane === lane;
        if (collision) {
          if (item.type === "call") {
            calls += 1;
            message.textContent = "Вызов принят.";
          } else {
            lives -= 1;
            message.textContent = "Конус! Минус жизнь.";
            arena.classList.remove("ambulance-hit");
            void arena.offsetWidth;
            arena.classList.add("ambulance-hit");
          }
          item.element.remove();
        } else if (item.x < -10) {
          item.element.remove();
        } else {
          next.push(item);
        }
      });
      items = next;
      updateHud();
      if (timeLeft <= 0 || lives <= 0) finish();
      else raf = window.requestAnimationFrame(frame);
    }

    function begin() {
      items.forEach((item) => item.element.remove());
      items = [];
      lane = 1;
      calls = 0;
      lives = 4;
      timeLeft = 75;
      startAt = performance.now();
      lastAt = startAt;
      lastSpawn = startAt - 500;
      startPanel.hidden = true;
      result.hidden = true;
      message.textContent = "Смена началась. Следи за дорогой.";
      road.classList.add("moving");
      running = true;
      updateHud();
      raf = window.requestAnimationFrame(frame);
    }

    function keyHandler(event) {
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") setLane(lane - 1);
      if (event.key === "ArrowDown" || event.key === "ArrowRight") setLane(lane + 1);
    }

    qsa("[data-lane-move]", root).forEach((button) => button.addEventListener("click", () => setLane(lane + (button.dataset.laneMove === "up" ? -1 : 1))));
    window.addEventListener("keydown", keyHandler);
    qs(".gameClose", root).addEventListener("click", closeGame);
    qs("#ambulanceStart button", root).addEventListener("click", begin);
    updateHud();

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", keyHandler);
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  if (document.readyState === "complete") waitForApp();
  else window.addEventListener("load", () => waitForApp());
})();
