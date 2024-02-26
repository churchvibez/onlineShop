import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const BrandDetails = ({ brands }) => {
    const { user } = useAuthContext();
    const [editedBrands, setEditedBrands] = useState(brands.map(() => ''));
    
    const handleEditClick = async (currentBrand, index) => {
        try {
            const response = await fetch(`http://localhost:1337/products/brand/${currentBrand}/${editedBrands[index]}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ newBrand: editedBrands[index] }),
            });

            if (response.ok) {
                console.log('Brand updated successfully');
            } else {
                console.error('Failed to update brand');
            }
        } catch (error) {
            console.error('Error updating brand:', error.message);
        }
    };

    const handleDeleteClick = async (brand) => {
        try {
            const response = await fetch(`http://localhost:1337/products/brand/${brand}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
    
            if (response.ok) {
                setEditedBrands((prevBrands) => prevBrands.filter((b) => b !== brand));
                console.log('Brand deleted successfully');
            } else {
                console.error('Failed to delete brand');
            }
        } catch (error) {
            console.error('Error deleting brand:', error.message);
        }
    };

    return (
        <div className='brand-details'>
            <h3>BRANDS</h3>
            <table>
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map((brand, index) => (
                        <tr key={index}>
                            <td>{brand}</td>
                            <td>
                                <input
                                    type='text'
                                    placeholder='Enter new brand'
                                    value={editedBrands[index]}
                                    onChange={(e) => {
                                        const newBrands = [...editedBrands];
                                        newBrands[index] = e.target.value;
                                        setEditedBrands(newBrands);
                                    }}
                                />
                            </td>
                            <td>
                                <button onClick={() => handleEditClick(brand, index)}>Edit</button>
                                <button onClick={() => handleDeleteClick(brand)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BrandDetails;
