
const db = require('../../models');
const helper = require("../../helper/helper");

db.projectTask.belongsTo(db.project, {
  foreignKey: "projectId",
  as: "project",
});

module.exports = {
  projectTaskList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.projectTask.findAndCountAll({
        include: [{ model: db.project, as: "project" }],
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      res.render("projectTask/projectTaskList.ejs", {
        title: "Project Tasks",
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
  projectTaskDetails: async (req, res) => {
    try {
      const data = await db.projectTask.findOne({
        where: { id: req.params.id },
        include: [{ model: db.project, as: "project" }],
      });

      res.render("projectTask/projectTaskView.ejs", {
        session: req.session.admin,
        data,
        title: "Project Task Details",
      });
    } catch (error) {
      throw error;
    }
  },
  projectTaskEditPage: async (req, res) => {
    try {
      const data = await db.projectTask.findOne({
        where: { id: req.params.id },
        include: [{ model: db.project, as: "project" }],

      });
      const project = await db.project.findAll({ where: { status: '1' }, raw: true });
      res.render("projectTask/projectTaskEdit.ejs", {
        session: req.session.admin,
        title: "projectTaskEdit",
        data,
        project,
      });
    } catch (error) {
      throw error;
    }
  },
  projectTaskEdit: async (req, res) => {
    try {
      // let folder = "admin";
      const updatedata = {
        projectId: req.body.projectId,
        workGroup: req.body.workGroup,
        workGroupCode: req.body.workGroupCode,
      };

      // if (req.files && req.files.image) {
      //   let image = await helper.fileUpload(req.files.image, folder);
      //   updatedata.image = image;
      // }

      await db.projectTask.update(updatedata, {
        where: { id: req.params.id },
      });

      req.flash("success", "Project task updated successfully");
      res.redirect("/tasklist");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  addProjectTask: async (req, res) => {
    try {
      const data = await db.project.findAll({ where: { status: '1' }, raw: true });
      res.render("projectTask/projectTaskAdd.ejs", {
        session: req.session.admin,
        title: "Add Project Task",
        data
      });
    } catch (error) {
      throw error;
    }
  },
  createProjectTask: async (req, res) => {
    try {

      await db.projectTask.create({
        projectId: req.body.projectId,
        workGroup: req.body.workGroup,
        workGroupCode: req.body.workGroupCode,

      });

      req.flash("success", "Project task added successfully");
      res.redirect("/tasklist");
    } catch (error) {
      throw error;
    }
  },
  projectTaskStatus: async (req, res) => {
    try {
      const result = await db.projectTask.update(
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
  projectDeleteTask: async (req, res) => {
    try {
      const userId = req.params.id;
      const project = await db.projectTask.findByPk(userId);
      await db.projectTask.destroy({ where: { id: userId } });
      res.json({ success: true, message: "project deleted successfully" });
    } catch (error) {
      throw error;
    }
  },

}