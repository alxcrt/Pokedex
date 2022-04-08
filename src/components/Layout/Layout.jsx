import React from 'react';

import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="app-wrapper">
      <div className="content-wrapper">{children}</div>
    </div>
  );
}
