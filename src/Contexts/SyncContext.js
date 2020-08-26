import { createContext } from 'react';

const initialIsSyncing = false;
const initialProgress = 0;

const SyncContext = createContext({
    isSyncing: initialIsSyncing,
    progress: initialProgress,
    setIsSyncing: () => {},
    setProgress: () => {},
});

export default SyncContext;