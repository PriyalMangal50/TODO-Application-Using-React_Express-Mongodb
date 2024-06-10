var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://todo_app:Priyal12345@cluster0.n6opdxq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const itemSchema = {
    name: String
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Food",
});
const item2 = new Item({
    name: "Lunch",
});
const d = [item1, item2];

// app.get route using async/await
app.get("/", async (req, res) => {
    try {
        const items = await Item.find({});
        if (items.length === 0) {
            await Item.insertMany(d);
            console.log("Successfully saved items to DB");
            res.redirect("/");
        } else {
            res.render("list", { newListItems: items });
        }
    } catch (err) {
        console.error("Error retrieving items:", err);
        res.status(500).send("Error retrieving items");
    }
});

// app.post route using async/await
app.post("/", async (req, res) => {
    const itemName = req.body.n;
    const item = new Item({
        name: itemName
    });

    try {
        await item.save();
        res.redirect("/");
    } catch (err) {
        console.error("Error saving item:", err);
        res.status(500).send("Error saving item");
    }
});

// app.post route for delete using async/await
app.post("/delete", async (req, res) => {
    const check = req.body.checkbox;
    try {
        await Item.findByIdAndDelete(check);  // Use findByIdAndDelete instead of findByIdAndRemove
        console.log("Successfully deleted");
        res.redirect("/");
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).send("Error deleting item");
    }
});

app.listen(3000, function () {
    console.log("Server is listening on port 3000");
});
