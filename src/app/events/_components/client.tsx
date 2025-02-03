"use client";

import useQuery from "@/hooks/use-query";
import getEventsAction, { Event } from "./actions/get-events.action";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteEvent from "./components/delete/client";
import Role from "@/types/role";
import { cn } from "@/lib/utils";

function useEngine() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);

  const query = useQuery({
    key: [],
    query: getEventsAction,
  });

  useEffect(() => {
    if (query.data) {
      if (query.data.success) {
        setEvents(query.data.events);
      } else {
        toast({
          title: "Error",
          description: query.data.message,
          variant: "destructive",
        });
      }
    }
  }, [query.data, toast]);

  return { events, isLoading: query.isLoading, refetch: query.refetch };
}

export default function Client({ role }: { role: Role | "visitor" }) {
  const { events, isLoading, refetch } = useEngine();

  return isLoading ? (
    <Loading />
  ) : !!events.length ? (
    <Table>
      <Header />
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="whitespace-nowrap">
              {event.timestamp.toLocaleDateString()}{" "}
              {event.timestamp.toLocaleTimeString()}
            </TableCell>
            <TableCell className="whitespace-nowrap">{event.name}</TableCell>
            <TableCell>{event.description}</TableCell>
            <TableCell>
              {role === "admin" && (
                <DeleteEvent id={event.id} refetch={refetch} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <p className={cn({ "text-center": role === "visitor" })}>
      No Events Found.
    </p>
  );
}

function Loading() {
  return (
    <Table>
      <Header />
      <TableBody>
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <TableRow key={i}>
              {Array(4)
                .fill(0)
                .map((_, j) => (
                  <TableCell key={`${i}${j}`}>
                    <Skeleton className="h-7 min-w-7" />
                  </TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

function Header() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-0">Date</TableHead>
        <TableHead className="w-0">Name</TableHead>
        <TableHead>Description</TableHead>
        <TableHead className="w-0" />
      </TableRow>
    </TableHeader>
  );
}
