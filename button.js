const buttonQuestion = document.querySelectorAll(".question__button");

buttonQuestion.forEach((btn) => {
      btn.addEventListener("click", () => {
            const container = btn.closest(".question__container");
            const answer = container.querySelector(".question__text");
            const isOpen = answer.classList.contains("question__text--active");

            if (!isOpen) {
                  answer.removeAttribute("hidden");
                  requestAnimationFrame(() => {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                        answer.classList.add("question__text--active");
                  });
            } else {
                  answer.classList.remove("question__text--active");
                  answer.style.maxHeight = null;
                  answer.addEventListener("transitionend", function handler() {
                        answer.setAttribute("hidden", "");
                        answer.removeEventListener("transitionend", handler);
                  });
            }

            btn.classList.toggle("question__button--click");
      });
});
const buttonAdvantage = document.querySelector(".compliance__button--advantage");
const buttonCompliance = document.querySelector(".compliance__button--compliance");
const compliance = document.querySelector(".compliance__content--compliance");
const advantage = document.querySelector(".compliance__content--advantage");

function toggleSection(show, hide) {
      requestAnimationFrame(() => {
            hide.classList.remove("u-opacity-1");
            hide.classList.add("u-opacity-0");
      });
      hide.classList.remove("u-display");
      hide.classList.add("u-none");
      hide.setAttribute("aria-hidden", "true");
      show.classList.remove("u-none");
      show.classList.add("u-flex");
      show.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => {
            show.classList.remove("u-opacity-0");
            show.classList.add("u-opacity-1");
      });
}
const boutons = document.querySelectorAll(".compliance__button");
boutons.forEach((btn) => {
      btn.addEventListener("click", () => {
            boutons.forEach((b) => {
                  b.classList.remove("active");
                  b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");
      });
});
buttonAdvantage.addEventListener("click", () => {
      toggleSection(advantage, compliance);
});
buttonCompliance.addEventListener("click", () => {
      toggleSection(compliance, advantage);
});
buttonCompliance.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleSection(compliance, advantage);
      }
});

buttonAdvantage.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleSection(advantage, compliance);
      }
});
// hero
const featureAudit = document.querySelector(".feature--audit");
const featureEdition = document.querySelector(".feature--edition");
const featureAgent = document.querySelector(".feature--agent");
const featureTest = document.querySelector(".feature--test");

const tableauFeature = [
      {
            icon: "fa-eye",
            title: "Audit",
            description: `BlooAI effectue un audit automatisé de votre site sur la base du RGAA, vous précise votre taux de conformité et vous indique les erreurs majeures d'accessibilité.

            Un rapport d’audit intermédiaire vous est transmis.`,
      },
      {
            icon: "fa-pencil",
            title: "Edition",
            description: `Après l’intervention des nos experts en accessibilité et des tests utilisateurs, BlooAI vous délivre sous 48h:
            • Un rapport d’audit complet et votre taux de conformité
            • Une déclaration d’accessibilité valable 3 ans
            • Un schéma pluriannuel de mise en accessibilité avec les améliorations à apporter

            Ces documents sont à intégrer à votre site

            Votre site rentre dans une démarche de conformité et d’inclusion`,
      },
      {
            icon: "fa-brain",
            title: "Agent IA",
            description: `Vous êtes développeur informatique, BlooAI échange avec vous sur les bonnes pratiques de l’accessibilité numérique, s’adapte à votre langage de programmation et vous indique les améliorations à apporter à votre code.

            BlooAI a été entrainé par nos experts en accessibilité numérique en situation de handicap.
`,
      },
      {
            icon: "fa-user-doctor",
            title: "Tests",
            description: `À tout moment, BlooAI et nos experts peuvent vous accompagner sur la mise en accessibilité de vos solutions numériques et la mise en place de tests utilisateurs en situation de handicap pour identifier les blocages.
`,
      },
];
const cardFeature = document.querySelector(".hero__feature-description");
function createCard(feature) {
      cardFeature.classList.add("hide");
      requestAnimationFrame(() => {
            cardFeature.addEventListener("transitionend", function handler() {
                  cardFeature.removeEventListener("transitionend", handler);

                  cardFeature.innerHTML = "";
                  cardFeature.classList.remove("hide");
                  cardFeature.classList.add("hero__feature-description", "show");

                  const containerFeature = document.createElement("div");
                  const icon = document.createElement("i");
                  icon.classList.add("fas", "fa-9x", "fa-responsive", feature.icon);
                  icon.setAttribute("aria-hidden", "true");
                  cardFeature.appendChild(icon);

                  const title = document.createElement("h3");
                  title.textContent = feature.title;
                  containerFeature.appendChild(title);
                  containerFeature.classList.add("hero__feature-content");

                  const desc = document.createElement("p");
                  desc.textContent = feature.description;
                  containerFeature.appendChild(desc);

                  cardFeature.append(icon, containerFeature);

                  handleResponsiveChange();
            });
      });
}

featureAudit.addEventListener("click", () => createCard(tableauFeature[0]));
featureEdition.addEventListener("click", () => createCard(tableauFeature[1]));
featureAgent.addEventListener("click", () => createCard(tableauFeature[2]));
featureTest.addEventListener("click", () => createCard(tableauFeature[3]));

// Responsive input URL
featureAudit.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            createCard(tableauFeature[0]);
      }
});
featureEdition.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            createCard(tableauFeature[1]);
      }
});

featureAgent.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            createCard(tableauFeature[2]);
      }
});

featureTest.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            createCard(tableauFeature[3]);
      }
});
