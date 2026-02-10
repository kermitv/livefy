import Dexie, { type Table } from "dexie";
import type {
  Action,
  CreateInboxItemInput,
  Goal,
  InboxItem,
  Method,
  Proposal,
  UpdateInboxItemInput,
} from "./schema";

const DB_NAME = "livify-phase2";
const DB_VERSION = 2;

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export class LivifyDexie extends Dexie {
  // Local-first memory source of truth for captured raw text.
  inboxItems!: Table<InboxItem, string>;

  // Prepared stores for later tasks (LLM proposals and accepted planning entities).
  proposals!: Table<Proposal, string>;
  goals!: Table<Goal, string>;
  methods!: Table<Method, string>;
  actions!: Table<Action, string>;

  constructor() {
    super(DB_NAME);

    this.version(DB_VERSION).stores({
      inboxItems: "id, createdAt, sourceDate",
      proposals: "id, inboxItemId, kind, status, createdAt",
      goals: "id, inboxItemId, status, createdAt",
      methods: "id, inboxItemId, createdAt",
      actions: "id, inboxItemId, status, dueDate, pinned, createdAt",
    });
  }
}

export const db = new LivifyDexie();

export async function createInboxItem(input: CreateInboxItemInput): Promise<InboxItem> {
  const item: InboxItem = {
    id: createId(),
    createdAt: new Date().toISOString(),
    title: input.title,
    sourceDate: input.sourceDate,
    rawText: input.rawText,
  };

  await db.inboxItems.add(item);
  return item;
}

export async function getInboxItemById(id: string): Promise<InboxItem | undefined> {
  return db.inboxItems.get(id);
}

export async function listInboxItems(): Promise<InboxItem[]> {
  return db.inboxItems.orderBy("createdAt").reverse().toArray();
}

export async function updateInboxItem(
  id: string,
  input: UpdateInboxItemInput,
): Promise<boolean> {
  const updated = await db.inboxItems.update(id, {
    title: input.title,
    sourceDate: input.sourceDate,
  });

  return updated > 0;
}

export async function deleteInboxItem(id: string): Promise<void> {
  await db.inboxItems.delete(id);
}
