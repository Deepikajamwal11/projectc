const db = require("../../models");
const helper = require("../../helper/helper");
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const multer = require('multer');
const { log } = require("console");

db.project.associate = (models) => {
  db.project.hasMany(models.db.assignUsers, { foreignKey: "projectId" });
};

db.assignUsers.associate = (models) => {
  db.assignUsers.belongsTo(models.db.project, { foreignKey: "projectId" });
  db.assignUsers.belongsTo(models.db.users, { foreignKey: "userId" });
};



module.exports = {


  createProject: async (req, res) => {
    try {
      console.log(req.body, "-=-=-dddddddddddddddddddd");
      console.log(req.files, "-=-=-dddddddddddddddddddd");
      const { name, userIds, discription, location } = req.body; 

  
      const existingProject = await db.project.findOne({ where: { name } });
      if (existingProject) {
        req.flash("error", "Project with this name already exists.");
        return res.redirect("/addproject");
      }
      
  
      let image = "";
      if (req.files && req.files.image) {
        image = await helper.fileUpload(req.files.image);  
      }
      
      const project = await db.project.create({
        name,
        discription: discription || "",
        location: location || "",
        image,
      });
      
    
      if (userIds && userIds.length > 0) {
        const usersArray = Array.isArray(userIds) ? userIds : [userIds];
        const assignData = usersArray.map((userId) => ({
          userId,
          projectId: project.id,
          status: "1",
          discription: discription || "",
          location: location || "",
          image,
        }));
      
        await db.assignUsers.bulkCreate(assignData, {
          ignoreDuplicates: true,
        });
      }
   
      if (req.files && req.files.excelFile) {
        const uploadedFile = req.files.excelFile;
        const uploadPath = path.join(__dirname, "../../public/images", uploadedFile.name);

        await uploadedFile.mv(uploadPath);

        const results = [];

        await new Promise((resolve, reject) => {
          fs.createReadStream(uploadPath)
            .pipe(csv())
            .on("data", (row) => results.push(row))
            .on("end", resolve)
            .on("error", reject);
        });

        for (const row of results) {
          try {
            const workGroupCode = row["Work Group Code"];
            const workGroup = row["Work Group"];
            console.log(workGroupCode,"-=-=-=-=workGroupCode");
            console.log(workGroup,"-=-=-=-=workGroup");

            
             let task = await db.projectTask.create({
               projectId: project.id,
                workGroupCode:workGroupCode,
                workGroup:workGroup,
              });
            

            await db.projectSubTask.create({
              projectTaskId: task.id,
              itemCode: row["Item Code"],
              discription: row["Description"],
              unit: row["Unit"],
              quantity: row["Quantity"],
              rate: row["Rate"],
              materialCost: row["Material Cost"],
              meterialCenter: row["Material Cost Centre"],
              labourHours: row["Labour Hours"],
              labourCost: row["Labour Cost"],
              labourCostCenter: row["Labour Cost Centre"],
              total: row["Total"],
              notes: row["Notes"],
            });

            console.log(`Imported: ${row["Item Code"]}`);
          } catch (innerErr) {
            console.error("Row error:", row, innerErr);
          }
        }

        fs.unlinkSync(uploadPath);
      }

      req.flash("success", "Project added successfully");
      res.redirect("/projectlist");
    } catch (error) {
      console.error("Project creation error:", error);
      res.status(500).send("Server Error");
    }
  },

  projectList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.project.findAndCountAll({
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      res.render("project/projectlist.ejs", {
        title: "Projects",
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
  projectEditPage: async (req, res) => {
    try {
      const project = await db.project.findOne({
        where: { id: req.params.id },
        raw: true,
      });

      const allUsers = await db.users.findAll({
        where: { status: "1" },
        raw: true,
      });

      const assignedUsers = await db.assignUsers.findAll({
        where: { projectId: req.params.id },
        attributes: ["userId"],
        raw: true,
      });

      const assignedUserIds = assignedUsers.map((u) => u.userId);

      res.render("project/projectedit.ejs", {
        session: req.session.admin,
        title: "Edit Project",
        project,
        allUsers,
        assignedUserIds,
      });
    } catch (error) {
      throw error;
    }
  },

  projectEdit: async (req, res) => {
    try {
      const { name, userIds, location, discription } = req.body;
      let image;
      const existingProject = await db.project.findOne({
        where: {
          name,
          id: { [db.Sequelize.Op.ne]: req.params.id },
        },
      });
  
      if (existingProject) {
        req.flash("error", "Another project with this name already exists.");
        return res.redirect(`/projectedit/${req.params.id}`);
      }
  
  
      if (req.files && req.files.image) {
        image = await helper.fileUpload(req.files.image);
      }
  
      const updateData = { name };
  
      if (image) updateData.image = image;
      if (location) updateData.location = location;
      if (discription) updateData.discription = discription;
      await db.project.update(updateData, {
        where: { id: req.params.id },
      });

      await db.assignUsers.destroy({
        where: { projectId: req.params.id },
      });

      const usersArray = Array.isArray(userIds) ? userIds : [userIds];
      const assignData = usersArray.map((userId) => ({
        userId,
        projectId: req.params.id,
        status: "1",
        location,      
        discription,   
        image,         
      }));

      if (assignData.length > 0) {
        await db.assignUsers.bulkCreate(assignData);
      }
  
      req.flash("success", "Project updated successfully");
      return res.redirect("/projectlist");
    } catch (error) {
    throw error;
    }
  },
  

  projectDetails: async (req, res) => {
    try {
      const projectId = req.params.id;
      const data = await db.project.findOne({
        where: { id: projectId },
        raw: true,
      });

      const assignedUsers = await db.assignUsers.findAll({
        where: { projectId: projectId, status: "1" },
        attributes: ["userId"],
        raw: true,
      });

      const userIds = assignedUsers.map((entry) => entry.userId);

      let users = [];
      if (userIds.length > 0) {
        users = await db.users.findAll({
          where: { id: userIds },
          attributes: ["id", "name", "email"],
          raw: true,
        });
      }

      res.render("project/projectview.ejs", {
        session: req.session.admin,
        data,
        users,
        title: "Project Details",
      });
    } catch (error) {
      throw error;
    }
  },

  projectStatus: async (req, res) => {
    try {
      const result = await db.project.update(
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
  deleteProject: async (req, res) => {
    try {
      const userId = req.params.id;
      const project = await db.project.findByPk(userId);
      await db.project.destroy({ where: { id: userId } });
      res.json({ success: true, message: "project deleted successfully" });
    } catch (error) {
      throw error;
    }
  },
  addProject: async (req, res) => {
    try {
      const users = await db.users.findAll({
        where: { status: "1" },
        raw: true,
      });

      res.render("project/projectadd.ejs", {
        session: req.session.admin,
        title: "Add Project",
        users,
      });
    } catch (error) {
      throw error;
    }
  },
};
