"use strict";

/* =====================================================
   HELPER
===================================================== */
function rupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

/* =====================================================
   AMBIL DATA
==================================================== */
let orderData = {};
try {
  orderData = JSON.parse(localStorage.getItem("etatix_order")) || {};
} catch (e) {
  orderData = {};
}

const cart = orderData.cart || {};
const items = cart.items || [];
const orderId = localStorage.getItem("sdk_orderId") || "-";

/* =====================================================
   ISI TIKET DIGITAL
==================================================== */
document.getElementById("sOrderId").textContent = orderId;
document.getElementById("sNama").textContent = orderData.nama || "-";
document.getElementById("sJenis").textContent =
  items.length ? items.map((i) => i.jenis + " x" + i.jumlah).join(", ") : "-";
document.getElementById("sJumlah").textContent = String(cart.totalQty || 0);
document.getElementById("sTotal").textContent = rupiah(cart.totalPrice || 0);

/* =====================================================
   SCROLL REVEAL
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
document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

/* =====================================================
   BERSIHKAN DATA SETELAH SELESAI (opsional)
===================================================== */
/* Uncomment baris di bawah jika ingin menghapus data setelah tiket ditampilkan */
// localStorage.removeItem("etatix_cart");
// localStorage.removeItem("etatix_order");
// localStorage.removeItem("sdk_orderId");
