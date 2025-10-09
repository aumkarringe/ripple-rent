import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useExpenses } from "@/contexts/ExpenseContext";
import { toast } from "sonner";
import { ExpenseCategory, SplitType } from "@/types/expense";
import { categoryConfig } from "@/lib/categories";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddExpenseModal = ({ open, onClose }: AddExpenseModalProps) => {
  const { participants, addExpense, currentGroup } = useExpenses();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("other");
  const [splitType, setSplitType] = useState<SplitType>("equal");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [exactAmounts, setExactAmounts] = useState<Record<string, string>>({});
  const [percentages, setPercentages] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");

  const groupMembers = participants.filter(p => 
    currentGroup?.members.includes(p.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !paidBy || selectedParticipants.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const amountNum = parseFloat(amount);

    if (splitType === "exact") {
      const total = selectedParticipants.reduce((sum, id) => 
        sum + parseFloat(exactAmounts[id] || "0"), 0
      );
      if (Math.abs(total - amountNum) > 0.01) {
        toast.error(`Split amounts must equal total: $${amountNum.toFixed(2)}`);
        return;
      }
    }

    if (splitType === "percentage") {
      const total = selectedParticipants.reduce((sum, id) => 
        sum + parseFloat(percentages[id] || "0"), 0
      );
      if (Math.abs(total - 100) > 0.01) {
        toast.error("Percentages must equal 100%");
        return;
      }
    }

    const splits = selectedParticipants.map(id => ({
      participantId: id,
      amount: splitType === "exact" ? parseFloat(exactAmounts[id] || "0") : undefined,
      percentage: splitType === "percentage" ? parseFloat(percentages[id] || "0") : undefined,
    }));

    addExpense({
      description,
      amount: amountNum,
      paidBy,
      date: new Date(),
      category,
      splitType,
      splits,
      groupId: currentGroup?.id || "default",
      notes: notes.trim() || undefined,
    });

    toast.success("Expense added successfully!");
    handleClose();
  };

  const handleClose = () => {
    setDescription("");
    setAmount("");
    setPaidBy("");
    setCategory("other");
    setSplitType("equal");
    setSelectedParticipants([]);
    setExactAmounts({});
    setPercentages({});
    setNotes("");
    onClose();
  };

  const toggleParticipant = (personId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto glass-card border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              placeholder="e.g., Dinner at restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($) *</Label>
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
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color: config.color }} />
                          {config.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By *</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {groupMembers.map(person => (
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
            <Label>Split Between * ({selectedParticipants.length} selected)</Label>
            
            <Tabs value={splitType} onValueChange={(v) => setSplitType(v as SplitType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="equal">Equal</TabsTrigger>
                <TabsTrigger value="percentage">%</TabsTrigger>
                <TabsTrigger value="exact">Exact</TabsTrigger>
              </TabsList>

              <TabsContent value="equal" className="space-y-2 mt-4">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {groupMembers.map(person => (
                    <div key={person.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={person.id}
                          checked={selectedParticipants.includes(person.id)}
                          onCheckedChange={() => toggleParticipant(person.id)}
                        />
                        <label htmlFor={person.id} className="flex items-center gap-2 cursor-pointer">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                            style={{ backgroundColor: person.color }}
                          >
                            {person.name[0]}
                          </div>
                          <span className="font-medium">{person.name}</span>
                        </label>
                      </div>
                      {selectedParticipants.includes(person.id) && amount && (
                        <span className="text-sm text-muted-foreground">
                          ${(parseFloat(amount) / selectedParticipants.length).toFixed(2)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="percentage" className="space-y-2 mt-4">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {groupMembers.map(person => (
                    <div key={person.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                      <Checkbox
                        id={`pct-${person.id}`}
                        checked={selectedParticipants.includes(person.id)}
                        onCheckedChange={() => toggleParticipant(person.id)}
                      />
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                        style={{ backgroundColor: person.color }}
                      >
                        {person.name[0]}
                      </div>
                      <span className="font-medium flex-1">{person.name}</span>
                      {selectedParticipants.includes(person.id) && (
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0%"
                          value={percentages[person.id] || ""}
                          onChange={(e) => setPercentages({...percentages, [person.id]: e.target.value})}
                          className="w-24"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="exact" className="space-y-2 mt-4">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {groupMembers.map(person => (
                    <div key={person.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                      <Checkbox
                        id={`exact-${person.id}`}
                        checked={selectedParticipants.includes(person.id)}
                        onCheckedChange={() => toggleParticipant(person.id)}
                      />
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                        style={{ backgroundColor: person.color }}
                      >
                        {person.name[0]}
                      </div>
                      <span className="font-medium flex-1">{person.name}</span>
                      {selectedParticipants.includes(person.id) && (
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="$0.00"
                          value={exactAmounts[person.id] || ""}
                          onChange={(e) => setExactAmounts({...exactAmounts, [person.id]: e.target.value})}
                          className="w-24"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl resize-none"
              rows={3}
            />
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
