import { Expense } from "@/types/expense";
import { useExpenses } from "@/contexts/ExpenseContext";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { getCategoryIcon, getCategoryLabel, getCategoryColor } from "@/lib/categories";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ExpenseCardProps {
  expense: Expense;
  delay?: number;
}

export const ExpenseCard = ({ expense, delay = 0 }: ExpenseCardProps) => {
  const { participants, deleteExpense } = useExpenses();
  
  const payer = participants.find(p => p.id === expense.paidBy);
  const CategoryIcon = getCategoryIcon(expense.category);
  const categoryColor = getCategoryColor(expense.category);

  const handleDelete = () => {
    deleteExpense(expense.id);
    toast.success("Expense deleted");
  };

  return (
    <div
      className="glass-card p-6 rounded-2xl hover-lift animate-slide-up group"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            <CategoryIcon className="w-6 h-6" style={{ color: categoryColor }} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{expense.description}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {getCategoryLabel(expense.category)}
                  {" • "}
                  {format(expense.date, "MMM d, yyyy")}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted">
                    Paid by <span className="font-medium" style={{ color: payer?.color }}>{payer?.name}</span>
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                    {expense.splitType} split
                  </span>
                  {expense.splits.length > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-muted">
                      {expense.splits.length} {expense.splits.length === 1 ? "person" : "people"}
                    </span>
                  )}
                </div>
                {expense.notes && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    {expense.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 ml-4">
          <div className="text-right">
            <p className="text-2xl font-bold">${expense.amount.toFixed(2)}</p>
            {expense.splitType === "equal" && (
              <p className="text-sm text-muted-foreground">
                ${(expense.amount / expense.splits.length).toFixed(2)} each
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
