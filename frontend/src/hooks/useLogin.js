import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:1337/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });

            if (!response.ok) {
                const json = await response.json();
                setError(json.error);
            } else {
                const json = await response.json();
                // Fetch user role
                const roleResponse = await fetch(`http://localhost:1337/getUserRole/${username}`);
                if (roleResponse.ok) {
                    const { role } = await roleResponse.json();
                    localStorage.setItem('user', JSON.stringify({ ...json, role }));
                    dispatch({ type: 'LOGIN', payload: { ...json, role } });
                } else {
                    setError("Error fetching user role");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};
