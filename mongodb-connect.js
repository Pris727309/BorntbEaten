const mongoose = require('mongoose');
let user = "PCV";
let password = "pfinal";
let dbname = "pfusers";
const dburl = `mongodb+srv://${user}:${password}@cluster0.sm0ad.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(dburl, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=> console.log("Conectado a la base de datos"))
  .catch((err)=> console.log("No conectado error: ", err));

  module.exports = mongoose;