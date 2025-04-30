document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        document.getElementById("product-details").innerHTML = "<p>Product not found!</p>";
        return;
    }

    fetch(`https://ecommerce-backend-h0w3.onrender.com/product/${productId}`)
        .then(response => {
            if (!response.ok) throw new Error("Product not found!");
            return response.json();
        })
        .then(product => {
            if (!product) {
                document.getElementById("product-details").innerHTML = "<p>Product not found!</p>";
                return;
            }

            // Product images map
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

            const imagePath = productImages[product.name.toLowerCase()] || "images/default.jpg";
            const productPrice = parseFloat(product.price) || 0;
            const productListPrice = parseFloat(product.list_price) || productPrice;

            document.getElementById("product-details").innerHTML = `
                <img src="${imagePath}" alt="${product.name}" width="300">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p><strong>Price: $${productPrice.toFixed(2)}</strong></p>
                <p><strong>List Price: $${productListPrice.toFixed(2)}</strong></p>
                <button onclick="addToCart('${product.id}', '${product.name}', ${productPrice}, ${productListPrice})">Add to Cart</button>
            `;

            // Tealium Product View Event
            const viewData = {
                tealium_event: "product_view",
                product_id: product.id,
                product_name: product.name,
                product_price: productPrice,
                product_list_price: productListPrice
            };

            window.utag_data = viewData;
            console.log("✅ Product View Event Data:", viewData);

            if (typeof utag !== "undefined" && typeof utag.link === "function") {
                utag.link(viewData);
                console.log("✅ Product View Event sent to Tealium");
            } else {
                console.warn("⚠️ Tealium utag.link is not available.");
            }
        })
        .catch(error => {
            console.error("❌ Error fetching product details:", error);
            document.getElementById("product-details").innerHTML = "<p>Product not found!</p>";
        });
});

function addToCart(productId, productName, productPrice, productListPrice) {
    alert(`${productName} added to cart!`);

    const transactionId = "T" + Date.now();
    const transactionKey = "txn_" + transactionId;

    const transaction = {
        transactionId,
        productId,
        productName,
        productPrice,
        productListPrice
    };

    localStorage.setItem(transactionKey, JSON.stringify(transaction));
    console.log("✅ Stored Transaction:", transaction);

    const purchaseData = {
        tealium_event: "purchase",
        transaction_id: transactionId,
        product_id: productId,
        product_name: productName,
        product_price: productPrice,
        product_list_price: productListPrice
    };

    if (typeof utag !== "undefined" && typeof utag.link === "function") {
        utag.link(purchaseData);
        console.log("✅ Purchase Event sent to Tealium");
    } else {
        console.warn("⚠️ Tealium utag.link is not available.");
    }
}
