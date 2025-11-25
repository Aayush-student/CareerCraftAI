import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import ResumeBuilder from "./pages/ResumeBuilder";
import ATSChecker from "./pages/AtsChecker";
import JobAggregator from "./pages/JobAggregator";
import CareerRoadmapGenerator from "./pages/CareerRoadmapGenerator";
import LinkedinPostGenerator from "./pages/LinkedinPostGenerator";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/ats-checker" element={<ATSChecker />} />
          <Route path="/find-jobs" element={<JobAggregator />} />
          <Route path="/roadmaps" element={<CareerRoadmapGenerator />} />
          <Route path="/linkedin-post-generator" element={<LinkedinPostGenerator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
