"use strict";

/* =====================================================
   DATA TIKET
===================================================== */
const ticketList = [
  { nama: "2-Day Pass Presale", harga: 280000, status: "ON SALE", badge: "BEST SELLER" },
  { nama: "2-Day Pass Regular", harga: 375000, status: "READY", badge: null },
  { nama: "Regular", harga: 190000, status: "READY", badge: null },
  { nama: "Intimate Couple", harga: 175000, status: "LIMITED", badge: "PROMO", minimal: 2 },
  { nama: "VIP", harga: 450000, status: "VERY LIMITED", badge: null }
];

/* =====================================================
   STATE
===================================================== */
const cart = {};
ticketList.forEach((item) => (cart[item.nama] = 0));

/* =====================================================
   HELPER
==================================================== */
function rupiah(value) {
  return "Rp " + Number(value).toLocaleString("id-ID");
}

/* =====================================================
   RENDER TIKET GRID
==================================================== */
const grid = document.getElementById("ticketGrid");

ticketList.forEach((ticket, index) => {
  const badgeHtml = ticket.badge
    ? '<div class="ticket-badge">' + ticket.badge + '</div>'
    : '';

  grid.innerHTML +=
    '<div class="ticket-card fade-up">' +
      badgeHtml +
      '<div class="ticket-header-row">' +
        '<div class="ticket-name">' + ticket.nama + '</div>' +
        '<div class="ticket-status">' + ticket.status + '</div>' +
      '</div>' +
      '<div class="ticket-desc">' +
        (ticket.minimal
          ? 'Harga ' + rupiah(ticket.harga) + '/orang. Minimal pembelian 2 tiket.'
          : 'Tiket ' + ticket.nama + '. Akses seluruh area festival.') +
      '</div>' +
      '<div class="ticket-footer">' +
        '<div class="ticket-price">' + rupiah(ticket.harga) +
          '<small>' + (ticket.minimal ? 'per orang' : 'Official Ticket') + '</small>' +
        '</div>' +
        '<div>' +
          '<button class="select-btn" id="s' + index + '" data-index="' + index + '">Pilih Tiket</button>' +
          '<div class="qty" id="q' + index + '">' +
            '<button data-action="minus" data-index="' + index + '">\u2212</button>' +
            '<span id="n' + index + '">1</span>' +
            '<button data-action="plus" data-index="' + index + '">+</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
});

/* =====================================================
   EVENT DELEGATION (lebih efisien dari inline onclick)
==================================================== */
grid.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  const index = parseInt(btn.dataset.index, 10);
  const ticket = ticketList[index];

  if (btn.id && btn.id.startsWith("s")) {
    /* Klik "Pilih Tiket" */
    cart[ticket.nama] = ticket.minimal ? 2 : 1;
    document.getElementById("s" + index).style.display = "none";
    document.getElementById("q" + index).style.display = "flex";
    render();
  } else if (btn.dataset.action === "plus") {
    cart[ticket.nama]++;
    render();
  } else if (btn.dataset.action === "minus") {
    if (ticket.minimal && cart[ticket.nama] <= 2) {
      cart[ticket.nama] = 0;
      document.getElementById("q" + index).style.display = "none";
      document.getElementById("s" + index).style.display = "inline-block";
    } else {
      cart[ticket.nama]--;
      if (cart[ticket.nama] <= 0) {
        cart[ticket.nama] = 0;
        document.getElementById("q" + index).style.display = "none";
        document.getElementById("s" + index).style.display = "inline-block";
      }
    }
    render();
  }
});

/* =====================================================
   RENDER SUMMARY
==================================================== */
function render() {
  let totalQty = 0;
  let totalPrice = 0;
  const items = [];

  ticketList.forEach((item, index) => {
    const qty = cart[item.nama];
    document.getElementById("n" + index).textContent = qty;
    if (qty > 0) {
      totalQty += qty;
      totalPrice += qty * item.harga;
      items.push({
        jenis: item.nama,
        jumlah: qty,
        harga: item.harga,
        subtotal: qty * item.harga
      });
    }
  });

  document.getElementById("qtyText").textContent = totalQty + " Tiket Dipilih";
  document.getElementById("totalText").textContent = rupiah(totalPrice);
  document.getElementById("checkout").disabled = totalQty === 0;

  localStorage.setItem(
    "etatix_cart",
    JSON.stringify({
      event: "Sunset di Kebun 2026",
      items: items,
      totalQty: totalQty,
      totalPrice: totalPrice
    })
  );
}

/* =====================================================
   CHECKOUT NAVIGASI
==================================================== */
document.getElementById("checkout").addEventListener("click", function () {
  const cartData = JSON.parse(localStorage.getItem("etatix_cart"));
  if (!cartData || cartData.totalQty === 0) {
    alert("Silakan pilih tiket terlebih dahulu.");
    return;
  }
  location.href = "form.html";
});

/* =====================================================
   SCROLL REVEAL
==================================================== */
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
grid.querySelectorAll(".fade-up").forEach((item) => observer.observe(item));

/* INIT */
render();
