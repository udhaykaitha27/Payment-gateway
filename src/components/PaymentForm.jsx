import React, { useState } from "react";
import axios from "axios";


const PaymentForm = () => {
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initiatePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost/Payment-Backend/initiate-payment.php",
        { action: "initiatePayment", amount }
      );
      console.log("------------>"+response.data);
      localStorage.setItem("order-id", response?.data?.order_id);
      localStorage.setItem("customer-id", response?.data?.sdk_payload?.payload?.customerId);

      const cleanedData = response?.data; // Remove any leading digits
      
      if (cleanedData?.payment_links?.web) {
        // Redirect to payment gateway
        window.location.href = cleanedData.payment_links.web;
      } else {
        setError("Invalid response from the server");
      }
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Make a Payment</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label>
        Amount (₹):
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="1"
          disabled={loading}
        />
      </label>
      <button onClick={initiatePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentForm;
