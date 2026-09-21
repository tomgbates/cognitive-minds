const tutoringGrid = document.querySelector("#tutoring-grid");


async function loadPackages() {
  try {
    const response = await fetch("assets/data/packages.json");

    if (!response.ok) {
      throw new Error("Could not load packages.json");
    }

    const packages = await response.json();

    renderPackages(packages);
  } catch (error) {
    console.error("Error loading tutoring packages:", error);
  }
}


function renderPackages(packages) {
  if (!tutoringGrid) {
    return;
  }

  tutoringGrid.innerHTML = "";

  const activePackages = packages.filter(function (packageData) {
    return packageData.active;
  });

  activePackages.forEach(function (packageData) {
    const card = createPackageCard(packageData);

    tutoringGrid.appendChild(card);
  });
}


function createPackageCard(packageData) {
  const card = document.createElement("article");

  card.classList.add("tutoring-card");

  if (packageData.theme === "pink") {
    card.classList.add("tutoring-card-pink");
  }


  const tagsHTML = createTagsHTML(packageData);
  const availabilityHTML = createAvailabilityHTML(packageData);
  const featuresHTML = createFeaturesHTML(packageData);
  const priceHTML = createPriceHTML(packageData);
  const noteHTML = createNoteHTML(packageData);
  const whatsappLink = createWhatsAppLink(packageData);


  card.innerHTML = `
    <div class="tutoring-card-top">

      <div class="tutoring-tags">
        ${tagsHTML}
        ${availabilityHTML}
      </div>

      <h3>${packageData.title}</h3>

      <p>
        ${packageData.description}
      </p>

    </div>


    <ul class="tutoring-features">
      ${featuresHTML}
    </ul>


    ${noteHTML}


    <div class="tutoring-card-bottom">

      ${priceHTML}

      <a
        href="${whatsappLink}"
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


function createTagsHTML(packageData) {
  return packageData.tags
    .map(function (tag) {

      const pinkClass =
        packageData.theme === "pink"
          ? " tutoring-tag-pink"
          : "";

      return `
        <span class="tutoring-tag${pinkClass}">
          ${tag}
        </span>
      `;
    })
    .join("");
}


function createAvailabilityHTML(packageData) {
  if (
    !packageData.availability ||
    packageData.availability.spacesRemaining === null ||
    packageData.availability.spacesRemaining <= 0
  ) {
    return "";
  }


  const spaces =
    packageData.availability.spacesRemaining;

  const spaceWord =
    spaces === 1
      ? "space"
      : "spaces";


  return `
    <div class="availability-badge">
      Only ${spaces} ${spaceWord} left
    </div>
  `;
}


function createFeaturesHTML(packageData) {
  const features = [...packageData.features];

  let insertPosition = Math.min(2, features.length);


  if (packageData.maxStudents !== null) {

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


  if (
    packageData.classesPerWeek !== null &&
    packageData.durationHours !== null
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

  } else if (packageData.durationHours !== null) {

    features.splice(
      insertPosition,
      0,
      `${packageData.durationHours}-hour session`
    );

    insertPosition++;
  }


  if (packageData.approxClassesPerYear !== null) {

    features.splice(
      insertPosition,
      0,
      `Approximately ${packageData.approxClassesPerYear} classes per year`
    );
  }


  return features
    .map(function (feature) {
      return `<li>${feature}</li>`;
    })
    .join("");
}


function createPriceHTML(packageData) {

  if (packageData.pricing.type === "programme") {
    return createProgrammePriceHTML(packageData);
  }

  return createStandardPriceHTML(packageData);
}


function createStandardPriceHTML(packageData) {

  const amount =
    packageData.pricing.amount;

  const unit =
    packageData.pricing.unit;

  const normalPrice =
    formatPrice(amount);

  const discount =
    packageData.discount;


  const hasDiscount =
    discount &&
    discount.active === true &&
    discount.percent > 0 &&
    amount > 0;


  if (!hasDiscount) {
    return `
      <div class="tutoring-price">

        <div class="price-standard">

          <strong>${normalPrice}</strong>

          <span class="price-unit">
            / ${unit}
          </span>

        </div>

      </div>
    `;
  }


  const discountedAmount =
    amount *
    (1 - discount.percent / 100);

  const discountedPrice =
    formatPrice(discountedAmount);


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

        <strong>${discountedPrice}</strong>

        <span class="price-unit">
          / ${unit}
        </span>

      </div>

    </div>
  `;
}


function createProgrammePriceHTML(packageData) {

  const pricing =
    packageData.pricing;

  const discount =
    packageData.discount;


  const normalTermPrice =
    formatPrice(pricing.perTerm);

  const classPrice =
    formatPrice(pricing.perClass);

  const monthlyPrice =
    formatPrice(pricing.monthly);


  const hourlyEquivalent =
    pricing.perClass /
    packageData.durationHours;


  const hourlyPrice =
    formatPrice(hourlyEquivalent);


  const hasDiscount =
    discount &&
    discount.active === true &&
    discount.percent > 0 &&
    discount.validForSessions > 0;


  let mainPriceHTML = `
    <div class="programme-main-price">

      <strong>${normalTermPrice}</strong>

      <span class="price-unit">
        / term
      </span>

    </div>
  `;


  if (hasDiscount) {

    const discountPerClass =
      pricing.perClass *
      (discount.percent / 100);


    const totalDiscount =
      discountPerClass *
      discount.validForSessions;


    const discountedTermPrice =
      pricing.perTerm -
      totalDiscount;


    const sessionText =
      createDiscountSessionText(
        discount.validForSessions
      );


    mainPriceHTML = `
      <div class="discount-row">

        <span class="discount-badge">
          ${discount.percent}% OFF${sessionText}
        </span>

        <span class="old-price">
          ${normalTermPrice}
        </span>

      </div>


      <div class="programme-main-price">

        <strong>
          ${formatPrice(discountedTermPrice)}
        </strong>

        <span class="price-unit">
          / term
        </span>

      </div>
    `;
  }


  return `
    <div class="programme-pricing">

      ${mainPriceHTML}


      <div class="programme-breakdown">

        <span>
          ${classPrice} per ${packageData.durationHours}-hour class
        </span>

        <span>
          Equivalent to ${hourlyPrice}/hour
        </span>

      </div>


      <div class="programme-payment">

        <span class="programme-payment-label">
          Full-year payment option
        </span>

        <strong>
          ${monthlyPrice}/month × ${pricing.monthlyMonths}
        </strong>

      </div>

    </div>
  `;
}


function createDiscountSessionText(validForSessions) {

  if (
    !validForSessions ||
    validForSessions <= 0
  ) {
    return "";
  }


  const sessionWord =
    validForSessions === 1
      ? "SESSION"
      : "SESSIONS";


  return (
    ` · ${validForSessions} ${sessionWord}`
  );
}


function createNoteHTML(packageData) {

  if (!packageData.note) {
    return "";
  }

  return `
    <p class="package-note">
      ${packageData.note}
    </p>
  `;
}


function formatPrice(price) {

  if (!price || price <= 0) {
    return "R xxx.xx";
  }


  const hasDecimals =
    !Number.isInteger(price);


  const formattedNumber =
    new Intl.NumberFormat("en-ZA", {

      minimumFractionDigits:
        hasDecimals ? 2 : 0,

      maximumFractionDigits:
        2

    }).format(price);


  return `R ${formattedNumber}`;
}


function createWhatsAppLink(packageData) {

  const phoneNumber =
    "27824423844";


  const message =
    `Hi Suegne, I'm interested in enquiring about ` +
    `${packageData.title} with Cognitive Minds.`;


  return (
    `https://wa.me/${phoneNumber}` +
    `?text=${encodeURIComponent(message)}`
  );
}


loadPackages();