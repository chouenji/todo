const ul = $("#items");

function addItem() {
  event.preventDefault();

  const add = $("#add-items");
  let value = add.val();
  if (value !== "") {
    const li = $(`<li class="item">
    <span class="text" onkeypress="return this.textContent.length <= 30">${value}</span>
    <i onclick="editItem(this.parentElement.firstElementChild)" class="icon edit fas fa-edit"></i>
    <i onclick="removeItem(this.parentElement)" class="icon trash fas fa-trash-alt"></i>
    </li>`);
    ul.append(li);
    saveLocalStorage();
    add.val("");
  }
}

function deleteItems() {
  event.preventDefault();
  swal({
    title:
      "You will not be able to undo once you choose to delete selected items or everything.",
    buttons: {
      option1: {
        text: "Delete selected items",
        value: "selectedItems",
      },
      option2: {
        text: "Delete everything",
        value: "deleteEverything",
      },
      cancel: true,
    },
    icon: "warning",
    dangerMode: true,
  }).then((value) => {
    if (value === "selectedItems") {
      const li = ul.children("li");
      let storage = [];

      let i = 0;
      let j = 0;
      li.each(() => {
        if (li[i].lastElementChild.classList.contains("fa-undo")) {
          storage[j++] = li[i].textContent.trim();
        }
        i++;
      });

      removeLocalStorage(storage);
      location.reload();
    } else if (value === "deleteEverything") {
      localStorage.clear();
      ul.empty();
    } else {
      swal("No items were removed!");
    }
  });
}

function removeItem(item) {
  console.log(item.children[2].classList.contains("fa-trash-alt"));
  if (item.children[2].classList.contains("fa-trash-alt")) {
    checkRemoveIcon(
      item,
      "line-through",
      "rgb(21, 30, 37)",
      "fa-trash-alt",
      "fa-undo"
    );
  } else {
    checkRemoveIcon(item, "none", "rgb(39, 59, 77)", "fa-undo", "fa-trash-alt");
  }
}

function checkRemoveIcon(item, textDecoration, backgroundColor, remove, add) {
  item.firstElementChild.style.textDecoration = textDecoration;
  item.style.backgroundColor = backgroundColor;
  item.children[2].classList.remove(remove);
  item.children[2].classList.add(add);
}

function editItem(item) {
  if (!item.isContentEditable) {
    editContent(item, true, "rgb(56, 85, 110)", "fa-edit", "fa-paper-plane");
  } else {
    editContent(item, false, "rgb(39, 59, 77)", "fa-paper-plane", "fa-edit");
  }
}

function editContent(
  item,
  isContentEditable,
  backgroundColor,
  addClass,
  removeClass
) {
  item.addEventListener("keypress", (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      editContent(item, false, "rgb(39, 59, 77)", "fa-paper-plane", "fa-edit");
    }
  });
  item.setAttribute("contentEditable", isContentEditable);
  item.parentElement.style.backgroundColor = backgroundColor;
  item.parentElement.children[1].classList.remove(addClass);
  item.parentElement.children[1].classList.add(removeClass);
  item.focus();
  saveLocalStorage();
}

function saveEditItems(item) {
  const li = ul.children("li");
  let index = 0;
  for (let i = 0; i < li.length; i++) {
    if (item.textContent === li[i].firstElementChild) {
      index = i;
      break;
    }
  }

  localStorage.setItem(index, item.textContent);
}

function saveLocalStorage() {
  const li = ul.children("li");
  let i = 0;
  li.each(() => {
    localStorage.setItem(i, li[i++].textContent.trim());
  });
}

function removeLocalStorage(item) {
  for (let i = 0; i < item.length; i++) {
    for (let j = 0; j < localStorage.length; j++) {
      if (item[i] === localStorage.getItem(j)) {
        localStorage.setItem(j, "removed");
      }
    }
  }
}

function saveList() {
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.getItem(i) !== "removed") {
      const li = $(`<li class="item">
                    <span class="text" onkeypress="return this.textContent.length <= 30">
                    ${localStorage.getItem(i)}</span>
                    <i onclick="editItem(this.parentElement.firstElementChild)" class="icon edit fas fa-edit"></i>
                    <i onclick="removeItem(this.parentNode)" class="icon trash fas fa-trash-alt"></i>
                    </li>`);
      ul.append(li);
    }
  }

  clearStorage();
}

function clearStorage() {
  let storage = [];
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.getItem(i) !== "removed")
      storage.push(localStorage.getItem(i));
  }

  localStorage.clear();

  for (let i = 0; i < storage.length; i++) {
    localStorage.setItem(i, storage[i]);
  }
}

saveList();
