// Handle go-up button
let goUp = document.querySelector(".go-up");

window.onscroll = function () {
  if (window.scrollY >= 900) goUp.style.display = "block";
  else goUp.style.display = "none";
};

goUp.onclick = function () {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

// Tasks Section
let input = document.querySelector('[name="task"]');
let container = document.querySelector(".tasks .container");

let myTasks = [];
let counter = 0;

// handle clear all button
let clearBtn = document.querySelector(".clear-all");

clearBtn.onclick = function () {
  // clear localStorage
  window.localStorage.clear();

  // clear myTasks
  myTasks = [];

  // clear container contents
  container.innerHTML = "";

  // update counter
  counter = 0;
  document.querySelector(".count").innerHTML = counter;
};

// if localStorage is not empty
if (localStorage.getItem("tasks")) {
  myTasks = JSON.parse(localStorage.getItem("tasks"));
  counter = parseInt(localStorage.getItem("counter"));
}

fromLocalStorage();

window.onload = function () {
  input.focus();
};

// on form submit (i.e. adding a task)
document.forms[0].onsubmit = function (e) {
  e.preventDefault();

  arrayOfTasks(input.value);

  // reset input field
  input.value = "";

  // update counter value
  document.querySelector(".count").innerHTML = ++counter;
  window.localStorage.setItem("counter", counter);
};

container.addEventListener("click", function (e) {
  // handle deletion button
  if (e.target.className === "del") {
    // remove the task from localStorage using id (task div id)
    deleteTask(e.target.parentElement.getAttribute("id"));

    // remove the task div
    e.target.parentElement.remove();

    // update counter value
    document.querySelector(".count").innerHTML = --counter;
    window.localStorage.setItem("counter", counter);
  }

  // handle completed tasks
  if (e.target.tagName.toLowerCase() === "p") {
    e.target.parentElement.classList.toggle("done");
    toggleStatus(e.target.parentElement.getAttribute("id"));
  } else if (e.target.classList.contains("task")) {
    e.target.classList.toggle("done");
    toggleStatus(e.target.getAttribute("id"));
  }
});

function arrayOfTasks(inp) {
  // task data
  const values = {
    id: Math.ceil(10_000 * Math.random()),
    title: inp,
    status: false,
  };

  // push data to tasks array
  myTasks.push(values);

  // add tasks to the page
  addTasks(myTasks);

  // add tasks to localStorage
  toLocalStorage(myTasks);
}

function addTasks(myTasks) {
  container.innerHTML = "";

  myTasks.forEach((task) => {
    // create task div
    let taskDiv = document.createElement("div");
    taskDiv.setAttribute("id", task.id);

    // done or not?
    if (task.status) taskDiv.className = "task done";
    else taskDiv.className = "task";

    container.appendChild(taskDiv);

    // create p inside task div
    let p = document.createElement("p");
    p.className = "text";
    p.appendChild(document.createTextNode(task.title));
    taskDiv.appendChild(p);

    // create delete button
    let delBtn = document.createElement("button");
    delBtn.append("Delete");
    delBtn.className = "del";
    taskDiv.appendChild(delBtn);
  });
}

function toLocalStorage(myTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(myTasks));
}

function fromLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addTasks(tasks);
    document.querySelector(".count").innerHTML = counter;
  }
}

function deleteTask(taskId) {
  myTasks = myTasks.filter((task) => task.id != taskId);
  toLocalStorage(myTasks);
}

function toggleStatus(taskId) {
  for (let i = 0; i < myTasks.length; i++) {
    if (myTasks[i].id == taskId) {
      myTasks[i].status == false
        ? (myTasks[i].status = true)
        : (myTasks[i].status = false);
    }
  }

  toLocalStorage(myTasks);
}
