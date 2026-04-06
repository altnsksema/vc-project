import { io } from "socket.io-client";

// Backend 3001'de çalıştığı için burayı sabitliyoruz
const socket = io("http://localhost:3001"); 

export default socket;