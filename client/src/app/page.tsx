"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(token ? "/tasks" : "/login");
  }, [isLoading, token, router]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-zinc-500">Loading...</p>
    </div>
  );
}
