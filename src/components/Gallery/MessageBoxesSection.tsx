import React from 'react';
import MessageBox from '@/components/MessageBox/MessageBox';

const MessageBoxesSection: React.FC = () => (
  <section style={{ padding: '1rem 0' }}>
    <h2>Message Boxes</h2>
    <MessageBox variant='warning'>This is a warning message.</MessageBox>
    <MessageBox variant='helper'>This is a helper message.</MessageBox>
  </section>
);

export default MessageBoxesSection;
