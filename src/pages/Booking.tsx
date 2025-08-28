import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addHours } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// Payment method logos
import VisaMastercardLogo from "@/assets/mastercard.png";
import JazzCashLogo from "@/assets/jazzcash.png";
import EasyPaisaLogo from "@/assets/easypaisa.png";

type FormStep = 1 | 2 | 3;

interface BookingData {
  name: string;
  email: string;
  phone: string;
  court: string;
  paymentMethod: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
}

const durationOptions = [
  { value: 1, label: "1 hour" },
  { value: 2, label: "2 hours" },
  { value: 3, label: "3 hours" },
  { value: 4, label: "4 hours" },
];

export default function BookingForm() {
  const [step, setStep] = useState<FormStep>(1);
  const [date, setDate] = useState<Date | undefined>();
  const [duration, setDuration] = useState<number>(1);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BookingData>({
    name: "",
    email: "",
    phone: "",
    court: "",
    paymentMethod: "",
  });

  // ✅ Check for both user data and a token on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userData && token) {
      try {
        const user: UserData = JSON.parse(userData);
        setIsLoggedIn(true);
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        }));
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
  }, []);

  // ✅ Generate timeslots
  useEffect(() => {
    if (date) {
      const times: string[] = [];
      for (let hour = 8; hour <= 22; hour++) {
        times.push(`${hour.toString().padStart(2, "0")}:00`);
      }
      setAvailableTimes(times);
      setSelectedTime("");
    }
  }, [date]);

  // ✅ Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") setEmailError("");
  };

  // ✅ Check user exists before continuing (if not logged in)
  const checkUserExists = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bookings/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, phone: formData.phone }),
      });

      const data = await response.json();
      if (!response.ok) {
        setEmailError(data.message || "User not found. Please signup first.");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Check user failed:", err);
      setEmailError("Server error. Please try again later.");
      return false;
    }
  };

  // ✅ Step 1 → Step 2
  // ✅ Step 1 → Step 2
const handleNext = async () => {
  // Check all required fields
  if (!formData.name || !formData.email || !formData.phone || !formData.court || !date || !selectedTime) {
    alert("Please fill all booking details");
    return;
  }

  // If user is not logged in, prevent proceeding and redirect to login
  if (!isLoggedIn) {
    alert("Please login first to continue to payment.");
    navigate("/login"); // Redirect to login page
    return;
  }

  // Proceed to next step
  setStep(2);
};

  // ✅ Save booking to DB
  const saveBookingToDB = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          courtName: formData.court,
          date: date ? date.toISOString().split("T")[0] : "",
          time: selectedTime,
          duration, // send as number
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Booking failed");

      setBookingId(data.booking._id || `BK${Math.floor(Math.random() * 1000000)}`);
      setBookingDate(data.booking.date || new Date().toLocaleDateString());
      return true;
    } catch (err: any) {
      alert(err.message || "Error saving booking");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle payment submit
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const saved = await saveBookingToDB();
    if (!saved) return;

    setStep(3);
  };

  // ✅ Print receipt
  const handlePrint = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = `<div style="max-width:800px; margin:0 auto; padding:20px;">${printContents}</div>`;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  // ✅ Reset form for new booking
  const handleNewBooking = () => {
    setFormData((prev) => ({ ...prev, court: "", paymentMethod: "" }));
    setDate(undefined);
    setSelectedTime("");
    setDuration(1);
    setStep(1);
    setEmailError("");
    setBookingId(null);
    setBookingDate("");
  };

  // ✅ Calculate end time
  const calculateEndTime = () => {
    if (!selectedTime) return "";
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startDate = date ? new Date(date) : new Date();
    startDate.setHours(hours, minutes);
    const endDate = addHours(startDate, duration);
    return format(endDate, "HH:mm");
  };

  // ✅ STEP 3 → RECEIPT
 if (step === 3) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white px-6 py-10 -mt-10">
        <div ref={receiptRef} className="max-w-2xl mx-auto bg-white text-black p-8 rounded-xl shadow-lg space-y-6 print:p-2 print:shadow-none print:max-w-none print:rounded-none">
          <div className="text-center border-b pb-4 print:border-b-2 print:border-gray-300">
            <h1 className="text-3xl font-bold text-[#0F172A] print:text-2xl">Booking Confirmed!</h1>
            <div className="flex justify-center mt-4">
              <div className="w-16 h-16 bg-[#f0fdf4] rounded-full flex items-center justify-center print:w-12 print:h-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#16a34a] print:h-8 print:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 print:text-xs">Booking ID: {bookingId || `BK${Math.floor(Math.random() * 1000000)}`}</p>
            <p className="text-sm text-gray-600 print:text-xs">Date: {bookingDate || new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-[#0F172A] border-b pb-1 print:text-base print:border-b print:border-gray-300">
                Customer Info
              </h3>
              <div className="flex justify-between">
                <span className="text-gray-600 print:text-sm">Name:</span>
                <span className="font-medium print:text-sm">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 print:text-sm">Email:</span>
                <span className="font-medium print:text-sm">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 print:text-sm">Phone:</span>
                <span className="font-medium print:text-sm">{formData.phone}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-[#0F172A] border-b pb-1 print:text-base print:border-b print:border-gray-300">
                Booking Details
              </h3>
              <div className="flex justify-between">
                <span className="text-gray-600 print:text-sm">Court:</span>
                <span className="font-medium print:text-sm">{formData.court}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 print:text-sm">Date:</span>
                <span className="font-medium print:text-sm">{date ? format(date, "PPP") : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 print:text-sm">Time:</span>
                <span className="font-medium print:text-sm">
                  {selectedTime || "-"} to {calculateEndTime()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 print:text-sm">Duration:</span>
                <span className="font-medium print:text-sm">{duration} hour{duration > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 print:text-sm">
            <h3 className="font-semibold text-lg text-[#0F172A] border-b pb-1 print:text-base print:border-b print:border-gray-300">
              Payment Summary
            </h3>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium capitalize">{formData.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Court Fee:</span>
              <span className="font-medium">Rs. {1000 * duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (20%):</span>
              <span className="font-medium">Rs. {200 * duration}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2 print:border-t print:border-gray-300">
              <span className="text-gray-600 font-semibold">Total Amount:</span>
              <span className="font-bold text-lg print:text-base">Rs. {1200 * duration}</span>
            </div>
          </div>

          <div className="p-4 bg-[#f0fdf4] rounded-lg print:p-3 print:rounded print:bg-[#f0fdf4]">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#16a34a] print:h-5 print:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-semibold text-[#166534] print:text-sm">Payment Successful</h4>
                <p className="text-sm text-[#166534] print:text-xs">Your payment has been processed successfully</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 print:hidden">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 rounded-md bg-[#84cc16] text-black hover:bg-[#65a30d] transition-all flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </button>
            <button
              onClick={handleNewBooking}
              className="px-6 py-2 rounded-md bg-transparent border border-[#84cc16] text-[#84cc16] hover:bg-[#84cc16] hover:text-black transition-all flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Book Again
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2 rounded-md bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-all flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0F172A] text-white px-4 py-10 -mt-10">
      <form 
        onSubmit={step === 2 ? handlePaymentSubmit : undefined}
        className="max-w-xl mx-auto space-y-6 bg-[#1e293b] p-6 rounded-xl shadow-xl mt-10"
      >
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl text-center font-semibold text-[#84cc16]">Booking Details</h2>
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#1e293b] text-white border border-[#84cc16]"
              required
              disabled={isLoggedIn}
            />
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-[#1e293b] text-white border border-[#84cc16]"
                required
                disabled={isLoggedIn}
              />
              {emailError && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {emailError}
                  <button 
                    type="button"
                    className="ml-2 text-blue-400 hover:underline"
                    onClick={() => navigate("/signup")}
                  >
                    Sign up now
                  </button>
                </div>
              )}
            </div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#1e293b] text-white border border-[#84cc16]"
              required
              disabled={isLoggedIn}
            />
            <select
              name="court"
              value={formData.court}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-[#1e293b] text-white border border-[#84cc16]"
              required
            >
              <option value="">Select Court</option>
              <option value="Court A">Court A</option>
              <option value="Court B">Court B</option>
            </select>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-[#84cc16] bg-[#1e293b]"
                >
                  <CalendarIcon className="h-5 w-5 text-[#84cc16]" />
                  <span>
                    {date && selectedTime 
                      ? `${format(date, "PPP")} at ${selectedTime} for ${duration} hour${duration > 1 ? 's' : ''}` 
                      : "Select Schedule"}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-[#0f172a] p-4 rounded-xl border border-[#84cc16] space-y-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="bg-[#0f172a] text-white"
                />
                
                {date && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Select Time Slot</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 rounded-md text-sm ${
                              selectedTime === time
                                ? "bg-[#84cc16] text-black"
                                : "bg-[#1e293b] text-white"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Select Duration</label>
                      <div className="grid grid-cols-4 gap-2">
                        {durationOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setDuration(option.value)}
                            className={`py-2 rounded-md text-sm ${
                              duration === option.value
                                ? "bg-[#84cc16] text-black"
                                : "bg-[#1e293b] text-white"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </PopoverContent>
            </Popover>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-2 rounded-md bg-transparent border border-[#84cc16] text-[#84cc16] hover:bg-[#84cc16] hover:text-black transition-all flex items-center justify-center"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl text-center font-semibold text-[#84cc16]">Payment Method</h2>

            <div className="space-y-3">
              {[
                { id: "card", label: "Credit / Debit Card", logo: VisaMastercardLogo },
                { id: "jazzcash", label: "JazzCash", logo: JazzCashLogo },
                { id: "easypaisa", label: "EasyPaisa", logo: EasyPaisaLogo },
                { id: "cash", label: "Pay at Venue", logo: null },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 border p-2 rounded-md cursor-pointer ${
                    formData.paymentMethod === method.id
                      ? "border-[#84cc16] bg-white text-black"
                      : "border-gray-400 bg-[#1e293b]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={handleChange}
                    className="hidden"
                    required
                  />
                  {method.logo ? (
                    <img
                      src={method.logo}
                      alt={method.label}
                      className="w-16"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <span className="text-white">💵</span>
                  )}
                  <span className="text-base">{method.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 rounded-md bg-[#84cc16] text-black hover:bg-[#65a30d] transition-all flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}