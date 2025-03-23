document.addEventListener("DOMContentLoaded", () => {
    const transactionList = document.getElementById("transaction-list");

    let transactions = Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)));

    if (transactions.length === 0) {
        transactionList.innerHTML = "<p>No transactions found.</p>";
        return;
    }

    transactions.forEach(transaction => {
        const transactionDiv = document.createElement("div");
        transactionDiv.classList.add("product");
        transactionDiv.innerHTML = `
            <h2>Transaction ID: ${transaction.transactionId}</h2>
            <p>Product Name: ${transaction.productName}</p>
            <p>Product ID: ${transaction.productId}</p>
            <p>Price: $${transaction.productPrice}</p>
            <p>List Price: $${transaction.productListPrice}</p>
        `;
        transactionList.appendChild(transactionDiv);

        // ✅ Tealium Purchase Event with product_price & product_list_price
        window.utag_data = {
            tealium_event: "purchase",
            transaction_id: transaction.transactionId,
            product_id: transaction.productId,
            product_name: transaction.productName,
            product_price: transaction.productPrice,
            product_list_price: transaction.productListPrice
        };

        if (typeof utag !== "undefined" && typeof utag.link === "function") {
            utag.link(window.utag_data);
            console.log("✅ Tealium purchase event sent:", window.utag_data);
        } else {
            console.warn("⚠️ Tealium utag.link is not available.");
        }
    });
});
