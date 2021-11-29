import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session"
import path from "path"
import dotenv from "dotenv"
dotenv.config();
const port = process.env.port || 8000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')));
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        cookie:{
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
)

// to be imported

import passport from "./middleware/passport";
import authRout from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";
import reminderRoute from "./routes/reminderRoute";
import adminRoute from "./routes/adminRoute"

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());


app.use("/", indexRoute);
app.use("/auth", authRout);
app.use("/reminders", reminderRoute);
app.use("/admin", adminRoute );



app.listen(port, () => {
    console.log(`server is up and running on port ${port}`)
})




