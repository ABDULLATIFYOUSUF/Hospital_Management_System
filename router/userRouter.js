import express from "express";
import { patientRegister, login } from "../controller/userController.js";
 
const router = express.Router()

router.post("/patient/register", patientRegister);
router.post("/login", login);


export default router