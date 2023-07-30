let add = document.getElementById("add");
let taskHolder = document.querySelector(".task-holder");
let tasksArray = [];
let input = document.getElementById("text");
let emptyBtn = document.querySelector(".empty");
if (window.localStorage.getItem("tasks")) {
  tasksArray = JSON.parse(window.localStorage.getItem("tasks"));
}
getDateLocal();
//when click add btn
add.onclick = function () {
  // get the input value
  if (input.value) {
    addTasksArray(input.value);
    input.value = "";
    emptyBtn.classList.remove("open");
  }
};
//when write
input.onkeydown = () => {
  //add enter key
  if (event.key === "Enter") {
    // get the input value
    if (input.value) {
      addTasksArray(input.value);
      input.value = "";
    }
    emptyBtn.classList.remove("open");
  }
};

input.oninput = () => {
  //empty btn
  if (input.value != "") {
    emptyBtn.classList.add("open");
  } else {
    emptyBtn.classList.remove("open");
  }
};
emptyBtn.onclick = () => {
  input.value = "";
  emptyBtn.classList.remove("open");
};
function addTasksArray(taskText) {
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  tasksArray.unshift(task);
  //add task to page
  addElementToPage(tasksArray);
  //add task to local storage
  addElementToLocal(tasksArray);
}
function addElementToPage(tasksArray) {
  // Empty Tasks Div
  taskHolder.innerHTML = "";

  tasksArray.forEach((task) => {
    //create task div
    let tasks = document.createElement("div");
    tasks.className = "task";
    tasks.setAttribute("data-id", task.id);
    //Check if task is done
    if (task.completed) {
      tasks.classList.add("done");
    }

    //create task  div
    let div = tasks.cloneNode(false);
    div.className = "content";
    let inputDiv = document.createElement("textarea");

    //add task time
    let time = document.createElement("span");
    time.className = "time";
    function getTime() {
      let da = Date.now() - new Date(task.id);
      if (da < 60000) {
        time.innerHTML = "now";
      } else if (da < 60000 * 60) {
        time.innerHTML = `${Math.floor(da / 1000 / 60)}m ago`;
      } else if (da < 60000 * 60 * 24) {
        time.innerHTML = `${Math.floor(da / 1000 / 60 / 60)}h ago`;
      } else if (da > 60000 * 60 * 24) {
        time.innerHTML = `${Math.floor(da / 1000 / 60 / 60 / 24)}d ago`;
      }
    }
    getTime();
    setInterval(() => {
      getTime();
    }, 60000);

    //append task div to contaienr
    inputDiv.innerHTML = task.title;

    div.appendChild(time);
    div.appendChild(inputDiv);
    tasks.appendChild(div);
    taskHolder.appendChild(tasks);
    //create setting button
    let settingHolder = document.createElement("div"); //setting holder
    let icon = document.createElement("i");

    let settingIcon = icon.cloneNode(false); //setting icon
    settingIcon.className = "fa-solid fa-gear";
    settingHolder.className = "setting";

    let span = document.createElement("span"); //edit icon
    let spanIcon = icon.cloneNode(false);
    spanIcon.className = "fa-solid fa-pencil";
    span.className = "edit";

    let del = span.cloneNode(false); //delete icon
    let delIcon = icon.cloneNode(false);
    del.className = "delete";
    delIcon.className = "fa-solid fa-trash";

    let done = span.cloneNode(false); //done icon
    let doneIcon = icon.cloneNode(false);
    done.className = "done";
    doneIcon.className = "fa-solid fa-check";

    //append setting button to task contaienr
    settingHolder.appendChild(settingIcon);
    span.appendChild(spanIcon);
    settingHolder.appendChild(span);
    del.appendChild(delIcon);
    settingHolder.appendChild(del);
    done.appendChild(doneIcon);
    settingHolder.appendChild(done);
    tasks.appendChild(settingHolder);

    //open and close settings
    settingHolder.onclick = function () {
      span.classList.toggle("open");
      del.classList.toggle("open");
      done.classList.toggle("open");
    };
    tasks.onmouseleave = function () {
      span.classList.remove("open");
      del.classList.remove("open");
      done.classList.remove("open");
    };
    inputDiv.style.height = inputDiv.scrollHeight + "px";
    //when click on DELETE btn
    del.onclick = function () {
      tasks.remove();
      deleteTask(tasks.dataset.id);
      for (let i = 0; i < tasksArray.length; i++) {
        if (tasksArray[i].id == tasks.dataset.id) {
          tasksArray[i].delete = "deleted";
        }
      }
    };

    //when click on DONE btn
    done.onclick = function () {
      tasks.classList.toggle("done");
      for (let i = 0; i < tasksArray.length; i++) {
        if (tasksArray[i].id == tasks.dataset.id) {
          tasksArray[i].completed == false
            ? (tasksArray[i].completed = true)
            : (tasksArray[i].completed = false);
        }
      }
      inputDiv.classList.remove("edit");
      addElementToLocal(tasksArray);
    };

    //when click on edit btn
    function editFun() {
      if (inputDiv.value) {
        for (let i = 0; i < tasksArray.length; i++) {
          if (tasksArray[i].id == tasks.dataset.id) {
            tasksArray[i].title = inputDiv.value;
            tasksArray[i].completed = false;
            addElementToLocal(tasksArray);
          }
        }
      }
      addElementToLocal(tasksArray);
    }
    setInterval(() => {
      inputDiv.style.height = inputDiv.scrollHeight + "px";
    }, 10);
    span.onclick = function () {
      inputDiv.classList.toggle("edit");
      tasks.classList.remove("done");
      editFun();
      inputDiv.focus();
      inputDiv.setSelectionRange(inputDiv.value.length, inputDiv.value.length);
    };
    //when edit tasks

    inputDiv.onkeydown = () => {
      if (event.key === "Enter") {
        event.preventDefault();
        // get the input value
        editFun();
        inputDiv.classList.toggle("edit");
        tasks.classList.remove("done");
      }
      if (event.keyCode === 9) {
        event.preventDefault();
      }
    };
  });
}
function deleteTask(taskId) {
  tasksArray = tasksArray.filter((task) => task.id != taskId);
  addElementToLocal(tasksArray);
}
function addElementToLocal(tasksArray) {
  tasksArray = tasksArray.filter((task) => task.delete != "deleted");
  window.localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

function getDateLocal() {
  let data = window.localStorage.tasks;
  if (data) {
    let tasks = JSON.parse(data);
    addElementToPage(tasks);
  }
}

//add today data
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

let today = document.querySelector(".today");
today.innerHTML = new Date().toLocaleDateString(undefined, options);
