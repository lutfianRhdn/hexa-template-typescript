import Repository from "../Repository";
import { TUser } from "../../entities/user/user";

export default interface UserRepository extends Repository<TUser> {
  findByUsername(username: string): Promise<TUser | null>;
}
