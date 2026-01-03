import "express-session";
import { ObjectId } from "mongodb";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: ObjectId;
      username: string;
    };
  }
}
