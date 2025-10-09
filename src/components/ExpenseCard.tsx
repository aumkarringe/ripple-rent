import { Expense } from "@/types/expense";
import { useExpenses } from "@/contexts/ExpenseContext";
import { Receipt } from "lucide-react";
import { format } from "date-fns";

interface ExpenseCardProps {
  expense: Expense;
  delay?: number;
}

export const ExpenseCard = ({ expense, delay = 0 }: ExpenseCardProps) => {
  const { participants } = useExpenses();
  
  const payer = participants.find(p => p.id === expense.paidBy);
  const splitCount = expense.splitBetween.length;

  return (
    <div
      className="glass-card p-6 rounded-2xl hover-lift animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-lg mb-1">{expense.description}</h4>
            <p className="text-sm text-muted-foreground">
              Paid by <span className="font-medium" style={{ color: payer?.color }}>{payer?.name}</span>
              {" • "}
              Split {splitCount} way{splitCount > 1 ? "s" : ""}
              {" • "}
              {format(expense.date, "MMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="text-right ml-4">
          <p className="text-2xl font-bold">${expense.amount.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">
            ${(expense.amount / splitCount).toFixed(2)} each
          </p>
        </div>
      </div>
    </div>
  );
};
