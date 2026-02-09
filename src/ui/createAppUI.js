import { createDocsPanel } from "./docsPanel.js";

export function createAppUI({ store }) {
  const elements = getElements();
  const todayKey = isoDate(new Date());

  elements.todayLabel.textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  elements.energyInput.addEventListener("input", () => {
    store.setEnergy(elements.energyInput.value);
  });

  elements.taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    store.addTask(elements.taskInput.value);
    elements.taskInput.value = "";
  });

  elements.habitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    store.addHabit(elements.habitInput.value);
    elements.habitInput.value = "";
  });

  elements.notesInput.addEventListener("input", () => {
    store.setNotes(elements.notesInput.value);
  });

  elements.outcomesInput.addEventListener("input", () => {
    store.setOutcomes(elements.outcomesInput.value);
  });

  elements.inboxInput.addEventListener("input", () => {
    store.setInboxDraft(elements.inboxInput.value);
  });

  elements.extractInboxButton.addEventListener("click", () => {
    store.extractInboxDraft();
  });

  createDocsPanel(elements);

  function render(state) {
    elements.energyInput.value = String(state.dashboard.energy);
    elements.energyValue.textContent = `${state.dashboard.energy}/10`;
    elements.notesInput.value = state.dashboard.notes;
    elements.outcomesInput.value = state.dashboard.outcomes;
    elements.inboxInput.value = state.capture.inboxDraft;
    renderTasks(state.tasks);
    renderHabits(state.habits, state.habitChecksByDate[todayKey] || {});
    renderSimpleItems(elements.decisionList, state.decisions);
    renderSimpleItems(elements.openLoopList, state.openLoops);
    renderSimpleItems(elements.nextActionList, state.nextActions);
  }

  function renderTasks(tasks) {
    elements.taskList.innerHTML = "";
    for (const task of tasks) {
      const li = document.createElement("li");
      li.className = "list-row";

      const left = document.createElement("div");
      left.className = "row-main";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", () => {
        store.setTaskDone(task.id, checkbox.checked);
      });

      const text = document.createElement("span");
      text.textContent = task.text;
      if (task.done) text.className = "done";

      left.append(checkbox, text);

      const remove = document.createElement("button");
      remove.className = "ghost";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        store.removeTask(task.id);
      });

      li.append(left, remove);
      elements.taskList.append(li);
    }
  }

  function renderHabits(habits, checks) {
    elements.habitList.innerHTML = "";
    for (const habit of habits) {
      const li = document.createElement("li");
      li.className = "list-row";

      const left = document.createElement("div");
      left.className = "row-main";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(checks[habit.id]);
      checkbox.addEventListener("change", () => {
        store.setHabitChecked(todayKey, habit.id, checkbox.checked);
      });

      const text = document.createElement("span");
      text.textContent = habit.text;
      left.append(checkbox, text);

      const remove = document.createElement("button");
      remove.className = "ghost";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        store.removeHabit(habit.id);
      });

      li.append(left, remove);
      elements.habitList.append(li);
    }
  }

  function renderSimpleItems(target, items) {
    target.innerHTML = "";
    for (const item of items) {
      const li = document.createElement("li");
      li.className = "list-row";
      li.textContent = item.text;
      target.append(li);
    }
  }

  render(store.getState());
  return { render };
}

function getElements() {
  return {
    todayLabel: byId("todayLabel"),
    energyInput: byId("energy"),
    energyValue: byId("energyValue"),
    taskForm: byId("taskForm"),
    taskInput: byId("taskInput"),
    taskList: byId("taskList"),
    habitForm: byId("habitForm"),
    habitInput: byId("habitInput"),
    habitList: byId("habitList"),
    notesInput: byId("notesInput"),
    outcomesInput: byId("outcomesInput"),
    inboxInput: byId("inboxInput"),
    extractInboxButton: byId("extractInboxButton"),
    decisionList: byId("decisionList"),
    openLoopList: byId("openLoopList"),
    nextActionList: byId("nextActionList"),
    docsSection: byId("docs"),
    docsSelect: byId("docsSelect"),
    docsReloadButton: byId("docsReloadButton"),
    docsStatus: byId("docsStatus"),
    docsContent: byId("docsContent"),
  };
}

function byId(id) {
  const value = document.getElementById(id);
  if (!value) throw new Error(`Missing required element: #${id}`);
  return value;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}
