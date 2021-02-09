import mongodb =require("mongodb");
var MongoClient=mongodb.MongoClient;

const settings = require('../../settings.json');
const mongoConfig = settings.mongoConfig;
let options: mongodb.MongoClientOptions = {

        useNewUrlParser: true,
        useUnifiedTopology: true

};

let _connection:mongodb.MongoClient = undefined;
let _db:mongodb.Db = undefined;

const dbConnection = async ():Promise<mongodb.Db> => {
    if (!_connection) {
    
             _connection = await MongoClient.connect(mongoConfig.serverUrl, options);
        _db = await _connection.db(mongoConfig.database);
    }
    return _db;
};


export {dbConnection}