import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/feature/ProtectedRoute";
import ExploreRedirect from "./ExploreRedirect";
import LazyRoute from "./LazyRoute";

const NotFound = lazy(() => import("../pages/NotFound"));
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

const routes: RouteObject[] = [
  { path: "/", element: <LazyRoute><Home /></LazyRoute> },
  { path: "/auth", element: <LazyRoute><AuthPage /></LazyRoute> },
  { path: "/auth/reset-password", element: <LazyRoute><ResetPasswordPage /></LazyRoute> },
  { path: "/explore", element: <ExploreRedirect /> },
  { path: "/explore/:category", element: <ExploreRedirect /> },
  { path: "/catalog", element: <LazyRoute><CatalogPage /></LazyRoute> },
  { path: "/catalog/:category", element: <LazyRoute><CatalogPage /></LazyRoute> },
  { path: "/explore/:category/:id", element: <ExploreRedirect /> },
  { path: "/catalog/:category/:id", element: <LazyRoute><ItemDetailPage /></LazyRoute> },
  {
    path: "/dashboard",
    element: <ProtectedRoute><LazyRoute><DashboardPage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/tracker",
    element: <ProtectedRoute><LazyRoute><TrackerPage /></LazyRoute></ProtectedRoute>,
  },
  {
    path: "/tracker/:category",
    element: <ProtectedRoute><LazyRoute><TrackerPage /></LazyRoute></ProtectedRoute>,
  },
  { path: "/settings", element: <ProtectedRoute><LazyRoute><SettingsPage /></LazyRoute></ProtectedRoute> },
  {
    path: "/profile",
    element: <ProtectedRoute><LazyRoute><ProfilePage /></LazyRoute></ProtectedRoute>,
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
  { path: "*", element: <LazyRoute><NotFound /></LazyRoute> },
];

export default routes;
