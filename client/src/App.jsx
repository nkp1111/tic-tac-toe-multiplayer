import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"
import {
  LandingPage,
  StartGame,
  JoinGame,
  StartGameSocket,
  StartGameComputer,
} from "./pages";


function App() {

  return (
    <>
      <Toaster limit={5} />
      <Router>
        <Routes>
          <Route path="/" Component={LandingPage} />
          <Route path="/start-game" Component={StartGame} />
          <Route path="/join-game" Component={JoinGame} />
          <Route path="/start-game-socket" Component={StartGameSocket} />
          <Route path="/start-game-computer" Component={StartGameComputer} />
        </Routes>
      </Router>
    </>
  )
}

export default App
