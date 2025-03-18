/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Endpoint to create a new user in the system
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The newly created user ID
 *                 name:
 *                   type: string
 *                   description: User's full name
 *                 email:
 *                   type: string
 *                   description: User's email address
 *       400:
 *         description: Invalid request payload
 *       409:
 *         description: User with provided email already exists
 *       500:
 *         description: Internal server error
 */
import { Router } from "express";
import { UsersController } from "@/controllers/users-controller";

const usersRoutes = Router();
const usersController = new UsersController();
usersRoutes.post("/", usersController.create);

export {usersRoutes}