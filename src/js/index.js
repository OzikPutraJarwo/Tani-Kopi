// Hero button smooth scroll to #recent
window.addEventListener("DOMContentLoaded", (event) => {
  document
    .querySelector("#hero .text .button")
    .addEventListener("click", function () {
      var targetElement = document.querySelector("#best");
      var targetOffset = targetElement.offsetTop - 60;
      window.scrollTo({
        top: targetOffset,
        behavior: "smooth",
      });
    });
});

// Testimonial Slider

var testimonials = document.querySelectorAll(".testimonial");
var navigationContainer = document.querySelector(".navigation");
var currentIndex = 0;
function showTestimonial(index) {
  var navigationButtons = navigationContainer.querySelectorAll("button");
  navigationButtons.forEach(function (button) {
    button.classList.remove("active");
  });
  navigationButtons[index].classList.add("active");
  var testimonialContainer = document.querySelector(".slider-container");
  testimonialContainer.style.transform = "translateX(-" + index * 100 + "%)";
}
function nextTestimonial() {
  currentIndex++;
  if (currentIndex >= testimonials.length) {
    currentIndex = 0;
  }
  showTestimonial(currentIndex);
}
var autoplayInterval = setInterval(nextTestimonial, 3000);
testimonials.forEach(function (testimonial, index) {
  var button = document.createElement("button");
  button.setAttribute("aria-label","Navigation")
  button.addEventListener("click", function () {
    clearInterval(autoplayInterval);
    currentIndex = index;
    showTestimonial(index);
  });
  navigationContainer.appendChild(button);
});
showTestimonial(currentIndex);

fetch("./menu.html", { mode: "no-cors" })
  .then((response) => response.text())
  .then((data) => {
    const menuWrapElement = new DOMParser()
      .parseFromString(data, "text/html")
      .querySelector(".menu-wrap");
    const bestProductElements = Array.from(
      menuWrapElement.querySelectorAll(".product.best")
    );
    const indexContainer = document.getElementById("index-container");
    bestProductElements.forEach((product) => {
      indexContainer.appendChild(product);
    });
  });

setTimeout(() => {
  const scriptElement = document.createElement("script");
  scriptElement.src = "./src/js/menu.js";
  document.body.appendChild(scriptElement);
}, 5000);
