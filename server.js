const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const {dataBase, Query, Chunk} = require('./database.js')

app.use(cors());

// Connect to database
dataBase.connect( err => {
  if (err) throw err;
  console.log("base de datos conectada")
})

// Query database
const muchos = [];
dataBase.query(Query, (err, results) => {
  if (err) throw err;
  results.forEach(result => {
    muchos.push({"ingrampartnumber" : `${result.SKU}`, "quantity" : 1 })
    
    });
    const productos = Chunk(muchos);
    productos.forEach(chunk => {
      getPrice(chunk);
    })
  });

//                                Get Token 
const getToken = async ()  => {
  const header = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  const tokenUrl = '<link_here>';
  const postFields = '<post_here>';

  let response = await axios.post(tokenUrl, postFields, header);
  let data = await response.data.access_token;

  return data;
}

//                              Set PNA Config Params 
const baseUrl = "https://api.ingrammicro.com:443/resellers/v5/catalog/priceandavailability";

// Get PNA Function
const getPrice = async (chunk) => {
  const requestObject = {
    "servicerequest": {
      "requestpreamble": {
        "customernumber": "<No.>",
        "isocountrycode": "PE"
      },
      "priceandstockrequest": {
        "showwarehouseavailability": "True",
        "extravailabilityflag": "Y",
        "item": chunk, 
        "includeallsystems": false
      }
    }
  };
  let token = await getToken();
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 

axios.post(baseUrl, requestObject)
  .then(response => {
    const arrayOfSku = response.data.serviceresponse.priceandstockresponse.details;
    arrayOfSku.forEach(product => {
      console.log(`El sku: ${product.ingrampartnumber} tiene un precio de ${product.customerprice}`);
      
    });
  })
  .catch(function (error) {
    if (error.response) {
      console.log(error.response.data);
    }else {
      console.log('Error', error.message);
    }
});
}