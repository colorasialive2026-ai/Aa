"use strict";

/* =====================================================
   CONFIG
===================================================== */
const EVENT_DATE = new Date("2026-07-04T19:00:00").getTime();

/* =====================================================
   HELPER
===================================================== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* =====================================================
   PRELOADER
===================================================== */
window.addEventListener("load", () => {
  const loader = $("#loader");
  if (!loader) return;
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(() => loader.remove(), 600);
  }, 800);
});

/* =====================================================
   COUNTDOWN
==================================================== */
const dayEl = $("#days");
const hourEl = $("#hours");
const minuteEl = $("#minutes");
const secondEl = $("#seconds");

if (dayEl) {
  function updateCountdown() {
    const now = Date.now();
    const distance = EVENT_DATE - now;
    if (distance <= 0) {
      dayEl.textContent = "00";
      hourEl.textContent = "00";
      minuteEl.textContent = "00";
      secondEl.textContent = "00";
      clearInterval(timer);
      return;
    }
    dayEl.textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0");
    hourEl.textContent = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
    minuteEl.textContent = String(Math.floor((distance % (1000 * 60 * 60)) / 60000)).padStart(2, "0");
    secondEl.textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
  }
  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
}

/* =====================================================
   FAQ (menggunakan class toggle, bukan style.display)
===================================================== */
 $$(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    const icon = button.querySelector("span");
    const isOpen = answer.classList.contains("open");

    /* Tutup semua FAQ lain */
    $$(".faq-answer").forEach((item) => item.classList.remove("open"));
    $$(".faq-question span").forEach((i) => i.textContent = "+");
    $$(".faq-question").forEach((q) => q.setAttribute("aria-expanded", "false"));

    /* Toggle yang diklik */
    if (!isOpen) {
      answer.classList.add("open");
      icon.textContent = "\u2212";
      button.setAttribute("aria-expanded", "true");
    }
  });
});

/* =====================================================
   SCROLL REVEAL (IntersectionObserver)
===================================================== */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
 $$(".fade-up").forEach((item) => observer.observe(item));

/* =====================================================
   HEADER SCROLL EFFECT (dengan RAF throttle)
==================================================== */
const header = $("#header");
let ticking = false;

if (header) {
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.style.background =
            window.scrollY > 80
              ? "rgba(0,0,0,.92)"
              : "rgba(8,8,8,.65)";
          header.style.backdropFilter =
            window.scrollY > 80 ? "blur(20px)" : "blur(12px)";
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}

/* =====================================================
   SMOOTH SCROLL
==================================================== */
 $$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* =====================================================
   PAGE TRANSITION
==================================================== */
 $$('a[href$=".html"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    if (this.target === "_blank") return;
    e.preventDefault();
    document.body.style.transition = "opacity 0.25s ease";
    document.body.style.opacity = "0";
    setTimeout(() => (location.href = this.href), 250);
  });
});

/* =====================================================
   RESTORE OPACITY (pageshow untuk back-forward cache)
==================================================== */
window.addEventListener("pageshow", () => {
  document.body.style.opacity = "1";
});
