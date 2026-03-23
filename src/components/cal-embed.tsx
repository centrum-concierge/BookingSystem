"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

const CAL_ORIGIN = "https://cal.centrumbookings.com";
const EMBED_JS_URL = "https://cal.centrumbookings.com/embed/embed.js";

type CalEmbedProps = {
  calLink: string;
};

export default function CalEmbed({ calLink }: CalEmbedProps) {
  // Strip any full URL prefix — only keep the path portion (e.g. "dsenteu/bbq")
  const cleanLink = calLink
    .replace(/^https?:\/\/[^/]+\//, "")
    .replace(/^\/+/, "")
    .trim();

  // Derive namespace from the event slug (e.g. "dsenteu/bbq" → "bbq")
  const namespace = cleanLink.includes("/") ? cleanLink.split("/").pop()! : cleanLink;

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace, embedLibUrl: EMBED_JS_URL });
      cal("ui", {
        // Use our brand green as the Cal accent color
        cssVarsPerTheme: {
          light: { "cal-brand": "#00a651" },
        },
        // Hides the left panel: host profile, name, location badges, duration
        hideEventTypeDetails: true,
        layout: "month_view",
      });
    })();
  }, [namespace]);

  return (
    <Cal
      namespace={namespace}
      calLink={cleanLink}
      calOrigin={CAL_ORIGIN}
      embedJsUrl={EMBED_JS_URL}
      style={{ width: "100%", height: "100%", minHeight: "700px" }}
      config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
    />
  );
}
