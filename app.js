const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb://localhost/todoDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model('Item', itemsSchema);

// New items

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function()  {
  console.log('Server is running on port 3000');
});

let tasks = [];

app.get('/', async (req, res) => {
    try {
        const tasks = await Item.find({});
        res.render('index', { tasks: tasks });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving tasks from database.');
    }
});

app.post('/addtask', async (req, res) => {
    const newItem = new Item({
        name: req.body.newtask
    });
    try {
        await newItem.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error saving task.');
    }
});


app.post('/removetask', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.body.check);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error deleting task.');
    }
});

// Serve the static files

app.use(express.static('public'));

