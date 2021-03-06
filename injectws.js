const ID = "egnmoeokeemdcejgbkcfjiddandoipbk";

let rvdfm_all_msgs = [];
let rvdfm_removed_msgs = [];
const users_data = [];

(async function () {
  const sendMessage = async (message, callback) => {
    await chrome.runtime.sendMessage(ID, message, (data) => {
      callback && callback(data);
    });
  };

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

        //     // Th??ng tin ng?????i d??ng
        //     if (str_i === "13" && all_strings[i + 1] === "25") {
        //       const small_avatar = all_strings[i + 2];
        //       const large_avatar = all_strings[i + 4];
        //       const user_id = /(?<=\?entity_id=).*?(?=\&entity_type)/.exec(
        //         all_strings[i + 3]
        //       )[0];
        //       const full_user_name = all_strings[i + 6];
        //       const short_user_name = all_strings[i + 8];
        //       const unknown_id = all_strings[i + 9];

        //       // C?? nh???ng event b???t ?????u b???ng 13 ,25 nh??ng kh??ng c?? user name => lo???i
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
          // L???y ra request id: ????y ch??? l?? m?? ?????nh danh cho request, t??ng d???n ?????u qua t???ng request...
          const request_id = /(?<=\"request_id\":)(.*?)(?=,)/.exec(utf8_str)[0];

          // console.log("M???i th??ng tin: ", {
          //   request_id,
          //   all: all_strings,
          //   utf8_str,
          // });
        } else {
          // Kh??ng c?? th??ng tin g?? th?? tho??t lu??n
          return;
        }

        // B???t ?????u l???y ra nh???ng tin nh???n t??? l?????ng th??ng tin tr??n
        let chat = [];
        for (let i = 0; i < all_strings.length; i++) {
          const str_i = all_strings[i];

          // Tin nh???n ch???
          if (str_i === "insertMessage" && isMsgIdStr(all_strings[i + 2])) {
            const content = all_strings[i + 1];
            if (content) {
              chat.push({
                type: "Ch???",
                content: content,
                attachments: [],
                id: all_strings[i + 2],
              });
              storeChat(chat);
            }
          }

          // Tin nh???n ????nh k??m: image / gif / video / ??m thanh / file
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
              type: "????nh k??m",
              content: "",
              attachments,
              id: all_strings[i + 1],
            });
            storeChat(chat);
          }

          // Tin nh???n nh??n d??n
          if (str_i === "insertMessage" && isMsgIdStr(all_strings[i + 1])) {
            const attachment = parse(
              /(?=https)(.*?)(?=")/gm.exec(all_strings[i + 9])[0]
            );
            if (attachment) {
              chat.push({
                type: "Nh??n d??n",
                content: "",
                attachments: [attachment],
                id: all_strings[i + 1],
              });
              storeChat(chat);
            }
          }

          // Chia s??? b??i vi???t
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
                type: "Chia s???",
                content: link,
                attachments: [],
                id: all_strings[i + 2],
              });
              storeChat(chat);
            }
          }

          // Th??? react
          // if (str_i === "upsertReaction" && isMsgIdStr(all_strings[i + 1])) {
          //   chat.push({
          //     type: "Th??? react",
          //     content: all_strings[i + 2],
          //     id: all_strings[i + 1],
          //   });
          // }

          // G??? react
          // if (str_i === "deleteReaction" && isMsgIdStr(all_strings[i + 1])) {
          //   const id = all_strings[i + 1];
          //   const content =
          //     rvdfm_all_msgs.find((c) => c.id === id)?.content || "";

          //   chat.push({
          //     type: "G??? react",
          //     content: content,
          //     id: id,
          //   });
          // }

          // Tin nh???n chia s??? v??? tr?? / v??? tr?? tr???c ti???p
          // if (
          //   str_i === "xma_live_location_sharing" &&
          //   isMsgIdStr(all_strings[i - 2]) &&
          //   isLink(all_strings[i + 1])
          // ) {
          //   const link = all_strings[i + 1];

          //   chat.push({
          //     type: "Chia s???",
          //     content: link,
          //     id: all_strings[i - 2],
          //   });
          //   storeChat(chat);
          // }

          // Th??ng tin user
          // if (str_i === "533" && isLink(all_strings[i + 1])) {
          //   const avatar = all_strings[i + 1];
          //   const user_name = all_strings[i + 2];

          //   chat.push({
          //     type: "Ng?????i d??ng",
          //     avatar: avatar,
          //     name: user_name,
          //   });
          // }

          // Tin nh???n ??ang ch???
          // if (str_i === "130" && all_strings[i + 3] === "pending") {
          //   chat.push({
          //     type: "Tin nh???n ??ang ch???",
          //     content: all_strings[i + 1],
          //     avatar: all_strings[i + 2],
          //   });
          // }

          // Thu h???i tin nh???n
          if (
            str_i === "deleteThenInsertMessage" &&
            isMsgIdStr(all_strings[i + 2])
          ) {
            const display_name = all_strings[i + 9].slice(
              0,
              all_strings[i + 9].indexOf(" ???? thu h???i m???t tin nh???n")
            );

            const id = all_strings[i + 2];
            const msgs =
              rvdfm_all_msgs.filter(
                (c) => c.id === id && c.type !== "Thu h???i"
              ) || [];

            chat.push({
              type: "Thu h???i",
              msgs: msgs,
              id,
              display_name,
            });
            storeChat(chat);
            rvdfm_removed_msgs.push({
              type: "Thu h???i",
              msgs: msgs,
              id,
              display_name,
            });

            if (msgs.length) {
              const typeConversation = id[5] === "g" ? "Group" : "P2P";
              const date = new Date(msgs[0].time);
              const dateTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}-${
                date.getMonth() + 1
              }-${date.getFullYear()}`;
              const message = {
                id,
                display_name,
                content: msgs[0].content,
                attachments: msgs[0].attachments,
                type: typeConversation,
                time: dateTime,
              };
              await sendMessage({ type: "save", message });
            }
          }
        }

        // Ch??n th???i gian hi???n t???i v??o
        // chat = chat.map((_) => ({ ..._, time: Date.now() }));

        // L??u v??o rvdfm_all_msgs
        // const old_length = rvdfm_all_msgs.length;
        // for (let c of chat) {
        //   let isDuplicated =
        //     -1 !== rvdfm_all_msgs.findIndex((_msg) => c.id === _msg.id);

        //   if (!isDuplicated) {
        //     rvdfm_all_msgs = rvdfm_all_msgs.concat(chat);

        //     // Tin nh???n thu h???i
        //     if (c.type === "Thu h???i") {
        //       const deleted_msg_type = c.msgs
        //         .map((_c) => c.type || "kh??ng r?? lo???i")
        //         .join(",");

        //       // log.text(
        //       //   `> Tin nh???n thu h???i: (${deleted_msg_type})`,
        //       //   "black",
        //       //   "#f35369"
        //       // );
        //       // console.log(
        //       //   c.msgs || "(RVDFM: kh??ng c?? d??? li???u cho tin nh???n n??y)"
        //       // );
        //     } else if (c.type == "Th??? react" || c.type === "G??? react") {
        //       const target_msg = rvdfm_all_msgs.filter(
        //         (_msg) => _msg.id === c.id
        //       );

        //       // log.text(`> ${c.type}:`, "black", "yellow");
        //       // console.log(
        //       //   target_msg || "(RVDFM: kh??ng c?? d??? li???u cho tin nh???n n??y)"
        //       // );
        //     }
        //   }
        // }

        // Hi???n th??? th??ng tin l??u tin nh???n m???i
        // const new_lenght = rvdfm_all_msgs.length;
        // const new_msg_count = new_lenght - old_length;
        // if (new_msg_count) {
        //   // rvdfmSendSavedCounterToContentJs(new_msg_count, new_lenght);
        //   // log.text(
        //   //   `> RVDFM ???? l??u ${new_msg_count} tin nh???n m???i! (${new_lenght})`,
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
