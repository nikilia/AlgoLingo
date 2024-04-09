// Fetch and display AlgoLingo entries
function displayAlgoLingo() {
    const AlgoLingoList = document.getElementById("AlgoLingoList");

    // Fetch AlgoLingo entries from the server
    fetch("/getAlgoLingo")
        .then(res => res.json())
        .then(AlgoLingo => {
            // Clear existing list
            AlgoLingoList.innerHTML = "";
            // Iterate over AlgoLingo and append to list
            AlgoLingo.forEach(entry => {
                appendAlgoLingoEntry(entry);
            });
        });
}

// Append a single AlgoLingo entry to the list
function appendAlgoLingoEntry(entry) {
    const AlgoLingoList = document.getElementById("AlgoLingoList");
    const listItem = document.createElement("li");
    listItem.textContent = entry.AlgoLingo;

    // Create delete button for this entry
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => {
        deleteAlgoLingoEntry(entry.id);
        location.reload();
    });

    // Append delete button to list item
    listItem.appendChild(deleteButton);

    // Append list item to list
    AlgoLingoList.appendChild(listItem);
}

// Function to delete an AlgoLingo entry
function deleteAlgoLingoEntry(id) {
    fetch(`/deleteAlgoLingo/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(response => {
        console.log("Deleted AlgoLingo entry:", response);
        // Reload the page to reflect the updated list
        location.reload();
    })
    .catch(error => {
        console.error("Error deleting AlgoLingo entry:", error);
    });
}



// Function to clear all AlgoLingo entries
function clearAlgoLingo() {
    fetch("/clearAlgoLingo", {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(response => {
        console.log("Cleared AlgoLingo entries");
        // Reload AlgoLingo entries after clearing
        displayAlgoLingo();
    })
    .catch(error => {
        console.error("Error clearing AlgoLingo entries:", error);
    });
}

// Call displayAlgoLingo when the page loads
document.addEventListener("DOMContentLoaded", () => {
    displayAlgoLingo();
});

// Add event listener for clear button
const clearButton = document.getElementById("clear-AlgoLingo");
clearButton.addEventListener("click", () => {
    clearAlgoLingo();
});
