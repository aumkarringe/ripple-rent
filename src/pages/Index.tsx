import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { AddParticipantModal } from "@/components/AddParticipantModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExpenseProvider } from "@/contexts/ExpenseContext";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);

  const handleGetStarted = () => {
    setShowDashboard(true);
    setTimeout(() => {
      document.querySelector("#dashboard")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <ExpenseProvider>
      <div className="relative">
        <ThemeToggle />
        
        <Hero onGetStarted={handleGetStarted} />
        
        {showDashboard && (
          <div id="dashboard">
            <Dashboard
              onAddExpense={() => setShowAddExpense(true)}
              onAddParticipant={() => setShowAddParticipant(true)}
            />
          </div>
        )}

        <AddExpenseModal
          open={showAddExpense}
          onClose={() => setShowAddExpense(false)}
        />

        <AddParticipantModal
          open={showAddParticipant}
          onClose={() => setShowAddParticipant(false)}
        />
      </div>
    </ExpenseProvider>
  );
};

export default Index;
