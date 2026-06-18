import * as React from 'react';
import { Row, Column } from '@react-email/components';

// One labeled detail row inside an email body. Pass `last` to drop the divider.
const labelCell = {
  color: '#888',
  fontSize: '13px',
  width: '110px',
  verticalAlign: 'top',
  padding: '10px 0',
  borderBottom: '1px solid #d4d0c8',
};
const valueCell = {
  color: '#1A1A1A',
  fontSize: '15px',
  padding: '10px 0',
  borderBottom: '1px solid #d4d0c8',
  whiteSpace: 'pre-wrap',
};

export function Field({ label, children, last }) {
  const l = last ? { ...labelCell, borderBottom: 'none' } : labelCell;
  const v = last ? { ...valueCell, borderBottom: 'none' } : valueCell;
  return (
    <Row>
      <Column style={l}>{label}</Column>
      <Column style={v}>{children}</Column>
    </Row>
  );
}
