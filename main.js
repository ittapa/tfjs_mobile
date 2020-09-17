// tag select
video = document.querySelector('video');
canvas = document.querySelector('canvas');
button = document.querySelector('button');
span = document.querySelector('span');

canvas.width = 48
canvas.height = 48

canvas.style.filter = 'grayscale(1)'; // 흑백...
video.style.transform = 'scaleX(-1)'; // 좌우 반전

span.style.fontSize = '100px'; // 이모티콘 영역 폰트 사이즈 조절.

// 라벨 , 이모티콘 매핑.
const LABELS = {
0: '🤬', // angry
1: '🤢', // disgust
2: '😱', // fear
3: '😄', // happy
4: '😢', // sad
5: '😲', // surprise
6: '😐' // neutral
}


//BUTTON EVENT FN
button.onclick = function() {

    w = video.videoWidth;
    h = video.videoHeight;
    s = Math.min(w, h);
    sx = (w-s)/2;
    sy = (h-s)/2;

   canvas.getContext('2d').drawImage(video, sx=sx, sy=sy, swidth=s,
                                    sheight=s, x=0, y=0, width=48, height=48);
    //context.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
    //img: 이미지 소스, sx: 이미지에서 잘라 가져올 시작점의 x좌표, sy: 이미지에서 잘라 가져올 시작점의 y좌표
    //swidth: 잘라 가져올 이미지의 폭 sheight: 잘라 가져올 이미지의 높이
    //x: 이미지가 그려지는 x좌표, y: 이미지가 그려지는 y좌표, width: 이미지 폭, height: 이미지 높이

    span.innerHTML = '⌛'; // 기다리는 이모티콘으로...
    predict();
};


// obileNet 모델 predict() 메소드
 async function predict() {
    // 모델 import
    const model = await tf.loadLayersModel('./model.json');

    image = tf.browser.fromPixels(canvas); // canvas에 이미지 가져오기
    console.log(image); // 콘솔에 이미지 data 찍기.

    image = image.toFloat().mean(2).mul(1/255.0).reshape([-1, 48, 48, 1]);
    logits = model.predict(image);
    const results = await logits.softmax().data();
    i = results.indexOf(Math.max(...results));

    image.dispose();
    logits.dispose();
    console.log(results);

    span.innerHTML = LABELS[i];
  }

  function faceRecognition = {

  }





// 비디오...
constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  video.srcObject = stream;
}

function handleError(error) {
  alert('navigator.MediaDevices.getUserMedia error: ' + error.message + error.name);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
