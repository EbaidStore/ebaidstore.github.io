(function () {
    "use strict";
    if (!document.body || document.getElementById("e2skin-theme")) return;

    var segs = (location.pathname || "/").split("/").filter(function (s) { return s.length > 0; });
    var depth = segs.length - 1;
    var pre = "";
    for (var i = 0; i < depth; i++) pre += "../";

    var themeUrl = pre + "theme.css";
    var logoUrl = pre + "logo.png";
    var bgUrl = pre + "pggg.jpg";
    var homeUrl = pre + "index.html";

    /* 1) strip every legacy <style> block so only ONE theme drives the look */
    var styles = document.querySelectorAll("style");
    for (var j = 0; j < styles.length; j++) {
        var st = styles[j];
        if (st.id === "e2skin-ovr") continue;
        if (st.parentNode) st.parentNode.removeChild(st);
    }

    /* 2) inject unified stylesheet */
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = themeUrl;
    link.id = "e2skin-theme";
    (document.head || document.documentElement).appendChild(link);

    /* 3) unified background (pggg) — sharp contain; blur sides come from body::before */
    var bgCss =
        "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;" +
        "background-color:transparent;background-image:url('" + bgUrl + "');" +
        "background-position:center center;background-repeat:no-repeat;background-size:contain;";
    var bgDiv = document.querySelector("div.bg") || document.getElementById("e2skin-bg");
    if (bgDiv) {
        bgDiv.style.cssText = bgCss;
    } else {
        var bg = document.createElement("div");
        bg.id = "e2skin-bg";
        bg.style.cssText = bgCss;
        document.body.insertBefore(bg, document.body.firstChild);
    }

    /* 4) ONE standard brand bar everywhere (replaces any existing one) */
    var oldBar = document.querySelector(".brand-bar") || document.getElementById("e2skin-bar");
    var sub = "";
    if (oldBar) {
        var oldSub = oldBar.querySelector(".brand-sub");
        if (oldSub) sub = oldSub.textContent || "";
        if (oldBar.parentNode) oldBar.parentNode.removeChild(oldBar);
    }
    if (!sub) {
        sub = (document.title || "Ebaid Store").replace(/^Ebaid Store\s*(-|\|)\s*/, "").replace(/\s*[-|\|].*$/, "").trim();
        if (!sub) sub = "PS4 Jailbreak";
    }
    var bar = document.createElement("div");
    bar.id = "e2skin-bar";
    bar.className = "brand-bar";
    bar.innerHTML =
        '<div class="brand-left">' +
        '<img class="brand-logo" src="' + logoUrl + '" alt="Ebaid Store">' +
        '<div><div class="brand-title">Ebaid Store</div>' +
        '<div class="brand-sub">' + sub + '</div></div></div>' +
        '<a class="brand-home" href="' + homeUrl + '">&#8592; Home</a>';
    document.body.insertBefore(bar, document.body.firstChild);

    /* 5) comprehensive harmony overrides (wins over everything) */
    var ovr = document.createElement("style");
    ovr.id = "e2skin-ovr";
    ovr.textContent =
        ":root{" +
        "--primary-color:#05060a;--primary-dark:#000000;--secondary-color:#16224d;--accent-color:#3b82f6;" +
        "--text-color:#f8fafc;--muted-color:#94a3b8;--card-bg:rgba(5,6,10,.85);" +
        "--success-color:#10b981;--fail-color:#ef4444;}" +
        "html{background-color:#14082c!important;background-image:none!important;height:100%;overflow:hidden!important;}" +
        "html,body{color:#f8fafc!important;" +
        "font-family:'Segoe UI',system-ui,-apple-system,sans-serif!important;" +
        "margin:0!important;padding:0!important;height:100%!important;}" +
        "body,body.bg{background:transparent!important;position:relative!important;z-index:0;" +
        "display:flex!important;flex-direction:column!important;overflow-x:hidden!important;overflow-y:auto!important;}" +
        "body:before{content:'';position:fixed;top:0;left:0;width:100%;height:100%;" +
        "z-index:-2;pointer-events:none;background-color:#14082c;" +
        "background-image:url('" + bgUrl + "')!important;background-position:center center!important;" +
        "background-repeat:no-repeat!important;background-size:100% 100%!important;}" +
        ".container{flex:1 1 auto!important;min-height:0!important;height:auto!important;overflow:auto;margin-bottom:0;}" +
        "div.bg,#e2skin-bg{position:fixed!important;top:0;left:0;width:100%;height:100%;" +
        "z-index:-1;pointer-events:none;" +
        "background-color:transparent!important;background-image:none!important;}" +
        ".brand-bar,#e2skin-bar{background:#000!important;}" +
        ".card,header,.main-container .header,.footer{background:#000!important;}" +
        "#state,#cache,#det,#msg{background:#000!important;}" +
        "table#load,table#tool{background:#000!important;}" +
        "tr,td,th{background:#000!important;}" +
        "h1,h2,h3,h4{line-height:1.3;font-weight:700;margin:0 0 12px;}" +
        "a{color:#3b82f6;text-decoration:none;}" +
        "table{border-collapse:collapse;}" +
        "hr{border:0;border-top:1px solid rgba(255,255,255,.12);}" +
        "marquee{color:#f59e0b;font-size:1rem;}" +
        "header{text-align:center;margin:0 auto 24px;max-width:920px;}" +
        /* headings */
        ".titlehead{display:block;box-sizing:border-box;width:min(94%,720px)!important;" +
        "margin:4px auto 22px!important;text-align:center;padding:18px 22px;" +
        "font-size:1.5rem;font-weight:800;letter-spacing:.5px;color:#fff;" +
        "background:linear-gradient(135deg,#1e3a8a,#2563eb);" +
        "border:1px solid rgba(59,130,246,.35);border-radius:14px;" +
        "box-shadow:0 4px 15px rgba(0,0,0,.35);}" +
        /* 9nw header */
        ".main-container{max-width:1100px;margin:0 auto;padding:28px 20px;}" +
        ".main-container .header{text-align:center;margin:0 0 26px;}" +
        ".logo{font-size:2.1rem;font-weight:800;background:linear-gradient(135deg,#fff,#60a5fa,#3b82f6);" +
        "-webkit-background-clip:text;background-clip:text;color:transparent;}" +
        ".subtitle{color:#94a3b8;}" +
        /* stats */
        ".stats{display:flex;justify-content:center;gap:15px;margin:4px 0 22px;flex-wrap:wrap;}" +
        ".stat-box{padding:8px 18px;border-radius:8px;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,.25);}" +
        ".stat-box.success,.success{background-color:#10b981;color:#fff;}" +
        ".stat-box.fail,.fail{background-color:#ef4444;color:#fff;}" +
        /* progress bars: modern + legacy */
        ".progress-container{width:min(94%,520px);margin:6px auto 26px;background:#000;" +
        "border:1px solid #111827;border-radius:12px;height:26px;overflow:hidden;" +
        "box-shadow:inset 0 2px 8px rgba(0,0,0,.6);position:relative;}" +
        ".progress-container .progress-bar,.progress-container #myBar{display:flex;align-items:center;" +
        "justify-content:center;height:100%;width:0;background:linear-gradient(90deg,#10b981,#34d399);" +
        "color:#fff;text-align:center;font-weight:800;font-size:14px;line-height:1;transition:width .2s;}" +
        "#myProgress{position:static!important;display:block;width:min(94%,520px);" +
        "margin:6px auto 26px!important;height:26px;background:#000;border:1px solid #111827;" +
        "border-radius:12px;overflow:hidden;box-shadow:inset 0 2px 8px rgba(0,0,0,.6);}" +
        "#myProgress #myBar{display:flex;align-items:center;justify-content:center;height:100%;width:0;" +
        "background:linear-gradient(90deg,#10b981,#34d399);color:#fff;text-align:center;" +
        "font-weight:800;font-size:14px;line-height:1;transition:width .2s;padding:0!important;}" +
        /* toggle advanced */
        ".toggle-advanced{display:block;margin:22px auto;background:rgba(59,130,246,.15);color:#dbeafe;" +
        "border:1px solid rgba(59,130,246,.4);padding:11px 24px;border-radius:10px;cursor:pointer;" +
        "font-weight:700;font-family:inherit;font-size:1rem;}" +
        ".toggle-advanced:hover{background:rgba(59,130,246,.3);}" +
        ".advanced-section{margin-top:32px;border-top:1px solid rgba(255,255,255,.1);padding-top:22px;}" +
        ".advanced-buttons{display:none;margin-top:16px;}" +
        /* fan control */
        ".fan-control{display:flex;align-items:stretch;justify-content:center;}" +
        ".fan-button{border-radius:12px 0 0 12px!important;}" +
        ".fan-select{background:#111827!important;color:#fff!important;border:1px solid #3b82f6;" +
        "border-left:none;border-radius:0 12px 12px 0;padding:0 14px;height:auto;appearance:none;" +
        "-webkit-appearance:none;font-size:.95rem;font-family:inherit;}" +
        /* hidden helper elements */
        ".hidden-elements{opacity:0;position:absolute;pointer-events:none;width:1px;height:1px;overflow:hidden;}" +
        /* legacy toggles */
        ".switch{position:relative;display:inline-block;width:56px;height:30px;vertical-align:middle;}" +
        ".switch input{opacity:0;width:0;height:0;}" +
        ".slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;" +
        "background-color:#1f2937;transition:.3s;border-radius:34px;}" +
        ".slider:before{position:absolute;content:'';height:22px;width:22px;left:4px;bottom:4px;" +
        "background-color:#fff;transition:.3s;border-radius:50%;}" +
        ".slider.new{background-color:#1f2937;}" +
        "input:checked + .slider{background-color:#2563eb;}" +
        "input:checked + .slider:before{transform:translateX(26px);}" +
        "input:focus + .slider{box-shadow:0 0 1px #2563eb;}" +
        ".slider.round{border-radius:34px;}" +
        /* dynamic legacy table output -> buttons look like the unified grid */
        "table#load,table#tool{width:min(94%,920px)!important;margin:16px auto!important;border:none;}" +
        "table#load td,table#load th,table#tool td,table#tool th,td,th{padding:7px 6px;text-align:center;" +
        "color:#e2e8f0!important;font-family:inherit!important;font-size:1rem!important;line-height:1.5;width:auto!important;}" +
        "tr,td,th{background:#000!important;}" +
        "table#load a.button,table#tool a.button,table a.button{display:inline-block!important;" +
        "flex-direction:row!important;width:auto!important;min-height:0!important;" +
        "padding:.9em 1.4em!important;margin:4px 5px;vertical-align:middle;font-weight:700;}" +
        "table a.button:hover{transform:translateY(-2px);}" +
        /* section & grids come from theme.css */
        "@media (max-width:600px){.titlehead{font-size:1.3rem;}.progress-container,#myProgress{width:92%;}}";
    document.head.appendChild(ovr);
})();