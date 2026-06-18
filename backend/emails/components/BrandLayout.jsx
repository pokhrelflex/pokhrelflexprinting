import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text } from '@react-email/components';
import { InterFont, FONT_STACK } from './InterFont.jsx';

// Shared shell for every transactional email — navy header, paper body, deep-navy
// footer. Brand colors mirror CLAUDE.md (pfp-main / pfp-paper / pfp-dark).
const main = {
  backgroundColor: '#e9e7e2',
  margin: 0,
  padding: '24px 0',
  fontFamily: FONT_STACK,
};
const container = {
  maxWidth: '600px',
  margin: '0 auto',
  border: '1px solid #e0e0e0',
  overflow: 'hidden',
  backgroundColor: '#F2F0EC',
};
const header = { backgroundColor: '#1B4F8A', padding: '20px 28px' };
const brand = { color: '#ffffff', fontSize: '16px', fontWeight: 700, margin: 0 };
const footer = { backgroundColor: '#0D1F3C', padding: '16px', textAlign: 'center' };
const footerText = { color: '#F2F0EC', fontSize: '12px', margin: 0 };

export function BrandLayout({ preview, children, footer: footerLabel }) {
  return (
    <Html>
      <Head>
        <InterFont />
      </Head>
      {preview ? <Preview>{preview}</Preview> : null}
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>Pokhrel Flex Printing</Text>
          </Section>
          {children}
          <Section style={footer}>
            <Text style={footerText}>
              {footerLabel || 'This message was sent from the Pokhrel Flex Printing website.'}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
