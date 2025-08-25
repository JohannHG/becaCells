(function () {
  let form = document.getElementById('todo-form');
  let input = document.getElementById('todo-input');
  let listEl = document.getElementById('todo-list');
  let countTotal = document.getElementById('count-total');
  let countDone = document.getElementById('count-done');
  let countPending = document.getElementById('count-pending');

  let STORAGE_KEY = 'examen_todos_v1';
  let todos = [];

  try {
    todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (err) {
    //iniciar vacío localstorage
    todos = [];
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    render();
  }

  function addTodo(text) {
    let newTodo = {
      id: String(new Date().getTime()),
      text: (text || '').trim(),
      done: false
    };
    //añadir al inicio
    todos.unshift(newTodo);
    save();
  }

  function toggleDone(id) {
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === id) {
        todos[i].done = !todos[i].done;
        break;
      }
    }
    save();
  }

  function deleteTodo(id) {
    let newList = [];
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id !== id) {
        newList.push(todos[i]);
      }
    }
    todos = newList;
    save();
  }

  function editTodo(id) {
    let item = null;
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === id) {
        item = todos[i];
        break;
      }
    }
    if (!item) return;
    let nuevo = prompt('Editar tarea:', item.text);
    if (nuevo !== null) {
      item.text = nuevo.trim();
      save();
    }
  }

  function render() {
    // limpiar lista
    listEl.innerHTML = '';

    if (todos.length === 0) {
      let liEmpty = document.createElement('li');
      liEmpty.style.color = '#666';
      liEmpty.style.padding = '8px';
      liEmpty.textContent = 'No hay tareas -> agrega la primer tarea.';
      listEl.appendChild(liEmpty);
    } else {
      for (let i = 0; i < todos.length; i++) {
        let t = todos[i];

        let li = document.createElement('li');
        if (t.done) li.className = 'completed';

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        if (t.done) checkbox.checked = true;
        checkbox.setAttribute('data-id', t.id);

        let divText = document.createElement('div');
        divText.className = 'text';
        divText.innerHTML = escapeHtml(t.text);

        let btnEdit = document.createElement('button');
        btnEdit.setAttribute('data-action', 'edit');
        btnEdit.setAttribute('data-id', t.id);
        btnEdit.textContent = 'Editar';

        let btnDel = document.createElement('button');
        btnDel.setAttribute('data-action', 'delete');
        btnDel.setAttribute('data-id', t.id);
        btnDel.textContent = 'Eliminar';

        li.appendChild(checkbox);
        li.appendChild(divText);
        li.appendChild(btnEdit);
        li.appendChild(btnDel);

        listEl.appendChild(li);
      }
    }

    //contadores
    let total = todos.length;
    let done = 0;
    for (let j = 0; j < todos.length; j++) {
      if (todos[j].done) done++;
    }
    let pending = total - done;

    countTotal.textContent = 'Total: ' + total;
    countDone.textContent = 'Completadas: ' + done;
    countPending.textContent = 'Incompletas: ' + pending;
  }

  function escapeHtml(str) {
    if (!str) return '';
    str = String(str);
    // reemplazos simples
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/'/g, '&#39;');
    return str;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let v = input.value.trim();
    if (!v) return;
    addTodo(v);
    input.value = '';
    input.focus();
  });

  listEl.addEventListener('click', function (e) {
    let target = e.target || e.srcElement;
    let id = target.getAttribute && target.getAttribute('data-id');
    if (!id) return;
    let tag = (target.tagName || '').toLowerCase();
    if (tag === 'input' && target.type === 'checkbox') {
      toggleDone(id);
    } else if (target.getAttribute('data-action') === 'edit') {
      editTodo(id);
    } else if (target.getAttribute('data-action') === 'delete') {
      if (confirm('¿Eliminar esta tarea?')) {
        deleteTodo(id);
      }
    }
  });

  //renderizar
  render();
})();
