const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Document = require("./models/Document");
const { time } = require("console");
const app = express();
const PORT = 3000;

//中間件
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // 處理提交表單的方法
app.use(methodOverride("_method"));

// 設定EJS
app.set("view engine", "ejs");

//資料庫
mongoose
  .connect("mongodb://localhost:27017/dcApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB連接成功"))
  .catch((err) => console.log("MongoDB連接錯誤:", err));

//路由
app.get("/", async (req, res, next) => {
  try {
    const documents = await Document.find().sort("-createdAt");
    res.render("index", { documents });
  } catch (err) {
    res.status(500).send(err);
  }
});

//顯示新增文件的表單
app.get("/documents/new", async (req, res, next) => {
  try {
    res.render("new", { document: new Document() });
  } catch (err) {
    res.status(500).send(err);
  }
});

//路由：新增文件
app.post("/documents", async (req, res, next) => {
  const { fileNumber, title, remark, user, currentUnit } = req.body;
  const document = new Document({
    fileNumber,
    title,
    remark,
    user,
    currentUnit,
  });
  try {
    await document.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err);
  }
});

//顯示刷入文件的表單
app.get("/documents/flash", (req, res, next) => {
  res.render("flash");
});

//路由：更新文件狀態(刷入)
app.put("/documents/flash", async (req, res, next) => {
  try {
    const document = await Document.findOne({
      fileNumber: req.body.fileNumber,
    });
    if (!document) {
      return res.status(404).send("文件未找到");
    }
    document.currentUnit = req.body.currentUnit;
    document.currentUnitRemark = req.body.currentUnitRemark;
    document.flashHistory.push({
      time: Date.now(),
      unit: req.body.currentUnit,
      remark: req.body.currentUnitRemark,
    });
    await document.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err);
  }
});

//顯示刷出文件的表單
app.get("/documents/spawn", (req, res, next) => {
  res.render("spawn");
});

//路由：更新文件狀態(刷出)
app.put("/documents/spawn", async (req, res, next) => {
  try {
    const document = await Document.findOne({
      fileNumber: req.body.fileNumber,
    });
    if (!document) {
      return res.status(404).send("文件未找到");
    }
    document.currentUnit = "";
    document.currentUnitRemark = req.body.currentUnitRemark;
    document.isSpawned = true; // 标记文件已刷出
    document.spawnHistory.push({
      time: Date.now(),
      remark: req.body.currentUnitRemark,
    });
    await document.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err);
  }
});

// 路由：顯示文件的刷入、刷出的紀錄
app.get("/documents/:id/history", async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).send("文件未找到");
    }
    res.render("history", { document });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

//顯示查詢文件的表單
app.get("/documents/query", (req, res, next) => {
  res.render("query");
});

//路由：依據文件ID，提供文件資料
app.get("/api/documents/query", async (req, res, next) => {
  try {
    const document = await Document.findOne({
      fileNumber: req.query.fileNumber,
    });

    if (!document) {
      return res.status(404).json({ error: "文件未找到" });
    }
    res.json({ document });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//錯誤處理，中間件

app.listen(PORT, () => {
  console.log(`伺服器正在${PORT}運行`);
});
