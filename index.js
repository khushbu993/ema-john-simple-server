const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ctprr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port = 5000;





client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");
    console.log('database connected successfully');
    //post api create data 
    app.post('/addProduct', (req, res) => {
        const products = req.body;
        // console.log(products);
        productsCollection.insertOne(products)
            .then(result => {
                // console.log(result.insertedCount);
                res.send(result.insertedCount);
            })
    });

    //get api load many data
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    //get api load single data
    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    });

    //post api 
    app.post('/productsByKey', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    //post api create order
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        // console.log(products);
        ordersCollection.insertOne(order)
            .then(result => {
                // console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    });
});


app.get('/', (req, res) => {
    res.send('Hello ema-john!')
});

app.listen(port);