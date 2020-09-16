// tag select
video = document.querySelector('video');
canvas = document.querySelector('canvas');
button = document.querySelector('button');

canvas.width = 48 //video.videoWidth;
canvas.height = 48 //video.videoHeight;

canvas.style.filter = 'grayscale(1)'; //
video.style.transform = 'scaleX(-1)'; // 좌우 반전

span = document.querySelector('span');
span.style.fontSize = '48px';

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
    span.innerHTML = '⌛';
    predict();
};


// obileNet 모델 predict() 메소드
 async function predict() {
    const model = await tf.loadLayersModel('./model.json');


    image = tf.browser.fromPixels(canvas);
    console.log(image);
    image = image.toFloat().mean(2).mul(1/255.0).reshape([-1, 48, 48, 1]);
    logits = model.predict(image);
    const results = await logits.softmax().data();
    i = results.indexOf(Math.max(...results));

    image.dispose();
    logits.dispose();
    console.log(results);

    span.innerHTML = LABELS[i];
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
