// Admin panel reads and writes to localStorage (demo)
const productListEl = document.getElementById('productList');
const orderListEl = document.getElementById('orderList');
const refreshBtn = document.getElementById('refreshBtn');
const addProd = document.getElementById('addProd');

let PRODUCTS = JSON.parse(localStorage.getItem('pgs_products')) || null;
if(!PRODUCTS){
  // initial load from data/products.json via fetch
  fetch('data/products.json').then(r=>r.json()).then(d=>{ PRODUCTS=d; localStorage.setItem('pgs_products', JSON.stringify(PRODUCTS)); renderProducts(); });
} else renderProducts();

let ORDERS = JSON.parse(localStorage.getItem('pgs_orders')||'[]');
renderOrders();

refreshBtn.addEventListener('click',()=>{ window.location.reload(); });

function renderProducts(){
  productListEl.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const div = document.createElement('div');
    div.style.display='flex';div.style.justifyContent='space-between';div.style.padding='8px 0';
    div.innerHTML = `<div>${p.name} — $${p.price} — stock: ${p.stock}</div><div><button data-id="${p.id}" class="btn small edit">Edit</button> <button data-id="${p.id}" class="btn small del" style="background:#ef4444">Delete</button></div>`;
    productListEl.appendChild(div);
  });
  attachProductEvents();
}

function attachProductEvents(){
  document.querySelectorAll('.del').forEach(b=>b.addEventListener('click',()=>{ const id=Number(b.getAttribute('data-id')); PRODUCTS=PRODUCTS.filter(p=>p.id!==id); localStorage.setItem('pgs_products',JSON.stringify(PRODUCTS)); renderProducts(); }));
}

addProd.addEventListener('click',()=>{
  const name = document.getElementById('pName').value;
  const price = parseFloat(document.getElementById('pPrice').value)||0;
  const stock = parseInt(document.getElementById('pStock').value)||0;
  const image = document.getElementById('pImage').value||'';
  if(!name) return alert('Name required');
  const id = PRODUCTS.length?PRODUCTS[PRODUCTS.length-1].id+1:1;
  PRODUCTS.push({id,name,price,stock,image});
  localStorage.setItem('pgs_products',JSON.stringify(PRODUCTS));
  renderProducts();
});

function renderOrders(){
  orderListEl.innerHTML = '';
  ORDERS.forEach(o=>{
    const div = document.createElement('div');
    div.style.borderBottom='1px solid #eee';div.style.padding='8px 0';
    div.innerHTML = `<div><strong>#${o.id}</strong> ${o.customer} — ${o.payment} — $${o.total.toFixed(2)} — <em>${o.status}</em></div><div style="margin-top:6px"><button data-id="${o.id}" class="btn small approve">Approve</button> <button data-id="${o.id}" class="btn small" style="background:#ef4444">Decline</button></div>`;
    orderListEl.appendChild(div);
  });
  attachOrderEvents();
}

function attachOrderEvents(){
  document.querySelectorAll('.approve').forEach(b=>b.addEventListener('click',()=>{ const id=Number(b.getAttribute('data-id')); ORDERS=ORDERS.map(o=>o.id===id?{...o,status:'Approved'}:o); localStorage.setItem('pgs_orders',JSON.stringify(ORDERS)); renderOrders(); }));
  document.querySelectorAll('.approve').forEach(b=>b.addEventListener('click',()=>{}));
  document.querySelectorAll('.del').forEach(()=>{});
}

// save initial orders if none
if(!localStorage.getItem('pgs_orders')) localStorage.setItem('pgs_orders',JSON.stringify(ORDERS));
