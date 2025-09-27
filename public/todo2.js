// public/todo2.js
// Cloudflare KV 版 To-Do List 前端腳本

/**
 * @typedef {import('../types/todo').TodoTask} TodoTask
 */

const API_BASE = '/api/tasks';

/**
 * 取得所有任務
 * @returns {Promise<TodoTask[]>}
 */
async function fetchTasks() {
  const res = await fetch(API_BASE);
  const data = await res.json();
  return data.tasks || [];
}

/**
 * 新增任務
 * @param {string} text
 * @returns {Promise<TodoTask|null>}
 */
async function addTask(text) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  return data.task || null;
}

/**
 * 更新任務
 * @param {string} id
 * @param {Partial<TodoTask>} update
 * @returns {Promise<TodoTask|null>}
 */
async function updateTask(id, update) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update)
  });
  const data = await res.json();
  return data.task || null;
}

/**
 * 刪除任務
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  return !!data.success;
}

// UI 綁定與渲染

document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const tasksContainer = document.querySelector('.tasks-container');
  const emptyState = document.getElementById('empty-state');
  const totalTasksSpan = document.getElementById('total-tasks');
  const completedTasksSpan = document.getElementById('completed-tasks');
  const activeTasksSpan = document.getElementById('active-tasks');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let tasks = [];
  let currentFilter = 'all';

  async function loadAndRenderTasks() {
    tasks = await fetchTasks();
    renderTasks();
    updateStats();
  }

  function renderTasks() {
    tasksContainer.innerHTML = '';
    let filtered = tasks;
    if (currentFilter === 'active') filtered = tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);
    if (filtered.length === 0) {
      tasksContainer.appendChild(emptyState);
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';
    filtered.forEach(task => {
      const el = document.createElement('div');
      el.className = `task-item${task.completed ? ' completed' : ''}`;
      el.dataset.id = task.id;
      el.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <div class="task-actions">
          <button class="edit-btn"><i class="fas fa-edit"></i></button>
          <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        </div>
      `;
      tasksContainer.appendChild(el);
    });
  }

  function updateStats() {
    totalTasksSpan.textContent = tasks.length;
    completedTasksSpan.textContent = tasks.filter(t => t.completed).length;
    activeTasksSpan.textContent = tasks.filter(t => !t.completed).length;
  }

  addBtn.addEventListener('click', async () => {
    const text = taskInput.value.trim();
    if (!text) return;
    await addTask(text);
    taskInput.value = '';
    await loadAndRenderTasks();
  });
  taskInput.addEventListener('keypress', async e => {
    if (e.key === 'Enter') {
      addBtn.click();
    }
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      renderTasks();
    });
  });

  tasksContainer.addEventListener('click', async e => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    const id = taskItem.dataset.id;
    if (e.target.classList.contains('task-checkbox')) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        await updateTask(id, { completed: !task.completed });
        await loadAndRenderTasks();
      }
    }
    if (e.target.classList.contains('delete-btn')) {
      await deleteTask(id);
      await loadAndRenderTasks();
    }
    if (e.target.classList.contains('edit-btn')) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        const newText = prompt('Edit your task:', task.text);
        if (newText && newText.trim() !== '' && newText !== task.text) {
          await updateTask(id, { text: newText.trim() });
          await loadAndRenderTasks();
        }
      }
    }
  });

  loadAndRenderTasks();
});
