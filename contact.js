let form = document.querySelector(".talk__form");

form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form); // contient toute les valeurs du formulaire
      const data = Object.fromEntries(formData.entries()); // formData.entries() itérable de paires [clé, valeur].//Object.fromEntries(...) transforme cet itérable en un objet JavaScript classique.

      //    JSON.stringify(data) transforme l’objet en string JSON
      localStorage.setItem("formData", JSON.stringify(data));
      console.log("Données sauvegardées :", data);
      //JSON.parse(texteJSON) → transforme ce texte JSON en objet JS à nouveau,
      fetch("/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
      })
            .then((res) => res.json())
            .then((res) => console.log("Réponse serveur :", res))
            .catch((err) => console.error("Erreur :", err));
});
//.then(res => res.json())
//fetch renvoie une promesse qui contient la réponse brute du serveur.

//res.json() transforme cette réponse JSON en objet JS utilisable.
//fetch est une fonction intégrée en JS pour faire des requêtes HTTP (GET, POST, etc.) vers un serveur.