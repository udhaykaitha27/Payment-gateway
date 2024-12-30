import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentStatus = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Hardcoded details
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    orderId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const fetchOrderStatus = async (orderId, customerId) => {
    try {
      const response = await axios.post(
        "http://localhost/Payment-Backend/initiate-payment.php",
        { action: "getOrderStatus", order_id: orderId, customer_id: customerId }
      );
      setPaymentDetails({
        amount: response.data.amount,
        orderId: response.data.order_id,
        customerName: response.data.customer_id,
        customerEmail: response.data.customer_email,
        customerPhone: response.data.customer_phone,
      })
      console.log(response.data);
      const rawResponse = response.data.status;
      if (rawResponse === "CHARGED") {
        setStatus("success");
      } else if (
        rawResponse === "AUTHORIZATION_FAILED" ||
        rawResponse === "AUTHENTICATION_FAILED"
      ) {
        setStatus("failed");
      } else if (rawResponse === "PENDING_VBV" || rawResponse === "AUTHORIZING") {
        setStatus("pending");
      } else {
        setError("Unknown payment status received.");
      }
    } catch (err) {
      setError("Failed to fetch payment status. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const orderId = localStorage.getItem("order-id");
    const customerId = localStorage.getItem("customer-id");
    
    if (orderId && customerId) {
      fetchOrderStatus(orderId, customerId);
    } else {
      setError("Order ID or Customer ID not found.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "pending") {
      const timer = setTimeout(() => {
        const orderId = localStorage.getItem("order-id");
        const customerId = localStorage.getItem("customer-id");
        fetchOrderStatus(orderId, customerId);
      }, 10000); // Re-hit API every 10 seconds
      return () => clearTimeout(timer); // Cleanup on unmount or status change
    }
  }, [status]);

  const getMessage = () => {
    switch (status) {
      case "success":
        return (
          <div style={{ backgroundColor: "green", padding: "20px", color: "black" }}>
            <h2>Payment Successful!</h2>
            <p>Thank you for your payment.</p>
            <h2>Thise is the updated and latest payment you maid</h2>
            <ul>
              <li>
                <strong>Amount:</strong> {paymentDetails.amount}
              </li>
              <li>
                <strong>Order ID:</strong> {paymentDetails.orderId}
              </li>
              <li>
                <strong>Customer ID:</strong> {paymentDetails.customerName}
              </li>
              <li>
                <strong>Email:</strong> {paymentDetails.customerEmail}
              </li>
              <li>
                <strong>Phone:</strong> {paymentDetails.customerPhone}
              </li>
            </ul>
          </div>
        );
      case "pending":
        return (
          <div style={{ backgroundColor: "yellow", padding: "20px", color: "black" }}>
            <h2>Payment Pending...</h2>
            <p>Please wait while we check the status.</p>
          </div>
        );
      case "failed":
        return (
          <div style={{ backgroundColor: "red", padding: "20px", color: "white" }}>
            <h2>Payment Failed</h2>
            <p>We encountered an issue while processing your payment.</p>
            <p>Please try again or contact support.</p>
          </div>
        );
      default:
        return (
          <div>
            <p>Unknown Payment Status.</p>
          </div>
        );
    }
  };

  return (
    <div className={`payment-status ${status}`}>
      {loading ? (
        <h2 className="bg-red-700">Loading...</h2>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (<div>
        {getMessage()}
        </div> )}
    </div>
  );
};

export default PaymentStatus;
