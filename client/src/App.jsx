import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  LandingPage,
  StartGame,
} from "./pages";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={LandingPage} />
        </Routes>
      </Router>
    </>
  )
}

export default App
