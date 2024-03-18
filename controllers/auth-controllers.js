import jwt from "jsonwebtoken";
import { db } from "../connect.js";
import bcrypt from "bcrypt";

export const register = (request, response) => {
  const { username, email, password, confirmPassword } = request.body;

  if (!username) {
    return response.status(400).json({ msg: "O nome é obrigatório!" });
  }
  if (!email) {
    return response.status(400).json({ msg: "O email é obrigatório!" });
  }

  if (!password) {
    return response.status(400).json({ msg: "A senha é obrigatória!" });
  }

  if (password !== confirmPassword) {
    return response.status(400).json({ msg: "As senhas não são iguais!" });
  }

  db.query(
    "SELECT email FROM user WHERE email = ?",
    [email],
    async (error, data) => {
      if (error) {
        console.log(error);
        return response
          .status(500)
          .json({ msg: "Erro ao conectar com o servidor!" });
      }
      if (data && data.length > 0) {
        return response
          .status(500)
          .json({ msg: "Este usuário já está cadastrado!" });
      } else {
        const passwordHash = await bcrypt.hash(password, 8);
        db.query(
          "INSERT INTO user SET ?",
          {
            username,
            email,
            password: passwordHash,
          },
          (error) => {
            if (error) {
              console.log(error);
              return response
                .status(500)
                .json({ msg: "Erro ao cadastrar o usuário!" });
            } else {
              return response
                .status(200)
                .json({ msg: "Cadastro efetuado com sucesso!" });
            }
          }
        );
      }
    }
  );
};

export const login = (request, response) => {
  const { email, password } = request.body;

  db.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    async (error, data) => {
      if (error) {
        console.log(error);
        return response
          .status(500)
          .json({ msg: "Erro ao conectar com o servidor!" });
      }
      if (data.length === 0) {
        return response.status(404).json({ msg: "Usuário não encontrado!" });
      } else {
        const user = data[0];
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
          return response.status(422).json({ msg: "Senha incorreta!" });
        }
        try {
          const refreshToken = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
              id: user.id,
            },
            process.env.REFRESH,
            { algorithm: "HS256" }
          );
          const token = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + 3600,
              id: user.id,
            },
            process.env.ACCESS,
            { algorithm: "HS256" }
          );
          delete user.password;
          response
            .cookie("accessToken", token, {
              httpOnly: true,
            })
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
            })
            .status(200)
            .json({
              msg: "Usuário logado com sucesso!",
              user,
            });
        } catch (error) {
          console.log(error);
          return response
            .status(500)
            .json({ msg: "Erro ao conectar com o servidor!" });
        }
      }
    }
  );
};

export const logout = (request, response) => {
  return response
    .clearCookie("accessToken", { secure: true, sameSile: "none" })
    .clearCookie("refreshToken", { secure: true, sameSile: "none" })
    .status(200)
    .json({ msg: "logout efetuado com sucesso!" });
};

export const refresh = (request, response) => {
  const authHeader = request.headers && request.headers.cookie?.split(";")[1];
  if (!authHeader) {
    return response
      .status(401)
      .json({ msg: "Token de atualização não encontrado na solicitação." });
  }
  const refreshToken = authHeader.split("=")[1];

  const tokenStructure = refreshToken.split(".")[1];
  const payloadToken = Buffer.from(tokenStructure, "base64").toString("utf-8");

  try {
    const newRefreshToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        id: JSON.parse(payloadToken).id,
      },
      process.env.REFRESH,
      { algorithm: "HS256" }
    );
    const accessToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 3600,
        id: JSON.parse(payloadToken).id,
      },
      process.env.ACCESS,
      { algorithm: "HS256" }
    );
    response
      .cookie("accessToken", accessToken, {
        httpOnly: true,
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
      })
      .status(200)
      .json({
        msg: "Token atualizado com sucesso!",
      });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ msg: "Erro ao conectar com o servidor!" });
  }
};
