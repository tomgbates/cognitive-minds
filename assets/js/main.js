const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const menuOverlay = document.querySelector(".menu-overlay");
const navLinks = document.querySelectorAll(".main-nav a");


function openMenu() {
  mainNav.classList.add("is-open");
  menuToggle.classList.add("is-open");
  menuOverlay.classList.add("is-open");

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation menu");
}


function closeMenu() {
  mainNav.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuOverlay.classList.remove("is-open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}


function toggleMenu() {
  const menuIsOpen = mainNav.classList.contains("is-open");

  if (menuIsOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}


menuToggle.addEventListener("click", toggleMenu);


navLinks.forEach(function (link) {
  link.addEventListener("click", closeMenu);
});


menuOverlay.addEventListener("click", closeMenu);


document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeMenu();
  }
});