/* Cartium Docs: рух і навігація в дусі cartium.store.
   Material підвантажує сторінки без перезавантаження (navigation.instant),
   тож усе, що стосується сторінки, перезапускається з кожним document$. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var mobileToc = window.matchMedia("(max-width: 76.234375em)");
  var cleanups = [];

  function $(sel, scope) {
    return (scope || document).querySelector(sel);
  }
  function $$(sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  }
  function on(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    cleanups.push(function () {
      target.removeEventListener(type, fn, opts);
    });
  }

  /* ---------- Шапка: прогрес читання, ховається при скролі вниз (телефон) ---------- */
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var bar = $("[data-c-progress]");
      if (bar) bar.style.setProperty("--progress", max > 0 ? Math.min(1, y / max).toFixed(4) : 0);

      var header = $(".c-header");
      var drawerOpen = $("#__drawer") && $("#__drawer").checked;
      var searchOpen = $("#__search") && $("#__search").checked;
      if (header) {
        var hide = mobileToc.matches && y > lastY && y > 320 && !drawerOpen && !searchOpen;
        header.classList.toggle("is-hidden", hide);
      }
      var fab = $(".c-toc-fab");
      if (fab) fab.classList.toggle("is-hidden", y < 240);
      lastY = y;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Тема: колір браузерної панелі слідує за схемою ---------- */
  function syncThemeColor() {
    var dark = document.body.getAttribute("data-md-color-scheme") === "slate";
    $$('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute("content", dark ? "#111113" : "#f4f4f5");
      m.removeAttribute("media");
    });
  }
  new MutationObserver(syncThemeColor).observe(document.body, {
    attributes: true,
    attributeFilter: ["data-md-color-scheme"],
  });

  /* ---------- Поява блоків під час скролу ---------- */
  function setupReveal(content) {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var selectors = [
      ".md-typeset > h2",
      ".md-typeset > .admonition",
      ".md-typeset > details",
      ".md-typeset > .md-typeset__scrollwrap",
      ".md-typeset > .steps",
      ".md-typeset > .shot",
      ".md-typeset > .with-shot",
      ".md-typeset > .split > .split-item",
      ".md-typeset > .cards > .card",
      ".md-typeset > .phones .iphone",
      ".md-typeset > .c-stage",
      ".md-typeset > .c-section-head",
      ".md-typeset > .c-steps > .c-step",
      ".md-typeset > .c-summary > .c-summary-item",
      ".md-typeset > .c-jump",
      ".md-typeset > p > .iphone",
    ];
    var items = $$(selectors.join(","), content);
    if (!items.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        var batch = entries.filter(function (e) {
          return e.isIntersecting;
        });
        batch.forEach(function (e, i) {
          e.target.style.setProperty("--d", Math.min(i, 6) * 70 + "ms");
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach(function (el) {
      el.classList.add("c-reveal");
      io.observe(el);
    });
    cleanups.push(function () {
      io.disconnect();
    });
  }

  /* ---------- Прожектор під курсором на картках ---------- */
  function setupSpot() {
    if (!finePointer) return;
    $$(".md-typeset .card, .md-typeset .split-item, .c-pager-link").forEach(function (el) {
      el.classList.add("c-spot");
      on(el, "pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", e.clientX - r.left + "px");
        el.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  /* ---------- Герой головної: слова виростають, телефони нахиляються до курсора ---------- */
  function setupHero() {
    var hero = $(".c-hero");
    if (!hero) return;
    var h1 = $("h1", hero);
    if (h1 && !h1.dataset.split) {
      h1.dataset.split = "1";
      var w = 0;
      var nodes = Array.prototype.slice.call(h1.childNodes);
      nodes.forEach(function (node) {
        if (node.nodeType !== 3) return;
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(" "));
            return;
          }
          var outer = document.createElement("span");
          outer.className = "c-word";
          var inner = document.createElement("span");
          inner.style.setProperty("--w", w++);
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        h1.replaceChild(frag, node);
      });
    }
    var stage = $(".c-hero-stage", hero);
    var tilt = $(".c-hero-tilt", hero);
    if (!stage || !tilt || reduceMotion || !finePointer) return;
    on(hero, "pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      var px = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / r.width));
      var py = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / r.height));
      tilt.style.setProperty("--ry", (px * 10).toFixed(2) + "deg");
      tilt.style.setProperty("--rx", (py * -7).toFixed(2) + "deg");
    });
    on(hero, "pointerleave", function () {
      tilt.style.setProperty("--ry", "0deg");
      tilt.style.setProperty("--rx", "0deg");
    });
  }

  /* ---------- Надзаголовок: розділ і час читання ---------- */
  var BOOK =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z"/></svg>';
  function setupEyebrow(content) {
    if ($(".c-hero", content)) return;
    var h1 = $(".md-typeset > h1", content);
    if (!h1 || (h1.previousElementSibling && h1.previousElementSibling.classList.contains("c-eyebrow"))) return;
    var words = (content.textContent || "").trim().split(/\s+/).length;
    var minutes = Math.max(1, Math.round(words / 180));
    var p = document.createElement("p");
    p.className = "c-eyebrow";
    p.innerHTML = BOOK + "<span>Документація</span>" + '<span class="c-dot"></span>' + "<span>≈ " + minutes + " хв читання</span>";
    h1.parentNode.insertBefore(p, h1);
  }

  /* ---------- Мобільний «Зміст»: кнопка внизу і шторка зі списком розділів ---------- */
  var LIST =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/></svg>';
  function setupMobileToc(content) {
    $$(".c-toc-fab, .c-sheet").forEach(function (el) {
      el.remove();
    });
    var headings = $$(".md-typeset > h2[id]", content);
    if (headings.length < 2 || $(".c-hero", content)) return;

    var fab = document.createElement("button");
    fab.type = "button";
    fab.className = "c-toc-fab is-hidden";
    fab.setAttribute("aria-haspopup", "dialog");
    fab.innerHTML = '<span class="c-toc-fab-icon">' + LIST + '</span><span class="c-toc-fab-label">Зміст</span>';

    var sheet = document.createElement("div");
    sheet.className = "c-sheet";
    sheet.hidden = true;
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-label", "На цій сторінці");
    var links = headings
      .map(function (h) {
        var text = h.textContent.replace(/¶$/, "").trim();
        return '<li><a href="#' + encodeURIComponent(h.id) + '" data-id="' + h.id + '">' + text.replace(/</g, "&lt;") + "</a></li>";
      })
      .join("");
    sheet.innerHTML =
      '<div class="c-sheet-backdrop" data-close></div>' +
      '<div class="c-sheet-panel"><div class="c-sheet-grip"></div>' +
      '<p class="c-sheet-title">На цій сторінці</p><ul class="c-sheet-list">' +
      links +
      "</ul></div>";
    document.body.appendChild(fab);
    document.body.appendChild(sheet);

    var label = $(".c-toc-fab-label", fab);
    function open() {
      sheet.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(function () {
        sheet.classList.add("is-open");
        var active = $(".is-active", sheet) || $("a", sheet);
        if (active) active.focus({ preventScroll: true });
      });
    }
    function close() {
      sheet.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(function () {
        if (!sheet.classList.contains("is-open")) sheet.hidden = true;
      }, reduceMotion ? 0 : 450);
    }
    fab.addEventListener("click", open);
    sheet.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]") || e.target.closest("a")) close();
    });
    on(document, "keydown", function (e) {
      if (e.key === "Escape" && !sheet.hidden) {
        close();
        fab.focus();
      }
    });

    // активний розділ: останній заголовок, що пройшов верх екрана
    function updateActive() {
      var current = headings[0];
      var offset = 140;
      headings.forEach(function (h) {
        if (h.getBoundingClientRect().top - offset <= 0) current = h;
      });
      $$("a", sheet).forEach(function (a) {
        a.classList.toggle("is-active", a.dataset.id === current.id);
      });
      label.textContent = current.textContent.replace(/¶$/, "").trim();
    }
    var raf = 0;
    on(window, "scroll", function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActive);
    }, { passive: true });
    updateActive();
  }

  /* ---------- Кроки «Швидкого старту»: пройдені зафарбовуються ---------- */
  function setupSteps(content) {
    var steps = $$(".c-step", content);
    if (!steps.length) return;
    var raf = 0;
    function update() {
      var line = window.innerHeight * 0.45;
      steps.forEach(function (step) {
        step.classList.toggle("is-done", step.getBoundingClientRect().top < line);
      });
    }
    on(window, "scroll", function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ---------- Чекліст запуску: відмітки клікабельні й запамʼятовуються ---------- */
  function setupChecklist(content) {
    var list = $(".c-checklist", content);
    if (!list) return;
    var key = "cartium-docs-checklist:" + location.pathname;
    var saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(key) || "{}");
    } catch (e) {}
    var boxes = $$('input[type="checkbox"]', list);
    var progress = document.createElement("p");
    progress.className = "c-check-progress";
    progress.innerHTML = '<span data-count></span><span class="c-check-progress-bar"><span></span></span>';
    list.parentNode.insertBefore(progress, list);
    function render() {
      var done = boxes.filter(function (b) { return b.checked; }).length;
      $("[data-count]", progress).textContent = "Готово " + done + " з " + boxes.length;
      progress.style.setProperty("--done", boxes.length ? done / boxes.length : 0);
    }
    boxes.forEach(function (box, i) {
      box.disabled = false;
      box.checked = !!saved[i];
      var item = box.closest("li");
      if (item) {
        item.addEventListener("click", function (e) {
          if (e.target.closest("a, label")) return;
          box.checked = !box.checked;
          box.dispatchEvent(new Event("change"));
        });
      }
      box.addEventListener("change", function () {
        saved[i] = box.checked;
        try {
          localStorage.setItem(key, JSON.stringify(saved));
        } catch (e) {}
        render();
      });
    });
    render();
  }

  /* ---------- Пункти мобільного меню виїжджають по черзі ---------- */
  function setupDrawer() {
    $$(".md-nav--primary > .md-nav__list > .md-nav__item").forEach(function (li, i) {
      li.style.setProperty("--i", i);
    });
  }

  /* ---------- Запуск для кожної сторінки ---------- */
  function init() {
    cleanups.forEach(function (fn) {
      fn();
    });
    cleanups = [];
    var content = $(".md-content") || document;
    var isHome = !!$(".c-hero", content);
    document.body.classList.toggle("c-home", isHome);

    document.body.classList.remove("c-page-in");
    if (!reduceMotion) {
      void document.body.offsetWidth;
      document.body.classList.add("c-page-in");
    }

    setupEyebrow(content);
    setupHero();
    setupReveal(content);
    setupSpot();
    setupMobileToc(content);
    setupSteps(content);
    setupChecklist(content);
    setupDrawer();
    syncThemeColor();
    lastY = window.scrollY;
    onScroll();
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
