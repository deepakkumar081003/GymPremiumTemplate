"use client";

import { useMemo, useState } from "react";

export type ChartPoint = {
  label: string;
  value: number;
};

type ChartTheme = {
  stroke: string;
  fill: string;
  fillId: string;
  grid: string;
};

const themes: Record<"cyan" | "emerald", ChartTheme> = {
  cyan: {
    stroke: "#22d3ee",
    fill: "rgba(34, 211, 238, 0.35)",
    fillId: "cyan-area",
    grid: "rgba(148, 163, 184, 0.12)",
  },
  emerald: {
    stroke: "#34d399",
    fill: "rgba(52, 211, 153, 0.35)",
    fillId: "emerald-area",
    grid: "rgba(148, 163, 184, 0.12)",
  },
};

type AnalyticsChartsProps = {
  title: string;
  subtitle: string;
  data: ChartPoint[];
  formatValue?: (value: number) => string;
  color: "cyan" | "emerald";
  emptyMessage?: string;
};

const CHART_H = 280;
const PAD_BASE = { top: 16, right: 16, left: 48 };
const MIN_SLOT_PX = 52;

function getChartLayout(pointCount: number) {
  const plotMinWidth = Math.max(pointCount, 1) * MIN_SLOT_PX;
  const chartW = Math.max(640, PAD_BASE.left + PAD_BASE.right + plotMinWidth);
  const useRotatedLabels = pointCount > 6;
  const bottom = useRotatedLabels ? 88 : 44;
  const pad = { ...PAD_BASE, bottom };
  const labelStep = getLabelStep(pointCount, chartW - pad.left - pad.right);

  return { chartW, pad, useRotatedLabels, labelStep };
}

export function AnalyticsBarChart({
  title,
  subtitle,
  data,
  formatValue = (v) => String(v),
  color,
  emptyMessage = "No data in this period yet.",
}: AnalyticsChartsProps) {
  const theme = themes[color];
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const layout = useMemo(() => getChartLayout(data.length), [data.length]);
  const { bars, maxValue, plotH } = useMemo(
    () => computeBarLayout(data, layout.chartW, layout.pad),
    [data, layout],
  );

  const hasData = data.some((d) => d.value > 0);
  if (data.length === 0 || !hasData) {
    return <ChartShell title={title} subtitle={subtitle} empty={emptyMessage} />;
  }

  const yTicks = buildTicks(maxValue, 4);

  return (
    <ChartShell title={title} subtitle={subtitle}>
      <div className="premium-scrollbar -mx-1 overflow-x-auto px-1 pb-1">
        <svg
          viewBox={`0 0 ${layout.chartW} ${CHART_H}`}
          style={{ minWidth: `${Math.min(layout.chartW, 1200)}px` }}
          className="w-full"
          role="img"
          aria-label={`${title} bar chart`}
        >
          <defs>
            <linearGradient id={`bar-${theme.fillId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.stroke} stopOpacity="0.95" />
              <stop offset="100%" stopColor={theme.stroke} stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = layout.pad.top + plotH - (tick / maxValue) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={layout.pad.left}
                  y1={y}
                  x2={layout.chartW - layout.pad.right}
                  y2={y}
                  stroke={theme.grid}
                  strokeDasharray="4 4"
                />
                <text
                  x={layout.pad.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-500 text-[10px]"
                >
                  {formatCompact(tick, formatValue)}
                </text>
              </g>
            );
          })}

          {bars.map((bar, index) => {
            const isHover = hoverIndex === index;
            const showLabel = shouldShowXLabel(index, data.length, layout.labelStep);
            return (
              <g
                key={`${bar.label}-${index}`}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  rx={6}
                  fill={`url(#bar-${theme.fillId})`}
                  opacity={isHover ? 1 : 0.88}
                />
                {showLabel && (
                  <XAxisLabel
                    x={bar.x + bar.width / 2}
                    y={CHART_H - layout.pad.bottom + 12}
                    label={formatAxisLabel(bar.label)}
                    rotated={layout.useRotatedLabels}
                  />
                )}
              </g>
            );
          })}

          {hoverIndex !== null && bars[hoverIndex] && (
            <ChartTooltip
              chartW={layout.chartW}
              x={bars[hoverIndex].x + bars[hoverIndex].width / 2}
              y={bars[hoverIndex].y}
              title={data[hoverIndex].label}
              value={formatValue(data[hoverIndex].value)}
            />
          )}
        </svg>
      </div>
    </ChartShell>
  );
}

export function AnalyticsLineChart({
  title,
  subtitle,
  data,
  formatValue = (v) => String(v),
  color,
  emptyMessage = "No data in this period yet.",
}: AnalyticsChartsProps) {
  const theme = themes[color];
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const layout = useMemo(() => getChartLayout(data.length), [data.length]);
  const { points, maxValue, plotH } = useMemo(
    () => computeLineLayout(data, layout.chartW, layout.pad),
    [data, layout],
  );

  const hasData = data.some((d) => d.value > 0);
  if (data.length === 0 || !hasData) {
    return <ChartShell title={title} subtitle={subtitle} empty={emptyMessage} />;
  }

  const yTicks = buildTicks(maxValue, 4);
  const linePath = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath = `${points[0]?.x ?? layout.pad.left},${layout.pad.top + plotH} ${linePath} ${points[points.length - 1]?.x ?? layout.pad.left},${layout.pad.top + plotH}`;

  return (
    <ChartShell title={title} subtitle={subtitle}>
      <div className="premium-scrollbar -mx-1 overflow-x-auto px-1 pb-1">
        <svg
          viewBox={`0 0 ${layout.chartW} ${CHART_H}`}
          style={{ minWidth: `${Math.min(layout.chartW, 1200)}px` }}
          className="w-full"
          role="img"
          aria-label={`${title} line chart`}
        >
          <defs>
            <linearGradient id={`area-${theme.fillId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.stroke} stopOpacity="0.45" />
              <stop offset="100%" stopColor={theme.stroke} stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = layout.pad.top + plotH - (tick / maxValue) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={layout.pad.left}
                  y1={y}
                  x2={layout.chartW - layout.pad.right}
                  y2={y}
                  stroke={theme.grid}
                  strokeDasharray="4 4"
                />
                <text
                  x={layout.pad.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-500 text-[10px]"
                >
                  {formatCompact(tick, formatValue)}
                </text>
              </g>
            );
          })}

          <polygon points={areaPath} fill={`url(#area-${theme.fillId})`} />
          <polyline
            points={linePath}
            fill="none"
            stroke={theme.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => {
            const showLabel = shouldShowXLabel(index, data.length, layout.labelStep);
            return (
              <g
                key={`${point.label}-${index}`}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoverIndex === index ? 6 : 4}
                  fill={theme.stroke}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
                {showLabel && (
                  <XAxisLabel
                    x={point.x}
                    y={CHART_H - layout.pad.bottom + 12}
                    label={formatAxisLabel(point.label)}
                    rotated={layout.useRotatedLabels}
                  />
                )}
              </g>
            );
          })}

          {hoverIndex !== null && points[hoverIndex] && (
            <ChartTooltip
              chartW={layout.chartW}
              x={points[hoverIndex].x}
              y={points[hoverIndex].y}
              title={data[hoverIndex].label}
              value={formatValue(data[hoverIndex].value)}
            />
          )}
        </svg>
      </div>
    </ChartShell>
  );
}

function ChartShell({
  title,
  subtitle,
  children,
  empty,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  empty?: string;
}) {
  return (
    <section className="premium-card overflow-hidden rounded-3xl border border-white/10">
      <div className="border-b border-white/10 bg-white/[0.02] px-6 py-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>
      <div className="p-4 md:p-6">
        {empty ? (
          <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-14 text-center text-sm text-slate-500">
            {empty}
          </p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

type ChartPad = { top: number; right: number; bottom: number; left: number };

function computeBarLayout(data: ChartPoint[], chartW: number, pad: ChartPad) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const plotW = chartW - pad.left - pad.right;
  const plotH = CHART_H - pad.top - pad.bottom;
  const slot = plotW / Math.max(data.length, 1);
  const barWidth = Math.min(slot * 0.55, 40);

  const bars = data.map((point, index) => {
    const height = (point.value / maxValue) * plotH;
    const x = pad.left + index * slot + (slot - barWidth) / 2;
    const y = pad.top + plotH - height;
    return { label: point.label, x, y, width: barWidth, height: Math.max(height, point.value > 0 ? 4 : 0) };
  });

  return { bars, maxValue, plotH };
}

function computeLineLayout(data: ChartPoint[], chartW: number, pad: ChartPad) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const plotW = chartW - pad.left - pad.right;
  const plotH = CHART_H - pad.top - pad.bottom;
  const step = data.length > 1 ? plotW / (data.length - 1) : 0;

  const points = data.map((point, index) => {
    const x = pad.left + index * step;
    const y = pad.top + plotH - (point.value / maxValue) * plotH;
    return { label: point.label, x, y };
  });

  return { points, maxValue, plotH };
}

function getLabelStep(pointCount: number, plotWidth: number): number {
  const minGap = 64;
  const maxVisible = Math.max(2, Math.floor(plotWidth / minGap));
  if (pointCount <= maxVisible) return 1;
  return Math.ceil(pointCount / maxVisible);
}

function shouldShowXLabel(index: number, count: number, step: number): boolean {
  if (count <= 1) return true;
  if (index === 0 || index === count - 1) return true;
  return index % step === 0;
}

/** Shorter tick text on the axis (full label on hover). */
function formatAxisLabel(label: string): string {
  const parts = label.trim().split(/\s+/);
  if (parts.length >= 2 && parts[0].length <= 4) {
    return `${parts[0]} ${parts[1]}`;
  }
  return label.length > 12 ? `${label.slice(0, 11)}…` : label;
}

function XAxisLabel({
  x,
  y,
  label,
  rotated,
}: {
  x: number;
  y: number;
  label: string;
  rotated: boolean;
}) {
  if (rotated) {
    return (
      <text
        x={x}
        y={y}
        transform={`rotate(-42, ${x}, ${y})`}
        textAnchor="end"
        className="fill-slate-500 text-[10px]"
      >
        {label}
      </text>
    );
  }

  return (
    <text x={x} y={y + 10} textAnchor="middle" className="fill-slate-500 text-[10px]">
      {label}
    </text>
  );
}

function ChartTooltip({
  chartW,
  x,
  y,
  title,
  value,
}: {
  chartW: number;
  x: number;
  y: number;
  title: string;
  value: string;
}) {
  const boxW = 140;
  const boxH = 40;
  const left = Math.min(Math.max(x - boxW / 2, 8), chartW - boxW - 8);

  return (
    <g>
      <rect
        x={left}
        y={Math.max(y - 52, 6)}
        width={boxW}
        height={boxH}
        rx={8}
        fill="rgba(15, 23, 42, 0.96)"
        stroke="rgba(34, 211, 238, 0.35)"
      />
      <text
        x={left + boxW / 2}
        y={Math.max(y - 36, 20)}
        textAnchor="middle"
        className="fill-slate-400 text-[9px]"
      >
        {title.length > 22 ? `${title.slice(0, 21)}…` : title}
      </text>
      <text
        x={left + boxW / 2}
        y={Math.max(y - 22, 34)}
        textAnchor="middle"
        className="fill-cyan-100 text-[11px] font-semibold"
      >
        {value}
      </text>
    </g>
  );
}

function buildTicks(max: number, count: number): number[] {
  const step = max / count;
  return Array.from({ length: count + 1 }, (_, i) => Math.round(step * i));
}

function formatCompact(value: number, format: (v: number) => string): string {
  if (value >= 100000) return `${Math.round(value / 100000)}L`;
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  const formatted = format(value);
  return formatted.length > 8 ? formatted.slice(0, 8) : formatted;
}

/** Side-by-side mini comparison bars */
export function AnalyticsComparisonChart({
  signups,
  revenue,
  formatRevenue,
}: {
  signups: ChartPoint[];
  revenue: ChartPoint[];
  formatRevenue: (n: number) => string;
}) {
  const totalSignups = signups.reduce((s, p) => s + p.value, 0);
  const totalRevenue = revenue.reduce((s, p) => s + p.value, 0);
  const max = Math.max(totalSignups, totalRevenue, 1);

  return (
    <section className="premium-card rounded-3xl border border-white/10 p-6">
      <h2 className="text-lg font-semibold">Period totals</h2>
      <p className="mt-1 text-sm text-slate-400">Share of activity in selected range</p>
      <div className="mt-6 space-y-5">
        <ComparisonRow
          label="New signups"
          value={String(totalSignups)}
          percent={(totalSignups / max) * 100}
          gradient="from-cyan-400 to-cyan-600"
        />
        <ComparisonRow
          label="Revenue collected"
          value={formatRevenue(totalRevenue)}
          percent={(totalRevenue / max) * 100}
          gradient="from-emerald-400 to-emerald-600"
        />
      </div>
    </section>
  );
}

function ComparisonRow({
  label,
  value,
  percent,
  gradient,
}: {
  label: string;
  value: string;
  percent: number;
  gradient: string;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{ width: `${Math.max(percent, 4)}%` }}
        />
      </div>
    </div>
  );
}
