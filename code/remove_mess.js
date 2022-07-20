(() => {
  "use strict";
  $(document).ready(async () => {
    await chrome.storage.local.get("messages", async function (data) {
      if (data.messages) {
        let messages = data.messages;
        messages = messages.reverse();
        await messages.forEach((msg) => {
          let attachments = "Không có";

          if (msg.attachments.length) {
            attachments = "";
            msg.attachments.forEach((item) => {
              attachments += `<a target="_blank" href="${item}">
                                  Attachment
                                </a></br>`;
            });
          }

          $("#vcc").append(
            `\n<tr>\n
                  <td class="col-name">${msg.display_name}</td>\n
                  <td class="col-message">${msg.content}</td>\n
                  <td class="col-attachment">${attachments}</td>\n 
                  <td class="col-type">${msg.type}</td>\n
                  <td class="col-time">${msg.time}</td>\n
                  </tr>\n
                `
          );
        });
      }
    });

    $("#btn-del-history").click(async () => {
      await chrome.storage.local.set({ messages: [] });
      window.location.reload();
    });
  });
})();
