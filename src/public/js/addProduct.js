const socket = io();
const createForm = document.querySelector(".create_form");

createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const product = new FormData(e.target);
  let res = await fetch("/api/products", {
    method: "POST",
    body: product,
  });
  let message = await res.json();
  if (message?.success) {
    Swal.fire({
      text: `${message.success}`,
      toast: true,
      position: "top-right",
    });
    createForm.reset();
  } else {
    Swal.fire({
      text: `${message.error}`,
      toast: true,
      position: "top-right",
    });
  }
});
