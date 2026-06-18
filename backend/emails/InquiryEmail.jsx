import * as React from 'react';
import { Section, Heading, Text, Link } from '@react-email/components';
import { BrandLayout } from './components/BrandLayout.jsx';
import { Field } from './components/Field.jsx';

const head = { padding: '20px 28px 0' };
const heading = { margin: 0, fontSize: '20px', color: '#1A1A1A' };
const body = { padding: '12px 28px 24px' };
const linkStyle = { color: '#1B4F8A', textDecoration: 'none' };

export function InquiryEmail({ name, email, product, quantity, message, inquiryNo, date }) {
  return (
    <BrandLayout
      preview={`New product inquiry — ${product}`}
      footer={`Sent from the Pokhrel Flex Printing website — ${date}`}
    >
      <Section style={head}>
        <Heading style={heading}>New Product Inquiry — {inquiryNo}</Heading>
      </Section>
      <Section style={body}>
        <Field label="Name">{name}</Field>
        <Field label="Email">
          <Link href={`mailto:${email}`} style={linkStyle}>{email}</Link>
        </Field>
        <Field label="Product">{product}</Field>
        <Field label="Quantity">{quantity || 'Not specified'}</Field>
        <Field label="Message" last>{message || 'No additional message'}</Field>
      </Section>
    </BrandLayout>
  );
}
