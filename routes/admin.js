var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authcontroller = require('../controller/admincontroller/authcontroller');
const checkadminsession = require('../helper/helper');
const cms = require('../controller/admincontroller/cmscontroller');
const contact = require('../controller/admincontroller/contactcontroller');
const usercontroller = require('../controller/admincontroller/usercontroller');
const project = require('../controller/admincontroller/projectcontroller');
const projectTask = require('../controller/admincontroller/projecttaskcontroller');
const projectSubtask = require('../controller/admincontroller/projectsubtaskcontroller');
const describeWork = require('../controller/admincontroller/describeworkcontroller');
const record = require('../controller/admincontroller/recordcontroller');



//router for login 
router.get('/login',authcontroller.login);
router.post('/loginpost',authcontroller.loginpost);

// Use the middleware for all routes in the routeror
router.use(checkadminsession.checkAdminSession);

// router for admin
router.get('/dashboard',authcontroller.dashboard);
router.get('/password',authcontroller.password);
router.get('/profile',authcontroller.profile);
router.post('/profileupdate',authcontroller.edit_profile);
router.post('/updatepassword',authcontroller.updatepassword);
router.get('/logout', authcontroller.logout);

//router for user
router.get('/employeelist',usercontroller.user_list);
router.get('/view/:id', usercontroller.view);
router.post('/delete/:id',usercontroller.user_delete);
router.post('/status', usercontroller.user_status);
router.get('/adduser',usercontroller.userAdd);
router.post('/createuser',usercontroller.userCreate);
router.get('/useredit/:id',usercontroller.userEdit);
router.post('/userupdate/:id',usercontroller.user_update);



//router for cms
router.get('/privacypolicy', cms.privacy);
router.post('/privacypolicy', cms.privacy_update);
router.get('/aboutus', cms.aboutus);
router.post('/aboutus', cms.aboutusupdate);
router.get('/term&conditions',cms.term);
router.post('/term&conditions', cms.terms);

// router for contact Us
router.get('/contacts',contact.getcontacts);
router.post('/deletecontact/:id',contact.deletecontact);
router.get('/viewcontact/:id',contact.contactview);
 
// router for projects
router.get('/projectlist',project.projectList);
router.get('/projectdetails/:id',project.projectDetails);
router.get('/addproject',project.addProject),
router.post('/createproject',project.createProject);
// router.post('/import-excel', upload.single('excelFile'), project.importExport);
router.get('/projectedit/:id',project.projectEditPage);
router.post('/projectupdate/:id',project.projectEdit);
router.post('/projectstatus',project.projectStatus);
router.post('/deleteproject/:id',project.deleteProject);

//router for project task
router.get('/tasklist',projectTask.projectTaskList);
router.get('/taskdetails/:id',projectTask.projectTaskDetails);
router.get('/taskedit/:id',projectTask.projectTaskEditPage);
router.post('/taskupdate/:id',projectTask.projectTaskEdit);
router.get('/taskadd',projectTask.addProjectTask);
router.post('/createprojecttask',projectTask.createProjectTask);
router.post('/projecttaskstatus',projectTask.projectTaskStatus);
router.post('/deletetaskproject/:id',projectTask.projectDeleteTask);

//router for sub task
router.get('/subtasklist',projectSubtask.projectSubTaskList);
router.get('/subtaskdetails/:id',projectSubtask.projectSubTaskDetails);
// router.get('/subtaskadd',projectSubtask.projectSubTaskAdd);
router.post('/projectsubtaskstatus',projectSubtask.projectSubtTaskStatus);
router.post('/deletesubtaskproject/:id',projectSubtask.deleteProjectSubTask);

//route for describe work
router.get('/describeworklist',describeWork.describeWorkList);
router.get('/describeworkdetails/:id',describeWork.describeWorkDetails);
router.post('/describeworkstatus',describeWork.describeWorkStatus);
router.post('/deletedescribework/:id',describeWork.deletedescribeWork);

// routes for record

router.get('/recordlist',record.recordList);
router.get('/recorddetails/:projectId', record.recordDetails);

router.post('/deleterecord/:id',record.recordDelete);





module.exports = router;
