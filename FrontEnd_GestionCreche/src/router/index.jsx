import { createBrowserRouter } from "react-router-dom";

// Auth
import Splash                from "../pages/auth/Splash";
import ChoixRole             from "../pages/auth/ChoixRole";
import Login                 from "../pages/auth/Login";

// Éducateur
import DashEdu               from "../pages/educateur/Dashboard";
import EduEnfants            from "../pages/educateur/Enfants";
import FicheEnfant           from "../pages/educateur/FicheEnfant";
import Presences             from "../pages/educateur/Presences";
import Suivi                 from "../pages/educateur/Suivi";
import Incidents             from "../pages/educateur/Incidents";
import Messagerie            from "../pages/educateur/Messagerie";

// Parent
import DashParent            from "../pages/parent/Dashboard";
import MonEnfant             from "../pages/parent/MonEnfant";
import Journal               from "../pages/parent/Journal";
import Factures              from "../pages/parent/Factures";
import SignalerAbsence       from "../pages/parent/SignalerAbsence";

// Admin
import DashAdmin             from "../pages/admin/Dashboard";
import AdminEnfants          from "../pages/admin/Enfants";
import AdminFormulaireEnfant from "../pages/admin/FormulaireEnfant";
import Groupes               from "../pages/admin/Groupes";
import Utilisateurs          from "../pages/admin/Utilisateurs";
import Facturation           from "../pages/admin/Facturation";
import Tarifs                from "../pages/admin/Tarifs";
import Annonces              from "../pages/admin/Annonces";
import Rapports              from "../pages/admin/Rapports";

// Partagé
import Profil                from "../pages/Profil";

export const router = createBrowserRouter([

  // ── Auth ──
  { path: "/",                            element: <Splash /> },
  { path: "/role",                        element: <ChoixRole /> },
  { path: "/login",                       element: <Login /> },

  // ── Éducateur ──
  { path: "/edu/dashboard",              element: <DashEdu /> },
  { path: "/edu/enfants",                element: <EduEnfants /> },
  { path: "/edu/enfants/:id",            element: <FicheEnfant /> },
  { path: "/edu/presences",              element: <Presences /> },
  { path: "/edu/suivi",                  element: <Suivi /> },
  { path: "/edu/incidents",              element: <Incidents /> },
  { path: "/edu/messagerie",             element: <Messagerie /> },
  { path: "/edu/profil",                 element: <Profil role="edu" /> },

  // ── Parent ──
  { path: "/parent/dashboard",           element: <DashParent /> },
  { path: "/parent/mon-enfant",          element: <MonEnfant /> },
  { path: "/parent/journal",             element: <Journal /> },
  { path: "/parent/messagerie",          element: <Messagerie /> },
  { path: "/parent/factures",            element: <Factures /> },
  { path: "/parent/signaler-absence",    element: <SignalerAbsence /> },
  { path: "/parent/profil",              element: <Profil role="parent" /> },

  // ── Admin ──
  { path: "/admin/dashboard",            element: <DashAdmin /> },
  { path: "/admin/enfants",              element: <AdminEnfants /> },
  { path: "/admin/enfants/nouveau",      element: <AdminFormulaireEnfant /> },
  { path: "/admin/enfants/:id",          element: <AdminFormulaireEnfant /> },
  { path: "/admin/enfants/:id/modifier", element: <AdminFormulaireEnfant /> },
  { path: "/admin/groupes",              element: <Groupes /> },
  { path: "/admin/utilisateurs",         element: <Utilisateurs /> },
  { path: "/admin/facturation",          element: <Facturation /> },
  { path: "/admin/tarifs",               element: <Tarifs /> },
  { path: "/admin/annonces",             element: <Annonces /> },
  { path: "/admin/rapports",             element: <Rapports /> },
  { path: "/admin/profil",               element: <Profil role="admin" /> },
]);