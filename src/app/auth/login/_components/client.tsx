"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import schema from "./schemas/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useMutation from "@/hooks/use-mutation";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import submitAction from "./actions/submit.action";

export default function Client() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitMutation = useMutation({
    query: submitAction,
    onSuccess: (r) => {
      if (r.success) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        router.replace("/events");
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
    <form className="space-y-5" onSubmit={submit}>
      <Form {...form}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <div className="flex items-center justify-end gap-2">
        <Button variant={"secondary"} type="button" asChild>
          <Link href="/auth/register">Register</Link>
        </Button>
        <Button>Login</Button>
      </div>
    </form>
  );
}
