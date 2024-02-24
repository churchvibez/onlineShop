import { useState } from "react";
import {useProductsContext} from '../hooks/useProductContext'
import { useAuthContext } from "../hooks/useAuthContext";

const AddProduct = () => {
    const {dispatch} = useProductsContext()
    const {user} = useAuthContext()
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [number, setNumber] = useState("");
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([])
    

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Ensure that the file object is properly obtained
        setImage(file)
        console.log('File:', file);
        const reader = new FileReader();
    
        
    
        reader.readAsDataURL(file); // Make sure the file is read as data URL
    };  

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user)
        {
            setError("have to be logged in")
            return
        }

        // Convert image to base64 format
        const base64Image = await getBase64Image(image);
    
        const product = { name, brand, category, image: base64Image, number };
        const response = await fetch("http://localhost:1337/products", {
            method: "POST",
            body: JSON.stringify(product),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.token}`
            },
        });
        const json = await response.json();
    
        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields)
        }
        if (response.ok) {
            setName("");
            setBrand("");
            setCategory("");
            setImage("");
            setNumber("");
            setError(null);
            setEmptyFields([])
            console.log("New product added");
            dispatch({type: "CREATE_PRODUCT", payload: json})
        }
    };
    
    const getBase64Image = async (image) => {
        return new Promise((resolve, reject) => {
            if (!image) {
                resolve("");
                return;
            }
    
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
    
            reader.readAsDataURL(image);
        });
    };
    
    

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add new product</h3>

            <label>Name</label>
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className={emptyFields.includes('name') ? 'error' : ''}
            />

            <label>Brand</label>
            <input
                type="text"
                onChange={(e) => setBrand(e.target.value)}
                value={brand}
                className={emptyFields.includes('brand') ? 'error' : ''}
            />

            <label>Category</label>
            <input
                type="text"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className={emptyFields.includes('category') ? 'error' : ''}
            />

            <label>Image</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={emptyFields.includes('image') ? 'error' : ''}
            />
            {image && (
                <img
                    src={image}
                    alt="Selected"
                    style={{ width: 100, height: 100 }}
                />
            )}

            <label>Number</label>
            <input
                type="number"
                onChange={(e) => setNumber(e.target.value)}
                value={number}
                className={emptyFields.includes('number') ? 'error' : ''}
            />

            <button>ADD PRODUCT</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default AddProduct;
