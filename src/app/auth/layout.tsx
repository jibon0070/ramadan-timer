import { Card } from "@/components/ui/card";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen p-5">
      <Card className="max-w-[600px] mx-auto">{children}</Card>
    </main>
  );
}
