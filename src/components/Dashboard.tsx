import { Button } from "@/components/ui/button";
import { Plus, Users, Receipt, Download, Filter } from "lucide-react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { ExpenseCard } from "./ExpenseCard";
import { BalanceFlow } from "./BalanceFlow";
import { SettleUpButton } from "./SettleUpButton";
import { GroupSelector } from "./GroupSelector";
import { Input } from "./ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ExpenseCategory } from "@/types/expense";
import { categoryConfig } from "@/lib/categories";
import { exportToCSV } from "@/lib/exportUtils";
import { toast } from "sonner";

interface DashboardProps {
  onAddExpense: () => void;
  onAddParticipant: () => void;
}

export const Dashboard = ({ onAddExpense, onAddParticipant }: DashboardProps) => {
  const { participants, expenses, balances, currentGroup } = useExpenses();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");

  const groupMembers = participants.filter(p => 
    currentGroup?.members.includes(p.id)
  );

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    if (!currentGroup || expenses.length === 0) {
      toast.error("No expenses to export");
      return;
    }
    exportToCSV(expenses, participants, currentGroup);
    toast.success("Expenses exported successfully!");
  };

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <GroupSelector />
            {currentGroup && (
              <div className="text-sm text-muted-foreground">
                {groupMembers.length} members • {expenses.length} expenses
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleExport}
              variant="outline"
              className="rounded-xl"
              disabled={expenses.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={onAddParticipant}
              variant="outline"
              className="rounded-xl"
            >
              <Users className="w-4 h-4 mr-2" />
              Add Person
            </Button>
            <Button
              onClick={onAddExpense}
              className="gradient-primary text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {groupMembers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-20 h-20 mx-auto mb-6 text-muted-foreground/50" />
            <h3 className="text-2xl font-semibold mb-3">No participants yet</h3>
            <p className="text-muted-foreground mb-6">
              Add roommates or friends to start splitting expenses
            </p>
            <Button onClick={onAddParticipant} className="gradient-primary text-white rounded-xl">
              <Users className="w-4 h-4 mr-2" />
              Add Your First Person
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-2xl hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                    <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
                  </div>
                  <Receipt className="w-10 h-10 text-primary" />
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Debts</p>
                    <p className="text-3xl font-bold">{balances.length}</p>
                  </div>
                  <Users className="w-10 h-10 text-coral" />
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl hover-lift">
                <SettleUpButton />
              </div>
            </div>

            {/* Balance Flow Visualization */}
            {balances.length > 0 && (
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">Who Owes Whom</h3>
                <BalanceFlow />
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as ExpenseCategory | "all")}>
                <SelectTrigger className="w-full sm:w-[200px] rounded-xl">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
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

            {/* Expenses List */}
            <div>
              <h3 className="text-2xl font-bold mb-6">
                {searchQuery || categoryFilter !== "all" ? "Filtered " : ""}Expenses
              </h3>
              {filteredExpenses.length === 0 ? (
                <div className="glass-card p-12 rounded-2xl text-center">
                  <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    {expenses.length === 0 
                      ? "No expenses yet. Add your first one!"
                      : "No expenses match your filters."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredExpenses.map((expense, idx) => (
                    <ExpenseCard key={expense.id} expense={expense} delay={idx * 0.05} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
