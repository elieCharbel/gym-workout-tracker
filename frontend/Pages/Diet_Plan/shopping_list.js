// Shopping list array to hold items in memory
let shoppingList = [];

// Function to add an item to the shopping list
function addItem(event) {
  event.preventDefault();  // Prevent form submission reload
  
  const itemInput = document.getElementById('shopping-item');
  const itemName = itemInput.value.trim();

  // Add item to the shopping list array
  if (itemName) {
    shoppingList.push(itemName);
    renderShoppingList();
    itemInput.value = '';  // Clear input field
  }
}

// Render the shopping list items on the page
function renderShoppingList() {
  const shoppingListItems = document.getElementById('shopping-list-items');
  shoppingListItems.innerHTML = '';  // Clear current list

  shoppingList.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    listItem.innerText = item;

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
    deleteButton.innerText = 'Remove';
    deleteButton.onclick = () => removeItem(index);  // Attach remove function
    listItem.appendChild(deleteButton);

    shoppingListItems.appendChild(listItem);
  });
}

// Remove an item from the shopping list
function removeItem(index) {
  shoppingList.splice(index, 1);  // Remove item by index
  renderShoppingList();  // Re-render list
}

// Initialize shopping list rendering on page load
document.addEventListener('DOMContentLoaded', renderShoppingList);
