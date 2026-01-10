import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalCard, BrutalCardContent } from "@/components/ui/brutal-card";
import { BrutalProgress } from "@/components/ui/brutal-progress";
import { ScoreMeter } from "@/components/roast/ScoreMeter";
import { Share2, RotateCcw, Zap, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { RoastResponse } from "@/lib/api";

// Generate random score between min and max
const generateRandomScore = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const metricLabels = [
  "Originality",
  "Market Fit",
  "Founder Sanity",
  "Investor Appeal",
  "Execution Feasibility",
];

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [roastData, setRoastData] = useState<RoastResponse | null>(null);
  const [metrics, setMetrics] = useState<
    Array<{ label: string; value: number; max: number }>
  >([]);
  const [roastScore, setRoastScore] = useState(0);

  useEffect(() => {
    // Get roast data from navigation state
    const state = location.state as { roast?: RoastResponse } | null;
    if (state?.roast) {
      setRoastData(state.roast);
      // Generate random scores
      const newMetrics = metricLabels.map((label) => ({
        label,
        value: generateRandomScore(1, 10),
        max: 10,
      }));
      setMetrics(newMetrics);
      // Calculate average score
      const average =
        newMetrics.reduce((sum, m) => sum + m.value, 0) / newMetrics.length;
      setRoastScore(Math.round(average * 10) / 10);
    } else {
      // If no data, redirect to roast page
      navigate("/roast", { replace: true });
    }
  }, [location.state, navigate]);

  // Show loading or redirect message if no data
  if (!roastData) {
    return (
      <PageLayout>
        <section className="section-container py-12">
          <div className="text-center">
            <p>Redirecting to roast page...</p>
          </div>
        </section>
      </PageLayout>
    );
  }

  // Extract quotes from roast data for display
  const extractQuotes = () => {
    const quotes: string[] = [];
    // Get first few sentences from brutal_roast as quotes
    const brutalLines = roastData.brutal_roast
      .split(/[.!?]\s+/)
      .filter((line) => line.trim().length > 20)
      .slice(0, 3);
    quotes.push(...brutalLines.map((q) => q.trim()));
    return quotes;
  };

  const savageQuotes = extractQuotes();

  return (
    <PageLayout>
      <section className="section-container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Roast Results 💀
          </h1>
          <p className="text-xl text-muted-foreground">
            The truth hurts. Here's yours.
          </p>
        </div>

        {/* Score */}
        <div className="mb-12">
          <ScoreMeter score={roastScore} />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric) => (
            <BrutalCard key={metric.label}>
              <BrutalCardContent>
                <BrutalProgress
                  label={metric.label}
                  value={metric.value}
                  max={metric.max}
                />
              </BrutalCardContent>
            </BrutalCard>
          ))}
        </div>

        {/* Savage Quotes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Highlights from Your Roast 🔥
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {savageQuotes.map((quote, index) => (
              <BrutalCard
                key={index}
                rotate={index % 2 === 0 ? "1" : "-1"}
                className="bg-muted"
              >
                <BrutalCardContent className="flex gap-4">
                  <Quote className="h-8 w-8 flex-shrink-0 text-primary" />
                  <p className="text-lg font-medium italic">"{quote}"</p>
                </BrutalCardContent>
              </BrutalCard>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <BrutalCard className="max-w-3xl mx-auto mb-12 bg-primary">
          <BrutalCardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">The Verdict</h3>
            <p className="text-lg mb-6 whitespace-pre-wrap">
              {roastData.honest_feedback}
            </p>
            <div className="inline-block bg-secondary text-secondary-foreground px-6 py-3 border-4 border-foreground font-bold">
              Survival Chance: {Math.round((roastScore / 10) * 100)}%
            </div>
          </BrutalCardContent>
        </BrutalCard>

        {/* Detailed Sections */}
        <div className="space-y-8 max-w-4xl mx-auto mb-12">
          <BrutalCard>
            <BrutalCardContent className="py-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                💀 Brutal Roast
              </h3>
              <p className="text-lg whitespace-pre-wrap">
                {roastData.brutal_roast}
              </p>
            </BrutalCardContent>
          </BrutalCard>

          <BrutalCard>
            <BrutalCardContent className="py-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                🎯 Competitor Reality Check
              </h3>
              <p className="text-lg whitespace-pre-wrap">
                {roastData.competitor_reality_check}
              </p>
            </BrutalCardContent>
          </BrutalCard>

          <BrutalCard>
            <BrutalCardContent className="py-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                🛟 Survival Tips
              </h3>
              <ul className="space-y-3">
                {roastData.survival_tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="font-bold text-primary">{index + 1}.</span>
                    <p className="text-lg">{tip}</p>
                  </li>
                ))}
              </ul>
            </BrutalCardContent>
          </BrutalCard>

          <BrutalCard>
            <BrutalCardContent className="py-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                ✍️ Pitch Rewrite
              </h3>
              <p className="text-lg whitespace-pre-wrap">
                {roastData.pitch_rewrite}
              </p>
            </BrutalCardContent>
          </BrutalCard>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <BrutalButton size="lg">
            <Share2 className="h-5 w-5 mr-2" />
            Share Results
          </BrutalButton>
          <Link to="/roast">
            <BrutalButton variant="outline" size="lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              Try Again
            </BrutalButton>
          </Link>
          <Link to="/pricing">
            <BrutalButton variant="secondary" size="lg">
              <Zap className="h-5 w-5 mr-2" />
              Upgrade for More
            </BrutalButton>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
