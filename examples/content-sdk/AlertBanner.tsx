'use client';

/**
 * Example Content SDK (Next.js) component that renders the JSON saved by the
 * Alert Banner Builder custom field.
 *
 * Copy this into your head app (for example src/components/alert-banner/),
 * register it in your component map, and point the `AlertBanner` field name
 * below at whatever you called the field on your template.
 *
 * This file is excluded from the Marketplace app's own build.
 */

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { ComponentParams, ComponentRendering, Field } from '@sitecore-content-sdk/nextjs';

type AlertType = 'info' | 'warning' | 'error' | 'success';
type DisplayOption = 'dismissible' | 'persistent' | 'timed';

interface AlertBannerConfig {
  message: string;
  type: AlertType;
  displayOption: DisplayOption;
  dismissible: boolean;
  timedDuration?: number;
  icon: string;
  backgroundColor: string;
  textColor: string;
  cta?: { text: string; url: string; style: 'primary' | 'secondary' | 'text' };
  position: 'top' | 'bottom' | 'fixed' | 'inline';
  animation: string;
}

interface AlertBannerProps {
  rendering: ComponentRendering;
  params: ComponentParams;
  fields: {
    AlertBanner: Field<string>;
  };
}

const HEX = /^#[0-9a-f]{6}$/i;
const SAFE_URL = /^(https?:\/\/|\/|#|mailto:|tel:)/i;

/** Parse defensively. Authors can clear or hand-edit the raw field value. */
function parseConfig(raw: string | undefined): AlertBannerConfig | null {
  if (!raw?.trim()) return null;
  try {
    const config = JSON.parse(raw) as AlertBannerConfig;
    return config.message?.trim() ? config : null;
  } catch {
    return null;
  }
}

/** Small stable key so a dismissal only sticks for this exact message. */
function storageKey(config: AlertBannerConfig): string {
  let hash = 0;
  for (const char of config.message) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }
  return `alert-banner-dismissed:${hash}`;
}

export const Default = ({ fields, params }: AlertBannerProps) => {
  const config = useMemo(() => parseConfig(fields?.AlertBanner?.value), [fields?.AlertBanner?.value]);
  const [dismissed, setDismissed] = useState(false);

  // Remember a manual dismissal for the rest of the browser session
  useEffect(() => {
    if (!config || config.displayOption !== 'dismissible') return;
    try {
      if (sessionStorage.getItem(storageKey(config)) === '1') {
        setDismissed(true);
      }
    } catch {
      // sessionStorage can throw in privacy modes, just show the banner
    }
  }, [config]);

  // Auto-hide timed alerts
  useEffect(() => {
    if (!config || config.displayOption !== 'timed') return;
    const seconds = config.timedDuration && config.timedDuration > 0 ? config.timedDuration : 5;
    const timer = setTimeout(() => setDismissed(true), seconds * 1000);
    return () => clearTimeout(timer);
  }, [config]);

  if (!config || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(storageKey(config), '1');
    } catch {
      // ignore
    }
  };

  const style: CSSProperties = {
    backgroundColor: HEX.test(config.backgroundColor) ? config.backgroundColor : undefined,
    color: HEX.test(config.textColor) ? config.textColor : undefined,
  };

  const cta = config.cta?.text && config.cta.url && SAFE_URL.test(config.cta.url.trim()) ? config.cta : null;

  return (
    <div
      className={`alert-banner alert-banner--${config.type} alert-banner--${config.position} alert-banner--${config.animation} ${params?.styles ?? ''}`.trim()}
      style={style}
      // Errors and warnings interrupt, info and success wait their turn
      role={config.type === 'error' || config.type === 'warning' ? 'alert' : 'status'}
      data-icon={config.icon}
    >
      <p className="alert-banner__message">{config.message}</p>

      {cta && (
        <a className={`alert-banner__cta alert-banner__cta--${cta.style}`} href={cta.url}>
          {cta.text}
        </a>
      )}

      {config.dismissible && (
        <button type="button" className="alert-banner__close" onClick={dismiss} aria-label="Dismiss alert">
          &times;
        </button>
      )}
    </div>
  );
};
