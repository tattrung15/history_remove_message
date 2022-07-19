let rvdfm_all_msgs = [];
const users_data = [];

(function () {
  const OriginalWebSocket = window.WebSocket;

  const isMsgIdStr = (str = "") => str.startsWith("mid.$");
  const isLink = (str = "") => str.startsWith("https://");

  const parse = (str = "") => {
    let ret = str;
    let limit = 10;
    while (--limit > 0) {
      try {
        if (ret[0] === '"') ret = JSON.parse(ret);
        else ret = JSON.parse(`"${ret}"`);
      } catch (e) {
        break;
      }
    }
    return ret;
  };

  const storeChat = (chat = []) => {
    chat = chat.map((item) => ({ ...item, time: Date.now() }));
    for (let i = 0; i < chat.length; i++) {
      const isDuplicated =
        -1 !== rvdfm_all_msgs.findIndex((_msg) => chat[i].id === _msg.id);

      if (!isDuplicated) {
        rvdfm_all_msgs = rvdfm_all_msgs.concat(chat);
      }
    }
  };

  window.WebSocket = function fakeConstructor(dt, config) {
    const webSocketInstant = new OriginalWebSocket(dt, config);

    webSocketInstant.addEventListener("message", async function (achunk) {
      const utf8_str = new TextDecoder("utf-8").decode(achunk.data);

      if (utf8_str[0] === "1" || utf8_str[0] === "2" || utf8_str[0] === "3") {
        const haveMsgId = /(?=mid\.\$)(.*?)(?=\\")/.exec(utf8_str);

        // if (!haveMsgId) {
        //   const user_data_zones =
        //     /(?<=\(LS.sp\(\\"deleteThenInsertContact\\")(.*?)(?=:LS.resolve)/gm.exec(
        //       utf8_str
        //     );

        //   if (user_data_zones != null) {
        //     user_data_zones.forEach((zone) => {
        //       const user_id = /(?<=\?entity_id=)(.*?)(?=\&entity_type)/.exec(
        //         zone
        //       );
        //       const avatars = /(?=https)(.*?)(?=\\",)/g.exec(zone);
        //       const small_avatar = parse(avatars[0]);
        //       // const big_avatar = parse(avatars[1]);

        //       // const user_msg_id = /(?<=, )(.*?)(?=,\[0,1\],)/gm.exec(zone);

        //       const regex_display_name = /(?<=\],\\").*?(?=\\",\\")/gm;

        //       const display_name = zone.match(regex_display_name).slice(-1)[0];

        //       const user_info = {
        //         avatar: small_avatar,
        //         user_id: user_id[0],
        //         display_name: parse(display_name),
        //       };

        //       if (
        //         !users_data.find((item) => item.user_id === user_info.user_id)
        //       ) {
        //         users_data.push(user_info);
        //       }
        //     });
        //   }

        //   for (let i = 0; i < all_strings.length; i++) {
        //     const str_i = all_strings[i];

        //     // Thông tin người dùng
        //     if (str_i === "13" && all_strings[i + 1] === "25") {
        //       const small_avatar = all_strings[i + 2];
        //       const large_avatar = all_strings[i + 4];
        //       const user_id = /(?<=\?entity_id=).*?(?=\&entity_type)/.exec(
        //         all_strings[i + 3]
        //       )[0];
        //       const full_user_name = all_strings[i + 6];
        //       const short_user_name = all_strings[i + 8];
        //       const unknown_id = all_strings[i + 9];

        //       // Có những event bắt đầu bằng 13 ,25 nhưng không có user name => loại
        //       if (full_user_name) {
        //         users_data.push({
        //           user_id,
        //           small_avatar,
        //           large_avatar,
        //           full_user_name,
        //           short_user_name,
        //           unknown_id,
        //         });
        //       }
        //     }
        //   }
        // }

        const all_strings_regex = /(\\\")(.*?)(\\\")(?=[,)])/g;
        let all_strings = utf8_str.match(all_strings_regex) || [];
        all_strings = all_strings.map((str) => parse(str));

        if (all_strings.length) {
          // Lấy ra request id: Đây chỉ là mã định danh cho request, tăng dần đều qua từng request...
          const request_id = /(?<=\"request_id\":)(.*?)(?=,)/.exec(utf8_str)[0];

          // console.log("Mọi thông tin: ", {
          //   request_id,
          //   all: all_strings,
          //   utf8_str,
          // });
        } else {
          // Không có thông tin gì thì thoát luôn
          return;
        }

        // Bắt đầu lấy ra những tin nhắn từ lượng thông tin trên
        let chat = [];
        for (let i = 0; i < all_strings.length; i++) {
          const str_i = all_strings[i];

          // Tin nhắn chữ
          if (str_i === "insertMessage" && isMsgIdStr(all_strings[i + 2])) {
            const content = all_strings[i + 1];
            if (content) {
              chat.push({
                type: "Chữ",
                content: content,
                attachments: [],
                id: all_strings[i + 2],
              });
              storeChat(chat);
            }
          }

          // Tin nhắn đính kèm: image / gif / video / âm thanh / file
          if (
            str_i === "insertMessage" &&
            all_strings[i + 4] === "insertBlobAttachment" &&
            isLink(all_strings[i + 6])
          ) {
            const attachmentIndex = [];

            all_strings.forEach((item, index) => {
              if (item === "insertBlobAttachment") {
                attachmentIndex.push(index);
              }
            });

            const attachments = [];
            for (let j = 0; j < attachmentIndex.length; j++) {
              attachments.push(all_strings[attachmentIndex[j] + 2]);
            }
            chat.push({
              type: "Đính kèm",
              content: "",
              attachments,
              id: all_strings[i + 1],
            });
            storeChat(chat);
          }

          // Tin nhắn nhãn dán
          if (str_i === "insertMessage" && isMsgIdStr(all_strings[i + 1])) {
            const attachment = parse(
              /(?=https)(.*?)(?=")/gm.exec(all_strings[i + 9])[0]
            );
            if (attachment) {
              chat.push({
                type: "Nhãn dán",
                content: "",
                attachments: [attachment],
                id: all_strings[i + 1],
              });
              storeChat(chat);
            }
          }

          // Chia sẻ bài viết
          if (
            all_strings[i + 1] === "insertMessage" &&
            isMsgIdStr(all_strings[i + 2]) &&
            all_strings[i + 5] === "insertXmaAttachment"
          ) {
            const data =
              /(?=https)(.*?)(?=")/gm.exec(all_strings[i + 35]) ||
              /(?=https)(.*?)(?=")/gm.exec(all_strings[i + 36]);
            const link = parse(data[0]);
            if (link) {
              chat.push({
                type: "Chia sẻ",
                content: link,
                id: all_strings[i + 2],
              });
              storeChat(chat);
            }
          }

          // Thả react
          // if (str_i === "upsertReaction" && isMsgIdStr(all_strings[i + 1])) {
          //   chat.push({
          //     type: "Thả react",
          //     content: all_strings[i + 2],
          //     id: all_strings[i + 1],
          //   });
          // }

          // Gỡ react
          // if (str_i === "deleteReaction" && isMsgIdStr(all_strings[i + 1])) {
          //   const id = all_strings[i + 1];
          //   const content =
          //     rvdfm_all_msgs.find((c) => c.id === id)?.content || "";

          //   chat.push({
          //     type: "Gỡ react",
          //     content: content,
          //     id: id,
          //   });
          // }

          // Tin nhắn chia sẻ vị trí / vị trí trực tiếp
          // if (
          //   str_i === "xma_live_location_sharing" &&
          //   isMsgIdStr(all_strings[i - 2]) &&
          //   isLink(all_strings[i + 1])
          // ) {
          //   const link = all_strings[i + 1];

          //   chat.push({
          //     type: "Chia sẻ",
          //     content: link,
          //     id: all_strings[i - 2],
          //   });
          //   storeChat(chat);
          // }

          // Thông tin user
          // if (str_i === "533" && isLink(all_strings[i + 1])) {
          //   const avatar = all_strings[i + 1];
          //   const user_name = all_strings[i + 2];

          //   chat.push({
          //     type: "Người dùng",
          //     avatar: avatar,
          //     name: user_name,
          //   });
          // }

          // Tin nhắn đang chờ
          // if (str_i === "130" && all_strings[i + 3] === "pending") {
          //   chat.push({
          //     type: "Tin nhắn đang chờ",
          //     content: all_strings[i + 1],
          //     avatar: all_strings[i + 2],
          //   });
          // }

          // Thu hồi tin nhắn
          if (
            str_i === "deleteThenInsertMessage" &&
            isMsgIdStr(all_strings[i + 2])
          ) {
            const display_name = all_strings[i + 9].slice(
              0,
              all_strings[i + 9].indexOf(" đã thu hồi một tin nhắn")
            );

            const id = all_strings[i + 2];
            const msgs =
              rvdfm_all_msgs.filter(
                (c) => c.id === id && c.type !== "Thu hồi"
              ) || [];

            // chat.push({
            //   type: "Thu hồi",
            //   msgs: msgs,
            //   id,
            //   display_name,
            // });
            // storeChat(chat);
            console.log({
              type: "Thu hồi",
              msgs: msgs,
              id,
              display_name,
            });
          }
        }

        // Chèn thời gian hiện tại vào
        // chat = chat.map((_) => ({ ..._, time: Date.now() }));

        // Lưu vào rvdfm_all_msgs
        // const old_length = rvdfm_all_msgs.length;
        // for (let c of chat) {
        //   let isDuplicated =
        //     -1 !== rvdfm_all_msgs.findIndex((_msg) => c.id === _msg.id);

        //   if (!isDuplicated) {
        //     rvdfm_all_msgs = rvdfm_all_msgs.concat(chat);

        //     // Tin nhắn thu hồi
        //     if (c.type === "Thu hồi") {
        //       const deleted_msg_type = c.msgs
        //         .map((_c) => c.type || "không rõ loại")
        //         .join(",");

        //       // log.text(
        //       //   `> Tin nhắn thu hồi: (${deleted_msg_type})`,
        //       //   "black",
        //       //   "#f35369"
        //       // );
        //       // console.log(
        //       //   c.msgs || "(RVDFM: không có dữ liệu cho tin nhắn này)"
        //       // );
        //     } else if (c.type == "Thả react" || c.type === "Gỡ react") {
        //       const target_msg = rvdfm_all_msgs.filter(
        //         (_msg) => _msg.id === c.id
        //       );

        //       // log.text(`> ${c.type}:`, "black", "yellow");
        //       // console.log(
        //       //   target_msg || "(RVDFM: không có dữ liệu cho tin nhắn này)"
        //       // );
        //     }
        //   }
        // }

        // Hiển thị thông tin lưu tin nhắn mới
        // const new_lenght = rvdfm_all_msgs.length;
        // const new_msg_count = new_lenght - old_length;
        // if (new_msg_count) {
        //   // rvdfmSendSavedCounterToContentJs(new_msg_count, new_lenght);
        //   // log.text(
        //   //   `> RVDFM Đã lưu ${new_msg_count} tin nhắn mới! (${new_lenght})`,
        //   //   "green"
        //   // );
        // }
      }
    });

    return webSocketInstant;
  };

  window.WebSocket.prototype = OriginalWebSocket.prototype;
  window.WebSocket.prototype.constructor = window.WebSocket;
})();
