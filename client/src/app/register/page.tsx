"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  async function handleRegister(email: string, password: string) {
    await register(email, password);
    router.push("/tasks");
  }

  return (
    <AuthForm
      title="Create an account"
      submitLabel="Sign up"
      onSubmit={handleRegister}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900 underline">
            Log in
          </Link>
        </>
      }
    />
  );
}
