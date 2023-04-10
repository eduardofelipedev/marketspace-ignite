import { useContext } from 'react';

import { AuthContext } from '../contexts/AuthContexts';

export function useAuth(){
    const context = useContext(AuthContext);
    return context;
}