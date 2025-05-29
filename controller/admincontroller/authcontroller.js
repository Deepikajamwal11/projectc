const db = require("../../models");
const helper = require("../../helper/helper");
const bcrypt = require("bcrypt");

module.exports = {
  dashboard: async (req, res) => {
    try {
      const users = await db.users.count({ where: { role: "1" } });
      const project = await db.project.count({});
      const projectTask = await db.projectTask.count({});
      const projectSubTask = await db.projectSubTask.count({});
      const describeWork = await db.describeWork.count({});
      const contact = await db.contacts.count({});
      const record = await db.record.count({});


      const usersByMonth = await db.users.findAll({
        where: { role: ["1"] },
        attributes: [
          [db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt")), "month"],
          [db.Sequelize.fn("COUNT", db.Sequelize.col("id")), "count"],
        ],
        group: ["month"],
        order: [
          [db.Sequelize.fn("MONTH", db.Sequelize.col("createdAt")), "ASC"],
        ],
        raw: true,
      });
      const chartData = Array(12).fill(0);
      usersByMonth.forEach((item) => {
        chartData[item.month - 1] = parseInt(item.count, 10);
      });
      res.render("dashboard", {
        session: req.session.admin,
        title: "Dashboard",
        chartData,
        users,
        project,
        contact,
        projectTask,
        projectSubTask,
        describeWork,
        record,
      });
    } catch (error) {
      throw error;
    }
  },
  login: async (req, res) => {
    try {
      res.render("login");
    } catch (error) {
      req.flash("error", "Something went wrong, please try again");
      return res.redirect("/login");
    }
  },
  loginpost: async (req, res) => {
    try {
      const { email, password } = req.body;
      const find_user = await db.users.findOne({ where: { email, role: "0" } });
      if (!find_user) {
        req.flash("error", "Invalid Email");
        return res.redirect("/login");
      }
      const is_password = await bcrypt.compare(password, find_user.password);
      if (!is_password) {
        req.flash("error", "Invalid Password");
        return res.redirect("/login");
      }
      req.session.admin = find_user;
      req.flash("success", "You are logged in successfully");
      return res.redirect("/dashboard");
    } catch (error) {
      req.flash("error", "Something went wrong, please try again");
      return res.redirect("/login");
    }
  },
  profile: async (req, res) => {
    try {
      const profile = await db.users.findOne({
        where: { email: req.session.admin.email },
      });
      res.render("admin/profile.ejs", {
        session: req.session.admin,
        profile,
        title: "Profile",
      });
    } catch (error) {
      throw error;
    }
  },
  edit_profile: async (req, res) => {
    try {
      let updatedata = { ...req.body };
      let folder = "admin";
      if (req.files && req.files.image) {
        let images = await helper.fileUpload(req.files.image, folder);
        updatedata.image = images;
      }
      const profile = await db.users.update(updatedata, {
        where: {
          id: req.session.admin.id,
        },
      });
      const find_data = await db.users.findOne({
        where: {
          id: req.session.admin.id,
        },
      });
      req.session.admin = find_data;
      req.flash("success", " Update Profile succesfully ");
      res.redirect("/profile");
    } catch (error) {
      throw error;
    }
  },
  password: async (req, res) => {
    try {
      res.render("admin/password", {
        session: req.session.admin,
        title: "Change Password",
      });
    } catch (error) {
      throw error;
    }
  },
  updatepassword: async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    try {
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (newPassword !== confirmPassword) {
        req.flash("error", "New password and confirm password do not match");
        return res.status(400).json({ message: "New password and confirm password do not match" });
      }
      const user = await db.users.findOne({
        where: { id: req.session.admin.id },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        req.flash("error", "Old password is incorrect");
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        req.flash("error", "New password cannot be the same as the old password");
        return res.status(400).json({ message: "New password cannot be the same as the old password" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      req.session.admin.password = hashedPassword;
      req.flash("success", "Password updated successfully");
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  logout: async (req, res) => {
    try {
      req.flash('success', 'Logged out successfully');
      delete req.session.admin;
      res.redirect("/login");
    } catch (error) {
      throw error;
    }
  },
};
