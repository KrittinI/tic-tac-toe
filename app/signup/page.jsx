"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password ไม่ตรงกัน");
      return;
    }

    if (password.length < 8) {
      setError("Password ต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "สมัครสมาชิกไม่สำเร็จ");
        return;
      }

      // Login อัตโนมัติหลังสมัครสำเร็จ
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        router.push("/");
        return;
      }

      router.push("/playground");
      router.refresh();
    } catch (error) {
      console.error("Signup Error:", error);
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-md bg-white p-6 shadow-md"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Create Account
        </h1>

        <div className="mb-4">
          <label htmlFor="name" className="mb-1 block text-sm text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Your name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="mb-1 block text-sm text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="example@mail.com"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-1 block text-sm text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="At least 8 characters"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Confirm your password"
          />
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mb-4 w-full rounded bg-blue-500 py-2 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <hr className="mb-4 border-gray-300" />

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/"
            className="text-blue-500 hover:underline keychainify-checked"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
