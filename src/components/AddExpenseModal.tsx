import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useExpenses } from "@/contexts/ExpenseContext";
import { toast } from "sonner";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddExpenseModal = ({ open, onClose }: AddExpenseModalProps) => {
  const { participants, addExpense } = useExpenses();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !paidBy || splitBetween.length === 0) {
      toast.error("Please fill all fields");
      return;
    }

    addExpense({
      description,
      amount: parseFloat(amount),
      paidBy,
      date: new Date(),
      category: "General",
      splitBetween,
    });

    toast.success("Expense added successfully!");
    handleClose();
  };

  const handleClose = () => {
    setDescription("");
    setAmount("");
    setPaidBy("");
    setSplitBetween([]);
    onClose();
  };

  const toggleSplitPerson = (personId: string) => {
    setSplitBetween(prev =>
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] glass-card border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Groceries, Rent, Dinner"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {participants.map(person => (
                  <SelectItem key={person.id} value={person.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: person.color }}
                      />
                      {person.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Split Between</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {participants.map(person => (
                <div key={person.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={person.id}
                    checked={splitBetween.includes(person.id)}
                    onCheckedChange={() => toggleSplitPerson(person.id)}
                  />
                  <label
                    htmlFor={person.id}
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ backgroundColor: person.color }}
                    >
                      {person.name[0]}
                    </div>
                    <span className="font-medium">{person.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gradient-primary text-white rounded-xl">
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
