"use client";
import { useState, useEffect } from "react";

export default function PropCopyAI() {
  const [form, setForm] = useState({
    address: "", price: "", beds: "3", baths: "2",
    sqft: "", style: "Modern", features: "", tone: "professional"
  });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [activeTab, setActiveTab] = useState("mls");
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lora:ital,wght@0,500;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const tones = ["professional", "luxury", "friendly", "investment"];
  const styles = ["Modern", "Victorian", "Ranch", "Colonial", "Contemporary", "Craftsman", "Cape Cod", "Tudor"];
  const tabs = [
    { key: "mls", label: "MLS Listing", icon: "🏠" },
    { key: "instagram", label: "Instagram", icon: "📸" },
    { key: "facebook", label: "Facebook", icon: "📘" },
    { key: "twitter", label: "X / Twitter", icon: "✕" },
    { key: "email", label: "Buyer Email", icon: "✉️" }
  ];

  const generate = async () => {
    if (!form.address || !form.beds || !form.baths) {
      setError("Please enter at least the address, beds, and baths to continue.");
      return;
    }
    setError(""); setLoading(true); setOutput(null);
    const prompt = `You are a top real estate copywriter in the USA. Generate marketing content for this property:
Address: ${form.address}
Price: ${form.price ? "$" + Number(form.price).toLocaleString() : "Price upon request"}
Bedrooms: ${form.beds} | Bathrooms: ${form.baths}${form.sqft ? ` | ${Number(form.sqft).toLocaleString()} sq ft` : ""}
Architectural style: ${form.style}
Target buyer tone: ${form.tone}
Highlighted features: ${form.features || "Not specified"}
Respond ONLY with a valid JSON object — no markdown, no backticks, no extra text:
{"mls": "150-200 word compelling MLS description","instagram": "Instagram caption with emojis and 5-8 hashtags","facebook": "Conversational Facebook post 100-130 words","twitter": "Punchy tweet under 240 characters with 2-3 hashtags","email": "First line: Subject: [subject]. Then blank line. Then 130-150 word email."}`;
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1600, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      const text = (data.content || []).map((b: any) =>
      const clean = text.replace(/```json|```/g, "").trim();
      setOutput(JSON.parse(clean));
      setActiveTab("mls");
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(""), 2200);
  };

  const currentOutput = output?.[activeTab];
  const wordCount = currentOutput ? currentOutput.split(/\s+/).filter(Boolean).length : 0;
  const inputCss = { width: "100%", boxSizing: "border-box", background: "#fff", border: "1px solid #E2E5EA", borderRadius: 8, color: "#1A1D23", fontSize: 14, padding: "10px 12px", outline: "none", fontFamily: "'Inter', sans-serif" };

  return (
    <div style={{ background: "#F5F7FA", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#1A1D23" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}} input:focus,textarea:focus{border-color:#2C5F8A!important;box-shadow:0 0 0 3px rgba(44,95,138,0.1)} input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none} input::placeholder,textarea::placeholder{color:#B0B7C3}`}</style>
      <div style={{ background: "#fff", borderBottom: "1px solid #E8EBF0", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#2C5F8A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 16 }}>⌂</span></div>
          <div><span style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500 }}>PropCopy</span><span style={{ fontFamily: "'Lora', serif", fontSize: 17, fontStyle: "italic", color: "#2C5F8A" }}> AI</span></div>
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", background: "#F0F4F8", border: "1px solid #DDE3EC", borderRadius: 20, padding: "3px 12px" }}>Real estate content generator</div>
      </div>
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ flex: "0 0 400px", background: "#fff", borderRight: "1px solid #E8EBF0", padding: "28px 24px", overflowY: "auto" }}>
          <div style={{ marginBottom: 24 }}><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Property details</div><div style={{ fontSize: 13, color: "#6B7280" }}>Fill in what you have — the more detail, the better the copy.</div></div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 5 }}>Property address <span style={{ color: "#E05555" }}>*</span></label>
            <input style={inputCss} placeholder="123 Maple St, Austin, TX 78701" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[{ key: "beds", label: "Beds *", placeholder: "3" }, { key: "baths", label: "Baths *", placeholder: "2" }, { key: "sqft", label: "Sq ft", placeholder: "1,850" }].map(f => (
              <div key={f.key}><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 5 }}>{f.label}</label><input style={inputCss} type="number" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} /></div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 5 }}>Listing price ($)</label>
            <input style={inputCss} type="number" placeholder="450,000" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 8 }}>Architectural style</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {styles.map(s => <button key={s} onClick={() => setForm({ ...form, style: s })} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: `1px solid ${form.style === s ? "#2C5F8A" : "#DDE3EC"}`, background: form.style === s ? "#EBF2F9" : "#fff", color: form.style === s ? "#2C5F8A" : "#6B7280", fontFamily: "'Inter', sans-serif" }}>{s}</button>)}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 5 }}>Key features</label>
            <textarea placeholder="Renovated kitchen, heated pool, mountain views..." value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} rows={3} style={{ ...inputCss, resize: "vertical", lineHeight: 1.6 }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 8 }}>Tone</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {tones.map(t => <button key={t} onClick={() => setForm({ ...form, tone: t })} style={{ padding: "7px 0", borderRadius: 8, fontSize: 12, cursor: "pointer", border: `1px solid ${form.tone === t ? "#2C5F8A" : "#DDE3EC"}`, background: form.tone === t ? "#EBF2F9" : "#fff", color: form.tone === t ? "#2C5F8A" : "#6B7280", textTransform: "capitalize", fontFamily: "'Inter', sans-serif" }}>{t}</button>)}
            </div>
          </div>
          {error && <div style={{ fontSize: 13, color: "#B91C1C", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>{error}</div>}
          <button onClick={generate} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 9, background: loading ? "#EEF2F7" : "#2C5F8A", border: "none", color: loading ? "#9CA3AF" : "#fff", fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <><span style={{ display: "inline-block", animation: "spin 1.2s linear infinite" }}>⟳</span> Generating...</> : "Generate all content →"}
          </button>
        </div>
        <div style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {!output && !loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 400, textAlign: "center" }}>
              <div style={{ width: 64, height: 64, background: "#E8EEF5", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 16 }}>🏡</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Ready to generate</div>
              <div style={{ fontSize: 13, color: "#9CA3AF", maxWidth: 280, lineHeight: 1.6 }}>Enter property details and click Generate.</div>
              <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {tabs.map(t => <div key={t.key} style={{ background: "#fff", border: "1px solid #E8EBF0", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#9CA3AF" }}>{t.icon} {t.label}</div>)}
              </div>
            </div>
          )}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
              <div style={{ width: 48, height: 48, border: "3px solid #E8EBF0", borderTopColor: "#2C5F8A", borderRadius: "50%", animation: "spin 0.9s linear infinite", marginBottom: 20 }} />
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Writing your content...</div>
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>This takes about 5–10 seconds</div>
            </div>
          )}
          {output && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div><div style={{ fontSize: 15, fontWeight: 600 }}>Content ready</div><div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>5 pieces generated</div></div>
                <button onClick={generate} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", border: "1px solid #DDE3EC", background: "#fff", color: "#6B7280", fontFamily: "'Inter', sans-serif" }}>⟳ Regenerate</button>
              </div>
              <div style={{ display: "flex", background: "#fff", border: "1px solid #E8EBF0", borderRadius: 10, padding: 4, marginBottom: 16, gap: 2 }}>
                {tabs.map(tab => <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex: 1, padding: "8px 6px", border: "none", borderBottom: activeTab === tab.key ? "2px solid #2C5F8A" : "2px solid transparent", background: "transparent", color: activeTab === tab.key ? "#2C5F8A" : "#6B7280", fontSize: 12, fontWeight: activeTab === tab.key ? 600 : 400, cursor: "pointer", borderRadius: 7, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>{tab.icon} {tab.label}</button>)}
              </div>
              {currentOutput && (
                <div style={{ background: "#fff", border: "1px solid #E8EBF0", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #F0F2F5", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FAFBFD" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{tabs.find(t => t.key === activeTab)?.label}</span>
                      <span style={{ fontSize: 11, color: "#9CA3AF", background: "#F0F2F5", borderRadius: 10, padding: "1px 8px" }}>{wordCount} words</span>
                    </div>
                    <button onClick={() => handleCopy(activeTab, currentOutput)} style={{ padding: "5px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", border: `1px solid ${copied === activeTab ? "#22C55E" : "#DDE3EC"}`, background: copied === activeTab ? "#F0FDF4" : "#fff", color: copied === activeTab ? "#16A34A" : "#374151", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                      {copied === activeTab ? "✓ Copied!" : "Copy text"}
                    </button>
                  </div>
                  <div style={{ padding: "20px", fontSize: 14, lineHeight: 1.9, color: "#374151", whiteSpace: "pre-wrap", minHeight: 180 }}>{currentOutput}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}