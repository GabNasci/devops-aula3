import React, { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:5000/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  // Fetch all users and display them
  const getUsers = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error:', error));
  };

  // Add a new user
  const addUser = () => {
    if (!name || !age) {
      alert('Please fill in both name and age');
      return;
    }

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, age: parseInt(age) }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        console.log(data);
        
        getUsers(); // Refresh the list
      })
      .catch(error => console.error('Error:', error));
  };

  // Delete a user
  const deleteUser = (userId) => {
    fetch(`${API_URL}/${userId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        getUsers(); // Refresh the list
      })
      .catch(error => console.error('Error:', error));
  };

  // Fetch users on page load
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <h1>User Management</h1>
      
      <div className="form-container">
        <h2>Add User</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button onClick={addUser}>Add User</button>
      </div>
      
      <h2>Users List</h2>
      <ul id="users-list">
        {users.map(user => (
          <li key={user[0]}>
            {user[1]} (Age: {user[2]}) 
            <button onClick={() => deleteUser(user[0])}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
