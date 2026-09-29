const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      let errorMsg = `HTTP ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorData.message || errorMsg;
      } catch (e) {
        // use default
      }
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Contacts
  getContacts: () => request('/contacts'),
  getContact: (id) => request(`/contacts/${id}`),
  createContact: (data) => request('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  deleteContact: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),
  
  // Commitments
  getContactCommitments: (contactId) => request(`/contacts/${contactId}/commitments`),
  addCommitment: (contactId, data) => request(`/contacts/${contactId}/commitments`, { method: 'POST', body: JSON.stringify(data) }),
  updateCommitment: (commitmentId, data) => request(`/contacts/commitments/${commitmentId}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Meetings
  getMeetings: () => request('/meetings'),
  getMeeting: (id) => request(`/meetings/${id}`),
  createMeeting: (data) => request('/meetings', { method: 'POST', body: JSON.stringify(data) }),
  deleteMeeting: (id) => request(`/meetings/${id}`, { method: 'DELETE' }),
  learnFromMeeting: (meetingId) => request(`/meetings/${meetingId}/learn`, { method: 'POST' }),

  // Prepare Briefing
  prepareContactMeeting: (contactId, payload = {}) => request(`/contacts/${contactId}/prepare`, { method: 'POST', body: JSON.stringify(payload) }),

  // Memory & Timeline
  getContactMemory: (contactId) => request(`/contacts/${contactId}/memory`),
  getContactTimeline: (contactId) => request(`/contacts/${contactId}/timeline`),

  // Demo & Diagnostics
  seedDemoData: () => request('/demo/seed', { method: 'POST' }),
  getSystemStats: () => request('/demo/stats'),
};
