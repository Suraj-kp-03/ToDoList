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









/*
BEFORE STATE MANAGEMENT
// Select the necessary css elements to perform thr task - Only for making the task to be deigned accurately
const form = document.querySelector('.input-field'); //New task input field
const input = document.querySelector('input');//input refers to the input tag whic is used to get the input
const taskList = document.querySelector('.task-list');// tasks after added


// Function to add a new task
function addTask(event) {

    // to prevent the page from reloading on form submission
    event.preventDefault();

    // get the value of the input field, input refers the input attribute tag
    const inputValue = input.value;
    console.log(inputValue);//checing whether the input is received correctly

    // create the necessary elements for the new task
    const listItem = document.createElement('li');
    const taskDiv = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const taskName = document.createElement('span');
    taskName.innerText = inputValue;
    const deleteButton = document.createElement('button');

    // add the necessary classes and icons to the buttons
    taskDiv.classList.add('task-info');
    deleteButton.classList.add('delete');
    deleteButton.innerHTML = `<i class="fa-solid fa-trash" style="color: #1e2f67;"></i>    
`

    // append the necessary elements to the li and ul to display in webpage
    taskList.appendChild(listItem);
    listItem.appendChild(taskDiv);
    listItem.appendChild(deleteButton);
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskName);
    // clear the input field after adding the new task
    input.value = '';
}

// Function to modify a task
function taskModify(event) {
    const clickedEle = event.target;// storing the element clicked 
    console.log(clickedEle);
    
    // check if the delete button was clicked
    if (clickedEle.classList[1] === 'fa-trash') {
        const task = clickedEle.parentElement.parentElement;
        task.remove();
    }

    // check if the text was clicked
    if (clickedEle.tagName.toLowerCase() === 'span'){
        const task = clickedEle.innerHTML;
        clickedEle.innerHTML = `<input class="edit-input" type="text" value="${task}"/>`;

        const editInput = clickedEle.querySelector('input');
        editInput.addEventListener('blur', ()=>{
            const newValue = editInput.value;
            clickedEle.innerHTML = newValue;
        });
    }

// Event listeners to add a new task and edit, delete a task
form.addEventListener('submit', addTask);
// Event listeners to add a new task and edit, delete a task
taskList.addEventListener('click', taskModify)
*/

