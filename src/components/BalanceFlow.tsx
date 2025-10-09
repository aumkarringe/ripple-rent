import { useExpenses } from "@/contexts/ExpenseContext";
import { ArrowRight } from "lucide-react";

export const BalanceFlow = () => {
  const { balances, participants } = useExpenses();

  if (balances.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-success font-semibold">✨ All settled up! ✨</p>
        <p className="text-muted-foreground mt-2">No outstanding balances</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {balances.map((balance, idx) => {
        const fromPerson = participants.find(p => p.id === balance.from);
        const toPerson = participants.find(p => p.id === balance.to);

        return (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl animate-slide-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white"
                style={{ backgroundColor: fromPerson?.color }}
              >
                {fromPerson?.name[0]}
              </div>
              <span className="font-medium">{fromPerson?.name}</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive">
              <span className="font-bold">owes</span>
              <span className="text-xl font-bold">${balance.amount.toFixed(2)}</span>
              <ArrowRight className="w-5 h-5" />
            </div>

            <div className="flex items-center gap-3 flex-1 justify-end">
              <span className="font-medium">{toPerson?.name}</span>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white"
                style={{ backgroundColor: toPerson?.color }}
              >
                {toPerson?.name[0]}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
