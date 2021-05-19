const AWS = require('aws-sdk');
const config = require('./aws-config.js');
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs');


const getUser = async (correo) => {
    AWS.config.update(config.aws_remote_config);

    const docClient = new AWS.DynamoDB.DocumentClient();

    const exp = 'correo = ' + correo
    const params = {
        TableName: config.aws_users_table_name,
        Key : {
            'correo' : correo
        }
    };

    console.log(params)

    try {
        const data = await docClient.get(params).promise()
        console.log("Getting User Success")
        console.log(data)
        return data.Item
    } catch (err) {
        console.log("Failure", err.message)
        return false
    }

}

const addUser = async (user) => {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const Item = user;

    user.Password = bcrypt.hashSync(user.Password, 8);
    console.log("hash: ", user.Password);

    const User = {
        "nombre": user.Nombre,
        "apellido": user.Apellido,
        "correo": user.Correo,
        "password": user.Password,
        "uid": uuidv1()
    }
    var params = {
        TableName: config.aws_users_table_name,
        Item:User
    };

    try {
        const data = await docClient.put(params).promise()
        console.log('User created')
        console.log(data)
        return User
    } catch (err) {
        console.log("Failure", err.message)
        return false
    }
}

module.exports = {
    getUser,
    addUser
}