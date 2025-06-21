"use client"

import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { TfiGallery } from "react-icons/tfi"
import { format } from "timeago.js"
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai"
import styles from "../../styles/styles"
import SocketIO from "socket.io-client"

const ENDPOINTS = "https://multivendor-socket.vercel.app";

const server = process.env.REACT_APP_BACKEND_URL

const DashBoardMessages = () => {
  const [open, setOpen] = useState(false)
  const [conversation, setConversation] = useState([])
  const { seller } = useSelector((state) => state.seller)
  const [arivalMessage, setArivalMessage] = useState(null)
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newmessage, setNewMessage] = useState("")
  const [userData, setUserData] = useState(null)
  const [activestatus, setActiveStatus] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)
  const socketRef = useRef(null)

  // Initialize socket connection
  useEffect(() => {
    if (seller) {
      socketRef.current = SocketIO(ENDPOINTS, { transports: ["websocket"] })

      socketRef.current.on("getMessage", (data) => {
        console.log("Message received:", data)
        setArivalMessage({
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

      // Add seller to socket
      socketRef.current.emit("addUser", seller._id)
      socketRef.current.on("getUsers", (data) => {
        setOnlineUsers(data)
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [seller])

  useEffect(() => {
    if (arivalMessage) {
      const getAllConversations = async () => {
        try {
          const res = await axios.get(`${server}/conversation/get-all-conversation-seller/${seller._id}`, {
            withCredentials: true,
          })
          setConversation(res.data.conversations)
        } catch (error) {
          console.log(error)
        }
      }
      getAllConversations()

      if (currentChat?.members.includes(arivalMessage.sender)) {
        setMessages((prev) => [...prev, arivalMessage])

        // Mark message as seen immediately if chat is open
        setTimeout(() => {
          if (socketRef.current && currentChat) {
            socketRef.current.emit("messageSeen", {
              senderId: arivalMessage.sender,
              receiverId: seller._id,
              messageId: arivalMessage._id,
            })
          }
        }, 1000)
      }
    }
  }, [arivalMessage, currentChat, seller._id])

  useEffect(() => {
    const getAllConversations = async () => {
      try {
        const res = await axios.get(`${server}/conversation/get-all-conversation-seller/${seller._id}`, {
          withCredentials: true,
        })
        setConversation(res.data.conversations)
      } catch (error) {
        console.log(error)
      }
    }
    getAllConversations()
  }, [seller._id, messages])

  // Get Messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat?._id) {
          const response = await axios.get(`${server}/message/get-all-messages/${currentChat?._id}`)
          setMessages(response.data.messages)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getMessages()
  }, [currentChat])

  // Mark messages as seen when opening chat
  useEffect(() => {
    if (currentChat && messages.length > 0) {
      const unseenMessages = messages.filter((message) => message.sender !== seller._id && !message.seen)

      unseenMessages.forEach((message) => {
        if (socketRef.current) {
          socketRef.current.emit("messageSeen", {
            senderId: message.sender,
            receiverId: seller._id,
            messageId: message._id || message.id,
          })
        }
      })
    }
  }, [currentChat, messages, seller._id])

  const onLineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller._id)
    const online = onlineUsers.find((user) => user.userId === chatMembers)
    return online ? true : false
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessageHandler = async (e) => {
    e.preventDefault()

    if (!newmessage.trim()) return

    const message = {
      sender: seller._id,
      text: newmessage,
      conversationId: currentChat?._id,
    }

    const reciverId = currentChat.members.find((member) => member !== seller._id)

    try {
      // Save message to database first
      const res = await axios.post(`${server}/message/create-new-message`, message)

      // Add to local messages
      setMessages((prev) => [...prev, res.data.message])

      // Send via socket with the actual message data
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", {
          senderId: seller._id,
          receiverId: reciverId,
          text: newmessage,
          messageId: res.data.message._id,
        })
      }

      updateLastMessage(newmessage)
      setNewMessage("")
    } catch (error) {
      console.log(error)
    }
  }

  const updateLastMessage = async (lastMsg) => {
    if (socketRef.current) {
      socketRef.current.emit("updateLastMessage", {
        lastMessage: lastMsg,
        lastMessageId: seller._id,
      })
    }

    try {
      await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: lastMsg,
        lastMessageId: seller._id,
      })
    } catch (error) {
      console.log(error)
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
    const receiverId = currentChat.members.find((member) => member !== seller._id)

    try {
      // Save image message to database first
      const res = await axios.post(`${server}/message/create-new-message`, {
        sender: seller._id,
        conversationId: currentChat._id,
        images: imageData,
      })

      // Add to local messages
      setMessages((prev) => [...prev, res.data.message])

      // Send via socket with the actual Cloudinary URL
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", {
          senderId: seller._id,
          receiverId,
          images: res.data.message.images, // Send the actual Cloudinary URL
          messageId: res.data.message._id,
        })
      }

      updateLastMessage("Photo")
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white m-5 h-[85vh] overflow-y-scroll rounded ">
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins ">All Messages</h1>
          {conversation.map((item, index) => (
            <MessageList
              key={index}
              me={seller._id}
              item={item}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              setUserData={setUserData}
              userData={userData}
              online={onLineCheck(item)}
              setActiveStatus={setActiveStatus}
            />
          ))}
        </>
      )}
      {open && (
        <SellerInbox
          setOpen={setOpen}
          messages={messages}
          sellerId={seller._id}
          newmessage={newmessage}
          setNewMessage={setNewMessage}
          scrollRef={scrollRef}
          sendMessageHandler={sendMessageHandler}
          userData={userData}
          activestatus={activestatus}
          handleImageUpload={handleImageUpload}
          loading={loading}
        />
      )}
    </div>
  )
}

const MessageList = ({ item, index, setOpen, setCurrentChat, me, setUserData, userData, online, setActiveStatus }) => {
  const [active, setActive] = useState(0)
  const [user, setUser] = useState()
  const navigate = useNavigate()

  const handleClick = (id) => {
    navigate(`?${id}`)
  }

  useEffect(() => {
    setActiveStatus(online)
    const userId = item.members.find((user) => user !== me)

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`)
        setUser(res.data.user)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [me, item, online, setActiveStatus])

  return (
    <div
      className={`w-full flex p-3 px-3 ${active === index ? " bg-[#dfa2a255]" : "bg-transparent"} cursor-pointer`}
      onClick={() => {
        setActive(index) ||
          handleClick(item._id) ||
          setCurrentChat(item) ||
          setUserData(user) ||
          setActiveStatus(online) ||
          setOpen(true)
      }}
    >
      <div className="relative">
        <img
          className="w-[50px] h-[50px] rounded-full "
          src={
            user?.avatar?.url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt="User Avatar"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]"></div>
        ) : (
          <div className="w-[12px] h-[12px] bg-[#00000016] rounded-full absolute top-[2px] right-[2px]"></div>
        )}
      </div>
      <div className="pl-3">
        <h1 className=" text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#000c]">
          <span>
            {item?.lastMessageId !== user?._id ? "YOU: " : `${user?.name?.split(" ")[0]}: `}
            {item?.lastMessage}
          </span>
        </p>
      </div>
    </div>
  )
}

const SellerInbox = ({
  setOpen,
  sellerId,
  messages,
  newmessage,
  setNewMessage,
  sendMessageHandler,
  userData,
  activestatus,
  handleImageUpload,
  scrollRef,
  loading,
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-between">
      {/* Message Header */}
      <div className="w-full flex items-center justify-between p-3 bg-slate-200">
        <div className="flex">
          <img
            alt="User Avatar"
            className="w-[60px] h-[60px] rounded-full"
            src={
              userData?.avatar?.url ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" ||
              "/placeholder.svg"
            }
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1 className="">{activestatus ? "Active Now" : null}</h1>
          </div>
        </div>
        <AiOutlineArrowRight size={20} className="cursor-pointer" onClick={() => setOpen(false)} />
      </div>

      {/* Messages Map */}
      <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => {
            return (
              <div
                key={item._id || item.id || index}
                className={`w-full flex my-2 ${item.sender === sellerId ? "justify-end" : "justify-start"}`}
                ref={index === messages.length - 1 ? scrollRef : null}
              >
                {item.sender !== sellerId && (
                  <img
                    src={
                      userData?.avatar?.url ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" ||
                      "/placeholder.svg"
                    }
                    alt="sender-image"
                    className="w-[40px] h-[40px] rounded-full mr-3"
                  />
                )}
                <div className="flex flex-col">
                  {item.images && (
                    <div className="relative">
                      <img
                        src={item.images?.url || "/placeholder.svg"}
                        className="w-[300px] h-[300px] object-cover rounded-[10px] mr-2 mb-2"
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

                  {item.text?.trim() && (
                    <div>
                      <div
                        className={`w-max p-2 rounded ${
                          item.sender === sellerId ? "bg-[#000]" : "bg-[#38c776]"
                        } text-[#fff] h-min`}
                      >
                        <p>{item?.text}</p>
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
            )
          })}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-gray-200 p-2 rounded flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              <p>Uploading image...</p>
            </div>
          </div>
        )}
      </div>

      {/* Send Message Input */}
      <form
        aria-required={true}
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[3%]">
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
            <TfiGallery size={20} className={`cursor-pointer ${loading ? "opacity-50" : ""}`} />
          </label>
        </div>
        <div className="w-[97%]">
          <input
            className={`${styles.input}`}
            type="text"
            placeholder="Enter Your Message"
            value={newmessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
          />
          <input type="submit" required value="send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend size={20} className="absolute right-4 top-5 cursor-pointer" />
          </label>
        </div>
      </form>
    </div>
  )
}

export default DashBoardMessages
