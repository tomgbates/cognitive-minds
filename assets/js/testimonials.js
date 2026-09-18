const testimonialTrack =
  document.querySelector("#testimonial-track");

const testimonialCarousel =
  document.querySelector(".testimonial-carousel");


/* =========================================
   Modal elements
   ========================================= */

const testimonialModal =
  document.querySelector("#testimonial-modal");

const testimonialModalOverlay =
  testimonialModal?.querySelector(
    ".testimonial-modal-overlay"
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


/* =========================================
   Carousel settings
   ========================================= */

/*
  How quickly the cards move.

  This means approximately 22 pixels
  every second.

  Smaller = slower
  Larger = faster
*/

const TESTIMONIAL_SPEED = 22;


/*
  Largest size of the card when it reaches
  the centre.

  1.12 = 12% larger than normal.
*/

const MAX_CARD_SCALE = 1.12;


/*
  Current horizontal movement of the track.
*/

let carouselOffset = 0;


/*
  Width of one complete copy of all
  testimonial cards.
*/

let testimonialSetWidth = 0;


/*
  Used to calculate how much time passed
  between animation frames.
*/

let previousAnimationTime = null;


/*
  Controls whether movement is paused.
*/

let carouselPaused = false;

let carouselHovered = false;

let carouselFocused = false;

let testimonialModalOpen = false;


/*
  Remember which Read More button opened
  the modal so keyboard focus can return
  there after closing it.
*/

let lastFocusedElement = null;

/*
  The carousel can be paused for several
  different reasons.

  This function checks all of them before
  deciding whether movement is allowed.
*/

function updateCarouselPauseState() {

  carouselPaused =
    carouselHovered ||
    carouselFocused ||
    testimonialModalOpen;
}


/* =========================================
   Load testimonial data
   ========================================= */

async function loadTestimonials() {

  try {

    /*
      First load index.json.

      That tells us which testimonial files
      exist.
    */

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


    /*
      Create one request for every testimonial
      listed in index.json.
    */

    const testimonialRequests =
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


    /*
      Wait until every testimonial has loaded.
    */

    const testimonials =
      await Promise.all(
        testimonialRequests
      );


    /*
      Homepage only receives testimonials
      which are active AND featured.
    */

    const featuredTestimonials =
      testimonials.filter(
        function (testimonial) {

          return (
            testimonial.active === true &&
            testimonial.featured === true
          );
        }
      );


    console.log(
      "Testimonials loaded successfully:",
      featuredTestimonials
    );


    renderTestimonials(
      featuredTestimonials
    );


  } catch (error) {

    console.error(
      "Error loading testimonials:",
      error
    );

  }
}


/* =========================================
   Build carousel
   ========================================= */

function renderTestimonials(testimonials) {

  if (
    !testimonialTrack ||
    !testimonialCarousel
  ) {
    return;
  }


  testimonialTrack.innerHTML = "";


  if (testimonials.length === 0) {

    testimonialCarousel.style.display =
      "none";

    return;
  }


  /*
    We create TWO identical sets.

    SET 1:
    Gaby Bella Sivi Liam...

    SET 2:
    Gaby Bella Sivi Liam...

    This lets us make an endless loop.
  */

  const firstSet =
    createTestimonialSet(
      testimonials
    );

  const secondSet =
    createTestimonialSet(
      testimonials
    );


  /*
    The second set is only there visually
    to create the loop.

    Screen readers do not need to read all
    testimonials twice.
  */

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


  /*
    Wait until the browser has actually
    drawn the cards before measuring them.
  */

  requestAnimationFrame(
    function () {

      testimonialSetWidth =
        firstSet.getBoundingClientRect().width;


      truncateAllPreviews();


      updateCardSpotlight();


      startCarouselAnimation();

    }
  );
}


/* =========================================
   Build one complete set
   ========================================= */

function createTestimonialSet(
  testimonials
) {

  const set =
    document.createElement("div");


  set.className =
    "testimonial-set";


  testimonials.forEach(
    function (testimonial) {

      const card =
        createTestimonialCard(
          testimonial
        );


      set.appendChild(
        card
      );

    }
  );


  return set;
}


/* =========================================
   Build individual card
   ========================================= */

function createTestimonialCard(
  testimonial
) {

  const card =
    document.createElement("article");


  card.className =
    "testimonial-card";


  /*
    Decorative quotation mark.
  */

  const quoteMark =
    document.createElement("div");


  quoteMark.className =
    "testimonial-quote-mark";


  quoteMark.textContent = "“";


  /*
    Short preview.

    CSS is responsible for restricting
    this to several lines.
  */

  const preview =
    document.createElement("p");


  preview.className =
    "testimonial-preview";


  /*
    Keep the complete original testimonial
    attached to the element.

    The visible text may be shortened later,
    but we never lose the original.
  */

  preview.dataset.fullText =
    testimonial.testimonial;


  preview.textContent =
    testimonial.testimonial;


  /*
    Student / parent information.
  */

  const person =
    document.createElement("div");


  person.className =
    "testimonial-person";


  const name =
    document.createElement("strong");


  name.textContent =
    testimonial.name;


  const details =
    document.createElement("span");


  if (testimonial.grade) {

    details.textContent =
      `${testimonial.type} · ${testimonial.grade}`;

  } else {

    details.textContent =
      testimonial.type;

  }


  /*
    Full testimonial button.
  */

  const readMore =
    document.createElement("button");


  readMore.className =
    "testimonial-read-more";


  readMore.type =
    "button";


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


  person.appendChild(name);
  person.appendChild(details);


  card.appendChild(quoteMark);
  card.appendChild(preview);
  card.appendChild(person);
  card.appendChild(readMore);


  return card;
}

/* =========================================
   Fit testimonial preview to card
   ========================================= */

function truncatePreview(preview) {

  const fullText =
    preview.dataset.fullText;


  if (!fullText) {
    return;
  }


  /*
    Always restore the complete testimonial
    before measuring it.

    This is important when the window changes
    size and we calculate the preview again.
  */

  preview.textContent =
    fullText;

  preview.classList.remove(
    "is-truncated"
  );

  /*
    If the whole testimonial already fits,
    leave it untouched.

    Short testimonials therefore receive
    NO ellipsis.
  */

  if (
    preview.scrollHeight <=
    preview.clientHeight + 1
  ) {
    return;
  }


  /*
    Split the testimonial into individual
    words.

    We will find the largest number of words
    that fits within the available 7 lines.
  */

  const words =
    fullText
      .trim()
      .split(/\s+/);


  let lowestFit = 0;
  let highestPossible =
    words.length;


  /*
    Binary search.

    Instead of removing one word at a time,
    this very quickly finds approximately
    how much text will fit.
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
        .slice(0, middle)
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


  /*
    Display the largest group of complete
    words that fits, followed immediately
    by the ellipsis.
  */

  preview.textContent =
    words
      .slice(0, lowestFit)
      .join(" ") +
    "…";


  preview.classList.add(
    "is-truncated"
  );
}


/* =========================================
   Fit all testimonial previews
   ========================================= */

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

/* =========================================
   Start continuous movement
   ========================================= */

function startCarouselAnimation() {

  /*
    Some people disable animation through
    accessibility settings on their device.

    If they have done that, we should respect
    their preference.
  */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (prefersReducedMotion) {

    testimonialCarousel.classList.add(
      "reduced-motion"
    );

    return;
  }


  requestAnimationFrame(
    animateCarousel
  );
}


/* =========================================
   Animation loop
   ========================================= */

function animateCarousel(
  currentTime
) {

  if (
    previousAnimationTime === null
  ) {

    previousAnimationTime =
      currentTime;
  }


  const elapsedMilliseconds =
    currentTime -
    previousAnimationTime;


  previousAnimationTime =
    currentTime;


  /*
    Prevent a massive jump if someone changes
    browser tabs and comes back later.
  */

  const safeElapsedTime =
    Math.min(
      elapsedMilliseconds,
      50
    );


  if (
    !carouselPaused &&
    testimonialSetWidth > 0
  ) {

    /*
      Move left.

      Negative X = left.
    */

    carouselOffset -=
      TESTIMONIAL_SPEED *
      (safeElapsedTime / 1000);


    /*
      Once SET 1 has completely moved away,
      jump forward exactly one set width.

      SET 2 looks exactly like SET 1, so the
      user cannot see this reset happen.
    */

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


  /*
    Regardless of movement, keep updating
    which card is closest to the centre.
  */

  updateCardSpotlight();


  requestAnimationFrame(
    animateCarousel
  );
}


/* =========================================
   Centre-card spotlight
   ========================================= */

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


  /*
    Exact horizontal centre of the
    carousel viewport.
  */

  const carouselCentre =
    carouselRect.left +
    carouselRect.width / 2;


  /*
    How far away a card can be before it
    receives no enlargement.

    Larger number = more gradual transition.
  */

  const spotlightDistance =
    Math.min(
      500,
      carouselRect.width * 0.45
    );


  cards.forEach(
    function (card) {

      const cardRect =
        card.getBoundingClientRect();


      const cardCentre =
        cardRect.left +
        cardRect.width / 2;


      const distanceFromCentre =
        Math.abs(
          carouselCentre -
          cardCentre
        );


      /*
        focusAmount:

        1 = directly in centre
        0 = outside spotlight area
      */

      const focusAmount =
        Math.max(
          0,
          1 -
          distanceFromCentre /
          spotlightDistance
        );


      /*
        Gradually grow the card as it
        approaches the centre.
      */

      const scale =
        1 +
        focusAmount *
        (MAX_CARD_SCALE - 1);


      card.style.transform =
        `scale(${scale})`;


      /*
        Slightly soften cards away from
        the centre.

        Never make them too faded.
      */

      card.style.opacity =
        0.72 +
        focusAmount * 0.28;


      /*
        Bring centred cards forward.
      */

      card.style.zIndex =
        String(
          Math.round(
            focusAmount * 10
          )
        );

    }
  );
}


/* =========================================
   Pause carousel
   ========================================= */

/*
  Mouse enters carousel.
*/

testimonialCarousel?.addEventListener(
  "mouseenter",
  function () {

    carouselHovered = true;

    updateCarouselPauseState();

  }
);


/*
  Mouse leaves carousel.
*/

testimonialCarousel?.addEventListener(
  "mouseleave",
  function () {

    carouselHovered = false;

    updateCarouselPauseState();

  }
);


/*
  Keyboard focus enters the carousel.
*/

testimonialCarousel?.addEventListener(
  "focusin",
  function () {

    carouselFocused = true;

    updateCarouselPauseState();

  }
);


/*
  Keyboard focus leaves the carousel.

  relatedTarget tells us where the focus
  is moving to.

  If it is still somewhere inside the
  carousel, we keep it paused.
*/

testimonialCarousel?.addEventListener(
  "focusout",
  function (event) {

    if (
      !testimonialCarousel.contains(
        event.relatedTarget
      )
    ) {

      carouselFocused = false;

      updateCarouselPauseState();

    }

  }
);


/* =========================================
   Open full testimonial
   ========================================= */

function openTestimonialModal(
  testimonial,
  triggerElement
) {

  if (!testimonialModal) {
    return;
  }


  /*
    Stop carousel while reading.
  */

  testimonialModalOpen = true;

  updateCarouselPauseState();


  /*
    Remember which button was clicked.
  */

  lastFocusedElement =
    triggerElement;


  testimonialModalName.textContent =
    testimonial.name;


  if (testimonial.grade) {

    testimonialModalType.textContent =
      `${testimonial.type} · ${testimonial.grade}`;

  } else {

    testimonialModalType.textContent =
      testimonial.type;

  }


  /*
    Remove any previous testimonial text.
  */

  testimonialModalText.innerHTML =
    "";


  /*
    Our JSON uses:

    \n\n

    to indicate paragraph breaks.

    Convert those into actual HTML
    paragraphs.
  */

  const paragraphs =
    testimonial.testimonial.split(
      /\n\s*\n/
    );


  paragraphs.forEach(
    function (paragraphText) {

      const paragraph =
        document.createElement("p");


      paragraph.textContent =
        paragraphText;


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


  /*
    Prevent the webpage behind the popup
    from scrolling.
  */

  document.body.classList.add(
    "modal-open"
  );


  /*
    Move keyboard focus onto the close
    button.
  */

  testimonialModalClose.focus();
}


/* =========================================
   Close modal
   ========================================= */

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


  testimonialModalOpen = false;


  /*
    Return keyboard focus to the button
    that originally opened the testimonial.
  */

  if (lastFocusedElement) {

    lastFocusedElement.focus();

    lastFocusedElement = null;

  }


  /*
    Returning focus to a Read More button
    triggers the carousel's focusin event.

    Wait until that has happened, then clear
    the temporary focus pause so the carousel
    can resume automatically.
  */

  requestAnimationFrame(
    function () {

      carouselFocused = false;

      updateCarouselPauseState();

    }
  );
}


/* Close button */

testimonialModalClose?.addEventListener(
  "click",
  closeTestimonialModal
);


/* Clicking the dark background closes it */

testimonialModalOverlay?.addEventListener(
  "click",
  closeTestimonialModal
);


/* Escape key closes it */

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

/* =========================================
   Recalculate after window resize
   ========================================= */

window.addEventListener(
  "resize",
  function () {

    requestAnimationFrame(
      function () {

        const firstSet =
          testimonialTrack?.querySelector(
            ".testimonial-set"
          );


        if (firstSet) {

          testimonialSetWidth =
            firstSet
              .getBoundingClientRect()
              .width;

        }
        
        truncateAllPreviews();

        updateCardSpotlight();

      }
    );

  }
);

/* =========================================
   Start
   ========================================= */

loadTestimonials();