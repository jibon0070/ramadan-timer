"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import schema from "./schemas/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useMutation from "@/hooks/use-mutation";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import submitAction from "./actions/submit.action";

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
    },
  });

  function back() {
    router.back();
  }

  const submitMutation = useMutation({
    query: submitAction,
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
    if (submitMutation.isLoading) return;

    submitMutation.mutate(data);
  });

  return (
    <form onSubmit={submit} className="space-y-5">
      <Form {...form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timestamp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timestamp</FormLabel>
              <FormControl>
                {/*@ts-expect-error aaa*/}
                <Input {...field} type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <div className="flex justify-end items-center gap-2">
        <Button variant={"secondary"} type="button" onClick={back}>
          Back
        </Button>
        <Button>Save</Button>
      </div>
    </form>
  );
}
