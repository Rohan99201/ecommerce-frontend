document.addEventListener("DOMContentLoaded", () => {
    const transactionList = document.getElementById("transaction-list");

    // ✅ Filter only transaction keys
    const transactionKeys = Object.keys(localStorage).filter(key => key.startsWith("txn_"));

    if (transactionKeys.length === 0) {
        transactionList.innerHTML = "<p>No transactions found.</p>";
        return;
    }

    transactionKeys.forEach(key => {
        try {
            const transaction = JSON.parse(localStorage.getItem(key));
            if (!transaction) return;

            const transactionDiv = document.createElement("div");
            transactionDiv.classList.add("product");
            transactionDiv.innerHTML = `
                <h2>Transaction ID: ${transaction.transactionId}</h2>
                <p>Product Name: ${transaction.productName}</p>
                <p>Product ID: ${transaction.productId}</p>
                <p>Price: $${parseFloat(transaction.productPrice).toFixed(2)}</p>
                <p>List Price: $${parseFloat(transaction.productListPrice).toFixed(2)}</p>
            `;
            transactionList.appendChild(transactionDiv);

            // ✅ Fire Tealium Purchase Event
            const purchaseData = {
                tealium_event: "purchase",
                transaction_id: transaction.transactionId,
                product_id: transaction.productId,
                product_name: transaction.productName,
                product_price: transaction.productPrice,
                product_list_price: transaction.productListPrice
            };

            if (typeof utag !== "undefined" && typeof utag.link === "function") {
                utag.link(purchaseData);
                console.log("✅ Tealium purchase event sent:", purchaseData);
            } else {
                console.warn("⚠️ Tealium utag.link is not available.");
            }
        } catch (err) {
            console.error("❌ Failed to parse transaction:", key, err);
        }
    });
});
