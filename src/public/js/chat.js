const socket = io();
let user = document.querySelector(".username");
let id = document.querySelector("#user_id");
let chatBox = document.querySelector("#chat_box");
let messageLogs = document.querySelector("#message_logs");
const bgimage = document.querySelector(".background");

chatBox.addEventListener("keyup", async (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          user: user.innerHTML,
          message: chatBox.value,
          id: id.innerHTML,
        }),
        headers: { "Content-Type": "application/json" },
      });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (messages) => {
  messageLogs.innerHTML = "";
  const fragment = document.createDocumentFragment();
  messages.forEach((message) => {
    let div = document.createElement("span");
    let pUser = document.createElement("p");
    let pMessage = document.createElement("p");
    pUser.innerHTML = `<strong>${
      message.id === id.innerHTML ? "Tú" : message.user
    }</strong>`;
    pMessage.textContent = message.message;
    message.id === id.innerHTML
      ? div.classList.add("own_msg")
      : div.classList.add("other_msg");
    div.append(pUser, pMessage);
    fragment.appendChild(div);
  });
  messageLogs.appendChild(fragment);
  messageLogs.scrollTop = messageLogs.scrollHeight;
});

socket.on("newuserconnected", (data) => {
  if (user) {
    Swal.fire({
      text: `${data.user} se ha conectado`,
      toast: true,
      position: "top-right",
    });
  }
});

bgimage.addEventListener("change", (e) => {
  changeBg(e.target);
});
document.addEventListener("load", init());

function init() {
  socket.emit("newuser", { user: user.innerHTML });
  changeBg(bgimage);
}

function changeBg(bg) {
  messageLogs.style.backgroundImage = `url(../images/${bg.value}.jpg)`;
}
