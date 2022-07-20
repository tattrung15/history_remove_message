const injectWsScript = document.createElement("script");
injectWsScript.src = chrome.runtime.getURL("./injectws.js");

injectWsScript.onload = function () {
  this.parentNode.removeChild(this);
};

const doc = document.body || document.head || document.documentElement;
doc.appendChild(injectWsScript);
