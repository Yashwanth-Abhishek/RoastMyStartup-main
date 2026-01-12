import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { BrutalCard, BrutalCardContent } from "@/components/ui/brutal-card";
import { authService, User } from "@/services/authService";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      const token = searchParams.get("token");
      
      if (!token) {
        setError("No authentication token received");
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.handleAuthSuccess(token);
        setUser(userData);
        
        // Redirect to dashboard or home after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (error) {
        console.error("Auth success error:", error);
        setError("Failed to complete authentication");
      } finally {
        setLoading(false);
      }
    };

    handleAuthSuccess();
  }, [searchParams, navigate]);

  return (
    <PageLayout>
      <div className="section-container py-20">
        <div className="max-w-md mx-auto">
          <BrutalCard>
            <BrutalCardContent className="text-center py-8">
              {loading && (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <h2 className="text-2xl font-bold mb-2">Completing Sign In...</h2>
                  <p className="text-muted-foreground">Please wait while we set up your account.</p>
                </>
              )}
              
              {error && (
                <>
                  <div className="text-6xl mb-4">❌</div>
                  <h2 className="text-2xl font-bold mb-2 text-red-600">Authentication Failed</h2>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <button
                    onClick={() => navigate("/signin")}
                    className="px-4 py-2 bg-primary text-primary-foreground border-4 border-foreground font-bold"
                  >
                    Try Again
                  </button>
                </>
              )}
              
              {user && !loading && (
                <>
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h2>
                  <p className="text-muted-foreground mb-4">
                    You've successfully signed in with {user.provider === 'google' ? 'Google' : 'GitHub'}.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to your dashboard...
                  </p>
                </>
              )}
            </BrutalCardContent>
          </BrutalCard>
        </div>
      </div>
    </PageLayout>
  );
}