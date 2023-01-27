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
    // await client.connect()
    // console.log("Hello");

    const productsCollection = client.db('tool-website').collection('products')
    const userCollection = client.db('tool-website').collection('users');
    const profileCollection = client.db('tool-website').collection('profiles');
    const ordersCollection = client.db('tool-website').collection('orders');
    const reviewsCollection = client.db('tool-website').collection('reviews');
    
    //=================================================
    //Products
    //=================================================
    
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

    //add product
    app.post('/products', async(req, res)=>{
      const newOrder = req.body
      const result  = await productsCollection.insertOne(newOrder) 
      res.send(result)
    })
    //delete product
    app.delete('/products/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const result = await productsCollection.deleteOne(query)
      res.send(result)
    })
    
    //==================================================
    //Orders
    //==================================================
    
    //get all orders
    app.get('/orders', async (req, res) => {
      const reviews = await ordersCollection.find().toArray();
      res.send(reviews);
    });

    //Get orders of specific email
    app.get('/orders/:email', async(req, res)=>{
      const email = req.params.email
      const query = {email:email}
      const result  = await ordersCollection.find(query).toArray() 
      res.send(result)
    })
    
    //add orders 
    app.post('/orders', async(req, res)=>{
      const newOrder = req.body
      const result  = await ordersCollection.insertOne(newOrder) 
      res.send(result)
    })
    app.delete('/orders/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const result = await ordersCollection.deleteOne(query)
      res.send(result)
    })
    

    //==================================================
    //Users
    //==================================================
    
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

    //make Admin
    app.put('/user/admin/:email', async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updateDoc = {
        $set: { role: 'admin' },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    //Admin or not
    app.get('/admin/:email', async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user.role === 'admin';
      res.send({ admin: isAdmin })
    })
    
    //==================================================
    //Profile
    //==================================================
    
    //get profile
    app.get('/profile/:email', async(req, res) =>{

      const email = req.params.email
      // console.log(email);
      const query = {email:email}
      const result = await profileCollection.findOne(query)
      res.send(result)
    })
    
    //add or update profile
    app.put('/profile/:email', async (req, res) => {
      const email = req.params.email;
      const profile = req.body;
      const filter = {email:email};
      const options = { upsert: true };
      const updateProfile = {
        $set: profile,
      };
      const result = await profileCollection.updateOne(filter, updateProfile, options);
      res.send(result);
    });

    //==================================================
    //Reviews
    //==================================================
    
    //get all reviews
    app.get('/reviews', async (req, res) => {
      const reviews = await reviewsCollection.find().toArray();
      res.send(reviews);
    });
    
    //add or update review
    app.put('/reviews/:email', async (req, res) => {
      const email = req.params.email;
      const review = req.body;
      const filter = {email:email};
      const options = { upsert: true };
      const updateReview = {
        $set: review,
      };
      const result = await reviewsCollection.updateOne(filter, updateReview, options);
      res.send(result);
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