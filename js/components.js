// ==========================================
// 3. UI COMPONENT GENERATORS
// ==========================================

// ==========================================
// 2. CONSTANTS & MAPPINGS
// ==========================================
export const STATUS_BADGE = {
  'active-fabrication': ['badge-blue', 'fabrication'],
  'active-pitch':       ['badge-red', 'pitch'],
  'active-proposal':    ['badge-amber', 'proposal'],
  'Active':             ['badge-blue', 'active'],
  'Active — Pre-RFP':   ['badge-green', 'pre-RFP'],
  'Lead':               ['badge-gray', 'lead'],
};

export function badge(status) {
  const [cls, label] = STATUS_BADGE[status] || ['badge-gray', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

export function card(p) {
  let formattedNotes = p.notes || '';
  if (formattedNotes) {
    formattedNotes = formattedNotes
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color:var(--blue-fg); text-decoration:underline;">$1</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^-\s/gm, '&bull; ')
      .replace(/\n/g, '<br>');
  }
  
  const hasNotesFlag = p.hasMeetingNotes;
  
  // Thumbnail logic: check for .jpg matching project name (kebab-case)
  const thumbName = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const thumbUrl = `./thumbnails/${thumbName}.jpg`;

  return `
    <div class="card" onclick="this.classList.toggle('expanded')">
      ${hasNotesFlag ? `<a href="notes.html?project=${encodeURIComponent(p.name)}" class="badge badge-notes" onclick="event.stopPropagation()">NOTES</a>` : ''}
      <img src="${thumbUrl}" class="card-image" onerror="this.src='./thumbnails/placeholder.jpg'; this.onerror=null;">
      <div class="card-top">
        <span class="card-name">${p.name}</span>
        ${badge(p.status)}
      </div>
      <div class="card-action">${p.next_action || ''}</div>
      ${formattedNotes ? `<div class="card-notes">${formattedNotes}</div>` : ''}
    </div>`;
}

// ==========================================
// 5. HELPER FUNCTIONS FOR TASKS
// ==========================================
export function todoBadge(due) {
  if (!due) return 'badge-gray';
  const d = new Date(due);
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.ceil((d - today) / 86400000);
  if (diff <= 0) return 'badge-red';
  if (diff <= 4) return 'badge-amber';
  if (diff <= 14) return 'badge-blue';
  return 'badge-gray';
}

export function todoLabel(due) {
  if (!due) return 'open';
  const d = new Date(due);
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.ceil((d - today) / 86400000);
  if (diff < 0) return 'overdue';
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
