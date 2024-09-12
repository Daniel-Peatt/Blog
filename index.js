import express from "express";


const port = 3000;
const app = express();

// Creating an array of objects to store the blog post information
let blogPost = [];

// Fill blogPost with Example
blogPost.push({
    title: "Dachshund", 
    content: `Dachshund, dog breed of hound and terrier ancestry developed in Germany to pursue badgers into their burrows. The Dachshund is a long-bodied, characteristically lively dog with a deep chest, short legs,
     tapering muzzle, and long ears. Usually reddish brown or black-and-tan, it is bred in two sizes—standard and miniature—and in three coat types—smooth, longhaired, and wirehaired. The standard Dachshund stands about 8 
     to 9 inches (20 to 23 cm) tall at the withers and weighs 16 to 32 pounds (7 to 14.5 kg). The miniature is shorter and weighs no more than 11 pounds (5 kg).`});
blogPost.push({
    title: "Ireland", 
    content: `The magnificent scenery of Irelands Atlantic coastline faces a 2,000-mile- (3,200-km-) wide expanse of ocean, and its geographic isolation has helped it to
     develop a rich heritage of culture and tradition that was linked initially to the Gaelic language. Washed by abundant rain, the countrys pervasive grasslands create a green-hued landscape that is responsible 
     for the popular sobriquet Emerald Isle. Ireland is also renowned for its wealth of folklore, from tales of tiny leprechauns with hidden pots of gold to that of the patron saint, Patrick, with his legendary ridding 
     the island of snakes and his reputed use of the three-leaved shamrock as a symbol for the Christian Trinity. But while many may think of Ireland as an enchanted land, the republic has been beset with perennial 
     concerns—emigration, cultural and political identity, and relations with Northern Ireland comprising the 6 of Irelands 32 counties within the province of Ulster that remain part of the United Kingdom. At the
     beginning of the 21st century, Irelands long-standing economic problems were abating, owing to its diverse export-driven economy, but calamity struck again in 2008 when a new financial and economic crisis befell 
     the country, culminating in a very costly bailout of the Irish economy by the European Union EU and the International Monetary Fund.`});
blogPost.push({
    title: "Florida Manatee", 
    content: `The Florida manatee, a subspecies of the West Indian manatee, is a large, slow-moving marine mammal with an elongated, round body and paddle-shaped flippers and tail. Manatees are herbivores, 
    feeding solely on seagrass, algae and other vegetation in freshwater and estuarine systems in the southeastern United States. Florida manatees can be found as far west as Texas and as far north as Massachusetts 
    during summer months, but during the winter, manatees congregate in Florida, as they require warm-water habitats to survive. Abundance of the subspecies has increased over the last 30 years, which prompted the 
    U.S. Fish and Wildlife Service (FWS) to downlist the West Indian manatee from endangered to threatened in 2017. However, due to their slow speed and relatively high buoyancy, manatees are often struck by vessels, 
    which is the primary cause of human-related deaths of the species. Additionally, manatees continue to be threatened by loss of warm-water habitat and periodic die-offs from red tides and unusually cold weather events. 
    Florida manatees are managed jointly by both FWS and the Florida Fish and Wildlife Conservation Commission (FWC).`});

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