import * as React from 'react';
import { Section, Heading, Text, Link } from '@react-email/components';
import { BrandLayout } from './components/BrandLayout.jsx';
import { Field } from './components/Field.jsx';

const body = { padding: '24px 28px' };
const heading = { margin: '0 0 6px', fontSize: '20px', color: '#1A1A1A' };
const intro = { margin: '0 0 16px', fontSize: '15px', color: '#555' };
const linkStyle = { color: '#1B4F8A', textDecoration: 'none' };

export function NewsletterEmail({ email, date }) {
  return (
    <BrandLayout
      preview={`New newsletter subscription — ${email}`}
      footer="This message was sent from the Pokhrel Flex Printing website."
    >
      <Section style={body}>
        <Heading style={heading}>New Newsletter Subscription</Heading>
        <Text style={intro}>Someone subscribed from the Pokhrel Flex Printing website.</Text>
        <Field label="Email">
          <Link href={`mailto:${email}`} style={linkStyle}>{email}</Link>
        </Field>
        <Field label="Date" last>{date}</Field>
      </Section>
    </BrandLayout>
  );
}
