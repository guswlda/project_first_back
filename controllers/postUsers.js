const database = require('../database/database');
const bcrypt = require('bcrypt');
const salt = 10;
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// 회원 가입 처리 함수
exports.postUser = async (req, res) => {
  try {
<<<<<<< HEAD
    // 사용자 정보가 모두 제공되었는지 확인
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user_idx = uuidv4(); // 고유 사용자 ID 생성
    const hash = await bcrypt.hash(String(req.body.password), saltRounds); // 비밀번호를 문자열로 변환하여 해시 생성
    const values = [user_idx, req.body.name, req.body.email, hash]; // 사용자 고유 ID 포함
=======
    const user_idx = uuid4(); // 고유 사용자 ID 생성
    const hash = await bcrypt.hash(req.body.password, salt); // 비밀번호 해시 생성
    const values = [req.body.name, req.body.email, hash];
>>>>>>> 76e534273cb437bc2757d57de3e9b7b26489f03b

    await database.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      values
    );

    return res.status(201).json({ message: 'Account Created Successfully' }); // 성공 메시지 반환
  } catch (error) {
    return res.status(500).json({ error: error.message }); // 에러 메시지 반환
  }
};

// 로그인 처리 함수
exports.loginUser = async (req, res) => {
  try {
    const { rows } = await database.query(
      'SELECT * FROM users WHERE email = $1',
      [req.body.email]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' }); // 사용자 미존재 시 메시지 반환
    }

    const compare = await bcrypt.compare(req.body.password, rows[0].password); // 비밀번호 비교

    if (!compare) {
      return res.status(401).json({ message: 'Password not matched' }); // 비밀번호 불일치 시 메시지 반환
    }

    const user_idx = rows[0].user_idx; // 사용자 고유 ID
    const name = rows[0].name; // 사용자 이름
    const email = rows[0].email; // 사용자 이메일
    const token = jwt.sign({ user_idx, name, email }, process.env.SECRET_KEY, {
      expiresIn: '1d', // JWT 토큰 만료 시간 설정 (1일)
    });

    return res.status(201).json({ token: token }); // 로그인 성공 시 토큰 반환
  } catch (error) {
    return res.status(500).json({ error: error.message }); // 에러 발생 시 메시지 반환
  }
};
