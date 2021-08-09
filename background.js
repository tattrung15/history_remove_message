(() => {
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function (e) {
      let s = 1;
      for (var t = 0; t < e.requestHeaders.length; ++t)
        "Origin" === e.requestHeaders[t].name &&
          (e.requestHeaders[t].value = "https://www.facebook.com"),
          "referer" === e.requestHeaders[t].name &&
            ((s = 0), (e.requestHeaders[t].value = "https://www.facebook.com"));
      return (
        s &&
          e.requestHeaders.push({
            name: "referer",
            value: "https://www.facebook.com",
          }),
        { requestHeaders: e.requestHeaders }
      );
    },
    { urls: ["*://*.facebook.com/*"] },
    ["blocking", "requestHeaders", "extraHeaders"]
  );
  chrome.runtime.onInstalled.addListener(function (e) {
    if ("install" == e.reason) {
      let e = new Date().getTime();
      chrome.storage.sync.set({ install: e });
    }
  }),
    chrome.storage.local.get(["s1", "s2", "s3"], function (e) {
      void 0 === e.s1 &&
        (chrome.storage.local.set({ s1: {} }),
        chrome.storage.local.set({ s2: {} }),
        chrome.storage.local.set({ s3: [] }));
    }),
    chrome.runtime.onMessageExternal.addListener(function (e, s, t) {
      "gd" == e.m
        ? chrome.storage.local.get(["s1", "s2", "s3"], function (e) {
            void 0 === e.s1
              ? (chrome.storage.local.set({ s1: {} }),
                chrome.storage.local.set({ s2: {} }),
                chrome.storage.local.set({ s3: [] }))
              : t({ s1: e.s1, s2: e.s2, s3: e.s3 });
          })
        : "save_d" == e.m &&
          (chrome.storage.local.set({ s1: e.s1 }),
          chrome.storage.local.set({ s2: e.s2 }),
          chrome.storage.local.set({ s3: e.s3 }));
    });
})();
