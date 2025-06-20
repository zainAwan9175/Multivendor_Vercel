const socketIO = require("socket.io")
const app = require("express")()
const http = require("http")
const cors = require("cors")
const server = http.createServer(app)
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 5e6, // Increase buffer size to 5MB for image transfer
})

app.use(cors())
require("dotenv").config({
  path: "./.env",
})

app.get("/", (req, res) => {
  res.send("Hello world!")
})

let users = []

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId })
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId)
}

// Define a Message Object with a Seen PROP
const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
})

io.on("connection", (socket) => {
  // when connect
  console.log("a user is connected!", socket.id)

  // take user and socket id for the User
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id)
    io.emit("getUsers", users)
    console.log("User added:", userId, "Socket:", socket.id)
  })

  // send and get Message
  const messages = {} // object to track messages sent to each other
  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    console.log("Message received:", {       
      senderId,
      receiverId,
      text: text ? "text message" : null,
      images: images ? "has image" : null,
    })

    const message = createMessage({ senderId, receiverId, text, images })
    const user = getUser(receiverId)

    if (!messages[receiverId]) {
      messages[receiverId] = [message]
    } else {
      messages[receiverId].push(message)
    }

    // send the message to receiver
    if (user) {
      io.to(user.socketId).emit("getMessage", message)
      console.log("Message sent to:", receiverId)
    } else {
      console.log("User not found:", receiverId)
    }
  })

  socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
    const user = getUser(senderId)
    // update the seen flag for the message
    if (messages[senderId]) {
      const message = messages[senderId].find(
        (message) => message.receiverId === receiverId && message.id === messageId,
      )
      if (message) {
        message.seen = true
        // send a message seen event to the Sender
        if (user) {
          io.to(user.socketId).emit("messageSeen", {
            senderId,
            receiverId,
            messageId,
          })
        }
      }
    }
  })

  // Update and get the last message
  socket.on("updateLastMessage", ({ lastMessage, lastMessageId }) => {
    io.emit("getLastMessage", {
      lastMessage,
      lastMessageId,
    })
  })

  // when socket will disconnected
  socket.on("disconnect", () => {
    console.log(`a user is disconnected!`, socket.id)
    removeUser(socket.id)
    io.emit("getUsers", users)
  })
})

server.listen(8000, () => {
  console.log('Socket server running on port 8000')
})
