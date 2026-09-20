(function () {
    "use strict";

    var pill = document.createElement("div");
    pill.id = "jb-pill";
    pill.className = "jbpill";
    pill.innerHTML = '<span class="jb-spin"></span><span class="jb-dot"></span><span class="jb-text"></span>';
    document.body.appendChild(pill);

    var textEl = pill.querySelector(".jb-text");
    var dotEl = pill.querySelector(".jb-dot");

    function show(type, text) {
        pill.className = "jbpill show " + (type === "running" ? "running" : type === "done" ? "done" : "fail");
        textEl.textContent = text;
        clearTimeout(pill._t);
        if (type !== "running") {
            pill._t = setTimeout(function () {
                pill.classList.remove("show");
            }, 7000);
        }
    }

    function running(text) { show("running", text || "\u0627\u0644\u062a\u0647\u0643\u064a\u0631 \u062c\u0627\u0631\u064a ..."); }
    function done(text) {
        dotEl.textContent = "\u2713";
        show("done", text || "\u0627\u0644\u062a\u0647\u0643\u064a\u0631 \u062a\u0645 \u0628\u0646\u062c\u0627\u062d!");
    }
    function fail(text) {
        dotEl.textContent = "\u2717";
        show("fail", text || "\u0641\u0634\u0644 \u0627\u0644\u062a\u0647\u0643\u064a\u0631");
    }

    window.EbaidJB = {
        show: show,
        running: running,
        done: done,
        fail: fail,
        countdown: function (secs, onTick, onDone) {
            var n = Math.max(1, secs | 0);
            (function tick() {
                if (onTick) onTick(n);
                if (n === 0) { if (onDone) onDone(); return; }
                n--;
                setTimeout(tick, 1000);
            })();
        }
    };

    var body = document.body;

    // raw13g: body class done / fail / log
    function handleBodyClass() {
        if (!body) return;
        if (body.classList.contains("done")) { done(); return; }
        if (body.classList.contains("fail")) { fail(); }
    }
    try {
        new MutationObserver(function () { handleBodyClass(); })
            .observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    } catch (e) { }
    handleBodyClass();

    // rawgame4 + raw13g launcher: #state text
    var stateEl = document.getElementById("state");
    if (stateEl) {
        var DONE_RE = /ALL DONE|ROOT|REPAIRED|NO REBOOT|KERNEL R\/W|SUCCESS/i;
        var FAIL_RE = /FAILED|no commit|UNSUPPORTED|missing|does not|did not|cache failed/i;
        function handleState() {
            var t = (stateEl.textContent || "").replace(/\s+/g, " ").trim();
            if (!t) return;
            if (DONE_RE.test(t)) { done(); return; }
            if (FAIL_RE.test(t)) { fail(t); return; }
            running("\u23f3 " + t);
        }
        try {
            new MutationObserver(handleState)
                .observe(stateEl, { childList: true, characterData: true, subtree: true });
        } catch (e) { }
        handleState();
    }

    // ntfonto: #jeilbrek button state
    var jbBtn = document.getElementById("jeilbrek");
    if (jbBtn) {
        function handleBtn() {
            var t = (jbBtn.textContent || "").replace(/\s+/g, " ").trim();
            if (jbBtn.disabled) {
                running("ثواني .. التهكير شغال ...");
            } else if (t.indexOf("نجاح") !== -1) {
                done();
            } else if (t.indexOf("فشل") !== -1 || t.indexOf("أعد المحاولة") !== -1) {
                fail();
            }
        }
        try {
            new MutationObserver(handleBtn).observe(jbBtn, {
                attributes: true,
                attributeFilter: ["disabled"],
                childList: true,
                characterData: true,
                subtree: true
            });
        } catch (e) { }
        handleBtn();
    }
})();