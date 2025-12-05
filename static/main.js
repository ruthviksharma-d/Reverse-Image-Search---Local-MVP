// static/main.js
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const search = document.getElementById("search");
  const status = document.getElementById("status");

  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalMainImg = document.getElementById("modal-main-img");
  const similarList = document.getElementById("similarList");
  const modalFname = document.getElementById("modal-fname");
  const loader = document.getElementById("loader");
  const closeModalBtn = document.getElementById("closeModal");

  // filter gallery by filename
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
      const name = card.dataset.fname.toLowerCase();
      card.style.display = (!q || name.includes(q)) ? "flex" : "none";
    });
  });

  // click on image card
  gallery.addEventListener("click", (ev) => {
    const card = ev.target.closest(".card");
    if (!card) return;
    openModalFor(card.dataset.fname);
  });

  // keyboard activation for accessibility
  gallery.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" || ev.key === " ") {
      const card = ev.target.closest(".card");
      if (card) openModalFor(card.dataset.fname);
      ev.preventDefault();
    }
  });

  // open modal & fetch similar
  async function openModalFor(fname) {
    modalBackdrop.style.display = "flex";
    modalBackdrop.setAttribute("aria-hidden", "false");
    modalMainImg.src = "/images/" + fname;
    modalFname.textContent = fname;
    similarList.innerHTML = "";
    loader.style.display = "block";
    status.textContent = `Searching similar to "${fname}"...`;

    try {
      const resp = await fetch("/find_similar", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ filename: fname, k: 6 })
      });

      if (!resp.ok) {
        throw new Error("Server error");
      }
      const data = await resp.json();
      loader.style.display = "none";
      status.textContent = `Showing results for "${fname}"`;

      const sims = data.similar || [];
      if (!sims.length) {
        similarList.innerHTML = `<div style="color:var(--muted)">No similar images found.</div>`;
        return;
      }

      sims.forEach(s => {
        const img = document.createElement("img");
        img.src = "/images/" + s;
        img.alt = s;
        img.loading = "lazy";
        img.tabIndex = 0;
        img.addEventListener("click", () => {
          // clicking a similar image replaces the modal with that image's results
          openModalFor(s);
        });
        similarList.appendChild(img);
      });
    } catch (err) {
      loader.style.display = "none";
      status.textContent = `Error searching: ${err.message}`;
      similarList.innerHTML = `<div style="color:var(--muted)">Request failed.</div>`;
    }
  }

  // close modal
  function closeModal(){
    modalBackdrop.style.display = "none";
    modalBackdrop.setAttribute("aria-hidden", "true");
    similarList.innerHTML = "";
    loader.style.display = "none";
  }

  closeModalBtn.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (ev) => {
    if (ev.target === modalBackdrop) closeModal();
  });
  window.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") closeModal();
  });
});
