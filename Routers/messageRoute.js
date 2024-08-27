import express from 'express';
import messageController from '../Controllers/messageController.js';
import validateToken from '../middleware/validateTokenHandler.js';
import upload from '../middleware/multer-config.js';

export const router = express.Router();

router.post("/getLastMessage", validateToken, messageController.getLastMessage);


router.post("/addMessage", validateToken, upload.single("file"), messageController.addMessage);



router.post("/messages", validateToken, messageController.getAllMessage);