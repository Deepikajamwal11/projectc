const db = require("../../models");

db.record.belongsTo(db.projectSubTask, {
  as: "subtask",
  foreignKey: "projectSubTaskId",
});

db.projectSubTask.belongsTo(db.projectTask, {
  as: "projecttasksss",
  foreignKey: "projectTaskId",
});

db.projectSubTask.belongsTo(db.project, {
  as: "projects",
  foreignKey: "projectId",
});
db.projectTask.hasMany(db.projectSubTask, {
  as: "projectsubtasks",
  foreignKey: "projectTaskId",
});
db.project.hasMany(db.projectSubTask, {
  as: "projectsubtasks",
  foreignKey: "projectId",
});

module.exports = {
  recordList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await db.record.findAndCountAll({
        limit,
        offset,
        order: [["id", "DESC"]],
        include: [
          {
            model: db.projectSubTask,
            as: "subtask",
            include: [

              {
                model: db.project,
                as: "projects",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });
      console.log(rows, "-=-dddddddddddd@@@@@@@@@@@@@@@");
      const totalPages = Math.ceil(count / limit);

      res.render("record/recordlist.ejs", {
        title: "Records",
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

  recordDetails: async (req, res) => {
    try {
      const projectId = req.params.projectId;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await db.record.findAndCountAll({
        limit,
        offset,
        order: [["id", "DESC"]],
        include: [
          {
            model: db.projectSubTask,
            as: "subtask",
            include: [
              {
                model: db.projectTask,
                as: "projecttasksss",
              },
              {
                model: db.project,
                as: "projects",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
        where: {
          "$subtask.projectId$": projectId,
        },
      });

      const totalPages = Math.ceil(count / limit);

      res.render("record/recordview.ejs", {
        title: "Records",
        records: rows,
        projectId,
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

  recordDelete: async (req, res) => {
    try {
      const userId = req.params.id;
      const record = await db.record.findByPk(userId);
      await db.record.destroy({ where: { id: userId } });
      res.json({ success: true, message: "record deleted successfully" });
    } catch (error) {
      throw error;
    }
  },
};
