import { getColor } from '@/lib/utils';
import { userAppStore } from '@/store'
import { HOST } from '@/utils/constants';
import { Avatar, AvatarImage } from './ui/avatar';

const ContactList = ({ contacts, ischannel = false }) => {
  
    const { setSelectedChatData, setSelectedChatType, setSelectedChatMessages, selectedChatType, selectedChatData } = userAppStore();

    const handleClick = (contact) => {
        if(ischannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contact);
        if(selectedChatData && selectedChatData._id !== contact._id){
            setSelectedChatMessages([]);
        }
    };
  
    return (
    <div className='mt-5'>
      { (contacts && contacts.length > 0) && contacts.map((contact) => (
            <div key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && (selectedChatData._id === contact._id) ? "bg-gradient-to-r from-red-400/60 to-red-500/70" : "hover:bg-neutral-700/25"}`}
            onClick={()=> handleClick(contact)}>
                <div className="flex gap-5 items-center justify-start to-neutral-300">
                    {
                        !ischannel && (
                        <Avatar className="h-11 w-11 rounded-full overflow-hidden">
                        { contact.image ?
                          (<AvatarImage 
                              src = {`${HOST}/${contact.image}`}
                              className='object-cover w-full h-full bg-black' />) : 
                              <div className={`h-10 w-10 uppercase border-[1px] text-lg justify-center rounded-full items-center flex md:w-40 md:h-40 ${getColor(contact.color)}`}>
                            {
                                contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()
                              }
                          </div>
                        }
                      </Avatar>
                      )}
                    {
                        ischannel && <div className="flex justify-center items-center rounded-full h-10 w-10 bg-neutral-800">#</div>
                    } 
                    {
                        ischannel ? <span>{contact.name}</span> : 
                        <span>{ contact.firstName ? `${contact.firstName} ${contact.lastName}` : contact.email }</span>
                    }
                </div>
            </div>
      ))}
    </div>
  )
}

export default ContactList
