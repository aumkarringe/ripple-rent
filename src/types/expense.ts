export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  members: string[];
}

export type SplitType = "equal" | "percentage" | "exact";

export interface Split {
  participantId: string;
  amount?: number;
  percentage?: number;
}

export type ExpenseCategory = 
  | "food"
  | "rent"
  | "utilities"
  | "transport"
  | "entertainment"
  | "groceries"
  | "shopping"
  | "health"
  | "other";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: Date;
  category: ExpenseCategory;
  splitType: SplitType;
  splits: Split[];
  groupId: string;
  receipt?: string;
  isPaid?: boolean;
  notes?: string;
}

export interface Balance {
  from: string;
  to: string;
  amount: number;
}

export interface CategoryStats {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
}
