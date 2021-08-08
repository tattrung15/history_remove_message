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
  let e,
    s,
    t = "|1|";
  function o() {
    chrome.storage.local.get(["t_mess"], async (s) => {
      if (void 0 !== s.t_mess) {
        let { t_mess: a } = s;
        for (let s = 0; s < a.length; s++) {
          const r = a[s],
            n = new Date();
          if ("unsend" == r.state && n.valueOf() > r.d) {
            var t = new FormData();
            t.append(`ids[${r.uid}]`, r.uid),
              t.append("body", r.m),
              t.append("fb_dtsg", e);
            var o = new XMLHttpRequest();
            o.open(
              "POST",
              "https://m.facebook.com/messages/send/?icm=1&refid=12&ref=dbl",
              !0
            ),
              o.send(t),
              (a[s].state = "ok"),
              chrome.storage.local.set({ t_mess: a });
          }
        }
      }
    });
  }
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
    chrome.storage.local.get(["t_mess"], function (e) {
      void 0 === e.t_mess && chrome.storage.local.set({ t_mess: [] });
    }),
    chrome.storage.local.get(["p"], function (e) {
      void 0 === e.p && chrome.storage.local.set({ p: !1 });
    }),
    o(),
    setInterval(() => {
      o();
    }, 6e4),
    chrome.management.getSelf((e) => {
      console.log(e), e.installType;
    }),
    chrome.runtime.onMessageExternal.addListener(function (e, s, t) {
      console.log(e);
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
