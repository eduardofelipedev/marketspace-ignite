import axios from 'axios';


const axiosapi = axios.create({
    baseURL: 'https://192.144.96.13',
    
    // httpsAgent: new https.Agent({
    //     rejectUnauthorized: false,
    //   }),
    // httpsAgent: agent
});



const response = axiosapi.post('/api/', {
    auth: {
                username: 'Client_Id_6d6354ece40846bf7fca65dfabd5d9d4',
                password: 'Client_Secret_bf487e750299d9498da4e2d30cfcb89bf068164a'
            }
}).then(function (response) {
    console.log(response.data);
    }).catch(function (error) {
        console.log(error);
    });

    console.log('teste');