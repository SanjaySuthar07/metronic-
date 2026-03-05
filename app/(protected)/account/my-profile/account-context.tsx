'use client';

import { createContext, ReactNode, useContext } from 'react';
import { User } from '@/app/models/user';

interface AccountContextProps {
  user: User;
}

interface AccountProviderProps extends AccountContextProps {
  children: ReactNode;
}

const AccountContext = createContext<AccountContextProps | undefined>(
  undefined,
);

const useAccount = () => {
  const context = useContext(AccountContext);

  if (!context) {
    return { user: null };
  }

  return context;
};

const AccountProvider = ({ user, children }: AccountProviderProps) => {
  return (
    <AccountContext.Provider value={{ user }}>
      {children}
    </AccountContext.Provider>
  );
};


export default AccountProvider