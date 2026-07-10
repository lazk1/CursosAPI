// Analiza una URL de video y devuelve cómo mostrarla incrustada en la página
// en vez de abrirla en una pestaña nueva.
export function resolveVideoEmbed(url) {
  if (!url) return null;

  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    // YouTube: youtube.com/watch?v=ID | youtube.com/embed/ID | youtu.be/ID | shorts
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      let videoId = u.searchParams.get("v");
      if (!videoId) {
        const parts = u.pathname.split("/").filter(Boolean);
        // /embed/ID  o  /shorts/ID
        if (parts[0] === "embed" || parts[0] === "shorts") videoId = parts[1];
      }
      if (videoId) {
        return { type: "iframe", src: `https://www.youtube.com/embed/${videoId}` };
      }
    }

    if (host === "youtu.be") {
      const videoId = u.pathname.slice(1);
      if (videoId) {
        return { type: "iframe", src: `https://www.youtube.com/embed/${videoId}` };
      }
    }

    // Vimeo: vimeo.com/ID
    if (host === "vimeo.com") {
      const videoId = u.pathname.split("/").filter(Boolean)[0];
      if (videoId && /^\d+$/.test(videoId)) {
        return { type: "iframe", src: `https://player.vimeo.com/video/${videoId}` };
      }
    }

    // Archivo de video directo (mp4, webm, ogg)
    if (/\.(mp4|webm|ogg)$/i.test(u.pathname)) {
      return { type: "video", src: url };
    }

    // No reconocido: dejamos que se abra en una pestaña nueva como antes.
    return { type: "link", src: url };
  } catch {
    return { type: "link", src: url };
  }
}
