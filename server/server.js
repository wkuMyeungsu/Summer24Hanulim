const express = require("express");
const cors = require("cors");
const googleSheetAPI = require("./googleSheet/api");

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(
  cors({
    origin: "http://localhost", // 80 포트는 기본 HTTP 포트이므로 생략 가능
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// 라우트 설정
app.use("/api", googleSheetAPI);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
