"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Header from "../components/Layout/Header"
import { useSelector } from "react-redux"
import socketIO from "socket.io-client"
import { format } from "timeago.js"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai"
import { TfiGallery } from "react-icons/tfi"
import styles from "../styles/styles"

// Add your server URL here
const server = process.env.REACT_APP_BACKEND_URL 
const ENDPOINT = "https://multivendor-socket.vercel.app"

const UserInboxPage = () => {
  const { user } = useSelector((state) => state.user)
  const [conversations, setConversations] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [currentChat, setCurrentChat] = useState()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [userData, setUserData] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [activeStatus, setActiveStatus] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)
  const socketRef = useRef(null)
  const navigate = useNavigate()

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      socketRef.current = socketIO(ENDPOINT, { transports: ["websocket"] })

      socketRef.current.on("getMessage", (data) => {
        console.log("Message received:", data)
        setArrivalMessage({
          _id: data.messageId || Date.now().toString(),
          sender: data.senderId,
          text: data.text,
          images: data.images,
          createdAt: Date.now(),
          seen: false,
        })
      })

      socketRef.current.on("messageSeen", (data) => {
        console.log("Message seen:", data)
        setMessages((prev) =>
          prev.map((message) =>
            message._id === data.messageId || message.id === data.messageId ? { ...message, seen: true } : message,
          ),
        )
      })

      // Add user to socket
      socketRef.current.emit("addUser", user._id)
      socketRef.current.on("getUsers", (data) => {
        console.log("Online users:", data)
        setOnlineUsers(data)
      })

      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully")
      })

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected")
      })
    }

    // Cleanup socket connection
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [user])

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${server}/conversation/get-all-conversation-user/${user?._id}`, {
          withCredentials: true,
        })
        setConversations(response.data.conversations)
      } catch (error) {
        console.error("Error fetching conversations:", error)
      }
    }

    if (arrivalMessage) {
      fetchConversations()

      if (currentChat?.members.includes(arrivalMessage.sender)) {
        setMessages((prev) => [...prev, arrivalMessage])

        // Mark message as seen immediately if chat is open
        setTimeout(() => {
          if (socketRef.current && currentChat) {
            socketRef.current.emit("messageSeen", {
              senderId: arrivalMessage.sender,
              receiverId: user._id,
              messageId: arrivalMessage._id,
            })
          }
        }, 1000)
      }
    }
  }, [arrivalMessage, currentChat, user?._id])

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(`${server}/conversation/get-all-conversation-user/${user?._id}`, {
          withCredentials: true,
        })
        setConversations(response.data.conversations)
      } catch (error) {
        console.error("Error fetching conversations:", error)
      }
    }

    if (user) {
      getConversation()
    }
  }, [user, messages])

  const onlineCheck = useCallback(
    (chat) => {
      const chatMembers = chat.members.find((member) => member !== user?._id)
      const online = onlineUsers.find((onlineUser) => onlineUser.userId === chatMembers)
      return online ? true : false
    },
    [onlineUsers, user],
  )

  // Get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(`${server}/message/get-all-messages/${currentChat?._id}`)
        setMessages(response.data.messages)
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    if (currentChat) {
      getMessage()
    }
  }, [currentChat])

  // Mark messages as seen when opening chat
  useEffect(() => {
    if (currentChat && messages.length > 0) {
      const unseenMessages = messages.filter((message) => message.sender !== user._id && !message.seen)

      unseenMessages.forEach((message) => {
        if (socketRef.current) {
          socketRef.current.emit("messageSeen", {
            senderId: message.sender,
            receiverId: user._id,
            messageId: message._id || message.id,
          })
        }
      })
    }
  }, [currentChat, messages, user._id])

  // Update last message function
  const updateLastMessage = async (lastMsg) => {
    try {
      await axios.put(`${server}/conversation/update-last-message/${currentChat?._id}`, {
        lastMessage: lastMsg,
        lastMessageId: user?._id,
      })
    } catch (error) {
      console.error("Error updating last message:", error)
    }
  }

  // Create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    }

    const receiverId = currentChat.members.find((member) => member !== user?._id)

    try {
      // Save message to database first
      const response = await axios.post(`${server}/message/create-new-message`, message)

      // Add to local messages
      setMessages((prev) => [...prev, response.data.message])

      // Send via socket with the actual message data
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", {
          senderId: user?._id,
          receiverId,
          text: newMessage,
          messageId: response.data.message._id,
        })
      }

      updateLastMessage(newMessage)
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show loading state immediately
    setLoading(true)

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        imageSendingHandler(reader.result)
      }
    }
    reader.onerror = () => {
      console.error("Error reading file")
      setLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const imageSendingHandler = async (imageData) => {
    const receiverId = currentChat.members.find((member) => member !== user._id)

    try {
      // Save image message to database first
      const response = await axios.post(`${server}/message/create-new-message`, {
        sender: user._id,
        conversationId: currentChat._id,
        images: imageData,
      })

      // Add to local messages
      setMessages((prev) => [...prev, response.data.message])

      // Send via socket with the actual Cloudinary URL
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", {
          senderId: user?._id,
          receiverId,
          images: response.data.message.images, // Send the actual Cloudinary URL
          messageId: response.data.message._id,
        })
        
      }

      updateLastMessage("Photo")
      setLoading(false)
    } catch (error) {
      console.error("Error sending image:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="w-full">
      {!open && (
        <>
          <Header />
          <h1 className="text-center text-[30px] py-3 font-Poppins">All Messages</h1>
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={item._id || index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user?._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
                loading={loading}
              />
            ))}
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={user._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
          loading={loading}
        />
      )}
    </div>
  )
}

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading,
}) => {
  const [active, setActive] = useState(0)
  const [user, setUser] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setActiveStatus(online)
    const userId = data.members.find((id) => id !== me)
    const getUserData = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`)
        setUserData(res.data.shop)
        setUser(res.data.shop)
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }
    getUserData()
  }, [me, online, setActiveStatus, data])

  const handleClick = (id) => {
    navigate(`/inbox?${id}`)
    setOpen(true)
  }

  return (
    <div
      className={`w-full flex p-3 px-3 ${active === index ? "bg-[#00000010]" : "bg-transparent"} cursor-pointer`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="relative">
        <img
          src={
            user?.avatar?.url ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" ||
            "/placeholder.svg"
          }
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          {!loading && data?.lastMessageId !== userData?._id ? "You:" : userData?.name?.split(" ")[0] + ": "}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  )
}

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
  loading,
}) => {
  return (
    <div className="w-[full] min-h-full flex flex-col justify-between p-5">
      {/* message header */}
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src={
              userData?.avatar?.url ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" ||
              "/placeholder.svg"
            }
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight size={20} className="cursor-pointer" onClick={() => setOpen(false)} />
      </div>

      {/* messages */}
      <div className="px-3 h-[75vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => (
            <div
              className={`flex w-full my-2 ${item.sender === sellerId ? "justify-end" : "justify-start"}`}
              ref={index === messages.length - 1 ? scrollRef : null}
              key={item._id || item.id || index}
            >
              {item.sender !== sellerId && (
                <img
                  src={
                    userData?.avatar?.url ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" ||
                    "/placeholder.svg"
                  }
                  className="w-[40px] h-[40px] rounded-full mr-3"
                  alt=""
                />
              )}
              <div className="flex flex-col">
                {item.images && (
                  <div className="relative">
                    <img
                      src={item.images?.url || "/placeholder.svg"}
                      className="w-[300px] h-[300px] object-cover rounded-[10px] ml-2 mb-2"
                      alt="Message Image"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=300&width=300"
                      }}
                    />
                    <div className="flex items-center gap-2 justify-end mt-1 mr-2">
                      <p className="text-[12px] text-[#000000d3]">{format(item.createdAt)}</p>
                      {item.sender === sellerId && (
                        <span className={`text-[12px] ${item.seen ? "text-blue-500" : "text-gray-500"}`}>
                          {item.seen ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {item.text && (
                  <div>
                    <div
                      className={`w-max p-2 rounded ${
                        item.sender === sellerId ? "bg-[#000]" : "bg-[#38c776]"
                      } text-[#fff] h-min`}
                    >
                      <p>{item.text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] text-[#000000d3] pt-1">{format(item.createdAt)}</p>
                      {item.sender === sellerId && (
                        <span className={`text-[12px] ${item.seen ? "text-blue-500" : "text-gray-500"}`}>
                          {item.seen ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-gray-200 p-2 rounded flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              <p>Uploading image...</p>
            </div>
          </div>
        )}
      </div>

      {/* send message input */}
      <form className="p-3 relative w-full flex justify-between items-center" onSubmit={sendMessageHandler}>
        <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
            disabled={loading}
          />
          <label htmlFor="image">
            <TfiGallery className={`cursor-pointer ${loading ? "opacity-50" : ""}`} size={20} />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
            disabled={loading}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend size={20} className="absolute right-4 top-5 cursor-pointer" />
          </label>
        </div>
      </form>
    </div>
  )
}

export default UserInboxPage
