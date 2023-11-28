// server.js

const express = require('express');
const bodyParser = require('body-parser');
const tmPose = require('@teachablemachine/pose');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push } = require('firebase/database');

const app = express();
const port = 3000;

// CORS 허용 설정
app.use(cors());

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBGhiclax0v6Onvo1iozBuwUOYrShbbqkI",
    authDomain: "wireless-project-4.firebaseapp.com",
    databaseURL: "https://wireless-project-4-default-rtdb.firebaseio.com",
    projectId: "wireless-project-4",
    storageBucket: "wireless-project-4.appspot.com",
    messagingSenderId: "232862239959",
    appId: "1:232862239959:web:b47a6fa0e315378e263492",
    measurementId: "G-1DFMELVGLH"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Teachable Machine 모델 로드
const URL = "https://teachablemachine.withgoogle.com/models/7Vq-6gy5B/";
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";
let model;

tmPose.load(modelURL, metadataURL).then((loadedModel) => {
    model = loadedModel;
    startServer();
});

function startServer() {
    app.use(bodyParser.json());

    // 라우트: 웹캠 데이터 수신 및 예측 결과 반환
    app.post('/predict', async (req, res) => {
        try {
            const imageData = req.body.imageData; // 웹캠 이미지 데이터

            // Teachable Machine 모델을 사용하여 예측
            const { pose, posenetOutput } = await model.estimatePose(imageData);
            const prediction = await model.predict(posenetOutput);

            // 결과를 클라이언트로 전송
            res.json({
                pose: pose,
                predictions: prediction.map(p => ({ className: p.className, probability: p.probability }))
            });
        } catch (error) {
            console.error('Error predicting:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.listen(port, () => {
        console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
    });
}
