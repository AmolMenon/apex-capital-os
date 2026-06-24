const fetch = require('node-fetch');

async function getDeal(id) {
  const res = await fetch(`http://127.0.0.1:8000/deals/${id}`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

getDeal('zepto').then(console.log).catch(console.error);
