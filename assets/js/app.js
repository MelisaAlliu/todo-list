const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
const fillImage = document.querySelector(".fill-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = "";

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return "";
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return `
      <li class="todo">
        <label for="${index}">
          <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked} data-index="${index}">
          <span class="${checked}">${todo.name}</span>
        </label>
        <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
      </li>
    `;
}

function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = "";
    emptyImage.style.display = "block";
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join("");
    emptyImage.style.display = "none";
  }
}

function addTodo(todo) {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", (e) => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  let fillImageIndex = todo.id;
  let fillImageContainer = document.getElementById("fillImageContainer");
  let existingFillImage = fillImageContainer.querySelector(".fill-image");

  if (existingFillImage) {
    fillImageContainer.removeChild(existingFillImage);
  }

  if (todo.checked) {
    todoName.classList.add("checked");

    // Confetti effect
    let canvas = document.createElement("canvas");
    let container = document.getElementsByClassName("gif-container")[0];
    canvas.width = 600;
    canvas.height = 600;

    container.appendChild(canvas);

    let confetti_button = confetti.create(canvas);
    confetti_button().then(() => container.removeChild(canvas));

    // Image element
    let fillImage = document.createElement("img");
    fillImage.src = "assets/images/todo-gif2.gif";
    fillImage.className = "fill-image";
    fillImage.setAttribute("data-index", fillImageIndex);
    fillImageContainer.appendChild(fillImage);

    setTimeout(() => {
      fillImage.classList.add("fill-image-hidden");
    }, 3500);
  } else {
    todoName.classList.remove("checked");
  }

  todosJson[todo.id].status = todo.checked ? "completed" : "pending";
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains("active")) {
      el.classList.remove("active");
      filter = "";
    } else {
      filters.forEach((tag) => tag.classList.remove("active"));
      el.classList.add("active");
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});
