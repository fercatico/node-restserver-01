const { response } = require('express');

const usersGet = (req, res = response) => {

    const { query, nombre = 'No name', apikey, page = '1'} = req.query;
    //url test http://localhost:8080/api/users?query=hola&apikey=123456789&page=22 
    res.json({
        msg: 'get API - controller',
        nombre,
        query,
        apikey,
        page,
    });
}

const usersPost = (req, res = response) => {

    const {nombre, edad} = req.body;

    res.json({
        msg: 'post API - controller',
        nombre,
        edad
    });

}

const usersPut = (req, res = response) => {

    const { id } = req.params;

    res.json({
        msg: 'put API - controller',
        id
    });
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controller',
    });
}

const usersDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controller',
    });
}

module.exports = {
    usersGet, usersPost, usersPut, usersPatch, usersDelete
}