import React, { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  createInboxItem,
  deleteInboxItem,
  getInboxItemById,
  listInboxItems,
} from "../../db/db";
import type { InboxItem } from "../../db/schema";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void refreshItems();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelectedItem(null);
      return;
    }

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
      await refreshItems();
    } catch {
      setError("Failed to delete inbox item.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="inbox-page">
      <header className="inbox-header">
        <h1>Livify Inbox</h1>
        <p>Capture now, organize later.</p>
      </header>

      <section className="inbox-layout" aria-label="Inbox workspace">
        <article className="panel" aria-label="Capture">
          <h2>Capture</h2>
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

        <article className="panel" aria-label="Inbox list">
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
                    <span>{label || "Untitled inbox item"}</span>
                    <time>{formatDateTime(item.createdAt)}</time>
                  </button>
                </li>
              );
            })}
            {items.length === 0 ? <li className="empty-state">No inbox items yet.</li> : null}
          </ul>
        </article>

        <article className="panel" aria-label="Inbox detail">
          <h2>Details</h2>
          {selectedItem || selectedPreview ? (
            <div className="detail">
              <p>
                <strong>Title:</strong> {(selectedItem ?? selectedPreview)?.title || "(none)"}
              </p>
              <p>
                <strong>Source Date:</strong> {(selectedItem ?? selectedPreview)?.sourceDate || "(none)"}
              </p>
              <p>
                <strong>Created:</strong> {formatDateTime((selectedItem ?? selectedPreview)!.createdAt)}
              </p>
              <div>
                <strong>Raw Text:</strong>
                <pre className="raw-text">{(selectedItem ?? selectedPreview)?.rawText}</pre>
              </div>
              <button type="button" onClick={handleDeleteSelected} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete item"}
              </button>
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
