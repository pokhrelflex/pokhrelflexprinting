import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Heading, Text, Img } from '@react-email/components';
import { InterFont, FONT_STACK } from './components/InterFont.jsx';

// Absolute URL — email clients can't load relative paths or localhost. Hosted
// on the Supabase Storage CDN (live immediately, no frontend deploy needed).
// Override with EMAIL_LOGO_URL if the logo moves.
const LOGO_URL =
  process.env.EMAIL_LOGO_URL ||
  'https://dqfssoslndsvlhmibldr.supabase.co/storage/v1/object/public/pfp-images/brand/logo-email.png';

// Minimal, Apple-style verification email — no card, no borders, no colored
// header/footer. Just a wordmark, a title, plain copy, and the code in large
// plain text. Wording switches by `purpose`.
const CONTENT = {
  email_verify: {
    preview: (code) => `${code} is your verification code`,
    title: 'Verify your email address',
    intro:
      'You recently created an account with Pokhrel Flex Printing. To verify that this email address belongs to you, please enter the code below on the verification page:',
    why: 'We require verification whenever a new account is created. Your email address cannot be used until you have verified it.',
    security: 'If you did not create this account, you can safely ignore this email.',
  },
  login: {
    preview: (code) => `${code} is your login code`,
    title: 'Verify your sign-in',
    intro:
      'You are signing in to your Pokhrel Flex Printing account. To confirm it is really you, please enter the code below on the sign-in page:',
    why: 'We send a one-time code when you sign in, to confirm it is really you.',
    security:
      'If you did not try to sign in, you should change your password as soon as possible from your account page.',
  },
  reset: {
    preview: (code) => `${code} is your password reset code`,
    title: 'Reset your password',
    intro:
      'We received a request to reset the password for your Pokhrel Flex Printing account. To continue, please enter the code below on the password reset page:',
    why: 'This code is required to set a new password on your account.',
    security:
      'If you did not request a password reset, you can ignore this email and your password will remain unchanged.',
  },
};

const body = {
  backgroundColor: '#f4f4f5',
  margin: 0,
  padding: '40px 0',
  fontFamily: FONT_STACK,
};
const container = { maxWidth: '520px', margin: '0 auto', padding: '0 24px' };
const logoWrap = { textAlign: 'center', paddingBottom: '8px' };
const logo = { width: '44px', height: '45px', margin: '0 auto' };
const heading = {
  textAlign: 'center',
  fontSize: '24px',
  fontWeight: 400,
  color: '#1d1d1f',
  margin: '10px 0 28px',
};
const text = { fontSize: '14px', lineHeight: '22px', color: '#333333', margin: '0 0 16px' };
const codeText = {
  fontSize: '30px',
  fontWeight: 700,
  letterSpacing: '2px',
  color: '#1B4F8A', // pfp-main (brand navy)
  margin: '0 0 20px',
};

export function OtpEmail({ code, purpose }) {
  const c = CONTENT[purpose] || CONTENT.email_verify;
  return (
    <Html>
      <Head>
        <InterFont />
      </Head>
      <Preview>{c.preview(code)}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={logoWrap}>
            <Img src={LOGO_URL} width="44" height="45" alt="Pokhrel Flex Printing" style={logo} />
          </Section>
          <Heading style={heading}>{c.title}</Heading>
          <Text style={text}>Hello,</Text>
          <Text style={text}>{c.intro}</Text>
          <Text style={codeText}>{code}</Text>
          <Text style={text}>
            Why did you receive this email?
            <br />
            {c.why} This code expires in 10 minutes.
          </Text>
          <Text style={text}>{c.security}</Text>
          <Text style={text}>
            Kind regards,
            <br />
            Pokhrel Flex Printing
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
