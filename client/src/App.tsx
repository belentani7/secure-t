import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const Notifications = lazy(() => import("@/pages/Notifications"));
const Portal = lazy(() => import("./pages/Portal"));
const Campus = lazy(() => import("./pages/Campus"));
const ProgressPage = lazy(() => import("./pages/Progress"));
const Mentor = lazy(() => import("./pages/Mentor"));

function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-screen place-items-center bg-[#071016] p-6 text-sm text-white/60"
    >
      Loading secure T…
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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#b8f36b] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#071016]"
          >
            Skip to content
          </a>
          <div id="main" tabIndex={-1} className="outline-none">
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
