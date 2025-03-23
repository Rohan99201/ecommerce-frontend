export const trackViewItem = (product) => {
    window.utag_data = {
        event_name: "view_item",
        product_name: product.name,
        product_id: product.id,
        product_price: product.price,
        currency: "USD"
    };
    if (window.utag && window.utag.view) {
        window.utag.view(window.utag_data);
        console.log("Tealium View Item Event Sent:", window.utag_data);
    }
};

export const trackPurchase = (transactionId, product) => {
    window.utag_data = {
        event_name: "purchase",
        transaction_id: transactionId,
        product_name: product.name,
        product_id: product.id,
        product_price: product.price,
        currency: "USD"
    };
    if (window.utag && window.utag.link) {
        window.utag.link(window.utag_data);
        console.log("Tealium Purchase Event Sent:", window.utag_data);
    }
};
