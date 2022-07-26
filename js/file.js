// handle go-up button
let goUp = document.querySelector("button.go-up");

window.onscroll = function () {
  scrollY >= 900
    ? (goUp.style.display = "block")
    : (goUp.style.display = "none");
};

goUp.onclick = function () {
  scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

// Handle tasks
let input = document.querySelector('[name="task"]');
let container = document.querySelector(".tasks .container");

let myTasks = [],
  counter = 0;

// focus on input feild on load
window.onload = function () {
  input.focus();

  if (localStorage.getItem("tasks")) fromLocalStorage();
};

// on form submission (i.e adding a task)
document.forms[0].onsubmit = function (e) {
  e.preventDefault();
  arrayOfTasks(input.value);
  input.value = "";
};

container.addEventListener("click", function (e) {
  // handle completed task
  if (e.target.classList.contains("task")) {
    e.target.classList.toggle("done");
    toggleStatus(e.target.getAttribute("id"));
  } else if (e.target.tagName.toLowerCase() === "p") {
    e.target.parentElement.classList.toggle("done");
    toggleStatus(e.target.parentElement.getAttribute("id"));
  }

  // handle delete task button
  if (e.target.classList.contains("del")) {
    --counter;
    deleteTask(e.target.parentElement.getAttribute("id"));

    // remove parent element
    e.target.parentElement.remove();

    // update counter value
    document.querySelector(".count").innerHTML = counter;
  }
});

// handle clear all button
let clearBtn = document.querySelector(".clear-all");
clearBtn.onclick = function () {
  // reset tasks array
  myTasks = [];

  // clear tasks container
  container.innerHTML = "";

  // reset counter value
  counter = 0;
  document.querySelector(".count").innerHTML = counter;

  // clear localStorage
  window.localStorage.clear();
};

function arrayOfTasks(inp) {
  const values = {
    id: Math.ceil(10_000 * Math.random()),
    title: inp,
    status: false,
  };

  myTasks.push(values);
  addTask(myTasks);

  // update counter
  document.querySelector(".count").innerHTML = ++counter;

  // add tasks to localStorage
  toLocalStorage(myTasks);
}

function addTask(myTasks) {
  container.innerHTML = "";

  myTasks.forEach((task) => {
    // <div class="task"></div>
    let taskDiv = document.createElement("div");
    taskDiv.setAttribute("id", task.id);

    // check if the task is done or not
    if (task.status === true) taskDiv.className = "task done";
    else taskDiv.className = "task";

    container.appendChild(taskDiv);

    // <div class="task"> <p></p> </div>
    let p = document.createElement("p");
    p.append(task.title);
    taskDiv.appendChild(p);

    // <div class="task"> <button>Delete</button> </div>
    let delBtn = document.createElement("button");
    delBtn.className = "del";
    delBtn.append("Delete");
    taskDiv.appendChild(delBtn);
  });
}

function toggleStatus(taskId) {
  // update tasks array
  for (let i = 0; i < myTasks.length; i++) {
    if (myTasks[i].id == taskId) {
      myTasks[i].status === false
        ? (myTasks[i].status = true)
        : (myTasks[i].status = false);
    }
  }

  // update value in localStorage
  toLocalStorage(myTasks);
}

function deleteTask(taskId) {
  // return all tasks except the deleted task
  myTasks = myTasks.filter((task) => task.id != taskId);

  // update localStorage
  toLocalStorage(myTasks);
}

function toLocalStorage(myTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(myTasks));
  window.localStorage.setItem("counter", counter);
}

function fromLocalStorage() {
  // get data from localStorage
  let data = window.localStorage.getItem("tasks");

  // update tasks array
  myTasks = JSON.parse(data);

  // add tasks to the page
  addTask(myTasks);

  counter = localStorage.getItem("counter");
  document.querySelector(".count").innerHTML = counter;
}
