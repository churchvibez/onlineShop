import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const UserDetails = ({ users }) => {
  const { user } = useAuthContext();
  const [editedUsers, setEditedUsers] = useState(users);

  useEffect(() => {
    setEditedUsers(users);
  }, [users]);

  const handleEditClick = async (editedUser) => {
    try {
      const response = await fetch(`http://localhost:1337/users/${editedUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        setEditedUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === editedUser._id ? editedUser : u))
        );
        console.log('User updated successfully');
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };

  const handleDeleteClick = async (userId) => {
    try {
      const response = await fetch(`http://localhost:1337/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        setEditedUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
        console.log('User deleted successfully');
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  const handleInputChange = (e, userId, field) => {
    const updatedUsers = editedUsers.map((u) =>
      u._id === userId ? { ...u, [field]: e.target.value } : u
    );
    setEditedUsers(updatedUsers);
  };

  return (
    <div className='user-details'>
      <h3>USERS</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {editedUsers.map((user) => (
            <tr key={user._id}>
              <td>
                <input
                  type='text'
                  value={user.username}
                  onChange={(e) => handleInputChange(e, user._id, 'username')}
                />
              </td>
              <td>
                <input
                  type='text'
                  value={user.role}
                  onChange={(e) => handleInputChange(e, user._id, 'role')}
                />
              </td>
              <td>
                <button onClick={() => handleEditClick(user)}>Edit</button>
                <button onClick={() => handleDeleteClick(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDetails;
