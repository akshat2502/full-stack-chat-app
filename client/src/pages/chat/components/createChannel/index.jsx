import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IoPersonAddSharp } from "react-icons/io5";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { CREATE_CHANNEL_ROUTES, GET_ALL_CONTACTS_ROUTES } from '@/utils/constants';
import { userAppStore } from '@/store';
import MultipleSelector from '@/components/ui/multipleselect';
import { Button } from '@/components/ui/button';

const CreateChannel = () => {

    const { setSelectedChatType, setSelectedChatData, addChannel } = userAppStore();
    const [newChannelModal, setNewChannelModal] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState([]);


    useEffect(()=> {
        const getData = async ()=> {
            const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
                withCredentials: true,
            })
            setAllContacts(response.data.contacts);
        };
        getData();
    },[])

    const createChannel = async () => {
        try {
            if(channelName.length>0 && selectedContacts.length>0) {
                const response = await apiClient.post(CREATE_CHANNEL_ROUTES,{
                    name: channelName,
                    members: selectedContacts.map((contact) => contact.value),
                }, 
                {withCredentials:true }
                );
                if(response.status === 201) {
                    setChannelName("");
                    setSelectedContacts([]);
                    setNewChannelModal(false);
                    addChannel(response.data.channel);
                }
            }    
        } catch (error) {
            console.log(error);                 
        }
    }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
            <IoPersonAddSharp 
            className='font-light text-opacity-80 text-neutral-400 hover:text-neutral-100 text-start'
            onClick={()=> setNewChannelModal(true) }/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white" >Create a new channel</TooltipContent>
        </Tooltip>
      </TooltipProvider> 

     <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
            <DialogContent className="bg-[#181920] border-none w-[400px] h-[400px] flex flex-col text-white">
                <DialogHeader>
                    <DialogTitle className="text-center">Please fill up details for new channel</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <Input placeholder='Channel Name'
                    className='rounded-lg bg-[#2c2e3b] border-none py-5'
                    onChange={(e)=> setChannelName(e.target.value)}
                    value = {channelName} />
                </div>
                <div className='w-full h-full'>
                <MultipleSelector className = 'rounded-lg bg-[#2c2e3b] border-none py-2 text-white'
                defaultOptions = {allContacts}
                placeholder = "Search Contacts"
                value = {selectedContacts}
                onChange = {setSelectedContacts}
                emptyIndicator = {
                    <p className='text-center text-lg leading-10 text-gray-600'>No results found.</p>
                } />
                </div>  
                <div>
                <Button className='w-full transition-all duration-300'
                onClick = {createChannel}>Create Channel</Button>    
                </div>    
            </DialogContent>
     </Dialog>

    </>
  )
}

export default CreateChannel;
