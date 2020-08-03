var medias = {
    empty: 0
};

const video = document.getElementById('video');

var eye_status = true //closed eye
var open_status = false 
var look = false //if looking left or roght then true

var ID;var count=0;var start,end;
start = new Date();
start = start.getTime();

var old_level_L = 0.0;
var audioContext = new AudioContext();
var javascriptNode = audioContext.createScriptProcessor(1024, 1, 1);

const startVideo = () => {

    navigator.getUserMedia({ audio: true, video: true }, mediaStream => {
        medias = mediaStream;
        video.srcObject = mediaStream;

        audioContext = new AudioContext();
        var microphone = audioContext.createMediaStreamSource(mediaStream);
        javascriptNode = audioContext.createScriptProcessor(1024, 1, 1);
        
        microphone.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);
        javascriptNode.onaudioprocess = function(event){
            var inpt_L = event.inputBuffer.getChannelData(0);
            var instant_L = 0.0;

            var sum_L = 0.0;
            for(var i = 0; i < inpt_L.length; ++i) {
                sum_L += inpt_L[i] * inpt_L[i];
            }
            instant_L = Math.sqrt(sum_L / inpt_L.length);	
            instant_L = Math.max( instant_L, old_level_L -0.008 );
            old_level_L = instant_L;
        }

        console.log("Detecting in 2 seconds...");        
    },
    err => {
        console.log({ err });
    });
}

window.onload = () => {
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(startVideo)
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    //STUDENT LOOK
    const nosetip = resizedDetections[0].landmarks.positions[31]
    const lefteye = resizedDetections[0].landmarks.positions[37]
    const leftcheek = resizedDetections[0].landmarks.positions[2]
    const righteye = resizedDetections[0].landmarks.positions[46]
    const rightcheek = resizedDetections[0].landmarks.positions[16]
    const dist1 = Math.sqrt(Math.pow(leftcheek.x - rightcheek.x, 2) + Math.pow(leftcheek.y - rightcheek.y, 2))
    const dist2 = Math.sqrt(Math.pow(nosetip.x - rightcheek.x, 2) + Math.pow(nosetip.y - rightcheek.y, 2))
    const lookLeft1 = dist1 / dist2
    const lookRight1 = dist2 / dist1
    const dist3 = Math.sqrt(Math.pow(lefteye.x - rightcheek.x, 2) + Math.pow(lefteye.y - rightcheek.y, 2))
    const dist4 = Math.sqrt(Math.pow(righteye.x - rightcheek.x, 2) + Math.pow(righteye.y - rightcheek.y, 2))
    const lookLeft2 = dist3 / dist4
    const lookRight2 = dist4 / dist3

     if(lookLeft1>2.2 ){
       look = true
       //console.log(look)
      //console.log("STUDENT IS LOOKING LEFT")
     }
		
	else if(lookRight1>0.78 ){
    look = true
    //console.log(look)
    //console.log("STUDENT IS LOOKING RIGHT")
  }
    
    else{
      look = false
      //console.log(look)
      //console.log("STUDENT IS LOOKING STRAIGHT")
    }
  


    //DROWSINESS


    function calc_EAR(eye) {
      const A = Math.sqrt(Math.pow(eye[1][0] - eye[5][0], 2) + Math.pow(eye[1][1] - eye[5][1], 2))
      const B = Math.sqrt(Math.pow(eye[2][0] - eye[4][0], 2) + Math.pow(eye[2][1] - eye[4][1], 2))
      const C = Math.sqrt(Math.pow(eye[0][0] - eye[3][0], 2) + Math.pow(eye[0][1] - eye[3][1], 2))
      const ear_aspect_ratio = (A + B) / (2.0 * C)
      return ear_aspect_ratio
    }

    var Leye = []
    var Reye = []
    for (let i = 36; i < 42; i++) {
      var x1 = resizedDetections[0].landmarks.positions[i].x
      var y1 = resizedDetections[0].landmarks.positions[i].y
      var coord = [x1, y1]
      Leye.push(coord)
      var next_point = i + 1
      if (i == 41)
        next_point = 36
      var x2 = resizedDetections[0].landmarks.positions[next_point].x
      var y2 = resizedDetections[0].landmarks.positions[next_point].y

    }

    for (let j = 42; j < 48; j++) {
      var x3 = resizedDetections[0].landmarks.positions[j].x
      var y3 = resizedDetections[0].landmarks.positions[j].y
      var coord = [x3, y3]
      Reye.push(coord)
      var next_point = j + 1
      if (j == 47)
        next_point = 42
      var x4 = resizedDetections[0].landmarks.positions[next_point].x
      var y4 = resizedDetections[0].landmarks.positions[next_point].y
    }

    //console.log(Leye[1][1])
    //console.log(Reye)
    const Lear = calc_EAR(Leye)
    const Rear = calc_EAR(Reye)

    var EAR = (Lear + Rear) / 2
    EAR = Math.round((EAR + Number.EPSILON) * 100) / 100
      if(EAR<0.3){
        eye_status = true
        //console.log(eye_status)
        //console.log("DROWSY")
      }
      
    else{
      eye_status = false
      //console.log(eye_status)
      //console.log("AlERT")
    }
       
 

    //MOUTH OPEN

    function top_lip() {
      var top_lip_pts = []
      for (let l = 50; l < 53; l++) {
        var xtl = resizedDetections[0].landmarks.positions[l].x
        var ytl = resizedDetections[0].landmarks.positions[l].y
        var c = [xtl, ytl]
        top_lip_pts.push(c)
      }
      for (let l = 61; l < 64; l++) {
        var xtl = resizedDetections[0].landmarks.positions[l].x
        var ytl = resizedDetections[0].landmarks.positions[l].y
        var c = [xtl, ytl]
        top_lip_pts.push(c)
      }
      var l = top_lip_pts.length
      var xmean = 0
      var ymean = 0
      for (let i = 0; i < l; i++) {
        xmean += top_lip_pts[i][0]
        ymean += top_lip_pts[i][1]
      }
      xmean = xmean / l;
      ymean = ymean / l;
      var final = (xmean, ymean)
      return final
    }
    function bottom_lip() {
      var bottom_lip_pts = []
      for (let l = 65; l < 68; l++) {
        var xtl = resizedDetections[0].landmarks.positions[l].x
        var ytl = resizedDetections[0].landmarks.positions[l].y
        var c = [xtl, ytl]
        bottom_lip_pts.push(c)
      }
      for (let l = 56; l < 59; l++) {
        var xtl = resizedDetections[0].landmarks.positions[l].x
        var ytl = resizedDetections[0].landmarks.positions[l].y
        var c = [xtl, ytl]
        bottom_lip_pts.push(c)
      }
      var l = bottom_lip_pts.length
      var xmean = 0
      var ymean = 0
      for (let i = 0; i < l; i++) {
        xmean += bottom_lip_pts[i][0]
        ymean += bottom_lip_pts[i][1]
      }
      xmean = xmean / l
      ymean = ymean / l
      var final = (xmean, ymean)
      return final
    }

    function mouth_open() {
      var top_lip_center = top_lip()
      var bottom_lip_center = bottom_lip()
      var lip_distance = Math.abs(top_lip_center - bottom_lip_center)
      return lip_distance
    }

    var lip_distance = mouth_open();
    
    var open_count = 0 // can use this to count for how many fraames mouth is open so you can determine a yawn
    var prev_open_status = open_status
    if (lip_distance > 25) {
      open_status = true
      //console.log("Mouth is open")
    }
    else {
      open_status = false
      open_count = 0;
    }
    if (prev_open_status == true && open_status == false)
      open_count++

    sendData({
        looking:    !look,
        drowsy:     eye_status,
        mouthOpen:  open_count === 1
    });
  }, 1000)
})

const sendData = data => {
    const newData = {
        ...data,
        audioLevel: old_level_L,
        message: "reporting"
    };

    console.log({ old_level_L });

    chrome.runtime.sendMessage({ message : "reporting", data: newData });

    return true;
}

const stopEverything = () => {
    medias.getTracks && medias.getTracks().forEach(t => t.stop());
    javascriptNode.disconnect && javascriptNode.disconnect();
}