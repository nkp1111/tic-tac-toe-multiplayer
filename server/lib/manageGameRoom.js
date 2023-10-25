
const { v4 } = require("uuid");
const { gameTask } = require("./gameTask");

/**
 * @desc Creates a new game room for 2 players 
 * @param {object} rooms - game room in which two user are connected 
 * @param {*} socketId - socket id of the user create game room
 * @returns 
 */
function createGameRoom(rooms, socketId) {

}


function joinGameRoom(rooms, gameRoomId, socketId) {

}


function leaveGameRoom(rooms, gameRoomId, socketId) {

}


function leftGameRoom(rooms, socketId) {

}


module.exports = {
  createGameRoom,
  leaveGameRoom,
  leftGameRoom,
  joinGameRoom,
}