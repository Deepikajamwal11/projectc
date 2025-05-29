const db = require("../../models");
const helper = require('../../helper/helper');
const path = require('path');
const fs = require('fs');

db.describeWork.hasMany(db.describeWorkImages, {
  as: "imagess",
  foreignKey: "describeWorkId",
});

db.describeWork.belongsTo(db.assignUsers, {
  as: "assignUsers",
  foreignKey: "assignUserId",
});

db.assignUsers.belongsTo(db.users, {
  as: "usersss",
  foreignKey: "userId",
});

db.assignUsers.belongsTo(db.project, {
  as: "projectsss",
  foreignKey: "projectId",
});
db.describeWork.belongsTo(db.projectTask, {
  as: "projectTaskss",
  foreignKey: "projectTaskId",
});

module.exports = {
describeWorkList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      const { count, rows } = await db.describeWork.findAndCountAll({
        include: [
          {
            model: db.describeWorkImages,
            as: "imagess",
          },
          {
            model: db.assignUsers,
            as: "assignUsers",
            include: [
              {
                model: db.users,
                as: "usersss",
              },
              {
                model: db.project,
                as: "projectsss",
              }
            ]
          },
          {
            model: db.projectTask,
            as: "projectTaskss",
          }
        ],
        limit,
        offset,
        order: [["id", "DESC"]],
      });
  
      const totalPages = Math.ceil(count / limit);
  
      res.render("describeWork/describeWorkList.ejs", {
        title: "Describe Works",
        data: rows,
        session: req.session.admin,
        currentPage: page,
        totalPages,
        limit,
        offset
      });
    } catch (error) {
      console.error("Error fetching describeWork list:", error);
      res.status(500).send("Internal Server Error");
    }
},
describeWorkDetails: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).send("Invalid ID");
  
      const data = await db.describeWork.findOne({
        where: { id },
        include: [
          {
            model: db.describeWorkImages,
            as: "imagess",
          },
          {
            model: db.assignUsers,
            as: "assignUsers",
            include: [
              {
                model: db.users,
                as: "usersss",
              },
              {
                model: db.project,
                as: "projectsss",
              },
            ],
          },
          {
            model: db.projectTask,
            as: "projectTaskss",
          }
        ],
      });
  
      if (!data) return res.status(404).send("Describe work not found");
  
      res.render("describeWork/describeWorkView.ejs", {
        session: req.session.admin,
        data,
        title: "Describe Work Details",
      });
    } catch (error) {
      console.error("Error fetching describeWork details:", error);
      res.status(500).send("Internal Server Error");
    }
},
describeWorkStatus: async (req, res) => {
      try {
        const result = await db.describeWork.update(
          { status: req.body.status },
          { where: { id: req.body.id } }
        );
    
          res.json({ success: true });
  
      } catch (error) {
        throw error;
      }
},
deletedescribeWork: async (req, res) => {
    try {
      const userId = req.params.id;
      const project = await db.describeWork.findByPk(userId);
      await db.describeWork.destroy({ where: { id: userId } });
      res.json({ success: true, message: "project deleted successfully" });
    } catch (error) {
      throw error;
    }
},
};
