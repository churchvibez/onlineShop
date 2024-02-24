import { useState } from "react";
import { AuthContext } from "../context/AuthContext"
import { useAuthContext } from "./useAuthContext";

export const useSignup = () =>
{
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false) // Changed to false initially
    const {dispatch} = useAuthContext()

    const signup = async (username, password) => 
    {
        setIsLoading(true)
        setError(null)

        const response = await fetch('http://localhost:1337/signup', 
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        const json = await response.json()

        if (!response.ok)
        {
            setIsLoading(false) // Reset loading state
            setError(json.error)
        }
        if (response.ok)
        {
            localStorage.setItem('user', JSON.stringify(json))
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
        }
    }
    return {signup, isLoading, error}
}

