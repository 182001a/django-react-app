import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const value = {
    user,
    setUser,
    posts,
    setPosts,
    likedPosts,
    setLikedPosts
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
