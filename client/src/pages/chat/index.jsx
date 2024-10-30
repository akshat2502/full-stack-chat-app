import { userAppStore } from '@/store';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ChatContainer from './components/chat-container';
import ContactContainer from './components/contacts-container';
import EmptyChatContainer from './components/empty-chat-container';

const Chat = () => {

  const { userInfo, selectedChatType } = userAppStore();
  const navigate = useNavigate();

  useEffect(()=> {
    if(!userInfo.profileSetup) {
      toast("Please setup your profile to continue!");
      navigate('/profile');
    }
  },[userInfo, navigate, userInfo.profileSetup]);

  return (
    <div className='flex h-[100vh] overflow-hidden text-white/75'>
      <ContactContainer />
      {
        selectedChatType === undefined ? (
          <EmptyChatContainer />)
          : (<ChatContainer />) 
      }
    </div>
  )
}

export default Chat;
