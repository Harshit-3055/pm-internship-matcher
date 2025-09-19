// src/app/page.js
"use client";

import HomePage from "@/components/HomePage";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleSignIn = () => router.push("/login");
  const handleSignUp = () => router.push("/signup");

  return <HomePage onSignIn={handleSignIn} onSignUp={handleSignUp} />;
}