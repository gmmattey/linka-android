import React from "react";
import { Severity } from "../../types/diagnostics";

interface StatusBadgeProps {
  status: Severity | "stable" | "beta" | "deprecated" | "halted" | "success" | "cached" | "failed" | string;
  customLabel?: string;
  className?: string;
  id?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, customLabel, className = "", id }) => {
  let style: React.CSSProperties = {
    backgroundColor: "color-mix(in srgb, var(--sq-text-tertiary) 10%, transparent)",
    borderColor: "color-mix(in srgb, var(--sq-text-tertiary) 20%, transparent)",
    color: "var(--sq-text-secondary)",
  };
  let dotStyle: React.CSSProperties = { backgroundColor: "var(--sq-text-tertiary)" };
  let dotClassName = "";
  let label = customLabel || status.toString().toUpperCase();

  switch (status) {
    case "ok":
    case "stable":
    case "success":
      style = {
        backgroundColor: "color-mix(in srgb, var(--sq-success) 10%, transparent)",
        borderColor: "color-mix(in srgb, var(--sq-success) 20%, transparent)",
        color: "var(--sq-success)",
      };
      dotStyle = { backgroundColor: "var(--sq-success)" };
      dotClassName = "animate-pulse";
      if (!customLabel) label = status === "ok" ? "OK" : status === "stable" ? "Estável" : "Sucesso";
      break;
    case "attention":
    case "beta":
    case "cached":
      style = {
        backgroundColor: "color-mix(in srgb, var(--sq-warning) 10%, transparent)",
        borderColor: "color-mix(in srgb, var(--sq-warning) 20%, transparent)",
        color: "var(--sq-warning)",
      };
      dotStyle = { backgroundColor: "var(--sq-warning)" };
      if (!customLabel) label = status === "attention" ? "Atenção" : status === "beta" ? "Beta" : "Cached";
      break;
    case "critical":
    case "failed":
    case "error":
    case "halted":
      style = {
        backgroundColor: "color-mix(in srgb, var(--sq-error) 10%, transparent)",
        borderColor: "color-mix(in srgb, var(--sq-error) 20%, transparent)",
        color: "var(--sq-error)",
      };
      dotStyle = { backgroundColor: "var(--sq-error)" };
      if (!customLabel) label = status === "critical" ? "Crítico" : status === "failed" ? "Erro" : "Pausado";
      break;
    case "deprecated":
      style = {
        backgroundColor: "var(--sq-bg-card)",
        borderColor: "var(--sq-border)",
        color: "var(--sq-text-tertiary)",
      };
      dotStyle = { backgroundColor: "var(--sq-text-tertiary)" };
      if (!customLabel) label = "Obsoleto";
      break;
    case "info":
      style = {
        backgroundColor: "color-mix(in srgb, var(--sq-accent-blue) 10%, transparent)",
        borderColor: "color-mix(in srgb, var(--sq-accent-blue) 20%, transparent)",
        color: "var(--sq-accent-blue)",
      };
      dotStyle = { backgroundColor: "var(--sq-accent-blue)" };
      break;
  }

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border uppercase tracking-wider select-none ${className}`}
      style={style}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClassName}`} style={dotStyle} />
      {label}
    </span>
  );
};
