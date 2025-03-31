// Load XML using AJAX
function loadBooks() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "books.xml", true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            displayBooks(xhr.responseXML);
        }
    };
    xhr.send();
}

// Display books in the HTML
function displayBooks(xml) {
    let bookList = document.getElementById("bookList");
    let books = xml.getElementsByTagName("book");

    bookList.innerHTML = "";
    for (let i = 0; i < books.length; i++) {
        let title = books[i].getElementsByTagName("title")[0].textContent;
        let author = books[i].getElementsByTagName("author")[0].textContent;
        let price = books[i].getElementsByTagName("price")[0].textContent;
        let bookId = books[i].getAttribute("id");

        let bookItem = document.createElement("div");
        bookItem.classList.add("book-item");
        bookItem.innerHTML = `
            <strong>${title}</strong> by ${author} - $${price}
            <button onclick="addToCart('${bookId}', '${title}', '${price}')">Add to Cart</button>
        `;
        bookList.appendChild(bookItem);
    }
}

// Search function
function filterBooks() {
    let searchQuery = document.getElementById("searchInput").value.toLowerCase();
    let bookItems = document.getElementsByClassName("book-item");
    let bookFound = false; // Flag to track if any books match the query

    for (let book of bookItems) {
        let text = book.textContent.toLowerCase();
        if (text.includes(searchQuery)) {
            book.style.display = "block";
            bookFound = true; // At least one book matches
        } else {
            book.style.display = "none";
        }
    }

    // Display feedback if no books match the search
    let feedback = document.getElementById("searchFeedback");
    if (!bookFound) {
        feedback.innerText = "No books found matching your search.";
    } else {
        feedback.innerText = ""; // Clear feedback if books are found
    }
}

// Shopping Cart Logic
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id, title, price) {
    cart.push({ id, title, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    calculateCartTotal(); // Update total after adding
}

function displayCart() {
    let cartList = document.getElementById("cartList");
    cartList.innerHTML = "";
    cart.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${item.title} - $${item.price} <button onclick="removeFromCart(${index})">❌</button>`;
        cartList.appendChild(li);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    calculateCartTotal(); // Update total after removing
}


// Load books and cart on page load
window.onload = function() {
    loadBooks();
    displayCart();
}
function calculateCartTotal() {
    let totalAmount = 0;

    // Calculate the total by summing up the prices of books in the cart
    cart.forEach(item => {
        totalAmount += parseFloat(item.price); // Ensure price is treated as a number
    });

    // Display the total amount in a designated HTML element
    document.getElementById("cartTotal").innerText = `Total: $${totalAmount.toFixed(2)}`;
}
window.onload = function() {
    loadBooks();
    displayCart();
    calculateCartTotal();
}
function clearCart() {
    // Clear the cart array
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update the cart display and total
    displayCart();
    calculateCartTotal();

    // Provide feedback (optional)
    alert("Cart has been cleared!");
}
function clearSearchBar() {
    document.getElementById("searchInput").value = ""; // Clear the search bar
    filterBooks(); // Optionally refresh the book list after clearing the search
}