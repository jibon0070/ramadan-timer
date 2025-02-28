import db from "@/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Client from "./_components/client";

export const metadata: Metadata = {
  title: "Event View",
};

export default async function View(props: { params: Promise<{ id: string }> }) {
  const id = await props.params.then((r) => Number(r.id));

  const event = await db.query.EventModel.findFirst({
    where: (model, { eq }) => eq(model.id, id),
    columns: { name: true, description: true, timestamp: true },
  });

  if (!event) notFound();

  return (
    <Client
      description={event.description}
      name={event.name}
      time={event.timestamp}
    />
  );
}
