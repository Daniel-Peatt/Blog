import express from "express";


const port = 3000;
const app = express();

// Creating an array of objects to store the blog post information
let blogPost = [];

// Setting the static files file path to start at public
app.use(express.static("public"));

// Set up the view engine for rendering 
app.set("view engine", "ejs");


// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

let loadedPost = null;
// Loading Post to screen 
app.post("/loadPost", (req, res) => {
    // Storing the title of the blog article chossen on the main page
    const postTitle = req.body.postTitle;
    
    // If there is a previously loaded post and it's the same as the current request
    // loadedPost is checked if it is null and Then the titles are compared
    if (loadedPost && postTitle === loadedPost.title) {
        // Set loadedPost to null, so if the user clicks on the same button it will bypass the code segment next pass through.
        loadedPost = null;
        // Render the page without the loadedPost
        // using return to ensure that the function ends here
        return res.render("index.ejs", { blogPost });
    }
    

    // Find the blog post with the matching title
    // loadedPost is essentialy a new object of a blogPost type, so it has the same properties. 
    // The post is a temperary aspect of the find() function to loop through the blogPost array to fins a matching title
    loadedPost = blogPost.find(post => post.title === postTitle);
    
    // If loadedPost was created sucsessfully
    if (loadedPost) {
        // Pass the loaded post to the template for rendering
        res.render("index.ejs", { blogPost, loadedPost });
    } else {
        res.status(404).send('Post not found');
    }
});

let revPost = null;
// Updating a post
app.post("/updatePost", (req,res) => {
    // saving the title of the blog selected
    const postTitle = req.body.postTitle;
    // Finding the matching title to load of the content
    revPost = blogPost.find(post => post.title === postTitle);
    // Responded with postTitle so it can be used to remove the old version of the blog
    res.render("updatePost.ejs", {revPost, postTitle, blogPost});
});

// Swap post
app.post("/swapPost", (req,res) => {
    // Saving the old title to delete old post
    let indexObj = blogPost.find(post => post.title === req.body.postTitle);
    // getting index and deleting on blog
    let index = blogPost.indexOf(indexObj);
    blogPost.splice(index, 1); 
    // adding the updated version
    blogPost.push({title: req.body.title, content: req.body.content});
    res.render("index.ejs", {blogPost});
});

// Delete a post
// By popping the blogPost from the array using the title
app.post("/delete", (req, res) => {
    // I first save the entire object here
    let indexObj = blogPost.find(post => post.title === req.body.deleteTitle);
    // I then use that object to find the index of it in the blogPost array
    let index = blogPost.indexOf(indexObj);
    // index would return -1 if unsucsessful
    if (index >= 0)
    {
        // splice will remove 1 object at index
        blogPost.splice(index, 1);
        res.render("index.ejs", {blogPost});
    }
    else{
       // Sends you back to homepage if deletion failed
        res.render("index.ejs", {blogPost}); 
    }
    
});

// Creating a post
app.post("/submitPost", (req, res) => {
    // Used to stop duplicate titles 
    if (blogPost.find(post => post.title === req.body.title))
    {
        const showPopup = true; // Set this conditionally based on your logic
        return res.render("createPost.ejs", {blogPost, showPopup, message: 'Title already exist'});
    }
    // adds the post to the blogPost array.
    blogPost.push({title: req.body.title, content: req.body.content});
    // renders the index with the updated blogPost
    return res.render("index.ejs", {blogPost});
});

// Home page redirections
app.get("/createPost", (req, res) => {
    res.render("createPost.ejs");
});

app.get("/updatePost", (req, res) => {
    res.render("updatePost.ejs", {blogPost});
});

app.get("/deletePost", (req, res) => {
    res.render("deletePost.ejs", {blogPost});
});

// Rendering homepage on startup
app.get("/", (req, res) => {
    res.render("index.ejs", {blogPost});
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});