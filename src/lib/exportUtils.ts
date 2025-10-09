import { Expense, Participant, Group } from "@/types/expense";
import { format } from "date-fns";
import { getCategoryLabel } from "./categories";

export const exportToCSV = (
  expenses: Expense[],
  participants: Participant[],
  group: Group
) => {
  const headers = ["Date", "Description", "Category", "Amount", "Paid By", "Split Type", "Notes"];
  
  const rows = expenses.map(expense => {
    const payer = participants.find(p => p.id === expense.paidBy);
    return [
      format(expense.date, "yyyy-MM-dd"),
      expense.description,
      getCategoryLabel(expense.category),
      `$${expense.amount.toFixed(2)}`,
      payer?.name || "Unknown",
      expense.splitType,
      expense.notes || ""
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${group.name.replace(/\s+/g, "-")}-expenses-${format(new Date(), "yyyy-MM-dd")}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
