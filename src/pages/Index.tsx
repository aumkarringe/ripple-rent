import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { Analytics } from "@/components/Analytics";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { AddParticipantModal } from "@/components/AddParticipantModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleGetStarted = () => {
    setShowDashboard(true);
    setTimeout(() => {
      document.querySelector("#app-container")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <ExpenseProvider>
      <div className="relative">
        <ThemeToggle />
        
        <Hero onGetStarted={handleGetStarted} />
        
        {showDashboard && (
          <div id="app-container" className="bg-background">
            <div className="container max-w-6xl mx-auto px-4 py-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard" className="mt-0">
                  <Dashboard
                    onAddExpense={() => setShowAddExpense(true)}
                    onAddParticipant={() => setShowAddParticipant(true)}
                  />
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-0">
                  <Analytics />
                </TabsContent>
              </Tabs>
            </div>
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
