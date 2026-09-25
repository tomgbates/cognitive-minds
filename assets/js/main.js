/* =========================================================
   COGNITIVE MINDS V2
   MAIN JAVASCRIPT

   CONTENTS
   ---------------------------------------------------------
   01. WhatsApp Links
   02. Mobile Navigation
   03. Current Year
========================================================= */


/* =========================================================
   01. WHATSAPP LINKS
========================================================= */

/*
   MAIN COGNITIVE MINDS WHATSAPP LINK

   Change this one URL in future if:
   - Suegné's number changes
   - the pre-filled message changes
*/

const WHATSAPP_URL =
  "https://wa.me/27824423844?text=Hi%20Suegn%C3%A9%2C%20I%27m%20interested%20in%20enquiring%20about%20tutoring%20with%20Cognitive%20Minds.";


/*
   Find every link on the page whose visible text contains
   "WhatsApp Suegné" and automatically give it the correct URL.

   This means we do NOT need to hard-code the WhatsApp URL
   into every individual button in index.html.
*/

function setupWhatsAppLinks() {

  const allLinks =
    document.querySelectorAll("a");


  allLinks.forEach(function (link) {

    const linkText =
      link.textContent
        .trim()
        .toLowerCase();


    /*
       "suegn" deliberately catches both:
       Suegné
       Suegne
    */

    if (
      linkText.includes("whatsapp") &&
      linkText.includes("suegn")
    ) {

      link.href =
        WHATSAPP_URL;


      link.target =
        "_blank";


      link.rel =
        "noopener noreferrer";

    }

  });

}


/* =========================================================
   02. MOBILE NAVIGATION
========================================================= */

const menuToggle =
  document.querySelector(".menu-toggle");


const mainNav =
  document.querySelector(".main-nav");


const menuOverlay =
  document.querySelector(".menu-overlay");


const navLinks =
  document.querySelectorAll(
    ".main-nav a"
  );


/* ---------- Open menu ---------- */

function openMenu() {

  if (
    !menuToggle ||
    !mainNav ||
    !menuOverlay
  ) {
    return;
  }


  mainNav.classList.add(
    "is-open"
  );


  menuToggle.classList.add(
    "is-open"
  );


  menuOverlay.classList.add(
    "is-open"
  );


  menuToggle.setAttribute(
    "aria-expanded",
    "true"
  );


  menuToggle.setAttribute(
    "aria-label",
    "Close navigation menu"
  );

}


/* ---------- Close menu ---------- */

function closeMenu() {

  if (
    !menuToggle ||
    !mainNav ||
    !menuOverlay
  ) {
    return;
  }


  mainNav.classList.remove(
    "is-open"
  );


  menuToggle.classList.remove(
    "is-open"
  );


  menuOverlay.classList.remove(
    "is-open"
  );


  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );


  menuToggle.setAttribute(
    "aria-label",
    "Open navigation menu"
  );

}


/* ---------- Toggle menu ---------- */

function toggleMenu() {

  if (!mainNav) {
    return;
  }


  const menuIsOpen =
    mainNav.classList.contains(
      "is-open"
    );


  if (menuIsOpen) {

    closeMenu();

  } else {

    openMenu();

  }

}


/* ---------- Hamburger click ---------- */

menuToggle?.addEventListener(
  "click",
  toggleMenu
);


/* ---------- Clicking a nav link closes menu ---------- */

navLinks.forEach(function (link) {

  link.addEventListener(
    "click",
    closeMenu
  );

});


/* ---------- Clicking overlay closes menu ---------- */

menuOverlay?.addEventListener(
  "click",
  closeMenu
);


/* ---------- Escape closes menu ---------- */

document.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Escape") {

      closeMenu();

    }

  }
);


/*
   If somebody opens the mobile menu and then makes
   the browser wider again, make sure the mobile
   menu state is cleared.
*/

window.addEventListener(
  "resize",
  function () {

    if (window.innerWidth > 900) {

      closeMenu();

    }

  }
);


/* =========================================================
   03. CURRENT YEAR
========================================================= */

/*
   Optional.

   If any page later contains:

   <span id="current-year"></span>

   it will automatically display the current year.
*/

const currentYear =
  document.querySelector(
    "#current-year"
  );


if (currentYear) {

  currentYear.textContent =
    new Date().getFullYear();

}


/* =========================================================
   START
========================================================= */

setupWhatsAppLinks();