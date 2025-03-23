document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");

    fetch("https://ecommerce-backend-h0w3.onrender.com/products")
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("product");

                // ✅ Assign images dynamically based on product names
                const productImages = {
                    "laptop": "images/laptop.jpg",
                    "headphones": "images/headphones.png",
                    "smartphone": "images/smartphone.jpg",
                    "tablet": "images/tablet.jpg",
                    "wireless mouse": "images/mouse.jpg",
                    "smartwatch": "images/watch.jpg",
                    "mechanical keyboard": "images/keyboard.jpg",
                    "gaming console": "images/console.jpg",
                    "monitor": "images/monitor.jpg",
                    "external hard drive": "images/powerbank.jpg"
                };

                let imagePath = productImages[product.name.toLowerCase()] || "images/default.jpg";

                productDiv.innerHTML = `
                    <img src="${imagePath}" alt="${product.name}" width="200">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p><strong>$${product.price}</strong></p>
                    <button onclick="viewDetails('${product.id}', '${product.name}', '${product.price}')">View Details</button>
                    <button class="buy-now" onclick="buyNow('${product.id}', '${product.name}', '${product.price}')">Buy Now</button>
                `;
                productList.appendChild(productDiv);
            });
        })
        .catch(error => console.error("Error fetching products:", error));
});

// ✅ Navigate to product details page & Push DataLayer Event
function viewDetails(productId, productName, productPrice) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: "view_item",
        ecommerce: {
            items: [{
                id: productId,
                name: productName,
                price: productPrice
            }]
        }
    });

    console.log("View Details event pushed:", { productId, productName, productPrice });

    window.location.href = `details.html?id=${productId}`;
}

// ✅ Handle Buy Now action & Push DataLayer Event
function buyNow(productId, productName, productPrice) {
    const transactionId = Math.random().toString(36).substr(2, 9); // Generate fake transaction ID

    fetch("https://ecommerce-backend-h0w3.onrender.com/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, productId, productName })
    })
    .then(response => response.json())
    .then(data => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "purchase",
            ecommerce: {
                transaction_id: data.transactionId,
                items: [{
                    id: productId,
                    name: productName,
                    price: productPrice
                }]
            }
        });

        console.log("Purchase event pushed:", { transactionId: data.transactionId, productId, productName, productPrice });

        window.location.href = `transactions.html?transactionId=${data.transactionId}&productId=${productId}&productName=${encodeURIComponent(productName)}`;
    })
    .catch(error => console.error("Error processing purchase:", error));
}
