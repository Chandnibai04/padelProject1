import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ emailOrPhone: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
          toast.success("🎉 Login successful!");
          // Save token to localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(data.error || "Login failed ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a] px-4 overflow-hidden relative text-white -mt-10">
      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-2xl w-full max-w-md shadow-2xl space-y-6 border border-white/10 relative z-10">
        <h2 className="text-3xl font-bold text-center text-[#adef0e]">Login</h2>

        <Input placeholder="Email or Phone" value={form.emailOrPhone} onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })} className="bg-[#1e293b]/60 text-white border border-[#adef0e]" required />
        <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="bg-[#1e293b]/60 text-white border border-[#adef0e]" required />

        <Button type="submit" className="w-full border border-[#adef0e] text-[#adef0e] hover:bg-[#adef0e] hover:text-[#020617] font-medium transition-colors" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="text-center text-sm text-blue-200">
          Don't have an account?{" "}
          <a href="/signup" className="underline hover:text-[#adef0e]" onClick={(e) => { e.preventDefault(); navigate("/signup"); }}>
            Sign Up
          </a>
        </div>
      </form>
    </div>
  );
}
