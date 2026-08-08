'use client';

import React, { useEffect, useState } from 'react';

const getPathUrl = () => {
  if (typeof window !== 'undefined') {
    return new URL(window.location.href).origin.replace(/\/$/, '');
  }
  return '';
};

const ApiDocumentation: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(getPathUrl());
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>wk5docker API Documentation</h1>
      <p>
        <strong>GET, POST, PATCH, DELETE</strong> requests to{' '}
        <code>{baseUrl}/api/users</code>
      </p>
      <h3>1. GET</h3>
      <pre><code>{`curl -X GET ${baseUrl}/api/users`}</code></pre>
      <h3>2. POST</h3>
      <pre><code>{`curl -X POST ${baseUrl}/api/users -H "Content-Type: application/json" -d '{"name": "new-user-name", "lineStatus": "offline"}'`}</code></pre>
      <h3>3. PATCH</h3>
      <pre><code>{`curl -X PATCH ${baseUrl}/api/users?id=1 -H "Content-Type: application/json" -d '{"lineStatus": "online"}'`}</code></pre>
      <h3>4. DELETE</h3>
      <pre><code>{`curl -X DELETE ${baseUrl}/api/users?id=1`}</code></pre>
    </div>
  );
};

export default ApiDocumentation;
