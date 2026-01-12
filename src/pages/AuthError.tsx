import { useSearchParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { BrutalCard, BrutalCardContent } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";

export default function AuthError() {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get("message") || "An unknown error occurred during authentication";

  return (
    <PageLayout>
      <div className="section-container py-20">
        <div className="max-w-md mx-auto">
          <BrutalCard>
            <BrutalCardContent className="text-center py-8">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold mb-2 text-red-600">Authentication Failed</h2>
              <p className="text-muted-foreground mb-6">{errorMessage}</p>
              
              <div className="space-y-3">
                <Link to="/signin">
                  <BrutalButton className="w-full">
                    Try Again
                  </BrutalButton>
                </Link>
                <Link to="/">
                  <BrutalButton variant="outline" className="w-full">
                    Go Home
                  </BrutalButton>
                </Link>
              </div>
            </BrutalCardContent>
          </BrutalCard>
        </div>
      </div>
    </PageLayout>
  );
}