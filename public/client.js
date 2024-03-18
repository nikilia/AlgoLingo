// client-side js
// run by the browser each time your view template referencing it is loaded

console.log("hello world :o");

// function to fetch and display dreams
const displayDreams = () => {
  const dreamsList = document.getElementById("dreams");

  // request the dreams from the server
  fetch("/getDreams")
    .then(res => res.json())
    .then(dreams => {
      // clear existing list
      dreamsList.innerHTML = "";
      // iterate over dreams and append to list
      dreams.forEach(dream => {
        appendNewDream(dream.dream);
      });
    });
};

// function to append a dream to the list
const appendNewDream = dream => {
  const dreamsList = document.getElementById("dreams");
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  dreamsList.appendChild(newListItem);
};

// call the displayDreams function when the page loads
window.onload = displayDreams;

// define variables that reference elements on our page
const dreamsForm = document.forms[0];
const dreamInput = dreamsForm.elements["dream"];

// listen for the form to be submitted and add a new dream when it is
dreamsForm.onsubmit = event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  const data = { dream: dreamInput.value };

  fetch("/addDream", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
      console.log(JSON.stringify(response));
    });
  // get dream value and add it to the list
  appendNewDream(dreamInput.value);

  // reset form
  dreamInput.value = "";
  dreamInput.focus();
};

const clearButton = document.querySelector('#clear-dreams');
clearButton.addEventListener('click', event => {
  fetch("/clearDreams", {})
    .then(res => res.json())
    .then(response => {
      console.log("cleared dreams");
      // clear the list of dreams on the page
      const dreamsList = document.getElementById("dreams");
      dreamsList.innerHTML = "";
    });
});
