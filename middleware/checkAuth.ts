import userController from "../controllers/userController";

const ensureAuthenticated = (req:any, res:any, next:any) => {
     if (req.isAuthenticated() && !req.user.suspended) {
       return next();
     }
     res.redirect("/auth/login");
   };

const forwardAuthenticated = (req:any, res:any, next:any) => {
     if (!req.isAuthenticated() || req.user.suspended) {
       return next();
     }
     res.redirect("/dashboard");
   }

const isAdmin = async (req:any, res:any, next:any)=>{

  const id = req.user.id;
  const user = await userController.getUserById(id);
  if(user){
    if(user.isAdmin){
      return next();
    }
  }
  res.redirect("/dashboard");
}
 

export {
  ensureAuthenticated,
  forwardAuthenticated,
  isAdmin,
}