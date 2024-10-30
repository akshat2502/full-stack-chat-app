import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { userAppStore } from '@/store'
import { HOST } from '@/utils/constants';
import React, { useEffect } from 'react'
import { RiCloseFill } from 'react-icons/ri'

const ChatHeader = () => {

  const { closeChat, selectedChatData, selectedChatType, setIsActive, isActive } = userAppStore();


  return (
    <div className='h-[11vh] border-b-2 border-[#2f303b] flex px-20 justify-center items-center'>
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center">
        <div className="relative w-12 h-13">
          { selectedChatType === 'contact' ?
            <Avatar className="h-11 w-11 rounded-full overflow-hidden">
              { selectedChatData.image ?
                  (<AvatarImage 
                       src = {`${HOST}/${selectedChatData.image}`}
                      className='object-cover w-full h-full bg-black' />) : 
                       <div className={`h-12 w-12 uppercase border-[1px] text-lg justify-center rounded-full items-center flex md:w-40 md:h-40 ${getColor(selectedChatData.color)}`}>
                        {
                             selectedChatData.firstName ? selectedChatData.firstName.split("").shift() : selectedChatData.email.split("").shift()
                        }
                            </div>
                    }
              </Avatar>: <div className="flex justify-center items-center rounded-full h-10 w-10 bg-neutral-800">#</div>
              }
            </div>
                <div>
                  {selectedChatType ==='channel' && selectedChatData.name}
                    {  selectedChatType==="contact" && 
                    selectedChatData.firstName ? `${selectedChatData.firstName} ${selectedChatData.lastName}`: selectedChatData.email }
                    {/* { isActive && <div>online</div> } */}
             </div>
        </div>
        <div className="flex items-center justify-center gap-5">
            <button 
            className='text-neutral-600 focus:border-none focus:text-white duration-300 transition-all'
            onClick={closeChat}>
                <RiCloseFill className='text-3xl'/>
            </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
