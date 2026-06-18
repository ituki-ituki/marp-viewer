import { Marp } from "https://esm.sh/@marp-team/marp-core@4";

const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const pdfBtn = document.getElementById("pdfBtn");
const editorMode = document.getElementById("editorMode");

const DEFAULT_THEME_URL = "template/template.css";
const DEFAULT_MARKDOWN_URL = "template/template.txt";

let mdText = "";
let cssText = "";
let lastEditorMode = "md";

const loadText = async (url, label) => {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`${label} を読めません`);
  return r.text();
};

[cssText, mdText] = await Promise.all([
  loadText(DEFAULT_THEME_URL, "template.css"),
  loadText(DEFAULT_MARKDOWN_URL, "template.txt"),
]);

const createMarp = () => {
  const marp = new Marp({ html: true });
  marp.themeSet.add(cssText);
  return marp;
};

const withFrontmatter = (md) => {
  if (/^---[\s\S]*?---\s*/.test(md)) return md;
  return `---\nmarp: true\ntheme: custom\npaginate: true\n---\n\n${md}`;
};

const scrollRatio = (el) => {
  const max = el.scrollHeight - el.clientHeight;
  return max > 0 ? el.scrollTop / max : 0;
};

const setScrollRatio = (el, ratio) => {
  const max = el.scrollHeight - el.clientHeight;
  el.scrollTop = max > 0 ? ratio * max : 0;
};

let scrollSyncing = false;

editor.addEventListener("scroll", () => {
  if (scrollSyncing) return;
  scrollSyncing = true;
  setScrollRatio(preview, scrollRatio(editor));
  requestAnimationFrame(() => {
    scrollSyncing = false;
  });
});

preview.addEventListener("scroll", () => {
  if (scrollSyncing) return;
  scrollSyncing = true;
  setScrollRatio(editor, scrollRatio(preview));
  requestAnimationFrame(() => {
    scrollSyncing = false;
  });
});

const render = () => {
  const ratio = scrollRatio(editor);
  const marp = createMarp();
  const markdown = withFrontmatter(mdText);
  const { html, css } = marp.render(markdown);
  preview.innerHTML = `<style>${css}</style>${html}`;
  setScrollRatio(preview, ratio);
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
  const markdown = withFrontmatter(mdText);
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
