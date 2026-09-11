import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Notifications from "@/pages/Notifications";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { CoursesGallery } from "@/components/CoursesGallery";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";
import Portal from "./pages/Portal";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/courses"} component={CoursesGallery} />
      <Route path={"/lesson/:id"}>{params => <Lesson lessonId={params.id} />}</Route>
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
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
