import { createContext, useReducer, useEffect, useState } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            const fetchUserRole = async () => {
                try {
                    const response = await fetch(`http://localhost:1337/getUserRole/${storedUser.username}`);
                    if (response.ok) {
                        const { role } = await response.json();
                        dispatch({ type: 'LOGIN', payload: { ...storedUser, role } });
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUserRole();
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, isLoading, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
