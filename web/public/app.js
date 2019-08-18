$('#navbar').load('navbar.html');
$('#footer').load('footer.html');
const API_URL = 'https://217616227-sit-209.now.sh/api'; 

const devices = JSON.parse(localStorage.getItem('devices')) || [];
const response = $.get(`${API_URL}/devices`);
console.log(response);

$.get(`${API_URL}/devices`)
.then(response => {
 response.forEach(device => {
 $('#devices tbody').append(`
 <tr>
 <td>${device.user}</td>
 <td>${device.name}</td>
 </tr>`
 );
 });
})
.catch(error => {
 console.error(`Error: ${error}`);
});

const users = JSON.parse(localStorage.getItem('users')) || [];

users.forEach(function(user) {
    $('#users tbody').append(`
        <tr>
            <td>${user.username}</td>
            <td>${user.password}</td>
        </tr>`
    );
});

$('#add-device').on('click', () => {
    const name = $('#name').val();
    const user = $('#user').val();
    const sensorData = [];
    const body = {
    name,
    user,
    sensorData
    };
    $.post(`${API_URL}/devices`, body)
    .then(response => {
    location.href = '/';
    })
    .catch(error => {
    console.error(`Error: ${error}`);
    });
   });
   
$('#send-command').on('click', function() {   
    const command = $('#command').val();   
    console.log(`command is: ${command}`); 
});

$('#register').on('click', function() {
    const username = $('#username').val();
    const password = $('#password').val();
    const confirmPassword = $('#confirm-password').val();
    const exists = users.find(user => user.username === username);

    if (exists == undefined && password === confirmPassword)
    {
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        location.href = '/login';
    }
    else
    {
        var newText = "The account've already existed or the confirm password is not match";
        $('#message').text(newText);
    }
});

$('#login').on('click', function() {
    const usernameL = $('#usernameL').val();
    const passwordL = $('#passwordL').val();
    const existsL = users.find(user => user.username === usernameL);

    if (existsL == undefined)
    {
        var newTextL = "The account haven't existed yet";
        $('#messageL').text(newTextL);
    }
    else if (usernameL == existsL.username && passwordL == existsL.password )
    {
        const isAuthenticated = true;
        localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
        location.href = '/';
    }
    else
    {
        var newText2 = "Wrong password";
        $('#messageL').text(newText2);
    }
});

const logout = () => {   
    localStorage.removeItem('isAuthenticated');   
    location.href = '/login'; 
}