console.log("main.js cargado correctamente");

function fixVh() {
  document.documentElement.style.setProperty(
    '--vh',
    `${window.innerHeight * 0.01}px`
  );
}
fixVh();
window.addEventListener('resize', fixVh);


  // ----------- IMPORTACIONES -----------  
  // IMPORTANTE: asegurate de importar estas dos líneas en tu HTML o bundler
  import { getShippingRateByZip } from "./data.js";

function iniciarApp() {
  // ----------- CONSTANTS -------------
  const BASE_URL = 'https://loved-bat-5e42f2e983.strapiapp.com'

  // ----------- REFERENCIAS DOM -------------
  const menuToggle = document.getElementById('menuToggle');
  const barsMenu = document.getElementById('navMenu');
  const cartIcon = document.querySelector('.cart-icon');
  const cartMenu = document.querySelector('.cart');
  const overlay = document.getElementById('overlay');
  const navbarLinks = document.querySelectorAll('.navbar-link');
  const productsCart = document.querySelector('.cart-container');
  const total = document.querySelector('.total');
  const buyBtn = document.querySelector('.btn-buy');
  const deleteBtn = document.querySelector('.btn-delete');
  const cartBubble = document.querySelector('.cart-bubble');
  const closeCartBtn = document.getElementById('cartCloseBtn');
  const closeMenuBtn = document.getElementById('menuCloseBtn');
  const productsContainer = document.querySelector(".products-container");
  const clientForm = document.getElementById('orderForm');
  const paypalContainer = document.getElementById('paypal-button-container');
  const completeSection = document.querySelector('.complete-buy-section');
  const addModal = document.querySelector('.add-modal'); // modal de producto añadido
  const zipInput = document.getElementById("zip");
  const shippingResult = document.getElementById("shippingResult");
  const shippingBtn = document.getElementById("calculateShippingBtn");

  // ----------- GLOBAL SHIPPING (USD) -------------
  let shippingCost = parseFloat(localStorage.getItem("shippingCost")) || 0; // USD

  // Cerrar modal shipping (si existe el botón)
  const closeShippingBtn = document.getElementById("closeShippingModal");
  if (closeShippingBtn) {
    closeShippingBtn.addEventListener("click", () => {
      const modal = document.getElementById("shippingModal");
      if (modal) modal.style.display = "none";
    });
  }

  // ----------- ESTADOS LOCALES -------------
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let gorras = []; // productos desde Strapi

  // ----------- FUNCIÓN PARA ACTUALIZAR STOCK EN STRAPI -------------
  async function sendStockUpdates(cart) {
    const STRAPI_BASE = BASE_URL;

    for (const item of cart) {
      try {
        const res = await fetch(`${STRAPI_BASE}/api/products/update-stock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.documentId || item.id, // acepta ambos
            quantitySold: item.quantity,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(`❌ Error actualizando stock de ${item.id}:`, data);
        } else {
          console.log(`✅ Stock actualizado de ${item.id}: nuevo stock →`, data.newQuantity);
        }
      } catch (err) {
        console.error("⚠️ Fetch error al actualizar stock:", err);
      }
    }
  }

  // ----------- MENÚ Y CARRITO -------------
  const toggleMenu = () => {
    if (barsMenu) barsMenu.classList.toggle("open");
    if (cartMenu && cartMenu.classList.contains("open-cart")) {
      cartMenu.classList.remove("open-cart");
      if (overlay) overlay.classList.remove("show-overlay");
      return;
    }
    if (overlay) overlay.classList.toggle("show-overlay");
  };

  const toggleCart = () => {
    if (cartMenu) cartMenu.classList.toggle("open-cart");
    if (barsMenu && barsMenu.classList.contains("open")) {
      barsMenu.classList.remove("open");
      if (overlay) overlay.classList.remove("show-overlay");
      return;
    }
    if (overlay) overlay.classList.toggle("show-overlay");
  };

  const closeOnClick = (e) => {
    if (!e.target.classList.contains("navbar-link")) return;
    if (barsMenu) barsMenu.classList.remove("open");
    if (overlay) overlay.classList.remove("show-overlay");
  };

  const closeOnOverlayClick = () => {
    if (barsMenu) barsMenu.classList.remove("open");
    if (cartMenu) cartMenu.classList.remove("open-cart");
    if (overlay) overlay.classList.remove("show-overlay");
  };

  const closeCart = () => {
    if (cartMenu) cartMenu.classList.remove("open-cart");
    if (overlay) overlay.classList.remove("show-overlay");
  };

  const closeMenu = () => {
    if (barsMenu) barsMenu.classList.remove("open");
    if (overlay) overlay.classList.remove("show-overlay");
  };

  // ----------- RENDERIZADO DE PRODUCTOS -------------
  const renderProducts = () => {
    if (!productsContainer || !gorras.length) return;

    productsContainer.innerHTML = gorras.map(({ id, name, brand, price, image, inStock, availableQuantity }) => `
      <div class="product">
        <div class="product-image-wrapper">
          <div class="product-stock ${inStock ? 'in-stock' : 'out-of-stock'}">
            ${inStock ? 'In Stock' : 'Sold Out'}
          </div>
          <img src="${image}" alt="product" class="product-img"/>
          <button class="btn-info" data-id="${id}"></button>
        </div>
        <div class="product-text-container">
          <h3 class="product-name">${name}</h3>
          <p class="product-price">$${price.toFixed(2)} USD</p>
        </div>
        <div class="btn-product-container">
          <button 
            class="btn-add" 
            data-id="${id}" 
            ${!inStock ? 'disabled style="background:#ccc;cursor:not-allowed;"' : ''}>
            ${inStock ? 'Add' : 'add'}
          </button>

        </div>
      </div>
    `).join("");
  };

  // ----------- FETCH PRODUCTOS DESDE STRAPI -------------
const PRODUCTS_CACHE_KEY = "products_cache";
const PRODUCTS_CACHE_TIME = 1000 * 60 * 60; // 1 hora

const fetchProducts = async () => {
  try {
    const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
    const cachedTime = localStorage.getItem(`${PRODUCTS_CACHE_KEY}_time`);

    // 1️⃣ Si hay cache válido → usarlo
    if (cached && cachedTime) {
      const age = Date.now() - Number(cachedTime);

      if (age < PRODUCTS_CACHE_TIME) {
        gorras = JSON.parse(cached);
        renderProducts();
        return;
      }
    }

    // 2️⃣ Si no hay cache o expiró → fetch a Strapi
    const res = await fetch(`${BASE_URL}/api/products?populate=*`);
    const { data } = await res.json();

    gorras = data.map(item => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      image: item.image?.url
        ? `${item.image.url}`
        : "https://via.placeholder.com/150",
      inStock: item.inStock,
      availableQuantity: item.availableQuantity,
    }));

    // 3️⃣ Guardar cache
    localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(gorras));
    localStorage.setItem(`${PRODUCTS_CACHE_KEY}_time`, Date.now());

    renderProducts();
  } catch (err) {
    console.error("Error cargando productos:", err);
  }
};


  // ----------- CARRITO -------------
  const saveCart = () => localStorage.setItem("cart", JSON.stringify(cart));

  const renderCart = () => {
    if (!productsCart) return;
    if (!cart.length) {
      productsCart.innerHTML = `<p class="empty-msg">There are no products in the cart.</p>`;
      return;
    }

    productsCart.innerHTML = cart.map(({ id, name, price, image, quantity }) => {
      const product = gorras.find(p => p.id === id);
      const maxQuantity = product ? product.availableQuantity : 0;
      const disableUp = quantity >= maxQuantity ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : '';

      return `
        <div class="cart-item">
          <img src="${image}" alt="producto" />
          <div class="item-info">
            <h3 class="item-title">${name}</h3>
            <p class="item-bid">Price</p>
            <span class="item-price">$ ${price}</span>
          </div>
          <div class="item-handler">
            <span class="quantity-handler down" data-id="${id}">-</span>
            <span class="item-quantity">${quantity}</span>
            <span class="quantity-handler up" data-id="${id}" ${disableUp}>+</span>
          </div>
        </div>
      `;
    }).join("");
  };

  // ----------- TOTAL (PRODUCTOS + SHIPPING) -------------
  const getCartTotal = () => {
    // subtotal productos
    const subtotal = cart.reduce((acc, cur) => cur.price * cur.quantity + acc, 0);
    // shipping desde variable o localStorage (aseguramos float)
    const storedShipping = parseFloat(localStorage.getItem("shippingCost"));
    const shipping = !isNaN(storedShipping) ? storedShipping : shippingCost || 0;
    return subtotal + shipping;
  };

  const showCartTotal = () => {
    if (!total) return;
    const subtotal = cart.reduce((acc, cur) => cur.price * cur.quantity + acc, 0);
    const storedShipping = parseFloat(localStorage.getItem("shippingCost"));
    const shipping = !isNaN(storedShipping) ? storedShipping : shippingCost || 0;

    // Mostrar subtotal, shipping y total si querés; por ahora mantenemos tu `.total` con TOTAL (productos + envío)
    total.innerHTML = `$ ${ (subtotal + shipping).toFixed(2) }`;
  };

  const updateCartBubble = () => {
    if (!cartBubble) return;
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartBubble.textContent = totalQuantity > 0 ? totalQuantity : "0";
  };

  // ============================================================
  // 🚚 **ENVÍO — OPCIÓN B (Tarifas por zona usando data.js) - USD**
  // ============================================================
  // Supone que getShippingRateByZip(zip) está presente y devuelve { price: <number>, state: <string> } en USD
  const calculateShipping = () => {
    const zip = zipInput ? zipInput.value.trim() : "";

    if (!zip) {
      alert("Ingresa un código postal válido");
      return;
    }

    // getShippingRateByZip debe estar definido en tu proyecto (data.js o similar)
    const result = typeof getShippingRateByZip === "function" ? getShippingRateByZip(zip) : null;

    if (!result) {
      if (shippingResult) shippingResult.textContent = "Invalid Zip Code";
      shippingCost = 0;
      localStorage.setItem("shippingCost", 0);
      updateCartState();
      return;
    }

    // Aquí asumimos que result.price ya está en USD (como acordamos)
    shippingCost = parseFloat(result.price) || 0;
    if (shippingResult) shippingResult.textContent = `Shipping: $${shippingCost.toFixed(2)} USD (Zona: ${result.state || "N/A"})`;
    localStorage.setItem("shippingCost", shippingCost);

    updateCartState();
  };

  // Conectar botón de calcular envío si existe
  if (shippingBtn) shippingBtn.addEventListener("click", calculateShipping);

  // ============================================================

  const updateCartState = () => {
    saveCart();
    renderCart();
    showCartTotal();
    updateCartBubble();
  };

  // ----------- MODAL PRODUCTO AÑADIDO -------------
  const showAddModal = () => {
    if (!addModal) return;
    addModal.classList.add("active-modal");
    setTimeout(() => addModal.classList.remove("active-modal"), 2000);
  };

  // ----------- MANEJO DE PRODUCTOS -------------
  const handleProductClick = (e) => {
    if (!gorras) return;
    if (e.target.classList.contains("btn-info")) {
      const id = Number(e.target.dataset.id);
      localStorage.setItem("selectedProductId", id);
      window.location.href = "info-section.html";
    }

    if (e.target.classList.contains("btn-add")) {
      const id = Number(e.target.dataset.id);
      const product = gorras.find(p => p.id === id);
      if (product) addProduct(product);
    }
  };

  const addProduct = (product) => {
    const existing = cart.find(p => p.id === product.id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    updateCartState();
    showAddModal();
  };

  const handleQuantity = (e) => {
    const id = e.target.dataset.id;
    const product = cart.find(p => p.id.toString() === id);
    if (!product) return;

    const original = gorras.find(p => p.id.toString() === id);
    const maxQuantity = original ? original.availableQuantity : 0;

    if (e.target.classList.contains("down")) {
      if (product.quantity === 1) {
        if (confirm("¿Eliminar producto del carrito?")) cart = cart.filter(p => p.id !== product.id);
      } else product.quantity--;
    } else if (e.target.classList.contains("up")) {
      if (product.quantity < maxQuantity) product.quantity++;
    }

    updateCartState();
  };

  // ----------- PAYPAL -------------
const handlePaymentSuccess = async (cartItems) => {
  await sendStockUpdates(cartItems);

      // 🧹 limpiar cache de productos (stock actualizado)
  localStorage.removeItem("products_cache");
  localStorage.removeItem("products_cache_time");

  const cartCopy = [...cartItems]; 

  // Guarda shipping ANTES de borrarlo
  const shippingPaid = parseFloat(localStorage.getItem("shippingCost")) || 0;

  // Limpiar carrito
  localStorage.removeItem("cart");
  cart = [];
  updateCartState();
  if (paypalContainer) paypalContainer.innerHTML = "";

  // limpiar shipping guardado
  localStorage.removeItem("shippingCost");
  shippingCost = 0;
  if (shippingResult) {
    shippingResult.textContent = "";
    shippingResult.dataset.monto = "0";
  }
  if (zipInput) zipInput.value = "";

  if (completeSection) {
    const resumenProductos = cartCopy
      .map(p => `${p.quantity}x ${p.name} - $${(p.quantity * p.price).toFixed(2)}`)
      .join('<br>');

    const subtotal = cartCopy.reduce((acc, p) => acc + (p.price * p.quantity), 0);

    const resumenHTML = `
      <div class="complete-buy-message">
        <h2>Thank you for your purchase!</h2>
        <p>You are now part of the Serving Hats Family. You will receive an email shortly with your order confirmation and tracking number.</p>
        <div class="order-summary">
          ${resumenProductos}
          <div style="margin-top:12px;">
            <strong>Shipping:</strong> $${shippingPaid.toFixed(2)} USD<br>
            <strong>TOTAL:</strong> $${(subtotal + shippingPaid).toFixed(2)} USD
          </div>
        </div>
        <button id="backToShop">Back to Shop</button>
      </div>
    `;

    completeSection.innerHTML = resumenHTML;

    const backBtn = document.getElementById('backToShop');
    if (backBtn) backBtn.addEventListener('click', () => {
      window.location.href = "shop-now.html";
    });
  }
};


  const renderPayPalButton = (cartItems) => {
    if (!window.paypal || !paypalContainer) return;
    paypalContainer.innerHTML = "";
    if (!cartItems.length) return;

    // total con envio incluido
    const total = getCartTotal();
    const totalValue = total > 0 ? total.toFixed(2) : "0.01";

    paypal.Buttons({
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{
          amount: {
            value: totalValue,
            // opcional: breakdown si quieres (remove if not needed)
            /* breakdown: {
              item_total: { currency_code: "USD", value: itemsSubtotal.toFixed(2) },
              shipping: { currency_code: "USD", value: (parseFloat(localStorage.getItem("shippingCost")) || 0).toFixed(2) }
            } */
          }
        }]
      }),
      onApprove: (data, actions) => {
        return actions.order.capture().then(async () => {
          // antes de enviar el form asegurarnos que orderSummary refleja shipping y total
          try {
            // actualizar orderSummary para emailJS con shipping y total
            const resumenProductos = cart.map(p => `${p.quantity}x ${p.name} - $${(p.quantity * p.price).toFixed(2)}`).join('\n');
            const subtotal = cart.reduce((acc, p) => acc + p.quantity * p.price, 0);
            const shipping = parseFloat(localStorage.getItem("shippingCost")) || 0;
            const resumenFinal = `${resumenProductos}\n\nShipping: $${shipping.toFixed(2)} USD\nTOTAL FINAL: $${(subtotal + shipping).toFixed(2)} USD`;
            const orderSummaryInput = document.getElementById("orderSummary");
            if (orderSummaryInput) orderSummaryInput.value = resumenFinal;

            // enviar emailJS (tu template)
            await emailjs.sendForm('service_upo688a', 'template_vw34945', clientForm);
          } catch (err) {
            console.error("Error al enviar email:", err);
          }

          // finalizar compra (stock + limpiar)
          await handlePaymentSuccess(cartItems);
        });
      },
      onError: (err) => console.error("Error PayPal:", err)
    }).render("#paypal-button-container");
  };

  // ----------- FORMULARIO -------------
  if (clientForm) {
    clientForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const resumen = cart.map(p => `${p.quantity}x ${p.name} - $${(p.quantity * p.price).toFixed(2)}`).join('\n');

      const subtotal = cart.reduce((acc, p) => acc + p.quantity * p.price, 0);
      // shipping desde localStorage (o variable)
      const shipping = parseFloat(localStorage.getItem("shippingCost")) || shippingCost || 0;
      const totalFinal = subtotal + shipping;

      const resumenCompleto = `${resumen}\n\nShipping: $${shipping.toFixed(2)} USD\nTOTAL FINAL: $${totalFinal.toFixed(2)} USD`;
      const orderSummaryInput = document.getElementById("orderSummary");
      if (orderSummaryInput) orderSummaryInput.value = resumenCompleto;

      const cliente = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        country: document.getElementById("country").value,
        state: document.getElementById("state").value,
        city: document.getElementById("city").value,
        zip: document.getElementById("zip").value
      };
      sessionStorage.setItem('clienteData', JSON.stringify(cliente));

      clientForm.style.display = 'none';
      if (paypalContainer) paypalContainer.style.display = 'block';
      renderPayPalButton(cart);
    });
  }

  // ----------- EVENTOS -------------
  if (buyBtn) buyBtn.addEventListener("click", (e) => {
    // Si querés, exigimos calcular envío antes de pasar a complete:
    const shippingStored = parseFloat(localStorage.getItem("shippingCost")) || shippingCost || 0;
    if (shippingStored === 0) {
      // abrir modal de cálculo de shipping si existe
      const modal = document.getElementById("shippingModal");
      if (modal) {
        modal.style.display = "flex";
        // asegurar que el carrito quede abierto para que el usuario calcule
        if (cartMenu && !cartMenu.classList.contains("open-cart")) {
          cartMenu.classList.add("open-cart");
        }
        if (overlay && !overlay.classList.contains("show-overlay")) {
          overlay.classList.add("show-overlay");
        }
        if (zipInput) zipInput.scrollIntoView({ behavior: "smooth", block: "center" });
        return; // detenemos navegación hasta que calcule shipping
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "complete-buy.html";
  });

  if (deleteBtn) deleteBtn.addEventListener("click", () => {
    cart = [];
    // limpiar envío al vaciar carrito
    shippingCost = 0;
    localStorage.removeItem("shippingCost");
    if (shippingResult) {
      shippingResult.textContent = "";
      shippingResult.dataset.monto = "0";
    }
    updateCartState();
  });

  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);
  if (menuToggle) menuToggle.addEventListener("click", toggleMenu);
  if (cartIcon) cartIcon.addEventListener("click", toggleCart);
  if (navbarLinks) navbarLinks.forEach(link => link.addEventListener("click", closeOnClick));
  if (productsContainer) productsContainer.addEventListener("click", handleProductClick);
  if (productsCart) productsCart.addEventListener("click", handleQuantity);

  // Si el zipInput existe, podemos permitir calcular con Enter
  if (zipInput) {
    zipInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calculateShipping();
      }
    });
  }

  // ----------- RENDER INICIAL -------------
  fetchProducts();
  updateCartState();
}

// ----------- INICIALIZAR APP AL CARGAR EL DOM -------------
document.addEventListener("DOMContentLoaded", iniciarApp);
