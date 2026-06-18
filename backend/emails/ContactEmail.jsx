import * as React from 'react';
import { Section, Text, Link } from '@react-email/components';
import { BrandLayout } from './components/BrandLayout.jsx';
import { Field } from './components/Field.jsx';

const meta = { padding: '14px 28px 0' };
const metaText = { margin: 0, fontSize: '11px', color: '#888' };
const accent = { color: '#1B4F8A', fontWeight: 600 };
const body = { padding: '8px 28px 24px' };
const linkStyle = { color: '#1B4F8A', textDecoration: 'none' };

export function ContactEmail({ name, email, phone, country, message, inquiryNo, date }) {
  return (
    <BrandLayout
      preview={`New inquiry from ${name}`}
      footer="This message was sent from the Pokhrel Flex Printing website."
    >
      <Section style={meta}>
        <Text style={metaText}>
          Inquiry No: <span style={accent}>{inquiryNo}</span> &middot; {date}
        </Text>
      </Section>
      <Section style={body}>
        <Field label="Name">{name}</Field>
        <Field label="Email">
          <Link href={`mailto:${email}`} style={linkStyle}>{email}</Link>
        </Field>
        <Field label="Phone">{phone || 'N/A'}</Field>
        <Field label="Country">{country || 'N/A'}</Field>
        <Field label="Message" last>{message}</Field>
      </Section>
    </BrandLayout>
  );
}
