/* =========================================================
   COGNITIVE MINDS V2
   TESTIMONIALS

   DATA SOURCE:
   assets/data/testimonials/index.json

   PURPOSE:
   - Load testimonial JSON files
   - Feature a parent testimonial separately
   - Show student testimonials in moving carousel
   - Create full-testimonial modal
========================================================= */


/* =========================================================
   01. PAGE ELEMENTS
========================================================= */

const testimonialTrack =
  document.querySelector(
    "#testimonial-track"
  );


const testimonialCarousel =
  document.querySelector(
    ".testimonial-carousel"
  );


const featuredParentMount =
  document.querySelector(
    "#featured-parent-testimonial"
  );


/* =========================================================
   02. MODAL ELEMENTS
========================================================= */

const testimonialModal =
  document.querySelector(
    "#testimonial-modal"
  );


const testimonialModalBackdrop =
  testimonialModal?.querySelector(
    ".testimonial-modal-backdrop"
  );


const testimonialModalClose =
  testimonialModal?.querySelector(
    ".testimonial-modal-close"
  );


const testimonialModalType =
  document.querySelector(
    "#testimonial-modal-type"
  );


const testimonialModalName =
  document.querySelector(
    "#testimonial-modal-name"
  );


const testimonialModalText =
  document.querySelector(
    "#testimonial-modal-text"
  );


/* =========================================================
   03. CAROUSEL SETTINGS

   Smaller speed = slower movement.

   22 means approximately 22px per second.
========================================================= */

const TESTIMONIAL_SPEED =
  22;


/*
   Maximum centre-card enlargement.

   1.10 = 10% larger.
*/

const MAX_CARD_SCALE =
  1.10;


/* =========================================================
   04. CAROUSEL STATE
========================================================= */

let carouselOffset =
  0;


let testimonialSetWidth =
  0;


let previousAnimationTime =
  null;


let carouselHovered =
  false;


let carouselFocused =
  false;


let testimonialModalOpen =
  false;


let carouselPaused =
  false;


let animationStarted =
  false;


let lastFocusedElement =
  null;


/* =========================================================
   05. UPDATE PAUSE STATE
========================================================= */

function updateCarouselPauseState() {

  carouselPaused =
    carouselHovered ||
    carouselFocused ||
    testimonialModalOpen;

}


/* =========================================================
   06. LOAD TESTIMONIAL DATA
========================================================= */

async function loadTestimonials() {

  try {

    const indexResponse =
      await fetch(
        "assets/data/testimonials/index.json"
      );


    if (!indexResponse.ok) {

      throw new Error(
        "Could not load testimonials/index.json"
      );

    }


    const testimonialFiles =
      await indexResponse.json();


    const requests =
      testimonialFiles.map(
        async function (fileName) {

          const response =
            await fetch(
              `assets/data/testimonials/${fileName}`
            );


          if (!response.ok) {

            throw new Error(
              `Could not load testimonial: ${fileName}`
            );

          }


          return response.json();

        }
      );


    const testimonials =
      await Promise.all(
        requests
      );


    const activeTestimonials =
      testimonials.filter(
        function (testimonial) {

          return (
            testimonial.active !== false
          );

        }
      );


    renderParentTestimonial(
      activeTestimonials
    );


    renderStudentTestimonials(
      activeTestimonials
    );


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
   07. TESTIMONIAL TYPE HELPERS
========================================================= */

function isParentTestimonial(
  testimonial
) {

  return (
    String(
      testimonial.type || ""
    )
      .toLowerCase()
      .includes("parent")
  );

}


function isStudentTestimonial(
  testimonial
) {

  return (
    String(
      testimonial.type || ""
    )
      .toLowerCase()
      .includes("student")
  );

}


/* =========================================================
   08. FEATURED PARENT TESTIMONIAL
========================================================= */

function renderParentTestimonial(
  testimonials
) {

  if (!featuredParentMount) {

    return;

  }


  /*
     Prefer a parent marked featured.

     If none is marked featured,
     simply use the first active parent.
  */

  const parent =
    testimonials.find(
      function (testimonial) {

        return (
          isParentTestimonial(
            testimonial
          ) &&
          testimonial.featured === true
        );

      }
    ) ||

    testimonials.find(
      function (testimonial) {

        return isParentTestimonial(
          testimonial
        );

      }
    );


  if (!parent) {

    featuredParentMount.innerHTML =
      "";

    return;

  }


  featuredParentMount.innerHTML =
    "";


  const card =
    document.createElement(
      "article"
    );


  card.className =
    "parent-testimonial-card";


  /* ---------- Quote side ---------- */

  const quoteSide =
    document.createElement(
      "div"
    );


  const quote =
    document.createElement(
      "p"
    );


  quote.className =
    "parent-testimonial-quote";


  quote.textContent =
    `“${createParentPreview(parent.testimonial)}”`;


  quoteSide.appendChild(
    quote
  );


  /* ---------- Person / action side ---------- */

  const detailsSide =
    document.createElement(
      "div"
    );


  const meta =
    document.createElement(
      "div"
    );


  meta.className =
    "parent-testimonial-meta";


  const name =
    document.createElement(
      "strong"
    );


  name.textContent =
    parent.name;


  const type =
    document.createElement(
      "span"
    );


  type.textContent =
    parent.type;


  meta.appendChild(
    name
  );


  meta.appendChild(
    type
  );


  const readMore =
    document.createElement(
      "button"
    );


  readMore.type =
    "button";


  readMore.className =
    "testimonial-read-more";


  readMore.textContent =
    "Read full testimonial";


  readMore.addEventListener(
    "click",
    function () {

      openTestimonialModal(
        parent,
        readMore
      );

    }
  );


  detailsSide.appendChild(
    meta
  );


  detailsSide.appendChild(
    readMore
  );


  card.appendChild(
    quoteSide
  );


  card.appendChild(
    detailsSide
  );


  featuredParentMount.appendChild(
    card
  );

}


/* =========================================================
   09. CREATE SHORT PARENT PREVIEW
========================================================= */

function createParentPreview(
  testimonialText
) {

  if (!testimonialText) {

    return "";

  }


  /*
     If the testimonial contains paragraphs,
     the first paragraph often makes the best
     natural excerpt.
  */

  const paragraphs =
    testimonialText
      .trim()
      .split(
        /\n\s*\n/
      );


  const firstParagraph =
    paragraphs[0]
      .replace(
        /\s+/g,
        " "
      )
      .trim();


  const maximumLength =
    420;


  if (
    firstParagraph.length <=
    maximumLength
  ) {

    return firstParagraph;

  }


  const shortened =
    firstParagraph
      .slice(
        0,
        maximumLength
      );


  const lastSpace =
    shortened.lastIndexOf(
      " "
    );


  return (
    shortened
      .slice(
        0,
        lastSpace
      )
      .trim() +
    "…"
  );

}


/* =========================================================
   10. STUDENT TESTIMONIALS
========================================================= */

function renderStudentTestimonials(
  testimonials
) {

  if (
    !testimonialTrack ||
    !testimonialCarousel
  ) {

    return;

  }


  testimonialTrack.innerHTML =
    "";


  let students =
    testimonials.filter(
      function (testimonial) {

        return (
          isStudentTestimonial(
            testimonial
          ) &&
          testimonial.featured === true
        );

      }
    );


  /*
     If none have featured:true,
     fall back to all active student reviews.
  */

  if (
    students.length === 0
  ) {

    students =
      testimonials.filter(
        isStudentTestimonial
      );

  }


  if (
    students.length === 0
  ) {

    testimonialCarousel.style.display =
      "none";

    return;

  }


  const firstSet =
    createTestimonialSet(
      students
    );


  const secondSet =
    createTestimonialSet(
      students
    );


  secondSet.setAttribute(
    "aria-hidden",
    "true"
  );


  testimonialTrack.appendChild(
    firstSet
  );


  testimonialTrack.appendChild(
    secondSet
  );


  requestAnimationFrame(
    function () {

      measureCarousel(
        firstSet
      );


      truncateAllPreviews();


      updateCardSpotlight();


      startCarouselAnimation();

    }
  );

}


/* =========================================================
   11. CREATE ONE TESTIMONIAL SET
========================================================= */

function createTestimonialSet(
  testimonials
) {

  const set =
    document.createElement(
      "div"
    );


  set.className =
    "testimonial-set";


  testimonials.forEach(
    function (testimonial) {

      set.appendChild(
        createTestimonialCard(
          testimonial
        )
      );

    }
  );


  return set;

}


/* =========================================================
   12. CREATE TESTIMONIAL CARD
========================================================= */

function createTestimonialCard(
  testimonial
) {

  const card =
    document.createElement(
      "article"
    );


  card.className =
    "testimonial-card";


  /* ---------- Quote mark ---------- */

  const quoteMark =
    document.createElement(
      "div"
    );


  quoteMark.className =
    "testimonial-quote-mark";


  quoteMark.textContent =
    "“";


  /* ---------- Testimonial preview ---------- */

  const preview =
    document.createElement(
      "p"
    );


  preview.className =
    "testimonial-preview";


  preview.dataset.fullText =
    testimonial.testimonial || "";


  preview.textContent =
    testimonial.testimonial || "";


  /* ---------- Person ---------- */

  const person =
    document.createElement(
      "div"
    );


  person.className =
    "testimonial-person";


  const name =
    document.createElement(
      "strong"
    );


  name.textContent =
    testimonial.name || "";


  const details =
    document.createElement(
      "span"
    );


  if (testimonial.grade) {

    details.textContent =
      `${testimonial.type} · ${testimonial.grade}`;

  } else {

    details.textContent =
      testimonial.type || "";

  }


  person.appendChild(
    name
  );


  person.appendChild(
    details
  );


  /* ---------- Read More ---------- */

  const readMore =
    document.createElement(
      "button"
    );


  readMore.type =
    "button";


  readMore.className =
    "testimonial-read-more";


  readMore.textContent =
    "Read full testimonial";


  readMore.addEventListener(
    "click",
    function () {

      openTestimonialModal(
        testimonial,
        readMore
      );

    }
  );


  card.appendChild(
    quoteMark
  );


  card.appendChild(
    preview
  );


  card.appendChild(
    person
  );


  card.appendChild(
    readMore
  );


  return card;

}


/* =========================================================
   13. TESTIMONIAL ELLIPSIS
========================================================= */

function truncatePreview(
  preview
) {

  const fullText =
    preview.dataset.fullText;


  if (!fullText) {

    return;

  }


  /*
     Restore complete text before measuring.
  */

  preview.textContent =
    fullText;


  preview.classList.remove(
    "is-truncated"
  );


  /*
     No truncation needed.
  */

  if (
    preview.scrollHeight <=
    preview.clientHeight + 1
  ) {

    return;

  }


  const words =
    fullText
      .trim()
      .split(/\s+/);


  let lowestFit =
    0;


  let highestPossible =
    words.length;


  /*
     Binary search finds the maximum number of
     complete words that fit into the preview.
  */

  while (
    lowestFit <
    highestPossible
  ) {

    const middle =
      Math.ceil(
        (
          lowestFit +
          highestPossible
        ) / 2
      );


    preview.textContent =
      words
        .slice(
          0,
          middle
        )
        .join(" ") +
      "…";


    const fits =
      preview.scrollHeight <=
      preview.clientHeight + 1;


    if (fits) {

      lowestFit =
        middle;

    } else {

      highestPossible =
        middle - 1;

    }

  }


  preview.textContent =
    words
      .slice(
        0,
        lowestFit
      )
      .join(" ") +
    "…";


  preview.classList.add(
    "is-truncated"
  );

}


/* =========================================================
   14. TRUNCATE ALL CARDS
========================================================= */

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

      truncatePreview(
        preview
      );

    }
  );

}


/* =========================================================
   15. MEASURE CAROUSEL
========================================================= */

function measureCarousel(
  firstSet
) {

  if (!firstSet) {

    return;

  }


  testimonialSetWidth =
    firstSet
      .getBoundingClientRect()
      .width;

}


/* =========================================================
   16. START CAROUSEL
========================================================= */

function startCarouselAnimation() {

  if (animationStarted) {

    return;

  }


  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduceMotion) {

    testimonialCarousel?.classList.add(
      "reduced-motion"
    );

    return;

  }


  animationStarted =
    true;


  requestAnimationFrame(
    animateCarousel
  );

}


/* =========================================================
   17. CAROUSEL ANIMATION LOOP
========================================================= */

function animateCarousel(
  currentTime
) {

  if (
    previousAnimationTime === null
  ) {

    previousAnimationTime =
      currentTime;

  }


  const elapsed =
    currentTime -
    previousAnimationTime;


  previousAnimationTime =
    currentTime;


  /*
     Prevent jumping after switching browser tabs.
  */

  const safeElapsed =
    Math.min(
      elapsed,
      50
    );


  if (
    !carouselPaused &&
    testimonialSetWidth > 0 &&
    testimonialTrack
  ) {

    carouselOffset -=
      TESTIMONIAL_SPEED *
      (
        safeElapsed /
        1000
      );


    if (
      carouselOffset <=
      -testimonialSetWidth
    ) {

      carouselOffset +=
        testimonialSetWidth;

    }


    testimonialTrack.style.transform =
      `translate3d(${carouselOffset}px, 0, 0)`;

  }


  updateCardSpotlight();


  requestAnimationFrame(
    animateCarousel
  );

}


/* =========================================================
   18. CENTRE CARD SPOTLIGHT
========================================================= */

function updateCardSpotlight() {

  if (
    !testimonialCarousel ||
    !testimonialTrack
  ) {

    return;

  }


  const cards =
    testimonialTrack.querySelectorAll(
      ".testimonial-card"
    );


  const carouselRect =
    testimonialCarousel
      .getBoundingClientRect();


  const carouselCentre =
    carouselRect.left +
    carouselRect.width / 2;


  const spotlightDistance =
    Math.min(
      500,
      carouselRect.width *
      0.45
    );


  cards.forEach(
    function (card) {

      const cardRect =
        card.getBoundingClientRect();


      const cardCentre =
        cardRect.left +
        cardRect.width / 2;


      const distance =
        Math.abs(
          carouselCentre -
          cardCentre
        );


      const focusAmount =
        Math.max(
          0,
          1 -
          distance /
          spotlightDistance
        );


      const scale =
        1 +
        focusAmount *
        (
          MAX_CARD_SCALE -
          1
        );


      card.style.transform =
        `scale(${scale})`;


      card.style.opacity =
        String(
          0.72 +
          focusAmount *
          0.28
        );


      card.style.zIndex =
        String(
          Math.round(
            focusAmount *
            10
          )
        );

    }
  );

}


/* =========================================================
   19. PAUSE ON HOVER
========================================================= */

testimonialCarousel?.addEventListener(
  "mouseenter",
  function () {

    carouselHovered =
      true;


    updateCarouselPauseState();

  }
);


testimonialCarousel?.addEventListener(
  "mouseleave",
  function () {

    carouselHovered =
      false;


    updateCarouselPauseState();

  }
);


/* =========================================================
   20. PAUSE FOR KEYBOARD FOCUS
========================================================= */

testimonialCarousel?.addEventListener(
  "focusin",
  function () {

    carouselFocused =
      true;


    updateCarouselPauseState();

  }
);


testimonialCarousel?.addEventListener(
  "focusout",
  function (event) {

    if (
      !testimonialCarousel.contains(
        event.relatedTarget
      )
    ) {

      carouselFocused =
        false;


      updateCarouselPauseState();

    }

  }
);


/* =========================================================
   21. OPEN TESTIMONIAL MODAL
========================================================= */

function openTestimonialModal(
  testimonial,
  triggerElement
) {

  if (!testimonialModal) {

    return;

  }


  lastFocusedElement =
    triggerElement;


  testimonialModalType.textContent =
    testimonial.type || "";


  testimonialModalName.textContent =
    testimonial.name || "";


  testimonialModalText.innerHTML =
    "";


  /*
     Preserve paragraph breaks from JSON.
  */

  const paragraphs =
    String(
      testimonial.testimonial || ""
    )
      .trim()
      .split(
        /\n\s*\n/
      );


  paragraphs.forEach(
    function (paragraphText) {

      const paragraph =
        document.createElement(
          "p"
        );


      paragraph.textContent =
        paragraphText
          .replace(
            /\s*\n\s*/g,
            " "
          )
          .trim();


      testimonialModalText.appendChild(
        paragraph
      );

    }
  );


  testimonialModal.classList.add(
    "is-open"
  );


  testimonialModal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "modal-open"
  );


  testimonialModalOpen =
    true;


  updateCarouselPauseState();


  testimonialModalClose?.focus();

}


/* =========================================================
   22. CLOSE TESTIMONIAL MODAL
========================================================= */

function closeTestimonialModal() {

  if (!testimonialModal) {

    return;

  }


  testimonialModal.classList.remove(
    "is-open"
  );


  testimonialModal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "modal-open"
  );


  testimonialModalOpen =
    false;


  /*
     Restore focus to the original Read More button.
  */

  if (lastFocusedElement) {

    lastFocusedElement.focus();

  }


  /*
     The focus event above briefly pauses the carousel.

     Clear that state on the next browser frame so
     the carousel resumes immediately after closing.
  */

  requestAnimationFrame(
    function () {

      carouselFocused =
        false;


      carouselHovered =
        false;


      updateCarouselPauseState();


      lastFocusedElement =
        null;

    }
  );

}


/* ---------- X button ---------- */

testimonialModalClose?.addEventListener(
  "click",
  closeTestimonialModal
);


/* ---------- Click outside modal ---------- */

testimonialModalBackdrop?.addEventListener(
  "click",
  closeTestimonialModal
);


/* ---------- Escape key ---------- */

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape" &&
      testimonialModal?.classList.contains(
        "is-open"
      )
    ) {

      closeTestimonialModal();

    }

  }
);


/* =========================================================
   23. RECALCULATE AFTER RESIZE
========================================================= */

window.addEventListener(
  "resize",
  function () {

    requestAnimationFrame(
      function () {

        const firstSet =
          testimonialTrack
            ?.querySelector(
              ".testimonial-set"
            );


        if (firstSet) {

          measureCarousel(
            firstSet
          );

        }


        truncateAllPreviews();


        updateCardSpotlight();

      }
    );

  }
);


/* =========================================================
   START
========================================================= */

loadTestimonials();