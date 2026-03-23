"use client";

import { useEffect, useRef } from "react";

type CalEmbedProps = {
  calLink: string;
};

export default function CalEmbed({ calLink }: CalEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !embedRef.current) return;
    initialized.current = true;

    // Strip full URL prefixes — only the path portion (e.g. "dsenteu/bbqm") is valid
    const cleanLink = calLink
      .replace(/^https?:\/\/[^\/]+\//, "")
      .replace(/^\/+/, "")
      .trim();

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = `
      (function (C, A, L) {
        let p = function (a, ar) { a.q.push(ar); };
        let d = C.document;
        C.Cal = C.Cal || function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () { p(api, arguments); };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["-", namespace, ar]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
      })(window, "https://centrumbookings.com/embed/embed.js", "init");
      Cal("init", { origin: "https://centrumbookings.com" });
      Cal("inline", {
        elementOrSelector: "#cal-booking-embed",
        calLink: "${cleanLink}",
        config: { theme: "light" }
      });
    `;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [calLink]);

  return (
    <div ref={embedRef}>
      <div
        id="cal-booking-embed"
        style={{ width: "100%", height: "100%", minHeight: "600px", overflowY: "auto" }}
      />
    </div>
  );
}
