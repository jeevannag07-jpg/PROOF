"use client";

import React from "react";

interface CapabilityItem {
  skill: string;
  score: number;
  confidence: string;
}

interface CapabilityRadarProps {
  capabilities: CapabilityItem[];
  size?: number;
}

export default function CapabilityRadar({ capabilities, size = 320 }: CapabilityRadarProps) {
  if (!capabilities || capabilities.length === 0) return null;

  const center = size / 2;
  const radius = (size / 2) * 0.75;
  const total = capabilities.length;

  // Calculate points on the polygon
  const getCoordinates = (index: number, score: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (score / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build SVG polygon points
  const points = capabilities
    .map((cap, i) => {
      const { x, y } = getCoordinates(i, cap.score);
      return `${x},${y}`;
    })
    .join(" ");

  // Concentric background rings (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid Rings */}
        {levels.map((level, idx) => {
          const levelPoints = capabilities
            .map((_, i) => {
              const { x, y } = getCoordinates(i, level * 100);
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <polygon
              key={idx}
              points={levelPoints}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis lines from center to outer vertex */}
        {capabilities.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={points}
          fill="rgba(16, 185, 129, 0.2)"
          stroke="#10b981"
          strokeWidth="2"
          className="transition-all duration-700 ease-out"
        />

        {/* Data Vertex Dots & Score Labels */}
        {capabilities.map((cap, i) => {
          const { x, y } = getCoordinates(i, cap.score);
          const outer = getCoordinates(i, 118);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#10b981"
                stroke="#07080a"
                strokeWidth="2"
                className="shadow-[0_0_8px_#10b981]"
              />
              <text
                x={outer.x}
                y={outer.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-mono fill-zinc-300 font-bold"
              >
                {cap.skill}
              </text>
              <text
                x={outer.x}
                y={outer.y + 11}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[9px] font-mono fill-emerald-400 font-semibold"
              >
                {cap.score}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
