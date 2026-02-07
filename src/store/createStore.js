import { createEmptyState, migrateState } from "../domain/schema.js";

export function createStore({ adapter, onChange }) {
  let state = initializeState(adapter);

  const api = {
    getState: () => clone(state),
    setEnergy,
    setNotes,
    setOutcomes,
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
