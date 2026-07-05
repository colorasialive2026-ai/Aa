"use strict";

/* =====================================================
   CONFIG — GANTI URL INI DENGAN ENDPOINT FORMSPREE ANDA
===================================================== */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdarpqar";

/* =====================================================
   HELPER
==================================================== */
function rupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

/* =====================================================
   AMBIL DATA DARI etatix_order (bukan key terpisah)
===================================================== */
let orderData = {};
try {
  orderData = JSON.parse(localStorage.getItem("etatix_order")) || {};
} catch (e) {
  orderData = {};
}

const cart = orderData.cart || {};
const items = cart.items || [];

/* =====================================================
   GENERATE ORDER ID
===================================================== */
let orderId = localStorage.getItem("sdk_orderId");
if (!orderId) {
  const d = new Date();
  const y = String(d.getFullYear()).slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  orderId = "SDK" + y + m + day + rand;
  localStorage.setItem("sdk_orderId", orderId);
}

/* =====================================================
   ISI HALAMAN
==================================================== */
document.getElementById("orderId").textContent = orderId;
document.getElementById("total").textContent = rupiah(cart.totalPrice || 0);
document.getElementById("jenisTiket").textContent =
  items.length ? items.map((i) => i.jenis + " (" + i.jumlah + ")").join(", ") : "-";
document.getElementById("jumlahTiket").textContent = cart.totalQty || "0";
document.getElementById("namaPemesan").textContent = orderData.nama || "-";
document.getElementById("waPemesan").textContent =
  (orderData.kodeNegara || "+62") + (orderData.wa || "-");

/* =====================================================
   TIMER 15 MENIT
===================================================== */
let duration = 15 * 60;
const timerEl = document.getElementById("timer");

function updateTimer() {
  const m = Math.floor(duration / 60);
  const s = duration % 60;
  timerEl.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");

  if (duration <= 60) {
    timerEl.style.color = "#E74C3C";
  }

  if (duration <= 0) {
    alert("Waktu pembayaran telah habis.");
    window.location.href = "index.html";
    return;
  }
  duration--;
}

updateTimer();
setInterval(updateTimer, 1000);

/* =====================================================
   UPLOAD & CHECKBOX
==================================================== */
let uploaded = false;
const fileInput = document.getElementById("file");
const cekInput = document.getElementById("cek");
const confirmBtn = document.getElementById("btn");

function updateBtn() {
  confirmBtn.disabled = !(uploaded && cekInput.checked);
}

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    uploaded = true;
    document.getElementById("result").style.display = "block";
    document.getElementById("fname").textContent = "\uD83D\uDCE7 " + fileInput.files[0].name;
    updateBtn();
  }
});

cekInput.addEventListener("change", updateBtn);

/* =====================================================
   KONFIRMASI PEMBAYARAN
==================================================== */
confirmBtn.addEventListener("click", async () => {
  document.getElementById("qrisLoading").style.display = "flex";

  try {
    /* Kirim ke Formspree jika ada file */
    if (fileInput.files.length > 0) {
      const fd = new FormData();
      fd.append("order_id", orderId);
      fd.append("nama", orderData.nama || "");
      fd.append("whatsapp", (orderData.kodeNegara || "+62") + (orderData.wa || ""));
      fd.append("jenis_tiket", document.getElementById("jenisTiket").textContent);
      fd.append("jumlah_tiket", String(cart.totalQty || 0));
      fd.append("total", String(cart.totalPrice || 0));
      fd.append("bukti", fileInput.files[0]);

      try {
        await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: fd,
          headers: { Accept: "application/json" }
        });
      } catch (e) {
        /* Jika Formspree gagal, tetap lanjut ke loading */
        console.warn("Formspree error:", e);
      }
    }
  } catch (err) {
    console.warn("Error:", err);
  }

  /* Selalu lanjut ke loading page */
  setTimeout(() => {
    window.location.href = "loading.html";
  }, 1500);
});
