(() => {
  chrome.runtime.onInstalled.addListener(function (e) {
    if ("install" == e.reason) {
      let e = new Date().getTime();
      chrome.storage.sync.set({ install: e });
    }
  });
  chrome.storage.local.get(["messages"], function (e) {
    if (!e.messages || (Array.isArray(e.messages) && !e.messages.length)) {
      chrome.storage.local.set({ messages: [] });
    }
  });
  chrome.runtime.onMessageExternal.addListener(function (data, s, callback) {
    if (data.type === "save") {
      chrome.storage.local.get("messages", function (e) {
        const newMessages = e.messages.length
          ? [...e.messages, data.message]
          : [data.message];
        chrome.storage.local.set({ messages: newMessages });
      });
    }
  });
})();
