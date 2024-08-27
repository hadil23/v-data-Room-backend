const { Server } = require("socket.io");

const setupSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
  
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

   
    socket.on("typing", (data) => {
      if (onlineUsers.has(data.recipientId)) {
        const recipientSocketId = onlineUsers.get(data.recipientId);
        socket.to(recipientSocketId).emit("typing", {
          senderId: data.senderId,
          isTyping: data.isTyping,
        });
      } else {
        console.log("Recipient not found in onlineUsers map");
      }
    });

  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.recepientId);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-receive", data);
      }
    });
  });
};

module.exports = setupSockets;
