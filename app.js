const STORAGE_KEY = "livify_state_v1";

const todayLabel = document.getElementById("todayLabel");
const energyInput = document.getElementById("energy");
const energyValue = document.getElementById("energyValue");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const habitForm = document.getElementById("habitForm");
const habitInput = document.getElementById("habitInput");
const habitList = document.getElementById("habitList");

const notesInput = document.getElementById("notesInput");
const outcomesInput = document.getElementById("outcomesInput");

const todayKey = new Date().toISOString().slice(0, 10);
todayLabel.textContent = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const defaultState = {
  energy: 6,
  notes: "",
  outcomes: "",
  tasks: [],
  habits: [],
  habitChecksByDate: {},
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderTasks() {
  taskList.innerHTML = "";
  state.tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "list-row";

    const left = document.createElement("div");
    left.className = "row-main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      state.tasks[index].done = checkbox.checked;
      saveState();
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;
    if (task.done) text.className = "done";

    left.append(checkbox, text);

    const remove = document.createElement("button");
    remove.className = "ghost";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      state.tasks.splice(index, 1);
      saveState();
      renderTasks();
    });

    li.append(left, remove);
    taskList.append(li);
  });
}

function renderHabits() {
  habitList.innerHTML = "";
  const checks = state.habitChecksByDate[todayKey] || {};

  state.habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.className = "list-row";

    const left = document.createElement("div");
    left.className = "row-main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(checks[habit.id]);
    checkbox.addEventListener("change", () => {
      const day = state.habitChecksByDate[todayKey] || {};
      day[habit.id] = checkbox.checked;
      state.habitChecksByDate[todayKey] = day;
      saveState();
      renderHabits();
    });

    const text = document.createElement("span");
    text.textContent = habit.text;
    left.append(checkbox, text);

    const remove = document.createElement("button");
    remove.className = "ghost";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      state.habits.splice(index, 1);
      // Keep historical checks; they are keyed by id and harmless.
      saveState();
      renderHabits();
    });

    li.append(left, remove);
    habitList.append(li);
  });
}

energyInput.value = String(state.energy);
energyValue.textContent = `${state.energy}/10`;
notesInput.value = state.notes;
outcomesInput.value = state.outcomes;

energyInput.addEventListener("input", () => {
  state.energy = Number(energyInput.value);
  energyValue.textContent = `${state.energy}/10`;
  saveState();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  state.tasks.unshift({ text, done: false });
  taskInput.value = "";
  saveState();
  renderTasks();
});

habitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = habitInput.value.trim();
  if (!text) return;
  state.habits.push({ id: crypto.randomUUID(), text });
  habitInput.value = "";
  saveState();
  renderHabits();
});

notesInput.addEventListener("input", () => {
  state.notes = notesInput.value;
  saveState();
});

outcomesInput.addEventListener("input", () => {
  state.outcomes = outcomesInput.value;
  saveState();
});

renderTasks();
renderHabits();
