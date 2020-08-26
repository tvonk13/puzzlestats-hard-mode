import { createContext } from 'react';

const initialStatUser = {};

const StatUserContext = createContext({
    statUser: initialStatUser,
    setStatUser: () => {},
});

export default StatUserContext;