"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) setError(signUpError.message);
    else router.push("/login");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white p-6 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-white/90 text-sm">Join PM InternMatch to get personalized matches</p>
          </div>
          <form onSubmit={handleSignup} className="p-6 flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-2 rounded text-center">
                {error}
              </div>
            )}
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-400"
              required
            />
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg shadow ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <div className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <button type="button" onClick={() => router.push("/login")} className="text-indigo-600 font-semibold hover:underline">Sign in</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}