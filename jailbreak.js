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

    // Result overlay: success / fail popup (standalone, themed)
    var modal = document.createElement("div");
    modal.className = "jbmodal";
    var card = document.createElement("div");
    card.className = "jbmodal-card";
    var title = document.createElement("div");
    title.className = "jbmodal-title";
    var closeBtn = document.createElement("button");
    closeBtn.className = "jbclose";
    closeBtn.textContent = "\u0625\u063a\u0644\u0627\u0642";
    closeBtn.addEventListener("click", function () {
        modal.classList.remove("show");
    }, false);
    card.appendChild(title);
    card.appendChild(closeBtn);
    modal.appendChild(card);
    document.body.appendChild(modal);

    function runStage(text) {
        modal.classList.remove("show");
        stage.classList.add("show");
        stageText.textContent = text || "\u0627\u0644\u062c\u0647\u0627\u0632 \u0628\u064a\u062d\u0645\u0651\u0644 \u0627\u0644\u0627\u0633\u062a\u063a\u0644\u0627\u0644...";
    }

    function finish(ok, text) {
        stage.classList.remove("show");
        modal.classList.remove("ok", "fail");
        modal.classList.add("show", ok ? "ok" : "fail");
        title.textContent = text || (ok
            ? "\u0627\u0644\u062a\u0647\u0643\u064a\u0631 \u062a\u0645 \u0628\u0646\u062c\u0627\u062d!"
            : "\u0641\u0634\u0644 \u0627\u0644\u062a\u0647\u0643\u064a\u0631");
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