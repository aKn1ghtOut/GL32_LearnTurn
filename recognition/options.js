var medias = {
    empty: 0
};

const webcamVideo = document.getElementById("webcam-video");

const inputCanvas = document.getElementById("input-canvas");
inputCanvas.width = 640;
inputCanvas.height = 480;

inputCanvas.style.opacity = 0;
webcamVideo.style.opacity = 0;

const inputCanvasCtx = inputCanvas.getContext("2d");

var ID;var count=0;var start,end;
start = new Date();
start = start.getTime();
var outerPoints = [[49, 59], [50, 58], [51, 57], [52, 56], [53, 55]];
var innerPoints = [[61, 67], [62, 66], [63, 65]];
var calibrateState =0,calibrateCount=0;
var outerAvg = 0, innerAvg = 0;
var outer = [];
var look = [0,16,37,46,30]
var lookUD = [27,30,21]

var old_level_L = 0.0;
var audioContext = new AudioContext();
var javascriptNode = audioContext.createScriptProcessor(1024, 1, 1);

async function mainLoop() {
    var distOuter = 0;var distInner = 0;

	inputCanvasCtx.drawImage(webcamVideo, 0, 0, 640, 480);

	const inputImgData = inputCanvasCtx.getImageData(0, 0, 640, 480);
	const inputBufImg = Module._malloc(inputImgData.data.length);
	
	Module.HEAP8.set(inputImgData.data, inputBufImg);

	const ptr = Module.ccall("detect", "number", "number", [inputBufImg]) / Uint16Array.BYTES_PER_ELEMENT;
	
	// Marshal the landmark data referenced by the pointer into a js array
	const len = Module.HEAPU16[ptr];
	const landmarks = [];
	for (let i = 1; i < len; i += 2) {
		const l = [Module.HEAPU16[ptr + i], Module.HEAPU16[ptr + i + 1]];
		landmarks.push(l);
	}

	findFacePos(landmarks);
	
	Module._free(ptr);
	Module._free(inputBufImg);
}

window.onload = () => {

    navigator.getUserMedia({ audio: true, video: true }, mediaStream => {
        medias = mediaStream;
        webcamVideo.srcObject = mediaStream;

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

        setTimeout(() => {
            const req = new XMLHttpRequest();
            req.open("GET", "recognition/shape_predictor_68_face_landmarks.dat", true);
            req.responseType = "arraybuffer";

            req.onload = (e) => {
                const payload = req.response;

                if (payload) {
                    const model = new Uint8Array(payload);
                        
                    const inputBufModel = Module._malloc(model.length);
                    Module.HEAPU8.set(model, inputBufModel);
                    Module.ccall("init_shape_predictor", null, ["number", "number"], [inputBufModel, model.length]); // This pointer gets freed on the C++ side
                    console.log("called predictor")
                    // inputCanvasCtx.drawImage(donnyBaseball, 0, 0, 640, 480);
                    
                    setInterval(mainLoop, 2000);
                }
            }

            req.send(null);
        }, 2000);
        
    },
    err => {
        console.log({ err });
    });
}

setCalibrateState = () =>{
	calibrateState =1;
}

calibrate = (landmarks) =>{
	statusT = document.getElementById("status");
	statusT.value = "Calibration started"
	++calibrateCount;
	for(i=0;i<outerPoints.length;++i){
		point1 = outerPoints[i][0]
		point2 = outerPoints[i][1]
		outerAvg = outerAvg + (landmarks[point2][1]-landmarks[point1][1])
	}
	for(i=0;i<innerPoints.length;++i){
		point1 = innerPoints[i][0]
		point2 = innerPoints[i][1]
		innerAvg = innerAvg + (landmarks[point2][1]-landmarks[point1][1])
	}

	if(calibrateCount==60){
		outerAvg = outerAvg/60;
		innerAvg = innerAvg/60;
		statusT.value = "Calibration Done";
		calibrateState=0;
	}
}

findFacePos = (landmarks) =>{
	points = [];
	pointsUD = [];
	for(i=0;i<look.length;++i)
	points.push([landmarks[look[i]][0],landmarks[look[i]][1]]);
	for(i=0;i<lookUD.length;++i)
    pointsUD.push([landmarks[lookUD[i]][0],landmarks[lookUD[i]][1]]);

	dist1 = findDist(points[0],points[4])
	dist2 = findDist(points[1],points[4])
	lookLeft1 = dist1/dist2;
	lookRight1 = dist2/dist1;
	//console.log("Look left high "+lookLeft1)
	//console.log("Look right high " + lookRight1);
	if(lookLeft1>1.92 || lookRight1>1.8)// don't decrease beyond 1.5
	return sendData({
        looking: false
    });

	distUD1 = findYDist(pointsUD[0],pointsUD[2])
	distUD2 = findYDist(pointsUD[1],pointsUD[2])
	distUD = distUD2/distUD1;
    //console.log(distUD);

    if(distUD<2.5)
    return sendData({
        looking: false
    });

    return sendData({
        looking: true
    });
}

findDist = (point1,point2) =>{
	return Math.sqrt(Math.pow(point1[0]-point2[0],2) + Math.pow(point1[1] - point2[1],2));
}

findYDist = (point1,point2) =>{
	dist = point1[1] - point2[1]
	if(dist<0)
	return 1;
	else
	return dist;

}

const sendData = data => {
    const newData = {
        ...data,
        audioLevel: old_level_L,
        message: "reporting"
    };

    chrome.runtime.sendMessage({ message : "reporting", data: newData });

    return true;
}

const stopEverything = () => {
    medias.getTracks && medias.getTracks().forEach(t => t.stop());
    javascriptNode.disconnect && javascriptNode.disconnect();
}