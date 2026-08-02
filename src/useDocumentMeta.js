import { useEffect } from "react";

// Actualiza el <title> y el <meta name="description"> del documento.
// Sin SSR, esto no ayuda a bots que no ejecutan JS, pero sí a los que sí lo hacen
// y a la pestaña/historial del navegador.
export default function useDocumentMeta({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
  }, [title, description]);
}
