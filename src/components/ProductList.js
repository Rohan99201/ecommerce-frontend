import React, { useEffect, useState } from "react";
import { trackViewItem, trackPurchase } from "../utils/tealium"; // ✅ Import Tealium functions

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://ecommerce-backend-h0w3.onrender.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        data.forEach(product => trackViewItem(product)); // ✅ Track view event for each product
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handlePurchase = async (product) => {
    const transactionId = Math.random().toString(36).substring(7);
    await fetch("https://ecommerce-backend-h0w3.onrender.com/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, productId: product.id, productName: product.name }),
    });

    trackPurchase(transactionId, product); // ✅ Track purchase event
    alert(`Purchase successful! Transaction ID: ${transactionId}`);
  };

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button onClick={() => handlePurchase(product)}>Buy Now</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
