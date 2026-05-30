"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  burnoutScore,
  stressTrend,
  sleepData,
  recommendations,
  history,
  radarData,
  habitMix,
  insights,
} from "@/lib/mockData";
import {
  ArrowUpRight,
  Moon,
  Smartphone,
  Footprints,
  Quote,
  Sparkles,
  Brain,
  ArrowRight,
  Target,
  Heart,
} from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { ScoreRing } from "@/components/visual/ScoreRing";

// ─── Shared ──────────────────────────────────────────────────────────────────

const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
};

const COLORS = [
  "var(--primary)",
  "var(--primary-soft)",
  "var(--mint)",
  "var(--warning)",
  "var(--primary-light)",
];

// ─── Small components ─────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-border bg-surface p-6 shadow-soft ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      {icon && (
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-light text-primary">
          {icon}
        </span>
      )}
      {children}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  delta,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  tone?: "good" | "bad" | "neutral";
}) {
  const color =
    tone === "good" ? "text-success" : tone === "bad" ? "text-danger" : "text-muted-foreground";
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-light text-primary">
          {icon}
        </span>
        {label}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-display text-3xl font-bold">{value}</span>
        <span className={`text-xs font-semibold ${color}`}>{delta}</span>
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
      {label}
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-surface/80 px-2.5 py-0.5 text-xs font-semibold text-foreground">
      {children}
    </span>
  );
}

function SectionDivider({ id, label }: { id: string; label: string }) {
  return (
    <div id={id} className="flex items-center gap-4 pt-6">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold">{label}</label>
        <span className="font-display text-lg font-bold tabular-nums">
          {value}
          <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>
        </span>
      </div>
      <div className="relative mt-3 h-2 rounded-full bg-primary-light">
        <div
          className="absolute inset-y-0 left-0 rounded-full gradient-primary"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-surface shadow-soft"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Segmented({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <div className="mt-2 flex gap-1.5 rounded-2xl bg-accent p-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
              value === o ? "bg-surface shadow-soft text-foreground" : "text-muted-foreground"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function PredictInsight({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur">
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}

function FocusCard({
  icon,
  title,
  value,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground">
          {icon}
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="mt-4 font-display text-2xl font-bold">{value}</div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  // Predict state
  const [sleep, setSleep] = useState(6);
  const [screen, setScreen] = useState(5);
  const [activity, setActivity] = useState("Light");
  const [workload, setWorkload] = useState("Heavy");
  const [mood, setMood] = useState("Tired");
  const [result, setResult] = useState<null | number>(null);

  // Analytics range
  const [range, setRange] = useState<"week" | "month">("week");

  const compute = () => {
    let s = 50;
    s += (7 - sleep) * 6;
    s += (screen - 4) * 4;
    s += activity === "Active" ? -10 : activity === "Light" ? 0 : 8;
    s += workload === "Heavy" ? 12 : workload === "Medium" ? 4 : -4;
    s += mood === "Energized" ? -10 : mood === "Okay" ? 0 : 12;
    setResult(Math.max(8, Math.min(94, Math.round(s))));
  };

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">

        {/* ══════════ SECTION: TODAY'S OVERVIEW ══════════ */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Good evening, Maya</p>
            <h2 className="font-display text-3xl font-bold">Ini kondisi kamu minggu ini.</h2>
          </div>
          <div className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Updated 2 min ago
          </div>
        </div>

        {/* Score hero + AI recs */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-primary-light via-surface to-mint/40 p-6 shadow-soft lg:col-span-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Today's burnout score
                </div>
                <h3 className="mt-2 font-display text-4xl font-bold">Steady, not safe.</h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Sleep dipped 11% and screen time rose late. A 30-minute wind-down tonight could
                  lower tomorrow's risk by 18%.
                </p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
                  Open recovery plan <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
              <ScoreRing value={burnoutScore} />
            </div>
          </motion.div>

          <Card>
            <CardTitle icon={<Sparkles className="h-4 w-4" />}>AI recommendation</CardTitle>
            <ul className="mt-4 space-y-3">
              {recommendations.slice(0, 3).map((r) => (
                <li key={r.title} className="flex items-start justify-between gap-3 rounded-2xl bg-accent/60 p-3">
                  <div>
                    <div className="text-sm font-semibold">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.impact}</div>
                  </div>
                  <button className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Try
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Stat cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard icon={<Moon className="h-4 w-4" />} label="Avg sleep" value="6.7h" delta="-0.4h" />
          <StatCard icon={<Smartphone className="h-4 w-4" />} label="Screen time" value="5.2h" delta="+38m" tone="bad" />
          <StatCard icon={<Footprints className="h-4 w-4" />} label="Activity" value="4,210" delta="+12%" tone="good" />
        </div>

        {/* Stress chart + wellness ring */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <CardTitle>Stress vs focus this week</CardTitle>
              <div className="flex gap-2 text-xs">
                <Legend dot="var(--primary)" label="Focus" />
                <Legend dot="var(--danger)" label="Stress" />
              </div>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer>
                <AreaChart data={stressTrend}>
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--danger)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--danger)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="focus" stroke="var(--primary)" fill="url(#g1)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="stress" stroke="var(--danger)" fill="url(#g2)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardTitle>Wellness ring</CardTitle>
            <div className="mt-2 h-48">
              <ResponsiveContainer>
                <RadialBarChart
                  innerRadius="60%"
                  outerRadius="100%"
                  data={[{ name: "score", value: 72, fill: "var(--primary)" }]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar background={{ fill: "var(--primary-light)" }} dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="-mt-32 text-center">
              <div className="font-display text-3xl font-bold">72</div>
              <div className="text-xs text-muted-foreground">Wellness index</div>
            </div>
            <div className="mt-24 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
              <div><div className="font-semibold text-foreground">Move</div>45%</div>
              <div><div className="font-semibold text-foreground">Mind</div>78%</div>
              <div><div className="font-semibold text-foreground">Rest</div>62%</div>
            </div>
          </Card>
        </div>

        {/* Sleep + quote */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardTitle>Sleep consistency</CardTitle>
            <div className="mt-4 h-48">
              <ResponsiveContainer>
                <LineChart data={sleepData}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis domain={[4, 9]} stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="hours" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5, fill: "var(--primary)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="bg-linear-to-br from-mint/50 to-primary-light">
            <Quote className="h-6 w-6 text-primary" />
            <p className="mt-3 font-display text-lg font-semibold leading-snug">
              "Rest is not the reward for finishing — it's the strategy for starting."
            </p>
            <div className="mt-2 text-xs text-muted-foreground">Daily reframe</div>
          </Card>
        </div>

        {/* Recent activity */}
        <Card>
          <CardTitle>Recent activity</CardTitle>
          <ul className="mt-4 divide-y divide-border">
            {history.slice(0, 5).map((h) => (
              <li key={h.date} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-semibold">{h.date}</div>
                  <div className="text-xs text-muted-foreground">{h.note}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold tabular-nums">{h.score}</div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      background:
                        h.status === "Low"
                          ? "var(--mint)"
                          : h.status === "Medium"
                          ? "color-mix(in oklab, var(--warning) 25%, transparent)"
                          : "color-mix(in oklab, var(--danger) 20%, transparent)",
                      color:
                        h.status === "Low"
                          ? "var(--success)"
                          : h.status === "Medium"
                          ? "var(--warning)"
                          : "var(--danger)",
                    }}
                  >
                    {h.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* ══════════ SECTION: BURNOUT PREDICTION ══════════ */}
        <SectionDivider id="predict" label="Burnout Prediction" />

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
            <Brain className="h-3.5 w-3.5" /> 60-second check
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold">How are things, really?</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Five quick inputs. Our model returns a score, the why behind it, and a small thing you
            can do today.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Inputs */}
          <div className="space-y-5 rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <Slider label="Sleep last night" unit="hours" min={3} max={10} step={0.5} value={sleep} onChange={setSleep} />
            <Slider label="Screen time today" unit="hours" min={1} max={12} step={0.5} value={screen} onChange={setScreen} />
            <Segmented label="Activity level" value={activity} onChange={setActivity} options={["Sedentary", "Light", "Active"]} />
            <Segmented label="Assignment workload" value={workload} onChange={setWorkload} options={["Light", "Medium", "Heavy"]} />
            <Segmented label="How you feel" value={mood} onChange={setMood} options={["Tired", "Okay", "Energized"]} />
            <button
              onClick={compute}
              className="w-full rounded-2xl gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              Predict my burnout risk
            </button>
          </div>

          {/* Result */}
          <div className="rounded-3xl border border-border bg-linear-to-br from-primary-light via-surface to-mint/30 p-6 shadow-soft">
            <AnimatePresence mode="wait">
              {result === null ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <div className="grid h-20 w-20 place-items-center rounded-2xl bg-surface shadow-soft">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                    Your result, the contributing factors, and a tiny next step appear here.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-col items-center">
                    <ScoreRing value={result} size={200} />
                    <div
                      className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background:
                          result < 35
                            ? "var(--mint)"
                            : result < 60
                            ? "color-mix(in oklab, var(--warning) 25%, transparent)"
                            : "color-mix(in oklab, var(--danger) 20%, transparent)",
                        color:
                          result < 35 ? "var(--success)" : result < 60 ? "var(--warning)" : "var(--danger)",
                      }}
                    >
                      {result < 35 ? "Low risk" : result < 60 ? "Moderate risk" : "High risk"} · 92% confidence
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <PredictInsight
                      title="Sleep is the biggest lever"
                      body={`At ${sleep}h, you're below your 7h baseline. Each extra hour reduces predicted risk by ~9%.`}
                    />
                    <PredictInsight
                      title="Late screen exposure"
                      body={`${screen}h of screens — try a 30-min phone-free wind-down to lower stress hormones.`}
                    />
                    <PredictInsight
                      title="One thing tonight"
                      body="Pick a stop-time for your phone. Even 24 hours of consistency moves the score."
                    />
                  </div>
                  <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3 text-sm font-semibold text-background">
                    Add this to my recovery plan <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ══════════ SECTION: ANALYTICS ══════════ */}
        <SectionDivider id="analytics" label="Analytics" />

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-bold">Patterns under the surface.</h2>
            <p className="mt-1 text-sm text-muted-foreground">What your week is actually telling us.</p>
          </div>
          <div className="flex gap-1 rounded-full bg-accent p-1">
            {(["week", "month"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
                  range === r ? "bg-surface shadow-soft" : "text-muted-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Burnout vs focus + AI insight */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft lg:col-span-2">
            <div className="text-sm font-semibold">Burnout vs focus over time</div>
            <div className="mt-4 h-72">
              <ResponsiveContainer>
                <LineChart data={stressTrend}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="stress" stroke="var(--danger)" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="focus" stroke="var(--primary)" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-linear-to-br from-primary-light to-mint/40 p-6 shadow-soft">
            <div className="text-xs font-medium uppercase tracking-widest text-primary">AI insight</div>
            <h3 className="mt-2 font-display text-xl font-bold leading-snug">Wednesdays carry the load.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Stress peaks mid-week, then sleep recovers it. Front-loading deep work to Mon/Tue could
              cut Wednesday spikes by ~22%.
            </p>
            <div className="mt-4 flex gap-2 text-xs">
              <Pill>Pattern</Pill>
              <Pill>Confidence 88%</Pill>
            </div>
          </div>
        </div>

        {/* Radar + pie + heatmap */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <div className="text-sm font-semibold">Wellness radar</div>
            <div className="mt-2 h-64">
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Radar dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <div className="text-sm font-semibold">Time mix</div>
            <div className="mt-2 h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={habitMix} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={3}>
                    {habitMix.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {habitMix.map((h, i) => (
                <div key={h.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{h.name}</span>
                  <span className="ml-auto font-semibold">{h.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <div className="text-sm font-semibold">Heatmap · last 4 weeks</div>
            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }).map((_, i) => {
                const v = Math.round(20 + ((i * 37 + 13) % 70));
                return (
                  <div
                    key={i}
                    title={`Day ${i + 1}: ${v}`}
                    className="aspect-square rounded-md"
                    style={{
                      background: `color-mix(in oklab, var(--primary) ${v}%, var(--primary-light))`,
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Less</span>
              <span>More burnout</span>
            </div>
          </div>
        </div>

        {/* Triggers */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
          <div className="text-sm font-semibold">Triggers that affect you most</div>
          <div className="mt-4 space-y-3">
            {[
              { label: "Late screen time", weight: 78 },
              { label: "Sleep < 6h", weight: 64 },
              { label: "Skipped meals", weight: 41 },
              { label: "No outdoor time", weight: 33 },
              { label: "Caffeine after 4pm", weight: 22 },
            ].map((t) => (
              <div key={t.label}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{t.label}</span>
                  <span className="text-muted-foreground tabular-nums">{t.weight}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-primary-light">
                  <div className="h-full rounded-full gradient-primary" style={{ width: `${t.weight}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ SECTION: AI INSIGHTS ══════════ */}
        <SectionDivider id="insights" label="AI Insights" />

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-primary-light via-surface to-mint/40 p-8 shadow-soft">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary opacity-10 blur-3xl animate-blob" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface/80 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Updated this morning
            </div>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight">
              You're carrying more than you think — but the pattern is fixable.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Based on the last 21 days, your model has high confidence in three behavior loops. Each
              has a small lever you can pull this week.
            </p>
          </div>
        </div>

        {/* Insight cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {insights.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-soft transition hover:shadow-float"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary">
                {item.tag}
              </div>
              <h3 className="mt-3 font-display text-lg font-bold leading-snug">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              <button className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Dive in <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Focus cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          <FocusCard
            icon={<Brain className="h-5 w-5" />}
            title="Focus analysis"
            value="6.2 / 10"
            body="You hit deep work in 3-of-5 sessions this week — best on Tuesday mornings."
          />
          <FocusCard
            icon={<Target className="h-5 w-5" />}
            title="Productivity balance"
            value="On track"
            body="Effort allocation looks healthy: 64% study, 18% rest, 18% social."
          />
          <FocusCard
            icon={<Heart className="h-5 w-5" />}
            title="Emotional pattern"
            value="Calm-anxious cycle"
            body="Mood drops 4–6pm before evening study blocks. A short walk between can break it."
          />
        </div>

        {/* Suggested actions */}
        <Card>
          <div className="text-sm font-semibold">Suggested actions for this week</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              "Cap caffeine at 2pm Mon–Fri",
              "Block 9–10pm as phone-free wind-down",
              "Two 25-min focus blocks before lunch",
              "One in-person social activity",
            ].map((a) => (
              <label
                key={a}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-accent/40 p-4 hover:bg-accent"
              >
                <input type="checkbox" className="h-4 w-4 accent-primary" />
                <span className="text-sm font-medium">{a}</span>
              </label>
            ))}
          </div>
        </Card>

        <div className="h-8" />
      </div>
    </>
  );
}
