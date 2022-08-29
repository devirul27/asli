!function () {
    function e() {
        if (!document.getElementById("browser-night-mode-overlay-9824356713")) {
            var e = "position: absolute; position:fixed; top:0; left: 0; 	width: 100%;	height: 100%;	z-index: 20000000;	background-color: #000;	opacity: 0.6;	pointer-events: none;", t = document.body;
            t.style.position = "relative";
            var o = document.createElement("div");
            o.setAttribute("id", "browser-night-mode-overlay-9824356713"), o.setAttribute("style", e), t.appendChild(o)
        }
    }

    window.toggleNightMode = function () {
        if (t = !t, AppsgeyserJSInterface.setItem("blackedOutActive", t ? "true" : "false"), 0 == t) {
            var o = document.getElementById("browser-night-mode-overlay-9824356713");
            o && o.parentNode.removeChild(o)
        } else e()
    };
    var t = "true" == AppsgeyserJSInterface.getItem("blackedOutActive");
    null == t && (t = !1, AppsgeyserJSInterface.setItem("blackedOutActive", t ? "true" : "false")), 0 != t && e()
}();