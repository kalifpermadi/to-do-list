// Declare elements in js
const form = document.getElementById("todolist")
const textInput = document.getElementById("textInput")
const dateInput = document.getElementById("dateInput")
const todosUL = document.getElementById("todos")

// Get the to-do list from local storage with key "todos"
let todos = JSON.parse(localStorage.getItem("todos"))

// If it's not empty, add all of the contents as to-do items
if (todos) {
    todos.forEach(todo => addTodo(todo))
}

// Add to-do element on submit
form.addEventListener("submit", (e) => {
    e.preventDefault()
    addTodo()
})

// Declare a function to add a to-do element
function addTodo(todo) {
    // Set the text and date
    let todoText = textInput.value
    let todoDate = dateInput.value
    let todoDay = todoDate.slice(8, 10)
    let todoMonth = todoDate.slice(5, 7)
    todoDate = `${todoMonth}/${todoDay}`

    // If it has an argument (taken from local storage), set the text and date as the value's text and date
    if (todo) {
        todoText = todo.text
        todoDate = todo.date
    }
    // If the inputs aren't empty
    if (todoText && todoDate != "/") {
        const todoLI = document.createElement("li")

        // If it's completed
        if (todo && todo.completed) {
            todoLI.classList.add("completed")
        }

        // Set the text if it's taken from local storage, else concatenate date and text
        if (todo) {
            todoLI.innerText = todoText
        }
        else {
            todoLI.innerText = todoDate + " " + todoText
        }

        // Left click to mark as completed
        todoLI.addEventListener("click", () => {
            todoLI.classList.toggle("completed")
            updateLS()
        })

        // Right click to delete an element
        todoLI.addEventListener("contextmenu", (e) => {
            e.preventDefault()
            todoLI.remove()
            updateLS()
        })

        // Add an item (unsorted) and empty the input
        todosUL.appendChild(todoLI)
        textInput.value = ''
        dateInput.value = ''
        updateLS()
    }
}

// Declare a function to sort local storage according to the date
function sortLS(todos) {
    todos.sort((a, b) => {
        if (a["completed"] === b["completed"]) {
            return a["date"].localeCompare(b["date"])
        }
        else {
            return a["completed"] ? 1 : -1
        }
    })
    // const key = "date"

    // todos.sort((a, b) => {
    //     if (a[key] < b[key]) {
    //       return -1;
    //     } else if (a[key] > b[key]) {
    //       return 1;
    //     } else {
    //       return 0;
    //     }
    // })
}

// Declare a function to update local storage
function updateLS() {
    const todosLI = document.querySelectorAll("li")

    const todos = []
    todosLI.forEach(todoLI => {
        todos.push({
            text: todoLI.innerText,
            date: todoLI.innerText.slice(0, 5),
            completed: todoLI.classList.contains("completed")
        })
    })

    // Sort the list
    sortLS(todos)

    localStorage.setItem("todos", JSON.stringify(todos))

    // After the LS is updated, remove the list and replace with sorted list
    for (let i = 0; i < todosLI.length; i++) {
        todosLI[i].remove()
    }


    todos.forEach(todo => {
        const todoLI = document.createElement("li")
        todoLI.innerText = todo.text
        if (todo && todo.completed) {
            todoLI.classList.add("completed")
        }
        todoLI.addEventListener("click", () => {
            todoLI.classList.toggle("completed")
            updateLS()
        })
        todoLI.addEventListener("contextmenu", (e) => {
            e.preventDefault()
            todoLI.remove()
            updateLS()
        })
        todosUL.appendChild(todoLI)
    })
}