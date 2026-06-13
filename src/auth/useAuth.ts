import React from 'react';
import { AuthContext, type AuthContextValue } from './AuthContextValue';

export const useAuth = (): AuthContextValue => {
  const value = React.useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
};
