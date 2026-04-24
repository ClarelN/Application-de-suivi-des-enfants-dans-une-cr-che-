import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, Baby, CheckSquare, BookOpen, AlertTriangle,
  MessageSquare, Heart, Calendar, CreditCard, Settings,
  LogOut, ChevronRight, ChevronLeft, Layers, Users,
  Megaphone, BarChart2, X,
} from "lucide-react";
import { T, ROLES } from "../../constants/theme";

const NAV = {
  edu: [
    { path: "/edu/dashboard",   label: "Tableau de bord", Icon: Home },
    { path: "/edu/enfants",     label: "Mes enfants",      Icon: Baby },
    { path: "/edu/presences",   label: "Présences",        Icon: CheckSquare },
    { path: "/edu/suivi",       label: "Suivi journalier", Icon: BookOpen },
    { path: "/edu/incidents",   label: "Incidents",        Icon: AlertTriangle },
    { path: "/edu/messagerie",  label: "Messagerie",       Icon: MessageSquare },
    { path: "/edu/profil",      label: "Mon profil",       Icon: Settings },
  ],
  parent: [
    { path: "/parent/dashboard",   label: "Tableau de bord", Icon: Home },
    { path: "/parent/mon-enfant",  label: "Mon enfant",       Icon: Heart },
    { path: "/parent/journal",     label: "Journal",          Icon: BookOpen },
    { path: "/parent/evenements",  label: "Événements",       Icon: Calendar },
    { path: "/parent/messagerie",  label: "Messagerie",       Icon: MessageSquare },
    { path: "/parent/factures",    label: "Mes factures",     Icon: CreditCard },
    { path: "/parent/profil",      label: "Mon profil",       Icon: Settings },
  ],
  admin: [
    { path: "/admin/dashboard",    label: "Tableau de bord", Icon: Home },
    { path: "/admin/enfants",      label: "Enfants",          Icon: Baby },
    { path: "/admin/groupes",      label: "Groupes",          Icon: Layers },
    { path: "/admin/utilisateurs", label: "Utilisateurs",     Icon: Users },
    { path: "/admin/facturation",  label: "Facturation",      Icon: CreditCard },
    { path: "/admin/annonces",     label: "Annonces",         Icon: Megaphone },
    { path: "/admin/evenements",   label: "Événements",       Icon: Calendar },
    { path: "/admin/rapports",     label: "Rapports",         Icon: BarChart2 },
    { path: "/admin/parametres",   label: "Paramètres",       Icon: Settings },
  ],
};

export default function Sidebar({ role = "edu", open, onClose }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const R         = ROLES[role];
  const nav       = NAV[role] || NAV.edu;
  const user      = JSON.parse(localStorage.getItem("user") || "{}");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [collapsed, setCollapsed] = useState(false);

  // Détecter mobile/desktop au resize
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Bloquer le scroll du body quand le drawer est ouvert sur mobile
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = open ? "hidden" : "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, isMobile]);

  const handleNav = (path) => {
    navigate(path);
    if (isMobile && onClose) onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ───────────────────────────────────────────
  // MOBILE — Drawer overlay
  // ───────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Backdrop flou + sombre */}
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            transition: "opacity 0.25s ease",
          }}
        />

        {/* Drawer */}
        <div style={{
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          width: 265,
          zIndex: 50,
          background: T.surface,
          boxShadow: "6px 0 40px rgba(0,0,0,0.18)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(.4,0,.2,1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}>

          {/* Header drawer */}
          <div style={{
            padding: "16px 14px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <LogoSVG />
            <button
              onClick={onClose}
              style={{
                background: T.bg,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                cursor: "pointer",
                color: T.text2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 7,
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Role badge */}
          <div style={{ padding: "10px 12px 6px" }}>
            <div style={{
              background: R.light, borderRadius: 10,
              padding: "8px 10px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: R.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: R.color, fontFamily: "Nunito,sans-serif" }}>
                  {R.label}
                </div>
                <div style={{ fontSize: 10, color: T.text2 }}>
                  {user.prenom} {user.nom}
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "4px 8px" }}>
            {nav.map(({ path, label, Icon }) => {
              const isActive = location.pathname === path;
              return (
                <div
                  key={path}
                  onClick={() => handleNav(path)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 12px",
                    margin: "2px 0", borderRadius: 10,
                    cursor: "pointer",
                    background: isActive ? R.light : "transparent",
                    color: isActive ? R.color : T.text2,
                    fontWeight: isActive ? 700 : 600,
                    fontSize: 14, fontFamily: "Nunito,sans-serif",
                    transition: "background 0.15s",
                  }}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{label}</span>
                  {isActive && (
                    <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: R.color }} />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout */}
          <div style={{ padding: "8px", borderTop: `1px solid ${T.border}` }}>
            <div
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 12px", borderRadius: 10,
                cursor: "pointer", color: T.danger,
                fontWeight: 700, fontSize: 14,
              }}
            >
              <LogOut size={18} strokeWidth={2} />
              <span>Déconnexion</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ───────────────────────────────────────────
  // DESKTOP — Sidebar fixe collapsible
  // ───────────────────────────────────────────
  return (
    <div style={{
      width: collapsed ? 64 : 220,
      background: T.surface,
      borderRight: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column",
      flexShrink: 0,
      transition: "width 0.2s ease",
      height: "100vh",
      position: "sticky", top: 0,
      overflowY: "auto", overflowX: "hidden",
    }}>

      {/* Logo */}
      <div style={{
        padding: "16px 12px",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center",
        justifyContent: "space-between", minHeight: 60,
      }}>
        {!collapsed ? <LogoSVG /> : <LogoIcon />}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: T.text3, padding: 4, display: "flex",
            borderRadius: 6, marginLeft: collapsed ? "auto" : 0,
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div style={{ padding: "10px 12px 6px" }}>
          <div style={{
            background: R.light, borderRadius: 10,
            padding: "8px 10px", display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: R.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: R.color, fontFamily: "Nunito,sans-serif" }}>
                {R.label}
              </div>
              <div style={{ fontSize: 10, color: T.text2 }}>
                {user.prenom} {user.nom}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 8px" }}>
        {nav.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path;
          return (
            <div
              key={path}
              onClick={() => handleNav(path)}
              title={collapsed ? label : undefined}
              style={{
                display: "flex", alignItems: "center",
                gap: 10, padding: collapsed ? "10px" : "9px 10px",
                margin: "2px 0", borderRadius: 10, cursor: "pointer",
                background: isActive ? R.light : "transparent",
                color: isActive ? R.color : T.text2,
                fontWeight: isActive ? 700 : 600,
                fontSize: 13, fontFamily: "Nunito,sans-serif",
                justifyContent: collapsed ? "center" : "flex-start",
                transition: "background 0.15s",
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && isActive && (
                <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: R.color }} />
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "8px", borderTop: `1px solid ${T.border}` }}>
        <div
          onClick={handleLogout}
          title={collapsed ? "Déconnexion" : undefined}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: collapsed ? "10px" : "9px 10px",
            borderRadius: 10, cursor: "pointer",
            color: T.danger, fontWeight: 600, fontSize: 13,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <LogOut size={17} strokeWidth={2} />
          {!collapsed && <span>Déconnexion</span>}
        </div>
      </div>
    </div>
  );
}

// ── Logos ──
const LogoSVG = () => (
  <svg width="120" height="32" viewBox="0 0 200 54">
    <g transform="translate(2,3) scale(0.21)">
      <rect x="54" y="72" width="28" height="46" rx="14" fill="#1D9E75"/>
      <circle cx="68" cy="54" r="18" fill="#1D9E75"/>
      <rect x="10" y="90" width="22" height="36" rx="11" fill="#D85A30"/>
      <circle cx="21" cy="75" r="13" fill="#D85A30"/>
      <rect x="104" y="90" width="22" height="36" rx="11" fill="#534AB7"/>
      <circle cx="115" cy="75" r="13" fill="#534AB7"/>
      <path d="M54 88 Q36 82 32 80" fill="none" stroke="#1D9E75" strokeWidth="8" strokeLinecap="round"/>
      <path d="M82 88 Q100 82 104 80" fill="none" stroke="#1D9E75" strokeWidth="8" strokeLinecap="round"/>
    </g>
    <g fontFamily="'Nunito',Arial,sans-serif" fontWeight="900" fontSize="22">
      <text x="40" y="26" fill="#1D9E75">K</text>
      <text x="57" y="26" fill="#D85A30">i</text>
      <text x="65" y="26" fill="#BA7517">d</text>
      <text x="82" y="26" fill="#D85A30">T</text>
      <text x="97" y="26" fill="#1D9E75">r</text>
      <text x="109" y="26" fill="#534AB7">a</text>
      <text x="123" y="26" fill="#E24B4A">c</text>
      <text x="137" y="26" fill="#085041">k</text>
    </g>
  </svg>
);

const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 136 136">
    <rect x="54" y="72" width="28" height="46" rx="14" fill="#1D9E75"/>
    <circle cx="68" cy="54" r="18" fill="#1D9E75"/>
    <rect x="10" y="90" width="22" height="36" rx="11" fill="#D85A30"/>
    <circle cx="21" cy="75" r="13" fill="#D85A30"/>
    <rect x="104" y="90" width="22" height="36" rx="11" fill="#534AB7"/>
    <circle cx="115" cy="75" r="13" fill="#534AB7"/>
  </svg>
);