import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LogoIcon = ({ size = 90 }) => (
  <svg width={size} height={size} viewBox="0 0 136 136">
    <rect x="54" y="72" width="28" height="46" rx="14" fill="#1D9E75"/>
    <circle cx="68" cy="54" r="18" fill="#1D9E75"/>
    <rect x="10" y="90" width="22" height="36" rx="11" fill="#D85A30"/>
    <circle cx="21" cy="75" r="13" fill="#D85A30"/>
    <rect x="104" y="90" width="22" height="36" rx="11" fill="#534AB7"/>
    <circle cx="115" cy="75" r="13" fill="#534AB7"/>
    <path d="M54 88 Q36 82 32 80" fill="none" stroke="#1D9E75" strokeWidth="8" strokeLinecap="round"/>
    <path d="M82 88 Q100 82 104 80" fill="none" stroke="#1D9E75" strokeWidth="8" strokeLinecap="round"/>
    <circle cx="132" cy="46" r="6" fill="#BA7517"/>
    <circle cx="144" cy="34" r="4" fill="#E24B4A"/>
    <circle cx="120" cy="34" r="3" fill="#5DCAA5"/>
  </svg>
);

const LogoText = ({ size = 38 }) => (
  <span style={{ fontFamily:"Nunito,sans-serif", fontWeight:900, fontSize:size, lineHeight:1 }}>
    <span style={{ color:"#1D9E75" }}>K</span>
    <span style={{ color:"#D85A30" }}>i</span>
    <span style={{ color:"#BA7517" }}>d</span>
    {" "}
    <span style={{ color:"#D85A30" }}>T</span>
    <span style={{ color:"#1D9E75" }}>r</span>
    <span style={{ color:"#534AB7" }}>a</span>
    <span style={{ color:"#E24B4A" }}>c</span>
    <span style={{ color:"#085041" }}>k</span>
  </span>
);

export { LogoIcon, LogoText };

export default function Splash() {
  const navigate = useNavigate();
  const [dot, setDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setDot(d => (d + 1) % 3), 400);
    const timer = setTimeout(() => navigate("/role"), 2800);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [navigate]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0A0A; }

        /* ── MOBILE (défaut) ── */
        .splash-root {
          width: 100vw; height: 100vh;
          background: #0A0A0A;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          font-family: Nunito, sans-serif;
        }
        .splash-teal {
          position: absolute; top: -135px; left: -86px;
          width: 232px; height: 162px;
          background: #28C2A0;
          border-radius: 50%;
        }
        .splash-purple {
          position: absolute; bottom: -216px;
          left: 50%; transform: translateX(-50%);
          width: 432px; height: 432px;
          background: #534AB7; border-radius: 50%;
          display: flex; align-items: flex-start;
          justify-content: center; padding-top: 28px;
        }
        .splash-powered {
          font-size: 14px; font-weight: 600;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.04em;
        }
        .splash-center {
          display: flex; flex-direction: column;
          align-items: center; gap: 0; z-index: 1;
        }
        .splash-tagline {
          font-size: 11px; font-weight: 700;
          color: #888780; letter-spacing: 0.14em;
          text-transform: uppercase; margin-top: 10px; margin-bottom: 40px;
        }
        .splash-dots { display: flex; gap: 8px; }
        .dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: #1D9E75; transition: opacity 0.3s, transform 0.3s;
        }

        /* ── TABLETTE ── */
        @media (min-width: 600px) and (max-width: 1023px) {
          .splash-root { background: #0D1117; }
          .splash-teal { width: 300px; height: 210px; top: -160px; left: -100px; }
          .splash-purple { width: 560px; height: 560px; bottom: -280px; }
          .splash-powered { font-size: 15px; }
          .splash-tagline { font-size: 13px; margin-bottom: 48px; }
        }

        /* ── PC / DESKTOP ── */
        @media (min-width: 1024px) {
          .splash-root {
            background: linear-gradient(135deg, #0A0A0A 0%, #0F1A14 50%, #0A0A0A 100%);
          }
          .splash-teal { display: none; }
          .splash-purple { display: none; }
          .splash-center { gap: 0; }
          .splash-tagline { font-size: 14px; letter-spacing: 0.2em; color: #5DCAA5; }
          /* Cercle décoratif sur PC */
          .splash-root::before {
            content: "";
            position: absolute;
            width: 600px; height: 600px;
            border-radius: 50%;
            border: 1px solid rgba(29,158,117,0.1);
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
          }
          .splash-root::after {
            content: "";
            position: absolute;
            width: 400px; height: 400px;
            border-radius: 50%;
            border: 1px solid rgba(83,74,183,0.15);
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
          }
          .powered-pc {
            position: absolute; bottom: 28px;
            font-size: 13px; color: rgba(255,255,255,0.3);
            letter-spacing: 0.08em; font-weight: 600;
          }
        }
      `}</style>

      <div className="splash-root">
        <div className="splash-teal"/>
        <div className="splash-purple">
          <span className="splash-powered">Powered by : XYZ.COM</span>
        </div>

        <div className="splash-center">
          <LogoIcon size={window.innerWidth >= 1024 ? 120 : window.innerWidth >= 600 ? 100 : 86}/>
          <div style={{ marginTop: 14 }}>
            <LogoText size={window.innerWidth >= 1024 ? 48 : window.innerWidth >= 600 ? 42 : 36}/>
          </div>
          <div className="splash-tagline">Suivi des enfants en crèche</div>
          <div className="splash-dots">
            {[0,1,2].map(i => (
              <div key={i} className="dot" style={{
                opacity: dot === i ? 1 : 0.25,
                transform: dot === i ? "scale(1.3)" : "scale(1)",
              }}/>
            ))}
          </div>
        </div>

        <div className="powered-pc" style={{ display:"none" }}>Powered by : XYZ.COM</div>
      </div>
    </>
  );
}