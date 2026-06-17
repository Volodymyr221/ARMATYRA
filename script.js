/* =========================================================
   КомпозитПром — інтерактив лендингу
   • плавний скрол
   • перемикач діаметра (динамічні характеристики + ціна)
   • валідація форми (укр. формат телефону)
   • надсилання заявки у Telegram
   ========================================================= */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};

  /* ---------- Поточний рік у футері ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Плавний скрол до якорів ---------- */
  document.querySelectorAll(".js-scroll, a[href^='#']").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerH = 68;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ---------- Дані по діаметрах ---------- */
  var DIA = {
    "8":  { mark: "АКС-8",  replace: "12 мм", weight: "4.5 кг",  price: "13.50 ₴/м" },
    "10": { mark: "АКС-10", replace: "14 мм", weight: "6.8 кг",  price: "18.90 ₴/м" },
    "12": { mark: "АКС-12", replace: "16 мм", weight: "9.6 кг",  price: "26.40 ₴/м" }
  };

  var opts = document.querySelectorAll(".diameter__opt");
  var elMark = document.getElementById("d-mark");
  var elReplace = document.getElementById("d-replace");
  var elWeight = document.getElementById("d-weight");
  var elPrice = document.getElementById("d-price");
  var formDiameter = document.getElementById("f-diameter");

  function setDiameter(d) {
    var data = DIA[d];
    if (!data) return;
    [elMark, elReplace, elWeight, elPrice].forEach(function (el) {
      if (el) el.style.opacity = "0";
    });
    setTimeout(function () {
      if (elMark) elMark.textContent = data.mark;
      if (elReplace) elReplace.textContent = data.replace;
      if (elWeight) elWeight.textContent = data.weight;
      if (elPrice) elPrice.textContent = data.price;
      [elMark, elReplace, elWeight, elPrice].forEach(function (el) {
        if (el) el.style.opacity = "1";
      });
    }, 120);
    // синхронізуємо вибір у формі
    if (formDiameter) formDiameter.value = d + " мм";
  }

  opts.forEach(function (btn) {
    btn.addEventListener("click", function () {
      opts.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-checked", "true");
      setDiameter(btn.getAttribute("data-d"));
    });
  });

  /* ---------- Валідація форми ---------- */
  var form = document.getElementById("lead-form");
  var nameInput = document.getElementById("f-name");
  var phoneInput = document.getElementById("f-phone");
  var submitBtn = document.getElementById("submit-btn");
  var successBox = document.getElementById("form-success");

  // Маска / нормалізація українського телефону
  function normalizePhone(value) {
    var digits = value.replace(/\D/g, "");
    if (digits.indexOf("380") === 0) digits = digits.slice(3);
    else if (digits.indexOf("0") === 0) digits = digits.slice(1);
    return digits; // 9 цифр без коду країни
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
      showError(nameInput, "Вкажіть ваше ім'я");
      ok = false;
    } else clearError(nameInput);

    if (!isValidUaPhone(phoneInput.value)) {
      showError(phoneInput, "Введіть коректний номер у форматі +380…");
      ok = false;
    } else clearError(phoneInput);

    return ok;
  }

  /* ---------- Надсилання у Telegram ---------- */
  function buildMessage(data) {
    var lines = [
      "🟧 <b>Нова заявка — КомпозитПром</b>",
      "",
      "👤 <b>Ім'я:</b> " + data.name,
      "📞 <b>Телефон:</b> +380" + normalizePhone(data.phone),
      "📦 <b>Товар:</b> " + data.product,
      "📐 <b>Діаметр:</b> " + data.diameter,
      "🔢 <b>Кількість:</b> " + (data.quantity || "—"),
      "💬 <b>Коментар:</b> " + (data.comment || "—")
    ];
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
      body: JSON.stringify({
        chat_id: tg.CHAT_ID,
        text: buildMessage(data),
        parse_mode: "HTML"
      })
    }).then(function (r) { return r.json(); });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      var data = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        product: document.getElementById("f-product").value,
        diameter: document.getElementById("f-diameter").value,
        quantity: document.getElementById("f-quantity").value.trim(),
        comment: document.getElementById("f-comment").value.trim()
      };

      submitBtn.disabled = true;
      var oldText = submitBtn.textContent;
      submitBtn.textContent = "Надсилаємо…";

      sendToTelegram(data)
        .catch(function (err) { console.error("[Telegram] помилка:", err); })
        .finally(function () {
          // Показуємо успіх у будь-якому разі (заявка прийнята),
          // навіть якщо TG ще не налаштований — менеджер передзвонить.
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
