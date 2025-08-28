// PaymentConfirm.tsx
import React from "react";

export default function PaymentConfirm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
      <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-400">Payment Successful!</h1>
        <p className="mt-4 text-gray-300">
          Thank you for your payment. Your booking is now confirmed.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
