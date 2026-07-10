"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export interface UserSessionData {
    id: string | number;
    name: string;
    email: string;
    phone?: string;
    student_id?: string; // nim
    roles: { id: number; name: string }[];
    role?: string;
}

interface AuthContextType {
    user: UserSessionData | null;
    token: string | null;
    loading: boolean;
    loginContext: (token: string, user: UserSessionData) => void;
    logoutContext: () => void;
    updateUserContext: (updatedUser: Partial<UserSessionData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserSessionData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Run only on client side mount
        const storedToken = localStorage.getItem("jwt_token");
        const storedSession = localStorage.getItem("user_session");

        if (storedToken && storedSession) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedSession));
            } catch (err) {
                console.error("Gagal memuat session user:", err);
                localStorage.removeItem("jwt_token");
                localStorage.removeItem("user_session");
            }
        }
        setLoading(false);
    }, []);

    const loginContext = (newToken: string, newUser: UserSessionData) => {
        localStorage.setItem("jwt_token", newToken);
        localStorage.setItem("user_session", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logoutContext = () => {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_session");
        Cookies.remove("jwt_token");
        Cookies.remove("user_role");
        setToken(null);
        setUser(null);
    };

    const updateUserContext = (updatedData: Partial<UserSessionData>) => {
        if (!user) return;
        const newUser = { ...user, ...updatedData };
        localStorage.setItem("user_session", JSON.stringify(newUser));
        setUser(newUser);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, loginContext, logoutContext, updateUserContext }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
