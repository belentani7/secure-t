import { createRequestHandler } from "express";
import { app } from "../server/index.js";

export default createRequestHandler(app);