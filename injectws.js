const EID = "lccgnegkeomhacmbcjahfomepjjdpfkg";

(() => {
  e = (t) => {
    let e = t,
      i = 10;
    for (; --i > 0; )
      try {
        e = '"' === e[0] ? JSON.parse(e) : JSON.parse(`"${e}"`);
      } catch (t) {
        break;
      }
    return e;
  };
  (Date.prototype.today = function () {
    return (
      (this.getDate() < 10 ? "0" : "") +
      this.getDate() +
      "/" +
      (this.getMonth() + 1 < 10 ? "0" : "") +
      (this.getMonth() + 1) +
      "/" +
      this.getFullYear()
    );
  }),
    (Date.prototype.timeNow = function () {
      return (
        (this.getHours() < 10 ? "0" : "") +
        this.getHours() +
        ":" +
        (this.getMinutes() < 10 ? "0" : "") +
        this.getMinutes() +
        ":" +
        (this.getSeconds() < 10 ? "0" : "") +
        this.getSeconds()
      );
    }),
    (async function () {
      let i = {};
      var n = {},
        o = [];
      function a() {
        return new Promise(async (e) => {
          await chrome.runtime.sendMessage(EID, { m: "gd" }, (t) => {
            (i = t.s1), (n = t.s2), (o = t.s3), e();
          });
        });
      }
      function r() {
        return new Promise(async (e) => {
          await chrome.runtime.sendMessage(
            EID,
            { m: "save_d", s1: i, s2: n, s3: o },
            () => {
              e();
            }
          );
        });
      }
      function s(t) {
        for (const e of t) {
          let t = /(?<=\?entity_id=)(.*?)(?=&entity_type)/gm,
            i = e.match(t)[1],
            o =
              "https://graph.facebook.com/" +
              i +
              "/picture?type=large&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662",
            a = /(?<=, )(.*?)(?=,\[0,1\],)/gm,
            r = e.match(a)[0].replace("\n", "").replace(" ", ""),
            s = /(?<=\],\\").*?(?=\\",\\")/gm;
          if (3 == e.match(s).length) {
            let t = e.match(s).slice(-1)[0];
            (t = JSON.parse(`"${JSON.parse(`"${t}"`)}"`)),
              (n[r] = { n1: t, i: o, id: r, uid: i });
          }
        }
      }
      function c(t, e) {
        let i,
          o = t.indexOf("594"),
          a = (function (t, e, i) {
            var n = t.length;
            if (0 == n) return [];
            for (var o, a = 0; (o = e.indexOf(t, a)) > -1; ) {
              if (o > i) return o;
              a = o + n;
            }
            return -1;
          })(e, t, o),
          r = t.substring(o, a),
          s = /(?<=\[)(.*?)(?=\])/g,
          c = r.match(s) || [],
          f = "g";
        for (const t of c) {
          let e = `[${t}]`;
          if (void 0 !== n[e]) {
            (f = "p2p"), (i = n[e]);
            break;
          }
        }
        if ("g" == f) {
          (a = o),
            (o = t.indexOf("144")),
            (r = t.substring(o, a)),
            (c = r.match(s) || []);
          for (const t of c) {
            let e = `[${t}]`;
            if (void 0 !== n[e]) {
              (f = "g"), (i = n[e]);
              break;
            }
          }
        }
        return [i, f];
      }
      await a();
      var f = window.WebSocket,
        d = f.apply.bind(f),
        u = f.prototype.addEventListener;
      (u = u.call.bind(u)),
        (window.WebSocket = function t(n, h) {
          var m;
          return (
            (m =
              this instanceof t
                ? 1 === arguments.length
                  ? new f(n)
                  : arguments.length >= 2
                  ? new f(n, h)
                  : new f()
                : d(this, arguments)),
            u(m, "message", async function (t) {
              let n = new TextDecoder("utf-8").decode(t.data);
              if ("1" == n[0] || "2" == n[0] || "3" == n[0]) {
                if (!n.match(/(?=mid\.\$)(.*?)(?=\\")/)) {
                  if ("1" == n[0]) {
                    let t = /(?<=\(LS.sp\(\\"25\\")(.*?)(?=:LS.resolve)/gm,
                      e = n.match(t);
                    return void (null != e && (await a(), s(e), await r()));
                  }
                  return;
                }
                const t = /(\\\")(.*?)(\\\")(?=[,)])/g;
                let f = n.match(t) || [];
                f = f.map((t) => e(t));
                const d = (t) => t?.startsWith("mid.$"),
                  u = (t) => t?.startsWith("https://");
                for (let t = 0; t < f.length; t++) {
                  const e = f[t];
                  if (("124" === e || "123" === e) && d(f[t + 2])) {
                    const e = f[t + 1];
                    let n = new Date();
                    const o = n.today() + " " + n.timeNow();
                    e &&
                      (await a(),
                      (i[f[t + 2]] = {
                        ti: o,
                        m: e,
                        t: "t",
                        u: "n",
                        id: f[t + 2],
                      }),
                      await r());
                  }
                  if ("591" === e && u(f[t + 2])) {
                    let e = new Date();
                    const n = e.today() + " " + e.timeNow();
                    for (let e = t; e < f.length - 1; e++)
                      if (d(f[e])) {
                        (i[f[e]] = {
                          ti: n,
                          m: "",
                          t: "a",
                          u: f[t + 2],
                          id: f[e],
                        }),
                          await r();
                        break;
                      }
                  }
                  if (
                    ("144" === e &&
                      d(f[t + 1]) &&
                      ((i[f[t + 1]] = {
                        ti: new Date().today() + " " + new Date().timeNow(),
                        m: "",
                        t: "a",
                        u: f[t + 3],
                        id: f[t + 1],
                      }),
                      await r()),
                    "414" === e && d(f[t + 2]) && u(f[t + 5]))
                  ) {
                    const e = f[t + 5];
                    (i[f[t + 2]] = {
                      ti: new Date().today() + " " + new Date().timeNow(),
                      m: "",
                      t: "a",
                      u: e,
                      id: f[t + 2],
                    }),
                      await r();
                  }
                  if ("594" === e && d(f[t + 1])) {
                    const e = f[t + 1];
                    if (void 0 !== i[e]) {
                      let [a, s] = c(n, f[t + 1]);
                      o.push({ t: s, id: e, d: { m: i[e], f: a } }), await r();
                    }
                  }
                }
              }
            }),
            m
          );
        }.bind()),
        (window.WebSocket.prototype = f.prototype),
        (window.WebSocket.prototype.constructor = window.WebSocket);
      var h = f.prototype.send;
      (h = h.apply.bind(h)),
        (f.prototype.send = function (t) {
          return h(this, arguments);
        });
    })();
})();
