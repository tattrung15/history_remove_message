var s = document.createElement("script");
(s.src = chrome.extension.getURL("./injectws.js")),
  (s.onload = function () {
    this.parentNode.removeChild(this);
  });
let doc = document.body || document.documentElement;
doc.appendChild(s);