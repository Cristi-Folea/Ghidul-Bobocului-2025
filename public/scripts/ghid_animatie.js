//Referinte:
console.log("Este incarcat ghid_animatie.js");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

//Event Listener
prevBtn.addEventListener("click", () => animatie(-1));
nextBtn.addEventListener("click", () => animatie(1));

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

//Initializare o data:
for (let i = number_of_pages; i >= 1; i--) {
  pages[i] = document.getElementById(`page${i}`);
  pages[i].style.zIndex = `${number_of_pages - i + 1}`;

  if (i > current_page - visible_pages && i < current_page + visible_pages) {
    load_page(pages[i]);
  } /* else {
    unload_page(pages[i]);
  } */
}

function load_page(page) {
  console.log("E in load_page()");
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
  console.log("E in unload_page()");
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

function openBook() {
  prevBtn.style.transform = "translateX(-180px)";
  nextBtn.style.transform = "translateX(180px)";
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

function animatie(stanga_dreapta, var_load_page = true) {
  if (stanga_dreapta === -1) {
    if (current_page === 1) return;

    if (current_page === number_of_pages + 1) {
      book.style.transform = "translateX(50%)";
      prevBtn.style.transform = "translateX(-180px)";
      /* nextBtn.style.transform = "translateX(180px)"; */
      nextBtn.style.display = "inline-block";
    }

    current_page--;
    /* prevBtn.style.display = current_page === 4 ? "none" : "inline"; */

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
    //Urmatoarea pagina
    if (current_page === number_of_pages + 1) return;

    pages[current_page].classList.add("flipped");
    pages[current_page].style.zIndex = `${next_zindex}`;
    next_zindex++;

    if (current_page === 1) {
      openBook();
      book.style.transform = "translateX(50%)";
      /* prevBtn.style.display = "inline"; */
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
    /* prevBtn.style.display = current_page === 4 ? "none" : "inline"; */

    if (current_page === number_of_pages + 1) {
      book.style.transform = "translateX(100%)";
      nextBtn.style.display = "none";
      prevBtn.style.transform = "translateX(0px)";
    }
  }
}
