import { Button } from "@/components/ui/button";
import { Plus, Users, Receipt } from "lucide-react";
import { useExpenses } from "@/contexts/ExpenseContext";
import { ExpenseCard } from "./ExpenseCard";
import { BalanceFlow } from "./BalanceFlow";
import { SettleUpButton } from "./SettleUpButton";

interface DashboardProps {
  onAddExpense: () => void;
  onAddParticipant: () => void;
}

export const Dashboard = ({ onAddExpense, onAddParticipant }: DashboardProps) => {
  const { participants, expenses, balances } = useExpenses();

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold mb-2">Dashboard</h2>
            <p className="text-muted-foreground">
              {participants.length} participants • {expenses.length} expenses
            </p>
          </div>
          
          <div className="flex gap-3">
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

        {participants.length === 0 ? (
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
                  <Users className="w-10 h-10 text-warning" />
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

            {/* Expenses List */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Recent Expenses</h3>
              {expenses.length === 0 ? (
                <div className="glass-card p-12 rounded-2xl text-center">
                  <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No expenses yet. Add your first one!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {expenses.map((expense, idx) => (
                    <ExpenseCard key={expense.id} expense={expense} delay={idx * 0.1} />
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
