import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import BackgroundMusic from "@/components/BackgroundMusic";

import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Learn from "@/pages/Learn";
import CourseDetail from "@/pages/CourseDetail";
import LessonQuiz from "@/pages/LessonQuiz";
import HardRound from "@/pages/HardRound";
import Leaderboard from "@/pages/Leaderboard";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import Flashcards from "@/pages/Flashcards";
import StudyNotes from "@/pages/StudyNotes";
import ExamPrep from "@/pages/ExamPrep";
import AiDoctor from "@/pages/AiDoctor";
import ElNotes from "@/pages/ElNotes";
import GerardGames from "@/pages/GerardGames";
import Certificates from "@/pages/Certificates";
import Pricing from "@/pages/Pricing";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PayPalReturn from "@/pages/PayPalReturn";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/lesson/:lessonId" component={LessonQuiz} />
      <Route path="/hard-round" component={HardRound} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/paypal-return" component={PayPalReturn} />

      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/learn" component={Learn} />
            <Route path="/learn/:courseId" component={CourseDetail} />
            <Route path="/flashcards" component={Flashcards} />
            <Route path="/study-notes" component={StudyNotes} />
            <Route path="/exam-prep" component={ExamPrep} />
            <Route path="/ai-doctor" component={AiDoctor} />
            <Route path="/notes" component={ElNotes} />
            <Route path="/games" component={GerardGames} />
            <Route path="/certificates" component={Certificates} />
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
        <BackgroundMusic />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
