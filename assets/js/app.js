const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
const fillImage = document.querySelector(".fill-image");
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
const filtersParent = document.querySelector(".filters");

let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "";

const getTodoHtml = (todo, index) => {
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
};

const showTodos = () => {
  if (todosJson.length === 0) {
    todosHtml.innerHTML = "";
    emptyImage.style.display = "block";
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join("");
    emptyImage.style.display = "none";
  }
};

showTodos();

const addTodo = (todo) => {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
};

onInputKeyup = (event) => {
  let todo = input.value.trim();
  if (!todo || event.key != "Enter") {
    return;
  }
  addTodo(todo);
};

onAddButtonmClick = () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
};

input.addEventListener("keyup", (event) => onInputKeyup(event));
addButton.addEventListener("click", () => onAddButtonmClick());

const updateStatus = (todo) => {
  let todoName = todo.parentElement.lastElementChild;
  let fillImageIndex = todo.id;
  let fillImageContainer = document.getElementById("fillImageContainer");
  let existingFillImage = fillImageContainer.querySelector(".fill-image");

  if (existingFillImage) {
    fillImageContainer.removeChild(existingFillImage);
  }

  if (todo.checked) {
    todoName.classList.add("checked");
    applyConfettiEffect();
    updateImageElement(fillImageIndex);
  } else {
    todoName.classList.remove("checked");
  }

  todosJson[todo.id].status = todo.checked ? "completed" : "pending";
  localStorage.setItem("todos", JSON.stringify(todosJson));
};

const applyConfettiEffect = () => {
  let canvas = document.createElement("canvas");
  let container = document.getElementsByClassName("gif-container")[0];
  canvas.width = 600;
  canvas.height = 600;

  container.appendChild(canvas);

  let confetti_button = confetti.create(canvas);
  confetti_button().then(() => container.removeChild(canvas));
};

const updateImageElement = (fillImageIndex) => {
  let fillImage = document.createElement("img");
  fillImage.src = "assets/images/todo-gif2.gif";
  fillImage.className = "fill-image";
  fillImage.setAttribute("data-index", fillImageIndex);
  fillImageContainer.appendChild(fillImage);

  setTimeout(() => {
    fillImage.classList.add("fill-image-hidden");
  }, 2500);
};

const remove = (todo) => {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
};

filtersParent.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("filter")) {
    const isActive = target.classList.contains("active");
    filters.forEach((filter) => filter.classList.remove("active"));
    if (!isActive) {
      target.classList.add("active");
      filter = target.dataset.filter;
    } else {
      filter = "";
    }
    showTodos();
  }
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});
