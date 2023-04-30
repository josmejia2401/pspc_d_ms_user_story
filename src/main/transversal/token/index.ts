import { decode, JwtPayload } from "jsonwebtoken";
import { Utils } from "../utilities/utils";

export class JWT {
    static decodeToken(token: string): JwtPayload {
        const newToken = Utils.getOnlyToken(token);
        const dec: any = decode(newToken, {
            json: true
        });
        delete dec.username;
        delete dec.password;
        return dec;
    }
}