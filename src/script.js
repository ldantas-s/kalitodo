const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const btnAddTodo = document.querySelector('.btn-add');

const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

let LIST, id;

let data = localStorage.getItem("TODO");

if (data) {
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST);
} else {
  LIST = [];
  id = 0;
}

function loadList(array) {
  array.forEach(function (item) {
    showTodo(item.name, item.id, item.done, item.trash);
  });
}

clear.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});

const options = { weekday: "long", month: "short", day: "numeric" };
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("en-US", options);

function showTodo(toDo, id, done, trash) {
  if (trash) {
    return;
  }

  const DONE = done ? CHECK : UNCHECK;
  const LINE = done ? LINE_THROUGH : "";

  const item = `<li class="item">
                    <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                    <p class="text ${LINE}">${toDo}</p>
                    <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                  </li>
                `;

  const position = "beforeend";

  list.insertAdjacentHTML(position, item);
}

// Update
document.addEventListener("keyup", function (event) {
  // KeyboardEvent.keyCode is Deprecated 
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
  if (event.key === 'Enter') {
    addTodo();
  }
});

// Add: Action add to do of button
btnAddTodo.addEventListener('click', function(event) {

  addTodo();

});

// Refactor: Show todo in DOM and add todo in localstorage
function addTodo() {
  const toDo = input.value;

  if (toDo) {
    showTodo(toDo, id, false, false);

    LIST.push({
      name: toDo,
      id: id,
      done: false,
      trash: false,
    });

    localStorage.setItem("TODO", JSON.stringify(LIST));

    id++;
  }
  input.value = "";
}


function completeToDo(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

  LIST[element.id].done = LIST[element.id].done ? false : true;
}

function removeToDo(element) {
  element.parentNode.parentNode.removeChild(element.parentNode);

  LIST[element.id].trash = true;
}

// Fix error
list.addEventListener("click", function (event) {
  const element = event.target;
  // correct error that was showing in the console when clicking on the list element, where it looks for the job attribute
  const elementJob = element.attributes.job ? element.attributes.job.value:null;

  if (elementJob === "complete") {
    completeToDo(element);
  } else if (elementJob === "delete") {
    removeToDo(element);
  }

  localStorage.setItem("TODO", JSON.stringify(LIST));
});
