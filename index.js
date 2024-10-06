const PORT = 8080;
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      'http://localhost:3001', // 로컬 테스트용 도메인
      'https://myplanner.guswldaiccproject.com', // 프로덕션 프론트엔드 도메인
      'https://plannerback.guswldaiccproject.com' // 백엔드 도메인 추가
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.options('*', cors()); // 모든 라우트에 대한 OPTIONS 요청을 허용

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World https completed');
});

// 'uploads' 폴더를 정적 파일로 서빙
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const fullName = `${Date.now()}_${file.originalname}`;
    cb(null, fullName);
  },
});

const upload = multer({ storage: storage });

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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
