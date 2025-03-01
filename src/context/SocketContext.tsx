/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { LocalStorage } from "../utils"; 

// Function to establish a socket connection with authorization token
const getSocket = () => {
 // Create a connection to the SignalR Hub
 var token = LocalStorage.get('token');
 if(!token) return null;
 const connection = new signalR.HubConnectionBuilder()
 .withUrl(import.meta.env.VITE_SOCKET_URI, { accessTokenFactory: () => token}) // Your SignalR server URL
 .build();

// Start the connection and handle any errors
connection.start()
 .then(() => {
   console.log("Connected to the server.");
   // Optionally, you can send a message after connecting
   connection.invoke("SendMessage", "Client", "Hello from the client!")
     .catch(err => console.error('Error sending message: ', err));
 })
 .catch(err => {
   console.error("Error while starting connection: ", err);
 });

// Cleanup the connection when the component unmounts
// return () => {
//  connection.stop().catch(err => console.error('Error while stopping connection: ', err));
// };
return connection;
};

// Create a context to hold the socket instance
const SocketContext = createContext<{
  socket: signalR.HubConnection | null;
}>({
  socket: null,
});

// Custom hook to access the socket instance from the context
const useSocket = () => useContext(SocketContext);

// SocketProvider component to manage the socket instance and provide it through context
const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to store the socket instance
  const [socket, setSocket] = useState<signalR.HubConnection | null>(
    null
  );

  // Set up the socket connection when the component mounts
  useEffect(() => {
    setSocket(getSocket());
  }, []);

  return (
    // Provide the socket instance through context to its children
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Export the SocketProvider component and the useSocket hook for other components to use
export { SocketProvider, useSocket };
