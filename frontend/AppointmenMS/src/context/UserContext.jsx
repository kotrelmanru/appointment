import React, { createContext, useState } from "react";

// 1) Rename to UserContext and give it a default shape
export const UserContext = createContext({
  user: null,
  updateUser: () => {},
  clearUser: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 2) Accept the new user data as a parameter
  const updateUser = (userData) => {
    setUser(userData);
  };

  // 3) Clear user data (e.g., on logout)
  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
