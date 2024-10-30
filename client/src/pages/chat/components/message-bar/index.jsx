import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import { useSocket } from '@/context/SocketContext';
import { userAppStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import { UPLOAD_FILE_ROUTES } from '@/utils/constants';

const MessageBar = () => {

    const emojiRef = useRef();
    const fileInputRef = useRef();
    const socket = useSocket();
    const [message, setMessage] = useState("");
    const {userInfo, selectedChatType, selectedChatData} = userAppStore();
    const [emojiPicker, setEmojiPicker] = useState(false);

    const handleAddEmoji = (emoji) =>{
      setMessage((msg)=>msg+ emoji.emoji);
    }

    const handleAttachmentClick = () => {
      if(fileInputRef.current) {
      fileInputRef.current.click();
    }}



    useEffect(()=> {
      function handleClickOutside(event) {
        if(emojiRef.current && !emojiRef.current.contains(event.target)){
          setEmojiPicker(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>{ document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [emojiRef]);

    const handleSendMessage = async () => {
      if(selectedChatType === "contact") {
        socket.emit('sendMessage', {
          sender: userInfo.id,
          recipient: selectedChatData._id,
          content: message,
          messageType: "text",
          fileUrl: undefined,
      })
    } else if(selectedChatType === 'channel') {
      socket.emit('send-channel-message', {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      })}
      setMessage("");
  }

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if(file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiClient.post(UPLOAD_FILE_ROUTES, formData, {withCredentials:true});

        if(response.status === 200 && response.data){
        if(selectedChatType === "contact") {
          socket.emit('sendMessage', {
            sender: userInfo.id,
            recipient: selectedChatData._id,
            content: undefined,
            messageType: "file",
            fileUrl: response.data.filePath,
        })
      } else if(selectedChatType === 'channel') {
        socket.emit('send-channel-message', {
          sender: userInfo.id,
          content: undefined,
          messageType: "file",
          fileUrl: response.data.filePath,
          channelId: selectedChatData._id,
        })
      }
     } }
      console.log({file});
      
    } catch (error) {
      console.log(error);
    }
}

  return (
    <div className='flex justify-center items-center h-[10vh] px-8 mb-6 gap-6'>
      <div className="flex flex-1 gap-5 pr-4 rounded-md bg-[#2a2b33] items-center">
       <input placeholder='message' 
       type='text' 
       className='flex-1 p-4 bg-transparent focus:border-none focus:outline-none'
       value={message}
       onChange={(e)=> setMessage(e.target.value)}
       />
       <button 
       className='text-neutral-600 focus:border-none focus:text-white duration-300 transition-all'
       onClick={handleAttachmentClick}>
        <GrAttachment className='text-xl'/>
       </button>
       <input className='hidden' type='file' ref={fileInputRef} onChange={handleAttachmentChange} />
       <div className='relative'>
        <button className='text-neutral-600 focus:border-none focus:text-white duration-300 transition-all' onClick={()=>setEmojiPicker(true)}>
            <RiEmojiStickerLine className='text-2xl'/>
        </button>
        <div className='absolute right-0 bottom-16' ref={emojiRef}>
        <EmojiPicker 
        theme='dark'
        open = {emojiPicker}
        onEmojiClick={handleAddEmoji}
        autoFocusSearch={false} />
        </div>
       </div>
      </div>
      <button 
      className='bg-gradient-to-r from-red-400/80 to-red-500 rounded-md flex items-center justify-center px-4 py-5 mx-[-5px] focus:border-none focus:shadow-slate-600 focus:text-white duration-300 transition-all'
      onClick={handleSendMessage}>
        <IoSend className='text-xl'/></button>
    </div>
  )
}
export default MessageBar;
