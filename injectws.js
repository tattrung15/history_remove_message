const EID = "fbklmeldlhkpihbogbnmmkkjgdkhlicf";

(() => {
  function e(e) {
    return void 0 !== e;
  }
  !(async function () {
    var t = {},
      a = {},
      s = [];
    await chrome.runtime.sendMessage(EID, { m: "gd" }, (e) => {
      (t = e.s1), (a = e.s2), (s = e.s3);
    });
    var i = window.WebSocket,
      n = i.apply.bind(i),
      o = i.prototype.addEventListener;
    (o = o.call.bind(o)),
      (window.WebSocket = function c(m, r) {
        var l;
        return (
          (l =
            this instanceof c
              ? 1 === arguments.length
                ? new i(m)
                : arguments.length >= 2
                ? new i(m, r)
                : new i()
              : n(this, arguments)),
          o(l, "message", async function (i) {
            let n = new TextDecoder("utf-8").decode(i.data),
              o = /(?<=\\")(.*?)(?=\\",false,false)/,
              c = n.match(o);
            o = /(?<=,\\"mid)(.*?)(?=\\",\\")/;
            let m = o.exec(n);
            if (null != m && n.length < 1e4 && ("3" == n[0] || "1" == n[0])) {
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
                });
              let i = new Date();
              if (
                ((i = i.today() + " " + i.timeNow()),
                (m = "mid" + m[0]),
                3 != m.length)
              ) {
                if (null != c) {
                  (c = c[0]), (c = String(c.substr(c.lastIndexOf('"') + 1)));
                  try {
                    c = JSON.parse(`"${JSON.parse(`"${c}"`)}"`);
                  } catch (e) {
                    c = "";
                  }
                }
                if (void 0 !== t[m]) {
                  let o,
                    c = /(?<=",\[)(.*?)(?=,undefined,false,)/gm,
                    r = "p2p",
                    l = n.match(c)[0].substr(n.match(c)[0].lastIndexOf("["));
                  e(a[l]) && (o = a[l]),
                    (c = /(?<=LS\.sp\(\\"144\\",)(.*?)(?=LS\.sp\(\\"90\\")/gm);
                  let d = n.match(c)[0],
                    p = new RegExp(
                      String(l).replace("[", "\\[").replace("]", "\\]"),
                      "gm"
                    );
                  1 == (d.match(p) || []).length && (r = "g"),
                    await s.push({ t: r, id: m, d: { m: t[m], f: o } }),
                    await chrome.runtime.sendMessage(EID, {
                      m: "save_d",
                      s1: t,
                      s2: a,
                      s3: s,
                      d: i,
                    });
                } else {
                  let e = /(?<=https:)(.*?)(?=\\",)/gm;
                  if (null != n.match(e)) {
                    let a = "https:" + n.match(e)[0];
                    (a = JSON.parse(`"${JSON.parse(`"${a}"`)}"`)),
                      (t[m] = { ti: i, m: c, t: "a", u: a, id: m });
                  } else t[m] = { ti: i, m: c, t: "t", u: "n", id: m };
                  await chrome.runtime.sendMessage(EID, {
                    m: "save_d",
                    s1: t,
                    s2: a,
                    s3: s,
                    d: i,
                  });
                }
              }
            }
            if ("1" == n[0]) {
              let e = /(?<=\(LS.sp\(\\"25\\")(.*?)(?=:LS.resolve)/gm,
                i = n.match(e);
              null != i &&
                (await i.forEach(async (t) => {
                  let s = t;
                  (e = /(?<=https)(.*?)(?=\\",)/gm),
                    (s = "https" + s.match(e)[1]);
                  let i = JSON.parse(`"${JSON.parse(`"${s}"`)}"`);
                  e = /(?<=, )(.*?)(?=,\[0,1\],)/gm;
                  let n = t.match(e)[0].replace("\n", "").replace(" ", "");
                  if (
                    ((e = /(?<=\],\\").*?(?=\\",\\")/gm),
                    3 == t.match(e).length)
                  ) {
                    let s = t.match(e).slice(-1)[0];
                    (s = JSON.parse(`"${JSON.parse(`"${s}"`)}"`)),
                      (a[n] = { n1: s, i, id: n });
                  }
                }),
                await chrome.runtime.sendMessage(
                  "fbklmeldlhkpihbogbnmmkkjgdkhlicf",
                  { m: "save_d", s1: t, s2: a, s3: s, d }
                ));
            }
          }),
          l
        );
      }.bind()),
      (window.WebSocket.prototype = i.prototype),
      (window.WebSocket.prototype.constructor = window.WebSocket);
    var c = i.prototype.send;
    (c = c.apply.bind(c)),
      (i.prototype.send = function (e) {
        return c(this, arguments);
      });
  })();
})();
