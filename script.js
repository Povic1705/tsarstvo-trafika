(function () {
  const site = window.SITE || {};
  const phone = (site.phone || "").trim();
  const telegram = (site.telegram || "").replace(/^@/, "");
  const channel = (site.telegramChannel || "").replace(/^@/, "");
  const instagram = (site.instagram || "").replace(/^@/, "").trim();
  const youtube = (site.youtube || "").trim();
  const phoneHref = phone ? "tel:" + phone.replace(/[^\d+]/g, "") : "";
  const tgHref = telegram ? "https://t.me/" + telegram : "";
  const igHref = instagram
    ? (instagram.indexOf("http") === 0 ? instagram : "https://www.instagram.com/" + instagram.replace(/\/$/, ""))
    : "";
  const ytHref = youtube
    ? (youtube.indexOf("http") === 0 ? youtube : "https://youtube.com/" + youtube.replace(/^@/, "@"))
    : "";

  function el(html) {
    const wrap = document.createElement("div");
    wrap.innerHTML = html.trim();
    return wrap.firstElementChild;
  }

  function fill(selector, nodes) {
    document.querySelectorAll(selector).forEach(function (root) {
      root.innerHTML = "";
      nodes.forEach(function (node) {
        root.appendChild(node.cloneNode(true));
      });
    });
  }

  function socialNode(name, href, className) {
    const stub = !href;
    const classes = [className, stub ? (className ? className + "--stub" : "is-stub") : ""]
      .filter(Boolean)
      .join(" ");
    if (href) return el('<a class="' + classes + '" href="' + href + '" target="_blank" rel="noopener">' + name + "</a>");
    return el('<span class="' + classes + '">' + name + " · скоро</span>");
  }

  const chips = [];
  if (phone) chips.push(el('<a class="chip" href="' + phoneHref + '">' + phone + "</a>"));
  if (tgHref) chips.push(el('<a class="chip" href="' + tgHref + '" target="_blank" rel="noopener">Telegram</a>'));
  chips.push(socialNode("Instagram", igHref, "chip"));
  chips.push(socialNode("YouTube", ytHref, "chip"));
  fill("[data-contacts]", chips);

  const leadLinks = [];
  if (tgHref) leadLinks.push(el('<a href="' + tgHref + '" target="_blank" rel="noopener">Написать в Telegram @' + telegram + "</a>"));
  if (phone) leadLinks.push(el('<a href="' + phoneHref + '">Позвонить ' + phone + "</a>"));
  if (channel) {
    leadLinks.push(el('<a href="https://t.me/' + channel + '" target="_blank" rel="noopener">Канал t.me/' + channel + "</a>"));
  }
  leadLinks.push(socialNode("Instagram", igHref, ""));
  leadLinks.push(socialNode("YouTube", ytHref, ""));
  fill("[data-lead-links]", leadLinks);

  const footer = [];
  if (phone) footer.push(el('<a href="' + phoneHref + '">' + phone + "</a>"));
  if (tgHref) footer.push(el('<a href="' + tgHref + '" target="_blank" rel="noopener">Telegram @' + telegram + "</a>"));
  if (channel) footer.push(el('<a href="https://t.me/' + channel + '" target="_blank" rel="noopener">Канал @' + channel + "</a>"));
  footer.push(socialNode("Instagram", igHref, ""));
  footer.push(socialNode("YouTube", ytHref, ""));
  fill("[data-footer-contacts]", footer);

  document.querySelectorAll("[data-telegram-link]").forEach(function (link) {
    if (tgHref) link.href = tgHref;
  });

  const sticky = document.querySelector("[data-sticky]");
  if (sticky) {
    sticky.innerHTML = "";
    sticky.appendChild(el('<a href="#lead">Заявка</a>'));
    if (tgHref) sticky.appendChild(el('<a class="sticky--ghost" href="' + tgHref + '" target="_blank" rel="noopener">Telegram</a>'));
    if (phone) sticky.appendChild(el('<a class="sticky--ghost" href="' + phoneHref + '">Позвонить</a>'));
  }

  function goal(name) {
    const id = site.metrikaId;
    if (id && typeof window.ym === "function") {
      window.ym(Number(id), "reachGoal", name);
    }
  }

  const form = document.getElementById("mail-form");
  const status = document.getElementById("form-status");
  const email = (site.email || "").trim();

  function setStatus(type, text) {
    if (!status) return;
    status.hidden = false;
    status.className = "form__status is-" + type;
    status.textContent = text;
  }

  function sendMail(payload) {
    const controller = new AbortController();
    const timer = setTimeout(function () {
      controller.abort();
    }, 12000);
    return fetch("https://formsubmit.co/ajax/" + encodeURIComponent(email), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    }).then(function (response) {
      clearTimeout(timer);
      if (!response.ok) throw new Error("fail");
      return response.json();
    });
  }

  if (form && email) {
    const consent = document.getElementById("form-consent");
    const submitBtn = document.getElementById("form-submit");

    function syncSubmit() {
      if (submitBtn) submitBtn.disabled = !(consent && consent.checked);
    }
    if (consent) consent.addEventListener("change", syncSubmit);
    syncSubmit();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phoneValue = String(data.get("phone") || "").trim();
      const task = String(data.get("task") || "").trim();
      if (!name || !phoneValue) {
        setStatus("err", "Напишите имя и телефон.");
        return;
      }
      if (!consent || !consent.checked) {
        setStatus("err", "Поставьте согласие на обработку персональных данных.");
        return;
      }

      const button = submitBtn || form.querySelector('button[type="submit"]');
      const oldLabel = button ? button.textContent : "";
      if (button) {
        button.disabled = true;
        button.textContent = "Отправляю…";
      }
      setStatus("wait", "Отправляю заявку, подождите несколько секунд…");

      sendMail({
        _subject: "Заявка с tsarstvo-trafika.ru",
        name: name,
        phone: phoneValue,
        task: task || "—",
        source: location.href
      })
        .then(function () {
          goal("lead");
          form.reset();
          setStatus("ok", "Заявка отправлена. Марина получит письмо и свяжется с вами.");
        })
        .catch(function () {
          setStatus(
            "err",
            "Письмо пока не ушло. Напишите в Telegram @" +
              telegram +
              " или позвоните " +
              phone +
              " — заявка так точно дойдёт."
          );
        })
        .then(function () {
          if (button) button.textContent = oldLabel;
          syncSubmit();
        });
    });
  }
})();
