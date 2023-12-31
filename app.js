const express = require("express") //requiring express package
const { blogs } = require("./model/index")
const { CreateBlog, renderCreateBlog, allBlogs, singleBlog, deleteBlog, renderEditBlog, EditBlog } = require("./controller/blog/blogController")
const app = express()       //storing it in app, app vanne variable throughout use garinxa
require('dotenv').config()
const cookieparser = require("cookie-parser")

//require express-session connect-flash
const session = require("express-session")
const flash = require("connect-flash")


//ROUTES
const blogRoute = require("./routes/blogRoute")
const authRoute = require("./routes/authRoute")

 
//database connection
require("./model/index")

// node js lai session use gar vaneko
app.use(session({
    secret : "helloworld",
    resave : false,
    saveUninitialized : false
}))
app.use(flash())


// ejs use garna lako , kk chainey ho env set gardey
app.set("view engine","ejs")

//nodejs lai file access garna de vaneko 
app.use(express.static("public/"))
app.use(express.static("uploads/"))

app.use(cookieparser())
//form bata data aairaxa parse or handle gar vaneko
app.use(express.json())    //remember these 2 line
app.use(express.urlencoded({extended:true}))

//mathi ko cookie parser vanda tala hunu parxa
app.use((req,res,next)=>{
    res.locals.currentUser = req.cookies.token
    next()
})


app.use("",blogRoute)   //localhost:3000 /createBlog
app.use("",authRoute)    //localhost:3000 /register




//port number (0-1100 for internal and 1100-6555 for services)
app.listen(3000,()=>{
    console.log("NodeJs Project has started on port 3000")
})
