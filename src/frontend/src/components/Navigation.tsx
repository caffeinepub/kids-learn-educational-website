import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, BookMarked, Gamepad2, GraduationCap, Sparkles, Shield, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const navItems = [
    { path: "/", label: "Home", icon: Sparkles },
    { path: "/poems", label: "Poems", icon: BookMarked },
    { path: "/stories", label: "Stories", icon: BookOpen },
    { path: "/games", label: "Games", icon: Gamepad2 },
    { path: "/education", label: "Learn", icon: GraduationCap },
  ];

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-primary/20 bg-card shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
            <span className="font-fredoka text-2xl sm:text-3xl font-bold text-primary text-shadow-fun">
              Kids Learn
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {navItems.slice(1).map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.path ||
                pathname.startsWith(item.path + "/");

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 sm:px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-110",
                    isActive
                      ? "bg-primary/20 shadow-md"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-fredoka font-semibold",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Admin Link - Only show when authenticated as admin */}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "flex flex-col items-center gap-1 px-2 sm:px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-110",
                  pathname.startsWith("/admin")
                    ? "bg-accent/20 shadow-md"
                    : "hover:bg-muted"
                )}
              >
                <Shield
                  className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
                    pathname.startsWith("/admin") ? "text-accent" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs sm:text-sm font-fredoka font-semibold",
                    pathname.startsWith("/admin") ? "text-accent" : "text-muted-foreground"
                  )}
                >
                  Admin
                </span>
              </Link>
            )}

            {/* Login/Logout Button */}
            <Button
              onClick={isAuthenticated ? handleLogout : handleLogin}
              disabled={isLoggingIn}
              size="sm"
              variant={isAuthenticated ? "outline" : "default"}
              className="ml-2"
            >
              {isLoggingIn ? (
                "Loading..."
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Login</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
