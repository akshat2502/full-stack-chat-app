import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { colors, getColor } from '@/lib/utils';
import { userAppStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  
  const navigate = useNavigate();
  const {userInfo, setUserInfo} = userAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectColor, setSelectColor] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(()=>{
    if(userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectColor(userInfo.color);
    }

  if(userInfo.image){
    setImage(`${HOST}/${userInfo.image}`);
    // console.log(`${HOST}/${userInfo.image}`); 
    // console.log(image)
  }
  }, [userInfo]);

  const validateProfile = () => {
    if(!firstName) { toast.error("FirstName is required!");  return false }
    if(!lastName) { toast.error("LastName is required!");  return false }
    return true;
  }

  const handleFileInputClick = ()=> {
    fileInputRef.current.click();
  }

  const handleImageChange = async (event)=>{
    const file = event.target.files[0];
    console.log({file}, "hii");
    if(file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });
      if(response.status === 200 && response.data.image) {
        setUserInfo({...userInfo, image: response.data.image});
        toast.success("Image updated successfully!")
      } 
    }
    
  }

  const handleImageDelete = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {withCredentials: true});
      if(response.status === 200) {
        setUserInfo({...userInfo, image: null});
        toast.success("Image deleted successfully!")
        setImage(null);
      }
    } catch (error) {
      console.log(error);
      
    }

  }

  const saveChanges = async ()=> {
    if(validateProfile()){
      try {
        const response = await apiClient.post(UPDATE_PROFILE_ROUTE, { firstName,lastName,color:selectColor }, {withCredentials:true} );
        if(response.status===200 && response.data) {
          setUserInfo({...response.data});
          toast.success("Profile updated successfully!");
          navigate("/chat");
        }

      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleNavigate = ()=> {
    if(userInfo.profileSetup){
      navigate("/chat")
    } else {
      toast.error("Please setup the profile!")
    }
  }
  
  return (
    <div className='bg-zinc-900 h-[100vh] flex flex-col items-center justify-center gap-10'>
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack onClick={handleNavigate} className='text-4xl lg:text-5xl cursor-pointer text-white/90'/>
        </div>
        <div className='grid grid-cols-2'>
          <div 
          className='h-full w-32 md:w-40 md:h-40 md:mx-[90px] relative flex items-center justify-center'
          onMouseEnter={()=>{setHovered(true)}}
          onMouseLeave={()=>{setHovered(false)}}
          >
            <Avatar className="h-32 w-32 md:w-40 md:h-40 rounded-full overflow-hidden">
              {
                image ? <AvatarImage src={image} className='object-cover w-full h-full bg-black' /> : <div className={`h-32 w-32 uppercase border-[1px] text-6xl justify-center rounded-full items-center flex md:w-40 md:h-40 ${getColor(selectColor)}`}>
                  {
                    firstName ? firstName.split("").shift() : userInfo.email.split("").shift()
                  }
                </div>
              }
            </Avatar>
            { hovered && 
                <div 
                className='absolute inset-0 cursor-pointer rounded-full flex items-center justify-center bg-black/50 ring-fuchsia-50'
                onClick={ image ? handleImageDelete : handleFileInputClick }
                >
                  { image ? 
                  <FaTrash className='text-white cursor-pointer text-3xl'/>: <FaPlus className='text-white cursor-pointer text-4xl'/>
                  }
                </div>
            } 
            <input type='file' className='hidden' onChange={handleImageChange} ref={fileInputRef} accept='.png, .jpg, jpeg, .svg, .webp' name='profile-image'/>
          </div>
          <div className='flex gap-5 flex-col justify-center min-w-32 md:min-w-48 text-white items-center'>
            <div className='w-full'>
              <Input placeholder="Email" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} type="email" className="rounded-lg p-6 border-none bg-[#2c2e3b]"/>
            </div>
            <div className='w-full'>
              <Input placeholder="First name" value={firstName} onChange={(e)=> setFirstName(e.target.value)} type="text" className="rounded-lg p-6 border-none bg-[#2c2e3b]"/>
            </div>
            <div className='w-full'>
              <Input placeholder="Last name" value={lastName} onChange={(e)=> setLastName(e.target.value)} type="text" className="rounded-lg p-6 border-none bg-[#2c2e3b]"/>
            </div>
            <div className='w-full flex gap-5'>
            {
              colors.map((color,index)=> 
              <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-200 ${selectColor===index && "outline outline-2 outline-white/60"}`} 
              key={index}
              onClick={()=> setSelectColor(index)}>
              </div> )
            }
            </div>
          </div>
        </div>
        <div className='w-full'>
          <Button 
          className="h-16 w-full bg-purple-800 hover:bg-purple-900 transition-all duration-300"
          onClick={saveChanges}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  ) 
}

export default Profile;
