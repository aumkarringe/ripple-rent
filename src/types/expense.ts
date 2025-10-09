export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: Date;
  category: string;
  splitBetween: string[];
}

export interface Balance {
  from: string;
  to: string;
  amount: number;
}
