// navbar mobile toggle (future use)

document.addEventListener("DOMContentLoaded", () => {
  console.log("EMIER JS Loaded");
  flatpickr("#lahir", {
    dateFormat: "d-m-Y",
    disableMobile: true,
  });

  flatpickr("#tanggal", {
    dateFormat: "d-m-Y",
    disableMobile: true,
  });
});

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});
