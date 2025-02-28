import { Metadata } from "next";
import Client from "./_components/client";
import getAuth from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import db from "@/db";

export const metadata: Metadata = {
  title: "Edit Event | Admin Panel",
};

export default async function Edit(props: { params: Promise<{ id: string }> }) {
  const auth = getAuth();

  if (!(await auth.verify("admin"))) return redirect("/");

  const { id } = await props.params.then((r) => ({ id: Number(r.id) }));

  const event = await db.query.EventModel.findFirst({
    where: (model, { eq }) => eq(model.id, id),
    columns: { name: true, description: true, timestamp: true },
  });

  if (!event) return notFound();

  return (
    <Client
      id={id}
      name={event.name}
      description={event.description}
      timestamp={event.timestamp}
    />
  );
}
