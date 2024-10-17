const API_URL = 'http://127.0.0.1:5000/users';

// Fetch all users and display them
function getUsers() {
  fetch(API_URL)
    .then(response => response.json())
    .then(users => {
      const usersList = document.getElementById('users-list');
      usersList.innerHTML = ''; // Clear the list
      users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `${user[1]} (Age: ${user[2]}) <button onclick="deleteUser(${user[0]})">Delete</button>`;
        usersList.appendChild(li);
      });
    });
}

// Add a new user
function addUser() {
  const name = document.getElementById('name-input').value;
  const age = parseInt(document.getElementById('age-input').value);

  if (!name || !age) {
    alert('Please fill in both name and age');
    return;
  }

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, age })
  })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      getUsers(); // Refresh the list
    })
    .catch(error => console.error('Error:', error));
}

// Delete a user
function deleteUser(userId) {
  fetch(`${API_URL}/${userId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      getUsers(); // Refresh the list
    })
    .catch(error => console.error('Error:', error));
}

// Fetch users on page load
document.addEventListener('DOMContentLoaded', getUsers);
