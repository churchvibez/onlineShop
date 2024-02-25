import React, { useState } from 'react';
import { useProductsContext } from '../hooks/useProductContext';
import { useAuthContext } from '../hooks/useAuthContext';

const ProductDetails = ({ product }) => {
  const { dispatch } = useProductsContext();
  const { user } = useAuthContext();
  const [quantity, setQuantity] = useState(product.number);
  const [editedName, setEditedName] = useState(product.name);
  const [editedBrand, setEditedBrand] = useState(product.brand);
  const [editedCategory, setEditedCategory] = useState(product.category);
  const [image, setImage] = useState(null); // State to hold the selected image file

  
  const handleBuyClick = async () => {
    if (!user) {
      return;
    }
    try {
      const newQuantity = product.number - quantity;
      if (newQuantity < 0) {
        console.error('Cannot buy more than available quantity');
        return;
      }
      console.log("Product ID:", product._id);
      console.log("New Quantity:", newQuantity);
      const response = await fetch(`http://localhost:1337/buy/products/${product._id}/${newQuantity}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();
  
      if (response.ok) {
        dispatch({ type: 'CHANGE_PRODUCT_AMOUNT', payload: { _id: product._id, number: newQuantity } });
        console.log("Product quantity updated successfully");
      }
    } catch (error) {
      console.error(error.message);
      // Handle error appropriately, e.g., show an error message to the user
    }
  };

  const handleEditClick = async () => {
    if (!user) {
      return;
    }
    try {
      const updates = {
        name: editedName,
        brand: editedBrand,
        category: editedCategory,
        number: quantity,
        image: await getBase64Image(image), // Convert selected image to base64 before updating
      };

      const response = await fetch(`http://localhost:1337/products/${product._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updates),
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'UPDATE_PRODUCT', payload: json }); // Update the product in context state
        console.log('Product updated successfully');
      }
    } catch (error) {
      console.error(error.message);
      // Handle error appropriately
    }
  };

  const handleDeleteClick = async () => {
    if (!user) {
      return;
    }
    try {
      console.log("Product ID to delete:", product._id); // Check if correct ID is being sent
      const response = await fetch(`http://localhost:1337/products/deleting/${product._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'DELETE_PRODUCT', payload: product }); // Pass the product itself as payload
      }
    } catch (error) {
      console.error(error.message);
      // Handle error appropriately, e.g., show an error message to the user
    }
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    setQuantity(value >= 1 ? value : 1);
  };

  // Function to convert selected image file to base64 format
  const getBase64Image = async (image) => {
    return new Promise((resolve, reject) => {
      if (!image) {
        resolve('');
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

  // Function to handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <div className="product-details">
        <p>
            <strong>Name:</strong>
            {user && (user.role === 'administrator' || user.role === 'moderator') ? (
                <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                />
            ) : (
                <span>{product.name}</span>
            )}
        </p>
        <p>
            <strong>Brand:</strong>
            {user && (user.role === 'administrator' || user.role === 'moderator') ? (
                <input
                    type="text"
                    value={editedBrand}
                    onChange={(e) => setEditedBrand(e.target.value)}
                />
            ) : (
                <span>{product.brand}</span>
            )}
        </p>
        <p>
            <strong>Category:</strong>
            {user && (user.role === 'administrator' || user.role === 'moderator') ? (
                <input
                    type="text"
                    value={editedCategory}
                    onChange={(e) => setEditedCategory(e.target.value)}
                />
            ) : (
                <span>{product.category}</span>
            )}
        </p>
        <p>
            <strong>Number:</strong>
            {user && (user.role === 'administrator' || user.role === 'moderator') ? (
                <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    step="1"
                />
            ) : (
                <span>{product.number}</span>
            )}
        </p>
        <p>
            <strong>Image:</strong>
            <img src={product.image} alt="Current Product" style={{ width: 100, height: 100 }} />
        </p>
        {user && (user.role === 'administrator' || user.role === 'moderator') && (
            <p>
                <strong>New Image:</strong>
                {!image && (
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                )}
                {image && (
                    <img src={URL.createObjectURL(image)} alt="Selected" style={{ width: 100, height: 100 }} />
                )}
            </p>
        )}

        {user && (user.role === 'administrator' || user.role === 'moderator') && (
            <>
                <button onClick={handleEditClick}>Save Changes</button>
                <button onClick={handleDeleteClick}>Delete Product</button>
            </>
        )}
        {user && user.role === 'basic' && (
            <div>
                <input 
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    step="1"
                />
                <button onClick={handleBuyClick}>Buy</button>
            </div>
        )}
    </div>
);
};

export default ProductDetails;
