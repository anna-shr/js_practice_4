document.addEventListener("DOMContentLoaded", function () {
    const ul = document.getElementById("ul");
    const select = document.getElementById("select");
    const search = document.getElementById("search");
    const addButton = document.getElementById("addBtn");
    const modalAdd = document.getElementById("modalAdd");
    const modalInput = document.getElementById("modalInput");
    const delAllBtn = document.getElementById("delAllBtn");

    let tasks = [];

    renderTasks(select.value, search.value);

    let timeout;
    search.addEventListener('input', function (e) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            renderTasks(select.value, this.value);
        }, 300);
    });

    function renderTasks(filter = 'all', searchText = '') {
        ul.innerHTML = "";
        let filteredTasks = tasks;

        if (filter === 'completed') {
            filteredTasks = tasks.filter(li => li.dataset.completed === "true");
        } else if (filter === 'incompleted') {
            filteredTasks = tasks.filter(li => li.dataset.completed === "false");
        }

        if (searchText.trim() !== '') {
            const lowerSearch = searchText.toLowerCase();
            //filteredTasks = [];
            filteredTasks = filteredTasks.filter(li => {
                const text = li.querySelector('span').textContent.toLowerCase();
                return text.includes(lowerSearch);
            });
        }

        filteredTasks.forEach((li) => {
            ul.append(li);
        });
    }

    select.addEventListener('change', (e) => {
        renderTasks(e.target.value, search.value);
    });

    ul.addEventListener('click', (e) => {
        const li = e.target.closest("li");
        if (!li) return;
        if (e.target.tagName === "SPAN") {
            e.target.classList.toggle("completed");
            if (li.dataset.completed === 'true') {
                li.dataset.completed = 'false';
            } else {
                li.dataset.completed = 'true';
            }
            renderTasks(select.value, search.value);
            return;
        }

        if (e.target.classList.contains("delete-btn")) {
            if (e.target.classList.contains("cancel-mode")) {
                const input = li.querySelector(".edit-input");
                if (input) {
                    const currentText = li.dataset.originalText || '';
                    cancelEdit(li, input, currentText);
                }
                return;
            }

            tasks = tasks.filter(task => {
                return task.dataset.id !== li.dataset.id;
            });
            renderTasks(select.value, search.value);
            return;
        }

        if (e.target.classList.contains("edit-btn")) {
            if (e.target.classList.contains("editing")) {
                saveEdit(li);
                return;
            }
            startEdit(li);
        }
    });

    function startEdit(li) {
        const span = li.querySelector("span");
        const currentText = span.textContent;
        li.dataset.originalText = currentText;
        const input = document.createElement("input");
        input.type = "text";
        input.className = "edit-input";
        input.value = currentText;
        li.replaceChild(input, span);
        const editBtn = li.querySelector(".edit-btn");
        const deleteBtn = li.querySelector(".delete-btn");

        editBtn.textContent = "Сохранить";
        editBtn.classList.add("editing");

        deleteBtn.textContent = "Отмена";
        deleteBtn.classList.add("cancel-mode");

        input.focus();
        input.select();

        input.addEventListener("keydown", function handler(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                saveEdit(li);
            }
            if (event.key === "Escape") {
                event.preventDefault();
                cancelEdit(li, input, li.dataset.originalText);
            }
        });

        input.addEventListener("blur", function handler(event) {
            if (event.relatedTarget &&
                (event.relatedTarget.classList.contains("edit-btn") ||
                    event.relatedTarget.classList.contains("delete-btn"))) {
                return;
            }
            saveEdit(li);
        });
    }

    function saveEdit(li) {
        const input = li.querySelector(".edit-input");
        if (!input) return;

        const currentText = li.dataset.originalText || input.defaultValue;
        const newText = input.value.trim();

        if (newText === '' || newText === currentText) {
            cancelEdit(li, input, currentText);
            return;
        }

        const newSpan = document.createElement("span");
        newSpan.textContent = newText;
        if (li.dataset.completed === 'true') {
            newSpan.classList.add("completed");
        }
        li.replaceChild(newSpan, input);

        const editBtn = li.querySelector(".edit-btn");
        const deleteBtn = li.querySelector(".delete-btn");

        editBtn.textContent = "Редактировать";
        editBtn.classList.remove("editing");

        deleteBtn.textContent = "Удалить";
        deleteBtn.classList.remove("cancel-mode");

        const taskIndex = tasks.findIndex(task => task.dataset.id === li.dataset.id);
        if (taskIndex !== -1) {
            const task = tasks[taskIndex];
            const newSpanForTask = task.querySelector("span");
            if (newSpanForTask) {
                newSpanForTask.textContent = newText;
            }
        }

        renderTasks(select.value, search.value);
    }

    function cancelEdit(li, input, currentText) {
        // Возвращаем span
        const newSpan = document.createElement("span");
        newSpan.textContent = currentText;
        if (li.dataset.completed === 'true') {
            newSpan.classList.add("completed");
        }
        li.replaceChild(newSpan, input);

        const editBtn = li.querySelector(".edit-btn");
        const deleteBtn = li.querySelector(".delete-btn");

        editBtn.textContent = "Редактировать";
        editBtn.classList.remove("editing");

        deleteBtn.textContent = "Удалить";
        deleteBtn.classList.remove("cancel-mode");
    }

    function openModal() {
        modalOverlay.classList.add("active");
    }

    function closeModal() {
        modalOverlay.classList.remove("active");
    }

    addButton.addEventListener("click", openModal);

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modalCancel) {
        modalCancel.addEventListener("click", closeModal);
    }

    modalOverlay.addEventListener("click", function (e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    modalAdd.addEventListener("click", (e) => {
        e.preventDefault();

        if (modalInput.value.trim() === '') {
            alert('Введите текст задачи!');
            return;
        }

        const li = document.createElement("li");
        li.dataset.id = Date.now();
        li.dataset.completed = "false";

        const span = document.createElement("span");
        span.textContent = modalInput.value;

        const editButton = document.createElement("button");
        editButton.textContent = "Редактировать";
        editButton.className = "edit-btn";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.className = "delete-btn";

        li.append(span);
        li.append(editButton);
        li.append(deleteButton);

        tasks.push(li);

        modalInput.value = "";
        renderTasks(select.value, search.value);
        closeModal();
    });

    delAllBtn.addEventListener('click', (e) => {
        ul.innerHTML = "";
    });

});