import { createEmptyState, migrateState } from "../domain/schema.js";

export function createStore({ adapter, onChange }) {
  let state = initializeState(adapter);

  const api = {
    getState: () => clone(state),
    setEnergy,
    setNotes,
    setOutcomes,
    setInboxDraft,
    extractInboxDraft,
    addTask,
    removeTask,
    setTaskDone,
    addHabit,
    removeHabit,
    setHabitChecked,
  };

  onChange?.(api.getState());
  return api;

  function commit(next) {
    state = next;
    adapter.save(state);
    onChange?.(api.getState());
  }

  function setEnergy(value) {
    const numeric = Number(value);
    const bounded = Number.isFinite(numeric) ? Math.max(1, Math.min(10, numeric)) : 6;
    commit({
      ...state,
      dashboard: { ...state.dashboard, energy: bounded },
    });
  }

  function setNotes(value) {
    commit({
      ...state,
      dashboard: { ...state.dashboard, notes: String(value) },
    });
  }

  function setOutcomes(value) {
    commit({
      ...state,
      dashboard: { ...state.dashboard, outcomes: String(value) },
    });
  }

  function setInboxDraft(value) {
    commit({
      ...state,
      capture: {
        ...state.capture,
        inboxDraft: String(value),
      },
    });
  }

  function extractInboxDraft() {
    const extracted = extractStructuredItems(state.capture.inboxDraft);
    if (extracted.decisions.length === 0 && extracted.openLoops.length === 0 && extracted.nextActions.length === 0) {
      return;
    }
    const now = new Date().toISOString();
    commit({
      ...state,
      capture: {
        inboxDraft: "",
        lastExtractedAt: now,
      },
      decisions: [...extracted.decisions, ...state.decisions],
      openLoops: [...extracted.openLoops, ...state.openLoops],
      nextActions: [...extracted.nextActions, ...state.nextActions],
    });
  }

  function addTask(text) {
    const clean = String(text).trim();
    if (!clean) return;
    commit({
      ...state,
      tasks: [
        {
          id: makeId(),
          text: clean,
          done: false,
          createdAt: new Date().toISOString(),
        },
        ...state.tasks,
      ],
    });
  }

  function removeTask(taskId) {
    commit({
      ...state,
      tasks: state.tasks.filter((task) => task.id !== taskId),
    });
  }

  function setTaskDone(taskId, done) {
    commit({
      ...state,
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, done: Boolean(done) } : task)),
    });
  }

  function addHabit(text) {
    const clean = String(text).trim();
    if (!clean) return;
    commit({
      ...state,
      habits: [
        ...state.habits,
        { id: makeId(), text: clean, createdAt: new Date().toISOString() },
      ],
    });
  }

  function removeHabit(habitId) {
    commit({
      ...state,
      habits: state.habits.filter((habit) => habit.id !== habitId),
    });
  }

  function setHabitChecked(dateKey, habitId, checked) {
    const existing = state.habitChecksByDate[dateKey] || {};
    commit({
      ...state,
      habitChecksByDate: {
        ...state.habitChecksByDate,
        [dateKey]: {
          ...existing,
          [habitId]: Boolean(checked),
        },
      },
    });
  }
}

function initializeState(adapter) {
  const loaded = adapter.load();
  if (!loaded) return createEmptyState();
  return migrateState(loaded);
}

function clone(value) {
  if (globalThis.structuredClone) return globalThis.structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id_${Math.random().toString(36).slice(2, 10)}`;
}

function extractStructuredItems(rawInput) {
  const lines = splitIntoCandidateLines(rawInput);
  const decisions = [];
  const openLoops = [];
  const nextActions = [];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean) continue;
    const decision = stripPrefix(clean, /^(decision|decide|we decided|i decided)\s*[:\-]?\s*/i);
    if (decision) {
      decisions.push(createStructuredItem(decision));
      continue;
    }

    const action = stripPrefix(clean, /^(next action|action|todo|task)\s*[:\-]?\s*/i) || stripCheckbox(clean);
    if (action) {
      nextActions.push(createStructuredItem(action));
      continue;
    }

    const loop = stripPrefix(clean, /^(open loop|question|later|follow up|follow-up)\s*[:\-]?\s*/i);
    if (loop || clean.includes("?")) {
      openLoops.push(createStructuredItem(loop || clean));
      continue;
    }

    // Default unmatched lines to open loops to preserve unresolved thinking.
    openLoops.push(createStructuredItem(clean));
  }

  return {
    decisions: dedupeByText(decisions),
    openLoops: dedupeByText(openLoops),
    nextActions: dedupeByText(nextActions),
  };
}

function splitIntoCandidateLines(rawInput) {
  return String(rawInput)
    .split(/\n+/g)
    .map((line) => line.replace(/^[\s*-]+/, "").trim())
    .filter(Boolean);
}

function stripPrefix(text, regex) {
  if (!regex.test(text)) return "";
  return text.replace(regex, "").trim();
}

function stripCheckbox(text) {
  if (!/^\[[ xX]\]/.test(text)) return "";
  return text.replace(/^\[[ xX]\]\s*/, "").trim();
}

function createStructuredItem(text) {
  return { id: makeId(), text, createdAt: new Date().toISOString() };
}

function dedupeByText(items) {
  const seen = new Set();
  const next = [];
  for (const item of items) {
    const key = item.text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(item);
  }
  return next;
}
