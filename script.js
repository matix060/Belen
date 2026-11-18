/* Nuestro Pequeño Mundo · JavaScript sin dependencias */
(() => {
  "use strict";
  const config = window.MI_MUNDO;
  if (!config) { console.error("No se pudo cargar config.js"); return; }
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const name = config.nombre || "Mi amor";
  const startParts = (config.fechaInicio || "2025-10-23").split("-").map(Number);
  const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2]);
  const startLabel = new Intl.DateTimeFormat("es-PY", { day: "numeric", month: "long", year: "numeric" }).format(startDate);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Personalización principal
  $("#heroName").textContent = name + ".";
  $("#heroMessage").textContent = config.mensajeInicio;
  $("#startDateLabel").textContent = startLabel;
  $("#footerName").textContent = name;
  $("#finalTitle").textContent = `Mi querida ${name}...`;
  $("#finalSignature").textContent = `Te amo, ${name}. ♡`;
  $("#finalLetterBody").replaceChildren(...(config.regaloFinal || []).map((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    return p;
  }));
  document.title = `Nuestro Pequeño Mundo ♡ Para ${name}`;

  // Menú adaptable a celulares
  const menu = $("#menuToggle");
  const nav = $("#navLinks");
  menu.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    menu.textContent = isOpen ? "×" : "☰";
  });
  $$(".nav-links a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "☰";
  }));
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const active = `#${entry.target.id}`;
        $$(".nav-links a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === active));
      });
    }, { rootMargin: "-28% 0px -62% 0px", threshold: 0 });
    $$("main > section").forEach(section => sectionObserver.observe(section));
    if (!reduceMotion) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
        });
      }, { threshold: .08 });
      $$(".reveal").forEach(el => revealObserver.observe(el));
      document.body.classList.add("js-ready");
    }
  }

  // Contador en vivo y próximo aniversario (hora local del visitante)
  function updateTime() {
    const now = new Date();
    const elapsed = Math.max(0, now.getTime() - startDate.getTime());
    const days = Math.floor(elapsed / 86_400_000);
    $("#counterDays").textContent = days.toLocaleString("es-PY");
    $("#counterHours").textContent = String(Math.floor(elapsed / 3_600_000) % 24).padStart(2, "0");
    $("#counterMinutes").textContent = String(Math.floor(elapsed / 60_000) % 60).padStart(2, "0");
    $("#counterSeconds").textContent = String(Math.floor(elapsed / 1_000) % 60).padStart(2, "0");
    let nextYear = now.getFullYear();
    let anniversary = new Date(nextYear, startParts[1] - 1, startParts[2]);
    if (now >= anniversary) anniversary = new Date(++nextYear, startParts[1] - 1, startParts[2]);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const anniversaryDay = new Date(anniversary.getFullYear(), anniversary.getMonth(), anniversary.getDate());
    const daysLeft = Math.round((Date.UTC(anniversaryDay.getFullYear(), anniversaryDay.getMonth(), anniversaryDay.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / 86_400_000);
    $("#anniversaryMessage").textContent = `💌 Faltan ${daysLeft} días para nuestro próximo aniversario.`;
  }
  updateTime();
  setInterval(updateTime, 1000);

  // Línea de tiempo editable en config.js
  const timeline = $("#timeline");
  (config.momentos || []).forEach(moment => {
    const card = document.createElement("article");
    card.className = "timeline-item";
    const date = document.createElement("span"); date.className = "timeline-date"; date.textContent = moment.fecha || "Un recuerdo";
    const title = document.createElement("h3"); title.textContent = moment.titulo || "Un día especial";
    const body = document.createElement("p"); body.textContent = moment.descripcion || "";
    card.append(date, title, body);
    timeline.appendChild(card);
  });

  // Galería: fotos fijas en config.js y carga temporal desde el dispositivo
  const gallery = $("#photoGallery");
  const photoUrls = [];
  function appendPhoto(src) {
    const img = document.createElement("img");
    img.src = src;
    img.className = "photo-item";
    img.loading = "lazy";
    img.alt = "Un recuerdo de nuestra historia";
    gallery.appendChild(img);
  }
  (config.fotos || []).forEach(appendPhoto);
  $("#photoInput").addEventListener("change", event => {
    for (const url of photoUrls) URL.revokeObjectURL(url);
    photoUrls.length = 0;
    for (const file of [...event.target.files].slice(0, 24)) {
      if (!file.type.startsWith("image/")) continue;
      const url = URL.createObjectURL(file);
      photoUrls.push(url);
      appendPhoto(url);
    }
    event.target.value = "";
  });
  window.addEventListener("pagehide", () => photoUrls.forEach(url => URL.revokeObjectURL(url)));

  // Sobres y cartas
  const lettersGrid = $("#lettersGrid");
  const letterDialog = $("#letterDialog");
  (config.cartas || []).forEach((letter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "letter-card";
    const icon = document.createElement("span"); icon.className = "letter-icon"; icon.textContent = "💌"; icon.setAttribute("aria-hidden", "true");
    const label = document.createElement("span"); label.textContent = letter.titulo;
    button.append(icon, label);
    button.addEventListener("click", () => {
      $("#letterDialogTitle").textContent = letter.titulo;
      $("#letterDialogText").textContent = letter.mensaje;
      letterDialog.showModal();
    });
    lettersGrid.appendChild(button);
  });

  // Razones sin repetición dentro de cada ciclo
  const reasons = config.razones || [];
  let indices = reasons.map((_, i) => i);
  let reasonIndex = 0;
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffle(indices);
  function revealReason() {
    if (!reasons.length) return;
    if (reasonIndex >= reasons.length) { reasonIndex = 0; shuffle(indices); }
    $("#reasonText").textContent = `“${reasons[indices[reasonIndex]]}”`;
    reasonIndex++;
    $("#reasonCount").textContent = `${reasonIndex} de ${reasons.length} razones descubiertas`;
  }
  $("#reasonButton").addEventListener("click", revealReason);
  $("#heartReason").addEventListener("click", revealReason);

  // Frasco aleatorio: evita repetir consecutivamente si hay alternativas
  let lastPlan = "";
  $("#planButton").addEventListener("click", () => {
    const category = $("#planCategory").value;
    const pools = Object.values(config.planes || {});
    const choices = category === "all" ? pools.flat() : (config.planes[category] || []);
    if (!choices.length) { $("#planText").textContent = "Pronto vamos a encontrar un plan bonito."; return; }
    let pick = choices[Math.floor(Math.random() * choices.length)];
    if (pick === lastPlan && choices.length > 1) pick = choices[(choices.indexOf(pick) + 1) % choices.length];
    lastPlan = pick;
    $("#planText").textContent = `💗 ${pick}`;
  });

  // Cielo de estrellas: las coordenadas se distribuyen de forma fija
  const starPositions = [[7, 17], [23, 57], [41, 16], [61, 22], [82, 41], [12, 80], [51, 74], [74, 81], [90, 11], [34, 84], [68, 54], [93, 70]];
  (config.estrellas || []).forEach((message, i) => {
    const pos = starPositions[i % starPositions.length];
    const star = document.createElement("button");
    star.type = "button";
    star.className = "star";
    star.textContent = i % 3 === 0 ? "✦" : "✧";
    star.style.left = `${pos[0]}%`;
    star.style.top = `${pos[1]}%`;
    star.style.animationDelay = `${i * .3}s`;
    star.setAttribute("aria-label", `Descubrir el mensaje de la estrella ${i + 1}`);
    star.addEventListener("click", () => { $("#starMessage").textContent = `✦ ${message} ✦`; });
    $("#starField").appendChild(star);
  });

  // Regalo y pequeña lluvia de corazones
  function openGift() {
    $("#finalLetter").hidden = false;
    $("#giftIcon").textContent = "💝";
    if (!reduceMotion) {
      const layer = $("#confettiLayer");
      for (let i = 0; i < 31; i++) {
        const heart = document.createElement("span");
        heart.className = "confetti";
        heart.textContent = ["♥", "♡", "✿", "✦"][i % 4];
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.color = ["#c57894", "#dc9cb0", "#d6ad74"][i % 3];
        heart.style.animationDelay = `${Math.random() * 1.5}s`;
        heart.style.animationDuration = `${3 + Math.random() * 2}s`;
        layer.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
      }
    }
    $("#finalLetter").scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "center" });
  }
  $("#giftIcon").addEventListener("click", openGift);
  $("#giftButton").addEventListener("click", openGift);

  // Música opcional. No se inicia automáticamente (respeta permisos del navegador).
  const musicDialog = $("#musicDialog");
  const audio = $("#audioPlayer");
  const toggleSong = $("#toggleSong");
  let songUrl = null;
  function updateMusicButton() { toggleSong.textContent = audio.paused ? "▶ Reproducir" : "⏸ Pausar"; }
  function setAudioSource(src, label) {
    audio.pause();
    audio.src = src;
    audio.load();
    toggleSong.disabled = false;
    $("#songName").textContent = label;
    updateMusicButton();
  }
  if (config.musica) setAudioSource(config.musica, "Nuestra canción ♫");
  $("#musicControl").addEventListener("click", () => musicDialog.showModal());
  $("#songInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("audio/")) return;
    if (songUrl) URL.revokeObjectURL(songUrl);
    songUrl = URL.createObjectURL(file);
    setAudioSource(songUrl, file.name);
    event.target.value = "";
  });
  toggleSong.addEventListener("click", async () => {
    if (!audio.paused) { audio.pause(); return; }
    try { await audio.play(); } catch { $("#songName").textContent = "No se pudo reproducir. Probá con otro archivo."; }
    updateMusicButton();
  });
  audio.addEventListener("play", updateMusicButton);
  audio.addEventListener("pause", updateMusicButton);
  window.addEventListener("pagehide", () => { if (songUrl) URL.revokeObjectURL(songUrl); });

  // Pequeños pétalos flotantes: se desactivan si el usuario prefiere menos movimiento.
  if (!reduceMotion) {
    function newPetal() {
      if (document.hidden) return;
      const el = document.createElement("span");
      el.className = "petal";
      el.textContent = Math.random() > .5 ? "♡" : "✿";
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = "-28px";
      el.style.fontSize = `${12 + Math.random() * 13}px`;
      el.style.animationDuration = `${7 + Math.random() * 7}s`;
      $("#petals").appendChild(el);
      setTimeout(() => el.remove(), 14500);
    }
    setInterval(newPetal, 1750);
  }
})();
