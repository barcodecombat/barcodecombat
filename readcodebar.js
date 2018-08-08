
var barcode = barcode || {};

barcode.readcodebar = function(){
  this.state =  {
            inputStream: {
                type : "LiveStream",
                constraints: {
                    width: {min: 640},
                    height: {min: 480},
                    facingMode: "environment",
                    aspectRatio: {min: 1, max: 2}
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: 4,
            decoder: {
                readers : [{
                    format: "ean_reader",
                    config: {}
                }]
            },
            locate: true
        };
};

barcode.readcodebar.prototype = {
  init : function(){

    var _this = this;
    Quagga.init(this.state, function(err) {
        if (err) {
            console.log(err);
        }
        Quagga.start();
        Quagga.onProcessed(_this.processed);
        Quagga.onDetected(_this.detected);
    });
  },

  stop : function(){
    Quagga.stop();
  },
  detected : function(result){
    var code = result.codeResult.code;
    document.getElementById("Found").value = code;
  },
  processed : function(result){
    var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
        if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
            result.boxes.filter(function (box) {
                return box !== result.box;
            }).forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
            });
        }

        if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
        }

        if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
        }
    }
  }

}

var reader = new barcode.readcodebar();
reader.init();
