import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./pages/HomePage";
import { PoemsPage } from "./pages/PoemsPage";
import { PoemDetailPage } from "./pages/PoemDetailPage";
import { StoriesPage } from "./pages/StoriesPage";
import { StoryDetailPage } from "./pages/StoryDetailPage";
import { GamesPage } from "./pages/GamesPage";
import { EducationPage } from "./pages/EducationPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminPoems } from "./pages/admin/AdminPoems";
import { AdminStories } from "./pages/admin/AdminStories";
import { AdminGames } from "./pages/admin/AdminGames";
import { AdminModules } from "./pages/admin/AdminModules";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import { Footer } from "./components/Footer";

const queryClient = new QueryClient();

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const poemsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/poems",
  component: PoemsPage,
});

const poemDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/poems/$id",
  component: PoemDetailPage,
});

const storiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stories",
  component: StoriesPage,
});

const storyDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stories/$id",
  component: StoryDetailPage,
});

const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games",
  component: GamesPage,
});

const educationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/education",
  component: EducationPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  ),
});

const adminPoemsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/poems",
  component: () => (
    <ProtectedAdminRoute>
      <AdminPoems />
    </ProtectedAdminRoute>
  ),
});

const adminStoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/stories",
  component: () => (
    <ProtectedAdminRoute>
      <AdminStories />
    </ProtectedAdminRoute>
  ),
});

const adminGamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/games",
  component: () => (
    <ProtectedAdminRoute>
      <AdminGames />
    </ProtectedAdminRoute>
  ),
});

const adminModulesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/modules",
  component: () => (
    <ProtectedAdminRoute>
      <AdminModules />
    </ProtectedAdminRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  poemsRoute,
  poemDetailRoute,
  storiesRoute,
  storyDetailRoute,
  gamesRoute,
  educationRoute,
  adminRoute,
  adminPoemsRoute,
  adminStoriesRoute,
  adminGamesRoute,
  adminModulesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
