import express from "express";

const app = express();
const PORT = Number(process.env.PORT || 8787);

app.use(express.json({ limit: "1mb" }));

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function excerpt(text, max = 140) {
  const clean = text.trim().replace(/\s+/g, " ");
  if (!clean) return "";
  return clean.length <= max ? clean : `${clean.slice(0, max - 3)}...`;
}

function createProposal(inboxItemId, kind, text) {
  return {
    id: createId(),
    inboxItemId,
    kind,
    payload: { text },
    status: "proposed",
    createdAt: new Date().toISOString(),
    model: "mock",
    promptVersion: "v0",
  };
}

function buildMockProposals(inboxItemId, rawText) {
  const short = excerpt(rawText, 120) || "Captured reflection";
  const firstLine = rawText.split("\n").map((line) => line.trim()).find(Boolean) || short;

  return [
    createProposal(inboxItemId, "summary", `Interpretation: ${short}`),
    createProposal(inboxItemId, "goal", `Possible goal: clarify and stabilize \"${excerpt(firstLine, 80)}\".`),
    createProposal(inboxItemId, "method", "Possible method: review this note and identify one concrete next step."),
    createProposal(inboxItemId, "action", "Possible action: schedule 20 minutes to turn this into a small plan."),
    createProposal(inboxItemId, "risk", "Possible risk: key context may be lost if this stays unreviewed."),
  ];
}

app.post("/api/triage", (req, res) => {
  const inboxItemId = req.body?.inboxItemId;
  const rawText = req.body?.rawText;

  if (typeof inboxItemId !== "string" || !inboxItemId.trim()) {
    res.status(400).json({ error: "inboxItemId must be a non-empty string" });
    return;
  }

  if (typeof rawText !== "string" || !rawText.trim()) {
    res.status(400).json({ error: "rawText must be a non-empty string" });
    return;
  }

  res.json({ proposals: buildMockProposals(inboxItemId, rawText) });
});

app.listen(PORT, () => {
  console.log(`[livify-dev-server] listening on http://0.0.0.0:${PORT}`);
});
