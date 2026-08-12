/* =============================================================
   Zum alten Forsthaus — main.js
   Kein Tracking, keine externen Requests. Reines Vanilla JS.
   ============================================================= */
(function () {
  "use strict";

  var CONTACT_EMAIL = "info@zumaltenforsthaus-brengel.de";

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initBackToTop();
    initCookieBanner();
    initContactForm();
    initYear();
    initActiveMenuNav();
  });

  /* ---------- Mobile Navigation ---------- */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.getElementById("mobile-nav");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
      panel.classList.toggle("open", !expanded);
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        panel.hidden = true;
        panel.classList.remove("open");
      });
    });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;
    var ticking = false;

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        btn.classList.toggle("visible", window.scrollY > 500);
        ticking = false;
      });
    }, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Cookie-Hinweis (rein informativ, keine Tracking-Cookies gesetzt) ---------- */
  function initCookieBanner() {
    var banner = document.getElementById("cookie-banner");
    if (!banner) return;
    var KEY = "zaf-cookie-notice-dismissed";

    try {
      if (localStorage.getItem(KEY)) return;
    } catch (e) { /* localStorage evtl. blockiert – Banner einfach zeigen */ }

    setTimeout(function () { banner.classList.add("visible"); }, 500);

    function dismiss() {
      banner.classList.remove("visible");
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
    }
    var accept = document.getElementById("cookie-accept");
    var decline = document.getElementById("cookie-decline");
    if (accept) accept.addEventListener("click", dismiss);
    if (decline) decline.addEventListener("click", dismiss);
  }

  /* ---------- Kontaktformular → mailto-Fallback ----------
     Es gibt (noch) kein Formular-Backend. Die Eingaben werden
     ausschließlich lokal im Browser zu einer mailto-Nachricht
     zusammengesetzt; es werden keine Daten an einen Server gesendet. */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = document.getElementById("form-status");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = (form.name.value || "").trim();
      var email = (form.email.value || "").trim();
      var message = (form.message.value || "").trim();

      if (!name || !email || !message) {
        if (status) {
          status.textContent = "Bitte Name, E-Mail und Nachricht ausfüllen.";
          status.classList.remove("ok");
        }
        return;
      }

      var phone = (form.phone && form.phone.value || "").trim();
      var date = (form.date && form.date.value || "").trim();
      var guests = (form.guests && form.guests.value || "").trim();

      var lines = [
        "Name: " + name,
        "E-Mail: " + email
      ];
      if (phone) lines.push("Telefon: " + phone);
      if (date) lines.push("Wunschdatum: " + date);
      if (guests) lines.push("Personen: " + guests);
      lines.push("", message);

      var subject = "Tischanfrage über die Website – " + name;
      var body = lines.join("\n");
      var mailto = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;

      if (status) {
        status.textContent = "Ihr E-Mail-Programm öffnet sich mit der vorausgefüllten Anfrage.";
        status.classList.add("ok");
      }
    });
  }

  /* ---------- Footer-Jahr ---------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- Aktiver Link in der Getränkekarten-Sprungnavigation ---------- */
  function initActiveMenuNav() {
    var nav = document.querySelector(".menu-nav");
    if (!nav) return;
    var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);
    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("active"); });
        var active = links.find(function (a) {
          return a.getAttribute("href") === "#" + entry.target.id;
        });
        if (active) active.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }
})();
