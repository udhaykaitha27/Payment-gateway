import React from "react";
import PaymentForm from "./PaymentForm";
import "../styles/dashboard.css"; // Import the styles

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the Payment Gateway Integration Dashboard</p>
      </header>
      <main>
        <PaymentForm />
      </main>
      <footer className="dashboard-footer">
        <p>
          © {new Date().getFullYear()} Multiplier AI Limited. All Rights Reserved. 
          <a href="https://multiplierai.co"> Visit Us</a>
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
