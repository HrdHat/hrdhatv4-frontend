import React from 'react';

export default function ErrorPage() {
  return (
    <div>
      <h1>500 – Internal Error</h1>
      <p>Something went wrong. Please try again later.</p>
      {/* TODO: Add error boundary integration and better messaging */}
    </div>
  );
}
