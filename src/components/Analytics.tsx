import { useExpenses } from "@/contexts/ExpenseContext";
import { Card } from "@/components/ui/card";
import { CategoryStats, ExpenseCategory } from "@/types/expense";
import { getCategoryLabel, getCategoryIcon, getCategoryColor } from "@/lib/categories";
import { useMemo } from "react";
import { TrendingUp, DollarSign, Receipt, Users } from "lucide-react";

export const Analytics = () => {
  const { expenses, participants, currentGroup } = useExpenses();

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    const categoryStats: CategoryStats[] = Object.entries(categoryTotals).map(([category, total]) => ({
      category: category as ExpenseCategory,
      total,
      count: expenses.filter(e => e.category === category).length,
      percentage: (total / (expenses.reduce((sum, exp) => sum + exp.amount, 0) || 1)) * 100,
    })).sort((a, b) => b.total - a.total);

    const avgExpense = expenses.length > 0 ? total / expenses.length : 0;

    return {
      total,
      categoryStats,
      avgExpense,
      expenseCount: expenses.length,
    };
  }, [expenses]);

  if (!currentGroup) return null;

  return (
    <section className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">Analytics</h2>
          <p className="text-muted-foreground">Spending insights for {currentGroup.name}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="glass-card p-6 rounded-2xl hover-lift">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-primary" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <p className="text-3xl font-bold">${stats.total.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">All expenses</p>
          </Card>

          <Card className="glass-card p-6 rounded-2xl hover-lift">
            <div className="flex items-center justify-between mb-3">
              <Receipt className="w-8 h-8 text-accent" />
              <span className="text-xs text-muted-foreground">Count</span>
            </div>
            <p className="text-3xl font-bold">{stats.expenseCount}</p>
            <p className="text-sm text-muted-foreground mt-1">Transactions</p>
          </Card>

          <Card className="glass-card p-6 rounded-2xl hover-lift">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 text-coral" />
              <span className="text-xs text-muted-foreground">Average</span>
            </div>
            <p className="text-3xl font-bold">${stats.avgExpense.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">Per expense</p>
          </Card>

          <Card className="glass-card p-6 rounded-2xl hover-lift">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-success" />
              <span className="text-xs text-muted-foreground">Members</span>
            </div>
            <p className="text-3xl font-bold">{currentGroup.members.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Active</p>
          </Card>
        </div>

        {/* Category Breakdown */}
        {stats.categoryStats.length > 0 && (
          <Card className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Spending by Category</h3>
            <div className="space-y-4">
              {stats.categoryStats.map((stat) => {
                const Icon = getCategoryIcon(stat.category);
                const color = getCategoryColor(stat.category);
                
                return (
                  <div key={stat.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color }} />
                        </div>
                        <div>
                          <p className="font-semibold">{getCategoryLabel(stat.category)}</p>
                          <p className="text-sm text-muted-foreground">
                            {stat.count} expense{stat.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${stat.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{stat.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${stat.percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {stats.categoryStats.length === 0 && (
          <Card className="glass-card p-12 rounded-2xl text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No expenses yet. Add some to see analytics!</p>
          </Card>
        )}
      </div>
    </section>
  );
};
