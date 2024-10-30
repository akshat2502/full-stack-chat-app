  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
  import { useState } from 'react'
  import Chat from '@/assets/chat.png';
  import { toast } from 'sonner';
  import { apiClient } from '@/lib/api-client';
  import { LOGIN_ROUTES, SIGNUP_ROUTES } from '@/utils/constants';
  import { useNavigate } from 'react-router-dom';
  import { userAppStore } from '@/store';

  const Auth = () => {

    const [email, setEmail]= useState("");
    const {setUserInfo} = userAppStore();
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    function validationLogin() {
      if(!email.length){
        toast.error("Email is required!");
        return false;
      }
      if(!password.length){
        toast.error("Password is required!");
        return false;
      }
      return true;
    }
  
    function validationSignup() {
      if(!email.length){
        toast.error("Email is required!");
        return false;
      }
      if(!password.length){
        toast.error("Password is required!");
        return false;
      }
      if(password!==confirmpassword){
        toast.error("Passwords don't match!");
        return false;
      }
      return true;
    }

    async function handleSignup() {
      if(validationSignup()){
        const response = await apiClient.post(SIGNUP_ROUTES, {email, password}, {withCredentials: true});

        if(response.status===201){
          setUserInfo(response.data);
          navigate("/profile");
        }
        console.log({response});
      } 
    }

    async function handleLogin() {
      if(validationLogin()){
        const response = await apiClient.post(LOGIN_ROUTES, {email, password}, {withCredentials: true});

        if(response.data.user.id){
          setUserInfo(response.data.user);
          if(response.data.user.profileSetup) {
            navigate("/chat"); 
          }
          else { 
            navigate("/profile");
          }  
        }
        console.log({response});
      } 
    }

    return (
        <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
          <div className='h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[70vw] md:w-[60vw] lg:w-[70vw] xl:w-[50vw] rounded-3xl grid xl:grid-cols-1'>
            <div className='flex flex-col gap-11 justify-center items-center'>
              <div className='flex items-center justify-center flex-col'>
                  <img src={Chat} alt="Logo" className='w-[75px] h-[70px] rounded-full' />
                <div className='flex items-center justify-center'>
                  <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
                  <img src='https://i.pinimg.com/originals/89/ef/5c/89ef5cd84c8a8882dfbafab475e40aac.png' className='h-[130px]'/>
                </div>
                <p className='font-medium text-center'>
                  Fill in the details to get started with the best chat app!
                </p>
              </div>
              <div className='flex items-center justify-center w-full'>
                <Tabs className='w-3/4' defaultValue='login'>
                  <TabsList className='flex bg-transparent gap-[2px] rounded-none w-full'>
                    <TabsTrigger value='login'
                    className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'
                    >Login</TabsTrigger>
                    <TabsTrigger value='signup'
                    className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'
                    >Signup</TabsTrigger>
                  </TabsList>
                  <TabsContent className='flex flex-col gap-5 mt-5' value='login'>
                    <Input placeholder='Email'
                    value={email}
                    type='email'
                    className='rounded-3xl p-6' 
                    onChange={(e) => setEmail(e.target.value)}/>
                    
                    <Input placeholder='Password'
                    value={password}
                    type='password'
                    className='rounded-3xl p-6' 
                    onChange={(e) => setPassword(e.target.value)}/>

                    <Button 
                    onClick={handleLogin}
                    className='rounded-3xl p-6'>login</Button>

                  </TabsContent>
                  <TabsContent className='flex flex-col gap-5' value='signup'>
                  <Input placeholder='Email'
                    value={email}
                    type='email'
                    className='rounded-3xl p-6' 
                    onChange={(e) => setEmail(e.target.value)}/>
                    
                    <Input placeholder='Password'
                    value={password}
                    type='password'
                    className='rounded-3xl p-6' 
                    onChange={(e) => setPassword(e.target.value)}/>
                    
                    <Input placeholder='ConfirmPassword'
                    value={confirmpassword}
                    type='password'
                    className='rounded-3xl p-6' 
                    onChange={(e) => setConfirmPassword(e.target.value)}/>
                    
                    <Button 
                    onClick={handleSignup}
                    className='rounded-3xl p-6'>signup</Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
    )
  }

  export default Auth;


