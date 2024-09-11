// Select DOM elements
const inputTaskName = document.querySelector("#todo-name");
const buttonSubmitTask = document.querySelector("#submit-btn");
const formTask = document.querySelector("form");
const elementTodoList = document.querySelector("#todo-list");
const elementDoneList = document.querySelector("#done-list");
const buttonShowTodoList = document.querySelector("#todo-list-btn");
const buttonShowDoneList = document.querySelector("#done-list-btn");
const displayTodoCount = document.querySelector("#todo-quantity");
const displayDoneCount = document.querySelector("#done-quantity");

// State variables
let todoTasks = [];
let doneTasks = [];
let isEditing = false;
let currentTaskIndex = null;

// Initialize task list on page load
updateTaskDisplay();

// Update task counters and render lists
function updateTaskDisplay() {
	displayTodoCount.textContent = `TODO (${todoTasks.length})`;
	displayDoneCount.textContent = `DONE (${doneTasks.length})`;
	renderTaskList(elementTodoList, todoTasks, addTodoListEvents);
	renderTaskList(elementDoneList, doneTasks, addDoneListEvents, true);
}

// Handle form submissions for adding or editing tasks
formTask.addEventListener("submit", (event) => {
	event.preventDefault();
	const taskTitle = inputTaskName.value.trim();
	if (!taskTitle) return;
	if (isEditing) {
		editTask(currentTaskIndex, taskTitle);
	} else {
		addTask(taskTitle);
	}
	inputTaskName.value = "";
	buttonSubmitTask.textContent = "Add";
	isEditing = false;
	updateTaskDisplay();
});

// Add new task to the todo list
function addTask(title) {
	todoTasks.push({ title, isDone: false });
}

// Edit the title of an existing task
function editTask(index, newTitle) {
	todoTasks[index].title = newTitle;
}

// Remove task from todo or done list based on index and task type
function removeTask(index, isDone = false) {
	if (isEditing) return;
	isDone ? doneTasks.splice(index, 1) : todoTasks.splice(index, 1);
	updateTaskDisplay();
}

// Mark task as done or not done and move between lists
function toggleTaskStatus(index, isDone) {
	if (isEditing) return;
	const task = isDone ? doneTasks[index] : todoTasks[index];
	isDone
		? (todoTasks.push(task), doneTasks.splice(index, 1))
		: (doneTasks.push(task), todoTasks.splice(index, 1));
	task.isDone = !isDone;

	updateTaskDisplay();
}

// Render tasks into the specified list element
function renderTaskList(listElement, tasks, addEventsCallback, isDone = false) {
	listElement.innerHTML = tasks.length
		? tasks.map((task, index) => taskTemplate(task, index, isDone)).join("")
		: `<h2 class="text-lg font-medium">No tasks yet...</h2>`;

	addEventsCallback();
}

// Template for rendering individual task items
function taskTemplate(task, index, isDone) {
	return `
    <li class="flex items-center justify-between gap-2 p-2 rounded-md shadow-md">
      <h3 title="${
				task.title
			}" class="text-lg font-medium text-nowrap text-ellipsis line-clamp-1">
        ${task.title}
      </h3>
      <div class="flex gap-2">
        <input 
          ${task.isDone ? "data-mark-toggle" : "data-mark-toggle-done"} 
          ${task.isDone ? "checked" : ""}
          title="Toggle task status" 
          type="checkbox" 
          class="w-4 aspect-square" 
        />
        ${!isDone ? editButtonTemplate(index) : ""}
        <button 
          data-delete 
          title="Delete task" 
          class="rounded text-white bg-neutral-950 w-8 aspect-square transition-colors hover:bg-slate-800"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </li>
  `;
}

// Template for edit button
function editButtonTemplate(index) {
	return `
    <button
      data-edit
      title="Edit task"
      class="rounded text-white bg-neutral-950 w-8 aspect-square transition-colors hover:bg-slate-800"
    >
      <i class="fa-solid fa-pen"></i>
    </button>
  `;
}

// Add event listeners to tasks in the todo list
function addTodoListEvents() {
	const toggleStatusButtons = document.querySelectorAll(
		"[data-mark-toggle-done]"
	);
	const editButtons = document.querySelectorAll("[data-edit]");
	const deleteButtons = document.querySelectorAll("[data-delete]");

	toggleStatusButtons.forEach((button, index) => {
		button.addEventListener("click", () => toggleTaskStatus(index, false));
	});

	editButtons.forEach((button, index) => {
		button.addEventListener("click", () => initiateEditTask(index));
	});

	deleteButtons.forEach((button, index) => {
		button.addEventListener("click", () => removeTask(index));
	});
}

// Add event listeners to tasks in the done list
function addDoneListEvents() {
	const toggleStatusButtons = document.querySelectorAll("[data-mark-toggle]");
	const deleteButtons = document.querySelectorAll("[data-delete]");

	toggleStatusButtons.forEach((button, index) => {
		button.addEventListener("click", () => toggleTaskStatus(index, true));
	});

	deleteButtons.forEach((button, index) => {
		button.addEventListener("click", () => removeTask(index, true));
	});
}

// Set up task editing state
function initiateEditTask(index) {
	isEditing = true;
	currentTaskIndex = index;
	inputTaskName.value = todoTasks[index].title;
	inputTaskName.focus();
	buttonSubmitTask.textContent = "Edit";
}

// Toggle the visibility and styles of the todo and done lists
function toggleButtonBorder(activeButton, inactiveButton) {
	activeButton.classList.add("border-neutral-950");
	inactiveButton.classList.remove(
		"border-neutral-950",
		"border-neutral-950/10"
	);
}

buttonShowTodoList.addEventListener("click", () => {
	toggleButtonBorder(buttonShowTodoList, buttonShowDoneList);
	elementDoneList.classList.replace("flex", "hidden");
	elementTodoList.classList.replace("hidden", "flex");
});

buttonShowDoneList.addEventListener("click", () => {
	toggleButtonBorder(buttonShowDoneList, buttonShowTodoList);
	elementTodoList.classList.replace("flex", "hidden");
	elementDoneList.classList.replace("hidden", "flex");
});
