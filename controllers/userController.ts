import fetch from "node-fetch";
import { PrismaClient } from ".prisma/client";
import bcrypt from "bcryptjs";
const prismaCon = new PrismaClient();


const getUser = async (email:string, password:string) => {
    try{
        const existingUser = await prismaCon.user.findUnique({where: {email}});
        if(existingUser){
            const isMatch = await bcrypt.compare(password, existingUser.password)
            if(isMatch){
                return existingUser
            }
        }
        return null
    }catch(error){
        throw new Error('something went wrong with DB')    
    }
};


const getUserById = async (id:string) => {    
    try{
        const user = await prismaCon.user.findUnique({where: {id}})
        if(user){
            return user
        }
        return null

    }catch(error){
        throw new Error('something went wrong with db');
    }

};

const emailExists = async (email: string) => {
    const existingEmail = await prismaCon.user.findUnique({where: {email}});
    if(existingEmail){
        return true
    }
        return false
};

const findOrCreate = async (profile:any) => {
    const {id, profileUrl, username} = profile;
    const existingUser = await getUserById(id)
    if(existingUser){
        return existingUser;
    }else{
        const createdUser = await prismaCon.user.create({data: {email:profileUrl, password:username, id}});
        return createdUser;
    }
};


const fetchImage = async () => {
    const result = await fetch(`https://api.unsplash.com/photos/random?&client_id=${process.env.API_KEY}`, {method:"get"});
    const data = await result.json();
    const imageUrl = data.urls.thumb;
    return imageUrl;    
}


//------------- UserRoute Handler Functions ---------------------

const registerUser = async (req:any, res:any) => {
    const {email, password} = req.body; 
    if(email === '' || password ===''){res.redirect("/register")}else{ 
    const existingEmail = await emailExists(email);
    if(existingEmail){
      res.send("user already exists") // how to show message here before redirecting to register page
    }else{
        const hashedPassword = await bcrypt.hash(password, 8);
        const imageUrl:string = await fetchImage();
        const createdUser = await prismaCon.user.create({data: { email, password:hashedPassword, imageUrl}});
      req.logIn(createdUser, (error:any) => {
        if(!error){
          res.redirect("/dashboard");
        }
      })
    }
  }
  }

  const dashboard = (req:any, res:any) => { 
    const user = req.user;
    if(user.isAdmin){
      res.render("admin/dashboard", {
        user: req.user,
      })
    }else{
      res.render("user/dashboard", {
      user: req.user,
      });
    }
  };

const register = (req:any, res:any) => {
    const email = req.query.email
    res.render("auth/register", {email});

} 




export default{   
    registerUser,
    getUser,
    getUserById,   
    findOrCreate,
    dashboard,
    register,    
}