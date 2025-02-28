import { Button } from "@/components/ui/button";
import useMutation from "@/hooks/use-mutation";
import { useToast } from "@/hooks/use-toast";
import { TrashIcon } from "lucide-react";
import deleteAction from "./actions/delete.action";

export default function DeleteEvent({
  id,
  refetch,
}: {
  id: number;
  refetch: () => void;
}) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    query: deleteAction,
    onSuccess: (r) => {
      if (r.success) {
        toast({
          title: "Success",
          description: "Event deleted successfully.",
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: r.message,
          variant: "destructive",
        });
      }
    },
  });

  function deleteEvent() {
    if (deleteMutation.isLoading) return;

    if (!window.confirm("Are you sure you want to delete this event?")) return;

    deleteMutation.mutate(id);
  }

  return (
    <Button
      size={"icon"}
      variant={"destructive"}
      className="rounded-full"
      onClick={deleteEvent}
      title="Delete Event"
    >
      <TrashIcon />
    </Button>
  );
}
