import express from "express";
import { addSchool, listSchools } from "../controllers/school.controller.js";

const app = express();

app.use(express.json());


app.post("/addSchool", addSchool);

app.get("/listSchools",listSchools)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const ErrorMessage = {
    message: err.message || `Something went wrong`,
    timeStamp: new Date().toLocaleString(),
    InternalCode: err.internalMessage || err.message,
  };
  res.status(statusCode).json(ErrorMessage);
});


export { app };
