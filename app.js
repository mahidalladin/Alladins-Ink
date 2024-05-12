import multer from 'multer';
const storage = multer.diskStorage({ destination: (req, file, cb) => {
  
   cb(null, './uploads/'); // specify the upload directory

},
 filename: (req, file, cb) => { cb(null, file.originalname); } });

const upload = multer({ storage });

import express from "express";
 import bodyParser from "body-parser";
  import fs from "fs";

import ejs from "ejs";
import methodOverride from 'method-override';

import { dirname } from "path";
 import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.delete("/blogs/:id", (req, res) => {
const { id } = req.params;

// Read the blogs from the file
fs.readFile("blogs.json", "utf8", (err, data) => {
if (err) {
console.error(err);
return res.status(500).send("Error loading the blog");
}

let blogs = JSON.parse(data);
const index = blogs.findIndex((b) => b.id === id);

if (index === -1) {
return res.status(404).send("Blog not found");
}

blogs.splice(index, 1);

// Write the updated blogs back to the file
fs.writeFile("blogs.json", JSON.stringify(blogs), (err) => {
if (err) {
console.error(err);
return res.status(500).send("Error saving the blog");
}

// Remove the blog link from the file
fs.readFile("blog_links.txt", "utf8", (err, data) => {
if (err) {
console.error(err);
return res.status(500).send("Error loading the blog links");
}

const blogLinks = data.split("\n").filter((link) => link.length > 0);const newBlogLinks = blogLinks.filter((link) => link.split("/")[2] !== id);

// Write the updated blog links back to the file
fs.writeFile("blog_links.txt", newBlogLinks.join("\n"), (err) => {
if (err) {
console.error(err);
return res.status(500).send("Error saving the blog links");
}

res.redirect("/allblogs");
});
});
});
});
});


app.get("/", (req, res) => { res.sendFile(__dirname + "/views/index.html"); });

app.get("/create", (req, res) =>{ res.sendFile(__dirname + "/views/create.html"); });

app.get("/allblogs", (req, res) => {
// Read the blog links from the file
fs.readFile("blog_links.txt", "utf8", (err, data) => { if (err) { console.error(err); return res.status(500).send("Error loading the blog links"); }


const blogLinks = data.split("\n").filter((link) => link.length > 0);

// Read the blog data from the file
fs.readFile("blogs.json", "utf8", (err, data) => {
if (err) {
console.error(err);
return res.status(500).send("Error loading the blog data");
}

const blogs = JSON.parse(data);

// Render the allblogs.html file with the blog links and data
res.render("allblogs", { blogLinks, blogs });
});
});
});


app.post("/Submit-blog", upload.single('blogImage'), (req, res) => { const { blogheading, blogText } = req.body; const { filename, mimetype, buffer } = req.file;

// Generate a unique ID for the blog
const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
const imagePath = '/uploads/' + filename;
// Create a new blog object
const newBlog = { id, blogheading, blogText, blogImage: imagePath };


// Read the existing blogs from the file
fs.readFile("blogs.json", "utf8", (err, data) => {
if (err) {
console.error(err);
return res.status(500).send("Error saving the blog");
}

let blogs = JSON.parse(data);
blogs.push(newBlog);

// Write the updated blogs back to the file
fs.writeFile("blogs.json", JSON.stringify(blogs), (err) => {
if (err) {
console.error(err);
return res.status(500).send("Error saving the blog");
}

// Extract the link from the newBlog object
const newBlogLink = `/blog/${newBlog.id}`;

// Write the new blog link to a separate file
fs.appendFile("blog_links.txt", newBlogLink + "\n", (err) => {
if (err) {
console.error(err);
return res.status(500).send("Error saving the blog link");
}

res.redirect("/allblogs");
});
});
});
});

app.post("/blogs/:id", upload.single('blogImage'), (req, res) => {
  const { id } = req.params;
  const { blogheading, blogText } = req.body;

  // Read the existing blogs from the file
  fs.readFile("blogs.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error updating the blog");
    }

    let blogs = JSON.parse(data);
    const index = blogs.findIndex((b) => b.id === id);

    if (index === -1) {
      return res.status(404).send("Blog not found");
    }

    if (req.file) {
      // A file was uploaded, update the blog with the new image
      const { filename, mimetype } = req.file;
      blogs[index].blogImage = '/uploads/' + filename;
    }

    // Update the blog heading and text
    blogs[index].blogheading = blogheading;
    blogs[index].blogText = blogText;

    // Write the updated blogs back to the file
    fs.writeFile("blogs.json", JSON.stringify(blogs), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error saving the updated blog");
      }

      res.redirect("/allblogs");
    });
  });
});

app.get("/blogs/:id/edit", (req, res) => {
  const { id } = req.params;

  // Read the blogs from the file
  fs.readFile("blogs.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error loading the blog");
    }

    const blogs = JSON.parse(data);
    const blog = blogs.find((b) => b.id === id);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    res.render("edit-blog", { blog });
  });
});

app.get("/blogs/:id", (req, res) => { const { id } = req.params;


// Read the blogs from the file
fs.readFile("blogs.json", "utf8", (err, data) => {
 if (err) {
  console.error(err);
  return res.status(500).send("Error loading the blog");
 }

 const blogs = JSON.parse(data);
 const blog = blogs.find((b) => b.id === id);

 if (!blog) {
  return res.status(404).send("Blog not found");
 }

 res.render("blog", { blog });
});
});

app.listen(port, () => { console.log(`Listening on port ${port}`); });