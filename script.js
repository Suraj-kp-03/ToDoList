// ======= SELECTORS =======
const form = document.querySelector('.input-field');
const input = document.querySelector('input');
const taskList = document.querySelector('.task-list');

// ======= STATE & STORAGE HELPERS =======
let tasks = []; // will hold { id, text, completed }

// Load from localStorage on first run
function loadTasks() {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    tasks = JSON.parse(stored);
    tasks.forEach(renderTask);
  }
}

// Save current tasks[] to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ======= RENDERING =======
function renderTask(taskObj) {
  const { id, text, completed } = taskObj;

  const listItem = document.createElement('li');
  listItem.dataset.id = id;

  const taskDiv = document.createElement('div');
  taskDiv.classList.add('task-info');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.addEventListener('change', () => {
    // Toggle completion in state + persist
    taskObj.completed = checkbox.checked;
    saveTasks();
  });

  const taskName = document.createElement('span');
  taskName.innerText = text;
  if (completed) taskName.classList.add('done'); // you can style .done in CSS

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;

  listItem.append(taskDiv, deleteButton);
  taskDiv.append(checkbox, taskName);
  taskList.appendChild(listItem);
}

// ======= ADD TASK =======
function addTask(event) {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now().toString(), // simple unique ID
    text,
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  renderTask(newTask);

  input.value = '';
}

// ======= TASK MODIFICATIONS =======
function taskModify(event) {
  const clicked = event.target;

  // DELETE
  if (clicked.closest('button.delete')) {
    const li = clicked.closest('li');
    const id = li.dataset.id;
    // remove from DOM
    li.remove();
    // remove from state + persist
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    return;
  }

  // EDIT
  if (clicked.tagName.toLowerCase() === 'span') {
    const span = clicked;
    const id = span.closest('li').dataset.id;
    const taskObj = tasks.find(t => t.id === id);

    // Replace with input
    const inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    inputEdit.value = taskObj.text;
    span.replaceWith(inputEdit);
    inputEdit.focus();

    inputEdit.addEventListener('blur', () => {
      const newText = inputEdit.value.trim();
      if (newText) {
        taskObj.text = newText;
        saveTasks();
        span.innerText = newText;
      }
      inputEdit.replaceWith(span);
    });
  }
}

// ======= INITILIZATION =======
document.addEventListener('DOMContentLoaded', loadTasks);
form.addEventListener('submit', addTask);
taskList.addEventListener('click', taskModify);
