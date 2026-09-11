"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

import { gaMeasurementId, hasAnalyticsIds, metaPixelId } from "@/lib/analytics";
import {
  COOKIE_CONSENT_CHANGED,
  hasTrackingConsent,
} from "@/lib/consent";

export function Analytics() {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const gaReady = useRef(false);
  const pixelReady = useRef(false);
  const skipNextPageview = useRef(true);

  useEffect(() => {
    setAllowed(hasTrackingConsent());
    function onChange() {
      setAllowed(hasTrackingConsent());
      skipNextPageview.current = true;
    }
    window.addEventListener(COOKIE_CONSENT_CHANGED, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGED, onChange);
  }, []);

  useEffect(() => {
    if (!allowed) return;
    if (skipNextPageview.current) {
      skipNextPageview.current = false;
      return;
    }
    if (gaReady.current && window.gtag && gaMeasurementId) {
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname,
      });
    }
    if (pixelReady.current && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, allowed]);

  if (!allowed || !hasAnalyticsIds()) return null;

  return (
    <>
      {gaMeasurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            onReady={() => {
              gaReady.current = true;
            }}
            dangerouslySetInnerHTML={{
              __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');
`,
            }}
          />
        </>
      ) : null}
      {metaPixelId ? (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          onReady={() => {
            pixelReady.current = true;
          }}
          dangerouslySetInnerHTML={{
            __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');
`,
          }}
        />
      ) : null}
    </>
  );
}
