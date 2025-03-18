import type { Request,Response } from "express";

class RefundsController{
  async create(request: Request,response:Response){
    const {amount,description} = request.body
    response.json({})
  }
}

export {RefundsController}