import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const RequireAuth = (req, res, next) => {
  const { TOKEN } = req.cookies;

  console.log("Cookies from middleware: ", {
    name: Object.keys(req.cookies),
    ipAddress: req.ip,
  });

  if (!TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const data = jwt.verify(TOKEN, process.env.SECRET);

  const { password, ...userData } = data.user;

  req.user = userData;

  next();
};
