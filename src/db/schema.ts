export interface InboxItem {
  id: string;
  createdAt: string;
  title?: string;
  sourceDate?: string;
  rawText: string;
}

export type ProposalKind = "goal" | "method" | "action" | "event" | "summary" | "risk";
export type ProposalStatus = "proposed" | "accepted" | "rejected";

export interface Proposal {
  id: string;
  inboxItemId: string;
  kind: ProposalKind;
  payload: Record<string, unknown>;
  confidence?: number;
  status: ProposalStatus;
  model?: string;
  promptVersion?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  inboxItemId: string;
  createdAt: string;
  title: string;
  notes?: string;
}

export interface Method {
  id: string;
  inboxItemId: string;
  createdAt: string;
  title: string;
  notes?: string;
}

export interface Action {
  id: string;
  inboxItemId: string;
  createdAt: string;
  title: string;
  notes?: string;
  dueDate?: string;
  pinned?: boolean;
}

export interface CreateInboxItemInput {
  title?: string;
  sourceDate?: string;
  rawText: string;
}

// Raw inbox text is immutable truth in the Phase 2 architecture,
// so the update path intentionally allows metadata changes only.
export interface UpdateInboxItemInput {
  title?: string;
  sourceDate?: string;
}
