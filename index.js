const PORT = 8080; // 8080 포트를 사용
const express = require('express'); // express 모듈 사용
const cors = require('cors'); // cors 모듈 사용
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer'); // multer 모듈 사용
require('dotenv').config(); // 환경 변수 관리

const app = express(); // express 모듈을 app 변수 할당

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      'http://localhost:3001',  // 로컬 테스트용 도메인
      'https://myplanner.guswldaiccproject.com' // 프로덕션 도메인
    ],
    credentials: true,
  })
);

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World https completed');
});

// 'uploads' 폴더를 정적 파일로 서빙
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer 설정: 파일 저장 위치와 파일 이름 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 파일을 uploads 폴더에 저장
  },
  filename: function (req, file, cb) {
    const fullName = `${Date.now()}_${file.originalname}`;
    cb(null, fullName); // 파일 이름 설정 (중복 방지를 위해 타임스탬프 추가)
  },
});

const upload = multer({ storage: storage });

// 파일 업로드 라우트
app.post('/upload', upload.single('planner_img'), (req, res) => {
  try {
    res.status(200).json({
      message: 'File uploaded successfully',
      filename: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
    });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// Google Maps API 키 전달
app.get('/api/google-maps-config', (req, res) => {
  res.json({ googleMapsApiKey: process.env.MAP_API_KEY });
});

// 다른 라우트 설정
app.use(require('./routes/getRoutes'));
app.use(require('./routes/postRoutes'));
app.use(require('./routes/updateRoutes'));
app.use(require('./routes/deleteRoutes'));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)); // 서버 실행 시 메시지 출력
