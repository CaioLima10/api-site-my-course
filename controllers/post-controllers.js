import { db } from "../connect.js";

export const createdPost = (request, response) => {
  const { post_desc, userId } = request.body;

  if (!post_desc) {
    return response
      .status(422)
      .json({ msg: "O post precisa ter imagem ou comentario." });
  }

  db.query("INSERT INTO posts SET ?", { post_desc, userId }, (error) => {
    if (error) {
      console.log(error);
      return response
        .status(500)
        .json({ msg: "error ao connectar com servidor!" });
    } else {
      return response.status(200).json({ msg: "Post enviado com sucesso!" });
    }
  });
};

export const getPost = (_request, response) => {
  db.query(
    "SELECT p.*, u.username, userImg FROM posts as p JOIN user as u ON (u.id = p.userId) ORDER BY created_at DESC",
    (error, data) => {
      if (error) {
        console.log(error);
        return response
          .status(500)
          .json({ msg: "error ao connectar com servidor!" });
      } else if (data) {
        return response.status(200).json({ data });
      }
    }
  );
};
