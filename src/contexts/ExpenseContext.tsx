import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Participant, Expense, Balance, Group } from "@/types/expense";

interface ExpenseContextType {
  participants: Participant[];
  expenses: Expense[];
  balances: Balance[];
  groups: Group[];
  currentGroup: Group | null;
  addParticipant: (participant: Omit<Participant, "id">) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  addGroup: (group: Omit<Group, "id" | "createdAt">) => void;
  setCurrentGroup: (groupId: string) => void;
  calculateBalances: () => void;
  settleUp: () => void;
  deleteExpense: (expenseId: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const colors = ["#10B981", "#06B6D4", "#F59E0B", "#EC4899", "#8B5CF6", "#EF4444", "#14B8A6", "#F97316"];

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem("billease-participants");
    return saved ? JSON.parse(saved) : [];
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem("billease-groups");
    if (saved) {
      return JSON.parse(saved).map((g: any) => ({
        ...g,
        createdAt: new Date(g.createdAt)
      }));
    }
    // Create default group
    const defaultGroup: Group = {
      id: "default",
      name: "My Group",
      description: "Default expense group",
      createdAt: new Date(),
      members: []
    };
    return [defaultGroup];
  });

  const [currentGroup, setCurrentGroupState] = useState<Group | null>(() => {
    const savedId = localStorage.getItem("billease-current-group");
    return groups.find(g => g.id === savedId) || groups[0] || null;
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
    localStorage.setItem("billease-groups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    if (currentGroup) {
      localStorage.setItem("billease-current-group", currentGroup.id);
    }
  }, [currentGroup]);

  useEffect(() => {
    localStorage.setItem("billease-expenses", JSON.stringify(expenses));
    calculateBalances();
  }, [expenses, currentGroup]);

  const addParticipant = (participant: Omit<Participant, "id">) => {
    const newParticipant = {
      ...participant,
      id: Date.now().toString(),
      color: colors[participants.length % colors.length],
    };
    setParticipants([...participants, newParticipant]);
    
    // Add to current group
    if (currentGroup) {
      const updatedGroups = groups.map(g =>
        g.id === currentGroup.id
          ? { ...g, members: [...g.members, newParticipant.id] }
          : g
      );
      setGroups(updatedGroups);
      setCurrentGroupState(updatedGroups.find(g => g.id === currentGroup.id) || null);
    }
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      groupId: currentGroup?.id || "default",
    };
    setExpenses([newExpense, ...expenses]);
  };

  const addGroup = (group: Omit<Group, "id" | "createdAt">) => {
    const newGroup = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setGroups([...groups, newGroup]);
    setCurrentGroupState(newGroup);
  };

  const setCurrentGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setCurrentGroupState(group);
    }
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter(e => e.id !== expenseId));
  };

  const calculateBalances = () => {
    if (!currentGroup) return;

    const groupExpenses = expenses.filter(e => e.groupId === currentGroup.id);
    const balanceMap = new Map<string, number>();
    
    currentGroup.members.forEach(memberId => balanceMap.set(memberId, 0));

    groupExpenses.forEach(expense => {
      if (expense.splitType === "equal") {
        const splitAmount = expense.amount / expense.splits.length;
        expense.splits.forEach(split => {
          if (split.participantId !== expense.paidBy) {
            balanceMap.set(split.participantId, (balanceMap.get(split.participantId) || 0) - splitAmount);
            balanceMap.set(expense.paidBy, (balanceMap.get(expense.paidBy) || 0) + splitAmount);
          }
        });
      } else if (expense.splitType === "exact") {
        expense.splits.forEach(split => {
          const amount = split.amount || 0;
          if (split.participantId !== expense.paidBy) {
            balanceMap.set(split.participantId, (balanceMap.get(split.participantId) || 0) - amount);
            balanceMap.set(expense.paidBy, (balanceMap.get(expense.paidBy) || 0) + amount);
          }
        });
      } else if (expense.splitType === "percentage") {
        expense.splits.forEach(split => {
          const percentage = split.percentage || 0;
          const amount = (expense.amount * percentage) / 100;
          if (split.participantId !== expense.paidBy) {
            balanceMap.set(split.participantId, (balanceMap.get(split.participantId) || 0) - amount);
            balanceMap.set(expense.paidBy, (balanceMap.get(expense.paidBy) || 0) + amount);
          }
        });
      }
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
    if (currentGroup) {
      setExpenses(expenses.filter(e => e.groupId !== currentGroup.id));
    }
    setBalances([]);
  };

  return (
    <ExpenseContext.Provider
      value={{
        participants,
        expenses: expenses.filter(e => e.groupId === currentGroup?.id),
        balances,
        groups,
        currentGroup,
        addParticipant,
        addExpense,
        addGroup,
        setCurrentGroup,
        calculateBalances,
        settleUp,
        deleteExpense,
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
