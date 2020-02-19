
'use strict';

const STORE = {
  items: [
    { id: cuid(), name: 'apples', isChecked: false, isEditing: false },
    { id: cuid(), name: 'oranges', isChecked: false, isEditing: false },
    { id: cuid(), name: 'milk', isChecked: true, isEditing: false },
    { id: cuid(), name: 'bread', isChecked: false, isEditing: false }
  ],
  hideChecked: false,
  searchTerm: null,
  lastInFocus: null,
};


function addListItem(itemName) {
  console.log(`Adding "${itemName}" to shopping list.`);

  STORE.items.push({
    id: cuid(),
    name: itemName,
    isChecked: false,
    isEditing: false
  });
}

function deleteListItem(itemId) {
  console.log(`Deleting item at index ${itemId} from shopping list.`);

 
  STORE.items.splice(itemId, 1);
}

function editItemName(itemId, newName) {
  const currentItem = STORE.items.find(item => item.id === itemId);
 
  if (currentItem.name === newName) {
    console.error('Please enter a new name!');
    return;
  }
  console.log(`Renaming ${currentItem.name} to ${newName}`);
  currentItem.name = newName;
}

function toggleItemChecked(itemId) {
  const currentItem = STORE.items.find(item => item.id === itemId)
  currentItem.isChecked = !currentItem.isChecked;
  console.log(`Toggling checked property for item at index ${itemId}.`);
}

function toggleItemEditing(itemId) {
  console.log(`Toggling editing property for item at index ${itemId}.`);
  STORE.items.map((item, idx) => {
    
    item.isEditing = (item.id === itemId ? !item.isEditing : false);
  });
}

function updateSearchTerm(term) {
  STORE.searchTerm = term;
}

function toggleCheckedVisibility() {
  STORE.hideChecked = !STORE.hideChecked;
}



function renderShoppingList() {
  
  console.log('`renderShoppingList` ran');

  const items = STORE.items.filter(shouldRender);
  const shoppingListItemsString = generateListItemString(items);
  const itemNoun = items.length === 1 ? 'item' : 'items';

  
  $('.js-list-count').text(`${items.length} ${itemNoun}`);
  
  $('.js-shopping-list').html(shoppingListItemsString);
}


function shouldRender(item) {
  
  const { hideChecked, searchTerm } = STORE;

  
  if (hideChecked && item.isChecked) {
    
    return false;
  }

  
  if (searchTerm) {
    
    return item.name
      .toLowerCase()
      .indexOf(searchTerm.toLowerCase()) !== -1;
  }
  
  return true;

}

function generateListItemString(shoppingList) {
  console.log('Generating the list.');

  return shoppingList
    
    .map(generateItemElem)
    
    .join('');
}

function generateItemElem(item, itemId) {
  const checkedClass = item.isChecked ? 'shopping-item__checked' : '';
  const checkBtnTxt = item.isChecked ? 'uncheck' : 'check';

  
  let itemHTML = (
    `<span class="shopping-item js-shopping-item ${checkedClass}">
      ${item.name}
    </span>
    <div class="shopping-item-controls">
    <button type="button" class="shopping-item-toggle js-toggle-checked">
      <span class="button-label">${checkBtnTxt}</span>
    </button>
    <button type="button" class="shopping-item-edit js-toggle-edit">
      <span class="button-label">edit</span>
    </button>
    <button type="button" class="shopping-item-delete js-delete-item">
      <span class="button-label">delete</span>
    </button>
  </div>`
  );

  
  if (item.isEditing) {

    
    itemHTML = (
      `<form id="js-edit-form">
        <input
          type="text"
          id="name"
          class="js-updated-name shopping-item"
          name="name"
          value="${item.name}"
          aria-label="Rename ${item.name}"
        >
        <div class="shopping-item-controls">
          <button type="button"class="shopping-item-cancel-edit js-toggle-edit">
            <span class="button-label">cancel</span>
          </button>
          <button type="submit" class="shopping-item-save-edit js-save-edit">
            <span class="button-label">save</span>
          </button>
        </div>
      </form>`
    );
  }

  
  return (
    `<li class="js-item-index-element" data-item-cuid="${item.id}">
      ${itemHTML}
    </li>`
  );
}



function handleAddItemSubmit() {
  $('#js-shopping-list-form').on('submit', function (e) {
    e.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addListItem(newItemName);
    renderShoppingList();
  });
}

function handleSearchSubmit() {
  $('#js-search-form').on('submit', function (e) {
    e.preventDefault();
    const term = $('.js-search-term').val();
    updateSearchTerm(term);
    renderShoppingList();
  });
}


function getitemIdFromElement(elem) {
  return $(elem)
    
    .closest('.js-item-index-element')
    
    .data('item-cuid');
}


function handleItemCheck() {
  $('.js-shopping-list').on('click', '.js-toggle-checked', function (e) {
    console.log('`handleItemCheck` ran');
    
    const itemId = getitemIdFromElement(e.currentTarget);
    
    toggleItemChecked(itemId);
    
    renderShoppingList();
  });
}

function handleToggleCheckedVisibility() {
  $('#js-search-form').on('change', '.js-toggle-checked', function (e) {
    toggleCheckedVisibility();
    renderShoppingList();
  });
}

function handleItemDelete() {
  $('.js-shopping-list').on('click', '.js-delete-item', function (e) {
    const itemId = getitemIdFromElement(e.currentTarget);
    deleteListItem(itemId);
    renderShoppingList();
  });
}

function handleToggleItemEdit() {
  $('.js-shopping-list').on('click', '.js-toggle-edit', function (e) {
    const itemId = getitemIdFromElement(e.currentTarget);
    toggleItemEditing(itemId);
    renderShoppingList();
  });
}

function handleEditItemSubmit() {
  $('.js-shopping-list').on('submit', '#js-edit-form', function (e) {
    e.preventDefault();
    const itemId = getitemIdFromElement(e.currentTarget);
    const updatedItemName = $('.js-updated-name').val();
    editItemName(itemId, updatedItemName);
    toggleItemEditing(itemId);
    renderShoppingList();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleAddItemSubmit();
  handleSearchSubmit();
  handleToggleCheckedVisibility();
  handleItemCheck();
  handleItemDelete();
  handleToggleItemEdit();
  handleEditItemSubmit();
}

$(handleShoppingList);