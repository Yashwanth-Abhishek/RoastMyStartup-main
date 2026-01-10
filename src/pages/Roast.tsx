import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalTextarea } from "@/components/ui/brutal-textarea";
import { BrutalCard, BrutalCardContent, BrutalCardHeader, BrutalCardTitle } from "@/components/ui/brutal-card";
import { Download, Share2, ImageIcon, Flame, Skull, Heart, Lightbulb, PenLine, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateRoast, type RoastResponse } from "@/lib/api";

const roastLevels = [
  { id: "soft", name: "Soft", emoji: "🌶️", description: "Gentle feedback" },
  { id: "medium", name: "Medium", emoji: "🔥", description: "No sugarcoating" },
  { id: "nuclear", name: "Nuclear", emoji: "☢️", description: "Maximum damage" },
];

const tabs = [
  { id: "roast", label: "Brutal Roast", icon: Skull },
  { id: "feedback", label: "Honest Feedback", icon: Heart },
  { id: "competitors", label: "Competitor Reality Check", icon: Target },
  { id: "tips", label: "Survival Tips", icon: Lightbulb },
  { id: "rewrite", label: "Pitch Rewrite", icon: PenLine },
];


export default function Roast() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startupName: "",
    description: "",
    targetUsers: "",
    budget: "",
    roastLevel: "medium",
  });
  const [activeTab, setActiveTab] = useState("roast");
  const [roastData, setRoastData] = useState<RoastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Map roast level from form format to API format
      const roastLevelMap: Record<string, "Soft" | "Medium" | "Nuclear"> = {
        soft: "Soft",
        medium: "Medium",
        nuclear: "Nuclear",
      };

      const response = await generateRoast({
        startup_name: formData.startupName,
        idea_description: formData.description,
        target_users: formData.targetUsers,
        budget: formData.budget,
        roast_level: roastLevelMap[formData.roastLevel] || "Medium",
      });

      setRoastData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate roast");
      console.error("Roast generation error:", err);
    } finally {
      setLoading(false);
    }
  };


  const renderCompetitorCheck = () => {
    if (!roastData) {
      return (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          <div className="text-center">
            <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="font-bold">No competitors found.</p>
            <p className="text-sm mt-2">Which probably means nobody wants this.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <pre className="whitespace-pre-wrap text-primary text-sm leading-relaxed">
          {roastData.competitor_reality_check}
        </pre>
      </div>
    );
  };

  const renderSurvivalTips = () => {
    if (!roastData) {
      return (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          <div className="text-center">
            <Lightbulb className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="font-bold">No tips available yet.</p>
            <p className="text-sm mt-2">Generate a roast to see survival tips.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {roastData.survival_tips.map((tip, index) => (
          <div
            key={index}
            className="bg-background border-4 border-foreground p-4"
          >
            <p className="text-primary text-sm leading-relaxed">
              {index + 1}. {tip}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (!roastData) {
      return null;
    }

    switch (activeTab) {
      case "roast":
        return (
          <pre className="whitespace-pre-wrap text-primary text-sm leading-relaxed">
            {roastData.brutal_roast}
          </pre>
        );
      case "feedback":
        return (
          <pre className="whitespace-pre-wrap text-primary text-sm leading-relaxed">
            {roastData.honest_feedback}
          </pre>
        );
      case "competitors":
        return renderCompetitorCheck();
      case "tips":
        return renderSurvivalTips();
      case "rewrite":
        return (
          <pre className="whitespace-pre-wrap text-primary text-sm leading-relaxed">
            {roastData.pitch_rewrite}
          </pre>
        );
      default:
        return null;
    }
  };


  return (
    <PageLayout>
      <section className="section-container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get Your Startup Roasted 🔥
          </h1>
          <p className="text-xl text-muted-foreground">
            Fill in the details. Brace for impact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Panel */}
          <BrutalCard>
            <BrutalCardHeader>
              <BrutalCardTitle className="flex items-center gap-2">
                <Flame className="h-6 w-6" />
                Your Startup Details
              </BrutalCardTitle>
            </BrutalCardHeader>
            <BrutalCardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-bold mb-2">Startup Name</label>
                  <BrutalInput
                    placeholder="e.g., UberForDogs"
                    value={formData.startupName}
                    onChange={(e) =>
                      setFormData({ ...formData, startupName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2">
                    Idea Description
                  </label>
                  <BrutalTextarea
                    placeholder="Describe your billion-dollar idea..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2">Target Users</label>
                  <BrutalInput
                    placeholder="e.g., Busy professionals aged 25-40"
                    value={formData.targetUsers}
                    onChange={(e) =>
                      setFormData({ ...formData, targetUsers: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2">Budget</label>
                  <BrutalInput
                    placeholder="e.g., $10,000"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block font-bold mb-4">Roast Level</label>
                  <div className="grid grid-cols-3 gap-4">
                    {roastLevels.map((level) => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, roastLevel: level.id })
                        }
                        className={`p-4 border-4 border-foreground text-center transition-transform hover:translate-x-1 hover:translate-y-1 ${
                          formData.roastLevel === level.id
                            ? "bg-primary"
                            : "bg-background"
                        }`}
                      >
                        <span className="text-2xl block mb-1">
                          {level.emoji}
                        </span>
                        <span className="font-bold text-sm">{level.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <BrutalButton type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "ROASTING..." : "ROAST ME 😈"}
                </BrutalButton>
                {error && (
                  <div className="bg-destructive/10 border-4 border-destructive p-4 text-destructive font-bold">
                    {error}
                  </div>
                )}
              </form>
            </BrutalCardContent>
          </BrutalCard>

          {/* Output Panel */}
          <BrutalCard className="bg-muted">
            <BrutalCardHeader>
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 border-4 border-foreground font-bold text-sm transition-transform ${
                        activeTab === tab.id
                          ? "bg-primary"
                          : "bg-background hover:translate-x-0.5 hover:translate-y-0.5"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </BrutalCardHeader>
            <BrutalCardContent>
              <div className="terminal-box min-h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <div className="text-center">
                      <Flame className="h-16 w-16 mx-auto mb-4 opacity-50 animate-pulse" />
                      <p className="font-bold">Generating your roast...</p>
                      <p className="text-sm mt-2">This may take a moment</p>
                    </div>
                  </div>
                ) : roastData ? (
                  renderContent()
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <div className="text-center">
                      <Skull className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="font-bold">Your roast will appear here...</p>
                      <p className="text-sm mt-2">Fill in the form and submit to get roasted</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
                <BrutalButton variant="outline" size="sm" disabled={!roastData}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Generate Meme
                </BrutalButton>
                <BrutalButton variant="outline" size="sm" disabled={!roastData}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </BrutalButton>
                <BrutalButton variant="outline" size="sm" disabled={!roastData}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </BrutalButton>
              </div>

              {roastData && (
                <div className="mt-6 pt-6 border-t-4 border-foreground">
                  <BrutalButton
                    className="w-full"
                    onClick={() =>
                      navigate("/result", { state: { roast: roastData } })
                    }
                  >
                    View Analysis Dashboard
                  </BrutalButton>
                </div>
              )}
            </BrutalCardContent>
          </BrutalCard>
        </div>
      </section>
    </PageLayout>
  );
}
