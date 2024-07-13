import express, { Application, Request, Response, urlencoded } from "express";
import morgan from "morgan";
import dotenv from 'dotenv';
import { StatusCodes } from "http-status-codes";
import morganHttp from "./middleware/morganMiddleware";
import dairyRoute from "./routes/dairy//dairy"
import notFound from "./errors/ApiError404"
import globalErrorHandler from "./middleware/globalErrorHandler"
import cors from "cors";
import corsOptions from "./config/corsOptions"


dotenv.config();
const app: Application = express();
app.use(express.json())
app.use(morganHttp)
app.use(morgan('combined'))

app.use(urlencoded({ extended: false }));
app.use(express.json())
// healthCheck
app.get('/health', (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json("Application health is good");
})
app.use('/v1/dairy', dairyRoute)
app.use(cors(corsOptions));

app.use('*', () => {
    throw new notFound("No such route found");
});

app.use(globalErrorHandler)

export default app;