
export const saveCredentials = async (email, password) => {
  const response = await fetch('https://noaicode-production.up.railway.app/save-credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const checkCredentials = async (email) => {
  const response = await fetch('https://noaicode-production.up.railway.app/check-credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return response.json();
};

export const checkAllCredentials = async (email, password) => {
  const response = await fetch('https://noaicode-production.up.railway.app/check-all-credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password}),
  });
  return response.json();
};

export const delCredentials = async (email) => {
  const response = await fetch('https://noaicode-production.up.railway.app/del-credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email}),
  });
  return response.json();
};

export const changeCredentials = async (email, password) => {
  const response = await fetch('https://noaicode-production.up.railway.app/change-credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const getCredentials = async () => {
  const response = await fetch('https://noaicode-production.up.railway.app/get-credentials', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return data;

};