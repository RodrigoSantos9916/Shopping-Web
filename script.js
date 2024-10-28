const productsContainer = document.getElementById('products-container');
const cartCount = document.getElementById('cart-count');
const categoryList = document.getElementById('category-list');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeCart = document.getElementById('close-cart');
const cartIcon = document.getElementById('cart-icon');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const categoriesBtn = document.getElementById('categories-btn');
const categoriesModal = document.getElementById('categories-modal');
const closeCategories = document.getElementById('close-categories');
const offersBtn = document.getElementById('offers-btn');
const offersModal = document.getElementById('offers-modal');
const closeOffers = document.getElementById('close-offers');
const contactBtn = document.getElementById('contact-btn');
const contactModal = document.getElementById('contact-modal');
const closeContact = document.getElementById('close-contact');

let products = [];
let cart = [];

const categoryTranslations = {
    "men's clothing": "Roupas Masculinas",
    "women's clothing": "Roupas Femininas",
    "jewelery": "Joias",
    "electronics": "Eletrônicos"
};

const offers = [
    { id: 1, name: "Desconto de 20% em Eletrônicos", category: "electronics" },
    { id: 2, name: "Compre 2, Leve 3 em Roupas", category: "clothing" },
    { id: 3, name: "Frete Grátis acima de R$200", category: "all" }
];

async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        displayProducts(products);
        displayCategories();
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        productsContainer.innerHTML = '<p>Erro ao carregar produtos. Por favor, tente novamente mais tarde.</p>';
    }
}

function displayProducts(productsToDisplay) {
    productsContainer.innerHTML = '';
    productsToDisplay.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

function displayCategories() {
    const categories = [...new Set(products.map(product => product.category))];
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        
        categoryElement.classList.add('category-item');
        categoryElement.textContent = categoryTranslations[category] || category;
        categoryElement.addEventListener('click', () => {
            filterByCategory(category);
            categoriesModal.style.display = 'none';
        });
        categoryList.appendChild(categoryElement);
    });
}

function filterByCategory(category) {
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    updateCartModal();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartModal() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <p>${item.title}</p>
            <p>Quantidade: ${item.quantity}</p>
            <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>
            <button class="remove-item" data-id="${item.id}">Remover</button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });
    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartCount();
        updateCartModal();
    }
}

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

function displayOffers() {
    const offersList = document.getElementById('offers-list');
    offersList.innerHTML = '';
    offers.forEach(offer => {
        const offerElement = document.createElement('div');
        offerElement.classList.add('offer-item');
        offerElement.textContent = offer.name;
        offerElement.addEventListener('click', () => {
            if (offer.category === 'all') {
                displayProducts(products);
            } else {
                const filteredProducts = products.filter(product => product.category.includes(offer.category));
                displayProducts(filteredProducts);
            }
            offersModal.style.display = 'none';
        });
        offersList.appendChild(offerElement);
    });
}

cartIcon.addEventListener('click', () => {
    updateCartModal();
    cartModal.style.display = 'block';
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio. Adicione alguns produtos antes de finalizar a compra.');
    } else {
        alert('Obrigado pela sua compra!');
        cart = [];
        updateCartCount();
        updateCartModal();
        cartModal.style.display = 'none';
    }
});

searchButton.addEventListener('click', searchProducts);
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchProducts();
    }
});

categoriesBtn.addEventListener('click', () => {
    categoriesModal.style.display = 'block';
});

closeCategories.addEventListener('click', () => {
    categoriesModal.style.display = 'none';
});

offersBtn.addEventListener('click', () => {
    displayOffers();
    offersModal.style.display = 'block';
});

closeOffers.addEventListener('click', () => {
    offersModal.style.display = 'none';
});

contactBtn.addEventListener('click', () => {
    contactModal.style.display = 'block';
});

closeContact.addEventListener('click', () => {
    contactModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === categoriesModal) {
        categoriesModal.style.display = 'none';
    }
    if (event.target === offersModal) {
        offersModal.style.display = 'none';
    }
    if (event.target === contactModal) {
        contactModal.style.display = 'none';
    }
});

fetchProducts();