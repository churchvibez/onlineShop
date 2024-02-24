import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import ProductDetails from '../components/ProductDetails';
import AddProduct from '../components/AddProduct';
import UserDetails from '../components/UserDetails';
import AddUser from '../components/AddUser'; // Import the AddUser component
import { useProductsContext } from "../hooks/useProductContext";

const Dashboard = () => {
    const { products, dispatch } = useProductsContext();
    const { user } = useAuthContext();
    const [users, setUsers] = useState([]);

    // useEffect for fetching products
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

    // useEffect for fetching users
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

    return (
        <div>
            <div>
                <h3>PRODUCTS</h3>
                {products && products.map((product) => (
                    <ProductDetails key={product._id} product={product} />
                ))}
            </div>
            {user && (user.role === 'administrator' || user.role === 'moderator') && (
                <>
                    <AddProduct />
                    <AddUser />
                </>
            )}
            {user && (user.role === 'administrator' || user.role === 'moderator') && (
                <UserDetails users={users.map((user) => ({ ...user, key: user._id }))} />
            )}

        </div>
    );
};

export default Dashboard;
