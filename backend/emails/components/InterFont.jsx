import * as React from 'react';
import { Font } from '@react-email/components';

// Inter for email. Used by every template's <Head>. Clients that support web
// fonts (Apple Mail, iOS) load Inter; Gmail/Outlook fall back to the stack.
// Inter v20 latin subset is a variable woff2 — same file serves both weights.
const URL = 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2';

export const FONT_STACK =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

export function InterFont() {
  return (
    <>
      <Font
        fontFamily="Inter"
        fallbackFontFamily="Helvetica"
        webFont={{ url: URL, format: 'woff2' }}
        fontWeight={400}
        fontStyle="normal"
      />
      <Font
        fontFamily="Inter"
        fallbackFontFamily="Helvetica"
        webFont={{ url: URL, format: 'woff2' }}
        fontWeight={700}
        fontStyle="normal"
      />
    </>
  );
}
