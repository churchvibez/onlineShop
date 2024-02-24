import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup = () => 
{
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const {signup, error, isLoading} = useSignup()
    
    const handleSubmit = async (e) =>
    {
        e.preventDefault()
        await signup(username, password)
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>Signup</h3>

            <label>Username:</label>
            <input
                type="string"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />

            <label>Password:</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <button disabled={isLoading}>Sign Up</button>
            {error && <div>{error}</div>}
        </form>
    )
}

export default Signup