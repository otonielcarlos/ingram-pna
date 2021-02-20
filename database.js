const mysql = require('mysql');
const chunks = require('chunk-array').chunks;



const dataBase = mysql.createConnection({
    host: "173.231.198.187",
    user: "bdicentralserver_sc",
    password: "Myl-PGfSbzcf",
    database: "bdicentralserver_sc"
  });
  
  const Query = "SELECT SKU FROM PEPricefile WHERE id_marca = 47 AND disponibilidad > 0 LIMIT 100;"


const Chunk = array => {
    return chunks(array, 50);
};
  



module.exports.dataBase = dataBase;
module.exports.Query = Query;
module.exports.Chunk = Chunk;