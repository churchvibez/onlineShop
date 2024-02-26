import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import bcrypt from 'bcryptjs';

const AddUser = () => {
    const { user } = useAuthContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setError("You have to be logged in");
            return;
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        console.log(hashedPassword)
        const newUser = { username, password, role };
        const response = await fetch("http://localhost:1337/users", {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
        });
        const json = await response.json();
    
        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields);
        }
        if (response.ok) {
            setUsername("");
            setPassword("");
            setRole("");
            setError(null);
            setEmptyFields([]);
            console.log("New user added");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add new user</h3>

            <label>Username</label>
            <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className={emptyFields.includes('username') ? 'error' : ''}
            />

            <label>Password</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className={emptyFields.includes('password') ? 'error' : ''}
            />

            <label>Role</label>
            <select
                onChange={(e) => setRole(e.target.value)}
                value={role}
                className={emptyFields.includes('role') ? 'error' : ''}
            >
                <option value="">Select Role</option>
                <option value="basic">Basic</option>
                <option value="moderator">Moderator</option>
                <option value="administrator">Administrator</option>
            </select>

            <button>ADD USER</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default AddUser;
