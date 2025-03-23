document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");

    fetch("https://ecommerce-backend-h0w3.onrender.com/products")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            return response.json();
        })
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
                    <img src="${imagePath}" alt="${product.name}" width="200" onclick="trackProductView('${product.id}', '${product.name}', '${product.price}')">
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

// ✅ Track Product View (Triggers on Image Click)
function trackProductView(productId, productName, productPrice) {
    if (!productId || !productName || !productPrice) return;

    // Push to GA4 DataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: "product_view",
        ecommerce: {
            items: [{ id: productId, name: productName, price: productPrice }]
        }
    });

    console.log("GA4 Product View Event:", { productId, productName, productPrice });

    // Push to Tealium
    var utag_data = {
        tealium_event: "product_view",
        product_id: [productId], // Array format
        product_name: [productName],
        product_price: [productPrice]
    };

    if (typeof utag !== "undefined" && typeof utag.link === "function") {
        utag.link(utag_data);
        console.log("Tealium Product View Event Sent:", utag_data);
    } else {
        console.warn("Tealium utag.link is not available.");
    }
}

// ✅ Navigate to product details page & Push DataLayer + Tealium Event
function viewDetails(productId, productName, productPrice) {
    if (!productId || !productName || !productPrice) return;

    // Push to GA4 DataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: "view_item",
        ecommerce: {
            items: [{ id: productId, name: productName, price: productPrice }]
        }
    });

    console.log("GA4 View Details Event:", { productId, productName, productPrice });

    // Push to Tealium
    var utag_data = {
        tealium_event: "view_item",
        product_id: [productId],
        product_name: [productName],
        product_price: [productPrice]
    };

    if (typeof utag !== "undefined" && typeof utag.link === "function") {
        utag.link(utag_data);
        console.log("Tealium View Item Event Sent:", utag_data);
    } else {
        console.warn("Tealium utag.link is not available.");
    }

    window.location.href = `details.html?id=${productId}`;
}

// ✅ Handle Buy Now action & Push DataLayer + Tealium Event
function buyNow(productId, productName, productPrice) {
    if (!productId || !productName || !productPrice) return;

    const transactionId = crypto.randomUUID(); // ✅ Use secure UUID instead of `Math.random()`

    fetch("https://ecommerce-backend-h0w3.onrender.com/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, productId, productName })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Purchase request failed");
        }
        return response.json();
    })
    .then(data => {
        // Push to GA4 DataLayer
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "purchase",
            ecommerce: {
                transaction_id: data.transactionId,
                items: [{ id: productId, name: productName, price: productPrice }]
            }
        });

        console.log("GA4 Purchase Event:", { transactionId: data.transactionId, productId, productName, productPrice });

        // Push to Tealium
        var utag_data = {
            tealium_event: "purchase",
            transaction_id: data.transactionId,
            product_id: [productId],
            product_name: [productName],
            product_price: [productPrice]
        };

        if (typeof utag !== "undefined" && typeof utag.link === "function") {
            utag.link(utag_data);
            console.log("Tealium Purchase Event Sent:", utag_data);
        } else {
            console.warn("Tealium utag.link is not available.");
        }

        window.location.href = `transactions.html?transactionId=${data.transactionId}&productId=${productId}&productName=${encodeURIComponent(productName)}`;
    })
    .catch(error => console.error("Error processing purchase:", error));
}
