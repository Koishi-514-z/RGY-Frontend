import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
    const [profile, setProfile] = useState(null);

    return (
        <ProfileContext.Provider value={{profile, setProfile}}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    return useContext(ProfileContext);
}
