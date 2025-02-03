import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Client from "./_components/client";

export const metadata: Metadata = {
  title: "New Event | Admin Panel",
};

export default function New() {
  return (
    <main className="p-5">
      <Card className="max-w-[600px] mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-3xl">New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <Client />
        </CardContent>
      </Card>
    </main>
  );
}
