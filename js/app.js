import { db } from './config.js';
import { card, todoBadge, todoLabel } from './components.js';
import { setRenderCallback } from './actions.js';

// Pass the render function to the actions module so it can refresh the UI after updates
setRenderCallback(render);

// ==========================================
// 6. MAIN RENDER LOOP
// ==========================================
export async function render() {
  const dashboard = document.getElementById('dashboard');
  try {
    // Show partial loading state if we already have some data
    const lastSyncEl = document.getElementById('last-updated');
    
    // Fail-safe fetch helper
    const safeFetch = async (query, label) => {
      try {
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error(`Error fetching ${label}:`, err);
        return null; // Return null to indicate failure
      }
    };

    const [projects, todos, emails, completedTodos, ideas] = await Promise.all([
      safeFetch(db.from('projects').select('name, status, next_action, notes').order('created_at', { ascending: false }), 'projects'),
      safeFetch(db.from('admin').select('id, task, due_date, status, notes').neq('status', 'complete').neq('status', 'Closed').order('due_date', { ascending: true, nullsFirst: false }), 'todos'),
      safeFetch(db.from('inbox_log').select('entry_name, original_text, source, timestamp').order('timestamp', { ascending: false }).limit(5), 'emails'),
      safeFetch(db.from('admin').select('id, task, status, date_captured').eq('status', 'complete').order('date_captured', { ascending: false, nullsLast: true }).limit(5), 'completed'),
      safeFetch(db.from('ideas').select('tags').ilike('tags', '%meeting-notes%'), 'ideas')
    ]);

    // Check if critical data failed
    if (projects === null && todos === null) {
      throw new Error("Unable to connect to Supabase tables. Please check your connection or RLS settings.");
    }

    const projectsList = projects || [];
    const todosList = todos || [];
    const emailsList = emails || [];
    const completedList = completedTodos || [];
    const ideasList = ideas || [];

    projectsList.forEach(p => {
      p.hasMeetingNotes = ideasList.some(i => i.tags && i.tags.toString().includes(p.name));
    });

    const today = new Date(); today.setHours(0,0,0,0);
    const dueTodayCount = todosList.filter(t => t.due_date && new Date(t.due_date) <= today).length;
    const dueWeekCount = todosList.filter(t => {
      if (!t.due_date) return false;
      const diff = Math.ceil((new Date(t.due_date) - today) / 86400000);
      return diff >= 0 && diff <= 7;
    }).length;

    const catActive = projectsList.filter(p => ['active-fabrication', 'Active'].includes(p.status));
    const catProposals = projectsList.filter(p => ['active-proposal', 'active-pitch'].includes(p.status));
    const catPrelim = projectsList.filter(p => p.status === 'Active — Pre-RFP');
    const catLeads = projectsList.filter(p => p.status === 'Lead');
    const catOther = projectsList.filter(p => !catActive.includes(p) && !catProposals.includes(p) && !catPrelim.includes(p) && !catLeads.includes(p));

    const urgentTodos = todosList.filter(t => t.due_date);
    const openTodos = todosList.filter(t => !t.due_date).slice(0, 8);

    lastSyncEl.textContent = `Last synced ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`;

    let html = '';
    
    // Add warning if some data is missing
    if (projects === null || todos === null || emails === null || ideas === null) {
      html += `<div style="background: var(--amber-bg); color: var(--amber-fg); padding: 8px 12px; border-radius: 8px; font-size: 11px; margin-bottom: 1rem; border: 0.5px solid var(--amber);">
        <strong>Partial Data:</strong> Some sections could not be loaded. Check console for details.
      </div>`;
    }

    html += `
      <div class="stats">
        <div class="stat"><div class="stat-label">active projects</div><div class="stat-value">${catActive.length}</div></div>
        <div class="stat"><div class="stat-label">due today or overdue</div><div class="stat-value red">${dueTodayCount}</div></div>
        <div class="stat"><div class="stat-label">due this week</div><div class="stat-value amber">${dueWeekCount}</div></div>
        <div class="stat"><div class="stat-label">leads & watching</div><div class="stat-value">${catLeads.length + catPrelim.length}</div></div>
      </div>`;

    if (emailsList.length) {
      html += `
        <div class="section-label">recent communications ${emails === null ? '(Error Loading)' : ''}</div>
        <div style="background:var(--card-bg); border:0.5px solid var(--border); border-radius:12px; padding:0.875rem 1rem; margin-bottom: 2rem;">
          ${emailsList.map(e => {
            const date = new Date(e.timestamp);
            const isToday = date.toDateString() === today.toDateString();
            const timeStr = isToday ? date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : date.toLocaleDateString([], {month:'short', day:'numeric'});
            const extractEmail = (text) => { const match = text?.match(/<([^>]+)>/); return match ? match[1] : ''; };
            const emailAddr = extractEmail(e.entry_name) || '';
            const mailto = emailAddr ? `href="mailto:${emailAddr}?subject=Re: ${e.entry_name.replace(/<[^>]*>/g, '').trim()}"` : '';
            return `
            <div style="display:flex; flex-direction: column; gap:4px; padding:0.75rem 0; border-bottom:0.5px solid var(--divider);">
              <div style="display:flex; justify-content: space-between; align-items: center;">
                <span style="font-size:13px; font-weight:600; color:var(--text);">${e.entry_name}</span>
                <span style="font-size:11px; color:var(--text-muted);">${timeStr}</span>
              </div>
              <div style="font-size:12px; color:var(--text-muted); line-height:1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${e.original_text || 'No message snippet available.'}
              </div>
              ${mailto ? `<a ${mailto} style="font-size: 11px; color: var(--blue-fg); text-decoration: none; align-self: flex-start; margin-top: 4px; display: inline-flex; align-items: center; gap: 4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 9l-6 6 6 6"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg> Reply</a>` : ''}
            </div>`;
          }).join('')}
        </div>`;
    }

    const renderGrid = (title, list) => {
      if (!list.length) return '';
      return `<div class="section-label">${title}</div><div class="grid grid-4">${list.map(card).join('')}</div>`;
    };

    html += renderGrid('active projects', catActive);
    html += renderGrid('proposals & pitches', catProposals);
    html += renderGrid('prelim phase', catPrelim);
    html += renderGrid('leads', catLeads);
    html += renderGrid('other / watching', catOther);

    if (urgentTodos.length) {
      html += `
        <div class="section-label">tasks with deadlines</div>
        <div style="background:var(--card-bg); border:0.5px solid var(--border); border-radius:12px; padding:0.875rem 1rem;">
          ${urgentTodos.map(t => `
            <div class="task-row">
              <div class="task-checkbox" onclick="markTaskComplete('${t.id}', this)">
                 <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg>
              </div>
              <div style="display:flex; flex-direction: column; flex-grow: 1;">
                 <div style="display: flex; gap: 8px; align-items: flex-start;">
                   <span class="badge ${todoBadge(t.due_date)}" style="margin-top:1px; flex-shrink:0;">${todoLabel(t.due_date)}</span>
                   <span style="font-size:13px; color:var(--text); line-height:1.5;">${t.task}</span>
                 </div>
              </div>
            </div>`).join('')}
        </div>`;
    }

    if (openTodos.length) {
      html += `
        <div class="section-label">open tasks</div>
        <div style="background:var(--card-bg); border:0.5px solid var(--border); border-radius:12px; padding:0.875rem 1rem;">
          ${openTodos.map(t => `
            <div class="task-row">
              <div class="task-checkbox" onclick="markTaskComplete('${t.id}', this)">
                 <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg>
              </div>
              <span style="font-size:13px; color:var(--text); line-height:1.5; margin-top:1px;">${t.task}</span>
            </div>`).join('')}
        </div>`;
    }

    if (completedList.length) {
      html += `
        <div class="section-label">recently completed</div>
        <div style="background:transparent; border:none; padding:0.25rem 0.5rem; opacity:0.6;">
          ${completedList.map(t => `
            <div style="display:flex; align-items:flex-start; gap:10px; padding:0.4rem 0;">
              <div class="task-checkbox done" style="opacity: 0.6; pointer-events:none;">
                 <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg>
              </div>
              <span style="font-size:13px; color:var(--text); line-height:1.5; text-decoration:line-through;">${t.task}</span>
            </div>`).join('')}
        </div>`;
    }

    html += `
      <div class="section-label" style="margin-top: 2rem;">add quick task</div>
      <form class="add-task-form" onsubmit="handleAddTask(event)">
        <input type="text" id="new-task-input" class="add-task-input" placeholder="What needs to be done?" required autocomplete="off">
        <button type="submit" id="new-task-btn" class="add-task-btn">Add Task</button>
      </form>`;
    
    dashboard.innerHTML = html;
  } catch(e) {
    console.error(e);
    dashboard.innerHTML = `
      <div class="error">
        <strong>Error connecting to Brain:</strong> ${e.message}<br><br>
        <button onclick="window.render()" style="background: var(--red-fg); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Try Again</button>
      </div>`;
  }
}

// Make globally accessible for the error 'try again' button fallback
window.render = render;

// ==========================================
// 7. INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    render();
    setInterval(render, 60000);

    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    document.getElementById('theme-toggle').addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
});
