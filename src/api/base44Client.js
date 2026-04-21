const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const request = async (path, options = {}) => {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'include',
    ...options
  });

  if (!response.ok) {
    let errorBody = null;
    try {
      errorBody = await response.json();
    } catch (err) {
      errorBody = { message: response.statusText };
    }
    const error = new Error(errorBody?.message || 'Request failed');
    error.status = response.status;
    error.data = errorBody;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
};

const entityClient = (resource) => ({
  list: () => request(`/api/${resource}`),
  create: (data) => request(`/api/${resource}`, {
    method: 'POST',
    body: JSON.stringify(data || {})
  }),
  update: (id, data) => request(`/api/${resource}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data || {})
  }),
  delete: (id) => request(`/api/${resource}/${id}`, {
    method: 'DELETE'
  })
});

export const base44 = {
  entities: {
    Toner: entityClient('toners'),
    Printer: entityClient('printers'),
    Manufacturer: entityClient('manufacturers'),
    PrinterModel: entityClient('printer-models'),
    Cabinet: entityClient('cabinets'),
    ShelfPosition: entityClient('shelf-positions'),
    Location: entityClient('locations'),
    TonerLocationSettings: entityClient('toner-location-settings')
  },
  users: {
    list: () => request('/api/users'),
    create: (data) => request('/api/users', {
      method: 'POST',
      body: JSON.stringify(data || {})
    }),
    update: (id, data) => request(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data || {})
    }),
    delete: (id) => request(`/api/users/${id}`, {
      method: 'DELETE'
    })
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${apiBase}/api/uploads`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        if (!response.ok) {
          const error = new Error('Upload failed');
          error.status = response.status;
          throw error;
        }
        return response.json();
      }
    }
  },
  auth: {
    me: () => request('/api/auth/me'),
    logout: () => Promise.resolve(),
    redirectToLogin: (returnUrl) => {
      window.location.href = returnUrl || '/';
    }
  },
  appLogs: {
    logUserInApp: (pageName) => request('/api/app-logs', {
      method: 'POST',
      body: JSON.stringify({ page_name: pageName })
    })
  }
};
