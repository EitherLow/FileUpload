require("dotenv").config();
const express = require("express");
const multer = require("multer");
const database = require("./database");
const fs = require("fs");
const path = require("path");
const util = require("util");

const unlinkFile = util.promisify(fs.unlink);

const app = express();
const upload = multer({ dest: "images/" });

const { uploadFile, getFileStream } = require("./s3");

app.use(express.static(path.join(__dirname, "build")));

app.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imageStream = getFileStream(imageName);

  // const readStream = fs.createReadStream(`images/${imageName}`);
  imageStream.pipe(res);
});

app.post("/api/images", upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;
  const description = req.body.description;
  const result = await uploadFile(req.file);
  await database.addImage(imagePath, description);
  await unlinkFile(imagePath);
  console.log(result);
  res.send({ imagePath: `/images/${result.key}` });
});

app.get("/api/images", async (req, res) => {
  const images = await database.getImages();
  res.send({ images });
  // res.send("ok");
});

app.listen(8080, () => console.log("listening on port 8080"));
