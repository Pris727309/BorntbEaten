const AWS = require('aws-sdk');
const config = require('./aws-config.js');
const uuidv1 = require('uuid/v1');

const getRecetas = async (limit, lastItem) => {
    AWS.config.update(config.aws_remote_config);

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: config.aws_recetas_table_name,
        Limit: limit
    };
    if (lastItem) {
        params.ExclusiveStartKey = { item_id: lastItem};
      }

    try {
        const data = await docClient.scan(params).promise()
        console.log("Getting Recetas Success")
        console.log(data)
        return data.Items
    } catch (err) {
        console.log("Failure", err.message)
        return false
    }
}

const getReceta = async (uid) => {
    AWS.config.update(config.aws_remote_config);

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: config.aws_recetas_table_name,
        Key : {
            'uid' : uid
        }
    };
    console.log(params)
    try {
        const data = await docClient.get(params).promise()
        console.log("Getting Receta Success")
        console.log(data)
        return data.Item
    } catch (err) {
        console.log("Failure", err.message)
        return false
    }

}

const deleteReceta = async (uid) => {
    console.log('Delete Receta')
    AWS.config.update(config.aws_remote_config);

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: config.aws_recetas_table_name,
        Key : {
            'uid' : uid
        }
    };
    console.log(params)
    try {
        const data = await docClient.delete(params).promise()
        console.log("Deletting Receta Success")
        console.log(data)
        return data.Item
    } catch (err) {
        console.log("Failure", err.message)
        return false
    }

}

const addReceta = async (recetaInput) => {
    console.log('Adding new Receta')
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const receta = {
        "nombre": recetaInput.Nombre,
        "porciones": recetaInput.Porciones,
        "ingredientes": recetaInput.Ingredientes,
        "pasos": recetaInput.Pasos,
        "categoria": recetaInput.Categoria,
        "favoritos": recetaInput.Favoritos,
        "uid": uuidv1()
    }

    console.log(receta)

    var params = {
        TableName: config.aws_recetas_table_name,
        Item: receta
    };

    try {
        const data = await docClient.put(params).promise()
        console.log("Receta Creation Success")
        console.log(data)
        return receta
    } catch (err) {
        console.log("Failure", err.message)
        return false
    }
 
}

const updateReceta = async (recetaInput, uid) => {
    console.log('Updating Receta ...')
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();

    console.log(recetaInput)

    var params = {
        TableName:config.aws_recetas_table_name,
        Key:{
            "uid": uid
        },
        UpdateExpression: "set nombre = :n, porciones =:p , ingredientes=:i, pasos = :pasos, categoria = :c, favoritos=:f",
        ExpressionAttributeValues:{
            ":n": recetaInput.Nombre,
            ":p": recetaInput.Porciones,
            ":i": recetaInput.Ingredientes,
            ":pasos" : recetaInput.Pasos,
            ":c": recetaInput.Categoria,
            ":f": recetaInput.Favoritos,
        },
        ReturnValues:"UPDATED_NEW"
    };

    try {
        const data = await docClient.update(params).promise()
        console.log("Receta Updated Success")
        console.log(data)
        return receta
    } catch (err) {
        console.log("Failure", err.message)
        return false
    }
 
}

module.exports = {
    getRecetas,
    getReceta,
    addReceta,
    updateReceta,
    deleteReceta
}