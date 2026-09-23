// 這個檔案負責處理待辦清單的新增、勾選、刪除，以及 localStorage 持久化
const STORAGE_KEY = 'todo-list-data';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const todoCount = document.getElementById('todo-count');

// 先從 localStorage 讀取資料，若不存在則使用空陣列
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// 將待辦資料同步到 localStorage
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 依據目前狀態重新渲染清單
function renderTodos() {
  todoList.innerHTML = '';

  // 若清單為空，顯示提示文字並隱藏列表
  if (todos.length === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
  }

  // 產生每一筆待辦項目
  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' completed' : ''}`;
    item.dataset.id = todo.id;

    const main = document.createElement('div');
    main.className = 'todo-main';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `標記 ${todo.text} 為已完成`);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '刪除';
    deleteBtn.setAttribute('aria-label', `刪除 ${todo.text}`);

    main.appendChild(checkbox);
    main.appendChild(text);
    item.appendChild(main);
    item.appendChild(deleteBtn);
    todoList.appendChild(item);
  });

  // 計算未完成項目數並顯示在底部
  const remaining = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `未完成: ${remaining} 項`;
}

// 新增待辦事項
function addTodo() {
  const value = todoInput.value.trim();

  // 若輸入內容為空白，直接返回，不新增任何項目
  if (!value) {
    todoInput.focus();
    return;
  }

  const newTodo = {
    id: Date.now().toString(),
    text: value,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  todoForm.reset();
  todoInput.focus();
}

// 切換完成狀態
function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });

  saveTodos();
  renderTodos();
}

// 刪除待辦事項
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

// 表單提交事件：新增待辦
 todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo();
});

// 使用事件代理處理勾選與刪除互動
 todoList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.delete-btn');

  if (deleteButton) {
    const item = deleteButton.closest('.todo-item');
    if (!item) return;

    deleteTodo(item.dataset.id);
  }
});

 todoList.addEventListener('change', (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');

  if (checkbox) {
    const item = checkbox.closest('.todo-item');
    if (!item) return;

    toggleTodo(item.dataset.id);
  }
});

// 初始渲染
renderTodos();
