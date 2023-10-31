import React from "react";
import { FaPersonPraying } from "react-icons/fa6"
import { MdOutlineComputer } from "react-icons/md"

export default function SelectGameMode(
  { gameMode, setGameMode }
) {

  return (
    <div className="my-6">
      <h2 className="text-3xl text-error font-semibold text-center mt-10 mb-3">Select game mode</h2>
      <div className="flex place-items-center justify-around gap-5 flex-col sm:flex-row">
        <div className={`${gameMode === "human" ? "scale-100 text-neutral" : "scale-90 text-dark"}`}>
          <label htmlFor="human"
            className="btn btn-primary">
            <FaPersonPraying className="text-xl" />
            Human</label>
          <input type="radio" value={"human"} name="gameMode" id="human"
            className="hidden"
            onChange={(e) => setGameMode(() => e.target.value)} />
        </div>

        <div className={`${gameMode === "computer" ? "scale-100 text-neutral" : "scale-90 text-dark"}`}>
          <label htmlFor="computer"
            className="btn btn-secondary">
            <MdOutlineComputer className="text-2xl" />
            Computer</label>
          <input type="radio" value={"computer"} name="gameMode" id="computer"
            className="hidden"
            onChange={(e) => setGameMode(() => e.target.value)} />
        </div>
      </div>
    </div>
  )
}
