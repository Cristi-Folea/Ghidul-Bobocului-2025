var prevButtonNarrow = document.getElementById("prev-narrow");
var nextButtonNarrow = document.getElementById("next-narrow");

var numberOfPagesNarrow = 88;
var currentPageNarrow = 1;
var visiblePagesNarrow = 6;

var pagesNarrow = [];

document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.getElementById("prev-narrow");
  const nextBtn = document.getElementById("next-narrow");
  const cuprinsBtn = document.getElementById("buton-cuprins-narrow");
  const rightArrow = document.querySelector(".right-arrow");
  const leftArrow = document.querySelector(".left-arrow");

  prevBtn?.addEventListener("click", () => animatieNarrow(-1));
  nextBtn?.addEventListener("click", () => animatieNarrow(1));
  cuprinsBtn?.addEventListener("click", () => goToPageNarrow(6));
  rightArrow?.addEventListener("click", () => animatieNarrow(1));
  leftArrow?.addEventListener("click", () => animatieNarrow(-1));
});

function loadPageNarrow(page) {
  page.classList.add("active");

  const img = page.querySelector("img");

  if (img && img.dataset.src) {
    img.src = img.dataset.src;
    img.removeAttribute("data-src");
  }
}

function unloadPageNarrow(page) {
  page.classList.remove("active");

  const img = page.querySelector("img");

  if (img && !img.dataset.src) {
    img.dataset.src = img.src;
    img.src = "";
  }
}

/* for (let i = numberOfPagesNarrow; i >= 1; i--) {
  pagesNarrow[i] = document.getElementById(`page${i}-narrow`);
  pagesNarrow[i].style.zIndex = `${numberOfPagesNarrow - i + 1}`;

  if (
    i > currentPageNarrow - visiblePagesNarrow &&
    i < currentPageNarrow + visiblePagesNarrow
  )
    loadPageNarrow(pagesNarrow[i]);
} */

for (let i = 1; i <= numberOfPagesNarrow; i++) {
  const page = document.getElementById(`page${i}-narrow`);
  if (!page) continue; // dacă pagina nu există în DOM, sari peste

  pagesNarrow[i] = page;
  page.style.zIndex = `${numberOfPagesNarrow - i + 1}`;

  // Încarcă doar paginile din bufferul vizibil, dar asigură-te că nu depășești limitele
  if (
    i >= Math.max(1, currentPageNarrow - visiblePagesNarrow) &&
    i <= Math.min(numberOfPagesNarrow, currentPageNarrow + visiblePagesNarrow)
  ) {
    loadPageNarrow(page);
  } else {
    unloadPageNarrow(page);
  }
}

function animatieNarrow(id, loadPages = true) {
  if (id === -1) {
    // previous page

    if (currentPageNarrow === 1) {
      console.log("Inceput carte");
      return;
    }

    pagesNarrow[--currentPageNarrow].classList.remove("flipped");

    if (loadPages) {
      if (currentPageNarrow - visiblePagesNarrow >= 1)
        loadPageNarrow(pagesNarrow[currentPageNarrow - visiblePagesNarrow]);

      if (currentPageNarrow + visiblePagesNarrow <= numberOfPagesNarrow)
        unloadPageNarrow(pagesNarrow[currentPageNarrow + visiblePagesNarrow]);
    }
  } else {
    // next page

    if (currentPageNarrow === numberOfPagesNarrow) {
      console.log("Sfarsit carte");
      return;
    }

    if (loadPages) {
      if (currentPageNarrow - visiblePagesNarrow >= 1)
        unloadPageNarrow(pagesNarrow[currentPageNarrow - visiblePagesNarrow]);

      if (currentPageNarrow + visiblePagesNarrow <= numberOfPagesNarrow)
        loadPageNarrow(pagesNarrow[currentPageNarrow + visiblePagesNarrow]);
    }

    pagesNarrow[currentPageNarrow++].classList.add("flipped");
  }

  /* prevButtonNarrow.style.display = nextButtonNarrow.style.display =
    currentPageNarrow === 6 ? "none" : "inline"; */
}

/* 
function animatieNarrow(id, loadPages = true) {
  console.log("===== animatieNarrow called =====");
  console.log("Direction:", id === -1 ? "prev" : "next");
  console.log("Current page before:", currentPageNarrow);

  if (id === -1) {
    // previous page
    if (currentPageNarrow === 1) {
      console.log("Already at first page, cannot go back.");
      return;
    }

    currentPageNarrow--;
    console.log("Going to previous page:", currentPageNarrow);

    pagesNarrow[currentPageNarrow].classList.remove("flipped");

    if (loadPages) {
      if (currentPageNarrow - visiblePagesNarrow >= 1) {
        console.log("Loading page:", currentPageNarrow - visiblePagesNarrow);
        loadPageNarrow(pagesNarrow[currentPageNarrow - visiblePagesNarrow]);
      }

      if (currentPageNarrow + visiblePagesNarrow <= numberOfPagesNarrow) {
        console.log("Unloading page:", currentPageNarrow + visiblePagesNarrow);
        unloadPageNarrow(pagesNarrow[currentPageNarrow + visiblePagesNarrow]);
      }
    }
  } else {
    // next page
    if (currentPageNarrow === numberOfPagesNarrow) {
      console.log("Already at last page, cannot go forward.");
      return;
    }

    if (loadPages) {
      if (currentPageNarrow - visiblePagesNarrow >= 1) {
        console.log("Unloading page:", currentPageNarrow - visiblePagesNarrow);
        unloadPageNarrow(pagesNarrow[currentPageNarrow - visiblePagesNarrow]);
      }

      if (currentPageNarrow + visiblePagesNarrow <= numberOfPagesNarrow) {
        console.log("Loading page:", currentPageNarrow + visiblePagesNarrow);
        loadPageNarrow(pagesNarrow[currentPageNarrow + visiblePagesNarrow]);
      }
    }

    console.log("Flipping page:", currentPageNarrow);
    pagesNarrow[currentPageNarrow].classList.add("flipped");
    currentPageNarrow++;
  }

  console.log("Current page after:", currentPageNarrow);

  // Actualizare vizibilitate butoane
  console.log(
    "Prev button display:",
    currentPageNarrow === 1 ? "none" : "inline"
  );
  console.log(
    "Next button display:",
    currentPageNarrow === numberOfPagesNarrow ? "none" : "inline"
  );

  prevButtonNarrow.style.display = currentPageNarrow === 1 ? "none" : "inline";
  nextButtonNarrow.style.display =
    currentPageNarrow === numberOfPagesNarrow ? "none" : "inline";
} */

async function goToPageNarrow(pageNumber) {
  const directie = currentPageNarrow < pageNumber ? 1 : -1;

  if (Math.abs(currentPageNarrow - pageNumber) < visiblePagesNarrow)
    _goToPageNarrow(pageNumber);
  else {
    loadPageNarrow(pagesNarrow[pageNumber]);

    await new Promise((resolve) => setTimeout(resolve, 100));

    _goToPageNarrow(pageNumber, false);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    for (let i = 1; i <= numberOfPagesNarrow; i++) {
      if (
        i > currentPageNarrow - visiblePagesNarrow &&
        i < currentPageNarrow + visiblePagesNarrow
      )
        loadPageNarrow(pagesNarrow[i]);
      else unloadPageNarrow(pagesNarrow[i]);
    }
  }
}

function _goToPageNarrow(pageNumber, loadPages = true) {
  while (currentPageNarrow !== pageNumber)
    animatieNarrow(currentPageNarrow < pageNumber ? 1 : -1, loadPages);
}
