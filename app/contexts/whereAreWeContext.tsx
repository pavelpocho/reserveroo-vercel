import React, { Dispatch, SetStateAction, useContext } from 'react';


interface PagesContextType {
  signingIn: boolean | null,
  setSigningIn: Dispatch<SetStateAction<boolean>>,
  landingPage: boolean | null,
  setLandingPage: Dispatch<SetStateAction<boolean>>
}


export const signingInContext = React.createContext<PagesContextType | null>(null);

export const useWhereAreWe = () => {
  const value = useContext(signingInContext);
  if (!value)
    throw new Error('Ilegal use of context');

  return value;
};
