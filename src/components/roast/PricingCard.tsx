import { RetroUICard, RetroUICardContent, RetroUICardHeader, RetroUICardTitle } from "@/components/retroui/card";
import { RetroUIButton } from "@/components/retroui/button";
import { Check, X } from "lucide-react";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  isPopular?: boolean;
  onSelect?: () => void;
}

export function PricingCard({
  name,
  price,
  period = "/month",
  description,
  features,
  buttonText,
  isPopular = false,
  onSelect,
}: PricingCardProps) {
  return (
    <RetroUICard
      className={`relative ${
        isPopular ? "bg-primary" : "bg-background"
      }`}
      rotate={isPopular ? "1" : "-1"}
    >
      {isPopular && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-3 sm:px-4 py-1 border-2 border-foreground font-bold text-xs sm:text-sm whitespace-nowrap">
          MOST POPULAR 💀
        </div>
      )}

      <RetroUICardHeader>
        <RetroUICardTitle className="text-2xl sm:text-3xl">{name}</RetroUICardTitle>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">{description}</p>
      </RetroUICardHeader>

      <RetroUICardContent>
        <div className="mb-4 sm:mb-6">
          <span className="text-4xl sm:text-5xl font-bold">{price}</span>
          {price !== "Free" && (
            <span className="text-sm sm:text-base text-muted-foreground">{period}</span>
          )}
        </div>

        <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 sm:gap-3">
              {feature.included ? (
                <Check className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-muted-foreground" />
              )}
              <span
                className={`text-xs sm:text-sm ${
                  feature.included ? "" : "text-muted-foreground line-through"
                }`}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <RetroUIButton
          className="w-full"
          variant={isPopular ? "outline" : "default"}
          size="lg"
          onClick={onSelect}
        >
          {buttonText}
        </RetroUIButton>
      </RetroUICardContent>
    </RetroUICard>
  );
}
