import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);

  const value = {
    user,
    setUser,
    channels,
    setChannels,
    currentChannel,
    setCurrentChannel
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}