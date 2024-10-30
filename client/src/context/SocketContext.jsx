import { userAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react"
import { io } from "socket.io-client";
import notificationSound from '../assets/new-notification.mp3'

const SocketContext = createContext(null);

export const useSocket = ()=> {
    return useContext(SocketContext);
}

export const SocketProvider = ({children})=> {
    const socket = useRef();
    const {userInfo} = userAppStore();

    useEffect(()=>{
        if(userInfo) {
            socket.current = io(HOST,{
                withCredentials: true,
                query: {userId: userInfo.id},
            });
            socket.current.on('connect', ()=>{console.log("connectd to server")});

            const handleRecieveMessage = async (message) => {
                const {selectedChatType, selectedChatData, addMessage, addContactList} = userAppStore.getState();
                
                if(selectedChatType!== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)){
                    console.log("rcv message", message);
                    
                    const sound = new Audio(notificationSound);
                    sound.play();
                    addMessage(message);
                }
                addContactList(message);
            }

            const handleRecieveChannelMessage = async (message) => {
                const { selectedChatType, selectedChatData, addMessage, addChannelList } = userAppStore.getState();
                if (selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                    const sound = new Audio(notificationSound);
                    sound.play();
                    addMessage(message);
                }
                addChannelList(message);
            }

            socket.current.on('recieveMessage', handleRecieveMessage);
            socket.current.on('recieve-channel-message', handleRecieveChannelMessage); 
        return ()=> {
            socket.current.disconnect();
        }
        }
    },[userInfo]);

    return <SocketContext.Provider value={socket.current}>
        {children}
    </SocketContext.Provider>
} 