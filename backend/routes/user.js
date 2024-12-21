const express=require('express');
const router=express.Router();

const {signup, login, getUserDetails}=require('../controllers/user');

router.post("/", signup);
router.post("/login", login);
router.get("/:username", getUserDetails);

module.exports=router;