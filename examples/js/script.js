setTimeout(() => {
  getUsers()
},500);


const getUsers = async () => {
  console.log("Get Users");
  const data = {
    username: 'JohnDoe',
    password: 'securePassword'
  };
  fetch('http://localhost:3000', { method:'POST', headers: {
      'Content-Type': 'application/json', // Indiquer que les données sont en JSON
    },
    body: JSON.stringify(data)})
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      return response.json();
    })
    .then(users => {
      const usersUl = window.document.getElementById('users');
      usersUl.innerHTML = '';
      for (user of users) {
        usersUl.innerHTML += `<li>${user.name}</li>`;
      }
      console.log(users);
    })
    .catch(error => {
      console.error('Erreur:', error);
    });
}
