/* =========================================================
   КомпозитПром — інтерактив лендингу
   • плавний скрол
   • каталог: категорії-таби, фільтр за діаметром, картки товарів
   • кнопка «Замовити» → підстановка позиції у форму
   • валідація форми (укр. формат телефону)
   • надсилання заявки у Telegram
   ========================================================= */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};

  /* ---------- Поточний рік у футері ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Плавний скрол ---------- */
  function scrollToEl(target) {
    if (!target) return;
    var headerH = 68;
    var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
    window.scrollTo({ top: top, behavior: "smooth" });
  }
  document.querySelectorAll(".js-scroll, a[href^='#']").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      scrollToEl(target);
    });
  });

  /* =========================================================
     КАТАЛОГ ТОВАРІВ
     Дані з прайсу постачальника. Щоб змінити ціни —
     редагуйте лише масиви items нижче.
     ========================================================= */
  var CATALOG = {
    build: {
      title: "Арматура для будівництва",
      product: "Арматура для будівництва",
      desc: "Композитна арматура з піщаним напиленням та ТУ — для фундаментів, плит, стін і бетонних конструкцій. Ціна за бухту.",
      noun: "Арматура",
      items: [
        { d: 4,  len: "50 м",  price: "317 ₴",      code: "1011296918", variant: "з напиленням" },
        { d: 4,  len: "100 м", price: "634 ₴",      code: "00069",      variant: "з напиленням" },
        { d: 6,  len: "50 м",  price: "534,75 ₴",   code: "1011299421", variant: "з напиленням", top: true },
        { d: 6,  len: "100 м", price: "1 069,50 ₴", code: "00068",      variant: "з напиленням" },
        { d: 7,  len: "50 м",  price: "775 ₴",      code: "1011327180", variant: "з напиленням" },
        { d: 7,  len: "100 м", price: "1 550 ₴",    code: "00067",      variant: "з напиленням" },
        { d: 8,  len: "50 м",  price: "1 012,50 ₴", code: "1011371203", variant: "з напиленням", top: true },
        { d: 8,  len: "100 м", price: "2 029,75 ₴", code: "1011371203", variant: "з напиленням" },
        { d: 10, len: "50 м",  price: "1 524 ₴",    code: "1011374139", variant: "з напиленням" },
        { d: 10, len: "100 м", price: "3 048,65 ₴", code: "1011374139", variant: "з напиленням" },
        { d: 12, len: "50 м",  price: "2 149,90 ₴", code: "1011376231", variant: "з напиленням" },
        { d: 12, len: "100 м", price: "4 299 ₴",    code: "00064",      variant: "з напиленням" },
        { d: 8,  len: "50 м",  price: "790 ₴",      code: "00258",      variant: "ТУ, без напилення", top: true },
        { d: 8,  len: "100 м", price: "1 580 ₴",    code: "00259",      variant: "ТУ, без напилення", top: true },
        { d: 10, len: "50 м",  price: "1 171 ₴",    code: "00260",      variant: "ТУ, без напилення", top: true },
        { d: 10, len: "100 м", price: "2 342,50 ₴", code: "00261",      variant: "ТУ, без напилення" },
        { d: 12, len: "50 м",  price: "1 595 ₴",    code: "00262",      variant: "ТУ, без напилення", top: true },
        { d: 12, len: "100 м", price: "3 190 ₴",    code: "00263",      variant: "ТУ, без напилення", top: true }
      ]
    },
    agro: {
      title: "Арматура Агро (для рослин)",
      product: "Арматура Агро (рослини)",
      desc: "Композитна арматура для садівництва, теплиць та підв'язки рослин. Легка, не гниє і не іржавіє. Ціна за бухту.",
      noun: "Арматура Агро",
      items: [
        { d: 4,  len: "50 м",  price: "349 ₴",      code: "1777671129" },
        { d: 4,  len: "100 м", price: "698 ₴",      code: "00075" },
        { d: 6,  len: "50 м",  price: "491 ₴",      code: "1797842919" },
        { d: 6,  len: "100 м", price: "982 ₴",      code: "00074" },
        { d: 7,  len: "50 м",  price: "702 ₴",      code: "1133133695" },
        { d: 7,  len: "100 м", price: "1 404 ₴",    code: "00073" },
        { d: 8,  len: "50 м",  price: "869,40 ₴",   code: "1196178862", top: true },
        { d: 8,  len: "100 м", price: "1 738,80 ₴", code: "00072",      top: true },
        { d: 10, len: "50 м",  price: "1 288 ₴",    code: "1196178958" },
        { d: 10, len: "100 м", price: "2 576 ₴",    code: "00071" },
        { d: 12, len: "50 м",  price: "1 754 ₴",    code: "1196179213", variant: "склокомпозитна" }
      ]
    },
    support: {
      title: "Опори для рослин",
      product: "Опори для рослин",
      desc: "Композитні опори (кілочки) для підв'язки рослин, кущів і дерев. Упаковка — 10 шт. Ціна за упаковку.",
      noun: "Опора",
      pack: true,
      items: [
        { d: 6,  len: "1 м",   price: "112,50 ₴", code: "1585203574" },
        { d: 6,  len: "1,5 м", price: "168,25 ₴", code: "1774119503" },
        { d: 6,  len: "2 м",   price: "224,25 ₴", code: "1774122750" },
        { d: 6,  len: "2,5 м", price: "280 ₴",    code: "1774130571" },
        { d: 8,  len: "1 м",   price: "198,50 ₴", code: "1602470946" },
        { d: 8,  len: "1,5 м", price: "297,50 ₴", code: "1774134974" },
        { d: 8,  len: "2 м",   price: "396,75 ₴", code: "1774135108" },
        { d: 8,  len: "2,5 м", price: "496 ₴",    code: "00104" },
        { d: 10, len: "1 м",   price: "294 ₴",    code: "1602473808" },
        { d: 10, len: "1,5 м", price: "441 ₴",    code: "1774137897" },
        { d: 10, len: "2 м",   price: "588 ₴",    code: "1774138453" },
        { d: 10, len: "2,5 м", price: "735 ₴",    code: "1774145529" },
        { d: 12, len: "1 м",   price: "399 ₴",    code: "1602474096" },
        { d: 12, len: "1,5 м", price: "599 ₴",    code: "1774140249" },
        { d: 12, len: "2 м",   price: "799 ₴",    code: "1774141129" },
        { d: 12, len: "2,5 м", price: "998 ₴",    code: "1755141129" }
      ]
    }
  };

  var tabs = document.querySelectorAll(".cat-tab");
  var descEl = document.getElementById("cat-desc");
  var filterEl = document.getElementById("cat-filter");
  var gridEl = document.getElementById("cat-grid");
  var state = { cat: "build", d: "all" };

  function itemName(catKey, it) {
    var c = CATALOG[catKey];
    if (c.pack) return c.noun + " " + it.d + " мм · " + it.len;
    return c.noun + " " + it.d + " мм · " + it.len;
  }

  function uniqueDiameters(catKey) {
    var seen = {}, out = [];
    CATALOG[catKey].items.forEach(function (it) {
      if (!seen[it.d]) { seen[it.d] = true; out.push(it.d); }
    });
    out.sort(function (a, b) { return a - b; });
    return out;
  }

  function renderFilter(catKey) {
    var dias = uniqueDiameters(catKey);
    var html = '<button type="button" class="cat-chip' + (state.d === "all" ? " is-active" : "") + '" data-d="all">Усі</button>';
    dias.forEach(function (d) {
      html += '<button type="button" class="cat-chip' + (String(state.d) === String(d) ? " is-active" : "") + '" data-d="' + d + '">' + d + ' мм</button>';
    });
    filterEl.innerHTML = html;
  }

  function renderGrid(catKey) {
    var c = CATALOG[catKey];
    var items = c.items.filter(function (it) {
      return state.d === "all" || String(it.d) === String(state.d);
    });
    var html = "";
    items.forEach(function (it) {
      var name = itemName(catKey, it);
      html +=
        '<article class="pcard">' +
          (it.top ? '<span class="pcard__tag">Топ</span>' : "") +
          '<div class="pcard__head">' +
            '<span class="pcard__d">⌀ ' + it.d + ' мм</span>' +
            '<span class="pcard__len">' + it.len + '</span>' +
          '</div>' +
          '<h3 class="pcard__name">' + name + '</h3>' +
          '<p class="pcard__meta">' + (it.variant ? it.variant + " · " : "") + 'код ' + it.code + '</p>' +
          '<div class="pcard__foot">' +
            '<span class="pcard__price">' + it.price + '</span>' +
            '<button type="button" class="btn btn--accent pcard__btn" ' +
              'data-cat="' + catKey + '" data-d="' + it.d + '" data-name="' + name +
              (it.variant ? " (" + it.variant + ")" : "") + '" data-price="' + it.price + '" data-code="' + it.code + '">Замовити</button>' +
          '</div>' +
        '</article>';
    });
    gridEl.innerHTML = html;
  }

  function renderCatalog() {
    var c = CATALOG[state.cat];
    if (descEl) descEl.textContent = c.desc;
    renderFilter(state.cat);
    renderGrid(state.cat);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      state.cat = tab.getAttribute("data-cat");
      state.d = "all";
      renderCatalog();
    });
  });

  if (filterEl) {
    filterEl.addEventListener("click", function (e) {
      var chip = e.target.closest(".cat-chip");
      if (!chip) return;
      state.d = chip.getAttribute("data-d");
      renderFilter(state.cat);
      renderGrid(state.cat);
    });
  }

  /* ---------- Кнопка «Замовити» у картці ---------- */
  var fProduct = document.getElementById("f-product");
  var fDiameter = document.getElementById("f-diameter");
  var fItem = document.getElementById("f-item");

  if (gridEl) {
    gridEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".pcard__btn");
      if (!btn) return;
      var cat = btn.getAttribute("data-cat");
      var d = btn.getAttribute("data-d");
      var name = btn.getAttribute("data-name");
      var price = btn.getAttribute("data-price");
      if (fProduct) fProduct.value = CATALOG[cat].product;
      if (fDiameter) fDiameter.value = d + " мм";
      if (fItem) fItem.value = name + " — " + price;
      scrollToEl(document.getElementById("form"));
      // легке підсвічування поля позиції
      if (fItem) {
        fItem.classList.add("is-filled");
        setTimeout(function () { fItem.classList.remove("is-filled"); }, 1500);
      }
    });
  }

  if (gridEl) renderCatalog();

  /* =========================================================
     ФОРМА
     ========================================================= */
  var form = document.getElementById("lead-form");
  var nameInput = document.getElementById("f-name");
  var phoneInput = document.getElementById("f-phone");
  var submitBtn = document.getElementById("submit-btn");
  var successBox = document.getElementById("form-success");

  function normalizePhone(value) {
    var digits = value.replace(/\D/g, "");
    if (digits.indexOf("380") === 0) digits = digits.slice(3);
    else if (digits.indexOf("0") === 0) digits = digits.slice(1);
    return digits;
  }
  function isValidUaPhone(value) {
    return /^\d{9}$/.test(normalizePhone(value));
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      var d = normalizePhone(phoneInput.value).slice(0, 9);
      var out = "+380";
      if (d.length > 0) out += " (" + d.slice(0, 2);
      if (d.length >= 2) out += ") " + d.slice(2, 5);
      if (d.length >= 5) out += "-" + d.slice(5, 7);
      if (d.length >= 7) out += "-" + d.slice(7, 9);
      phoneInput.value = out;
    });
  }

  function showError(input, msg) {
    input.classList.add("is-invalid");
    var box = form.querySelector('.field__error[data-for="' + input.name + '"]');
    if (box) box.textContent = msg;
  }
  function clearError(input) {
    input.classList.remove("is-invalid");
    var box = form.querySelector('.field__error[data-for="' + input.name + '"]');
    if (box) box.textContent = "";
  }
  function validate() {
    var ok = true;
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError(nameInput, "Вкажіть ваше ім'я"); ok = false;
    } else clearError(nameInput);
    if (!isValidUaPhone(phoneInput.value)) {
      showError(phoneInput, "Введіть коректний номер у форматі +380…"); ok = false;
    } else clearError(phoneInput);
    return ok;
  }

  /* ---------- Telegram ---------- */
  function buildMessage(data) {
    var lines = [
      "🟧 <b>Нова заявка — КомпозитПром</b>",
      "",
      "👤 <b>Ім'я:</b> " + data.name,
      "📞 <b>Телефон:</b> +380" + normalizePhone(data.phone),
      "📦 <b>Категорія:</b> " + data.product,
      "📐 <b>Діаметр:</b> " + data.diameter
    ];
    if (data.item) lines.push("🛒 <b>Позиція:</b> " + data.item);
    lines.push("🔢 <b>Кількість:</b> " + (data.quantity || "—"));
    lines.push("💬 <b>Коментар:</b> " + (data.comment || "—"));
    return lines.join("\n");
  }

  function sendToTelegram(data) {
    var tg = CFG.telegram || {};
    if (!tg.enabled) return Promise.resolve({ skipped: true });
    if (!tg.BOT_TOKEN || tg.BOT_TOKEN.indexOf("PASTE_") === 0 ||
        !tg.CHAT_ID || tg.CHAT_ID.indexOf("PASTE_") === 0) {
      console.warn("[Telegram] Не налаштовано BOT_TOKEN/CHAT_ID у config.js");
      return Promise.resolve({ skipped: true });
    }
    var url = "https://api.telegram.org/bot" + tg.BOT_TOKEN + "/sendMessage";
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: tg.CHAT_ID, text: buildMessage(data), parse_mode: "HTML" })
    }).then(function (r) { return r.json(); });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      var data = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        product: fProduct.value,
        diameter: fDiameter.value,
        item: fItem ? fItem.value.trim() : "",
        quantity: document.getElementById("f-quantity").value.trim(),
        comment: document.getElementById("f-comment").value.trim()
      };

      submitBtn.disabled = true;
      var oldText = submitBtn.textContent;
      submitBtn.textContent = "Надсилаємо…";

      sendToTelegram(data)
        .catch(function (err) { console.error("[Telegram] помилка:", err); })
        .finally(function () {
          form.querySelectorAll(".field, .lead-form__note, #submit-btn").forEach(function (el) {
            el.style.display = "none";
          });
          if (successBox) successBox.hidden = false;
          submitBtn.disabled = false;
          submitBtn.textContent = oldText;
        });
    });
  }
})();
