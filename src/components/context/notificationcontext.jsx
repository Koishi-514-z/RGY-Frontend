import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [privateNotifications, setPrivateNotifications] = useState([]); 
    const [publicNotifications, setPublicNotifications] = useState([]); 

    return (
        <NotificationContext.Provider value={{privateNotifications, setPrivateNotifications, publicNotifications, setPublicNotifications}}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}
