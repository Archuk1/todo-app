"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin(email: string, password: string) {
    await login(email, password);
    router.push("/tasks");
  }

  return (
    <AuthForm
      title="Log in"
      submitLabel="Log in"
      onSubmit={handleLogin}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-zinc-900 underline">
            Sign up
          </Link>
        </>
      }
    />
  );
}
