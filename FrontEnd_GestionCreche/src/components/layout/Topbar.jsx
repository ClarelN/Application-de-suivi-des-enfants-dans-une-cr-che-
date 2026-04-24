import { Bell, Menu } from "lucide-react";
import { T, ROLES } from "../../constants/theme";
import { useEffect, useState } from "react";

export default function Topbar({ title, role = "edu", onMenuClick }) {
  const R = ROLES[role];
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = `${(user.prenom || "?")[0]}${(user.nom || "?")[0]}`;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div style={{
      background: T.surface,
      borderBottom: `1px solid ${T.border}`,
      padding: "12px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

        {/* Hamburger — toujours visible sur mobile */}
        {isMobile && (
          <button
            onClick={onMenuClick}
            style={{
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              cursor: "pointer",
              color: T.text1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
              flexShrink: 0,
            }}
          >
            <Menu size={20} strokeWidth={2} />
          </button>
        )}

        <div style={{
          fontSize: 17,
          fontWeight: 800,
          fontFamily: "Nunito,sans-serif",
          color: T.text1,
        }}>
          {title}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Cloche */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={20} color={T.text2} strokeWidth={2} />
          <div style={{
            width: 7, height: 7,
            background: T.danger,
            borderRadius: "50%",
            position: "absolute", top: -1, right: -1,
            border: "1.5px solid white",
          }} />
        </div>

        {/* Avatar + nom */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: R.light, color: R.dark,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 12, fontFamily: "Nunito,sans-serif",
          }}>
            {initials}
          </div>
          {!isMobile && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Nunito,sans-serif" }}>
                {user.prenom} {user.nom}
              </div>
              <div style={{ fontSize: 11, color: T.text2 }}>{R.label}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}