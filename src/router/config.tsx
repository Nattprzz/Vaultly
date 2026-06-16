/**
 * config.tsx — tabla de rutas de la aplicación Vaultly.
 *
 * Define todas las rutas públicas y privadas usando React Router v6.
 * Las páginas se cargan con lazy() para generar chunks separados por ruta,
 * reduciendo el bundle inicial. Cada ruta privada se envuelve en ProtectedRoute
 * y cada componente lazy en LazyRoute para el fallback de carga.
 *
 * Las rutas /explore/* son aliases legacy que redirigen a /catalog/* para
 * mantener la compatibilidad de enlaces externos anteriores al renombrado.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { lazy } from "react";

// ─── Librerías externas ───────────────────────────────────────────────────────

import { Navigate, type RouteObject } from "react-router-dom";

// ─── Componentes ─────────────────────────────────────────────────────────────

import ProtectedRoute from "../components/feature/ProtectedRoute";
import ExploreRedirect from "./ExploreRedirect";
import LazyRoute from "./LazyRoute";

// ─── Páginas (lazy) ───────────────────────────────────────────────────────────

const Error403  = lazy(() => import("../pages/error/403"));
const Error404  = lazy(() => import("../pages/error/404"));
const Error500  = lazy(() => import("../pages/error/500"));
const Error503  = lazy(() => import("../pages/error/503"));
const Home = lazy(() => import("../pages/home/page"));
const AuthPage = lazy(() => import("../pages/auth/page"));
const CatalogPage = lazy(() => import("../pages/catalog/page"));
const DashboardPage = lazy(() => import("../pages/dashboard/page"));
const ItemDetailPage = lazy(() => import("../pages/catalog/detail/page"));
const TrackerPage = lazy(() => import("../pages/tracker/page"));
const SettingsPage = lazy(() => import("../pages/settings/page"));
const ProfilePage = lazy(() => import("../pages/profile/page"));
const PublicProfilePage = lazy(() => import("../pages/public-profile/page"));
const AdminPage = lazy(() => import("../pages/admin/page"));
const ResetPasswordPage = lazy(() => import("../pages/auth/reset-password/page"));
const PrivacyPage = lazy(() => import("../pages/privacy/page"));
const TermsPage = lazy(() => import("../pages/terms/page"));
const ContactPage = lazy(() => import("../pages/contact/page"));
const CompanyPage   = lazy(() => import("../pages/company/page"));
const CastPage      = lazy(() => import("../pages/cast/page"));
const FranchisePage = lazy(() => import("../pages/franchise/page"));

// ─── Rutas ───────────────────────────────────────────────────────────────────

const routes: RouteObject[] = [
  { path: "/", element: <LazyRoute><Home /></LazyRoute> },
  { path: "/auth", element: <LazyRoute><AuthPage /></LazyRoute> },
  { path: "/reset-password", element: <LazyRoute><ResetPasswordPage /></LazyRoute> },
  { path: "/auth/reset-password", element: <LazyRoute><ResetPasswordPage /></LazyRoute> },
  { path: "/explore", element: <ExploreRedirect /> },
  { path: "/explore/:category", element: <ExploreRedirect /> },
  { path: "/catalog", element: <LazyRoute><CatalogPage /></LazyRoute> },
  { path: "/catalog/:category", element: <LazyRoute><CatalogPage /></LazyRoute> },
  { path: "/explore/:category/:id", element: <ExploreRedirect /> },
  { path: "/catalog/:category/:id", element: <LazyRoute><ItemDetailPage /></LazyRoute> },
  {
    path: "/dashboard",
    element: <ProtectedRoute requireUser><LazyRoute><DashboardPage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/tracker",
    element: <ProtectedRoute requireUser><LazyRoute><TrackerPage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/tracker/:category",
    element: <ProtectedRoute requireUser><LazyRoute><TrackerPage /></LazyRoute></ProtectedRoute>,
  },
  { path: "/settings", element: <ProtectedRoute><LazyRoute><SettingsPage /></LazyRoute></ProtectedRoute> },
  {
    path: "/profile",
    element: <ProtectedRoute requireUser><LazyRoute><ProfilePage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/admin",
    element: <ProtectedRoute requireAdmin><LazyRoute><AdminPage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/admin/users",
    element: <ProtectedRoute requireAdmin><LazyRoute><AdminPage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/admin/catalog",
    element: <ProtectedRoute requireAdmin><LazyRoute><AdminPage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/admin/reviews",
    element: <ProtectedRoute requireAdmin><LazyRoute><AdminPage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/admin/entities",
    element: <ProtectedRoute requireAdmin><LazyRoute><AdminPage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/admin/reports",
    element: <ProtectedRoute requireAdmin><LazyRoute><AdminPage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/admin/audit",
    element: <ProtectedRoute requireAdmin><LazyRoute><AdminPage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/admin/overview",
    element: <ProtectedRoute requireAdmin><LazyRoute><AdminPage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/admin/settings",
    element: <ProtectedRoute requireAdmin><LazyRoute><AdminPage /></LazyRoute></ProtectedRoute>,
  },
  { path: "/u/:username", element: <LazyRoute><PublicProfilePage /></LazyRoute> },
  { path: "/person/:id", element: <Navigate to="/catalog" replace /> },
  { path: "/entity/:slug", element: <Navigate to="/catalog" replace /> },
  { path: "/entities", element: <Navigate to="/catalog" replace /> },
  { path: "/compare", element: <Navigate to="/catalog" replace /> },
  { path: "/privacy", element: <LazyRoute><PrivacyPage /></LazyRoute> },
  { path: "/terms", element: <LazyRoute><TermsPage /></LazyRoute> },
  { path: "/contact", element: <LazyRoute><ContactPage /></LazyRoute> },
  { path: "/company/:slug",   element: <LazyRoute><CompanyPage /></LazyRoute>   },
  { path: "/cast/:slug",      element: <LazyRoute><CastPage /></LazyRoute>      },
  { path: "/franchise/:slug", element: <LazyRoute><FranchisePage /></LazyRoute> },
  { path: "/403", element: <LazyRoute><Error403 /></LazyRoute> },
  { path: "/404", element: <LazyRoute><Error404 /></LazyRoute> },
  { path: "/500", element: <LazyRoute><Error500 /></LazyRoute> },
  { path: "/503", element: <LazyRoute><Error503 /></LazyRoute> },
  { path: "*",    element: <LazyRoute><Error404 /></LazyRoute> },
];

export default routes;
