import React, { Dispatch, SetStateAction, useContext } from 'react';
import * as texts from '~/assets/langs/en.texts.json';

interface LangsContextType {
  translations: typeof texts,
  setTranslations: Dispatch<SetStateAction<typeof texts>>,
  lang: 'english' | 'czech',
  setLang: Dispatch<SetStateAction<'english' | 'czech'>>,
}

export const langsContext = React.createContext<LangsContextType | null>(null);

export const useLangs = () => {
  const value = useContext(langsContext);
  if (!value)
    throw new Error('Ilegal use of context');

  return value;
};
