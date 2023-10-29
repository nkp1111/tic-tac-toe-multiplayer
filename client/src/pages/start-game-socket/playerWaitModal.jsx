/* eslint-disable no-unused-vars */
import React from 'react'
import toast from 'react-hot-toast';

const modalOpenStyles = "block bg-neutral absolute"
const modalCloseStyles = "hidden"

export default function PlayerWaitModal(
  // eslint-disable-next-line react/prop-types
  { gameRoomId, gameStats: { startGame }, socket, navigate }
) {
  return (
    <div className={`text-white bg-neutral card p-4 absolute md:w-1/2 md:left-1/3 top-5 z-20 w-auto left-5 right-5 ${!startGame ? modalOpenStyles : modalCloseStyles}`}>
      <div className="flex flex-col mt-1 justify-center align-middle text-center">
        <h3 className='font-bold text-2xl'>Waiting for Player to connect <span className='animate-ping'>...</span></h3>
        <p>Give your friend the following room Id to connect</p>
        <hr className='w-1/2 my-5 mx-auto' />
        <p className='text-2xl'>{gameRoomId}</p>
        <button className='btn btn-info mx-auto mt-4 px-5'
          onClick={() => {
            navigator.clipboard.writeText(gameRoomId);
            toast.success(`Copied game room id \n${gameRoomId}`);
          }}>Copy</button>
      </div>
      {/* leave game room  */}
      <div className='flex justify-end mb-10 absolute top-3 right-3'>
        <button className='btn btn-error rounded-full font-bold text-lg'
          title='Leave this Game'
          aria-label='Leave this game'
          onClick={() => {
            // eslint-disable-next-line react/prop-types
            socket.emit("leaveGameRoom", [socket.gameRoom])
            navigate("/")
          }}>X</button>
      </div>
    </div>
  )
}

