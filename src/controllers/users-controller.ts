import { UserRole } from '@prisma/client';
import type { Request, Response } from 'express';
import {z} from "zod"
import {prisma} from "@/database/prisma"
import { AppError } from '@/utils/AppError';
import { hash } from 'bcrypt';

class UsersController {
  async create(request: Request, response: Response){
    const bodySchema = z.object({
      name: z.string().trim().min(2, {message: "Nome é obrigatório"}),
      email: z.string().trim().email({message: "Email inválido"}),
      password: z.string().trim().min(6, {message: "Senha deve ter no mínimo 6 caracteres"})
      ,role: z.enum([UserRole.employee,UserRole.manager]).default(UserRole.employee)
    })
    const {name, email, password, role} = bodySchema.parse(request.body)
    const userWIthSameEmail = await prisma.user.findFirst({
      where:{
        email
      }
    })
    
    if(userWIthSameEmail){
      throw new AppError("Email já cadastrado", 409)
    }
    
    const hashedPassword = await hash(password,8)
    await prisma.user.create({
      data:{
        name,email,password:hashedPassword,role
      }
    })


      response.status(201).json()
  }
}

export {UsersController}