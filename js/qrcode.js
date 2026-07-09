/* ==================================================================
   QRCODE.JS — Scanner QR Code via caméra (BarcodeDetector API)
   ================================================================== */

const QRScanner = {

  stream: null,
  video: null,
  detector: null,
  scanning: false,

  async start(videoEl, onDetect, onError) {
    this.video = videoEl;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      this.video.srcObject = this.stream;
      await this.video.play();

      if ("BarcodeDetector" in window) {
        this.detector = new BarcodeDetector({ formats: ["qr_code","code_128","ean_13"] });
        this.scanning = true;
        this.scanLoop(onDetect, onError);
      } else {
        // Fallback : lecture manuelle via jsQR
        this.loadJsQR().then(() => {
          this.scanning = true;
          this.scanLoopJsQR(onDetect, onError);
        }).catch(e => onError && onError("QR Scanner non supporté sur ce navigateur."));
      }
    } catch(err) {
      onError && onError(err.message);
    }
  },

  async scanLoop(onDetect, onError) {
    if (!this.scanning) return;
    try {
      const codes = await this.detector.detect(this.video);
      if (codes.length) {
        onDetect(codes[0].rawValue);
        this.stop();
        return;
      }
    } catch(e) {}
    requestAnimationFrame(() => this.scanLoop(onDetect, onError));
  },

  loadJsQR() {
    return new Promise((resolve, reject) => {
      if (window.jsQR) return resolve();
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  },

  scanLoopJsQR(onDetect) {
    if (!this.scanning) return;
    const canvas = document.createElement("canvas");
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(this.video, 0, 0);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = window.jsQR(img.data, img.width, img.height);
    if (code) { onDetect(code.data); this.stop(); return; }
    requestAnimationFrame(() => this.scanLoopJsQR(onDetect));
  },

  stop() {
    this.scanning = false;
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }
};

if (typeof window !== 'undefined') window.QRScanner = QRScanner;
