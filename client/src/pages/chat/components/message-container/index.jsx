import { apiClient } from '@/lib/api-client';
import { userAppStore } from '@/store';
import { GET_CHANNEL_MESSAGES_ROUTES, GET_CHANNELS_ROUTES, GET_MESSAGES_ROUTES, HOST } from '@/utils/constants';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react'
import { MdFolderZip } from 'react-icons/md';
import { IoMdArrowRoundDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';

const MessageContainer = () => {

  const scrollRef = useRef();
  const { userInfo, selectedChatType, selectedChatData, selectedChatMessages, setSelectedChatMessages } = userAppStore();
  const [showimage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(()=> { 

    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_MESSAGES_ROUTES,
          { id: selectedChatData._id },
          { withCredentials: true });
        
          if(response.data.messages){ setSelectedChatMessages(response.data.messages); }
          console.log("kese sir",response.data.messages);
          console.log("kese sirdsflasfj",selectedChatMessages);
          
        } catch (error) {
          console.log(error);
        }
      };

      const getChannelMessages = async () => {
        try {
          const response = await apiClient.get(`${GET_CHANNEL_MESSAGES_ROUTES}/${selectedChatData._id}`,
            { withCredentials: true });
          
            if(response.data.messages){ setSelectedChatMessages(response.data.messages); } 
            console.log("aa rha yaha toh",response.data.messages);
              
        } catch (error) {
          console.log(error);
          
        }
      }
      if(selectedChatData._id) {
        if(selectedChatType === "contact") { getMessages(); }
        else if(selectedChatType === "channel") { getChannelMessages(); }
      }
   }, [ selectedChatData, setSelectedChatMessages, selectedChatType ])

  useEffect(()=> {
    if(scrollRef.current) {
      scrollRef.current.scrollIntoView({behaviour : "smooth"});
    }
  },[selectedChatMessages]);

  const downloadFile = async (url) => {
    const response = await apiClient.get(`${HOST}/${url}`, {responseType: "blob"}, );
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = url.split('/').pop();
    document.body.append(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(urlBlob);
  }

  const renderMessage = ()=> {
    let lastDate = null;
    return selectedChatMessages.map((message, index)=> {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = lastDate !== messageDate;
        lastDate = messageDate;
        return (
          <div key={index}>
            { 
            showDate && <div className='text-center text-gray-500 my-2'>{ moment(message.timestamp).format("LL")}</div>}
              { selectedChatType === "contact" && renderDmMessage(message) }
              { selectedChatType === "channel" && renderChannelMessage(message) }
          </div>
        )
    });
  }

  const checkImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|tiff|tif|webp|webm|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  }

  const renderDmMessage = (message) => (
    <div className = {`${message.sender === selectedChatData._id ? 'text-left' : 'text-right'}`}>
      {
        message.messageType === "text" && (
          <div className={`${message.sender!==selectedChatData._id ? 'bg-gradient-to-r from-red-400/60 to-red-500 text-white/80 border-red-400' : 'bg-neutral-600/50 text-white/80 border-neutral-500'} border inline-block p-3 rounded my-1 break-words`}>
            {message.content}
          </div>
        )}
        {
          message.messageType === "file" && (
            <div className={`${message.sender!==selectedChatData._id ? 'bg-gradient-to-r from-red-400/60 to-red-500 text-white/80 border-red-400' : 'bg-neutral-600/50 text-white/80 border-neutral-500'} border inline-block p-[3px] rounded my-1 break-words`}>
              {
                checkImage(message.fileUrl) ? <div className='cursor-pointer'
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}>
                  <img src={`${HOST}/${message.fileUrl}`} height={200} width={200} />
                </div> : <div className='flex items-center justify-center gap-4'>
                  <span className='text-white/80 text-2xl m-1 p-3 rounded-full bg-black/20'>
                    <MdFolderZip />
                  </span>
                  <span>
                    {message.fileUrl.split('/').pop()}
                  </span>
                  <span className='text-sm bg-black/20 p-3 rounded-full hover:bg-black/30 cursor-pointer transition-all duration-300'
                  onClick={()=> downloadFile(message.fileUrl)}>
                    <IoMdArrowRoundDown className='hover:scale-125'/>
                  </span>
                </div>
              }
            </div>
          )
        }
        <div className='text-xs text-gray-600'>
          {moment(message.timestamp).format("LT")}
        </div>
    </div>
  )

  const renderChannelMessage = (message) => {
    return <div className = {`mt-5 ${message.sender._id !== userInfo.id ? 'text-left' : 'text-right'}`}>
       {
        (message.messageType === "text" && message.content ) && (
          <div className={`${message.sender._id === userInfo.id ? 'bg-gradient-to-r from-red-400/60 to-red-500 text-white/80 border-red-400' : 'bg-neutral-600/50 text-white/80 border-neutral-500'} border inline-block p-3 rounded my-1 break-words ml-8`}>
            {message.content}
          </div>
        )}
        {
          message.messageType === "file" && (
            <div className={`${message.sender._id === userInfo.id ? 'bg-gradient-to-r from-red-400/60 to-red-500 text-white/80 border-red-400' : 'bg-neutral-600/50 text-white/80 border-neutral-500'} border inline-block p-[3px] rounded my-1 break-words`}>
              {
                checkImage(message.fileUrl) ? <div className='cursor-pointer'
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}>
                  <img src={`${HOST}/${message.fileUrl}`} height={200} width={200} />
                </div> : <div className='flex items-center justify-center gap-4'>
                  <span className='text-white/80 text-2xl m-1 p-3 rounded-full bg-black/20'>
                    <MdFolderZip />
                  </span>
                  <span>
                    {message.fileUrl.split('/').pop()}
                  </span>
                  <span className='text-sm bg-black/20 p-3 rounded-full hover:bg-black/30 cursor-pointer transition-all duration-300'
                  onClick={()=> downloadFile(message.fileUrl)}>
                    <IoMdArrowRoundDown className='hover:scale-125'/>
                  </span>
                </div>
              }
            </div>
          )
        }
        {
          message.sender._id !== userInfo.id ? (<div className='flex items-center justify-start gap-2'>
            <Avatar className="h-6 w-6 rounded-full overflow-hidden">
              { message.sender.image ?
                  (<AvatarImage 
                       src = {`${HOST}/${message.sender.image}`}
                      className='object-cover w-full h-full bg-black' />) : 
                       
                         <AvatarFallback className={`h-8 w-8 uppercase text-lg justify-center rounded-full items-center flex md:w-40 md:h-40 ${getColor(message.sender.color)}`}>
                          {
                              message.sender.firstName ? message.sender.firstName.split("").shift() : message.sender.email.split("").shift()
                          }
                        </AvatarFallback>
                    }
              </Avatar>
              <span className='text-sm text-white/60'> {`${message.sender.firstName} ${message.sender.lastName}`}</span>
              <span className='text-xs text-white/60'>
              {moment(message.timestamp).format("LT")}
              </span>
          </div>) : (<div className='text-xs text-white/60 mt-1'>
            {moment(message.timestamp).format("LT")}
            </div>)
        }
    </div>
  }

  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw]'>
      {renderMessage()}
      <div ref={scrollRef}/>
      {
        showimage && <div className='fixed z-[100] top-0 left-0 h-[100vh] w-[100vw] flex justify-center items-center backdrop-blur-md'>
          <div><img src={`${HOST}/${imageUrl}`} className='h-[80vh] w-full bg-cover mt-5' /></div>
          <div className='flex gap-5 fixed top-0 mt-5'>
            <button className='bg-black/20 p-3 text-2xl rounded-full cursor-pointer hover:bg-black/70 transition-all duration-300'
            onClick={()=> downloadFile(imageUrl)}>
            <IoMdArrowRoundDown />
            </button>
            <button className='bg-black/20 p-3 text-2xl rounded-full cursor-pointer hover:bg-black/70 transition-all duration-300'
            onClick={()=> {
              setShowImage(false);
              setImageUrl(null);
            }}>
            <RxCross2 />
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default MessageContainer;
