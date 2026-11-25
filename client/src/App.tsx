import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CampusProgressNotifier from "./components/CampusProgressNotifier";
import { I18nProvider } from "./lib/i18n";

const Notifications = lazy(() => import("@/pages/Notifications"));
const Portal = lazy(() => import("./pages/Portal"));
const Campus = lazy(() => import("./pages/Campus"));
const ProgressPage = lazy(() => import("./pages/Progress"));
const Mentor = lazy(() => import("./pages/Mentor"));
const Services = lazy(() => import("./pages/Services"));

import { useTranslation } from "@/lib/i18n";

// GitHub Pages serves the app from /<repo>/ while Vercel serves it from /.
// BASE_URL carries the base the build was made for, so strip the trailing
// slash and hand wouter the prefix; on Vercel this resolves to "" and the
// routes behave exactly as before.
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function RouteFallback() {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-screen place-items-center bg-[#071016] p-6 text-sm text-white/60"
    >
      {t("loading")}
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/campus"} component={Campus} />
        <Route path={"/progress"} component={ProgressPage} />
        <Route path={"/mentor"} component={Mentor} />
        <Route path={"/services"} component={Services} />
        <Route path={"/notifications"} component={Notifications} />
        <Route path={"/record"}>{() => <Portal section="record" />}</Route>
        <Route path={"/credentials"}>{() => <Portal section="credentials" />}</Route>
        <Route path={"/research"}>{() => <Portal section="research" />}</Route>
        <Route path={"/faculty"}>{() => <Portal section="faculty" />}</Route>
        <Route path={"/admin"}>{() => <Portal section="admin" />}</Route>
        <Route path={"/settings"}>{() => <Portal section="settings" />}</Route>
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function AppContent() {
  const { t } = useTranslation();
  return (
    <WouterRouter base={basePath}>
      <ErrorBoundary>
        <ThemeProvider
          defaultTheme="dark"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <CampusProgressNotifier />
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#b8f36b] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#071016]"
              >
                {t("skip.content")}
              </a>
              <div id="main" tabIndex={-1} className="outline-none">
                <Router />
              </div>
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </WouterRouter>
  );
}

// All translation hooks must run below the provider, including the skip link.
function App() {
  return <I18nProvider><AppContent /></I18nProvider>;
}

export default App;
