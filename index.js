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


async function run(){
  try{
    await client.connect()
    console.log("Hello");

    const productsCollection = client.db('tool-website').collection('products')
    const userCollection = client.db('tool-website').collection('users');
    const ordersCollection = client.db('tool-website').collection('orders');

    //Get Products
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
    //get one
    app.get('/products/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const result = await productsCollection.findOne(query)
      res.send(result)
    })

    //add orders 
    app.post('/orders', async(req, res)=>{
      const newOrder = req.body
      const result  = await ordersCollection.insertOne(newOrder) 
      res.send({result})
    })

    //Get user
    app.get('/user', async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });
    //add user to mongo
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateUser = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateUser, options);
      res.send({ result});
    });


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