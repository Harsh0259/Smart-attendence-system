// --- Constants & Config ---
const EXPIRY_TIME_MS = 2 * 60 * 1000; // 2 minutes
const MAX_DISTANCE_METERS = 100; // Max allowed distance in meters

// --- Helper Functions ---

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const rad = Math.PI / 180;
    const φ1 = lat1 * rad;
    const φ2 = lat2 * rad;
    const Δφ = (lat2 - lat1) * rad;
    
    const Δλ = (lon2 - lon1) * rad;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
}

function getGeolocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
        } else {
            navigator.geolocation.getCurrentPosition(
                position => resolve(position.coords),
                error => {
                    let errMsg = "An unknown error occurred.";
                    if (error.code === 1) errMsg = "Location access denied by user.";
                    if (error.code === 2) errMsg = "Position unavailable.";
                    if (error.code === 3) errMsg = "Location request timed out.";
                    reject(new Error(errMsg));
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    });
}

// --- Teacher View Logic ---
const generateBtn = document.getElementById('generate-btn');
const qrContainer = document.getElementById('qr-container');
const locationStatus = document.getElementById('location-status');
const qrWrapper = document.getElementById('qr-wrapper');
const expiryText = document.getElementById('expiry-text');
const loader = document.getElementById('loader');

let qrCode = null;
let timerInterval = null;

if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
        try {
            generateBtn.style.display = 'none';
            qrWrapper.style.display = 'none';
            loader.style.display = 'block';
            locationStatus.innerText = "Getting location...";
            locationStatus.style.color = "#94a3b8";

            const coords = await getGeolocation();
            locationStatus.innerText = "Location verified. QR Generated.";
            locationStatus.style.color = "var(--success)";
            
            const timestamp = Date.now();
            const qrData = JSON.stringify({
                lat: coords.latitude,
                lng: coords.longitude,
                t: timestamp
            });

            if (qrCode) {
                qrCode.clear();
                qrContainer.innerHTML = '';
            }

            qrCode = new QRCode(qrContainer, {
                text: qrData,
                width: 200,
                height: 200,
                colorDark : "#0f172a",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });

            loader.style.display = 'none';
            qrWrapper.style.display = 'block';
            generateBtn.style.display = 'block';
            generateBtn.innerText = "Regenerate QR";

            startTimer(EXPIRY_TIME_MS);

        } catch (error) {
            loader.style.display = 'none';
            generateBtn.style.display = 'block';
            locationStatus.innerText = "Error: " + error.message;
            locationStatus.style.color = "var(--danger)";
        }
    });
}

function startTimer(duration) {
    if (timerInterval) clearInterval(timerInterval);
    
    let timeRemaining = duration;
    
    timerInterval = setInterval(() => {
        timeRemaining -= 1000;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            expiryText.innerText = "QR Code Expired";
            expiryText.style.color = "var(--danger)";
            qrContainer.style.opacity = '0.2';
        } else {
            const minutes = Math.floor(timeRemaining / 60000);
            const seconds = Math.floor((timeRemaining % 60000) / 1000);
            expiryText.innerText = `Valid for: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            expiryText.style.color = "var(--success)";
            qrContainer.style.opacity = '1';
        }
    }, 1000);
}


// --- Student View Logic ---
const startScanBtn = document.getElementById('start-scan-btn');
const studentStatus = document.getElementById('student-status');
const resultMessage = document.getElementById('result-message');
const studentLoader = document.getElementById('student-loader');
let html5QrcodeScanner = null;

if (startScanBtn) {
    startScanBtn.addEventListener('click', () => {
        startScanBtn.style.display = 'none';
        resultMessage.style.display = 'none';
        
        html5QrcodeScanner = new Html5Qrcode("reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        html5QrcodeScanner.start(
            { facingMode: "environment" }, 
            config,
            onScanSuccess,
            onScanFailure
        ).catch(err => {
            showResult(false, "Camera access denied or not available.");
            startScanBtn.style.display = 'block';
        });
    });
}

async function onScanSuccess(decodedText, decodedResult) {
    try {
        // Stop scanning
        if (html5QrcodeScanner) {
            await html5QrcodeScanner.stop();
            document.getElementById('reader').innerHTML = ''; // clear scanner UI
        }
        
        studentLoader.style.display = 'block';
        studentStatus.innerText = "Verifying location and time...";

        // Parse QR Data
        let teacherData;
        try {
            teacherData = JSON.parse(decodedText);
            if (!teacherData.lat || !teacherData.lng || !teacherData.t) {
                throw new Error("Invalid format");
            }
        } catch (e) {
            throw new Error("Invalid QR Code. Please scan a valid attendance QR.");
        }
        
        // 1. Check Expiry
        const currentTime = Date.now();
        const timeDiff = currentTime - teacherData.t;
        
        if (timeDiff > EXPIRY_TIME_MS) {
            throw new Error("QR Code has expired. Please ask the teacher to generate a new one.");
        }

        // 2. Check Location
        const studentCoords = await getGeolocation();
        const distance = calculateDistance(
            teacherData.lat, teacherData.lng,
            studentCoords.latitude, studentCoords.longitude
        );

        if (distance > MAX_DISTANCE_METERS) {
            throw new Error(`Verification failed. You are ${Math.round(distance)}m away from the teacher (Max allowed: ${MAX_DISTANCE_METERS}m). Proxy suspected.`);
        }

        studentLoader.style.display = 'none';
        showResult(true, "Attendance marked successfully!");

        // Show start scan button again to allow next scan if needed
        setTimeout(() => {
            startScanBtn.style.display = 'block';
            startScanBtn.innerText = "Scan Another";
        }, 3000);

    } catch (error) {
        studentLoader.style.display = 'none';
        showResult(false, error.message);
        
        // Allow rescanning on error
        startScanBtn.style.display = 'block';
        startScanBtn.innerText = "Try Again";
    }
}

function onScanFailure(error) {
    // Keep scanning
    // Uncomment below for debugging if needed
    // console.warn(`Code scan error = ${error}`);
}

function showResult(isSuccess, message) {
    resultMessage.innerText = message;
    resultMessage.className = 'status-message ' + (isSuccess ? 'status-success' : 'status-error');
    studentStatus.innerText = "";
    resultMessage.style.display = 'block';
}
