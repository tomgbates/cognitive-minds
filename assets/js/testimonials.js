/* =========================================================
   COGNITIVE MINDS V2
   TESTIMONIALS

   DATA SOURCE:
   assets/data/testimonials/index.json

   PURPOSE:
   - Load testimonial JSON files
   - Render featured parent testimonial slider
   - Render three early homepage student highlights
   - Render student snap carousel
   - Render all-testimonials page grid + filters
   - Create full-testimonial modal
========================================================= */


/* =========================================================
   01. PAGE ELEMENTS
========================================================= */

const testimonialTrack =
  document.querySelector("#testimonial-track");

const testimonialCarousel =
  document.querySelector("#student-testimonial-carousel");

const testimonialPrevButton =
  document.querySelector("#testimonial-prev");

const testimonialNextButton =
  document.querySelector("#testimonial-next");

const featuredParentMount =
  document.querySelector("#featured-parent-testimonial");

const homepageHighlightsMount =
  document.querySelector("#homepage-testimonial-highlights");

const allTestimonialsMount =
  document.querySelector("#all-testimonials-grid");

const testimonialFilterButtons =
  document.querySelectorAll("[data-testimonial-filter]");


/* =========================================================
   02. MODAL ELEMENTS
========================================================= */

const testimonialModal =
  document.querySelector("#testimonial-modal");

const testimonialModalBackdrop =
  testimonialModal?.querySelector(".testimonial-modal-backdrop");

const testimonialModalClose =
  testimonialModal?.querySelector(".testimonial-modal-close");

const testimonialModalType =
  document.querySelector("#testimonial-modal-type");

const testimonialModalName =
  document.querySelector("#testimonial-modal-name");

const testimonialModalText =
  document.querySelector("#testimonial-modal-text");

let lastFocusedElement = null;


/* =========================================================
   03. LOAD TESTIMONIAL DATA
========================================================= */

async function loadTestimonials() {
  try {
    const indexResponse =
      await fetch("assets/data/testimonials/index.json");

    if (!indexResponse.ok) {
      throw new Error("Could not load testimonials/index.json");
    }

    const testimonialFiles =
      await indexResponse.json();

    const requests = testimonialFiles.map(
      async function (fileName) {
        const response =
          await fetch(`assets/data/testimonials/${fileName}`);

        if (!response.ok) {
          throw new Error(`Could not load testimonial: ${fileName}`);
        }

        return response.json();
      }
    );

    const testimonials =
      await Promise.all(requests);

    const activeTestimonials =
      testimonials.filter(
        function (testimonial) {
          return testimonial.active !== false;
        }
      );

    renderParentTestimonial(activeTestimonials);
    renderHomepageHighlights(activeTestimonials);
    renderStudentTestimonials(activeTestimonials);
    renderAllTestimonials(activeTestimonials);

    console.log(
      "Testimonials loaded successfully:",
      activeTestimonials
    );
  } catch (error) {
    console.error(
      "Error loading testimonials:",
      error
    );
  }
}


/* =========================================================
   04. TESTIMONIAL TYPE HELPERS
========================================================= */

function isParentTestimonial(testimonial) {
  return String(testimonial.type || "")
    .toLowerCase()
    .includes("parent");
}

function isStudentTestimonial(testimonial) {
  return String(testimonial.type || "")
    .toLowerCase()
    .includes("student");
}


/* =========================================================
   05. FEATURED PARENT TESTIMONIAL SLIDER
========================================================= */

function renderParentTestimonial(testimonials) {
  if (!featuredParentMount) {
    return;
  }

  let parents = testimonials.filter(
    function (testimonial) {
      return (
        isParentTestimonial(testimonial) &&
        testimonial.featured === true
      );
    }
  );

  if (parents.length === 0) {
    parents = testimonials.filter(isParentTestimonial);
  }

  if (parents.length === 0) {
    featuredParentMount.innerHTML = "";
    return;
  }

  featuredParentMount.innerHTML = "";

  const slider = document.createElement("div");
  slider.className = "parent-testimonial-slider";

  const track = document.createElement("div");
  track.className = "parent-testimonial-track";

  parents.forEach(
    function (parent) {
      const slide = document.createElement("div");
      slide.className = "parent-testimonial-slide";

      const card = document.createElement("article");
      card.className = "parent-testimonial-card";

      const quoteSide = document.createElement("div");
      const quote = document.createElement("p");
      quote.className = "parent-testimonial-quote";

      const quoteText =
        parent.homepageExcerpt ||
        createParentPreview(parent.testimonial);

      quote.textContent = `“${quoteText}”`;
      quoteSide.appendChild(quote);

      const detailsSide = document.createElement("div");

      const meta = document.createElement("div");
      meta.className = "parent-testimonial-meta";

      const name = document.createElement("strong");
      name.textContent = parent.name || "";

      const type = document.createElement("span");
      type.textContent = parent.type || "";

      meta.appendChild(name);
      meta.appendChild(type);

      const readMore = document.createElement("button");
      readMore.type = "button";
      readMore.className = "testimonial-read-more";
      readMore.textContent = "Read full testimonial";

      readMore.addEventListener(
        "click",
        function () {
          openTestimonialModal(parent, readMore);
        }
      );

      detailsSide.appendChild(meta);
      detailsSide.appendChild(readMore);

      card.appendChild(quoteSide);
      card.appendChild(detailsSide);

      slide.appendChild(card);
      track.appendChild(slide);
    }
  );

  slider.appendChild(track);

  if (parents.length > 1) {
    const controls = document.createElement("div");
    controls.className = "parent-testimonial-controls";

    const previousButton = document.createElement("button");
    previousButton.type = "button";
    previousButton.className = "parent-testimonial-arrow";
    previousButton.setAttribute(
      "aria-label",
      "Previous parent testimonial"
    );
    previousButton.textContent = "←";

    const dots = document.createElement("div");
    dots.className = "parent-testimonial-dots";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "parent-testimonial-arrow";
    nextButton.setAttribute(
      "aria-label",
      "Next parent testimonial"
    );
    nextButton.textContent = "→";

    let currentParentIndex = 0;
    const dotButtons = [];

    parents.forEach(
      function (parent, index) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "parent-testimonial-dot";
        dot.setAttribute(
          "aria-label",
          `Show testimonial from ${parent.name}`
        );

        dot.addEventListener(
          "click",
          function () {
            goToParent(index);
          }
        );

        dots.appendChild(dot);
        dotButtons.push(dot);
      }
    );

    function updateParentDots() {
      dotButtons.forEach(
        function (dot, index) {
          dot.classList.toggle(
            "is-active",
            index === currentParentIndex
          );
        }
      );
    }

    function goToParent(index) {
      currentParentIndex =
        (index + parents.length) % parents.length;

      track.scrollTo({
        left: track.clientWidth * currentParentIndex,
        behavior: "smooth"
      });

      updateParentDots();
    }

    previousButton.addEventListener(
      "click",
      function () {
        goToParent(currentParentIndex - 1);
      }
    );

    nextButton.addEventListener(
      "click",
      function () {
        goToParent(currentParentIndex + 1);
      }
    );

    let parentScrollTimer;

    track.addEventListener(
      "scroll",
      function () {
        clearTimeout(parentScrollTimer);

        parentScrollTimer = setTimeout(
          function () {
            currentParentIndex = Math.round(
              track.scrollLeft / track.clientWidth
            );

            currentParentIndex = Math.max(
              0,
              Math.min(
                currentParentIndex,
                parents.length - 1
              )
            );

            updateParentDots();
          },
          80
        );
      }
    );

    controls.appendChild(previousButton);
    controls.appendChild(dots);
    controls.appendChild(nextButton);

    slider.appendChild(controls);
    updateParentDots();
  }

  featuredParentMount.appendChild(slider);
}


/* =========================================================
   06. CREATE SHORT PARENT PREVIEW
========================================================= */

function createParentPreview(testimonialText) {
  if (!testimonialText) {
    return "";
  }

  const paragraphs = testimonialText
    .trim()
    .split(/\n\s*\n/);

  const firstParagraph = paragraphs[0]
    .replace(/\s+/g, " ")
    .trim();

  const maximumLength = 420;

  if (firstParagraph.length <= maximumLength) {
    return firstParagraph;
  }

  const shortened = firstParagraph.slice(0, maximumLength);
  const lastSpace = shortened.lastIndexOf(" ");

  return (
    shortened.slice(0, lastSpace).trim() + "…"
  );
}


/* =========================================================
   07. EARLY HOMEPAGE STUDENT HIGHLIGHTS
========================================================= */

function renderHomepageHighlights(testimonials) {
  if (!homepageHighlightsMount) {
    return;
  }

  const highlights = testimonials
    .filter(
      function (testimonial) {
        return (
          isStudentTestimonial(testimonial) &&
          testimonial.homepageHighlight === true
        );
      }
    )
    .sort(
      function (a, b) {
        return (
          (a.homepageHighlightOrder ?? 999) -
          (b.homepageHighlightOrder ?? 999)
        );
      }
    )
    .slice(0, 3);

  homepageHighlightsMount.innerHTML = "";

  if (highlights.length === 0) {
    const section =
      homepageHighlightsMount.closest(".homepage-proof");

    if (section) {
      section.hidden = true;
    }

    return;
  }

  highlights.forEach(
    function (testimonial, index) {
      homepageHighlightsMount.appendChild(
        createHomepageHighlightCard(
          testimonial,
          index
        )
      );
    }
  );
}

function createHomepageHighlightCard(
  testimonial,
  index
) {
  const card = document.createElement("article");
  card.className = "homepage-proof-card";

  if (index === 1) {
    card.classList.add("homepage-proof-card-pink");
  }

  const label = document.createElement("span");
  label.className = "homepage-proof-label";
  label.textContent =
    testimonial.homepageLabel || "Student Experience";

  const quote = document.createElement("p");
  quote.className = "homepage-proof-quote";
  quote.textContent =
    `“${testimonial.homepageSnippet || testimonial.testimonial || ""}”`;

  const person = document.createElement("div");
  person.className = "homepage-proof-person";

  const name = document.createElement("strong");
  name.textContent = testimonial.name || "";

  const type = document.createElement("span");
  type.textContent = testimonial.type || "Student";

  person.appendChild(name);
  person.appendChild(type);

  const readMore = document.createElement("button");
  readMore.type = "button";
  readMore.className = "testimonial-read-more";
  readMore.textContent = "Read full testimonial";

  readMore.addEventListener(
    "click",
    function () {
      openTestimonialModal(
        testimonial,
        readMore
      );
    }
  );

  card.appendChild(label);
  card.appendChild(quote);
  card.appendChild(person);
  card.appendChild(readMore);

  return card;
}


/* =========================================================
   08. STUDENT SNAP CAROUSEL
========================================================= */

function renderStudentTestimonials(testimonials) {
  if (
    !testimonialTrack ||
    !testimonialCarousel
  ) {
    return;
  }

  testimonialTrack.innerHTML = "";

  let students = testimonials.filter(
    function (testimonial) {
      return (
        isStudentTestimonial(testimonial) &&
        testimonial.featured === true
      );
    }
  );

  if (students.length === 0) {
    students = testimonials.filter(isStudentTestimonial);
  }

  if (students.length === 0) {
    testimonialCarousel.style.display = "none";

    if (testimonialPrevButton) {
      testimonialPrevButton.hidden = true;
    }

    if (testimonialNextButton) {
      testimonialNextButton.hidden = true;
    }

    return;
  }

  students.forEach(
    function (testimonial) {
      testimonialTrack.appendChild(
        createTestimonialCard(testimonial)
      );
    }
  );

  requestAnimationFrame(
    function () {
      truncateAllPreviews();
      updateStudentCarouselButtons();
    }
  );
}


/* =========================================================
   09. CREATE STUDENT TESTIMONIAL CARD
========================================================= */

function createTestimonialCard(testimonial) {
  const card = document.createElement("article");
  card.className = "testimonial-card";

  const quoteMark = document.createElement("div");
  quoteMark.className = "testimonial-quote-mark";
  quoteMark.textContent = "“";

  const preview = document.createElement("p");
  preview.className = "testimonial-preview";
  preview.dataset.fullText = testimonial.testimonial || "";
  preview.textContent = testimonial.testimonial || "";

  const person = document.createElement("div");
  person.className = "testimonial-person";

  const name = document.createElement("strong");
  name.textContent = testimonial.name || "";

  const details = document.createElement("span");

  if (testimonial.grade) {
    details.textContent =
      `${testimonial.type} · ${testimonial.grade}`;
  } else {
    details.textContent = testimonial.type || "";
  }

  person.appendChild(name);
  person.appendChild(details);

  const readMore = document.createElement("button");
  readMore.type = "button";
  readMore.className = "testimonial-read-more";
  readMore.textContent = "Read full testimonial";

  readMore.addEventListener(
    "click",
    function () {
      openTestimonialModal(
        testimonial,
        readMore
      );
    }
  );

  card.appendChild(quoteMark);
  card.appendChild(preview);
  card.appendChild(person);
  card.appendChild(readMore);

  return card;
}


/* =========================================================
   10. STUDENT CAROUSEL NAVIGATION
========================================================= */

function getStudentCarouselMetrics() {
  const firstCard =
    testimonialTrack?.querySelector(".testimonial-card");

  if (
    !firstCard ||
    !testimonialCarousel ||
    !testimonialTrack
  ) {
    return null;
  }

  const trackStyles =
    window.getComputedStyle(testimonialTrack);

  const gap =
    parseFloat(trackStyles.columnGap) ||
    parseFloat(trackStyles.gap) ||
    0;

  const cardWidth =
    firstCard.getBoundingClientRect().width;

  const step = cardWidth + gap;

  const visibleCount = Math.max(
    1,
    Math.round(
      (testimonialCarousel.clientWidth + gap) /
      step
    )
  );

  return {
    step,
    visibleCount
  };
}

function moveStudentCarousel(direction) {
  const metrics = getStudentCarouselMetrics();

  if (
    !metrics ||
    !testimonialCarousel
  ) {
    return;
  }

  testimonialCarousel.scrollBy({
    left:
      direction *
      metrics.step *
      metrics.visibleCount,
    behavior: "smooth"
  });
}

function updateStudentCarouselButtons() {
  if (!testimonialCarousel) {
    return;
  }

  const maxScroll = Math.max(
    0,
    testimonialCarousel.scrollWidth -
    testimonialCarousel.clientWidth
  );

  const atStart =
    testimonialCarousel.scrollLeft <= 2;

  const atEnd =
    testimonialCarousel.scrollLeft >=
    maxScroll - 2;

  if (testimonialPrevButton) {
    testimonialPrevButton.disabled = atStart;
    testimonialPrevButton.hidden = maxScroll <= 2;
  }

  if (testimonialNextButton) {
    testimonialNextButton.disabled = atEnd;
    testimonialNextButton.hidden = maxScroll <= 2;
  }
}


testimonialPrevButton?.addEventListener(
  "click",
  function () {
    moveStudentCarousel(-1);
  }
);


testimonialNextButton?.addEventListener(
  "click",
  function () {
    moveStudentCarousel(1);
  }
);


testimonialCarousel?.addEventListener(
  "scroll",
  function () {
    requestAnimationFrame(
      updateStudentCarouselButtons
    );
  },
  { passive: true }
);


/* =========================================================
   11. TESTIMONIAL ELLIPSIS
========================================================= */

function truncatePreview(preview) {
  const fullText = preview.dataset.fullText;

  if (!fullText) {
    return;
  }

  preview.textContent = fullText;
  preview.classList.remove("is-truncated");

  if (
    preview.scrollHeight <=
    preview.clientHeight + 1
  ) {
    return;
  }

  const words =
    fullText.trim().split(/\s+/);

  let lowestFit = 0;
  let highestPossible = words.length;

  while (lowestFit < highestPossible) {
    const middle = Math.ceil(
      (lowestFit + highestPossible) / 2
    );

    preview.textContent =
      words.slice(0, middle).join(" ") + "…";

    const fits =
      preview.scrollHeight <=
      preview.clientHeight + 1;

    if (fits) {
      lowestFit = middle;
    } else {
      highestPossible = middle - 1;
    }
  }

  preview.textContent =
    words.slice(0, lowestFit).join(" ") + "…";

  preview.classList.add("is-truncated");
}

function truncateAllPreviews() {
  if (!testimonialTrack) {
    return;
  }

  const previews =
    testimonialTrack.querySelectorAll(
      ".testimonial-preview"
    );

  previews.forEach(
    function (preview) {
      truncatePreview(preview);
    }
  );
}


/* =========================================================
   12. ALL TESTIMONIALS PAGE GRID + FILTERS
========================================================= */

function renderAllTestimonials(testimonials) {
  if (!allTestimonialsMount) {
    return;
  }

  let currentFilter = "all";

  function drawGrid() {
    allTestimonialsMount.innerHTML = "";

    const filteredTestimonials = testimonials.filter(
      function (testimonial) {
        if (currentFilter === "student") {
          return isStudentTestimonial(testimonial);
        }

        if (currentFilter === "parent") {
          return isParentTestimonial(testimonial);
        }

        return true;
      }
    );

    filteredTestimonials.forEach(
      function (testimonial) {
        allTestimonialsMount.appendChild(
          createAllTestimonialCard(testimonial)
        );
      }
    );
  }

  testimonialFilterButtons.forEach(
    function (button) {
      button.addEventListener(
        "click",
        function () {
          currentFilter =
            button.dataset.testimonialFilter || "all";

          testimonialFilterButtons.forEach(
            function (otherButton) {
              otherButton.classList.toggle(
                "is-active",
                otherButton === button
              );
            }
          );

          drawGrid();
        }
      );
    }
  );

  drawGrid();
}


function createAllTestimonialCard(testimonial) {
  const card = document.createElement("article");
  card.className = "all-testimonial-card";

  const type = document.createElement("p");
  type.className = "all-testimonial-type";
  type.textContent = testimonial.type || "Experience";

  const preview = document.createElement("p");
  preview.className = "all-testimonial-preview";
  preview.textContent = testimonial.testimonial || "";

  const person = document.createElement("div");
  person.className = "all-testimonial-person";

  const name = document.createElement("strong");
  name.textContent = testimonial.name || "";

  const details = document.createElement("span");
  details.textContent = testimonial.grade
    ? `${testimonial.type || ""} · ${testimonial.grade}`
    : (testimonial.type || "");

  person.appendChild(name);
  person.appendChild(details);

  const readMore = document.createElement("button");
  readMore.type = "button";
  readMore.className = "testimonial-read-more";
  readMore.textContent = "Read full testimonial";

  readMore.addEventListener(
    "click",
    function () {
      openTestimonialModal(
        testimonial,
        readMore
      );
    }
  );

  card.appendChild(type);
  card.appendChild(preview);
  card.appendChild(person);
  card.appendChild(readMore);

  return card;
}


/* =========================================================
   13. OPEN TESTIMONIAL MODAL
========================================================= */

function openTestimonialModal(
  testimonial,
  triggerElement
) {
  if (!testimonialModal) {
    return;
  }

  lastFocusedElement = triggerElement;

  testimonialModalType.textContent =
    testimonial.type || "";

  testimonialModalName.textContent =
    testimonial.name || "";

  testimonialModalText.innerHTML = "";

  const paragraphs = String(
    testimonial.testimonial || ""
  )
    .trim()
    .split(/\n\s*\n/);

  paragraphs.forEach(
    function (paragraphText) {
      const paragraph =
        document.createElement("p");

      paragraph.textContent = paragraphText
        .replace(/\s*\n\s*/g, " ")
        .trim();

      testimonialModalText.appendChild(paragraph);
    }
  );

  testimonialModal.classList.add("is-open");
  testimonialModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add("modal-open");
  testimonialModalClose?.focus();
}


/* =========================================================
   14. CLOSE TESTIMONIAL MODAL
========================================================= */

function closeTestimonialModal() {
  if (!testimonialModal) {
    return;
  }

  testimonialModal.classList.remove("is-open");
  testimonialModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove("modal-open");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}


testimonialModalClose?.addEventListener(
  "click",
  closeTestimonialModal
);


testimonialModalBackdrop?.addEventListener(
  "click",
  closeTestimonialModal
);


document.addEventListener(
  "keydown",
  function (event) {
    if (
      event.key === "Escape" &&
      testimonialModal?.classList.contains("is-open")
    ) {
      closeTestimonialModal();
    }
  }
);


/* =========================================================
   15. RECALCULATE AFTER RESIZE
========================================================= */

window.addEventListener(
  "resize",
  function () {
    requestAnimationFrame(
      function () {
        truncateAllPreviews();
        updateStudentCarouselButtons();
      }
    );
  }
);


/* =========================================================
   START
========================================================= */

loadTestimonials();
