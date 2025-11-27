// ====================== app/login/page.jsx ======================
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    if (!email.includes("@")) {
      setError("Email invalid");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password too short");
      setLoading(false);
      return;
    }

    try {
      // call server to set cookie
      await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // localStorage for UI
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          rememberMe,
          loginTime: new Date().toISOString(),
        })
      );

      setSuccess(true);

      setTimeout(() => router.push("/"), 500);
    } catch (err) {
      setError("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#111] rounded-xl p-8 border border-white/10">
        
        {success && (
          <p className="text-green-400 mb-6">
            ✓ Login Successful! Redirecting...
          </p>
        )}

        {error && !success && (
          <p className="text-red-400 mb-6">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* email */}
          <div>
            <label className="text-white text-sm">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                className="w-full bg-[#222] text-white rounded-lg px-10 py-3"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* password */}
          <div>
            <label className="text-white text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-[#222] text-white rounded-lg px-10 py-3"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* remember me */}
          <label className="flex items-center gap-2 text-gray-300 text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            disabled={loading || success}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-red-500 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
