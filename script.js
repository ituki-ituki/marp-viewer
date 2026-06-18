import { Marp } from "https://esm.sh/@marp-team/marp-core@4";

const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const pdfBtn = document.getElementById("pdfBtn");
const editorMode = document.getElementById("editorMode");

const DEFAULT_THEME_URL = "./template.css";
const DEFAULT_MARKDOWN_URL = "./template.md";

let mdText = "";
let cssText = "";
let lastEditorMode = "md";

const loadDefaultCss = async () => {
  const r = await fetch(DEFAULT_THEME_URL, { cache: "no-store" });
  if (!r.ok) throw new Error("デフォルトテーマ（template.css）を読めません");
  return r.text();
};

const loadDefaultMarkdown = async () => {
  const r = await fetch(DEFAULT_MARKDOWN_URL, { cache: "no-store" });
  if (!r.ok) throw new Error("デフォルト Markdown（template.md）を読めません");
  return r.text();
};

[cssText, mdText] = await Promise.all([loadDefaultCss(), loadDefaultMarkdown()]);

const createMarp = () => {
  const marp = new Marp({ html: true });
  marp.themeSet.add(cssText);
  return marp;
};

const withFrontmatter = (md) => {
  if (/^---[\s\S]*?---\s*/.test(md)) return md;
  return `---\nmarp: true\ntheme: custom\npaginate: true\n---\n\n${md}`;
};

// ドロップ画像の実体（data URL）。エディタには marp-embed:ID のみ表示
const localImageStore = new Map();
const EMBED_IMG = /!\[([^\]]*)\]\(marp-embed:([^)]+)\)/g;

const resolveLocalEmbeds = (md) =>
  md.replace(EMBED_IMG, (full, alt, id) => {
    const url = localImageStore.get(id);
    return url ? `![${alt}](${url})` : full;
  });

const render = () => {
  const marp = createMarp();
  const markdown = withFrontmatter(resolveLocalEmbeds(mdText));
  const { html, css } = marp.render(markdown);
  preview.innerHTML = `<style>${css}</style>${html}`;
};

const syncEditorFromMode = () => {
  editor.value = editorMode.value === "md" ? mdText : cssText;
};

const persistEditorToMode = () => {
  if (editorMode.value === "md") mdText = editor.value;
  else cssText = editor.value;
};

const persistFromLastMode = () => {
  if (lastEditorMode === "md") mdText = editor.value;
  else cssText = editor.value;
};

editorMode.addEventListener("change", () => {
  persistFromLastMode();
  lastEditorMode = editorMode.value;
  syncEditorFromMode();
});

editor.addEventListener("input", () => {
  persistEditorToMode();
  render();
});

// PNG / JPEG をドロップするとファイル名＋短い参照を挿入（画像データはメモリのみ）
const allowedImageFile = (file) => {
  if (file.type === "image/png" || file.type === "image/jpeg") return true;
  if (!file.type && /\.(png|jpe?g)$/i.test(file.name)) return true;
  return false;
};

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

const safeImageAlt = (name) => name.replace(/\]/g, "");

let editorDndDepth = 0;

editor.addEventListener("dragenter", (e) => {
  e.preventDefault();
  editorDndDepth++;
  editor.classList.add("editor-dnd-over");
});

editor.addEventListener("dragleave", (e) => {
  e.preventDefault();
  editorDndDepth = Math.max(0, editorDndDepth - 1);
  if (editorDndDepth === 0) editor.classList.remove("editor-dnd-over");
});

editor.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
});

editor.addEventListener("drop", async (e) => {
  e.preventDefault();
  editorDndDepth = 0;
  editor.classList.remove("editor-dnd-over");

  if (editorMode.value !== "md") return;

  const files = [...e.dataTransfer.files].filter(allowedImageFile);
  if (files.length === 0) return;

  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const before = editor.value.slice(0, start);
  const after = editor.value.slice(end);

  const blocks = await Promise.all(
    files.map(async (file) => {
      const id = crypto.randomUUID();
      const dataUrl = await readFileAsDataURL(file);
      localImageStore.set(id, dataUrl);
      const alt = safeImageAlt(file.name);
      return `![${alt}](marp-embed:${id})`;
    })
  );
  const insertion = `${blocks.join("\n\n")}\n`;

  editor.value = before + insertion + after;
  const caret = before.length + insertion.length;
  editor.selectionStart = editor.selectionEnd = caret;

  editor.dispatchEvent(new Event("input", { bubbles: true }));
  editor.focus();
});

syncEditorFromMode();
render();

// ポップアップではなく iframe で印刷（window.open 失敗時を避ける）
const printHtmlDocument = (fullHtml) => {
  const iframe = document.createElement("iframe");
  iframe.setAttribute(
    "style",
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden"
  );
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  doc.open();
  doc.write(fullHtml);
  doc.close();

  const cleanup = () => {
    iframe.remove();
  };

  const runPrint = () => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } finally {
      iframe.contentWindow.addEventListener("afterprint", cleanup, { once: true });
      setTimeout(cleanup, 2 * 60 * 1000);
    }
  };

  if (iframe.contentDocument.readyState === "complete") {
    requestAnimationFrame(runPrint);
  } else {
    iframe.onload = () => requestAnimationFrame(runPrint);
  }
};

pdfBtn.addEventListener("click", () => {
  persistEditorToMode();
  const marp = createMarp();
  const markdown = withFrontmatter(resolveLocalEmbeds(mdText));
  const { html, css } = marp.render(markdown);
  const fullHtml = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Marp PDF</title>
  <style>
    ${css}
    body { margin: 0; background: #fff; }
  </style>
</head>
<body>${html}</body>
</html>`;
  printHtmlDocument(fullHtml);
});
