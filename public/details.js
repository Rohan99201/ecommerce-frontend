document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        document.getElementById("product-details").innerHTML = "<p>Product not found!</p>";
        return;
    }

    fetch(`https://ecommerce-backend-h0w3.onrender.com/products/${productId}`)
        .then(response => {
            if (!response.ok) throw new Error("Product not found!");
            return response.json();
        })
        .then(product => {
            if (!product) {
                document.getElementById("product-details").innerHTML = "<p>Product not found!</p>";
                return;
            }

            // ✅ Set correct image paths based on product names
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

            document.getElementById("product-details").innerHTML = `
                <img src="${imagePath}" alt="${product.name}" width="300">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p><strong>$${product.price}</strong></p>
                <button onclick="addToCart('${product.id}', '${product.name}', '${product.price}')">Add to Cart</button>
            `;

            // ✅ Set Tealium DataLayer for Product View
            window.utag_data = {
                tealium_event: "product_view",
                product_id: product.id,
                product_name: product.name,
                product_price: product.price
            };

            console.log("✅ Product View Event Data:", window.utag_data);

            // ✅ Fire Product View event if utag is available
            if (typeof utag !== "undefined" && typeof utag.link === "function") {
                utag.link(window.utag_data);
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

// ✅ Add product to cart and fire Tealium Purchase Event
function addToCart(productId, productName, productPrice) {
    alert(`${productName} added to cart!`);

    // ✅ Fire Tealium Purchase Event
    const purchaseData = {
        tealium_event: "purchase",
        order_id: "ORDER" + Math.floor(Math.random() * 1000000), // Mock order ID
        product_id: productId,
        product_name: productName,
        product_price: productPrice
    };

    console.log("✅ Purchase Event Data:", purchaseData);

    if (typeof utag !== "undefined" && typeof utag.link === "function") {
        utag.link(purchaseData);
        console.log("✅ Purchase Event sent to Tealium");
    } else {
        console.warn("⚠️ Tealium utag.link is not available.");
    }
}
