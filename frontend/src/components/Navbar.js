import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
    const { logout } = useLogout();
    const { user, isLoading } = useAuthContext();

    const handleClick = () => {
        logout();
    };

    return (
        <header>
            <div className="container">
                <nav>
                    {!user && (
                        <div>
                            <Link to="/">Login</Link>
                            <Link to="/signup">Signup</Link>
                        </div>
                    )}
                    {isLoading && <div>Loading...</div>}
                    {!isLoading && user && (
                        <div>
                            <span>Hello {user.username}, your role is {user.role}</span>
                            <button onClick={handleClick}>Log Out</button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
