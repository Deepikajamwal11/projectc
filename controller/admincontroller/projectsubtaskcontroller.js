const db = require("../../models");

db.projectSubTask.belongsTo(db.projectTask, {
  as: "task",
  foreignKey: "projectTaskId",
});

db.projectTask.belongsTo(db.project, {
  as: "projects",
  foreignKey: "projectId",
});

module.exports = {
  projectSubTaskList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.projectSubTask.findAndCountAll({
        include: [
          {
            model: db.projectTask,
            as: "task",
            include: [
              {
                model: db.project,
                as: "projects",
              },
            ],
          },
        ],
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      res.render("projectSubtask/projectSubTaskList.ejs", {
        title: "Project Sub Tasks",
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
  // projectSubTaskAdd: async (req, res) => {
  //   try {
  //     const projects = await db.project.findAll({ where: { status: '1' }, raw: true });
  //     const projectTasks = await db.projectTask.findAll({ where: { status: '1' }, raw: true });

  //     res.render("projectSubtask/projectsubTaskAdd.ejs", {
  //       session: req.session.admin,
  //       title: "Add Sub Task",
  //       projects,
  //       projectTasks
  //     });
  //   } catch (error) {
  //    throw error
  //   }
  // }

  projectSubTaskDetails: async (req, res) => {
    try {
      const data = await db.projectSubTask.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: db.projectTask,
            as: "task",
            include: [
              {
                model: db.project,
                as: "projects",
              },
            ],
          },
        ],
      });

      res.render("projectSubtask/projectSubTaskView.ejs", {
        session: req.session.admin,
        data,
        title: "Project Sub Task Details",
      });
    } catch (error) {
      throw error;
    }
  },
   projectSubtTaskStatus: async (req, res) => {
      try {
        const result = await db.projectSubTask.update(
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
    deleteProjectSubTask: async (req, res) => {
      try {
        const userId = req.params.id;
        const project = await db.projectSubTask.findByPk(userId);
        await db.projectSubTask.destroy({ where: { id: userId } });
        res.json({ success: true, message: "project deleted successfully" });
      } catch (error) {
        throw error;
      }
    },
};
