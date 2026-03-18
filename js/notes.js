import { db } from './config.js';
import { escapeHtml, formatRichText } from './utils.js';

const urlParams = new URLSearchParams(window.location.search);
const projectName = urlParams.get('project');

const projectTitle = document.getElementById('project-title');
const notesContainer = document.getElementById('notes-container');
const addNoteForm = document.getElementById('add-note-form');
const titleInput = document.getElementById('note-title');
const bodyInput = document.getElementById('note-body');
const submitButton = document.getElementById('btn-submit');

function setEmptyState(message) {
  notesContainer.innerHTML = `<div style="color:var(--text-muted); font-size:14px; padding: 2rem 0;">${escapeHtml(message)}</div>`;
}

async function render() {
  if (!projectName) return;

  try {
    const { data: notes, error } = await db
      .from('ideas')
      .select('title, notes, created_at')
      .ilike('tags', `%${projectName}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!notes || notes.length === 0) {
      setEmptyState('No notes found for this project. Use the form below to add one.');
      return;
    }

    notesContainer.innerHTML = notes
      .map((note) => {
        const date = new Date(note.created_at).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        return `
          <div class="note-card">
            <div class="note-header">
              <div class="note-title">${escapeHtml(note.title || 'Untitled Note')}</div>
              <div class="note-date">${escapeHtml(date)}</div>
            </div>
            <div class="note-body">${formatRichText(note.notes || '')}</div>
          </div>
        `;
      })
      .join('');
  } catch (error) {
    setEmptyState(`Error loading notes: ${error.message}`);
  }
}

async function handleAddNote(event) {
  event.preventDefault();
  if (!projectName) return;

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  if (!title || !body) return;

  titleInput.disabled = true;
  bodyInput.disabled = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Saving...';

  try {
    const { error } = await db.from('ideas').insert([
      {
        title,
        notes: body,
        tags: [projectName, 'meeting-notes'],
        source: 'dashboard',
      },
    ]);

    if (error) throw error;

    titleInput.value = '';
    bodyInput.value = '';
    await render();
  } catch (error) {
    console.error(error);
    window.alert('Failed to save note. See console for details.');
  } finally {
    titleInput.disabled = false;
    bodyInput.disabled = false;
    submitButton.disabled = false;
    submitButton.textContent = 'Save Note';
  }
}

if (!projectName) {
  projectTitle.textContent = 'No Project Selected';
  setEmptyState('Please access notes from a specific project card on the dashboard.');
  addNoteForm.hidden = true;
} else {
  projectTitle.textContent = projectName;
  render();
}

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

addNoteForm.addEventListener('submit', handleAddNote);
