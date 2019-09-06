$('#navbar').load('navbar.html');
$('#footer').load('footer.html');
// const API_URL = 'https://217616227-sit-209.now.sh/api'; 
const API_URL = 'http://localhost:5000/api'; 
const MQTT_URL = 'http://localhost:5001'

const devices = JSON.parse(localStorage.getItem('devices')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];
const currentUser = localStorage.getItem('user'); 
if (currentUser) {   
    $.get(`${API_URL}/users/${currentUser}/devices`)   
    .then(response => {  
        response.forEach((device) => {       
            $('#devices tbody').append(`         
            <tr data-device-id=${device._id}>           
            <td>${device.user}</td>           
            <td>${device.name}</td>         
            </tr>`       
            );     
        });
        $('#devices tbody tr').on('click', (e) => {   
            const deviceId = e.currentTarget.getAttribute('data-device-id');   
            $.get(`${API_URL}/devices/${deviceId}/device-history`)   
            .then(response => {     
                response.map(sensorData => {   
                    $('#historyContent').append(`     
                    <tr>       
                    <td>${sensorData.ts}</td>       
                    <td>${sensorData.temp}</td>       
                    <td>${sensorData.loc.lat}</td>       
                    <td>${sensorData.loc.lon}</td>     
                    </tr>   
                    `); 
                });  
                $('#historyModal').modal('show');
            }); 
        });   
    }) 
    .catch(error => {     
        console.error(`Error: ${error}`);   
    }); 
}
else {   
    const path = window.location.pathname;   
    if (path !== '/login' && path !== '/registration') {     
        location.href = '/login';
    }
}

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
    const deviceID = $('#deviceID').val();
    const body = {
        deviceID,
        command
    };
    $.post(`${MQTT_URL}/send-command/testing`, body)
    .then(response => {
    location.href = '/';
    })
    .catch(error => {
    console.error(`Error: ${error}`);
    });
});

$('#register').on('click', function() {
    const name = $('#username').val();
    const password = $('#password').val();
    const confirmPassword = $('#confirm-password').val();
    const exists = users.find(user => user.username === name);
    const isAdmin = false;

    if (exists == undefined && password === confirmPassword)
    {
        $.post(`${API_URL}/registration`, { name, password, isAdmin })
        .then((response) =>{
        if (response.success) {
            location.href = '/login';
            } 
        else {
            $('#message').append(`${response}`);
        }
        });
    }
    else
    {
        var newText = "The account've already existed or the confirm password is not match";
        $('#message').text(newText);
    }
});

$('#login').on('click', () => {   
    const name = $('#usernameL').val();   
    const password = $('#passwordL').val();   
    $.post(`${API_URL}/authenticate`, { name, password })   
    .then((response) =>{     
        if (response.success) {       
            localStorage.setItem('user', name);       
            localStorage.setItem('isAdmin', response.isAdmin);       
            location.href = '/';     
        } 
        else {       
            $('#messageL').append(`${response}`);     
        }   
    }); 
});
   
const logout = () => {   
    localStorage.removeItem('user');   
    localStorage.removeItem('isAdmin');
    location.href = '/login'; 
}