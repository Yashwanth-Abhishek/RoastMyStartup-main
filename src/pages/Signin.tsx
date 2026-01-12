import { PageLayout } from "@/components/layout/PageLayout";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalCard, BrutalCardContent, BrutalCardHeader, BrutalCardTitle } from "@/components/ui/brutal-card";
import { Github } from "lucide-react";
import { authService } from "@/services/authService";
import { useState } from "react";

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.initiateGoogleLogin();
    } catch (error) {
      console.error("Google signin error:", error);
      setError("Failed to initiate Google signin. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.initiateGithubLogin();
    } catch (error) {
      console.error("GitHub signin error:", error);
      setError("Failed to initiate GitHub signin. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="section-container py-20">
        <div className="max-w-md mx-auto">
          <BrutalCard>
            <BrutalCardHeader className="text-center">
              <BrutalCardTitle className="text-3xl font-bold mb-2">
                Sign In
              </BrutalCardTitle>
              <p className="text-muted-foreground">
                Choose your preferred sign-in method
              </p>
            </BrutalCardHeader>
            <BrutalCardContent className="space-y-4">
              {error && (
                <div className="p-4 border-4 border-red-500 bg-red-50 text-red-700">
                  {error}
                </div>
              )}
              
              <BrutalButton
                onClick={handleGoogleSignin}
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-3"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isLoading ? "Connecting..." : "Continue with Google"}
              </BrutalButton>

              <BrutalButton
                onClick={handleGithubSignin}
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-3"
                disabled={isLoading}
              >
                <Github className="w-5 h-5" />
                {isLoading ? "Connecting..." : "Continue with GitHub"}
              </BrutalButton>
            </BrutalCardContent>
          </BrutalCard>
        </div>
      </div>
    </PageLayout>
  );
}