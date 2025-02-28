import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import Client from "./_components/client";
import getAuth from "@/lib/auth";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Events | Admin Panel",
};

export default async function Events() {
  const auth = getAuth();

  const role = (await auth.getNullablePayload())?.role || "visitor";

  return (
    <main className="p-5 container mx-auto space-y-5">
      <div
        className={cn("flex items-center", {
          "justify-center": role === "visitor",
          "justify-between": role !== "visitor",
        })}
      >
        <Link href={`/`}>
          <h1 className="text-3xl">Events</h1>
        </Link>
        {role === "admin" && (
          <Button asChild>
            <Link href="/events/new">New</Link>
          </Button>
        )}
      </div>
      <Client role={role} />
    </main>
  );
}
