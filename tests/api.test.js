const dotenv = require('dotenv'); 
const axios = require('axios'); 
dotenv.config(); 
 
const { API_URL } = process.env;

test('test device array', () => {   
    expect.assertions(2);   
    return axios.get(`${API_URL}/devices`)     
    .then(resp => resp.data)     
    .then(resp => {       
        expect(resp[0].user).toEqual('sam');
        expect(resp[1].user).toEqual('mary123');
    });   
}); 

test('test device history', () => {   
    expect.assertions(2);   
    return axios.get(`${API_URL}/devices/5d428c09bdded8dfa7c9e021/device-history`)     
    .then(resp => resp.data)     
    .then(resp => {       
        expect(resp[0].ts).toEqual('1529545935');
        expect(resp[0].temp).toEqual(14);
    });   
}); 

test('test user bob detail', () => {   
    expect.assertions(3);   
    return axios.get(`${API_URL}/users/bob/devices`)     
    .then(resp => resp.data)     
    .then(resp => {       
        expect(resp[0].name).toEqual("Bob's Samsung Galaxy");
        expect(resp[0].user).toEqual('bob');
        expect(resp[0].id).toEqual("5");
    });   
});