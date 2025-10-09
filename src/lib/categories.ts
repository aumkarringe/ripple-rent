import { 
  UtensilsCrossed, 
  Home, 
  Zap, 
  Car, 
  Popcorn, 
  ShoppingCart, 
  ShoppingBag,
  Stethoscope,
  MoreHorizontal
} from "lucide-react";
import { ExpenseCategory } from "@/types/expense";

export const categoryConfig = {
  food: {
    label: "Food & Dining",
    icon: UtensilsCrossed,
    color: "hsl(25 95% 53%)",
  },
  rent: {
    label: "Rent",
    icon: Home,
    color: "hsl(160 84% 39%)",
  },
  utilities: {
    label: "Utilities",
    icon: Zap,
    color: "hsl(220 90% 56%)",
  },
  transport: {
    label: "Transport",
    icon: Car,
    color: "hsl(11 92% 66%)",
  },
  entertainment: {
    label: "Entertainment",
    icon: Popcorn,
    color: "hsl(262 83% 58%)",
  },
  groceries: {
    label: "Groceries",
    icon: ShoppingCart,
    color: "hsl(142 76% 36%)",
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingBag,
    color: "hsl(300 76% 56%)",
  },
  health: {
    label: "Health",
    icon: Stethoscope,
    color: "hsl(0 84% 60%)",
  },
  other: {
    label: "Other",
    icon: MoreHorizontal,
    color: "hsl(240 5% 65%)",
  },
} as const;

export const getCategoryIcon = (category: ExpenseCategory) => {
  return categoryConfig[category]?.icon || MoreHorizontal;
};

export const getCategoryLabel = (category: ExpenseCategory) => {
  return categoryConfig[category]?.label || "Other";
};

export const getCategoryColor = (category: ExpenseCategory) => {
  return categoryConfig[category]?.color || "hsl(240 5% 65%)";
};
