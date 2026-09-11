// Base URL of the backend API tier. In k8s this is proxied via an
// Ingress path (/api) so the browser never needs to know the service DNS name.
const API_BASE = window.API_BASE || '/api';

function renderItem(item) {
  return `${item.name} (qty: ${item.quantity})`;
}

async function fetchItems() {
  const res = await fetch(`${API_BASE}/items`);
  const items = await res.json();
  const list = document.getElementById('itemList');
  list.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = renderItem(item);
    list.appendChild(li);
  });
}

async function addItem() {
  const name = document.getElementById('name').value;
  const quantity = Number(document.getElementById('quantity').value || 0);
  await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, quantity })
  });
  await fetchItems();
}

if (typeof document !== 'undefined') {
  document.getElementById('addBtn')?.addEventListener('click', addItem);
  fetchItems();
}

// Exported for unit testing in a Node/Jest environment.
if (typeof module !== 'undefined') {
  module.exports = { renderItem };
}
