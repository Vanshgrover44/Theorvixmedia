(function() {
  "use strict";
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  const hero = document.querySelector(".hero-1");
  if (hero) {
    hero.setAttribute("data-enhanced", "true");
    gsap.set(hero, { clearProps: "transform,filter,scale" });
  }
})();
