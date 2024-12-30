import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import PaymentStatus from "./components/PaymentStatus";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
