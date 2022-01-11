const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const committer = event.currentTarget.elements.committer.value;
  fetch("/commit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      committer,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
});
