"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import schema from "./schemas/schema";
import useMutation from "@/hooks/use-mutation";
import { useRouter } from "next/navigation";
import saveAction from "./actions/save.action";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Client() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const saveMutation = useMutation({
    query: saveAction,
    onSuccess: (r) => {
      if (r.success) {
        toast({
          title: "Success",
          description: "Successfully registered.",
        });
        router.replace("/auth/login");
      } else {
        toast({
          title: "Error",
          description: r.message,
          variant: "destructive",
        });
      }
    },
  });

  const save = form.handleSubmit((data) => {
    if (saveMutation.isLoading) {
      return;
    }

    saveMutation.mutate(data);
  });

  return (
    <form className="space-y-5" onSubmit={save}>
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
      <div className="flex justify-end gap-2 item-center">
        <Button type="button" asChild variant={"secondary"}>
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button>Register</Button>
      </div>
    </form>
  );
}
