const DOC_FILES = [
  "architecture.md",
  "capture-and-organize.md",
  "decisions.md",
  "livefy-overview.md",
  "next-actions.md",
  "ollama-setup.md",
  "open-loops.md",
  "openclaw-integration.md",
  "parking-lot.md",
  "to-do-now.md",
];

export function createDocsPanel(elements) {
  let selectedFile = DOC_FILES[0];
  let isSyncingHash = false;

  const fromHash = parseFileFromHash(window.location.hash);
  if (fromHash) selectedFile = fromHash;

  for (const fileName of DOC_FILES) {
    const option = document.createElement("option");
    option.value = fileName;
    option.textContent = fileName;
    elements.docsSelect.append(option);
  }
  elements.docsSelect.value = selectedFile;

  elements.docsSelect.addEventListener("change", () => {
    selectedFile = elements.docsSelect.value;
    syncHash(selectedFile);
    void loadSelected();
  });

  elements.docsReloadButton.addEventListener("click", () => {
    void loadSelected();
  });

  window.addEventListener("hashchange", () => {
    if (isSyncingHash) return;
    const fileFromHash = parseFileFromHash(window.location.hash);
    if (!fileFromHash) return;
    selectedFile = fileFromHash;
    elements.docsSelect.value = selectedFile;
    elements.docsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    void loadSelected();
  });

  void loadSelected();

  async function loadSelected() {
    elements.docsStatus.textContent = `Loading ${selectedFile}...`;
    try {
      const markdown = await fetchDocText(selectedFile);
      elements.docsContent.innerHTML = renderMarkdown(markdown);
      elements.docsStatus.textContent = `Loaded docs/${selectedFile}`;
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Unknown error";
      elements.docsContent.textContent = "";
      elements.docsStatus.textContent = `Could not load docs/${selectedFile}: ${detail}`;
    }
  }

  function syncHash(fileName) {
    isSyncingHash = true;
    window.location.hash = `docs?file=${encodeURIComponent(fileName)}`;
    window.setTimeout(() => {
      isSyncingHash = false;
    }, 0);
  }
}

async function fetchDocText(fileName) {
  const baseUrl = new URL(".", document.baseURI);
  const localPathUrl = new URL(`docs/${fileName}`, baseUrl);
  const rootPathUrl = new URL(`/docs/${fileName}`, window.location.origin);

  const candidates = [localPathUrl, rootPathUrl];
  let lastError = "";
  for (const url of candidates) {
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (response.ok) return response.text();
    lastError = `${response.status} ${response.statusText}`.trim();
  }
  throw new Error(lastError || "Not found");
}

function renderMarkdown(markdown) {
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let inList = false;
  let inCode = false;
  let codeBuffer = [];

  const flushList = () => {
    if (!inList) return;
    out.push("</ul>");
    inList = false;
  };

  const flushCode = () => {
    if (!inCode) return;
    out.push(`<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
    inCode = false;
    codeBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine ?? "";

    if (line.startsWith("```")) {
      if (inCode) {
        flushCode();
      } else {
        flushList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      out.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    const listMatch = line.match(/^\s*[-*]\s+(.+)$/);
    if (listMatch) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${renderInline(listMatch[1])}</li>`);
      continue;
    }

    if (!line.trim()) {
      flushList();
      out.push("");
      continue;
    }

    flushList();
    out.push(`<p>${renderInline(line)}</p>`);
  }

  flushList();
  flushCode();

  return out.join("\n");
}

function renderInline(text) {
  let escaped = escapeHtml(text);
  escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
  escaped = escaped.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  return escaped;
}

function parseFileFromHash(hashValue) {
  const hash = String(hashValue || "").replace(/^#/, "");
  if (!hash.startsWith("docs")) return "";
  const queryIndex = hash.indexOf("?");
  if (queryIndex < 0) return "";
  const query = hash.slice(queryIndex + 1);
  const params = new URLSearchParams(query);
  const fileName = params.get("file") || "";
  return DOC_FILES.includes(fileName) ? fileName : "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
