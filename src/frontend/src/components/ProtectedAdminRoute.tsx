import { ReactNode, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import { Shield, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { identity, login, isInitializing, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoading = isInitializing || (isAuthenticated && isCheckingAdmin);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <LogIn className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-fredoka font-bold mb-4">
            Admin Login Required
          </h2>
          <p className="text-muted-foreground mb-6">
            You need to log in to access the admin panel.
          </p>
          <Button
            onClick={login}
            size="lg"
            disabled={loginStatus === "logging-in"}
            className="bg-primary hover:bg-primary/90"
          >
            {loginStatus === "logging-in" ? "Logging in..." : "Login with Internet Identity"}
          </Button>
        </div>
      </div>
    );
  }

  // If authenticated but not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-3xl font-fredoka font-bold mb-4">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page. Only administrators can manage content.
          </p>
          <Button
            onClick={() => navigate({ to: "/" })}
            variant="outline"
            size="lg"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // If admin, render children
  return <>{children}</>;
}
