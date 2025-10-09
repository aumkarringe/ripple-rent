import { Button } from "@/components/ui/button";
import { ArrowRight, Users, DollarSign, TrendingUp } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-success/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <DollarSign className="absolute top-32 left-[10%] w-12 h-12 text-primary/30 animate-float" />
        <Users className="absolute top-48 right-[15%] w-16 h-16 text-success/30 animate-float" style={{ animationDelay: "1s" }} />
        <TrendingUp className="absolute bottom-32 left-[20%] w-14 h-14 text-accent/30 animate-float" style={{ animationDelay: "3s" }} />
        <DollarSign className="absolute bottom-48 right-[10%] w-10 h-10 text-warning/30 animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="container px-4 text-center z-10">
        <div className="animate-slide-up">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="text-gradient">BillEase</span>
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground mb-4 font-light">
            Smart Expense Splitter for Shared Living
          </p>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Split bills effortlessly with roommates. Beautiful, intuitive, and fun—
            track expenses, settle debts, and keep friendships intact.
          </p>
          
          <Button
            size="lg"
            onClick={onGetStarted}
            className="group gradient-primary text-white text-lg px-8 py-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Feature highlights */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, text: "Add roommates & friends" },
              { icon: DollarSign, text: "Split expenses instantly" },
              { icon: TrendingUp, text: "Track balances visually" }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl hover-lift"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <feature.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                <p className="text-foreground font-medium">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
