/* L'essai gratuit : prenom, nom et email AVANT le formulaire Lemon Squeezy (qui ne demande que l'email pour un
   produit gratuit). Les boutons <a data-essai href="lien Lemon Squeezy"> ouvrent cette fenetre ; a l'envoi, on part
   sur Lemon Squeezy avec l'email et le nom deja remplis, et prenom / nom / accord dans les donnees de la commande
   (checkout[custom]), visibles dans Lemon Squeezy > Orders. Sans JavaScript, le lien marche comme avant.
   Depuis le 2026-10-08 (Gumroad) : la fenetre ne s'ouvre QUE pour un lien Lemon Squeezy ; gardee si on y revient. */
(function () {
  var T = {
    fr: { titre: "Ton essai gratuit de 7 jours", sous: "Remplis ces 3 cases, puis valide ton email sur la page suivante : le téléchargement démarre.",
          prenom: "Prénom", nom: "Nom", email: "Email", accord: "J'accepte de recevoir des nouvelles et des conseils de FloorDesk One par email (désinscription en un clic).",
          bouton: "Continuer", fermer: "Fermer", erreur: "Remplis le prénom, le nom et un email valide.",
          legal: "Tes données servent à t'envoyer l'essai. <a href=\"{legal}#confidentialite\">Confidentialité</a>" },
    en: { titre: "Your 7-day free trial", sous: "Fill in these 3 fields, then confirm your email on the next page: the download starts.",
          prenom: "First name", nom: "Last name", email: "Email", accord: "I agree to receive news and tips from FloorDesk One by email (one-click unsubscribe).",
          bouton: "Continue", fermer: "Close", erreur: "Enter your first name, last name and a valid email.",
          legal: "Your data is used to send you the trial. <a href=\"{legal}#privacy\">Privacy</a>" },
    pt: { titre: "O seu teste grátis de 7 dias", sous: "Preencha estes 3 campos e confirme o seu e-mail na página seguinte: o download começa.",
          prenom: "Nome", nom: "Sobrenome", email: "E-mail", accord: "Aceito receber novidades e dicas do FloorDesk One por e-mail (cancelamento em um clique).",
          bouton: "Continuar", fermer: "Fechar", erreur: "Preencha o nome, o sobrenome e um e-mail válido.",
          legal: "Os seus dados servem para enviar o teste. <a href=\"{legal}#privacy\">Privacidade</a>" },
    es: { titre: "Tu prueba gratis de 7 días", sous: "Rellena estos 3 campos y confirma tu email en la página siguiente: la descarga empieza.",
          prenom: "Nombre", nom: "Apellido", email: "Email", accord: "Acepto recibir novedades y consejos de FloorDesk One por email (baja en un clic).",
          bouton: "Continuar", fermer: "Cerrar", erreur: "Rellena el nombre, el apellido y un email válido.",
          legal: "Tus datos sirven para enviarte la prueba. <a href=\"{legal}#privacy\">Privacidad</a>" }
  };
  var code = (document.documentElement.lang || "fr").slice(0, 2);
  var t = T[code] || T.en;
  var legal = "legal.html";                    // la page legale de la meme langue, dans le meme dossier

  var css = document.createElement("style");
  css.textContent =
    "#essai-fond{position:fixed;inset:0;background:rgba(5,8,12,.72);display:none;align-items:center;justify-content:center;z-index:100;padding:16px}" +
    "#essai-fond.ouvert{display:flex}" +
    "#essai-boite{background:var(--carte,#151b24);border:1px solid var(--bord,#263040);border-radius:14px;max-width:440px;width:100%;padding:28px 26px;position:relative;box-shadow:0 30px 80px rgba(0,0,0,.6)}" +
    "#essai-boite h3{margin:0 0 6px;font-size:22px;color:var(--blanc,#f1f5fb)}" +
    "#essai-boite p{margin:0 0 18px;color:var(--dim,#8592a5);font-size:15px}" +
    "#essai-boite label{display:block;font-size:13px;color:var(--dim,#8592a5);margin:12px 0 5px}" +
    "#essai-boite input[type=text],#essai-boite input[type=email]{width:100%;box-sizing:border-box;padding:11px 12px;border-radius:9px;border:1px solid var(--bord,#263040);background:#0d1117;color:var(--blanc,#f1f5fb);font-size:16px}" +
    "#essai-boite .accord{display:flex;gap:9px;align-items:flex-start;margin-top:16px;font-size:13px;color:var(--dim,#8592a5);line-height:1.45}" +
    "#essai-boite .accord input{margin-top:3px;flex:none}" +
    "#essai-boite .bouton{width:100%;margin-top:20px;text-align:center;border:none;cursor:pointer;font-size:16px}" +
    "#essai-boite .err{color:#f05252;font-size:13px;margin-top:10px;min-height:16px}" +
    "#essai-boite .petit{font-size:12px;margin:12px 0 0;text-align:center}" +
    "#essai-x{position:absolute;top:10px;right:14px;background:none;border:none;color:var(--dim,#8592a5);font-size:24px;cursor:pointer}";
  document.head.appendChild(css);

  var fond = document.createElement("div");
  fond.id = "essai-fond";
  fond.innerHTML =
    '<form id="essai-boite" novalidate>' +
    '<button type="button" id="essai-x" aria-label="' + t.fermer + '">×</button>' +
    "<h3>" + t.titre + "</h3><p>" + t.sous + "</p>" +
    '<label for="essai-prenom">' + t.prenom + '</label><input type="text" id="essai-prenom" autocomplete="given-name" required>' +
    '<label for="essai-nom">' + t.nom + '</label><input type="text" id="essai-nom" autocomplete="family-name" required>' +
    '<label for="essai-email">' + t.email + '</label><input type="email" id="essai-email" autocomplete="email" required>' +
    '<label class="accord"><input type="checkbox" id="essai-accord"><span>' + t.accord + "</span></label>" +
    '<div class="err" id="essai-err"></div>' +
    '<button type="submit" class="bouton">' + t.bouton + "</button>" +
    '<p class="petit">' + t.legal.replace("{legal}", legal) + "</p>" +
    "</form>";
  document.body.appendChild(fond);

  var lien = "";
  function ouvrir(href) {
    lien = href;
    fond.classList.add("ouvert");
    setTimeout(function () { document.getElementById("essai-prenom").focus(); }, 30);
  }
  function fermer() { fond.classList.remove("ouvert"); }
  document.getElementById("essai-x").onclick = fermer;
  fond.addEventListener("click", function (e) { if (e.target === fond) fermer(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fermer(); });

  document.querySelectorAll("a[data-essai]").forEach(function (a) {
    if (a.href.indexOf("lemonsqueezy.com") < 0) return;   // Gumroad (ou lien direct) : son formulaire demande lui-meme nom et email
    a.addEventListener("click", function (e) { e.preventDefault(); ouvrir(a.href); });
  });

  document.getElementById("essai-boite").addEventListener("submit", function (e) {
    e.preventDefault();
    var p = document.getElementById("essai-prenom").value.trim();
    var n = document.getElementById("essai-nom").value.trim();
    var m = document.getElementById("essai-email").value.trim();
    var ok = document.getElementById("essai-accord").checked;
    if (!p || !n || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) {
      document.getElementById("essai-err").textContent = t.erreur;
      return;
    }
    var q = [["checkout[email]", m], ["checkout[name]", p + " " + n], ["checkout[custom][prenom]", p],
             ["checkout[custom][nom]", n], ["checkout[custom][accord_emails]", ok ? "oui" : "non"],
             ["checkout[custom][langue]", code]];
    var url = lien + (lien.indexOf("?") >= 0 ? "&" : "?") +
      q.map(function (x) { return encodeURIComponent(x[0]) + "=" + encodeURIComponent(x[1]); }).join("&");
    location.href = url;
  });
})();
