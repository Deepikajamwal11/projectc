const db = require('../../models');
module.exports = {
getcontacts: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; 
            const limit = parseInt(req.query.limit) || 10; 
            const offset = (page - 1) * limit;
            const { count, rows } = await db.contacts.findAndCountAll({
                limit,
                offset,
                order: [['id', 'DESC']],
            });
    
            const totalPages = Math.ceil(count / limit);

            res.render("contacts/contactlist.ejs", {
                title: "Contact Us",
                data: rows, 
                session: req.session.admin,
                currentPage: page,
                totalPages,
                limit,
                offset
            });
        } catch (error) {
            throw error
        }
},
deletecontact: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "contact ID is required" });
            }
            const contact = await db.contacts.findByPk(req.params.id);
            await db.contacts.destroy({ where: { id: req.params.id } });
            return res.json({ success: true, message: "contact deleted successfully" });
        } catch (error) {
            throw error
        }
},
contactview: async (req, res) => {
        try {
            const data = await db.contacts.findOne({
                where: { id: req.params.id }
            });
            res.render("contacts/contactview", {
                title: "Contact Details",
                data,
                session: req.session.admin,
            });
        } catch (error) {
            throw error
        }
},
}