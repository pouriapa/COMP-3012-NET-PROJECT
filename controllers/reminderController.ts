import {PrismaClient} from ".prisma/client";
const prismaCon = new PrismaClient();


const getReminders = async (req:any, res:any) => {
  try{
        const{email} = req.user
        const userWithReminders = await prismaCon.user.findUnique({where: {email},
                                    include: {
                                        reminders: true
                                    },
                                });
        if(userWithReminders){
          const reminders = userWithReminders.reminders;
          res.render("reminder/index", {reminders});   
        }else{
          throw new Error();
        }
    }catch(err){
      res.status(500).send(new Error('something went wrong'));
    }   
  }


const addReminder = async(req:any, res:any) => {    
  try{
    const {title, description} = req.body;
    const userId:string = req.user.id;
    if(title == '' || description == ''){
      res.redirect('/reminders/add'); 
    }else{
      const addedReminder = await prismaCon.reminder.create({data: {title, description, authorId:userId}});
      res.redirect('/reminders');
    } 
  }catch(err){
     res.status(500).send(new Error('something went wrong'));
  }    
}


const getReminderById = async(req:any, res:any) => {
  try{
    const id:string = req.params.id;
    const reminder = await prismaCon.reminder.findUnique({where: {id}});    
      if(reminder){
          res.render("reminder/single-reminder", {reminderItem: reminder});
      }else{
          res.redirect("/reminders");
      }
  }catch(err){
    res.status(500).send(new Error('something went wrong'));
  }
}


const editReminderById = async (req:any, res:any) => {
  try{
    const id:string = req.params.id;
    const reminder = await prismaCon.reminder.findUnique({where: {id}});      
    res.render("reminder/edit", {reminderItem: reminder});
  }catch(err){
    res.status(500).send(new Error('something went wrong'));
  }
}


const updateReminderById = async (req:any, res:any) => {
  try{
    const id:string = req.params.id;
    const reminder = req.body; // how to set type of a variable to prisma model type
    if(reminder.isDone === 'true'){
      reminder.isDone = true; 
    }else{
      reminder.isDone = false;
    }
    const updatedReminder = await prismaCon.reminder.update({where: {id}, data:reminder});  
    res.redirect("/reminders");
  }catch{
    res.status(500).send(new Error('something went wrong'));
  }
}


const deleteReminder = async (req:any, res:any) => {
  
  try{
    const id:string = req.params.id;
    const deletedReminder = await prismaCon.reminder.delete({where: {id}});  
    res.redirect("/reminders");
  }catch(err){
    res.status(500).send(new Error('something went wrong'));
  }  
}


  export default {
    getReminders,
    addReminder,
    getReminderById,
    updateReminderById,
    deleteReminder,
    editReminderById,
  }