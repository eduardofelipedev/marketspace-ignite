import 'express-async-errors';

import swaggerUi from 'swagger-ui-express'
import swaggerFile from './docs/swagger.json'
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import cors from 'cors';

import { routes } from './routes';
import { AppError } from './utils/AppError';
import { UPLOADS_FOLDER } from './configs/upload';

import axios from 'axios';
import https from 'https';


const app = express();

app.use(express.json());
app.use(cors());

app.use("/images", express.static(UPLOADS_FOLDER));

app.use(routes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use((err: ErrorRequestHandler, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));


const axiosapi = axios.create({
  baseURL: 'https://192.144.96.13',
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
  
  // httpsAgent: new https.Agent({
  //     rejectUnauthorized: false,
  //   }),
  // httpsAgent: agent
});

const httpsAgent = new https.Agent({ rejectUnauthorized: false })

const response = axiosapi.get('/api/', {
  auth: {
              username: 'Client_Id_6d6354ece40846bf7fca65dfabd5d9d4',
              password: 'Client_Secret_bf487e750299d9498da4e2d30cfcb89bf068164a'
          },
            
}).then(function (response) {
  console.log(response.data);
  }).catch(function (error) {
      console.log(error);
  });

  console.log('teste');