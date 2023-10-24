import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"
import {
  LandingPage,
  StartGame,
  JoinGame,
  StartGameSocket,
} from "./pages";


function App() {

  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" Component={LandingPage} />
          <Route path="/start-game" Component={StartGame} />
          <Route path="/join-game" Component={JoinGame} />
          <Route path="/start-game-socket" Component={StartGameSocket} />
        </Routes>
      </Router>
    </>
  )
}

export default App
