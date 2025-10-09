import { Button } from "@/components/ui/button";
import { useExpenses } from "@/contexts/ExpenseContext";
import { CheckCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const SettleUpButton = () => {
  const { balances, settleUp } = useExpenses();

  const handleSettleUp = () => {
    if (balances.length === 0) {
      toast.success("Already settled up! 🎉");
      return;
    }

    settleUp();
    
    // Celebration toast
    toast.success(
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-success animate-pulse" />
        <div>
          <p className="font-bold">All Clear!</p>
          <p className="text-sm">Everyone is settled up! 🎊</p>
        </div>
      </div>,
      { duration: 5000 }
    );
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Status</p>
        {balances.length === 0 ? (
          <p className="text-success font-semibold text-lg">✓ All Clear</p>
        ) : (
          <p className="text-warning font-semibold text-lg">Pending Settlements</p>
        )}
      </div>
      
      <Button
        onClick={handleSettleUp}
        disabled={balances.length === 0}
        className="w-full mt-4 gradient-success text-white rounded-xl"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Settle Up
      </Button>
    </div>
  );
};
