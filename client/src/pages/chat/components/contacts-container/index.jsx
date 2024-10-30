import Chat from "@/assets/chat.png";
import ProfileInfo from "../profile-info/index.jsx";
import NewDM from "../new-dm/index.jsx";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client.js";
import { GET_CHANNELS_ROUTES, GET_DM_CONTACTS_ROUTES } from "@/utils/constants.js";
import { userAppStore } from "@/store/index.js";
import ContactList from "@/components/contact-list.jsx";
import CreateChannel from "../createChannel/index.jsx";
import { useNavigate } from "react-router-dom";

function ContactContainer() {

    const { directMessagesContacts, setDirectMessagesContacts, channels, setChannels } = userAppStore();
    const navigate = useNavigate();

    useEffect(()=>{
        const getContacts = async () => {
            try {
                const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
                    withCredentials:true,
                });
                if(response.data.contacts) {
                    setDirectMessagesContacts(response.data.contacts);
                    console.log("hii",response.data.contacts);
                }
            } catch (error) {
                console.log("your error comes here", error);
            }   
        };

        const getChannels = async () => {
            try {
                const response = await apiClient.get(GET_CHANNELS_ROUTES, {
                    withCredentials:true,
                });
                if(response.data.channels) {
                    setChannels(response.data.channels);
                    console.log("hii",response.data.channels);
                }
            } catch (error) {
                console.log("your error comes here", error);    
            }   
        };

        getContacts();
        getChannels();
    }, [setChannels, setDirectMessagesContacts]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] border-r-2 bg-[#1b1c24] w-full border-[#2f303b]">
        <div className="flex items-center mx-2 ml-6">
        <img src={Chat} alt="Logo" className='w-[46px] h-[46px] mt-4 mx-2 rounded-full cursor-pointer' onClick={()=>{window.location.reload()}}/>
        <h1 className="mt-[14px] mx-2 font-semibold"><span className="text-[30px]">Byte</span></h1>
        </div>

        <div className="my-5 mt-10">
            <div className="flex justify-between pr-10 items-center">
                <Title text="direct messages" />
                <NewDM />
            </div>
        </div>

        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
            <ContactList contacts={directMessagesContacts}/>
            </div>
 
        <div className="my-5 mt-10">
            <div className="flex justify-between pr-10 items-center">
                <Title text="channels" />
                <CreateChannel />
            </div>
        </div>

        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
            <ContactList contacts={channels} ischannel = {true} />
            </div>
        <ProfileInfo />
    </div>
  )
}

export default ContactContainer;

const Title =({text})=>{
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 font-light pl-10 text-sm text-opacity-90">{text}</h6>
    )
}