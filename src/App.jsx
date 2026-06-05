import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const formatCurrency = (val) =>
  val >= 1_000_000
    ? `$${(val / 1_000_000).toFixed(2)}M`
    : `$${Math.round(val).toLocaleString()}`;

export default function CompoundCalculator() {
  const [inputs, setInputs] = useState({
    age: 25,
    rate: 7,
    initial: 10000,
    annual: 5000,
    years: 30,
  });
  const [data, setData] = useState([]);

  const set = (k) => (e) => setInputs((p) => ({ ...p, [k]: Number(e.target.value) }));

  useEffect(() => {
    const pts = [];
    let balance = inputs.initial;
    for (let y = 0; y <= inputs.years; y++) {
      const contributions = inputs.initial + inputs.annual * y;
      pts.push({
        age: inputs.age + y,
        year: y,
        total: Math.round(balance),
        contributions: Math.round(contributions),
        growth: Math.round(balance - contributions),
      });
      balance = (balance + inputs.annual) * (1 + inputs.rate / 100);
    }
    setData(pts);
  }, [inputs]);

  const final = data[data.length - 1] || {};
  const totalContributed = inputs.initial + inputs.annual * inputs.years;
  const growthEarned = (final.total || 0) - totalContributed;

  const fields = [
    { key: "age", label: "Current Age", min: 1, max: 80, step: 1, suffix: "yrs" },
    { key: "rate", label: "Annual Return", min: 0.1, max: 30, step: 0.1, suffix: "%" },
    { key: "initial", label: "Initial Amount", min: 0, max: 1000000, step: 500, suffix: "$", prefix: true },
    { key: "annual", label: "Annual Contribution", min: 0, max: 100000, step: 500, suffix: "$", prefix: true },
    { key: "years", label: "Years Invested", min: 1, max: 60, step: 1, suffix: "yrs" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: "#e8e0d0",
      padding: "2rem 1rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        input[type=range] { -webkit-appearance: none; width: 100%; height: 3px; background: #2a2a3a; border-radius: 2px; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #c8f064; cursor: pointer; box-shadow: 0 0 10px #c8f06466; }
        input[type=number] { background: #13131f; border: 1px solid #2a2a3a; color: #e8e0d0; font-family: inherit; font-size: 0.9rem; padding: 0.4rem 0.6rem; border-radius: 6px; width: 90px; text-align: right; outline: none; }
        input[type=number]:focus { border-color: #c8f064; }
        .stat-card { background: #13131f; border: 1px solid #1e1e2e; border-radius: 12px; padding: 1.2rem; flex: 1; min-width: 130px; }
        .tooltip-box { background: #13131f; border: 1px solid #2a2a3a; border-radius: 8px; padding: 0.8rem 1rem; font-family: 'DM Mono', monospace; font-size: 0.75rem; }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ color: "#c8f064", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 0.4rem" }}>Wealth Simulator</p>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
            Compound<br /><span style={{ color: "#c8f064" }}>Calculator</span>
          </h1>
        </div>

        <div style={{ background: "#13131f", border: "1px solid #1e1e2e", borderRadius: 16, padding: "1.5rem", marginBottom: "1.5rem" }}>
          {fields.map(({ key, label, min, max, step, suffix, prefix }) => (
            <div key={key} style={{ marginBottom: "1.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>{label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  {prefix && <span style={{ color: "#c8f064", fontSize: "0.8rem" }}>$</span>}
                  <input
                    type="number"
                    value={inputs[key]}
                    min={min} max={max} step={step}
                    onChange={set(key)}
                  />
                  {!prefix && <span style={{ color: "#666", fontSize: "0.8rem" }}>{suffix}</span>}
                </div>
              </div>
              <input
                type="range"
                min={min} max={max} step={step}
                value={inputs[key]}
                onChange={set(key)}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "#444", marginTop: "0.2rem" }}>
                <span>{prefix ? `$${min.toLocaleString()}` : `${min}${suffix}`}</span>
                <span>{prefix ? `$${max.toLocaleString()}` : `${max}${suffix}`}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <p style={{ margin: "0 0 0.3rem", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666" }}>Final Balance</p>
            <p style={{ margin: 0, fontSize: "1.4rem", fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#c8f064" }}>{formatCurrency(final.total || 0)}</p>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.65rem", color: "#555" }}>at age {inputs.age + inputs.years}</p>
          </div>
          <div className="stat-card">
            <p style={{ margin: "0 0 0.3rem", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666" }}>Total Contributed</p>
            <p style={{ margin: 0, fontSize: "1.4rem", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>{formatCurrency(totalContributed)}</p>
          </div>
          <div className="stat-card">
            <p style={{ margin: "0 0 0.3rem", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666" }}>Interest Earned</p>
            <p style={{ margin: 0, fontSize: "1.4rem", fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#64c8f0" }}>{formatCurrency(growthEarned)}</p>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.65rem", color: "#555" }}>
              {totalContributed > 0 ? `${Math.round((growthEarned / (final.total || 1)) * 100)}% of total` : "—"}
            </p>
          </div>
        </div>

        <div style={{ background: "#13131f", border: "1px solid #1e1e2e", borderRadius: 16, padding: "1.5rem" }}>
          <p style={{ margin: "0 0 1.2rem", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#666" }}>Growth Over Time</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8f064" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#c8f064" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64c8f0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#64c8f0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="age" tick={{ fill: "#555", fontSize: 10, fontFamily: "DM Mono" }} tickLine={false} axisLine={false} label={{ value: "Age", position: "insideBottomRight", offset: -5, fill: "#444", fontSize: 10 }} />
              <YAxis tick={{ fill: "#555", fontSize: 10, fontFamily: "DM Mono" }} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1_000_000 ? `$${(v/1_000_000).toFixed(1)}M` : `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return (
                    <div className="tooltip-box">
                      <p style={{ margin: "0 0 0.4rem", color: "#c8f064", fontWeight: 500 }}>Age {d.age} · Year {d.year}</p>
                      <p style={{ margin: "0.1rem 0", color: "#e8e0d0" }}>Balance: {formatCurrency(d.total)}</p>
                      <p style={{ margin: "0.1rem 0", color: "#64c8f0" }}>Contributed: {formatCurrency(d.contributions)}</p>
                      <p style={{ margin: "0.1rem 0", color: "#c8f064" }}>Growth: {formatCurrency(d.growth)}</p>
                    </div>
                  );
                }}
              />
              <Area type="monotone" dataKey="contributions" stroke="#64c8f0" strokeWidth={1.5} fill="url(#gContrib)" dot={false} name="Contributions" />
              <Area type="monotone" dataKey="total" stroke="#c8f064" strokeWidth={2} fill="url(#gGrowth)" dot={false} name="Total" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.8rem", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.65rem", color: "#666" }}>
              <div style={{ width: 20, height: 2, background: "#c8f064", borderRadius: 1 }} /> Total Balance
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.65rem", color: "#666" }}>
              <div style={{ width: 20, height: 2, background: "#64c8f0", borderRadius: 1 }} /> Contributions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
