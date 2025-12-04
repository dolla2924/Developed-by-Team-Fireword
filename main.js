document.addEventListener('DOMContentLoaded', () => {
    // 1. Corrected element selections based on HTML classes/IDs
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemCount = document.querySelector('.cart_icon span');
    const cartTotal = document.querySelector('.cart-total');
    const cartItemsList = document.querySelector('.cart-items-list'); // Corrected to target the list container
    const cartIcon = document.getElementById('cart-icon'); // Corrected to target the icon container
    const sidebar = document.getElementById('sidebar'); // Corrected ID

    let cartItems = [];
    let totalAmount = 0;

    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            // Get item details from the corresponding card
            const cardElement = event.target.closest('.card');
            if (!cardElement) return;

            const name = cardElement.querySelector('.card-title').textContent.trim();
            const priceText = cardElement.querySelector('.price').textContent;
            
            // Corrected price extraction: remove " LE" and parse float
            const price = parseFloat(priceText.replace(' LE', '').trim()); 

            if (isNaN(price)) {
                console.error("Error: Price is not a valid number.");
                return; 
            }

            const item = {
                name: name,
                price: price,
                quantity: 1,
            };

            const existingItem = cartItems.find(
                (cartItem) => cartItem.name === item.name,
            );

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push(item);
            }

            totalAmount += item.price;
            updateCartUI();
        });
    });

    function updateCartUI() {
        updateCartItemCount(cartItems.reduce((acc, item) => acc + item.quantity, 0)); // Sum of all quantities
        updateCartItemList();
        updateCartTotal();
    }

    function updateCartItemCount(count) {
        cartItemCount.textContent = count;
    }

    function updateCartItemList() {
        cartItemsList.innerHTML = '';
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'individual-cart-item');
            
            // Note: Changed price format to LE to match your currency
            cartItem.innerHTML = `
                <span>(${item.quantity}x) ${item.name}</span>
                <span class="cart-item-price">
                    LE ${(item.price * item.quantity).toFixed(2)}
                    <button class="remove-btn" data-index="${index}">
                        <i class="fa-solid fa-xmark"></i> 
                    </button>
                </span>
            `;
            cartItemsList.append(cartItem);
        });

        const removeButtons = document.querySelectorAll('.remove-btn'); // Corrected class selector
        removeButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                // Find the index from the data attribute on the button itself
                const index = event.currentTarget.dataset.index;
                removeItemFromCart(parseInt(index));
            });
        });
    }

    function removeItemFromCart(index) {
        const removeItem = cartItems.splice(index, 1)[0];
        totalAmount -= removeItem.price * removeItem.quantity;
        updateCartUI();
    }

    function updateCartTotal() {
        // Corrected total display format to match LE currency
        cartTotal.textContent = `LE ${totalAmount.toFixed(2)}`; 
    }

    // Event listener to OPEN the sidebar when the cart icon is clicked
    cartIcon.addEventListener('click', () => {
        sidebar.classList.add('open'); // Added 'open' class to show sidebar
    });

    // Event listener to CLOSE the sidebar when the close icon is clicked
    const closeButton = document.querySelector('.sidebar-close'); // Corrected class selector
    closeButton.addEventListener('click', () => { // Corrected syntax
          sidebar.classList.remove('open');
    });

    // Initial UI update to ensure correct display on load
    updateCartUI(); 
});