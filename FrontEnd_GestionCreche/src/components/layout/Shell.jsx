import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar  from "./Topbar";
import { T }   from "../../constants/theme";

export default function Shell({ children, role = "edu", title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:T.bg }}>

      {/* Sidebar — passe open/onClose uniquement sur mobile */}
      <Sidebar
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Zone principale */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
        <Topbar
          title={title}
          role={role}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main style={{ flex:1, overflowY:"auto", padding:20 }}>
          {children}
        </main>
      </div>
    </div>
  );
}