function launchStealthMode(targetUrl) {
  let inFrame = false;
  try {
    inFrame = window !== top;
  } catch (e) {
    inFrame = true;
  }

  if (!inFrame) {
    const popup = window.open("about:blank", "_blank");
    if (!popup || popup.closed) {
      alert("Please allow popups for this site to use Stealth Cloaking.");
      return;
    }

    const doc = popup.document;
    doc.title = "Google Classroom";
    
    const favicon = doc.createElement("link");
    favicon.rel = "icon";
    favicon.href = "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico";
    doc.head.appendChild(favicon);

    const iframe = doc.createElement("iframe");
    iframe.src = targetUrl;
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.bottom = "0";
    iframe.style.left = "0";
    iframe.style.right = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.margin = "0";
    iframe.style.padding = "0";

    doc.body.appendChild(iframe);
    window.location.replace("https://classroom.google.com");
  }
}

// Panic Key Shortcut: Shift + Esc instantly wipes records and jumps to Google Classroom
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === 'Escape') {
      e.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('https://classroom.google.com');
    }
  });
}
