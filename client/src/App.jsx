import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  LandingPage,
  StartGame,
  StartGameSocket,
} from "./pages";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={LandingPage} />
          <Route path="/start-game" Component={StartGame} />
          <Route path="/start-game-socket" Component={StartGameSocket} />
        </Routes>
      </Router>
    </>
  )
}

export default App
