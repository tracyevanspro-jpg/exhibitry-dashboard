import { db } from './config.js';
// The render callback is injected from app.js to avoid circular dependencies
let renderCallback = null;

export function setRenderCallback(cb) {
  renderCallback = cb;
}

// ==========================================
// 4. ACTION HANDLERS
// ==========================================

/**
 * Marks a task complete in the Supabase database.
 * @param {string} id - The UUID of the task.
 * @param {HTMLElement} element - The DOM node representing the checkbox.
 */
export async function markTaskComplete(id, element) {
  const row = element.closest('.task-row');
  row.classList.add('completing');
  element.classList.add('done');
  
  try {
    const { error } = await db.from('admin').update({ status: 'complete', date_captured: new Date().toISOString() }).eq('id', id);
    if (!error) {
      if (renderCallback) setTimeout(renderCallback, 300);
    } else {
      console.error(error);
      row.classList.remove('completing');
      element.classList.remove('done');
    }
  } catch (err) {
    console.error(err);
    row.classList.remove('completing');
    element.classList.remove('done');
  }
}

/**
 * Handles adding a new task to Supabase.
 * @param {Event} e - The form submission event.
 */
export async function handleAddTask(e) {
  e.preventDefault();
  const input = document.getElementById('new-task-input');
  const btn = document.getElementById('new-task-btn');
  const task = input.value.trim();
  if (!task) return;

  input.disabled = true;
  btn.disabled = true;

  try {
    const { error } = await db.from('admin').insert([{ task: task, status: 'Open', date_captured: new Date().toISOString() }]);
    if (!error) {
      input.value = '';
      if (renderCallback) await renderCallback();
    } else {
      console.error(error);
      alert('Failed to add task.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    input.disabled = false;
    btn.disabled = false;
    input.focus();
  }
}

// Make these globally accessible to inline HTML `onclick` and `onsubmit` attributes
window.markTaskComplete = markTaskComplete;
window.handleAddTask = handleAddTask;
