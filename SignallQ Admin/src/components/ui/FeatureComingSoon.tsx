import React from "react";
import { Construction } from "lucide-react";

interface FeatureComingSoonProps {
  feature: string;
  reason?: string;
  compact?: boolean;
}

export const FeatureComingSoon: React.FC<FeatureComingSoonProps> = ({
  feature,
  reason,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 py-3 px-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
        <Construction className="w-4 h-4 text-zinc-600 shrink-0" />
        <span className="text-xs text-zinc-500">{feature} — Em Implementação</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 rounded-xl border border-zinc-800 bg-zinc-900/40">
      <Construction className="w-8 h-8 text-zinc-600" />
      <span className="text-sm font-medium text-zinc-400">Em Implementação</span>
      {reason && (
        <span className="text-xs text-zinc-600 text-center max-w-xs">{reason}</span>
      )}
    </div>
  );
};
