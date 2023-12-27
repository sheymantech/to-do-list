"use strict";
const firstCont = document.querySelector(".main-cont");
const inputSelect = document.getElementById("form-input");
const submitBtn = document.querySelector("form");
const groceryListCont = document.querySelector(".grocery-list");
const btnClearItems = document.querySelector(".clear-item");
const btn = document.querySelector(".submit-btn");
let editFlag = false;
let editElement;
let editId = "";
//load items

window.addEventListener("DOMContentLoaded", setUpItems);

const addItem = function (e) {
  const value = inputSelect.value;
  e.preventDefault();
  const id = new Date().getTime().toString();
  if (value !== "" && !editFlag) {
    const element = document.createElement("div");
    element.classList.add("items");
    let atrr = document.createAttribute("data-id");
    atrr.value = id;
    element.setAttributeNode(atrr);
    element.innerHTML = `
    <p>${value}</p>
    <div class="btn-edit-wrapper">
      <button class="edit">
        <i class="bi bi-pencil-square"></i>
      </button>
      <button class="delete">
        <i class="bi bi-trash3-fill"></i>
      </button>
    </div>
    `;
    groceryListCont.insertAdjacentElement("afterbegin", element);
    actionMessage("success", "item successfully added");

    btnClearItems.classList.remove("hidden");
    setToDefault();
    /// selection
    const deleteBtn = element.querySelector(".delete");
    deleteBtn.addEventListener("click", deleteItem);
    const edit = element.querySelector(".edit");

    edit.addEventListener("click", editItem);
    addToLocalStorage(id, value);
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    setToDefault();
    editLocalStorage(editId, value);
    actionMessage("success", "item edited succesfully");
  } else actionMessage("danger", "please input some value");
};

const setToDefault = function () {
  inputSelect.value = "";
  btn.textContent = "submit";
  editFlag = false;
};

const actionMessage = function (action, message) {
  const html = `
    <span class="${action}">${message}</span>
    `;
  firstCont.insertAdjacentHTML("afterbegin", html);
  const messageSpan = firstCont.querySelector("span");
  setTimeout(function () {
    firstCont.removeChild(messageSpan);
  }, 1500);
};

// edit functionality implementation
const editItem = function (e) {
  const element = e.currentTarget.parentElement.parentElement;
  editFlag = true;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  inputSelect.value = editElement.innerHTML;
  btn.textContent = "edit";

  editId = element.dataset.id;
};

//clear button implementation
const clearItems = function () {
  const item = document.querySelectorAll(".items");
  if (item.length > 0) {
    item.forEach((item) => {
      groceryListCont.removeChild(item);
    });

    setToDefault();
    btnClearItems.classList.add("hidden");
    actionMessage("danger", "All items cleared");
    localStorage.removeItem("list");
  }
};

const deleteItem = function (e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  groceryListCont.removeChild(element);
  const item = document.querySelectorAll(".items");
  if (item.length === 0) {
    btnClearItems.classList.add("hidden");
  }
  actionMessage("danger", "item deleted successfully");
  removeFromLocalStorage(id);
};
btnClearItems.addEventListener("click", clearItems);

submitBtn.addEventListener("submit", addItem);
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function addToLocalStorage(id, value) {
  const list = { id, value: `${value}` };
  let items = getLocalStorage();
  items.push(list);
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((items) => {
    if (items.id !== id) {
      return items;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function setUpItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItems(item.id, item.value);
    });
  }
}

function createListItems(id, value) {
  const element = document.createElement("div");
  element.classList.add("items");
  let atrr = document.createAttribute("data-id");
  atrr.value = id;
  element.setAttributeNode(atrr);
  element.innerHTML = `
  <p>${value}</p>
  <div class="btn-edit-wrapper">
    <button class="edit">
      <i class="bi bi-pencil-square"></i>
    </button>
    <button class="delete">
      <i class="bi bi-trash3-fill"></i>
    </button>
  </div>
  `;
  groceryListCont.insertAdjacentElement("afterbegin", element);
  actionMessage("success", "item successfully added");

  btnClearItems.classList.remove("hidden");
  setToDefault();
  /// selection
  const deleteBtn = element.querySelector(".delete");
  deleteBtn.addEventListener("click", deleteItem);
  const edit = element.querySelector(".edit");

  edit.addEventListener("click", editItem);
}
