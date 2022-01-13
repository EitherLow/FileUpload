const express = require("express");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "images/" });

const app = express();

app.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const readStream = fs.createReadStream(`images/${imageName}`);
  readStream.pipe(res);
});

app.post("/api/images", upload.single("image"), (req, res) => {
  const imagePath = req.file.path;
  const description = req.body.description;
  console.log(description, imagePath);

  res.send({ description, imagePath });
});

app.listen(8080, () => console.log("listening on port 8080"));
