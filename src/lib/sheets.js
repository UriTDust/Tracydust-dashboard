const SHEETDB_BASE = import.meta.env.VITE_SHEETDB_URL

export const sheetsApi = {
  // TASKS
  getTasks: () =>
    fetch(`${SHEETDB_BASE}?sheet=Tasks`).then(r => r.json()),
  createTask: (data) =>
    fetch(SHEETDB_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, sheet: 'Tasks' }),
    }).then(r => r.json()),
  updateTask: (id, data) =>
    fetch(`${SHEETDB_BASE}/id/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, sheet: 'Tasks' }),
    }).then(r => r.json()),
  deleteTask: (id) =>
    fetch(`${SHEETDB_BASE}/id/${id}?sheet=Tasks`, { method: 'DELETE' }).then(r => r.json()),

  // COLLABORATORS
  getCollaborators: () =>
    fetch(`${SHEETDB_BASE}?sheet=Collaborators`).then(r => r.json()),
  createCollaborator: (data) =>
    fetch(SHEETDB_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, sheet: 'Collaborators' }),
    }).then(r => r.json()),

  // KPIs
  getKPIs: () =>
    fetch(`${SHEETDB_BASE}?sheet=KPIs`).then(r => r.json()),
  updateKPI: (id, value) =>
    fetch(`${SHEETDB_BASE}/id/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: { value, updated_at: new Date().toISOString() },
        sheet: 'KPIs',
      }),
    }).then(r => r.json()),
}
