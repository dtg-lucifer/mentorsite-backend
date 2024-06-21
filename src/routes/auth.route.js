import { Router } from "express";
import {
  createUserAndValidate,
  validateUser,
} from "../service/auth.service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { RequireAuth } from "../middleware/requireauth.middleware.js";

dotenv.config();

const authRouter = Router();

authRouter
  .post("/register", async (req, res) => {
    const { status, data } = await createUserAndValidate(req.body);

    if (status === 201) {
      const token = jwt.sign({ user: data.user }, process.env.SECRET, {
        expiresIn: process.env.EXPIRY,
      });

      res.cookie("TOKEN", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: true,
        sameSite: "none",
      });

      res.status(status).send({ ...data, token });
    } else {
      res.status(status).send(data);
    }
  })
  .post("/login", async (req, res) => {
    const { email, password } = req.body;

    const { data, status } = await validateUser({ email, password });

    if (status === 200) {
      const token = jwt.sign({ user: data.user }, process.env.SECRET, {
        expiresIn: process.env.EXPIRY,
      });

      res.cookie("TOKEN", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: true,
        sameSite: "none",
      });

      res.status(status).send({ ...data, token });
    } else {
      res.status(status).json({ ...data });
    }
  })
  .get("/logout", RequireAuth, (req, res) => {
    const { TOKEN } = req.cookies;

    if (!TOKEN) {
      return res.status(401).send("Unauthorized");
    }

    console.log("Logging out user: ", {
      [req.user.firstName]: req.user,
      ip: req.ip,
    });

    req.user = null;

    res.clearCookie("TOKEN").send("Logged out successfully");
  })
  .get("/me", (req, res) => {
    const { TOKEN } = req.cookies;

    console.log("Cookies [me]: ", {
      name: Object.keys(req.cookies),
      ipAddress: req.ip,
    });

    if (!TOKEN) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const data = jwt.verify(TOKEN, process.env.SECRET);

    if (!data) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const { password, ...userData } = data.user;

    console.log("User Data: ", { ...userData });
    res.status(200).send({ ...userData });
  })
  .get("/get-token", (req, res) => {
    const { TOKEN } = req.cookies;

    console.log("Cookies [get-token]: ", {
      name: Object.keys(req.cookies),
      ipAddress: req.ip,
    });

    if (!TOKEN) {
      return res.status(401).send("Unauthorized");
    }

    res.status(200).send({ TOKEN });
  });

export { authRouter };
