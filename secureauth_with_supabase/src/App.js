import React from 'react';
import './App.css';
import SecureAuth from "./SecureAuth";

// Main entry: Replace sample hero with SecureAuth container.
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            {/* <button className="btn">Template Button</button> */}
          </div>
        </div>
      </nav>

      <main>
        <div className="container" style={{ marginTop: 120 }}>
          {/* ======= SecureAuth UI entry point below ======= */}
          <SecureAuth />
        </div>
      </main>
    </div>
  );
}

export default App;