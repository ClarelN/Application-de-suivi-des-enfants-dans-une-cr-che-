import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { LogoIcon, LogoText } from "./Splash";
import api from "../../services/api";

const ROLE_COLORS = {
  edu:    "#1D9E75",
  parent: "#D85A30",
  admin:  "#534AB7",
};

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const role      = location.state?.role || "edu";
  const btnColor  = ROLE_COLORS[role] || "#3B48CC";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const r = res.data.user.role;
      if (r === "admin")       navigate("/admin/dashboard");
      else if (r === "parent") navigate("/parent/dashboard");
      else                     navigate("/edu/dashboard");
    } catch {
      setError("Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Test sans backend
  const handleTest = () => {
    localStorage.setItem("user", JSON.stringify({ nom:"Dupont", prenom:"Marie", role }));
    if (role === "admin")       navigate("/admin/dashboard");
    else if (role === "parent") navigate("/parent/dashboard");
    else                        navigate("/edu/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Nunito+Sans:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── MOBILE ── */
        .login-root {
          width: 100vw; min-height: 100vh;
          background: #fff;
          display: flex; flex-direction: column;
          align-items: center;
          position: relative; overflow: hidden;
          font-family: 'Nunito Sans', sans-serif;
        }
        .login-blob {
          position: absolute; top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 100%; max-width: 500px; height: 270px;
          background: #28C2A0;
          border-radius: 0 0 50% 50%;
          z-index: 0;
        }
        .login-back {
          position: absolute; top: 18px; left: 18px; z-index: 10;
          background: rgba(255,255,255,0.22); border: none;
          border-radius: 50%; width: 38px; height: 38px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: #fff;
        }
        .login-circle {
          position: relative; z-index: 1; margin-top: 80px;
          width: 150px; height: 150px; border-radius: 50%;
          background: #fff; box-shadow: 0 6px 30px rgba(0,0,0,0.13);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px;
        }
        .login-logo-line { font-family: Nunito,sans-serif; font-weight: 900; font-size: 20px; }
        .login-form {
          position: relative; z-index: 1;
          width: 100%; max-width: 320px;
          padding: 0 24px; margin-top: 36px;
        }
        .login-field { margin-bottom: 26px; }
        .login-label {
          font-size: 13px; font-weight: 700; color: #1A1A1A;
          display: block; margin-bottom: 8px;
        }
        .login-input-wrap {
          display: flex; align-items: center;
          border-bottom: 1.5px solid #E0DED6;
        }
        .login-input {
          flex: 1; padding: 8px 36px 8px 0;
          border: none; outline: none; font-size: 14px;
          font-family: 'Nunito Sans',sans-serif;
          color: #888780; background: transparent;
        }
        .login-input::placeholder { color: #B4B2A9; }
        .login-icon-btn {
          background: none; border: none; cursor: pointer;
          color: #B4B2A9; display: flex; padding: 0; flex-shrink: 0;
        }
        .login-btn {
          width: 100%; padding: 14px; border: none; border-radius: 12px;
          font-family: Nunito,sans-serif; font-weight: 800; font-size: 16px;
          cursor: pointer; margin-bottom: 14px;
          transition: opacity 0.15s, transform 0.1s;
        }
        .login-btn:active { transform: scale(0.98); }
        .login-forgot {
          width: 100%; padding: 10px; background: transparent; border: none;
          color: #888780; font-size: 13px; cursor: pointer;
          font-family: 'Nunito Sans',sans-serif; text-align: center;
        }
        .login-error {
          background: #FCEBEB; border-radius: 10px;
          padding: 10px 14px; font-size: 13px; color: #E24B4A;
          margin-bottom: 16px; text-align: center;
        }

        /* ── TABLETTE ── */
        @media (min-width: 600px) and (max-width: 1023px) {
          .login-blob { height: 310px; }
          .login-circle { width: 180px; height: 180px; margin-top: 100px; }
          .login-logo-line { font-size: 24px; }
          .login-form { max-width: 400px; margin-top: 44px; }
          .login-label { font-size: 15px; }
          .login-input { font-size: 16px; }
          .login-btn { font-size: 18px; padding: 16px; }
        }

        /* ── PC / DESKTOP ── */
        @media (min-width: 1024px) {
          .login-root {
            flex-direction: row; align-items: stretch;
            background: #F8F8F6;
          }
          .login-blob { display: none; }
          .login-back { top: 24px; left: 24px; background: rgba(0,0,0,0.08); color: #1A1A1A; }

          /* Panneau gauche illustratif */
          .login-left {
            flex: 1; min-height: 100vh;
            background: linear-gradient(160deg, #1D9E75 0%, #085041 100%);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 60px; gap: 24px;
          }
          .login-left-tagline {
            color: rgba(255,255,255,0.7); font-size: 13px;
            font-weight: 600; letter-spacing: 0.14em;
            text-transform: uppercase;
          }

          /* Panneau droit formulaire */
          .login-right {
            flex: 1; min-height: 100vh;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 60px; background: #fff;
          }
          .login-card {
            width: 100%; max-width: 420px;
            background: #fff; border-radius: 24px;
            padding: 40px 36px;
            border: 1px solid #E0DED6;
            box-shadow: 0 8px 40px rgba(0,0,0,0.07);
          }
          .login-card-title {
            font-size: 24px; font-weight: 800;
            font-family: Nunito,sans-serif; color: #1A1A1A;
            margin-bottom: 6px;
          }
          .login-card-sub {
            font-size: 14px; color: #888780; margin-bottom: 32px;
          }
          /* Sur PC les inputs ont un fond et un border complet */
          .login-pc .login-input-wrap {
            border: 1.5px solid #E0DED6 !important;
            border-radius: 10px !important;
            padding: 0 14px;
          }
          .login-pc .login-input {
            padding: 11px 8px !important;
          }
          .login-circle { display: none; }
          .login-form { margin-top: 0; padding: 0; max-width: 100%; }
        }
      `}</style>

      <div className="login-root">
        <div className="login-blob"/>

        {/* Bouton retour */}
        <button className="login-back" onClick={() => navigate("/role")}>
          <ArrowLeft size={18}/>
        </button>

        {/* Panneau gauche PC */}
        <div className="login-left" style={{ display:"none" }}>
          <LogoIcon size={130}/>
          <LogoText size={52}/>
          <div className="login-left-tagline">Suivi des enfants en crèche</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginTop:12, textAlign:"center", maxWidth:300, lineHeight:1.6 }}>
            Bienvenue sur KidTrack — la plateforme de suivi quotidien pour votre crèche.
          </div>
        </div>

        {/* Panneau droit PC */}
        <div className="login-right" style={{ display:"contents" }}>
          <div className="login-card" style={{ display:"contents" }}>

            {/* Cercle logo mobile/tablette */}
            <div className="login-circle">
              <LogoIcon size={60}/>
              <div style={{ textAlign:"center", lineHeight:1.1 }}>
                <div className="login-logo-line">
                  <span style={{ color:"#1D9E75" }}>K</span>
                  <span style={{ color:"#D85A30" }}>i</span>
                  <span style={{ color:"#BA7517" }}>d</span>
                </div>
                <div className="login-logo-line">
                  <span style={{ color:"#D85A30" }}>T</span>
                  <span style={{ color:"#1D9E75" }}>r</span>
                  <span style={{ color:"#534AB7" }}>a</span>
                  <span style={{ color:"#E24B4A" }}>c</span>
                  <span style={{ color:"#085041" }}>k</span>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <form className="login-form login-pc" onSubmit={handleSubmit}>

              <div className="login-field">
                <label className="login-label">Nom Utilisateur</label>
                <div className="login-input-wrap">
                  <input className="login-input" type="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="PRAJESH SHAKYA"/>
                  <User size={18} color="#B4B2A9"/>
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">Mot de passe</label>
                <div className="login-input-wrap">
                  <input className="login-input"
                    type={showPass ? "text" : "password"} required
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••••••••••"/>
                  <button type="button" className="login-icon-btn"
                    onClick={() => setShowPass(s => !s)}>
                    {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="login-btn" disabled={loading}
                style={{
                  background: btnColor,
                  color: "#fff",
                  boxShadow: `0 4px 18px ${btnColor}55`,
                  opacity: loading ? 0.75 : 1,
                }}>
                {loading ? "Connexion..." : "Login"}
              </button>

                {/* Boutons de test — à retirer en production */}
                <div style={{
                marginTop: 10, padding: 14, background: "#F8F8F6",
                borderRadius: 12, border: "1px dashed #E0DED6",
                }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#B4B2A9", textAlign: "center", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Test sans backend
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                    ["Éducateur", "edu",    "#1D9E75", "/edu/dashboard"],
                    ["Parent",    "parent", "#D85A30", "/parent/dashboard"],
                    ["Admin",     "admin",  "#534AB7", "/admin/dashboard"],
                    ].map(([label, r, color, path]) => (
                    <button key={r} type="button"
                        onClick={() => {
                        localStorage.setItem("user", JSON.stringify({
                            nom: "Dupont", prenom: "Marie", role: r
                        }));
                        navigate(path);
                        }}
                        style={{
                        padding: "9px 6px", background: color, color: "#fff",
                        border: "none", borderRadius: 10,
                        fontFamily: "Nunito,sans-serif", fontWeight: 700,
                        fontSize: 12, cursor: "pointer",
                        }}>
                        {label}
                    </button>
                    ))}
                </div>
                </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}