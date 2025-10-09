import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Participant, Expense, Balance } from "@/types/expense";

interface ExpenseContextType {
  participants: Participant[];
  expenses: Expense[];
  balances: Balance[];
  addParticipant: (participant: Omit<Participant, "id">) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  calculateBalances: () => void;
  settleUp: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const colors = ["#8B5CF6", "#06B6D4", "#F59E0B", "#EC4899", "#10B981", "#EF4444"];

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem("billease-participants");
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("billease-expenses");
    return saved ? JSON.parse(saved).map((exp: any) => ({
      ...exp,
      date: new Date(exp.date)
    })) : [];
  });

  const [balances, setBalances] = useState<Balance[]>([]);

  useEffect(() => {
    localStorage.setItem("billease-participants", JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem("billease-expenses", JSON.stringify(expenses));
    calculateBalances();
  }, [expenses]);

  const addParticipant = (participant: Omit<Participant, "id">) => {
    const newParticipant = {
      ...participant,
      id: Date.now().toString(),
      color: colors[participants.length % colors.length],
    };
    setParticipants([...participants, newParticipant]);
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const calculateBalances = () => {
    const balanceMap = new Map<string, number>();
    
    participants.forEach(p => balanceMap.set(p.id, 0));

    expenses.forEach(expense => {
      const splitAmount = expense.amount / expense.splitBetween.length;
      
      expense.splitBetween.forEach(personId => {
        if (personId !== expense.paidBy) {
          balanceMap.set(personId, (balanceMap.get(personId) || 0) - splitAmount);
          balanceMap.set(expense.paidBy, (balanceMap.get(expense.paidBy) || 0) + splitAmount);
        }
      });
    });

    const positiveBalances = Array.from(balanceMap.entries())
      .filter(([_, amount]) => amount > 0.01)
      .sort((a, b) => b[1] - a[1]);

    const negativeBalances = Array.from(balanceMap.entries())
      .filter(([_, amount]) => amount < -0.01)
      .sort((a, b) => a[1] - b[1]);

    const settlements: Balance[] = [];
    let i = 0, j = 0;

    while (i < positiveBalances.length && j < negativeBalances.length) {
      const [creditor, creditAmount] = positiveBalances[i];
      const [debtor, debtAmount] = negativeBalances[j];
      const settleAmount = Math.min(creditAmount, Math.abs(debtAmount));

      if (settleAmount > 0.01) {
        settlements.push({
          from: debtor,
          to: creditor,
          amount: settleAmount,
        });
      }

      positiveBalances[i][1] -= settleAmount;
      negativeBalances[j][1] += settleAmount;

      if (Math.abs(positiveBalances[i][1]) < 0.01) i++;
      if (Math.abs(negativeBalances[j][1]) < 0.01) j++;
    }

    setBalances(settlements);
  };

  const settleUp = () => {
    setExpenses([]);
    setBalances([]);
  };

  return (
    <ExpenseContext.Provider
      value={{
        participants,
        expenses,
        balances,
        addParticipant,
        addExpense,
        calculateBalances,
        settleUp,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("useExpenses must be used within ExpenseProvider");
  return context;
};
