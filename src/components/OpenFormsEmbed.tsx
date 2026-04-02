"use client";

import { useEffect } from "react";

export default function OpenFormsEmbed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://forms.resolverestoration.ca/widgets/iframe.min.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).initEmbed) {
        (window as any).initEmbed("contact-form-9posnx", { autoResize: true });
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <iframe
      style={{ border: "none", width: "100%", minHeight: "900px" }}
      id="contact-form-9posnx"
      src="https://forms.resolverestoration.ca/forms/contact-form-9posnx"
      title="Form K Submission"
      allowFullScreen
    ></iframe>
  );
}
