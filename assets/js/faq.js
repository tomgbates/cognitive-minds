/* =========================================================
   COGNITIVE MINDS V2
   FAQ

   DATA SOURCE:
   assets/data/faqs.json

   PURPOSE:
   Build the FAQ section dynamically so questions
   never need to be hard-coded into index.html.
========================================================= */


/* =========================================================
   01. FAQ MOUNT POINT
========================================================= */

const faqList =
  document.querySelector(
    "#faq-list"
  );


/* =========================================================
   02. LOAD FAQ DATA
========================================================= */

async function loadFAQs() {

  if (!faqList) {

    return;

  }


  try {

    const response =
      await fetch(
        "assets/data/faqs.json"
      );


    if (!response.ok) {

      throw new Error(
        "Could not load faqs.json"
      );

    }


    const faqData =
      await response.json();


    /*
       Supports BOTH:

       [
         {...},
         {...}
       ]

       AND:

       {
         "faqs": [
           {...},
           {...}
         ]
       }
    */

    const faqs =
      Array.isArray(
        faqData
      )
        ? faqData
        : faqData.faqs || [];


    const activeFAQs =
      faqs.filter(
        function (faq) {

          return (
            faq.active !== false
          );

        }
      );


    renderFAQs(
      activeFAQs
    );


    console.log(
      "FAQs loaded successfully:",
      activeFAQs
    );


  } catch (error) {

    console.error(
      "Error loading FAQs:",
      error
    );

  }

}


/* =========================================================
   03. RENDER FAQ LIST
========================================================= */

function renderFAQs(
  faqs
) {

  faqList.innerHTML =
    "";


  faqs.forEach(
    function (faq, index) {

      const item =
        createFAQItem(
          faq,
          index
        );


      faqList.appendChild(
        item
      );

    }
  );

}


/* =========================================================
   04. CREATE FAQ ITEM
========================================================= */

function createFAQItem(
  faq,
  index
) {

  const item =
    document.createElement(
      "article"
    );


  item.className =
    "faq-item";


  const question =
    document.createElement(
      "button"
    );


  question.type =
    "button";


  question.className =
    "faq-question";


  question.textContent =
    faq.question;


  const answerId =
    `faq-answer-${index}`;


  question.setAttribute(
    "aria-expanded",
    "false"
  );


  question.setAttribute(
    "aria-controls",
    answerId
  );


  const answer =
    document.createElement(
      "div"
    );


  answer.className =
    "faq-answer";


  answer.id =
    answerId;


  const answerInner =
    document.createElement(
      "div"
    );


  answerInner.className =
    "faq-answer-inner";


  /*
     Allows answers to contain several paragraphs
     using blank lines inside the JSON string.
  */

  const paragraphs =
    String(
      faq.answer || ""
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


      answerInner.appendChild(
        paragraph
      );

    }
  );


  answer.appendChild(
    answerInner
  );


  question.addEventListener(
    "click",
    function () {

      toggleFAQ(
        item,
        question
      );

    }
  );


  item.appendChild(
    question
  );


  item.appendChild(
    answer
  );


  return item;

}


/* =========================================================
   05. OPEN / CLOSE FAQ
========================================================= */

function toggleFAQ(
  selectedItem,
  selectedQuestion
) {

  const wasOpen =
    selectedItem.classList.contains(
      "is-open"
    );


  /*
     Close every FAQ first.

     This keeps the page tidy by allowing
     only one answer to be open at a time.
  */

  const allItems =
    faqList.querySelectorAll(
      ".faq-item"
    );


  allItems.forEach(
    function (item) {

      item.classList.remove(
        "is-open"
      );


      const question =
        item.querySelector(
          ".faq-question"
        );


      question?.setAttribute(
        "aria-expanded",
        "false"
      );

    }
  );


  /*
     If the selected one was closed,
     open it.

     If it was already open,
     leave everything closed.
  */

  if (!wasOpen) {

    selectedItem.classList.add(
      "is-open"
    );


    selectedQuestion.setAttribute(
      "aria-expanded",
      "true"
    );

  }

}


/* =========================================================
   START
========================================================= */

loadFAQs();