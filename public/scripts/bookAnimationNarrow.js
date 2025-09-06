// Rulează de fiecare dată când se încarcă pagina (inclusiv cu view transitions)
document.addEventListener("astro:page-load", initializeNarrowBook);

function initializeNarrowBook() {
  console.log("Initializez cartea narrow...");

  const prevBtn = document.getElementById("prev-narrow");
  const nextBtn = document.getElementById("next-narrow");
  const cuprinsBtn = document.getElementById("buton-cuprins-narrow");
  const rightArrow = document.querySelector(".right-arrow");
  const leftArrow = document.querySelector(".left-arrow");

  // Dacă nu sunt pe pagina cu cartea narrow, ieși
  if (!prevBtn || !nextBtn) {
    return;
  }

  // Configurare
  let numberOfPagesNarrow = 44;
  let currentPageNarrow = 1;
  let visiblePagesNarrow = 6;
  let pagesNarrow = [];

  // Event Listeners
  prevBtn.addEventListener("click", () => animatieNarrow(-1));
  nextBtn.addEventListener("click", () => animatieNarrow(1));
  cuprinsBtn?.addEventListener("click", () => goToPageNarrow(5));
  rightArrow?.addEventListener("click", () => animatieNarrow(1));
  leftArrow?.addEventListener("click", () => animatieNarrow(-1));

  function loadPageNarrow(page) {
    if (!page) return;
    page.classList.add("active");

    const img = page.querySelector("img");

    if (img && img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    }
  }

  function unloadPageNarrow(page) {
    if (!page) return;
    page.classList.remove("active");

    const img = page.querySelector("img");

    if (img && !img.dataset.src) {
      img.dataset.src = img.src;
      img.src = "";
    }
  }

  // Inițializare pagini
  for (let i = 1; i <= numberOfPagesNarrow; i++) {
    const page = document.getElementById(`page${i}-narrow`);
    if (!page) continue;

    pagesNarrow[i] = page;
    page.style.zIndex = `${numberOfPagesNarrow - i + 1}`;

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

    prevBtn.style.display = nextBtn.style.display =
      currentPageNarrow === 5 ? "none" : "inline";
  }

  async function goToPageNarrow(pageNumber) {
    const directie = currentPageNarrow < pageNumber ? 1 : -1;

    if (Math.abs(currentPageNarrow - pageNumber) < visiblePagesNarrow) {
      _goToPageNarrow(pageNumber);
    } else {
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

  // Export global pentru debugging
  window.goToPageNarrow = goToPageNarrow;
  window.animatieNarrow = animatieNarrow;
}
