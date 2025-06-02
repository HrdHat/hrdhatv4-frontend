import React from 'react';

export default function Unauthorized() {
  return (
    <div>
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      {/* TODO: Add redirect to login or home */}
    </div>
  );
}
