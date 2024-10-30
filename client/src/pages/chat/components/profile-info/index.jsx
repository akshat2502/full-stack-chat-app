import { userAppStore } from '@/store';
import { HOST, LOGIN_ROUTES, LOGOUT_ROUTES } from '@/utils/constants';
import React from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { LiaUserEditSolid } from "react-icons/lia";
import { MdPowerSettingsNew } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import { getColor } from '@/lib/utils';



const ProfileInfo = () => {

    const {userInfo, setUserInfo} = userAppStore();
    const navigate = useNavigate();

    const LogOut = async () => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTES, {}, {withCredentials: true});
            if (response.status === 200) {
                navigate("/auth");
                setUserInfo(null);
            }
        } catch (error) {
            console.log(error);
            
        }
    }

  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
      <div className='flex gap-2 -ml-4 justify-center items-center'>
        <div className="relative w-12 h-13">
      <Avatar className="h-11 w-11 rounded-full overflow-hidden">
              { userInfo.image ?
                (<AvatarImage 
                    src = {`${HOST}/${userInfo.image}`}
                    className='object-cover w-full h-full bg-black' />) : 
                    <div className={`h-12 w-12 uppercase border-[1px] text-lg justify-center rounded-full items-center flex md:w-40 md:h-40 ${getColor(userInfo.color)}`}>
                  {
                      userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split("").shift()
                    }
                </div>
              }
            </Avatar>
        </div>
        <div className='flex ml-2 uppercase'>
            { userInfo.firstName && userInfo.lastName ? `${userInfo.firstName}`: "" }
        </div>
      </div>
      <div className='flex gap-4 pl-8'>
      <TooltipProvider>
        <Tooltip>
            <TooltipTrigger><LiaUserEditSolid 
            className='font-medium text-red-300 text-xl'
            onClick={()=> navigate("/profile")}/></TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white" >
                <p>Edit your profile</p>
            </TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger><MdPowerSettingsNew 
            className='font-medium text-neutral-500 text-xl hover:text-neutral-300'
            onClick={LogOut}/></TooltipTrigger>
            <TooltipContent 
            className="bg-[#1c1b1e] border-none text-white">
                <p>Logout</p>
            </TooltipContent>
        </Tooltip>

      </TooltipProvider>

      </div>
    </div>
  )
}

export default ProfileInfo;
