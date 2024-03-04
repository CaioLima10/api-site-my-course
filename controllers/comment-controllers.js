import { db } from "../connect.js";

export const createdComment = (request, response) => {
  const { comment_desc, post_id, comment_user_id } = request.body;

  if (!comment_desc || !post_id || !comment_user_id) {
    return response
      .status(422)
      .json({ msg: "O comentário precisa ter um texto" });
  }

  console.log(comment_user_id);
  db.query(
    "INSERT INTO comments SET ?",
    { comment_desc, post_id, comment_user_id },
    (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return response.status(422).json({
          msg: "Aconteceu algum erro no servidor, tente novamente mais tarde.",
          error: error.message,
        });
      } else {
        console.log("Comment created:", results);
        return response
          .status(200)
          .json({ msg: "Comentário enviado com sucesso." });
      }
    }
  );
};

export const getComment = (request, response) => {
  db.query(
    "SELECT c.*, u.username, userImg FROM comments as c JOIN user as u ON (u.id = c.comment_user_id) WHERE post_id = ? ORDER BY created_at DESC",
    [request.query.post_id],
    (error, data) => {
      if (error) {
        console.log(error);
        return response.status(500).json({
          msg: " Aconteceu algum erro no servidor, ente novamente mais tarde.",
        });
      } else {
        return response.status(200).json({ data });
      }
    }
  );
};
