import animationData from '@/assets/chat.json'
import Lottie from "lottie-react"

function EmptyChatContainer() {

  return (
    <div className="flex-1 flex-col md:bg-[#1c1d25] md:flex justify-center items-center hidden duration-1000 transition-all">  
      <div className='w-[350px] '>
        <Lottie animationData={animationData} />
        </div>
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
      <h2 className=" font-extralight">Hi
        <span className='text-orange-400'>!</span> Welcome to 
        <span className='text-orange-400 font-mono mx-2'>Byte</span>chat
        <span className='text-orange-400'>.</span>
      </h2>
      </div>
    </div>
  )
}

export default EmptyChatContainer;
