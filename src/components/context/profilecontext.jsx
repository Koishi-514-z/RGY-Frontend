import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
    const [profile, setProfile] = useState({
        userid: null,
        username: null,
        email: null,
        avatar: null,
        note: null,
        role: null,
        jointime: null,
        level: null
    });

    return (
        <ProfileContext.Provider value={{profile, setProfile}}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    return useContext(ProfileContext);
}
