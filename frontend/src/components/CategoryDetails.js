import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const CategoryDetails = ({ categories }) => {
    const { user } = useAuthContext();
    const [editedCategories, setEditedCategories] = useState(categories.map(() => ''));
    
    const handleEditClick = async (currentCategory, index) => {
        try {
            const response = await fetch(`http://localhost:1337/products/category/${currentCategory}/${editedCategories[index]}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ newCategory: editedCategories[index] }),
            });

            if (response.ok) {
                console.log('Category updated successfully');
            } else {
                console.error('Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error.message);
        }
    };

    const handleDeleteClick = async (category) => {
        try {
            const response = await fetch(`http://localhost:1337/products/category/${category}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
    
            if (response.ok) {
                // Remove the deleted category from the list
                setEditedCategories((prevCategories) => prevCategories.filter((c) => c !== category));
                console.log('Category deleted successfully');
            } else {
                console.error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error.message);
        }
    };


    return (
        <div className='category-details'>
            <h3>CATEGORIES</h3>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr key={index}>
                            <td>{category}</td>
                            <td>
                                <input
                                    type='text'
                                    placeholder='Enter new category'
                                    value={editedCategories[index]}
                                    onChange={(e) => {
                                        const newCategories = [...editedCategories];
                                        newCategories[index] = e.target.value;
                                        setEditedCategories(newCategories);
                                    }}
                                />
                            </td>
                            <td>
                                <button onClick={() => handleEditClick(category, index)}>Edit</button>
                                <button onClick={() => handleDeleteClick(category)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryDetails;
