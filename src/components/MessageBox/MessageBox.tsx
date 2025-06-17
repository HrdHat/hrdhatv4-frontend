import React from 'react';

export type MessageBoxVariant = 'warning' | 'helper';

interface MessageBoxProps {
  /** Visual variant */
  variant: MessageBoxVariant;
  /** Content */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

/** Simple message/warning box component */
const MessageBox: React.FC<MessageBoxProps> = ({
  variant,
  children,
  className = '',
}) => {
  const classes = ['c-message-box', `c-message-box--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
};

export default MessageBox;
