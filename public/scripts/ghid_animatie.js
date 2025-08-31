console.log("Este incarcat ghid_animatie.js");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");
const cuprinsBtn = document.querySelector("#cuprins-btn");

//Event Listener
prevBtn.addEventListener("click", () => animatie(-1));
nextBtn.addEventListener("click", () => animatie(1));
document.querySelector("#cuprins-btn").addEventListener("click", () => {
  go_to_page(4);
});

let canFlip = true;
const flipCooldown = 180; // ms

document.addEventListener("keydown", (event) => {
  if (!canFlip) return;

  if (event.key === "ArrowLeft") {
    animatie(-1);
    canFlip = false;
    setTimeout(() => (canFlip = true), flipCooldown);
  } else if (event.key === "ArrowRight") {
    animatie(1);
    canFlip = false;
    setTimeout(() => (canFlip = true), flipCooldown);
  }
});

//Configurare
let number_of_pages = 44;
let visible_pages = 6;

let current_page = 1;
let pages = [];
let next_zindex = number_of_pages;

// === Utilitare ===
function getBookWidth() {
  const width = getComputedStyle(document.documentElement).getPropertyValue(
    "--book-width"
  );
  return parseInt(width); // ex: "396px" → 396
}

//Initializare o data:
for (let i = number_of_pages; i >= 1; i--) {
  pages[i] = document.getElementById(`page${i}`);
  pages[i].style.zIndex = `${number_of_pages - i + 1}`;

  if (i > current_page - visible_pages && i < current_page + visible_pages) {
    load_page(pages[i]);
  }
}

function load_page(page) {
  page.classList.add("loaded");

  const imgs = page.querySelectorAll("img");
  const front_img = imgs[0];
  const back_img = imgs[1];

  if (front_img && front_img.dataset.src) {
    front_img.src = front_img.dataset.src;
    front_img.removeAttribute("data-src");

    if (back_img && back_img.dataset.src) {
      back_img.src = back_img.dataset.src;
      back_img.removeAttribute("data-src");
    }
  }
}

function unload_page(page) {
  page.classList.remove("loaded");

  const imgs = page.querySelectorAll("img");
  const front_img = imgs[0];
  const back_img = imgs[1];

  if (front_img && !front_img.dataset.src) {
    front_img.dataset.src = front_img.src;
    front_img.src = "";
  }
  if (back_img && !back_img.dataset.src) {
    back_img.dataset.src = back_img.src;
    back_img.src = "";
  }
}

// === Deschidere / Închidere carte ===
function openBook() {
  const halfWidth = getBookWidth() / 2;
  prevBtn.style.transform = `translateX(-${halfWidth}px)`;
  nextBtn.style.transform = `translateX(${halfWidth}px)`;
}

function closeBook() {
  if (isAtBeginning) {
    book.style.transform = "translateX(0%)";
  } else {
    book.style.transform = "translateX(100%)";
  }

  prevBtn.style.transform = "translateX(0px)";
  nextBtn.style.transform = "translateX(0px)";
}

// === Animatie pagini ===
function animatie(stanga_dreapta, var_load_page = true) {
  const halfWidth = getBookWidth() / 2;

  if (stanga_dreapta === -1) {
    // Înapoi
    if (current_page === 1) return;

    if (current_page === number_of_pages + 1) {
      book.style.transform = `translateX(${halfWidth}px)`;
      prevBtn.style.transform = `translateX(-${halfWidth}px)`;
      nextBtn.style.display = "inline-block";
    }

    current_page--;

    if (current_page === 1) {
      book.style.transform = "translateX(0%)";
      prevBtn.style.display = "none";
      nextBtn.style.transform = "translateX(0px)";
    }

    pages[current_page].classList.remove("flipped");
    pages[current_page].style.zIndex = `${next_zindex}`;
    next_zindex++;

    if (var_load_page) {
      if (current_page - visible_pages >= 1) {
        load_page(pages[current_page - visible_pages]);
      }
      if (current_page + visible_pages <= number_of_pages) {
        unload_page(pages[current_page + visible_pages]);
      }
    }
  } else {
    // Înainte
    if (current_page === number_of_pages + 1) return;

    pages[current_page].classList.add("flipped");
    pages[current_page].style.zIndex = `${next_zindex}`;
    next_zindex++;

    if (current_page === 1) {
      openBook();
      book.style.transform = `translateX(${halfWidth}px)`;
      prevBtn.style.display = "inline-block";
    }

    if (var_load_page) {
      if (current_page - visible_pages >= 1) {
        unload_page(pages[current_page - visible_pages]);
      }
      if (current_page + visible_pages <= number_of_pages) {
        load_page(pages[current_page + visible_pages]);
      }
    }

    current_page++;

    if (current_page === number_of_pages + 1) {
      book.style.transform = "translateX(100%)";
      nextBtn.style.display = "none";
      prevBtn.style.transform = "translateX(0px)";
    }
  }

  if (current_page === 4) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "inline-block";
  }

  cuprinsBtn.style.left = current_page <= 3 ? "10px" : "-110px";
}

async function go_to_page(pageNumber) {
  const directie = current_page < pageNumber ? 1 : -1;

  if (Math.abs(current_page - pageNumber) < visible_pages)
    _go_to_page(pageNumber);
  else {
    // load pagini din jurul destinatiei
    load_page(pages[pageNumber - 1]);
    load_page(pages[pageNumber]);
    load_page(pages[pageNumber + 1]);

    // parcurge paginile incarcate fara a incarca altele
    await _go_to_page(current_page + visible_pages * directie, false);

    while (directie * current_page < directie * pageNumber)
      animatie(directie, false);

    await new Promise((resolve) => setTimeout(resolve, 500));

    // load all pages
    for (let i = 1; i <= number_of_pages; i++) {
      if (i > current_page - visible_pages && i < current_page + visible_pages)
        load_page(pages[i]);
      else unload_page(pages[i]);
    }
  }
}

async function _go_to_page(pageNumber, load_pages = true) {
  // daca trebuie sa mearga mai putin de 6 de pagini se misca mai incet
  const flipDelay = Math.abs(pageNumber - current_page) < 6 ? 100 : 80;

  async function flip() {
    if (current_page !== pageNumber) {
      animatie(current_page < pageNumber ? 1 : -1, load_pages);
      await new Promise((resolve) => setTimeout(resolve, flipDelay));
      return flip();
    }
  }

  await flip();
}

window.go_to_page = go_to_page;
window.animatie = animatie;
