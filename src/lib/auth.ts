import { JWT_SECRET } from "../util/config";

const jwt = require("jsonwebtoken");

export function authenticateToken(req: any, res: any, next: any) {
  if (process.env.JWT_SECRET) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET as string, (err: any, user: any) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    next();
  }
}

