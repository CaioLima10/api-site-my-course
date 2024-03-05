import { db } from "../connect.js";

export const createdLikes = (request, response) => {
  const { likes_user_id, likes_post_id } = request.body;

  db.query(
    "INSERT INTO likes SET ?",
    { likes_user_id, likes_post_id },
    (error) => {
      if (error) {
        console.log(error);
        return response
          .status(422)
          .json({ msg: "Aconteceu erro ao conectar com servidor." });
      } else {
        return response.status(200).json({ msg: "Likes enviado com sucesso." });
      }
    }
  );
};

export const deleteLikes = (request, response) => {
  const { likes_user_id, likes_post_id } = request.body;

  db.query(
    "DELETE FROM likes WHERE `likes_user_id` = ? AND `likes_post_id` = ?",
    [likes_user_id, likes_post_id],
    (error) => {
      if (error) {
        console.log(error);
        return response
          .satus(500)
          .json({ msg: "Aconteceu erro ao conectar com servidor." });
      } else {
        return response.status(200).json({ msg: "Like removido com sucesso." });
      }
    }
  );
};

export const getLikes = (request, response) => {
  db.query(
    "SELECT l.*, u.username FROM likes as l JOIN user as u ON (u.id = l.likes_user_id) WHERE likes_post_id = ?",
    [request.query.likes_post_id],
    (error, data) => {
      if (error) {
        console.log(error);
        return response
          .status(500)
          .json({ msg: "Aconteceu erro ao conectar com servidor." });
      } else if (data) {
        return response.status(200).json({ data });
      }
    }
  );
};
