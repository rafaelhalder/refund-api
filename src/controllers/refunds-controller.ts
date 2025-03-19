import type { Request,Response } from "express";
import {prisma} from "@/database/prisma"
import {z} from "zod"
import { AppError } from "@/utils/AppError";

const CategoriesEnum = z.enum([
"food",
"others",
"services",
"transport",
"accomodation",
])

class RefundsController{
  async create(request: Request,response:Response){
    const bodySchema = z.object({
      name: z.string().trim().min(1,{message: "Informe o nome da solicitação"}),
      category: CategoriesEnum,
      amount: z.number().positive({message: "Informe um valor positivo"}),
      filename: z.string().min(20)
    })
    
    const {name,category,amount,filename} = bodySchema.parse(request.body)

    if(!request.user?.id){
      throw new AppError("Usuário não autenticado",401)
    }

    const refund = await prisma.refunds.create({
      data:{
        name,
        category,
        amount,
        filename,
        userId: request.user.id
      }
    })

    response.status(201).json(refund)
  }

  async index(request: Request,response:Response){
    const querySchema = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    })

    const {name,page,perPage} = querySchema.parse(request.query)

    const skip = (page - 1) * perPage
    const refunds = await prisma.refunds.findMany({
      skip,
      take: perPage,
      where:{
        name:{
          contains:name.trim(),
        }
      },
      orderBy:{
        createdAt:"desc"
      },
      include:{
        user:true
      }
    })

    const totalRecords = await prisma.refunds.count({
      where:{
        name:{
          contains:name.trim(),
        }
      }
    })

    const totalPages = Math.ceil(totalRecords / perPage)
    response.json({refunds,pagination:{
      page,
      perPage,
      totalRecords,
      totalPages : totalPages > 0 ? totalPages : 1,
    }})
    
  }

  async show(request: Request,response:Response){
    const paramsSchema = z.object({
      id: z.string().uuid({message:"ID inválido"}),
    })
    const {id} = paramsSchema.parse(request.params)

    const refund = await prisma.refunds.findFirst({
      where:{
        id,
      },
      include:{
        user:true
      }
    })

    if(!refund){
      throw new AppError("Solicitação não encontrada",404)
    }

    response.json(refund)
  }
}

export {RefundsController}