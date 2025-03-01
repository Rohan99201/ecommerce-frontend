document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        document.getElementById("product-details").innerHTML = "<p>Product not found!</p>";
        return;
    }

    fetch(`http://localhost:5000/product/${productId}`)
        .then(response => response.json())
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
                <button onclick="addToCart('${product.id}', '${product.name}')">Add to Cart</button>
            `;
        })
        .catch(error => console.error("Error fetching product details:", error));
});

// ✅ Add product to cart (temporary alert, can be expanded)
function addToCart(productId, productName) {
    alert(`${productName} added to cart!`);
}
