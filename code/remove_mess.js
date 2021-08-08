(() => {
  "use strict";
  $(document).ready(async () => {
    await chrome.storage.local.get(["s3"], async function (t) {
      if (void 0 !== t.s3) {
        let e = t.s3;
        (e = e.reverse()),
          await e.forEach((t) => {
            $("#vcc").append(
              `\n<tr>\n
                  <td class="col-name">${t.d.f.n1}</td>\n
                  <td class="col-message">${t.d.m.m}</td>\n
                  <td class="col-attachment">${
                    "n" == t.d.m.u
                      ? "Không có"
                      : `<a target="_blank" href="${t.d.m.u}"
                        >
                        Attachment
                      </a>`
                  }</td>\n
                  <td class="col-type">${t.t == "g" ? "Group" : "P2P"}</td>\n
                  <td class="col-time">${t.d.m.ti}</td>\n
                  </tr>\n
                `
            );
          });
      }
    });
  }),
    (document.getElementById("btn-del-history").onclick = async () => {
      await chrome.storage.local.clear(), window.location.reload();
    });
})();
