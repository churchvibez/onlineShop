import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import ProductDetails from '../components/ProductDetails';
import AddProduct from '../components/AddProduct';
import UserDetails from '../components/UserDetails';
import AddUser from '../components/AddUser';
import BrandDetails from '../components/BrandDetails';
import CategoryDetails from '../components/CategoryDetails'; // Import CategoryDetails
import { useProductsContext } from "../hooks/useProductContext";
import io from 'socket.io-client'; // Import Socket.IO client
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Dashboard = () => {
    const { products, dispatch } = useProductsContext();
    const { user } = useAuthContext();
    const [users, setUsers] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]); // State for categories
    const [socket, setSocket] = useState(null);
    const [socketId, setSocketId] = useState(null); // State to store socket ID
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const newSocket = io("http://localhost:1337");
        setSocket(newSocket);
    
        // Emit event to request socket ID
        newSocket.emit('getSocketId');
    
        // Listen for socket ID from the backend
        newSocket.on('socketId', (id) => {
            setSocketId(id);
        });
    
        // Listen for productBought event
        newSocket.on('productBought', (data) => {
            console.log('Product bought event received:', data); // Log the received data
            setSnackbarMessage(`Product ${data.productId} has been bought`);
            setSnackbarOpen(true);
        });
    
        return () => {
            newSocket.disconnect();
        };
    }, [user]);




    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:1337/products', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    dispatch({ type: 'GET_PRODUCTS', payload: data });
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        if (user) {
            fetchProducts();
        }
    }, [dispatch, user]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:1337/users', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setUsers(data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (user) {
            fetchUsers();
        }
    }, [user]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await fetch('http://localhost:1337/products/brands', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setBrands(data); // Update brands state with fetched data
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        if (user) {
            fetchBrands();
        }
    }, [user]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:1337/products/categories', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setCategories(data); // Update categories state with fetched data
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        if (user) {
            fetchCategories();
        }
    }, [user]);

    return (
        <div>
            {socketId && <p>Socket ID: {socketId}</p>}
            <div>
                <h3>PRODUCTS</h3>
                {products && products.map((product) => (
                    <ProductDetails key={product._id} product={product} />
                ))}
            </div>
            {user && user.role === 'administrator' && (
                <>
                    <AddProduct />
                    <BrandDetails brands={brands} />
                    <CategoryDetails categories={categories} />
                    <AddUser />
                    <UserDetails users={users.map((user) => ({ ...user, key: user._id }))} />
                </>
            )}
            {user && user.role === 'moderator' && (
                <>
                    <AddProduct />
                    <BrandDetails brands={brands} />
                    <CategoryDetails categories={categories} />
                </>
            )}
        </div>
    );
};

export default Dashboard;
