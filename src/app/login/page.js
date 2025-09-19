"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    else router.push("/profile");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/70 backdrop-blur rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white p-6 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-white/90 text-sm">Sign in to continue to PM InternMatch</p>
          </div>
          <form onSubmit={handleLogin} className="p-6 flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-2 rounded">
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
              placeholder="••••••••"
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <div className="text-center text-sm text-gray-600 mt-2">
              Don't have an account?{" "}
              <button type="button" onClick={() => router.push("/signup")} className="text-indigo-600 font-semibold hover:underline">Create one</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}