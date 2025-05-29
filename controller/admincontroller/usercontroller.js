const db = require("../../models");
const helper = require("../../helper/helper");
const bcrypt = require("bcrypt");


module.exports={
user_list: async (req, res) => {
        try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const offset = (page - 1) * limit;
          
          const { count, rows } = await db.users.findAndCountAll({
            where: {
              role: "1",
              deletedAt: null,
            },
    
            limit,
            offset,
            order: [["id", "DESC"]],
          });
    
          const totalPages = Math.ceil(count / limit);
    
          res.render("user/userlist.ejs", {
            title: "Employees",
            data: rows,
            session: req.session.admin,
            currentPage: page,
            totalPages,
            limit,
            offset
          });
        } catch (error) {
          throw error;
        }
},
view: async (req, res) => {
        try {
          const view = await db.users.findOne({
            where: { id: req.params.id },
    
          });
    
          res.render("user/userview.ejs", {
            session: req.session.admin,
            view,
            title: 'Employee Details',
          });
        } catch (error) {
          throw error
        }
},
user_delete: async (req, res) => {
        try {
          const userId = req.params.id;
          const user = await db.users.findByPk(userId);
          await db.users.destroy({ where: { id: userId } });
          res.json({ success: true, message: "User deleted successfully" });
        } catch (error) {
          throw error;
        }
},
user_status: async (req, res) => {
        try {
          const result = await db.users.update(
            { status: req.body.status },
            { where: { id: req.body.id } }
          );
          if (result[0] === 1) {
            res.json({ success: true });
          } else {
            res.json({ success: false, message: "Status change failed" });
          }
        } catch (error) {
          throw error;
        }
},
userAdd: async (req, res) => {
  try {

    res.render("user/useradd.ejs", {
      session: req.session.admin,
      title: "Add Employee",
    });
  } catch (error) {
    console.error("Error in userAdd:", error);
    res.status(500).send("Internal Server Error");
  }
},
userCreate: async (req,res) => {
      try {
        if (req.files && req.files.image) {
          let images = await helper.fileUpload(req.files.image);
          req.body.image = images;
      }
        await db.users.create({
        ...req.body,
       image: req.body.image,
        });
     
  
        req.flash("success", "User added successfully");
        res.redirect("/employeelist");
      } catch (error) {
        throw error;
      }
    },
userEdit:async (req, res) => {
      try {
     
        const data = await db.users.findOne({
          where: { id: req.params.id },
        });
       
        res.render("user/useredit.ejs", {
          session: req.session.admin,
          title: "Edit Employee",
          data,
        });
      } catch (error) {
        req.flash('error', 'Something went wrong');
        res.redirect('/employeelist');
      }
},
user_update: async (req, res) => {
      try {
        const { id } = req.params;
    
    
        const user = await db.users.findOne({ where: { id } });
        if (!user) {
          req.flash('error', 'User not found');
          return res.redirect('/employeelist');
        }
  
        if (req.files && req.files.image) {
          const uploadedImage = await helper.fileUpload(req.files.image);
          req.body.image = uploadedImage;
        } else {
          req.body.image = req.body.old_image; 
        }
    
        await db.users.update(
          {
            ...req.body,
            image: req.body.image, 
          },
          {
            where: { id }
          }
        );
        
    
        req.flash('success', 'User updated successfully');
        res.redirect('/employeelist');
      } catch (error) {
        req.flash('error', 'Something went wrong');
        res.redirect('/employeelist');
      }
}
    
 
}
