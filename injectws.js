(function () {
  const OriginalWebSocket = window.WebSocket;

  const isMsgIdStr = (str = "") => str.startsWith("mid.$");
  const isLink = (str = "") => str.startsWith("https://");

  window.WebSocket = function fakeConstructor(dt, config) {
    const webSocketInstant = new OriginalWebSocket(dt, config);

    webSocketInstant.addEventListener("message", async function (achunk) {
      const textDecoded = new TextDecoder("utf-8").decode(achunk.data);

      console.log(textDecoded);
    });

    return webSocketInstant;
  };

  window.WebSocket.prototype = OriginalWebSocket.prototype;
  window.WebSocket.prototype.constructor = window.WebSocket;
})();
