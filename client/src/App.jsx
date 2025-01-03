import React, { Children, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Auth from './pages/auth/index';
import Chat from './pages/chat/index';
import Profile from './pages/profile/index';
import { userAppStore } from './store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';


const AuthRoute = ({children} )=> {
  const {userInfo}= userAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const PrivateRoute = ({children} )=> {
  const {userInfo}= userAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  
  const { userInfo, setUserInfo } = userAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const getUserData = async () =>{
      try {
        const response = await apiClient.get(GET_USER_INFO,{withCredentials:true,});
        console.log({response});
        if(response.status===200 && response.data.id){
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      }
      finally {
        setLoading(false);
      }
    }
    if(!userInfo){
      getUserData();
    } else { setLoading(false); }
  }
  ,[userInfo, setUserInfo]);

  if(loading) return <div>loading.....</div>

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/auth' element={
        <AuthRoute>
        <Auth />
        </AuthRoute>
        } />
      <Route path='/chat' element={
        <PrivateRoute>
          <Chat />
        </PrivateRoute>
      } />
      <Route path='/profile' element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path='*' element={<Navigate to="/auth" />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;
