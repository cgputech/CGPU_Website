"use client";

import { useState } from "react";

interface ChartDataPoint {
  label: string;
  value: number; // e.g. average package in LPA, or student count
  percentage?: number; // e.g. placement percentage
}

interface InteractiveChartProps {
  type: "bar" | "donut" | "line";
  data: ChartDataPoint[];
  yLabel?: string;
  xLabel?: string;
}

export default function InteractiveChart({ type, data, yLabel = "", xLabel = "" }: InteractiveChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-border-custom rounded-lg bg-card">
        <span className="text-sm text-text-secondary">No data available</span>
      </div>
    );
  }

  // --- Render Bar Chart ---
  if (type === "bar") {
    const maxValue = Math.max(...data.map((d) => d.value), 1);
    // Add extra padding to max value to prevent bars touching the top
    const scaleMax = maxValue * 1.15;

    return (
      <div className="w-full bg-card p-6 rounded-xl border border-border-custom shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {/* Y Axis Label */}
        {yLabel && (
          <div className="text-xs font-semibold text-text-secondary mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-primary-red mr-2"></span>
            {yLabel}
          </div>
        )}

        {/* Chart Canvas Area */}
        <div className="relative h-64 flex items-end justify-between gap-4 pt-6 border-b border-border-custom px-2">
          {data.map((item, idx) => {
            const heightPercent = (item.value / scaleMax) * 100;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                <div
                  className={`absolute z-10 bottom-[calc(${heightPercent}%+12px)] bg-slate-900 text-white text-[11px] font-semibold py-1.5 px-2.5 rounded shadow-lg transition-all duration-200 pointer-events-none whitespace-nowrap ${
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                  style={{ bottom: `calc(${heightPercent}% + 8px)` }}
                >
                  <span className="block text-slate-400 font-normal text-[9px] uppercase tracking-wider">{item.label}</span>
                  <span>{item.value.toFixed(1)} {yLabel.includes("Package") ? "LPA" : "Offers"}</span>
                  {item.percentage !== undefined && (
                    <span className="block text-[10px] text-emerald-400 mt-0.5">
                      {item.percentage}% Placed
                    </span>
                  )}
                </div>

                {/* Bar */}
                <div
                  className={`w-full max-w-[48px] rounded-t-md transition-all duration-300 ${
                    isHovered
                      ? "bg-primary-red shadow-[0_4px_12px_rgba(211,47,47,0.15)]"
                      : "bg-red-700/80 hover:bg-primary-red"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Subtle bar design texture */}
                  <div className="w-full h-full bg-linear-to-b from-white/10 to-transparent rounded-t-md" />
                </div>
              </div>
            );
          })}
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between gap-4 mt-3 px-2">
          {data.map((item, idx) => (

            <div
              key={item.label}
              className={`flex-1 text-center text-[10px] sm:text-xs font-medium truncate transition-colors duration-200 ${
                hoveredIndex === idx ? "text-primary-red font-semibold" : "text-text-secondary"
              }`}
              title={item.label}
            >
              {item.label.split(" (")[0]} {/* truncate brackets for compact labels */}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Render Donut Chart ---
  if (type === "donut") {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let accumulatedAngle = 0;

    return (
      <div className="w-full bg-card p-6 rounded-xl border border-border-custom shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-around gap-6">
        
        {/* SVG Circle Area */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background base circle */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#F3F4F6"
              strokeWidth="10"
            />
            {data.map((item, idx) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -accumulatedAngle;
              accumulatedAngle += percentage;

              // Use standard Red tones
              const colors = [
                "#D32F2F", // Primary Academic Red
                "#F44336", // Soft Red
                "#E57373", // Light Red
                "#EF5350", // Muted red-rose
                "#FFCDD2", // Extra light accent red
              ];
              const color = colors[idx % colors.length];
              const isHovered = hoveredIndex === idx;

              return (
                <circle
                  key={item.label}
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke={color}
                  strokeWidth={isHovered ? "12" : "10"}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  pathLength="100"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hoveredIndex !== null ? (
              <>
                <span className="text-[10px] uppercase tracking-wider text-text-secondary">
                  {data[hoveredIndex].label}
                </span>
                <span className="text-xl font-extrabold text-primary-red">
                  {data[hoveredIndex].value}
                </span>
                <span className="text-[9px] text-text-secondary">
                  ({((data[hoveredIndex].value / total) * 100).toFixed(1)}%)
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] uppercase tracking-wider text-text-secondary">
                  Total Recruited
                </span>
                <span className="text-2xl font-extrabold text-text-primary">
                  {total}
                </span>
                <span className="text-[10px] text-text-secondary">
                  Students Placed
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 max-w-xs w-full">
          {data.map((item, idx) => {
            const colors = [
              "#D32F2F",
              "#F44336",
              "#E57373",
              "#EF5350",
              "#FFCDD2",
            ];
            const color = colors[idx % colors.length];
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.label}
                className={`flex items-center justify-between p-2 rounded-md transition-colors duration-200 cursor-pointer ${
                  isHovered ? "bg-soft-red" : "hover:bg-slate-50"
                }`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-semibold text-text-primary truncate">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs text-text-secondary font-medium pl-2">
                  {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>

      </div>
    );
  }

  return null;
}
