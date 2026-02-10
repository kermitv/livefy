const FALLBACK_DOC_FILES = [
  "architecture.md",
  "capture-and-organize.md",
  "decisions.md",
  "livefy-overview.md",
  "ollama-windows-setup.md",
  "next-actions.md",
  "ollama-setup.md",
  "open-loops.md",
  "openclaw-integration.md",
  "parking-lot.md",
  "to-do-now.md",
];

export function createDocsPanel(elements) {
  let docsFiles = [...FALLBACK_DOC_FILES];
  let selectedFile = docsFiles[0];
  let isSyncingHash = false;

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
    const fileFromHash = parseFileFromHash(window.location.hash, docsFiles);
    if (!fileFromHash) return;
    selectedFile = fileFromHash;
    elements.docsSelect.value = selectedFile;
    elements.docsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    void loadSelected();
  });

  void initialize();

  async function initialize() {
    docsFiles = await fetchDocsManifest();
    const fromHash = parseFileFromHash(window.location.hash, docsFiles);
    if (fromHash) selectedFile = fromHash;
    else if (!docsFiles.includes(selectedFile)) selectedFile = docsFiles[0];

    renderDocsSelect(elements.docsSelect, docsFiles, selectedFile);
    void loadSelected();
  }

  async function loadSelected() {
    if (!selectedFile) {
      elements.docsStatus.textContent = "No docs available.";
      elements.docsContent.textContent = "";
      return;
    }
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

function renderDocsSelect(select, files, selectedFile) {
  select.innerHTML = "";
  for (const fileName of files) {
    const option = document.createElement("option");
    option.value = fileName;
    option.textContent = fileName;
    select.append(option);
  }
  select.value = selectedFile;
}

async function fetchDocsManifest() {
  const manifest = await fetchJsonWithFallback("docs/index.json");
  if (!manifest || !Array.isArray(manifest.docs)) return [...FALLBACK_DOC_FILES];
  const docs = manifest.docs.filter((fileName) => typeof fileName === "string" && fileName.endsWith(".md"));
  return docs.length > 0 ? docs : [...FALLBACK_DOC_FILES];
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

async function fetchJsonWithFallback(path) {
  const baseUrl = new URL(".", document.baseURI);
  const localPathUrl = new URL(path, baseUrl);
  const rootPathUrl = new URL(`/${path}`, window.location.origin);
  const candidates = [localPathUrl, rootPathUrl];

  for (const url of candidates) {
    try {
      const response = await fetch(url.toString(), { cache: "no-store" });
      if (!response.ok) continue;
      return await response.json();
    } catch {
      // Try next candidate URL.
    }
  }
  return null;
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

function parseFileFromHash(hashValue, docsFiles) {
  const hash = String(hashValue || "").replace(/^#/, "");
  if (!hash.startsWith("docs")) return "";
  const queryIndex = hash.indexOf("?");
  if (queryIndex < 0) return "";
  const query = hash.slice(queryIndex + 1);
  const params = new URLSearchParams(query);
  const fileName = params.get("file") || "";
  return docsFiles.includes(fileName) ? fileName : "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
