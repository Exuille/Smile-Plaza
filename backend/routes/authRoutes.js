import express from 'express';
import {register, login, protect, logout, fetchUser,fetchAllUsers, updatePass} from '../controllers/authController.js';

const router = express.Router()

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(protect, logout);
router.route("/fethAll").get(protect, fetchAllUsers);
router.route("/:id").get(protect, fetchUser).put(protect, updatePass);
router.route("/users").get(protect, fetchAllUsers);


export default router;