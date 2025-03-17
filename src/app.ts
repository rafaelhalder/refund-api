import express from 'express';
import cors from "cors"
import { errorHandling } from './middlewares/error-handling';
import { routes } from './routes';
import  SwaggerUiOptions  from 'swagger-ui-express';
import swaggerSpec from './swagger';
const app = express();
app.use(cors())
app.use(express.json());
app.use(routes)
app.use("/api-docs", SwaggerUiOptions.serve, SwaggerUiOptions.setup(swaggerSpec))
app.use(errorHandling)
export {app}