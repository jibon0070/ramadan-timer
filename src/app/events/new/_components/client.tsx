"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import schema from "../../_partials/schemas/new-and-edit.schema";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import submitAction from "./actions/submit.action";
import Fields from "../../_partials/new-and-edit";
import { useMutation } from "@tanstack/react-query";

export default function Client() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      //@ts-expect-error aaa
      timestamp: "",
      yearly: false,
    },
  });

  function back() {
    router.back();
  }

  const submitMutation = useMutation({
    mutationFn: submitAction,
    onSuccess: (r) => {
      if (r.success) {
        toast({
          title: "Success",
          description: "Event created successfully.",
        });
        back();
      } else {
        toast({
          title: "Error",
          description: r.message,
          variant: "destructive",
        });
      }
    },
  });

  const submit = form.handleSubmit((data) => {
    if (submitMutation.isPending) return;

    submitMutation.mutate(data);
  });

  return (
    <form onSubmit={submit} className="space-y-5">
      <Fields form={form} />
      <div className="flex justify-end items-center gap-2">
        <Button variant={"secondary"} type="button" onClick={back}>
          Back
        </Button>
        <Button>Save</Button>
      </div>
    </form>
  );
}
