const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
// var MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jcavx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);

async function run(){
  try{
    await client.connect()
    console.log("Hello");

    const productsCollection = client.db('tool-website').collection('products')

    app.get('/products', async(req,res)=>{
      const size = parseInt(req.query.size)
      const query = {}
      const cursor = productsCollection.find(query)
      let products 
      if(size){
        products = await cursor.limit(size).toArray()
      }
      else{
        products = await cursor.toArray()
      }

      res.send(products)
    })
  }
  finally{

  }
}

run().catch(console.dir)

app.get('/', (req, res) =>{
  res.send("Inv Server running")
})

app.listen(port, ()=>{
  console.log("Listening ", port);
})