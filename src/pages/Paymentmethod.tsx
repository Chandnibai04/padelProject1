import React, { useState } from "react";

export default function BookingForm() {
  const [step, setStep] = useState(2); // Start at step 2 to test payments
  const [formData, setFormData] = useState({
    name: "Test User",
    email: "test@example.com",
    phone: "03001234567",
    court: "Court A",
    date: "2025-07-30",
    paymentMethod: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📤 Submitting form:", formData);

    // Simulate different payment methods
    switch(formData.paymentMethod) {
      case "cash":
        alert("✅ Booking confirmed with cash payment!");
        break;
      case "card":
        alert("🔒 Redirecting to card payment gateway... (simulated)");
        // In a real app, this would redirect to a payment gateway
        break;
      case "jazzcash":
        alert("📱 Redirecting to JazzCash payment... (simulated)");
        // In a real app, this would redirect to JazzCash
        break;
      case "easypaisa":
        alert("📱 Redirecting to EasyPaisa payment... (simulated)");
        // In a real app, this would redirect to EasyPaisa
        break;
      default:
        alert("❌ Please select a payment method");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-md"
    >
      <h2 className="text-xl font-semibold">Select Payment Method</h2>

      <div className="grid gap-4">
        {["card", "jazzcash", "easypaisa", "cash"].map((method) => (
          <label key={method} className="flex items-center gap-3 border p-3 rounded-md cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={formData.paymentMethod === method}
              onChange={handleChange}
              className="accent-blue-600"
              required
            />
            <span className="capitalize">{method}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Confirm Booking
      </button>
    </form>
  );
}