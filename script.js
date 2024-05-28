class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
    }

    complete() {
        this.completed = !this.completed;
    }

    render() {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${this.title}</h3>
            <p>${this.description}</p>
            <p>Due Date: ${this.dueDate}</p>
            <p>Priority: ${this.priority}</p>
        `;
        if (this.completed) {
            li.classList.add('completed');
        }
        return li;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(title, description, dueDate, priority) {
        const task = new Task(title, description, dueDate, priority);
        this.tasks.push(task);
        this.saveTasksToLocalStorage();
        this.renderTasks();
    }

    saveTasksToLocalStorage(){
        const taskTexts = this.tasks.map(task => new Task(task.title, task.description, task.dueDate, task.priority))
        localStorage.setItem("tasks", JSON.stringify(taskTexts));
        // const taskTexts = this.tasks.map(task => task.text);
        // localStorage.setItem("tasks", JSON.stringify(taskTexts));
    }

    loadTasksFromLocalStorage() {
        const taskTexts = JSON.parse(localStorage.getItem("tasks"));
        if (taskTexts) {
            this.tasks = taskTexts.map((taskData) => {
                const {title, description, dueDate, priority, completed} = taskData;
                return new Task(title, description, dueDate, priority);
            });
        }
    }

    renderTasks(){
            taskList.innerHTML = "";
            this.tasks.forEach(task => {
                const li = task.render();
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.classList.add("deleteTask")
                li.appendChild(deleteBtn)
                deleteBtn.addEventListener("click", ()=> this.deleteTask(task));
                li.addEventListener("click",()=>{
                    task.complete();
                    li.classList.toggle("completed");
                    this.saveTasksToLocalStorage();
                });
                taskList.appendChild(li);
            });
    }

    deleteTask(task){
            this.removeTaskFromLocalStorage(task.text);
            this.tasks = this.tasks.filter(t => t !== task);
            this.renderTasks();
    }

    removeTaskFromLocalStorage(taskText) {
        const taskTexts = this.tasks.map(task => task.title);
        const index = taskTexts.indexOf(taskText);
        if (index !== -1) {
            taskTexts.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(taskTexts));
        }
    }

}



    const titleInput = document.getElementById('titleInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const addBtn = document.querySelector(".addTask");
    const taskManager = new TaskManager();

    function addTask() {
        const title = titleInput.value;
        const description = descriptionInput.value;
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;
        
        if (title.trim() !== '' && description.trim() !== '' && dueDate.trim() !== '') {
            taskManager.addTask(title, description, dueDate, priority);
            titleInput.value = '';
            descriptionInput.value = '';
            dueDateInput.value = '';
            priorityInput.value = 'low';
        }
    }

    addBtn.addEventListener('click', addTask);
    taskManager.loadTasksFromLocalStorage();
    taskManager.renderTasks();