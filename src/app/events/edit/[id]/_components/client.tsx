"use client";

import { useForm } from "react-hook-form";
import Fields from "../../../_partials/new-and-edit";
import { z } from "zod";
import schema from "../../../_partials/schemas/new-and-edit.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import saveAction from "./actions/save.action";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function formatDate(date: Date): string {
  return `${date.getFullYear().toString().padStart(4, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, `0`)}`;
}

function useEngine({ id, name, description, timestamp, yearly }: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      // @ts-expect-error aaa
      timestamp: "",
      yearly: false,
    },
  });
  const router = useRouter();
  const { toast } = useToast();
  const client = useQueryClient();

  useEffect(() => {
    form.reset({
      name,
      description: description || "",
      //@ts-expect-error aaa
      timestamp: formatDate(timestamp),
      yearly,
    });
  }, [description, form, name, timestamp, yearly]);

  function back() {
    router.back();
  }

  const submitMutation = useMutation({
    mutationFn: saveAction,
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "Success", description: "Event updated successfully" });
        client.invalidateQueries({ queryKey: ["events"] });
        back();
      } else
        toast({
          title: "Error",
          description: r.message,
          variant: "destructive",
        });
    },
  });

  const submit = form.handleSubmit((data) => {
    if (submitMutation.isPending) {
      return;
    }

    submitMutation.mutate({ id, data });
  });

  return { form, back, submit };
}

type Props = {
  id: number;
  name: string;
  description: string | null;
  timestamp: Date;
  yearly: boolean;
};

export default function Client(props: Props) {
  const { form, back, submit } = useEngine(props);

  return (
    <div className="p-5">
      <Card className="max-w-[600px] mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={submit}>
            <Fields form={form} />
            <div className="flex justify-end gap-2 text-center">
              <Button onClick={back} type="button" variant={"secondary"}>
                Back
              </Button>
              <Button>Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
