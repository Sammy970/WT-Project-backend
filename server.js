const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb')
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Define storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // specify upload directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // use original filename
    }
});


const uri = 'mongodb+srv://Samyak970:Samyak970@data.a9ny5hi.mongodb.net/test'
const dbName = 'testDb'
const colName = 'testCol'

const client = new MongoClient(uri);
const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static('uploads'))

// Define a route
app.post('/api/data', upload.single('image'), async (req, res) => {
    // Handle the request and send a response
    const title = req.body.title
    const desc = req.body.desc;
    const select = req.body.select;
    const price = req.body.price;
    const file = req.file;
    const fileName = file.originalname;
    console.log("Hello");

    app.locals.imageUrl = `${req.protocol}://${req.get('host')}/${file.path}`;
    console.log(app.locals.imageUrl);

    // if(app.locals.selVal == crafts) {

    // }

    var collection;
    var collection_all;


    const object = {
        "title": title,
        "desc": desc,
        "select": select,
        "price": price,
        'image': app.locals.imageUrl
    }

    app.locals.selVal = object['select'];

    switch (app.locals.selVal) {
        case "Sketches and Paintings":
            await client.connect();
            var database = client.db('products')
            collection = database.collection('sketch')
            collection_all = database.collection('all-category')
            break;
        case "Crafts":
            await client.connect();
            var database = client.db('products')
            collection = database.collection('crafts')
            collection_all = database.collection('all-category')
            break;
        case "Pottery":
            await client.connect();
            var database = client.db('products')
            collection = database.collection('pottery')
            collection_all = database.collection('all-category')
            break;
        case "Ornaments":
            await client.connect();
            var database = client.db('products')
            collection = database.collection('ornaments')
            collection_all = database.collection('all-category')
            break;
        case "Gift-Cards":
            await client.connect();
            var database = client.db('products')
            collection = database.collection('gift-cards')
            collection_all = database.collection('all-category')
            break;
        default:
            console.log("None is selected")
    }

    await collection.insertOne(object)
    await collection_all.insertOne(object)
    await client.close()
});

app.post('/api/getData', async (req, res) => {

    if (app.locals.filterVal) {
        // console.log(app.locals.array)
        app.locals.selVal = app.locals.filterVal
    } else {
        //do nothing
    }

    var collection;

    switch (app.locals.selVal) {
        case "sketch":
            await client.connect();
            var database = client.db('products')
            collection = database.collection('sketch')
            break;
        case "crafts":
            await client.connect();
            var database = client.db('products')
            collection = database.collection('crafts')
            break;
        case "pottery":
            await client.connect();
            var database = client.db('products')
            collection = database.collection('pottery')
            break;
        case "ornaments":
            await client.connect();
            var database = client.db('products')
            collection = database.collection('ornaments')
            break;
        case "gift-cards":
            await client.connect();
            var database = client.db('products')
            collection = database.collection('gift-cards')
            break;
        default:
            await client.connect();
            var database = client.db('products')
            collection = database.collection('all-category')
            break;
    }


    // console.log("not combined")
    const projection = { name: 1 };
    const find = await collection.find({}, projection).toArray();
    res.send(find)

})

app.post('/api/getSelection', upload.none(), async (req, res) => {
    console.log(req.body.selectedValue)
    app.locals.selVal = req.body.selectedValue;
})


//Data from FilterForm.js
app.post('/api/submit', (req, res) => {
    var selectedValues = req.body.selectedValues;
    app.locals.filterVal = selectedValues;
    res.send("All Good")
    // Handle selectedValues in backend server
    // ...
});

const PORT = process.env.PORT || 5000
// Start the server
app.listen(PORT, () => {
    console.log('Server is running on port 5000');
});
