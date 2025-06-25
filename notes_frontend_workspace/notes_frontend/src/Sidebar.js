import React from "react";
import "./Sidebar.css";

// PUBLIC_INTERFACE
export default function Sidebar({ children }) {
  return (
    <aside className="sidebar">
      <nav>
        <div className="sidebar-title">NOTEMASTER</div>
        {children}
      </nav>
    </aside>
  );
}
