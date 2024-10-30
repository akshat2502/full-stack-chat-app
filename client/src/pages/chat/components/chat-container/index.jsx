import ChatHeader from "../chat-header"
import MessageBar from "../message-bar"
import MessageHeader from "../message-container"

const ChatContainer = () => {
  return (
    <div className="relative text-white/70 top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1"> 
      <ChatHeader />
      <MessageHeader />
      <MessageBar />
    </div>
  )
}

export default ChatContainer
