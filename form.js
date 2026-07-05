"use strict";

/* =====================================================
   HELPER
===================================================== */
function rupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

/* =====================================================
   AMBIL DATA CART
==================================================== */
const cart = JSON.parse(
  localStorage.getItem("etatix_cart") || '{"items":[],"totalQty":0,"totalPrice":0}'
);

if (!cart.items || cart.items.length === 0) {
  alert("Tidak ada tiket yang dipilih.");
  window.location.href = "tiket.html";
}

/* =====================================================
   ISI RINGKASAN
==================================================== */
document.getElementById("summaryQty").textContent = cart.totalQty;
document.getElementById("summarySubtotal").textContent = rupiah(cart.totalPrice);
document.getElementById("grandTotal").textContent = rupiah(cart.totalPrice);
document.getElementById("footerTotal").textContent = rupiah(cart.totalPrice);

const summaryItems = document.getElementById("summaryItems");
cart.items.forEach(function (item) {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = '<span>' + item.jenis + ' &times; ' + item.jumlah + '</span><strong>' + rupiah(item.harga * item.jumlah) + '</strong>';
  summaryItems.appendChild(row);
});

/* =====================================================
   PEMEGANG TIKET TAMBAHAN
==================================================== */
const holderBox = document.getElementById("ticketHolders");

if (cart.totalQty > 1) {
  for (let i = 2; i <= cart.totalQty; i++) {
    let optionsHtml = '<option value="">Pilih Jenis Tiket</option>';
    cart.items.forEach(function (x) {
      optionsHtml += '<option>' + x.jenis + '</option>';
    });

    const div = document.createElement("div");
    div.className = "ticket-holder";
    div.innerHTML =
      '<h4>Pemegang Tiket ' + i + '</h4>' +
      '<label for="holderName' + i + '">Nama Lengkap <span class="required">*</span></label>' +
      '<input type="text" class="holderName" id="holderName' + i + '" placeholder="Masukkan nama lengkap" autocomplete="name">' +
      '<label for="holderType' + i + '">Jenis Tiket <span class="required">*</span></label>' +
      '<select class="holderType" id="holderType' + i + '">' + optionsHtml + '</select>';
    holderBox.appendChild(div);
  }
} else {
  holderBox.innerHTML = '<div style="color:var(--text-muted);font-size:14px;">Pembeli merupakan pemegang tiket.</div>';
}

/* =====================================================
   CHECKBOX TOGGLE
==================================================== */
const agree = document.getElementById("setuju");
const btn = document.getElementById("checkoutBtn");
agree.addEventListener("change", function () {
  btn.disabled = !this.checked;
});

/* =====================================================
   VALIDASI
==================================================== */
function validasi() {
  const wajib = ["nama", "identitas", "nomorId", "email", "wa", "alamat"];
  for (let i = 0; i < wajib.length; i++) {
    const el = document.getElementById(wajib[i]);
    if (!el.value.trim()) {
      alert("Mohon lengkapi seluruh data.");
      el.focus();
      return false;
    }
  }

  const emailVal = document.getElementById("email").value;
  if (!/^\S+@\S+\.\S+$/.test(emailVal)) {
    alert("Format email tidak valid.");
    document.getElementById("email").focus();
    return false;
  }

  const waVal = document.getElementById("wa").value.trim();
  if (!/^8[0-9]{8,13}$/.test(waVal)) {
    alert("Nomor WhatsApp tidak valid.\nGunakan format: 81234567890");
    document.getElementById("wa").focus();
    return false;
  }

  const holderNames = document.querySelectorAll(".holderName");
  const holderTypes = document.querySelectorAll(".holderType");
  for (let j = 0; j < holderNames.length; j++) {
    if (!holderNames[j].value.trim()) {
      alert("Lengkapi nama pemegang tiket.");
      holderNames[j].focus();
      return false;
    }
    if (!holderTypes[j].value) {
      alert("Pilih jenis tiket untuk pemegang tiket.");
      holderTypes[j].focus();
      return false;
    }
  }

  if (!agree.checked) {
    alert("Anda harus menyetujui syarat dan ketentuan.");
    return false;
  }

  return true;
}

/* =====================================================
   SIMPAN DATA & NAVIGASI
==================================================== */
btn.addEventListener("click", function () {
  if (!validasi()) return;

  const holders = [];
  document.querySelectorAll(".ticket-holder").forEach(function (card) {
    const namaEl = card.querySelector(".holderName");
    const jenisEl = card.querySelector(".holderType");
    if (namaEl && jenisEl) {
      holders.push({ nama: namaEl.value, jenis: jenisEl.value });
    }
  });

  const order = {
    nama: document.getElementById("nama").value,
    identitas: document.getElementById("identitas").value,
    nomorIdentitas: document.getElementById("nomorId").value,
    email: document.getElementById("email").value,
    kodeNegara: document.getElementById("kodeNegara").value,
    wa: document.getElementById("wa").value,
    alamat: document.getElementById("alamat").value,
    ticketHolder: holders,
    cart: cart
  };

  localStorage.setItem("etatix_order", JSON.stringify(order));

  document.getElementById("formLoading").style.display = "flex";
  setTimeout(function () {
    window.location.href = "qris.html";
  }, 1500);
});
