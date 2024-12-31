import React from "react";
import { Inertia } from "@inertiajs/inertia";

const Checkout = () => {
    const handlePayment = () => {
        const options = {
            key: process.env.MIX_RAZORPAY_KEY, // Razorpay Key
            amount: 5000, // Amount in currency subunits (e.g., 5000 = ₹50)
            currency: "INR",
            name: "Acme Corp",
            description: "Test Transaction",
            image: "https://cdn.razorpay.com/logos/GhRQcyean79PqE_medium.png",
            order_id: "order_IluGWxBm9U8zJ8", // Replace with actual order ID from backend
            handler: function (response) {
                // Send payment details to backend
                Inertia.post("/payment-success", response);
            },
            prefill: {
                name: "John Doe",
                email: "john.doe@example.com",
                contact: "9000090000",
            },
            notes: {
                address: "Corporate Office",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <h1>Checkout</h1>
            <button
                onClick={handlePayment}
                style={{
                    backgroundColor: "#3399cc",
                    color: "#fff",
                    padding: "15px 30px",
                    fontSize: "16px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Pay with Razorpay
            </button>
        </div>
    );
};

export default Checkout;
