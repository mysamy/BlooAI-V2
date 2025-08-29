function updatePlaceholder() {
      const input = document.getElementById("url");
      if (!input) return;
      if (window.innerWidth <= 450) {
            input.placeholder = "URL";
      } else {
            input.placeholder = "Entrez une URL";
      }
}
const mediaQuery450 = window.matchMedia("(max-width: 450px)");
const mediaQuery900 = window.matchMedia("(max-width: 900px)");
function handleResponsiveChange() {
      const div = document.querySelector(".fa-responsive");
      if (!div) return;
      div.classList.remove("fa-9x", "fa-5x", "fa-3x");

      if (window.innerWidth <= 450) {
            div.classList.add("fa-3x");
      } else if (window.innerWidth <= 900) {
            div.classList.add("fa-5x");
      } else {
            div.classList.add("fa-9x");
      }
}

// nav bouton burger déroulant

const buttonMenu = document.querySelector(".button-burger");
const menuDialog = document.querySelector(".modal-nav");
const mediaQuery769 = window.matchMedia("(max-width: 769px)");

function responsiveModal() {
      const iconButton = document.querySelector(".button-burger__icon");
      if (!menuDialog) return;
      if (window.innerWidth >= 769 && menuDialog.open) {
            menuDialog.close();
            menuDialog.classList.remove("u-flex");
            iconButton.classList.add("fa-angle-down");
            iconButton.classList.remove("fa-angle-up");
      }
}

buttonMenu.addEventListener("click", () => {
      const iconButton = document.querySelector(".button-burger__icon");

      if (menuDialog.open) {
            menuDialog.close();
            menuDialog.classList.remove("u-flex");
            iconButton.classList.add("fa-angle-down");
            iconButton.classList.remove("fa-angle-up");
            buttonMenu.setAttribute("aria-expanded", "false");
            menuDialog.setAttribute("aria-modal", "false");
      } else {
            menuDialog.show();
            menuDialog.classList.add("u-flex");
            iconButton.classList.add("fa-angle-up");
            iconButton.classList.remove("fa-angle-down");
            buttonMenu.setAttribute("aria-expanded", "true");
            menuDialog.setAttribute("aria-modal", "true");
      }
});

handleResponsiveChange();
updatePlaceholder();
responsiveModal();
mediaQuery769.addEventListener("change", responsiveModal);
mediaQuery450.addEventListener("change", handleResponsiveChange);
mediaQuery450.addEventListener("change", updatePlaceholder);
mediaQuery900.addEventListener("change", handleResponsiveChange);
