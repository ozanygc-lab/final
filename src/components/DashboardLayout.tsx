import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BookOpen, LayoutDashboard, MessageSquare, Sparkles, 
  Settings, CreditCard, LogOut, Menu, X, User
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Mes Ebooks", href: "/dashboard/ebooks", icon: BookOpen },
    { label: "Générer", href: "/dashboard/generate", icon: Sparkles },
    { label: "Chat IA", href: "/app/chat", icon: MessageSquare },
    { label: "Abonnement", href: "/pricing", icon: CreditCard },
    { label: "Paramètres", href: "/settings", icon: Settings }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-cyber-dark flex">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-indigo w-[500px] h-[500px] -top-60 -left-60 opacity-50" />
        <div className="orb orb-blue w-[400px] h-[400px] bottom-0 right-0 opacity-50" style={{ animationDelay: "-2s" }} />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(hsl(var(--glass-border)/0.05)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--glass-border)/0.05)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass-card rounded-none border-r border-glass-border/50 transform transition-transform duration-300 lg:transform-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-indigo to-neon-blue flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">
              Ebook<span className="text-neon-indigo">AI</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-neon-indigo/20 text-neon-indigo border border-neon-indigo/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-glass/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t border-glass-border/50 pt-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-indigo to-neon-blue flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@example.com</p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start border-glass-border/50 bg-glass/30 hover:bg-glass/50 text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 glass-card rounded-none border-b border-glass-border/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-indigo to-neon-blue flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tighter">
                Ebook<span className="text-neon-indigo">AI</span>
              </span>
            </Link>
            <div className="w-10" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
