import { useNavigate } from "react-router-dom";
import { User, BookOpen, Shield } from "lucide-react";
import { LogoIcon, LogoText } from "./Splash";

const roles = [
  { id:"parent",  label:"Parent",    Icon:User,     bg:"#1D9E75" },
  { id:"edu",     label:"Éducateur", Icon:BookOpen, bg:"#D85A30" },
  { id:"admin",   label:"Admin",     Icon:Shield,   bg:"#534AB7" },
];

export default function ChoixRole() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── MOBILE ── */
        .role-root {
          width: 100vw; min-height: 100vh;
          background: #fff;
          display: flex; flex-direction: column;
          align-items: center;
          position: relative; overflow: hidden;
          font-family: Nunito, sans-serif;
        }
        .role-blob {
          position: absolute; top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 100%; max-width: 500px; height: 260px;
          background: #28C2A0;
          border-radius: 0 0 50% 50%;
        }
        .role-circle {
          position: relative; z-index: 1; margin-top: 80px;
          width: 150px; height: 150px; border-radius: 50%;
          background: #fff;
          box-shadow: 0 6px 30px rgba(0,0,0,0.13);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px;
        }
        .role-logo-text { text-align: center; line-height: 1.1; }
        .role-logo-line { font-family: Nunito,sans-serif; font-weight: 900; font-size: 20px; }
        .role-subtitle {
          position: relative; z-index: 1;
          margin-top: 32px; font-size: 16px; font-weight: 700;
          color: #1D9E75; letter-spacing: 0.02em;
        }
        .role-grid {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 20px; margin-top: 28px;
          padding: 0 40px; width: 100%; max-width: 340px;
        }
        .role-btn-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .role-btn {
          width: 110px; height: 110px; border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .role-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.2); }
        .role-btn:active { transform: scale(0.96); }
        .role-label { font-size: 14px; font-weight: 700; color: #1A1A1A; font-family: Nunito,sans-serif; }
        .role-admin-wrap {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          margin-top: 20px; margin-bottom: 40px;
        }

        /* ── TABLETTE ── */
        @media (min-width: 600px) and (max-width: 1023px) {
          .role-blob { height: 300px; }
          .role-circle { width: 170px; height: 170px; margin-top: 100px; }
          .role-logo-line { font-size: 22px; }
          .role-btn { width: 130px; height: 130px; border-radius: 24px; }
          .role-grid { max-width: 400px; gap: 24px; }
          .role-subtitle { font-size: 18px; margin-top: 36px; }
          .role-label { font-size: 16px; }
        }

        /* ── PC / DESKTOP ── */
        @media (min-width: 1024px) {
          .role-root {
            flex-direction: row;
            background: linear-gradient(135deg, #E1F5EE 0%, #F8F8F6 100%);
          }
          .role-blob { display: none; }
          .role-left {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            background: linear-gradient(160deg, #1D9E75 0%, #085041 100%);
            min-height: 100vh; padding: 60px;
          }
          .role-right {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 60px; min-height: 100vh;
          }
          .role-circle {
            margin-top: 0; width: 200px; height: 200px;
            box-shadow: 0 8px 40px rgba(0,0,0,0.2);
          }
          .role-logo-line { font-size: 28px; }
          .role-pc-tagline {
            color: rgba(255,255,255,0.75); font-size: 13px;
            font-weight: 600; letter-spacing: 0.12em;
            text-transform: uppercase; margin-top: 20px;
          }
          .role-subtitle {
            font-size: 22px; color: #1A1A1A;
            margin-top: 0; margin-bottom: 32px; font-weight: 800;
          }
          .role-grid {
            max-width: 480px; padding: 0;
            gap: 28px; margin-top: 0;
          }
          .role-btn { width: 150px; height: 150px; border-radius: 28px; }
          .role-admin-wrap { margin-top: 28px; }
          .role-btn .role-icon { transform: scale(1.3); }
          .role-label { font-size: 16px; }
        }
      `}</style>

      <div className="role-root">
        <div className="role-blob"/>

        {/* LEFT (visible PC uniquement via flex) */}
        <div className="role-left" style={{ display:"none" }}>
          <LogoIcon size={130}/>
          <div style={{ marginTop:20 }}>
            <LogoText size={52}/>
          </div>
          <div className="role-pc-tagline">Suivi des enfants en crèche</div>
        </div>

        {/* RIGHT / Contenu principal */}
        <div className="role-right" style={{ display:"contents" }}>

          {/* Cercle logo (mobile + tablette) */}
          <div className="role-circle" style={{ display:"flex" }}>
            <LogoIcon size={60}/>
            <div className="role-logo-text">
              <div className="role-logo-line">
                <span style={{ color:"#1D9E75" }}>K</span>
                <span style={{ color:"#D85A30" }}>i</span>
                <span style={{ color:"#BA7517" }}>d</span>
              </div>
              <div className="role-logo-line">
                <span style={{ color:"#D85A30" }}>T</span>
                <span style={{ color:"#1D9E75" }}>r</span>
                <span style={{ color:"#534AB7" }}>a</span>
                <span style={{ color:"#E24B4A" }}>c</span>
                <span style={{ color:"#085041" }}>k</span>
              </div>
            </div>
          </div>

          <div className="role-subtitle">Choose your option</div>

          {/* Parent + Éducateur */}
          <div className="role-grid">
            {roles.slice(0, 2).map(({ id, label, Icon, bg }) => (
              <div key={id} className="role-btn-wrap">
                <button className="role-btn" style={{ background: bg }}
                  onClick={() => navigate("/login", { state:{ role:id } })}>
                  <Icon size={44} color="#fff" strokeWidth={1.5} className="role-icon"/>
                </button>
                <span className="role-label">{label}</span>
              </div>
            ))}
          </div>

          {/* Admin centré */}
          <div className="role-admin-wrap">
            <button className="role-btn" style={{ background:"#534AB7" }}
              onClick={() => navigate("/login", { state:{ role:"admin" } })}>
              <Shield size={44} color="#fff" strokeWidth={1.5}/>
            </button>
            <span className="role-label">Admin</span>
          </div>

        </div>
      </div>
    </>
  );
}