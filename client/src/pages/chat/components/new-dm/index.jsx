import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IoPersonAddSharp } from "react-icons/io5";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import Lottie from 'lottie-react';
import animationData from '@/assets/chat.json'
import { apiClient } from '@/lib/api-client';
import { HOST, SEARCH_CONTACTS_ROUTES } from '@/utils/constants';
import { getColor } from '@/lib/utils';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { userAppStore } from '@/store';

const NewDM = () => {

    const [openNewContactModal, setopenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);

    const { setSelectedChatType, setSelectedChatData } = userAppStore();

    const searchContacts = async (searchTerm) => { 
        try {
            if(searchTerm.length>0){
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTES, {searchTerm}, {withCredentials:true});
                if(response.status===200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts);
                } else {
                    setSearchedContacts([]);
                }
            }
        } catch (error) {
            console.log({error});
            
        }
     }

     const selectNewContact = (contact) => {
        setopenNewContactModal(false);
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setSearchedContacts([]);
     }

    const style = {
        height: 110,
        width: 110,
      };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
            <IoPersonAddSharp 
            className='font-light text-opacity-80 text-neutral-400 hover:text-neutral-100 text-start'
            onClick={()=> setopenNewContactModal(true) }/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white" >Select new contact</TooltipContent>
        </Tooltip>
      </TooltipProvider> 

     <Dialog open={openNewContactModal} onOpenChange={setopenNewContactModal}>
            <DialogContent className="bg-[#181920] border-none w-[400px] h-[400px] flex flex-col text-white">
                <DialogHeader>
                    <DialogTitle className="text-center">Please select a contact</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <Input placeholder='Search Contacts'
                    className='rounded-lg bg-[#2c2e3b] border-none p-6'
                    onChange={(e)=> searchContacts(e.target.value) }/>
                </div>

                <ScrollArea className="h-[250px]">
                    <div className='flex flex-col gap-3'>
                    {
                        searchedContacts.map((contact) => (<div key={contact._id} className='flex gap-3 items-center cursor-pointer' onClick={()=> selectNewContact(contact)}>
                    <div className="relative w-12 h-13">
                    <Avatar className="h-11 w-11 rounded-full overflow-hidden">
                    { contact.image ?
                        (<AvatarImage 
                            src = {`${HOST}/${contact.image}`}
                            className='object-cover w-full h-full bg-black' />) : 
                            <div className={`h-12 w-12 uppercase border-[1px] text-lg justify-center rounded-full items-center flex md:w-40 md:h-40 ${getColor(contact.color)}`}>
                        {
                             contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()
                        }
                            </div>
                    }
                    </Avatar>
                </div>
                    <div className='flex flex-col'>
                        <span>
                        { contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}`: "" }
                        </span>
                        <span className='text-xs'> { contact.email } </span>
                    </div>
                </div>
                  ))}
                  </div>
                </ScrollArea>

                <div>
                    { searchedContacts.length<=0 && (
                        <div className="flex flex-col  justify-center mt-2 items-center duration-1000 transition-all">  
                          <Lottie animationData={animationData} style={style} />
                        <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-8 lg:text-2xl mb-8 text-xl transition-all duration-300 text-center">
                        <h3 className=" font-extralight">Hi
                          <span className='text-orange-400'>!</span> Search new 
                          <span className='text-orange-400 font-normal'> Contact</span>
                          <span className='text-orange-400'>.</span>
                        </h3>
                        </div>
                      </div>
                    )  }
                </div>
            </DialogContent>
     </Dialog>

    </>
  )
}

export default NewDM;
