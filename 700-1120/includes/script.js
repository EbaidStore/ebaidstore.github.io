let timerId = null;
const label = document.getElementById('autoJbLabel');
const checkbox = document.getElementById('autoJbInput');
const jeilbrekBtn = document.getElementById('jeilbrek');
const UAElement = document.getElementById("UA");
const countdownEl = document.getElementById("cd");

// choose one of kernel exploits
var exploitChain = localStorage.getItem("exploitChain") || "lapse";
const netctrlRadio = document.getElementById("netctrl-exploit");
const lapseRadio = document.getElementById("lapse-exploit");
const kexForm = document.getElementById('kernel-options');

// Show user agent
UAElement.innerText += " " + navigator.userAgent;

kexForm.addEventListener("change", function (event) {
    localStorage.setItem("exploitChain", event.target.value);
    exploitChain = event.target.value;
});

// jailbreak execution with manual countdown
jeilbrekBtn.addEventListener("click", function (e){
    if (jeilbrekBtn.disabled) return;
    jeilbrekBtn.disabled = true;
    jeilbrekBtn.textContent = "ثواني .. التهكير شغال...";
    runCountdown();
});

function stopInterval(){
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

function runCountdown() {
    stopInterval();
    let countdown = 5;
    countdownEl.textContent = countdown;
    timerId = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            countdownEl.textContent = "GO";
            clearInterval(timerId);
            timerId = null;
            doJb();
            return;
        }
        countdownEl.textContent = countdown;
    }, 1000);
}

function cacheProgress(e) {
    var Percent = (Math.round(e.loaded / e.total * 100));
    document.title = "Caching: " + Percent + "%";
}

function displayCacheProgress() {
    setTimeout(function () {
        // show a tick
        document.title = "\u2713";
    }, 1000);
    setTimeout(function () {
        // location.reload();
        document.title = "CSSFontFace exploit";
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function() {
    // Cache handling
    if (window.applicationCache) {
        window.applicationCache.addEventListener("progress", cacheProgress, false);
        window.applicationCache.oncached = function (e) { displayCacheProgress(); };
        window.applicationCache.onupdateready = function (e) { displayCacheProgress(); };
    }

    // choose prefered exploit chain
    if (exploitChain == "netctrl") {
        netctrlRadio.checked = true;
    } else {
        lapseRadio.checked = true;
    }
});