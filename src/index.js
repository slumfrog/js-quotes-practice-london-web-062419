// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

const QUOTES_URL = "http://localhost:3000/quotes?_embed=likes";
const LIKES_URL = "http://localhost:3000/likes";

const getQuotes = () => {
  fetch(QUOTES_URL)
    .then(resp => resp.json())
    .then(allQuotes => {
      renderAllQuotes(allQuotes);
    });
};

// delete a quote yo!

const deleteQuoteRequest = quoteId => {
  return fetch(`${QUOTES_URL}/${quoteId}`, {
    method: "DELETE"
  }).then(resp => resp.json());
};

// update likes to the sever

const updateLikes = quote => {
  const updatedLikes = { quoteId: quote.id };
  return fetch(LIKES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "applicaton/json"
    },
    body: JSON.stringify(updatedLikes)
  }).then(resp => resp.json());
};

// dynamically alters our DOM to show the new like number

const handleUpdateLikes = (span, quote) => {
  updateLikes(quote).then(updatedQuote => {
    currentLikes = parseInt(span.innerText);
    span.innerText = currentLikes + 1;
  });
};

const renderAllQuotes = allQuotes => {
  allQuotes.map(quote => renderQuote(quote));
};

const renderQuote = quote => {
  const quotesList = document.querySelector("#quote-list");
  const li = renderQuoteCard(quote);
  quotesList.append(li);
};

const renderQuoteCard = quote => {
  const li = document.createElement("li");
  const block = document.createElement("blockquote");
  const p = document.createElement("p");
  const footer = document.createElement("footer");
  const btn_s = document.createElement("button");
  const btn_d = document.createElement("button");
  const span = document.createElement("span");

  li.className = "quote-card";
  p.className = "mb-0";
  p.innerText = quote.quote;
  block.className = "blockquote";
  footer.className = "blockquote-footer";
  footer.innerText = quote.author;
  btn_s.innerText = "Likes: ";
  btn_s.className = "btn-success";
  btn_d.innerText = "Delete";
  btn_d.className = "btn-danger";
  span.innerText = quote.likes.length;

  btn_d.addEventListener("click", () => deleteQuote(quote.id, li));

  btn_s.append(span);
  li.append(block, p, footer, btn_s, btn_d);

  btn_s.addEventListener("click", () => {
    handleUpdateLikes(span, quote);
  });
  return li;
};

// get the form and the input fields and request to backend
const handleCreateQuote = () => {
  const quote = document.querySelector("#new-quote").value;
  const author = document.querySelector("#author").value;
  const quoteObject = { quote: quote, author: author, likes: [] };
  createQuote(quoteObject).then(quote => {
    renderQuote(quote);
  });
};

// const handleUpdateLikes = (span, quote) => {
//     updateLikes(quote).then(updatedQuote => {
//       currentLikes = parseInt(span.innerText);
//       span.innerText = currentLikes + 1;
//     });
//   };

// create a quote
const createQuote = quoteObject => {
  return fetch(QUOTES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "applicaton/json"
    },
    body: JSON.stringify(quoteObject)
  }).then(resp => resp.json());
};

const deleteQuote = (quoteId, li) => {
  deleteQuoteRequest(quoteId).then(() => li.remove());
};

const init = () => {
  getQuotes();
};

const form = document.querySelector("#new-quote-form");

form.addEventListener("submit", e => {
  e.preventDefault();
  handleCreateQuote();
  form.reset();
});

document.addEventListener("DOMContentLoaded", init);
