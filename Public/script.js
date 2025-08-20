//Obtener componentes
const taskInput = document.getElementById("taskInput")
const addBtn = document.getElementById("addButton")
const clearBtn = document.getElementById("clearButton")
const itemTemplate = document.querySelector(".taskElement")
const taskList = document.getElementById("taskList")
const pendingTasks = document.getElementById("pendingTasks")

//Botones de nueva tarea, y eliminar tareas
addBtn.addEventListener('click', addTask)
clearBtn.addEventListener('click', clear)

let taskDictionary = {}
getJson()

//añadir tarea
function addTask (event) {
    let taskText = taskInput.value.trim()
    if (taskText !== "")
    {
        if (taskText in taskDictionary)
        {
            let index = 1
            while (taskText + `${index}` in taskDictionary) {
                index++
            }
            taskText = taskText + `${index}`
        }
        const newTask = itemTemplate.cloneNode(true)
        newTask.querySelector('span').innerHTML = taskText
        newTask.classList.remove("hidden")
        newTask.querySelector('button').addEventListener('click', removeTask)
        newTask.querySelector('input').addEventListener('change', switchDone)
        taskList.append(newTask)
        taskInput.value = ""
    }
    else
    {
        alert("El campo no puede estar vacio")
    }

    saveJson()
}

//marcar / desmarcar tarea como hecha
function switchDone(event) {
    if (event.target.checked) {
        event.target.parentNode.querySelector('span').classList.add('line-through', 'text-stone-400')
    }
    else {
        event.target.parentNode.querySelector('span').classList.remove('line-through', 'text-stone-400')
    }

    saveJson()
}

//eliminar todas las tareas
function clear (event) {
    const tasks = taskList.children
    if (tasks.length < 2) return

    for (let index = tasks.length - 1; index >= 1; index--) {
        tasks[index].remove()
    }

    localStorage.clear()
    updateNumberOfTasks(0)
    saveJson()
}

//eliminar tarea individual
function removeTask (event) {
     event.target.parentNode.remove()

     saveJson()
}

//obtener tareas guardadas en local storage (solo se ejecuta al iniciar la pagina)
function getJson () {
    let numberOfTasks = 0
    const jsonString = localStorage.getItem('tasks')
    if (jsonString === null) return
    taskDictionary = JSON.parse(jsonString)
    Object.keys(taskDictionary).forEach((key) => {
        const newTask = itemTemplate.cloneNode(true)
        newTask.querySelector('span').innerHTML = key
        if (taskDictionary[key]) newTask.querySelector('span').classList.add('line-through', 'text-stone-400')
        else numberOfTasks++
        newTask.querySelector('input').checked = taskDictionary[key]
        newTask.classList.remove("hidden")
        newTask.querySelector('button').addEventListener('click', removeTask)
        newTask.querySelector('input').addEventListener('change', switchDone)
        taskList.append(newTask)
    });

    updateNumberOfTasks(numberOfTasks)
}

//guardar tareas en local storage (se ejecuta cada vez que hay un cambio)
function saveJson () {
    const tasks = taskList.children
    taskDictionary = {}
    let numberOfTasks = 0
    for (let index = 1; index < tasks.length; index++) {
        const name = tasks[index].querySelector('span').innerHTML
        const value = tasks[index].querySelector('input').checked
        if (!value) numberOfTasks++
        taskDictionary[name] = value
    }

    updateNumberOfTasks(numberOfTasks)
    localStorage.setItem('tasks', JSON.stringify(taskDictionary))
}

//actualiza el numero de tareas a completar
function updateNumberOfTasks (n) {
    pendingTasks.innerHTML = `Tienes ${n} tareas pendientes`
}