    import express from 'express';
    import {register, login, protect, logout, fetchUser,fetchAllUsers, updatePass, editAccount, deleteUser} from '../controllers/authController.js';

    const router = express.Router()

    router.route("/register").post(register);
    router.route("/login").post(login);
    router.route("/logout").post(protect, logout);
    router.route("/users").get(protect, fetchAllUsers);
    router.route("/fetch").get(protect, fetchUser);
    router.route("/:id").get(protect, fetchUser).put(protect, updatePass).delete(protect, deleteUser);
    router.put("/account/:id", protect, editAccount);


    export default router;