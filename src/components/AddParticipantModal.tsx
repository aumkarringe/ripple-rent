import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExpenses } from "@/contexts/ExpenseContext";
import { toast } from "sonner";

interface AddParticipantModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddParticipantModal = ({ open, onClose }: AddParticipantModalProps) => {
  const { addParticipant } = useExpenses();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    addParticipant({ name: name.trim(), color: "" });
    toast.success(`${name} added successfully!`);
    handleClose();
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] glass-card border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Participant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gradient-primary text-white rounded-xl">
              Add Person
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
