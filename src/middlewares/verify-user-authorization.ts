import type { Request,Response,NextFunction } from "express";
import { AppError } from "@/utils/AppError";

function verifyUserAuthorization(role: string[]){
  return(request:Request,response:Response,next:NextFunction) => {
    //verifica se esta logado OU inclui nas regras
    if(!request.user || !role.includes(request.user.role)){
      throw new AppError("Sem autorização",403)
    }
    return next()
  }
}

export { verifyUserAuthorization }