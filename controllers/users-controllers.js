import { db } from "../connect.js";

export const getUser = (request, response) => {
  const id = request.query.id;

  if (!id) {
    return response.satus(422).json({ msg: "Id do usuario não encontrado" });
  }

  db.query(
    "SELECT username, userImg  FROM user WHERE id = ?",
    [id],
    (error, data) => {
      if (error) {
        return response
          .satus(422)
          .json({ msg: "Id do usuario não encontrado" });
      } else {
        return response.status(200).json(data);
      }
    }
  );
};

export const updateUser = (request, response) => {
  const { username, userImg, password, id } = request.body;

  if ((!username || !userImg, !password)) {
    return response
      .status(422)
      .json({ msg: "Sem alterações para serem feitas" });
  }

  db.query(
    "UPDATE user SET username = ? userImg = ? password = ? WHERE id = ? ",
    [username, userImg, password, id],
    (error, data) => {
      if (error) {
        return response.status(500).json({
          msg: "Aconteceu algum erro no servidor, tente novamente mais tarde!",
        });
      }
      if (data.affectedRows > 0) {
        return response.status(200).json({ msg: "Atualizado com sucesso." });
      }
    }
  );
};
