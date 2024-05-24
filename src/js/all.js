document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".mobile-nav").addEventListener("click", () => {
    document.querySelector("header nav").classList.toggle("show");
  });
});

const fadeOut = (el) => { el.style.opacity = 1.5; (function fade() { if ((el.style.opacity -= 0.08) < 0) { el.style.display = "none"; } else { requestAnimationFrame(fade); } })(); };

const fadeIn = (el, display) => { el.style.opacity = 0; el.style.display = display || "block"; (function fade() { var val = parseFloat(el.style.opacity); if (!((val += 0.1) > 1)) { el.style.opacity = val; requestAnimationFrame(fade); } })(); };

window.addEventListener("DOMContentLoaded", function () {
  function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    console.log(cartItems);
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      cartCount.textContent = cartItems.length;
    }
  }
  updateCartCount();
});

// Background overlay for popup & cart

function openov(){
  document.querySelector(".overlay").classList.add("show");
  document.body.classList.add("ov");
  fadeIn(document.querySelector(".overlay"));
};

function closeov() {
  document.querySelector(".overlay").classList.remove("show");
  document.querySelector(".popup").classList.remove("show");
  document.body.classList.remove("ov");
  fadeOut(document.querySelector(".overlay"));
  fadeOut(document.querySelector(".modal-content"));
  closeModal();
};

function toggleov(element, action) {
  document.querySelectorAll(element).forEach((el) => el.setAttribute('onclick', `${action}()`));
}

document.addEventListener("DOMContentLoaded", function () {
  toggleov('.overlay', 'closeov');

  toggleov('.popup .product .close-pop', 'closeov');

  toggleov('header .cart-button', 'openov');
  toggleov('.modal-header .close', 'closeov');
});

// Modals function

const cartButton = document.querySelector(".cart-button");

// Add a click event listener to the cart button
cartButton.addEventListener("click", displayCartModal);

// Get references to the modal and close button
const modal = document.getElementById("cartModal");
const closeButton = document.querySelector(".close");

// Add click event listener to close button
closeButton.addEventListener("click", closeModal);

function displayCartModal() {
  const totalPriceElement = document.getElementById("total-price");

  const cartItemsData = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartItemsContainer = document.getElementById("cartItemsContainer");

  var totalPriceAllItems = 0;

  // Clear previous content
  cartItemsContainer.innerHTML = "";

  // Loop through cart items data and display them
  cartItemsData.forEach((item, index) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");

    // Create container for item details
    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("item-details");

    // Create container for item image
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("item-image");
    const itemImage = document.createElement("img");
    itemImage.src = item.image; // Assuming you have imageUrl property in your cartItemsData
    imageContainer.appendChild(itemImage);

    const itemText = document.createElement("div");
    itemText.classList.add("item");

    // Create item name element
    const itemName = document.createElement("p");
    itemName.classList.add("item-title")
    itemName.textContent = item.name;

    const itemDescription = document.createElement("div");
    itemDescription.classList.add("item-description");

    const itemSize = document.createElement("p");
    itemSize.textContent = "Size : " + item.size;
    const itemType = document.createElement("p");
    itemType.textContent = "Ice : " + item.type;
    const itemSugar = document.createElement("p");
    itemSugar.textContent = "Sugar : " + item.sugar;

    itemDescription.appendChild(itemSize);
    itemDescription.appendChild(itemType);
    itemDescription.appendChild(itemSugar);

    // Create item price element
    const itemPrice = document.createElement("p");
    itemPrice.textContent = item.price;
    itemPrice.classList.add(`item-price-${index}`);
    itemPrice.setAttribute("value", item.originalPrice); // Store the base price for calculations

    itemText.appendChild(itemName);
    itemText.appendChild(itemDescription);
    itemText.appendChild(itemPrice);

    // Append name and price to details container
    detailsContainer.appendChild(imageContainer);
    detailsContainer.appendChild(itemText);

    // Create container for buttons (delete, increase, decrease)
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    // Create delete button
    const deleteContainer = document.createElement("div");
    deleteContainer.classList.add("delete-container");
    deleteContainer.onclick = () => {
      deleteCartItem(index);
    };

    const deleteButton = document.createElement("i");
    deleteButton.classList.add("fas", "fa-trash");

    deleteContainer.appendChild(deleteButton);

    const quantity = document.createElement("div");
    quantity.classList.add("item-quantity");

    // Create elements for minus button
    const minusButton = document.createElement("div");
    minusButton.classList.add("minus");
    minusButton.dataset.itemName = item.name;
    minusButton.onclick = () => {
      decreaseValue();
    }; // Assuming decreaseValue is defined elsewhere
    minusButton.innerHTML = '<i class="fas fa-minus"></i>';

    // Create element for input field
    const inputField = document.createElement("div");
    inputField.classList.add("value");
    const inputElement = document.createElement("input");
    inputElement.id = `product-amount-${index}`;
    inputElement.value = item.quantity || 1; // Assuming you have a quantity property
    inputField.appendChild(inputElement);

    // Create elements for plus button
    const plusButton = document.createElement("div");
    plusButton.classList.add("plus");
    plusButton.dataset.itemName = item.name;
    plusButton.onclick = () => {
      increaseValue();
    }; // Assuming increaseValue is defined elsewhere
    plusButton.innerHTML = '<i class="fas fa-plus"></i>';

    function decreaseValue() {
      const inputElement = document.getElementById(`product-amount-${index}`);
      let currentValue = parseInt(inputElement.value);
      if (currentValue > 1) {
        currentValue--;
        inputElement.value = currentValue;
        item.quantity = currentValue; // Update the quantity in the data
        updatePrice(currentValue);
      }
    }

    function increaseValue() {
      const inputElement = document.getElementById(`product-amount-${index}`);
      let currentValue = parseInt(inputElement.value);
      currentValue++;
      inputElement.value = currentValue;
      item.quantity = currentValue; // Update the quantity in the data
      updatePrice(currentValue);
    }

    function updatePrice(quantity) {
      const priceElement = document.querySelector(`.item-price-${index}`);
      const price = parseInt(priceElement.getAttribute("value"));

      const totalPrice = price * quantity;
      priceElement.textContent = "Rp " + totalPrice.toLocaleString("id-ID");

      cartItemsData[index].quantity = quantity; // Update quantity in cartItemsData

      cartItemsData[index].price = "Rp " + totalPrice.toLocaleString("id-ID"); // Update quantity in cartItems
      localStorage.setItem("cartItems", JSON.stringify(cartItemsData));

      updateTotalPrice();
    }

    function updateTotalPrice() {
      totalPriceAllItems = cartItemsData.reduce((total, item) => {
        return total + item.originalPrice * item.quantity;
      }, 0);
      totalPriceElement.textContent =
        "Rp " + totalPriceAllItems.toLocaleString("id-ID");
    }

    // Append the elements to the quantity container
    quantity.appendChild(minusButton);
    quantity.appendChild(inputField);
    quantity.appendChild(plusButton);

    // Append buttons to button container
    buttonContainer.appendChild(quantity);
    buttonContainer.appendChild(deleteContainer);

    // Append image, details and buttons to item container
    itemContainer.appendChild(detailsContainer);
    itemContainer.appendChild(buttonContainer);

    // Append item container to cart items container
    cartItemsContainer.appendChild(itemContainer);

    totalPriceAllItems +=
      parseInt(item.originalPrice) * parseInt(item.quantity);
  });

  totalPriceElement.setAttribute("value", totalPriceAllItems);
  totalPriceElement.textContent =
    "Rp " + totalPriceAllItems.toLocaleString("id-ID");
  // Open the modal
  openModal();
}

function deleteCartItem(index) {
  // Retrieve the cart items from localStorage
  const cartItemsData = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Remove the item at the specified index
  cartItemsData.splice(index, 1);

  // Update the cart items in localStorage
  localStorage.setItem("cartItems", JSON.stringify(cartItemsData));

  // Re-render the cart items
  displayCartModal();
}

const modalContent = document.querySelector('.modal-content');

function closeModal() {
  modal.classList.remove("show");
  fadeOut(modalContent);
}
function openModal() {
  modal.classList.add("show");
  fadeIn(modalContent);
}