import React, { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  createInboxItem,
  deleteInboxItem,
  getInboxItemById,
  listInboxItems,
} from "../../db/db";
import type { InboxItem, Proposal, ProposalKind } from "../../db/schema";

type CreateFormState = {
  title: string;
  sourceDate: string;
  rawText: string;
};

const INITIAL_FORM: CreateFormState = {
  title: "",
  sourceDate: "",
  rawText: "",
};

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);
  const [formState, setFormState] = useState<CreateFormState>(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReflecting, setIsReflecting] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void refreshItems();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelectedItem(null);
      setProposals([]);
      return;
    }

    setProposals([]);
    void loadSelectedItem(selectedId);
  }, [selectedId]);

  const selectedPreview = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  async function refreshItems() {
    try {
      setError(null);
      const nextItems = await listInboxItems();
      setItems(nextItems);
      if (!selectedId && nextItems.length > 0) {
        setSelectedId(nextItems[0].id);
      }
      if (selectedId && !nextItems.some((item) => item.id === selectedId)) {
        setSelectedId(nextItems[0]?.id ?? null);
      }
    } catch {
      setError("Failed to load inbox items.");
    }
  }

  async function loadSelectedItem(id: string) {
    try {
      setError(null);
      const item = await getInboxItemById(id);
      setSelectedItem(item ?? null);
    } catch {
      setError("Failed to load inbox item details.");
      setSelectedItem(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formState.rawText.trim()) {
      setError("Raw text is required.");
      return;
    }

    try {
      setError(null);
      setIsSaving(true);
      const created = await createInboxItem({
        rawText: formState.rawText,
        title: formState.title.trim() || undefined,
        sourceDate: formState.sourceDate || undefined,
      });
      setFormState(INITIAL_FORM);
      await refreshItems();
      setSelectedId(created.id);
    } catch {
      setError("Failed to save inbox item.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteSelected() {
    if (!selectedItem) return;

    try {
      setError(null);
      setIsDeleting(true);
      await deleteInboxItem(selectedItem.id);
      setSelectedItem(null);
      setSelectedId(null);
      setProposals([]);
      await refreshItems();
    } catch {
      setError("Failed to delete inbox item.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleReflectSelected() {
    const target = selectedItem ?? selectedPreview;
    if (!target) return;

    try {
      setError(null);
      setIsReflecting(true);

      const response = await fetch("/api/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inboxItemId: target.id,
          rawText: target.rawText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reflect on inbox item");
      }

      const data = (await response.json()) as { proposals?: Proposal[] };
      setProposals(Array.isArray(data.proposals) ? data.proposals : []);
    } catch {
      setError("Failed to fetch draft interpretations.");
      setProposals([]);
    } finally {
      setIsReflecting(false);
    }
  }

  const proposalsByKind = useMemo(() => {
    const grouped: Record<ProposalKind, Proposal[]> = {
      summary: [],
      goal: [],
      method: [],
      action: [],
      event: [],
      risk: [],
    };

    for (const proposal of proposals) {
      grouped[proposal.kind].push(proposal);
    }

    return grouped;
  }, [proposals]);

  return (
    <main className="inbox-page">
      <header className="inbox-header">
        <p className="eyebrow">Inbox</p>
        <h1>Livify Inbox</h1>
        <p className="header-subtitle">Capture now, organize later.</p>
      </header>

      <section className="inbox-layout" aria-label="Inbox workspace">
        {/* Presentation-only pane separation to improve scanability and long-form reading comfort. */}
        <article className="panel panel-capture" aria-label="Capture">
          <h2>Capture</h2>
          <p className="panel-note">Paste raw text first. Structure comes later.</p>
          <form onSubmit={handleSubmit} className="capture-form">
            <label>
              Title (optional)
              <input
                type="text"
                value={formState.title}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Source date (optional)
              <input
                type="date"
                value={formState.sourceDate}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    sourceDate: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Raw text
              <textarea
                required
                rows={10}
                value={formState.rawText}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    rawText: event.target.value,
                  }))
                }
                placeholder="Paste notes, thoughts, or conversation text."
              />
            </label>

            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save to Inbox"}
            </button>
          </form>
        </article>

        <article className="panel panel-list" aria-label="Inbox list">
          <h2>Inbox</h2>
          <ul className="inbox-list">
            {items.map((item) => {
              const label = item.title?.trim() || item.rawText.slice(0, 64);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={item.id === selectedId ? "inbox-item is-selected" : "inbox-item"}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span className="inbox-item-title">{label || "Untitled inbox item"}</span>
                    <time>{formatDateTime(item.createdAt)}</time>
                  </button>
                </li>
              );
            })}
            {items.length === 0 ? <li className="empty-state">No inbox items yet.</li> : null}
          </ul>
        </article>

        <article className="panel panel-detail" aria-label="Inbox detail">
          <h2>Details</h2>
          {selectedItem || selectedPreview ? (
            <div className="detail">
              {/* Metadata and source text are visually separated so source text remains primary. */}
              <div className="detail-meta">
                <p className="detail-row">
                  <span className="detail-label">Title</span>
                  <span className="detail-value">{(selectedItem ?? selectedPreview)?.title || "(none)"}</span>
                </p>
                <p className="detail-row">
                  <span className="detail-label">Source Date</span>
                  <span className="detail-value">{(selectedItem ?? selectedPreview)?.sourceDate || "(none)"}</span>
                </p>
                <p className="detail-row">
                  <span className="detail-label">Created</span>
                  <span className="detail-value">
                    {formatDateTime((selectedItem ?? selectedPreview)!.createdAt)}
                  </span>
                </p>
              </div>
              <div className="detail-raw">
                <h3>Raw Text</h3>
                <pre className="raw-text">{(selectedItem ?? selectedPreview)?.rawText}</pre>
              </div>
              <div className="detail-actions">
                <button
                  type="button"
                  className="button-reflect"
                  onClick={handleReflectSelected}
                  disabled={isReflecting}
                >
                  {isReflecting ? "Reflecting..." : "Reflect on this"}
                </button>
                <button
                  type="button"
                  className="button-delete"
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete item"}
                </button>
              </div>
              {/* Draft interpretations stay visually secondary and grouped without changing behavior. */}
              <section className="drafts">
                <h3>Draft interpretations</h3>
                {proposals.length === 0 ? (
                  <p className="empty-state">No drafts yet. Click \"Reflect on this\".</p>
                ) : (
                  (Object.keys(proposalsByKind) as ProposalKind[])
                    .filter((kind) => proposalsByKind[kind].length > 0)
                    .map((kind) => (
                      <div key={kind} className="draft-group">
                        <h4>{kind}</h4>
                        <ul>
                          {proposalsByKind[kind].map((proposal) => (
                            <li key={proposal.id}>{readProposalText(proposal.payload)}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                )}
              </section>
            </div>
          ) : (
            <p className="empty-state">Select an inbox item to view details.</p>
          )}
        </article>
      </section>

      {error ? <p className="error-banner">{error}</p> : null}
    </main>
  );
}

function readProposalText(payload: Proposal["payload"]): string {
  const maybeText = payload?.text;
  return typeof maybeText === "string" && maybeText.trim() ? maybeText : JSON.stringify(payload);
}
