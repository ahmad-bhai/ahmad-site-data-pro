// api/qx.js (Vercel Serverless Function)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id, url, dash, win } = req.query;
    res.setHeader('Content-Type', 'text/html');

    if (!id) {
        return res.status(200).send("id required");
    }

    // 🔗 Ahmad Bhai ka naya API URL jo sirf ek user ka JSON layega
    const authAPI = "https://ahmad-site-data.vercel.app/q?id=";
    const baseURL = "https://ahmad-site-data-pro.vercel.app/";

    try {
        // Poora database uthane ki jagah, ab direct nayi API ko call jayegi
        const authRes = await fetch(authAPI + id);
        const userData = await authRes.json();

        // Agar user ka data nahi mila ya authorized false hai, toh Lock Screen dikhao
        if (!userData || userData.authorized !== true) {
            return res.status(200).send(getLockScreenHTML(id));
        }

        let targetFile = null;
        let routeKey = null;
        const targetUrl = url ? url.toLowerCase() : "";

        // User-Agent detection for Device Mode
const userAgent = (req.headers["user-agent"] || "").toLowerCase();
const isMobile = /android|iphone|ipad|ipod|blackberry|bb10|playbook|iemobile|windows phone|opera mini|mobile|tablet|silk|kindle|phone/i.test(userAgent);

        // ─── UPGRADED ROUTING LOGIC ──────────────────────────────────────────
        
        // Priority 1: Dashboard Dashboard Toggle
        if (dash === 'true') {
            targetFile = "LB.html";
            routeKey = "lb";
        } 
// Mobile: trade list detect hui to win page
if (isMobile && win === "true") {
    targetFile = "win.html";
    routeKey = "win";
}

// Normal trading page
else if (targetUrl.includes("demo-trade")) {
    targetFile = isMobile ? "mobile.html" : "mobile.html";
    routeKey = isMobile ? "android" : "pc";
}
        
        // Priority 4: Financial pages and stats
        else if (targetUrl.includes("withdrawal")) {
            targetFile = "p.html";
            routeKey = "p";
        } 
        else if (targetUrl.includes("balance")) {
            targetFile = "t.html";
            routeKey = "t";
        } 
        else if (targetUrl.includes("analytics")) {
            targetFile = "ana.html";
            routeKey = "ana";
        }
        // Fallback for desktop defaults if directly loading generic trading components
        else if (!isMobile) {
            targetFile = "mobile.html";
            routeKey = "pc";
        }

        // Check Permissions from the Full JSON
        if (userData.permissions && userData.permissions[routeKey] === false) {
            return res.status(200).send(getLockScreenHTML(id));
        }

        if (!targetFile) {
            return res.status(200).send(getErrorPopupHTML());
        }

        const fileRes = await fetch(baseURL + targetFile);
        if (!fileRes.ok) throw new Error("File not found on script server");
        
        const htmlContent = await fileRes.text();
        return res.status(200).send(htmlContent);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

// ─── AHMED PREMIUM LOCK SCREEN (NO-DIALOG OVERLAY FIX) ───────────────────
function getLockScreenHTML(id) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Not Found</title>
</head>
<body>
<script id="js">
(function(){

var dialogs = document.querySelectorAll("dialog");
if (dialogs.length) {
    dialogs.forEach(dia => dia.remove());
}

var color = "#1c242a";

var html = \`<div style="font-family: sans-serif;padding:1rem;background:\${color};width:\${screen.width>500?100+"%":(screen.width-40)+"px"};border-top: 5px solid #05c55e" class="dia">

<div style="text-align:center">      
<div style="line-height:50px;font-size:30px;color:#fff; font-weight:900">LOCKED</div>      <svg version="1.0" xmlns="http://www.w3.org/2000/svg"      
width="50pt" height="50pt" viewBox="0 0 180.000000 180.000000"      
preserveAspectRatio="xMidYMid meet" style="display:inline-block;text-align:center">

<g transform="translate(0.000000,180.000000) scale(0.100000,-0.100000)"      
fill="#fff" stroke="none">
<path d="M753 1622 l-133 -77 0 -67 0 -67 87 50 c49 28 96 55 105 60 17 9 18      
-23 18 -626 l0 -636 -50 28 -50 28 0 443 0 442 -55 0 -55 0 0 -405 c0 -223 -3      
-405 -7 -405 -5 0 -27 10 -50 22 l-43 23 0 308 0 308 -57 -3 -58 -3 -5 -267      
-5 -267 -40 22 -40 23 0 339 0 339 103 59 102 59 0 64 c0 35 -3 64 -6 64 -4 0      
-78 -41 -165 -92 l-159 -92 0 -401 0 -401 342 -198 c189 -110 348 -199 353      
-199 6 0 164 89 353 199 l342 199 0 400 0 400 -159 93 c-87 50 -161 92 -165      
92 -3 0 -6 -29 -6 -64 l0 -63 103 -60 102 -59 0 -339 0 -340 -42 -23 -43 -23      
0 270 0 271 -60 0 -60 0 0 -307 0 -308 -40 -22 c-21 -13 -41 -23 -44 -23 -4 0      
-6 182 -6 405 l0 405 -60 0 -60 0 0 -443 0 -442 -46 -28 c-26 -15 -48 -26 -50      
-24 -2 2 -3 288 -2 635 l3 632 103 -60 c57 -33 105 -60 108 -60 2 0 4 29 4 65      
l0 64 -92 54 c-51 30 -113 66 -138 80 l-45 26 -132 -77z"/>
</g>
</svg>

</div>      <br>      <div style="text-align:center;color:#fff;font-family:monospace" id="id">${id}</div>      <br>      <div style="text-align: center;">      
<button style="padding:10px 20px;background:#05c55e;color:#fff;border:none;box-shadow:none;cursor:pointer;">      
CLOSE      
</button>      
</div>      <br>      <div style="color:#ff6251;font-size:12px;text-align:center">📝 CONTACT TO UNLOCK !!! 🔓</div>      <hr style="border-color:#fff">      <div style="text-align:center;font-weight:100;color:#fff">      
Made with <span style="animation: heartbeat 1.4s infinite;">♥</span> by       
<a style="color:#fff" href="https://t.me/Magic_Scripts" target="_blank">@Magic_Scripts</a>      
</div>      </div>\`;

var myDialog = document.createElement("dialog");
document.body.appendChild(myDialog);
myDialog.innerHTML = html;

var styleElem = document.head.appendChild(document.createElement("style"));
styleElem.innerHTML = \`
@keyframes heartbeat {
    0%{color:#ffb3b3}
    35%{color:#ff1a1a}
    100%{color:#ffb3b3}
}

dialog::backdrop {
    background:#05c55e;
    opacity:.25
}

::selection {
    background:white;
    color:\${color}
}
\`;

myDialog.showModal();

myDialog.querySelector("button").addEventListener("click", () => {
    myDialog.close();
});

})();
</script>
</body>
</html>`;
}
// ─── ERROR POPUP DESIGN (Classic Center Style + Auto Animation) ────────────────
function getErrorPopupHTML() {
    return `
    <div id="ahmadErrorPopup">⚠️ APPLY ON CORRECT URL ⚠️</div>
    
    <style>
        #ahmadErrorPopup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.92);
            color: white;
            padding: 18px 28px;
            border-radius: 10px;
            font-size: 16px;
            font-family: sans-serif;
            z-index: 2147483647; /* Sabse upar dikhne ke liye */
            width: 300px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
            pointer-events: none; /* Iske peeche screen par click ho sakega, freeze nahi hoga */
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            
            /* Smooth smooth entry animation */
            animation: ahmadPopupFadeIn 0.25s ease-out;
        }

        @keyframes ahmadPopupFadeIn {
            from { transform: translate(-50%, -45%); opacity: 0; }
            to { transform: translate(-50%, -50%); opacity: 1; }
        }
    </style>
    `;
  }
