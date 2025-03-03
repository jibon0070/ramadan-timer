"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import getEventsAction from "./actions/get-events.action";
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
import Link from "next/link";
import { EditIcon, View } from "lucide-react";
import { Button } from "@/components/ui/button";

function useEngine() {
  const { toast } = useToast();
  const [pages, setPages] = useState<
    Awaited<ReturnType<typeof getEventsAction>>[]
  >([]);

  const queryKey = ["events"];

  const { hasNextPage, fetchNextPage, ...query } = useInfiniteQuery({
    queryKey,
    queryFn: (options) => {
      return getEventsAction(options.pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPage) => {
      if (allPage.length < ((lastPage.success && lastPage.totalPage) || 0)) {
        return allPage.length + 1;
      }

      return undefined;
    },
  });

  useEffect(() => {
    if (query.data) {
      const lastPage = query.data.pages.at(-1);
      if (lastPage?.success) {
        setPages(query.data.pages);
      } else {
        toast({
          title: "Error",
          description: lastPage?.message,
          variant: "destructive",
        });
      }
    }
  }, [query.data, toast]);

  const client = useQueryClient();

  function refetch() {
    client.invalidateQueries({ queryKey });
  }

  const [ref, loadingRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(() => {
      if (hasNextPage) {
        fetchNextPage();
      }
    });

    if (ref) {
      observer.observe(ref);
    }
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [hasNextPage, fetchNextPage, ref]);

  return {
    pages,
    isLoading: query.isLoading,
    refetch,
    hasNextPage,
    loadingRef,
  };
}

export default function Client({ role }: { role: Role | "visitor" }) {
  const { pages, isLoading, refetch, hasNextPage, loadingRef } = useEngine();

  return isLoading ? (
    <Loading />
  ) : !!pages.map((page) => (page.success && page.events) || []).at(-1)
      ?.length ? (
    <>
      <Table>
        <Header />
        <TableBody>
          {pages.map((page) => {
            if (!page.success) return null;
            return page.events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="whitespace-nowrap">
                  {event.timestamp.toLocaleDateString()}{" "}
                  {event.timestamp.toLocaleTimeString()}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {event.name}
                </TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      size={`icon`}
                      className="rounded-full"
                      variant={`secondary`}
                    >
                      <Link
                        href={`/events/view/${event.id}`}
                        title="View Event"
                      >
                        <View />
                      </Link>
                    </Button>
                    {role === "admin" && (
                      <>
                        <Button asChild size={"icon"} className="rounded-full">
                          <Link
                            href={`/events/edit/${event.id}`}
                            title="Edit Event"
                          >
                            <EditIcon />
                          </Link>
                        </Button>
                        <DeleteEvent id={event.id} refetch={refetch} />
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ));
          })}
        </TableBody>
      </Table>
      {hasNextPage && (
        <div className="flex justify-center" ref={loadingRef}>
          <div className="size-7 bg-gray-400 rounded-full p-1 animate-spin">
            <div className="size-2 bg-white rounded-full" />
          </div>
        </div>
      )}
    </>
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
