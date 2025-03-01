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
        `;
        transactionList.appendChild(transactionDiv);
    });
});
