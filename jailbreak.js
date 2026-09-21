(function () {
    "use strict";

    // Loading overlay: three dots + status text (standalone, themed)
    var stage = document.createElement("div");
    stage.className = "jbstage";
    var dots = document.createElement("div");
    dots.className = "jbdots";
    var i;
    for (i = 0; i < 3; i++) dots.appendChild(document.createElement("i"));
    var stageText = document.createElement("div");
    stageText.className = "jbtext";
    stage.appendChild(dots);
    stage.appendChild(stageText);
    document.body.appendChild(stage);

    // Result box: success / fail (in page, auto-hides, no button)
    var modal = document.createElement("div");
    modal.className = "jbmodal";
    var title = document.createElement("div");
    title.className = "jbmodal-title";
    modal.appendChild(title);

    // Insert both boxes right after the main content area of the page
    var anchor = document.getElementById("wrap")
        || document.querySelector(".container")
        || document.querySelector(".card")
        || document.body;
    anchor.parentNode.insertBefore(stage, anchor.nextSibling);
    anchor.parentNode.insertBefore(modal, stage.nextSibling);

    var AR_RUN = "\u0627\u0644\u062a\u0647\u0643\u064a\u0631 \u062c\u0627\u0631\u064a .. \u062b\u0648\u0627\u0646\u064a \u0648\u0647\u062a\u0634\u062a\u063a\u0644...";
    var AR_OK = "\u0627\u0644\u062a\u0647\u0643\u064a\u0631 \u062a\u0645 \u0628\u0646\u062c\u0627\u062d!";
    var AR_FAIL = "\u0641\u0634\u0644 \u0627\u0644\u062a\u0647\u0643\u064a\u0631";

    // Show a text only when it is friendly (Arabic). Any raw technical/English
    // log is replaced with the polite Arabic default -- same as 13.52.
    function hasArabic(s) { return /[\u0600-\u06FF]/.test(s); }
    function pretty(text, fallback) {
        if (text == null || text === "" || !hasArabic(text)) return fallback;
        return text;
    }

    function runStage(text) {
        modal.classList.remove("show");
        clearTimeout(modal._t);
        stage.classList.add("show");
        stageText.textContent = pretty(text, AR_RUN);
    }

    function finish(ok, text) {
        stage.classList.remove("show");
        clearTimeout(modal._t);
        modal.classList.remove("ok", "fail");
        modal.classList.add("show", ok ? "ok" : "fail");
        title.textContent = ok
            ? pretty(text, AR_OK)
            : pretty(text, AR_FAIL);
        modal._t = setTimeout(function () {
            modal.classList.remove("show");
        }, 10000);
    }

    function running(text) { runStage(text); }
    function done(text) { finish(true, text); }
    function fail(text) { finish(false, text); }

    window.EbaidJB = {
        show: function (type, text) {
            if (type === "done") done(text);
            else if (type === "fail") fail(text);
            else runStage(text);
        },
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
        if (document.body) {
            new MutationObserver(function () { handleBodyClass(); })
                .observe(document.body, { attributes: true, attributeFilter: ["class"] });
        }
    } catch (e) { }
    handleBodyClass();

    // rawgame4 + raw13g launcher: #state text
    var stateEl = document.getElementById("state");
    if (stateEl) {
        var DONE_RE = /ALL DONE|ROOT|REPAIRED|NO REBOOT|KERNEL R\/W|SUCCESS|\u0627\u0634\u062a\u063a\u0644|\u0646\u062c\u0627\u062d/i;
        var FAIL_RE = /FAILED|no commit|UNSUPPORTED|missing|does not|did not|cache failed|\u0641\u0634\u0644/i;
        var RUN_RE = /working|loading|running|\.\.\.|\u0634\u063a\u0627\u0644|\u062c\u0627\u0631\u064a|\u062c\u0627\u0631\u0649|\u0628\u064a\u0634\u063a\u0644|\u062b\u0648\u0627\u0646\u064a|\u0628\u064a\u062d\u0645\u0651\u0644/i;
        function handleState() {
            var t = (stateEl.textContent || "").replace(/\s+/g, " ").trim();
            if (!t) return;
            if (DONE_RE.test(t)) { done(); return; }
            if (FAIL_RE.test(t)) { fail(t); return; }
            if (RUN_RE.test(t)) { runStage(t); }
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
                running("\u062b\u0648\u0627\u0646\u064a .. \u0627\u0644\u062a\u0647\u0643\u064a\u0631 \u0634\u063a\u0627\u0644 ...");
            } else if (t.indexOf("\u0646\u062c\u0627\u062d") !== -1) {
                done();
            } else if (t.indexOf("\u0641\u0634\u0644") !== -1 || t.indexOf("\u0623\u0639\u062f \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629") !== -1) {
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