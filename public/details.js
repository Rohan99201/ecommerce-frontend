document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        document.getElementById("product-details").innerHTML = "<p>❌ Product not found!</p>";
        console.error("❌ No product ID found in URL.");
        return;
    }

    fetch(`https://ecommerce-backend-h0w3.onrender.com/product/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("❌ Network response was not ok.");
            }
            return response.json();
        })
        .then(product => {
            if (!product) {
                document.getElementById("product-details").innerHTML = "<p>❌ Product not found!</p>";
                console.warn("⚠️ Product data is empty.");
                return;
            }

            // ✅ Correct image paths
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

            // ✅ Render product details
            document.getElementById("product-details").innerHTML = `
                <img src="${imagePath}" alt="${product.name}" width="300">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p><strong>$${product.price}</strong></p>
                <button onclick="addToCart('${product.id}', '${product.name}')">Add to Cart</button>
            `;

            // ✅ Set Tealium `utag_data`
            window.utag_data = {
                tealium_event: "product_view",
                product_id: product.id,
                product_name: product.name,
                product_price: product.price
            };

            console.log("✅ Tealium utag_data:", window.utag_data);

            // ✅ Fire Tealium event if utag.js is available
            if (typeof utag !== "undefined" && typeof utag.view === "function") {
                utag.view(window.utag_data);
                console.log("✅ Tealium event fired:", window.utag_data);
            } else {
                console.warn("⚠️ Tealium utag.view is not available.");
            }

            // ✅ Push to Google Tag Manager
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: "product_view",
                ecommerce: {
                    detail: {
                        products: [{
                            id: product.id,
                            name: product.name,
                            price: product.price
                        }]
                    }
                }
            });

            console.log("✅ Data pushed to GTM:", window.dataLayer);
        })
        .catch(error => {
            console.error("❌ Error fetching product details:", error);
            document.getElementById("product-details").innerHTML = "<p>⚠️ Error loading product details.</p>";
        });
});

// ✅ Add product to cart (temporary alert, can be expanded)
function addToCart(productId, productName) {
    alert(`${productName} added to cart!`);
    console.log(`🛒 ${productName} added to cart.`);

    // ✅ Push cart event to Google Tag Manager
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
            add: {
                products: [{
                    id: productId,
                    name: productName
                }]
            }
        }
    });

    console.log("✅ Cart event sent to GTM:", window.dataLayer);
}
