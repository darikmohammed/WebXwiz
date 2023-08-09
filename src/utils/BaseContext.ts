import { IUser } from "../model/User";

interface BaseContext {
  userId: string | null;
  user: IUser | null;
}

export {BaseContext}