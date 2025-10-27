// Simple storefront logic using localStorage
const PRODUCTS_URL = 'data/products.json';
let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem('pgs_cart')||'[]');

const productsEl = document.getElementById('products');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');
const searchInput = document.getElementById('searchInput');
const cardForm = document.getElementById('cardForm');
const cancelCheckout = document.getElementById('cancelCheckout');

function renderProducts(list){
  productsEl.innerHTML = '';
  list.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${p.image||'https://picsum.photos/seed/'+p.id+'/400/300'}"/>
      <h4>${p.name}</h4>
      <div class="price">$${p.price.toFixed(2)}</div>
      <div style="margin-top:8px"><button class="btn" data-id="${p.id}">Add to cart</button></div>
    `;
    productsEl.appendChild(div);
  });
}

function fetchProducts(){
  fetch(PRODUCTS_URL).then(r=>r.json()).then(data=>{PRODUCTS=data;renderProducts(PRODUCTS);attachAdd();});
}

function attachAdd(){
  document.querySelectorAll('[data-id]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = Number(btn.getAttribute('data-id'));
      const prod = PRODUCTS.find(p=>p.id===id);
      const found = CART.find(i=>i.id===id);
      if(found) found.qty++;
      else CART.push({id:prod.id,name:prod.name,price:prod.price,qty:1});
      saveCart();
      updateCartCount();
      alert('Added to cart');
    });
  });
}

function saveCart(){ localStorage.setItem('pgs_cart', JSON.stringify(CART)); }
function updateCartCount(){ cartCount.textContent = CART.reduce((s,i)=>s+i.qty,0); }

cartBtn.addEventListener('click',()=>{ renderCart(); cartModal.classList.remove('hidden'); });
closeCart.addEventListener('click',()=>{ cartModal.classList.add('hidden'); });

function renderCart(){
  if(CART.length===0){ cartItemsEl.innerHTML = '<p>Your cart is empty.</p>'; cartTotalEl.textContent = '0.00'; return; }
  cartItemsEl.innerHTML = '';
  CART.forEach(i=>{
    const el = document.createElement('div');
    el.style.display='flex';el.style.justifyContent='space-between';el.style.marginTop='8px';
    el.innerHTML = `<div>${i.name} x ${i.qty}</div><div>$${(i.price*i.qty).toFixed(2)}</div>`;
    cartItemsEl.appendChild(el);
  });
  cartTotalEl.textContent = CART.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);
}

checkoutBtn.addEventListener('click',()=>{ cartModal.classList.add('hidden'); checkoutModal.classList.remove('hidden'); });

checkoutForm.addEventListener('change',(e)=>{
  const method = checkoutForm.payment.value;
  if(method==='card') cardForm.classList.remove('hidden'); else cardForm.classList.add('hidden');
});

checkoutForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(checkoutForm).entries());
  // Mock order placement — store in localStorage orders
  const orders = JSON.parse(localStorage.getItem('pgs_orders')||'[]');
  const order = { id: Date.now(), items: CART, total: CART.reduce((s,i)=>s+i.price*i.qty,0), customer: data.name, phone: data.phone, address: data.address, payment: data.payment, status: 'Pending', date: new Date().toISOString() };
  orders.push(order);
  localStorage.setItem('pgs_orders', JSON.stringify(orders));
  // clear cart
  CART = []; saveCart(); updateCartCount();
  checkoutModal.classList.add('hidden');
  alert('Order placed! Order ID: ' + order.id + '\nPayment: ' + order.payment + '\n(For demo, no real payment was processed)');
});

cancelCheckout.addEventListener('click',()=>{ checkoutModal.classList.add('hidden'); });

searchInput.addEventListener('input',()=>{
  const q = searchInput.value.toLowerCase();
  renderProducts(PRODUCTS.filter(p=>p.name.toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q)));
  attachAdd();
});

updateCartCount();
fetchProducts();
