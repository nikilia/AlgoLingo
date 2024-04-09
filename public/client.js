// client.js
console.log("🎈🍏🪼🦴");

// function to fetch and display AlgoLingo
const displayAlgoLingo = () => {
  const AlgoLingoList = document.getElementById("AlgoLingo");

  // request the AlgoLingo from the server
  fetch("/getAlgoLingo")
    .then(res => res.json())
    .then(AlgoLingo => {
      // clear existing list
      AlgoLingoList.innerHTML = "";
      // iterate over AlgoLingo and append to list
      AlgoLingo.forEach(AlgoLingo => {
        appendNewAlgoLingo(AlgoLingo.AlgoLingo);
      });
    }); 
};

// function to append a AlgoLingo to the list
const appendNewAlgoLingo = AlgoLingo => {
  const AlgoLingoList = document.getElementById("AlgoLingo");
  const newListItem = document.createElement("li");
  newListItem.innerText = AlgoLingo;
  AlgoLingoList.appendChild(newListItem);
  
};

//call the scroll function after page load
document.addEventListener("DOMContentLoaded", () => { 
  
  displayAlgoLingo();
  console.log("algolingo displayed");

  
});

// define variables that reference elements on our page
const AlgoLingoForm = document.forms[0];
const AlgoLingoInput = AlgoLingoForm.elements["AlgoLingo"];

// listen for the form to be submitted and add a new AlgoLingo when it is
AlgoLingoForm.onsubmit = event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  const data = { AlgoLingo: AlgoLingoInput.value };

  fetch("/addAlgoLingo", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
      console.log(JSON.stringify(response));
      displayAlgoLingo();
    });
  // get AlgoLingo value and add it to the list
  appendNewAlgoLingo(AlgoLingoInput.value);
  

  // reset form
  AlgoLingoInput.value = "";
  AlgoLingoInput.focus();
};

const clearButton = document.querySelector('#clear-AlgoLingo');
clearButton.addEventListener('click', event => {
  fetch("/clearAlgoLingo", {})
    .then(res => res.json())
    .then(response => {
      console.log("cleared AlgoLingo");
      // clear the list of AlgoLingo on the page
      const AlgoLingoList = document.getElementById("AlgoLingo");
      AlgoLingoList.innerHTML = "";
    });
  
});
