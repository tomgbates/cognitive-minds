/* =========================================================
   COGNITIVE MINDS V2
   TUTORING PACKAGES

   DATA SOURCE:
   assets/data/packages.json

   PURPOSE:
   - Load tutoring package information
   - Feature the Small Group programme
   - Show One-on-One as the secondary option
   - Build pricing dynamically
   - Support optional discounts
========================================================= */


/* =========================================================
   01. PAGE MOUNT POINTS
========================================================= */

const featuredPackageMount =
  document.querySelector(
    "#featured-tutoring-package"
  );


const secondaryPackageMount =
  document.querySelector(
    "#secondary-tutoring-package"
  );


/* =========================================================
   02. WHATSAPP
========================================================= */

/*
   All enquiry buttons currently use the same
   general Cognitive Minds WhatsApp enquiry.

   We can later make these package-specific if wanted.
*/

const PACKAGE_WHATSAPP_URL =
  "https://wa.me/27824423844?text=Hi%20Suegn%C3%A9%2C%20I%27m%20interested%20in%20enquiring%20about%20tutoring%20with%20Cognitive%20Minds.";


/* =========================================================
   03. LOAD PACKAGE DATA
========================================================= */

async function loadPackages() {

  try {

    const response =
      await fetch(
        "assets/data/packages.json"
      );


    if (!response.ok) {

      throw new Error(
        "Could not load packages.json"
      );

    }


    const packages =
      await response.json();


    renderPackages(
      packages
    );


    console.log(
      "Tutoring packages loaded successfully:",
      packages
    );


  } catch (error) {

    console.error(
      "Error loading tutoring packages:",
      error
    );

  }

}


/* =========================================================
   04. CHOOSE WHICH PACKAGE GOES WHERE
========================================================= */

function renderPackages(packages) {

  const activePackages =
    packages.filter(
      function (packageData) {

        return (
          packageData.active !== false
        );

      }
    );


  /*
     PRIMARY PACKAGE

     First preference:
     id = "small-group"

     Fallback:
     pink package
  */

  const featuredPackage =
    activePackages.find(
      function (packageData) {

        return (
          packageData.id ===
          "small-group"
        );

      }
    ) ||

    activePackages.find(
      function (packageData) {

        return (
          packageData.theme ===
          "pink"
        );

      }
    );


  /*
     SECONDARY PACKAGE

     First preference:
     id = "one-on-one"

     Otherwise:
     first package that isn't the featured one.
  */

  const secondaryPackage =
    activePackages.find(
      function (packageData) {

        return (
          packageData.id ===
          "one-on-one"
        );

      }
    ) ||

    activePackages.find(
      function (packageData) {

        return (
          packageData !==
          featuredPackage
        );

      }
    );


  /* ---------- Render featured ---------- */

  if (
    featuredPackageMount &&
    featuredPackage
  ) {

    featuredPackageMount.innerHTML =
      "";


    featuredPackageMount.appendChild(
      createPackageCard(
        featuredPackage
      )
    );

  }


  /* ---------- Render secondary ---------- */

  if (
    secondaryPackageMount &&
    secondaryPackage
  ) {

    secondaryPackageMount.innerHTML =
      "";


    secondaryPackageMount.appendChild(
      createPackageCard(
        secondaryPackage
      )
    );

  }

}


/* =========================================================
   05. BUILD PACKAGE CARD
========================================================= */

function createPackageCard(
  packageData
) {

  const card =
    document.createElement(
      "article"
    );


  card.classList.add(
    "tutoring-card"
  );


  if (
    packageData.theme ===
    "pink"
  ) {

    card.classList.add(
      "tutoring-card-pink"
    );

  }


  const tagsHTML =
    createTagsHTML(
      packageData
    );


  const availabilityHTML =
    createAvailabilityHTML(
      packageData
    );


  const featuresHTML =
    createFeaturesHTML(
      packageData
    );


  const priceHTML =
    createPriceHTML(
      packageData
    );


  const noteHTML =
    createNoteHTML(
      packageData
    );


  card.innerHTML = `

    <div class="tutoring-card-top">

      <div class="tutoring-tags">

        ${tagsHTML}

        ${availabilityHTML}

      </div>


      <h3>
        ${escapeHTML(packageData.title)}
      </h3>


      <p>
        ${escapeHTML(packageData.description)}
      </p>

    </div>


    <ul class="tutoring-features">

      ${featuresHTML}

    </ul>


    ${noteHTML}


    <div class="tutoring-card-bottom">

      ${priceHTML}


      <a
        href="${PACKAGE_WHATSAPP_URL}"
        class="tutoring-enquire"
        target="_blank"
        rel="noopener noreferrer"
      >
        Enquire
      </a>

    </div>
  `;


  return card;

}


/* =========================================================
   06. PACKAGE TAGS
========================================================= */

function createTagsHTML(
  packageData
) {

  if (
    !Array.isArray(
      packageData.tags
    )
  ) {

    return "";

  }


  return packageData.tags
    .map(
      function (tag) {

        const pinkClass =
          packageData.theme ===
          "pink"
            ? " tutoring-tag-pink"
            : "";


        return `

          <span class="tutoring-tag${pinkClass}">
            ${escapeHTML(tag)}
          </span>

        `;

      }
    )
    .join("");

}


/* =========================================================
   07. AVAILABILITY BADGE
========================================================= */

function createAvailabilityHTML(
  packageData
) {

  if (
    !packageData.availability ||
    packageData.availability
      .spacesRemaining === null ||
    packageData.availability
      .spacesRemaining <= 0
  ) {

    return "";

  }


  const spaces =
    packageData.availability
      .spacesRemaining;


  const word =
    spaces === 1
      ? "space"
      : "spaces";


  return `

    <span class="availability-badge">
      Only ${spaces} ${word} left
    </span>

  `;

}


/* =========================================================
   08. PACKAGE FEATURES
========================================================= */

function createFeaturesHTML(
  packageData
) {

  const features =
    Array.isArray(
      packageData.features
    )
      ? [...packageData.features]
      : [];


  /*
     We insert dynamic details after the first
     two ordinary features.
  */

  let insertPosition =
    Math.min(
      2,
      features.length
    );


  /* ---------- Maximum learners ---------- */

  if (
    packageData.maxStudents !== null &&
    packageData.maxStudents !== undefined
  ) {

    const learnerWord =
      packageData.maxStudents === 1
        ? "learner"
        : "learners";


    features.splice(
      insertPosition,
      0,
      `Maximum ${packageData.maxStudents} ${learnerWord}`
    );


    insertPosition++;

  }


  /* ---------- Session duration ---------- */

  if (
    packageData.classesPerWeek !== null &&
    packageData.classesPerWeek !== undefined &&
    packageData.durationHours !== null &&
    packageData.durationHours !== undefined
  ) {

    const classWord =
      packageData.classesPerWeek === 1
        ? "class"
        : "classes";


    features.splice(
      insertPosition,
      0,
      `${packageData.classesPerWeek} × ${packageData.durationHours}-hour ${classWord} per week`
    );


    insertPosition++;

  } else if (
    packageData.durationHours !== null &&
    packageData.durationHours !== undefined
  ) {

    features.splice(
      insertPosition,
      0,
      `${packageData.durationHours}-hour session`
    );


    insertPosition++;

  }


  /* ---------- Classes per year ---------- */

  if (
    packageData.approxClassesPerYear !== null &&
    packageData.approxClassesPerYear !== undefined
  ) {

    features.splice(
      insertPosition,
      0,
      `Approximately ${packageData.approxClassesPerYear} classes per year`
    );

  }


  return features
    .map(
      function (feature) {

        return `

          <li>
            ${escapeHTML(feature)}
          </li>

        `;

      }
    )
    .join("");

}


/* =========================================================
   09. PRICING
========================================================= */

function createPriceHTML(
  packageData
) {

  if (!packageData.pricing) {

    return "";

  }


  if (
    packageData.pricing.type ===
    "programme"
  ) {

    return createProgrammePriceHTML(
      packageData
    );

  }


  return createStandardPriceHTML(
    packageData
  );

}


/* =========================================================
   10. STANDARD PRICE
   Example: R275 / hour
========================================================= */

function createStandardPriceHTML(
  packageData
) {

  const pricing =
    packageData.pricing;


  const normalPrice =
    formatPrice(
      pricing.amount
    );


  const discount =
    packageData.discount;


  const hasDiscount =
    discount &&
    discount.active === true &&
    discount.percent > 0 &&
    pricing.amount > 0;


  /* ---------- No discount ---------- */

  if (!hasDiscount) {

    return `

      <div class="tutoring-price">

        <div class="price-standard">

          <strong>
            ${normalPrice}
          </strong>

          <span class="price-unit">
            / ${escapeHTML(pricing.unit)}
          </span>

        </div>

      </div>

    `;

  }


  /* ---------- Discount ---------- */

  const discountedAmount =
    pricing.amount *
    (
      1 -
      discount.percent / 100
    );


  const sessionText =
    createDiscountSessionText(
      discount.validForSessions
    );


  return `

    <div class="tutoring-price tutoring-price-discounted">

      <div class="discount-row">

        <span class="discount-badge">
          ${discount.percent}% OFF${sessionText}
        </span>

        <span class="old-price">
          ${normalPrice}
        </span>

      </div>


      <div class="current-price">

        <strong>
          ${formatPrice(discountedAmount)}
        </strong>

        <span class="price-unit">
          / ${escapeHTML(pricing.unit)}
        </span>

      </div>

    </div>

  `;

}


/* =========================================================
   11. PROGRAMME PRICE
   Example:
   R4500 / term
   R450 per class
   Equivalent R150/hour
   R1500/month × 12
========================================================= */

function createProgrammePriceHTML(
  packageData
) {

  const pricing =
    packageData.pricing;


  const discount =
    packageData.discount;


  const normalTermPrice =
    formatPrice(
      pricing.perTerm
    );


  let displayedTermPrice =
    pricing.perTerm;


  const hasDiscount =
    discount &&
    discount.active === true &&
    discount.percent > 0 &&
    discount.validForSessions > 0;


  let discountHTML =
    "";


  /*
     The discount applies only to the specified
     number of classes/sessions.

     Example:

     R450/class
     10% off
     valid for 4 classes

     discount = R45 × 4 = R180
  */

  if (hasDiscount) {

    const discountPerClass =
      pricing.perClass *
      (
        discount.percent / 100
      );


    const totalDiscount =
      discountPerClass *
      discount.validForSessions;


    displayedTermPrice =
      pricing.perTerm -
      totalDiscount;


    const sessionText =
      createDiscountSessionText(
        discount.validForSessions
      );


    discountHTML = `

      <div class="discount-row">

        <span class="discount-badge">
          ${discount.percent}% OFF${sessionText}
        </span>

        <span class="old-price">
          ${normalTermPrice}
        </span>

      </div>

    `;

  }


  const hourlyEquivalent =
    (
      pricing.perClass &&
      packageData.durationHours
    )
      ? (
          pricing.perClass /
          packageData.durationHours
        )
      : null;


  return `

    <div class="tutoring-price">

      ${discountHTML}


      <div class="current-price">

        <strong>
          ${formatPrice(displayedTermPrice)}
        </strong>

        <span class="price-unit">
          / term
        </span>

      </div>


      <div class="programme-breakdown">

        ${
          pricing.perClass
            ? `
              <span>
                ${formatPrice(pricing.perClass)}
                per ${packageData.durationHours}-hour class
              </span>
            `
            : ""
        }

        ${
          hourlyEquivalent
            ? `
              <span>
                Equivalent to
                ${formatPrice(hourlyEquivalent)}/hour
              </span>
            `
            : ""
        }

      </div>


      ${
        pricing.monthly
          ? `
            <div class="payment-option">

              <span>
                Full-year payment option
              </span>

              <strong>
                ${formatPrice(pricing.monthly)}/month
                × ${pricing.monthlyMonths}
              </strong>

            </div>
          `
          : ""
      }

    </div>

  `;

}


/* =========================================================
   12. DISCOUNT SESSION TEXT
========================================================= */

function createDiscountSessionText(
  validForSessions
) {

  if (
    !validForSessions ||
    validForSessions <= 0
  ) {

    return "";

  }


  const word =
    validForSessions === 1
      ? "SESSION"
      : "SESSIONS";


  return (
    ` · ${validForSessions} ${word}`
  );

}


/* =========================================================
   13. OPTIONAL PACKAGE NOTE
========================================================= */

function createNoteHTML(
  packageData
) {

  if (!packageData.note) {

    return "";

  }


  return `

    <p class="tutoring-note">
      ${escapeHTML(packageData.note)}
    </p>

  `;

}


/* =========================================================
   14. PRICE FORMATTER
========================================================= */

function formatPrice(
  price
) {

  if (
    price === null ||
    price === undefined ||
    price <= 0
  ) {

    return "R xxx.xx";

  }


  const hasDecimals =
    !Number.isInteger(
      price
    );


  const formattedNumber =
    new Intl.NumberFormat(
      "en-ZA",
      {

        minimumFractionDigits:
          hasDecimals
            ? 2
            : 0,

        maximumFractionDigits:
          2

      }
    )
    .format(price);


  return (
    `R ${formattedNumber}`
  );

}


/* =========================================================
   15. BASIC HTML SAFETY
========================================================= */

function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =========================================================
   START
========================================================= */

loadPackages();