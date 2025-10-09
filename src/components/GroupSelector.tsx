import { useExpenses } from "@/contexts/ExpenseContext";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

export const GroupSelector = () => {
  const { groups, currentGroup, setCurrentGroup, addGroup } = useExpenses();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    addGroup({
      name: name.trim(),
      description: description.trim() || undefined,
      members: [],
    });

    toast.success("Group created successfully!");
    setName("");
    setDescription("");
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      <Select
        value={currentGroup?.id}
        onValueChange={setCurrentGroup}
      >
        <SelectTrigger className="w-[200px] rounded-xl glass-card border-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {group.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full glass-card border-0">
            <Plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-card border-0">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateGroup} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name *</Label>
              <Input
                id="groupName"
                placeholder="e.g., Vacation 2025, Apartment 301"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupDesc">Description</Label>
              <Textarea
                id="groupDesc"
                placeholder="Optional description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 gradient-primary text-white rounded-xl">
                Create Group
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
