import { PrismaClient } from ".prisma/client";
const prismaCon = new PrismaClient();



const viewUsers = async (req:any, res:any) => {
    const users = await prismaCon.user.findMany({where: {}});
    
    res.render('admin/viewUsers', {users})

}

const activateUser = async (req:any, res:any) => {
    const id:string = req.params.id
    const updatedUser = await prismaCon.user.update({where: {id}, data:{suspended:false}});
    res.redirect('/admin/users');
}


const deactivateUser = async (req:any, res:any) => {
    const id:string = req.params.id
    const updatedUser = await prismaCon.user.update({where: {id}, data:{suspended:true}});
    res.redirect('/admin/users');
}


const editUser = async (req:any, res:any) => {

    const id:string = req.params.id;
    const user = await prismaCon.user.findUnique({where: {id}});
    res.render('admin/useredit', {user})

}

const updateUserById = async (req:any, res:any) => {

    const id:string = req.params.id;
    const user = req.body;
    if(user.isAdmin === 'true'){
        user.isAdmin = true
    }else{
        user.isAdmin = false
    }
    if(user.suspended === 'true'){
        user.suspended = true
    }else{
        user.suspended = false;
    }

    const updatedUser = await prismaCon.user.update({where: {id}, data: user });
    res.redirect('/admin/users');

}


export default {
    viewUsers,
    activateUser,
    deactivateUser,
    editUser,
    updateUserById,

}