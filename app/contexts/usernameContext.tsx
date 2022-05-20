import React, { Dispatch, SetStateAction, useContext, useState } from 'react';

interface UsernameContextType {
  username: string | null,
  setUsername: Dispatch<SetStateAction<string | null>>,
  usernameToVerify: string | null,
  setUsernameToVerify: Dispatch<SetStateAction<string | null>>,
  admin: boolean | null,
  setAdmin: Dispatch<SetStateAction<boolean | null>>,
}

export const usernameContext = React.createContext<UsernameContextType | null>(null);

export const useUsername = () => {
  const value = useContext(usernameContext);
  if (!value)
    throw new Error('Ilegal use of context');

  return value;
};
