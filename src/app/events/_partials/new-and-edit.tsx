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
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import schema from "./schemas/new-and-edit.schema";

export default function Fields({
  form,
}: {
  form: UseFormReturn<z.infer<typeof schema>>;
}) {
  return (
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
      <FormField
        control={form.control}
        name="yearly"
        render={({ field }) => (
          <FormItem>
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                onChange={(e) => form.setValue(field.name, e.target.checked)}
                checked={form.watch(field.name)}
              />
              Yearly
            </label>
          </FormItem>
        )}
      />
    </Form>
  );
}
