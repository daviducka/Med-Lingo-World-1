import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Learn from "@/pages/Learn";
import CourseDetail from "@/pages/CourseDetail";
import LessonQuiz from "@/pages/LessonQuiz";
import HardRound from "@/pages/HardRound";
import Leaderboard from "@/pages/Leaderboard";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/lesson/:lessonId" component={LessonQuiz} />
      <Route path="/hard-round" component={HardRound} />
      
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/learn" component={Learn} />
            <Route path="/learn/:courseId" component={CourseDetail} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/progress" component={Progress} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
