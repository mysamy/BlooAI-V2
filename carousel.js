class Carousel {
      /**
       * @param element - The `element` parameter typically refers to the HTML element that the constructor
       * will be working with. It could be a reference to a specific DOM element on the webpage.
       * @param [options] - The `options` parameter in the constructor function is an object that allows you
       * to pass additional configuration settings or properties when creating an instance of the class. It
       * is optional, meaning you can provide default values for these options if they are not specified
       * when creating an instance.
       * @param {Object} [options.slidesToScroll=1] Nombre d'éléments a faire défiler
       * @param {Object} [options.slidesVisible=1] Nombre d'éléments visible dans un slide
       * @param {boolean} [options.loop=false] Doit ton boucler en fin de carousel
       * @param {boolean} [options.infinite=false] carousel infini ou pas
       * @param {boolean} [options.navigation=true] Doit ton mettre une pagination
       *  @param {boolean} [options.pagination=false]
       */
      constructor(element, options = {}) {
            this.element = element; 
            // method assign permet de mettre des valeurs par default si lutilisteur ne met rien
            this.options = Object.assign(
                  {},
                  {
                        slidesToScroll: 1,
                        slidesVisible: 1,
                        loop: false,
                        pagination: false,
                        navigation: true,
                        infinite: false,
                  },
                  options
            );
            if (this.options.loop && this.options.infinite) {
                  throw new Error("un carousel ne peut etre a la fois en boucle et en infini");
            }
            let children = Array.from(element.children);
            this.isMobile = false;
            this.currentItem = 0;
            this.moveCallbacks = [];
            this.offset = 0;
            this.isAnimating = false;
            this.middleIndex = this.slidesVisible >= 3 ? Math.floor(this.slidesVisible / 2) : 0;
            // Modification du DOM
            this.root = this.createDivWithClass("carousel");
            this.container = this.createDivWithClass("carousel__wrapper");
            this.root.appendChild(this.container);
            this.element.appendChild(this.root);
            this.items = children.map((child, index) => {
                  let item = this.createDivWithClass("carousel__item");
                  item.appendChild(child);
                  item.setAttribute("role", "group");
                  item.setAttribute("aria-roledescription", "slide");
                  item.setAttribute("aria-label", `Étape ${index + 1} sur ${children.length}`);

                  return item;
            });

            if (this.options.infinite) {
                  this.offset = this.options.slidesVisible + this.options.slidesToScroll;
                  if (this.offset > children.length) {
                        console.error("erreur pas assez d'element dans le carousel", element);
                  }
                  this.items = [
                        ...this.items.slice(this.items.length - this.offset).map((item) => item.cloneNode(true)),
                        ...this.items,
                        ...this.items.slice(0, this.offset).map((item) => item.cloneNode(true)),
                  ];
                  this.gotoItem(this.offset, false);
            }
            debugger
            this.items.forEach((item) => this.container.appendChild(item));
            this.onWindowResize();
            this.setStyle();
            this.zoom();

            if (this.options.navigation) {
                  this.createNavigation();
            }

            if (this.options.pagination === true) {
                  this.createPagination();
            }

            // Evenements
            this.onMove((index) => {
                  this.items.forEach((item, i) => {
                        if (i >= index && i < index + this.slidesVisible) {
                              item.style.opacity = "1";
                              item.style.pointerEvents = "auto";
                        } else {
                              item.style.opacity = "0";
                              item.style.pointerEvents = "none";
                        }
                  });
            });
            this.moveCallbacks.forEach((cb) => cb(this.currentItem));
            window.addEventListener("resize", this.onWindowResize.bind(this));
            this.root.addEventListener("keyup", (e) => {
                  if (e.key === "ArrowRight" || e.key === "Right") {
                        this.next();
                  } else if (e.key === "ArrowLeft" || e.key === "Left") {
                        this.prev();
                  }
            });
            if (this.options.infinite) {
                  this.container.addEventListener("transitionend", this.resetInfinite.bind(this));
            }
      }
      /**
       * Applique les bonnes dimentions aux élément de la carousel
       */
      setStyle() {
            let ratio = this.items.length / this.slidesVisible;
            this.container.style.width = ratio * 100 + "%";
            this.items.forEach((item) => (item.style.width = 100 / this.slidesVisible / ratio + "%"));
            this.zoom();
            this.updateAccessibility(this.currentItem);
      }
      /**
       * Creer la navigation
       */
      createNavigation() {
            let prevButton = this.createDivWithClass("carousel__prev");
            prevButton.setAttribute("aria-label", "étape précédente");
            prevButton.setAttribute("tabindex", "0");
            let nextButton = this.createDivWithClass("carousel__next");
            nextButton.setAttribute("aria-label", "étape suivante");
            nextButton.setAttribute("tabindex", "0");
            this.root.appendChild(prevButton);
            this.root.appendChild(nextButton);

            nextButton.addEventListener("click", this.next.bind(this));
            prevButton.addEventListener("click", this.prev.bind(this));
            if (this.options.loop === true) {
                  return;
            }
            this.onMove((index) => {
                  if (index === 0) {
                        prevButton.classList.add("carousel__prev--hidden");
                  } else {
                        prevButton.classList.remove("carousel__prev--hidden");
                  }
                  if (this.items[this.currentItem + this.slidesVisible] === undefined) {
                        nextButton.classList.add("carousel__next--hidden");
                  } else {
                        nextButton.classList.remove("carousel__next--hidden");
                  }
            });
            this.root.appendChild(prevButton);
            this.root.appendChild(this.container);

            this.root.appendChild(nextButton);
      }

      /**
       * Creer la Pagination
       */
      createPagination() {
            let pagination = this.createDivWithClass("carousel__pagination");
            let buttons = [];
            this.root.appendChild(pagination);
            for (let i = 0; i < this.items.length - 2 * this.offset; i = i + this.options.slidesToScroll) {
                  let button = this.createDivWithClass("carousel__pagination__button");
                  button.addEventListener("click", () => this.gotoItem(i + this.offset));
                  pagination.appendChild(button);
                  buttons.push(button);
            }
            this.onMove((index) => {
                  let count = this.items.length - 2 * this.offset;
                  let activeButton = buttons[Math.floor(((index - this.offset) % count) / this.options.slidesToScroll)];
                  if (activeButton) {
                        buttons.forEach((button) => button.classList.remove("carousel__pagination__button--active"));
                        activeButton.classList.add("carousel__pagination__button--active");
                  }
            });
      }

      next() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            this.gotoItem(this.currentItem + this.slidesToScroll);
            setTimeout(() => {
                  this.isAnimating = false;
            }, 500);
      }

      prev() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            this.gotoItem(this.currentItem - this.slidesToScroll);
            setTimeout(() => {
                  this.isAnimating = false;
            }, 500);
      }
      /**
       * Déplace le carousel ver l'élément cible
       * @para (number) index
       *@param {boolean} [animation = true]
       */
      
      gotoItem(index, animation = true) {
            
            if (index < 0) {
                  if (this.options.loop) {
                        index = this.items.length - this.slidesVisible;
                  } else {
                        return;
                  }
            } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
                  if (this.options.loop) {
                        index = 0;
                  } else {
                        return;
                  }
            }

            if (animation === false) {
                  this.container.style.transition = "none";
                  this.items.forEach((item) => {
                        item.style.transition = "none";
                  });
            }
            let translateX = (index * -100) / this.items.length;
            this.container.style.transform = `translate3d(${translateX}%, 0, 0)`;
            this.currentItem = index;

            this.moveCallbacks.forEach((cb) => cb(index));
            this.zoom();
            this.container.offsetHeight;// Force le navigateur à recalculer le layout (reflow) pour que les transitions/animations se déclenchent correctement
            this.updateAccessibility(this.currentItem); 
            if (animation === false) {
                  this.items.forEach((item) => {
                        item.style.transition = "";
                  });
                  this.container.style.transition = "";
            }
      }
      /**
       *
       * Zoom lélement du milieu
       */
      zoom() {
            this.items.forEach((item) => item.classList.remove("carousel__item--zoom"));
            if (this.slidesVisible >= 3) {
                  this.middleIndex = this.currentItem + Math.floor(this.slidesVisible / 2);
                  this.middleItem = this.items[this.middleIndex];
                  if (this.middleItem) {
                        this.middleItem.classList.add("carousel__item--zoom");
                  }
            } else {
                  return;
            }
      }
      /**
       * Met à jour l’accessibilité des cartes du carousel.
       * Définit la slide active pour les lecteurs d’écran et met à jour le status.
       *
       * @param {number} index - L’index de la slide actuellement active.
       */
      updateAccessibility(index) {
            let middleIndex;
            if (this.slidesVisible >= 3) {
                  middleIndex = index + Math.floor(this.slidesVisible / 2);
            } else {
                  middleIndex = index;
            }
            
            this.items.forEach((item, i) => {
                  const isActive = i === middleIndex;
                  item.setAttribute("aria-hidden", isActive ? "false" : "true");
                  item.setAttribute("tabindex", isActive ? "0" : "-1");
                  if (isActive) {
                        item.setAttribute("aria-current", "true"); 
                  } else {
                         item.removeAttribute("aria-current");
                  }
            });
            if (this.root.contains(document.activeElement) || document.activeElement === document.body) {
        this.items[middleIndex].focus();
    }
            // Mise à jour du status live
            let status = document.getElementById("carousel-status");
            if (status) {
                  let visibleSlideNumber = middleIndex;

                  if (this.options.infinite) {
                        visibleSlideNumber = ((middleIndex - this.offset + this.items.length) % (this.items.length - 2 * this.offset)) + 1;
                  } else {
                        visibleSlideNumber = middleIndex + 1;
                  }

                  status.textContent = `Étape ${visibleSlideNumber} sur ${this.items.length - (this.options.infinite ? 2 * this.offset : 0)}`;
            }
      }
      /**
       * Déplace le container pour donner l'impression d'un slide infini
       */
      resetInfinite() {
            if (this.currentItem <= this.options.slidesToScroll) {
                  this.gotoItem(this.currentItem + this.items.length - 2 * this.offset, false);
            } else if (this.currentItem >= this.items.length - this.offset) {
                  this.gotoItem(this.currentItem - (this.items.length - 2 * this.offset), false);
            }
      }

      /**
       * Rajoute un écouteur qui écoute le déplacement du carousel
       * @param {moveCallbacks} cb
       */
      onMove(cb) {
            this.moveCallbacks.push(cb);
      }

      onWindowResize() {
            let mobile = window.innerWidth < 1100;
            if (mobile !== this.isMobile) {
                  this.isMobile = mobile;
                  this.setStyle();
            } else if (!mobile) {
                  this.isMobile = false;
                  this.setStyle();
            }
            this.moveCallbacks.forEach((cb) => cb(this.currentItem));
      }
      /**
       *
       * @param {string} className
       * @returns {HTMLElment}
       */
      createDivWithClass(className) {
            let div = document.createElement("div");
            div.setAttribute("class", className);
            return div;
      }

      /**
       *  @returns {number}
       */
      get slidesToScroll() {
            return this.isMobile ? 1 : this.options.slidesToScroll;
      }
      get slidesVisible() {
            return this.isMobile ? 1 : this.options.slidesVisible;
      }
}
let onReady = function () {
      new Carousel(document.querySelector(".how__carousel"), {
            slidesVisible: 3,
            slidesToScroll: 1,
            infinite: true,
            pagination: false,
      });
};

if (document.readyState !== "loading") {
     
      onReady();
}
document.addEventListener("DOMContentLoaded", onReady);




