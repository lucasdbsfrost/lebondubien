/*
 * Le Bon du Bien : l'application.
 * Toutes les pages sont dans index.html et changent selon l'adresse après le
 * « # » (par exemple index.html#/apotres/trotskov). Ainsi le site s'ouvre d'un
 * simple double-clic, sans serveur, et le bouton « retour » fonctionne.
 * Les textes viennent des fichiers du dossier data/.
 */
(function () {
  'use strict';

  var L = window.LBDB;
  var main = document.getElementById('contenu');
  var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');
  var nettoyages = [];          // ce qu'il faut arrêter en quittant une page

  /* ------------------------------------------------------------------
     Gabarits : tout texte inséré est échappé, sauf ce qui est marqué brut.
  ------------------------------------------------------------------ */
  function Brut(s) { this.s = s; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function val(v) {
    if (v instanceof Brut) return v.s;
    if (Array.isArray(v)) return v.map(val).join('');
    if (v === null || v === undefined || v === false) return '';
    return esc(v);
  }
  function h(chaines) {
    var vals = Array.prototype.slice.call(arguments, 1);
    var out = '';
    for (var i = 0; i < chaines.length; i++) out += chaines[i] + (i < vals.length ? val(vals[i]) : '');
    return new Brut(out);
  }
  function brut(s) { return new Brut(s); }
  function paragraphes(texte) {
    return String(texte).split(/\n\s*\n/).map(function (p) { return h`<p>${p.trim()}</p>`; });
  }

  var ROMAINS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];

  /* ------------------------------------------------------------------
     Images : d'abord le dossier images/, sinon la version en ligne.
  ------------------------------------------------------------------ */
  function image(cle, alt, classe) {
    var fichier = L.images[cle];
    return h`<img src="images/${fichier}" data-enligne="${L.imagesEnLigne + fichier}" alt="${alt || ''}" class="${classe || ''}" loading="lazy" decoding="async">`;
  }
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!(img instanceof HTMLImageElement)) return;
    var enLigne = img.getAttribute('data-enligne');
    if (enLigne && !img.dataset.essai) {
      img.dataset.essai = '1';
      img.src = enLigne;
    } else {
      img.style.visibility = 'hidden';
    }
  }, true);

  /* ------------------------------------------------------------------
     Dessins : le triangle, et une silhouette par relique.
  ------------------------------------------------------------------ */
  var petitTriangle = brut('<svg viewBox="0 0 26 24" aria-hidden="true"><path d="M13 2.5 24 21.5H2Z" fill="none" stroke="#E0392C" stroke-width="2" stroke-linejoin="round"/></svg>');

  function triangleCote(actif) {
    var d = ['M23 4 L42 38', 'M42 38 L4 38', 'M4 38 L23 4'];
    return brut('<svg viewBox="0 0 46 42" aria-hidden="true">' + d.map(function (p, i) {
      return '<path d="' + p + '"' + (i === actif ? ' class="actif"' : '') + '/>';
    }).join('') + '</svg>');
  }

  var RELIQUES_DESSINS = {
    epee: '<path d="M50 8 56 20V64H44V20Z"/><path d="M30 64H70"/><path d="M50 64V84"/><circle cx="50" cy="89" r="4.5"/>',
    couronne: '<path d="M18 70 22 32 36 52 50 24 64 52 78 32 82 70Z"/><path d="M18 79H82"/><circle cx="22" cy="28" r="3"/><circle cx="50" cy="20" r="3"/><circle cx="78" cy="28" r="3"/><path d="M44 62 50 54 56 62Z"/>',
    collier: '<path d="M22 14C22 50 38 62 50 64 62 62 78 50 78 14" stroke-dasharray="2.5 4"/><path d="M50 64 63 88H37Z"/><path d="M50 72 55 81H45Z"/>',
    rose: '<path d="M26 88V46A24 24 0 0 1 74 46V88"/><path d="M18 88H82"/><path d="M50 36C42 36 40 44 44 48 38 50 40 58 46 58 48 62 56 62 56 56 62 56 64 48 58 46 62 40 56 34 50 36Z"/><path d="M50 60V86"/><path d="M50 74C56 70 60 70 63 72 59 76 55 76 50 74Z"/>',
    hallebarde: '<path d="M50 6V94"/><path d="M50 6 45 18H55Z"/><path d="M50 22C66 22 74 32 74 44 64 41 57 44 50 49"/><path d="M50 24C42 27 38 31 37 36H50"/><path d="M45 94H55"/>',
    anneau: '<ellipse cx="50" cy="58" rx="27" ry="25"/><ellipse cx="50" cy="58" rx="19" ry="17"/><path d="M50 20 58 33H42Z"/>',
  };
  function dessinRelique(forme) {
    return brut('<svg viewBox="0 0 100 100" aria-hidden="true">' + (RELIQUES_DESSINS[forme] || RELIQUES_DESSINS.anneau) + '</svg>');
  }

  /* ------------------------------------------------------------------
     Les pages
  ------------------------------------------------------------------ */
  function tete(surtitre, titre, chapeau, retour) {
    return h`<header class="page-tete arrivee" id="arrivee"><div class="cadre">
      ${retour ? h`<a class="retour" href="${retour[0]}">‹ ${retour[1]}</a>` : ''}
      ${surtitre ? h`<p class="surtitre">${surtitre}</p>` : ''}
      <h1 tabindex="-1">${titre}</h1>
      ${chapeau ? h`<p class="chapeau">${chapeau}</p>` : ''}
    </div></header>`;
  }

  /* Le passage : la traversée au défilement qui ouvre chaque grande page.
     « depart » est ce qu'on lit avant d'avancer ; la page commence à l'arrivée. */
  var LIEUX = {
    foi: 'La Verrière', origines: 'La Crypte', branches: 'La Croisée', apotres: 'La Bibliothèque',
    reliques: 'Le Trésor', chroniques: 'La Salle des bannières', code: 'Le Lutrin',
  };
  function passage(nom, depart, longueur) {
    return h`<section class="passage passage-${nom}" data-passage="${nom}" style="--longueur:${longueur}" aria-label="Entrée">
      <div class="passage-ecran">
        <div class="passage-scene" aria-hidden="true"></div>
        ${nom === 'accueil' ? brut('<canvas class="braises" aria-hidden="true"></canvas>') : ''}
        <p class="passage-indice" aria-hidden="true"><span>Faites défiler pour entrer</span><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></p>
        <button class="passage-passer" type="button" data-passer>Passer l'entrée</button>
      </div>
      <div class="passage-depart"><div class="cadre">${depart || h`<p class="passage-lieu">${LIEUX[nom]}</p>`}</div></div>
    </section>`;
  }

  function vueAccueil() {
    var A = L.accueil;
    var cotes = ['Pacem', 'Felicitatem', 'Singularitatem'];
    return {
      titre: 'Le Bon du Bien',
      html: h`
      ${passage('accueil', h`
        <h1 id="titre-accueil" tabindex="-1"><span>${A.titre[0]}</span><span>${A.titre[1]}</span></h1>
        <p class="chapeau">${A.chapeau}</p>
        <div class="actions">
          <button class="bouton bouton-sang" type="button" data-rejoindre>Rejoindre l'Éveil</button>
          <a class="bouton bouton-trait" href="#/foi">Découvrir la foi</a>
        </div>
        <p class="note">${petitTriangle}<span>${A.note}</span></p>`, 420)}

      <section class="appel arrivee" id="arrivee" aria-labelledby="titre-appel"><div class="cadre">
        <h2 id="titre-appel">${A.appel.titre}</h2>
        <p>${A.appel.texte}</p>
        <h3 class="choix-titre">Choisissez votre univers</h3>
        <div class="plaques" role="group" aria-label="Choisir l'univers" data-plaques></div>
        <div class="actions"><a class="bouton bouton-sang" data-lien-univers target="_blank" rel="noopener noreferrer" href="${L.univers[0].lien}">Rejoindre l'Éveil</a></div>
        <p class="serment">${A.appel.serment}</p>
      </div></section>

      <div class="cadre"><div class="engagements">
        ${A.engagements.map(function (e) { return h`<div><h2>${e.titre}</h2><p>${e.texte}</p></div>`; })}
      </div></div>

      <section class="bloc"><div class="cadre">
        <h2 class="bloc-titre">Trois côtés d'une même foi</h2>
        <div class="cotes">
          ${A.cotes.map(function (c, i) { return h`<article class="cote">${triangleCote(i)}<h3>${c.titre}</h3><p class="sous">${c.sous}</p><p>${c.texte}</p></article>`; })}
        </div>
      </div></section>

      <section class="bloc"><div class="cadre">
        <h2 class="bloc-titre">Trois pas vers le refuge</h2>
        <p class="bloc-sous">Les conditions de l'Éveil.</p>
        <ol class="pas">
          ${A.pas.map(function (p, i) { return h`<li><span class="num" aria-hidden="true">${ROMAINS[i]}</span><h3>${p.titre}</h3><p>${p.texte}</p></li>`; })}
        </ol>
      </div></section>

      <section class="bloc"><div class="cadre">
        <h2 class="bloc-titre">Ceux qui vous accueillent</h2>
        <p class="bloc-sous">Les neuf Apôtres, voix de l'Éveil. Ouvrez leur livre pour lire leur Vie.</p>
        <ul class="voix-liste">
          ${L.apotres.map(function (a) {
            return h`<li><a href="#/apotres/${a.id}"><span class="num">${a.num}</span><q>${a.citation}</q><span class="qui">${a.nom}<span>${a.titre}</span></span></a></li>`;
          })}
        </ul>
      </div></section>`,
      apres: function () {
        lancerBraises(main.querySelector('.braises'));
        dessinerUnivers();
      },
    };
  }

  function vueFoi() {
    var F = L.foi;
    return {
      titre: 'La Foi',
      html: h`
      ${passage('foi', null, 330)}
      ${tete('La Foi', F.titre, null)}
      <section class="bloc" style="padding-top:0"><div class="cadre prose">${paragraphes(F.intro)}</div></section>

      <section class="bloc"><div class="cadre">
        <h2 class="bloc-titre">Les trois préceptes</h2>
        <div class="preceptes">
          ${F.preceptes.map(function (p) { return h`<article class="precepte"><span class="latin">${p.latin}</span><h3>${p.titre}</h3><p>${p.texte}</p></article>`; })}
        </div>
      </div></section>

      <section class="bloc"><div class="cadre">
        <h2 class="bloc-titre">Les symboles de la foi</h2>
        <div class="blason-bloc">
          <div>${image('blason', 'Blason du Bon du Bien', '')}<p class="devise" style="margin-top:20px">« ${L.devise} »</p></div>
          <div>
            <dl class="definitions">
              ${F.symboles.map(function (s) { return h`<div><dt>${s.nom}</dt><dd>${s.texte}</dd></div>`; })}
              ${F.couleurs.map(function (c) { return h`<div><dt><span class="couleur-pastille couleur-${c.cle}" aria-hidden="true"></span>${c.nom}</dt><dd>${c.texte}</dd></div>`; })}
            </dl>
          </div>
        </div>
      </div></section>

      <section class="bloc"><div class="cadre">
        <h2 class="bloc-titre">Plusieurs manières de croire</h2>
        <p class="bloc-sous">${F.croyants.intro}</p>
        <div class="deux-colonnes">
          <div>
            <p class="etiquette">Les croyants religieux</p>
            ${F.croyants.religieux.map(function (r) { return h`<h3 style="font-size:1.3rem;margin:22px 0 10px">${r.titre}</h3><p style="color:var(--cendre)">${r.texte}</p>`; })}
          </div>
          <div>
            <p class="etiquette">Les non-croyants</p>
            <p style="color:var(--cendre)">Parmi eux, plusieurs visions coexistent :</p>
            <ul class="liste-simple">${F.croyants.nonCroyants.map(function (t) { return h`<li>${t}</li>`; })}</ul>
          </div>
        </div>
        <blockquote class="citation" style="margin-top:56px"><p>« ${F.croyants.citation.texte} »</p><footer>${F.croyants.citation.auteur}</footer></blockquote>
      </div></section>

      <section class="bloc"><div class="cadre">
        <h2 class="bloc-titre">${F.religion.titre}</h2>
        <div class="prose"><p style="font-size:1.25rem">${F.religion.texte}</p></div>
      </div></section>

      <section class="bloc"><div class="cadre">
        <h2 class="bloc-titre">Une foi qui agit</h2>
        <div class="deux-colonnes">
          ${F.concept.map(function (c) { return h`<div><h3 style="font-size:1.35rem;margin-bottom:12px">${c.titre}</h3><p style="color:var(--cendre)">${c.texte}</p></div>`; })}
        </div>
      </div></section>

      <section class="bloc echo"><div class="cadre">
        <h2 class="bloc-titre">Écho Mortis</h2>
        <p class="source">${F.echo.source}</p>
        <blockquote class="citation"><p>« ${F.echo.citation} »</p><footer>${F.echo.auteur}</footer></blockquote>
        <p class="intro">${F.echo.intro}</p>
        <div class="echo-chapitres">
          ${F.echo.chapitres.map(function (c, i) { return h`<article class="echo-chapitre"><span class="num">Chapitre ${ROMAINS[i]}</span><div><h3>${c.titre}</h3>${paragraphes(c.texte)}</div></article>`; })}
        </div>
      </div></section>`,
    };
  }

  function vueOrigines() {
    var O = L.origines;
    return {
      titre: 'Les Origines',
      html: h`
      ${passage('origines', null, 360)}
      ${tete('Les Origines', O.titre, O.intro)}
      <section class="bloc" style="padding-top:0"><div class="cadre">
        <p class="devise" style="margin-bottom:56px">« ${L.devise} » : le serment gravé.</p>
        <ol class="chronologie">
          <li aria-hidden="true" class="chronologie-feu"></li>
          ${O.generations.map(function (g) {
            return h`<li class="generation">
              <span class="marque-gen" aria-hidden="true"><svg viewBox="0 0 64 58"><path d="M32 2 62 56H2Z"/></svg><span>${g.num}</span></span>
              <p class="nom-gen">${g.num === 'I' ? 'Iʳᵉ' : g.num + 'ᵉ'} génération : ${g.nom}</p>
              <h2>${g.titre}</h2>
              <p>${g.texte}</p>
              <ul class="faits">
                ${g.faits.map(function (f) {
                  return h`<li><span class="date">${f.date}</span><h3>${f.titre}</h3><p>${f.texte}</p>${f.lien ? h`<a class="lien-fleche" href="#/${f.lien}">Lire la chronique</a>` : ''}</li>`;
                })}
              </ul>
            </li>`;
          })}
        </ol>
      </div></section>`,
      apres: function () { suivreChronologie(); },
    };
  }

  var ALIAS_BRANCHES = { moines: 'clerge', templiers: 'temple', fidele: 'fideles' };

  function vueBranches(id) {
    var B = L.branches;
    id = ALIAS_BRANCHES[id] || id;
    var ouverte = B.liste.filter(function (b) { return b.id === id; })[0];
    return {
      titre: ouverte ? ouverte.nom : 'Les Branches',
      html: h`
      ${passage('branches', null, 300)}
      ${tete('Les Branches', 'Une seule Voix, trois branches égales', null)}
      <section class="bloc" style="padding-top:0"><div class="cadre">
        <div class="voix-bloc"><h2>${B.voix.titre}</h2><p class="sous">${B.voix.sous}</p><p>${B.voix.texte}</p></div>
        <div class="branches">
          ${B.liste.map(function (b) {
            var lien = b.id === 'clerge' ? 'Grades et pôles' : b.id === 'fideles' ? 'Statut et devoirs' : 'Grades et ordres';
            return h`<article class="branche ${ouverte === b ? 'est-ouverte' : ''}" data-couleur="${b.couleur}">
              <div class="branche-image">${image(b.image, '', '')}</div>
              <div class="branche-corps"><h3>${b.nom}</h3><p class="sous">${b.sous}</p><p>${b.resume}</p>
                <a class="lien-fleche" href="#/branches${ouverte === b ? '' : '/' + b.id}" ${ouverte === b ? brut('aria-expanded="true"') : ''}>${ouverte === b ? 'Refermer' : lien}</a>
              </div>
            </article>`;
          })}
        </div>
        ${ouverte ? detailBranche(ouverte) : ''}
      </div></section>`,
      cible: ouverte ? '.detail-branche' : null,
    };
  }

  function detailBranche(b) {
    return h`<section class="detail-branche" data-couleur="${b.couleur}" aria-labelledby="titre-branche">
      <h2 id="titre-branche" tabindex="-1">${b.nom}</h2>
      <p class="sous">${b.sous}</p>
      <div class="prose">${paragraphes(b.texte)}</div>
      ${b.grades ? h`<h3>Les grades</h3><ol class="echelle">${b.grades.map(function (g, i) {
        return h`<li style="--rang:${i}"><h4>${g.nom}</h4><p class="niveau">${g.niveau}</p><p>${g.texte}</p></li>`;
      })}</ol>` : ''}
      ${b.devoirs ? h`<h3>${b.devoirsTitre}</h3><ul class="liste-simple" style="max-width:var(--lecture)">${b.devoirs.map(function (d) { return h`<li>${d}</li>`; })}</ul>` : ''}
      ${b.poles ? h`<h3>${b.polesTitre}</h3><ul class="poles">${b.poles.map(function (p) {
        return h`<li><span class="sigle" aria-hidden="true">${p.sigle}</span><div><h4>${p.nom}</h4>${p.sous ? h`<p class="sous">${p.sous}</p>` : ''}<p>${p.texte}</p></div></li>`;
      })}</ul>` : ''}
      ${b.legions ? h`<h3>Les légions renommées de l'Ordo Sagitta Custodia</h3><p style="color:var(--cendre);max-width:var(--lecture)">${b.legions.intro}</p>
        <div class="legions">${b.legions.liste.map(function (l) {
          return h`<article class="legion">${image(l.image, l.alt, '')}<div><h4 style="font-size:1.3rem">${l.nom}</h4><p class="rang">${l.rang}</p><q>${l.devise}</q><p class="specialite">Spécialité : ${l.specialite}</p></div></article>`;
        })}</div>` : ''}
      ${b.radio ? h`<h3>Le vocabulaire radio</h3><dl class="radio">${b.radio.map(function (r) { return h`<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`; })}</dl>` : ''}
    </section>`;
  }

  function vueApotres() {
    return {
      titre: 'Les Apôtres',
      html: h`
      ${passage('apotres', null, 320)}
      ${tete('Les Apôtres', 'Les Neuf Apôtres', L.apotresIntro)}
      <section class="bloc" style="padding-top:0"><div class="cadre">
        <nav class="rayon" aria-label="Le rayon des Vies">
          ${L.apotres.map(function (a, i) {
            var hauteur = [380, 352, 396, 366, 404, 344, 374, 390, 358][i];
            return h`<a class="livre" href="#/apotres/${a.id}" data-cuir="${a.dossier ? 'dossier' : i % 8}" style="--h:${hauteur}px">
              <span class="num">${a.num}</span>
              <span class="nom">${a.nom}</span>
              <svg class="livre-triangle" viewBox="0 0 14 12" aria-hidden="true"><path d="M7 0 14 12H0Z"/></svg>
              <span class="ecran-lecteur">, ${a.titre}</span>
            </a>`;
          })}
        </nav>
        <p class="rayon-aide">Tirez un livre pour lire la Vie de l'Apôtre.</p>
      </div></section>
      <section class="bloc"><div class="cadre">
        <h2 class="bloc-titre">Les Vies des Apôtres</h2>
        <ul class="voix-liste">
          ${L.apotres.map(function (a) {
            return h`<li><a href="#/apotres/${a.id}"><span class="num">${a.num} · ${a.chapitres.length} chapitres</span><q>${a.citation}</q><span class="qui">${a.nom}<span>${a.titre}</span></span></a></li>`;
          })}
        </ul>
      </div></section>`,
    };
  }

  function vueApotre(id) {
    var i = L.apotres.findIndex(function (a) { return a.id === id; });
    if (i < 0) return null;
    var a = L.apotres[i];
    var prec = L.apotres[(i + L.apotres.length - 1) % L.apotres.length];
    var suiv = L.apotres[(i + 1) % L.apotres.length];
    return {
      titre: a.nom + ', ' + a.titre,
      classe: a.dossier ? 'dossier' : '',
      html: h`
      <div class="progression" aria-hidden="true"></div>
      <header class="page-tete"><div class="cadre">
        <a class="retour" href="#/apotres">‹ Remettre au rayon</a>
        ${a.dossier ? h`<p class="tampon">Dossier classifié · Bureau</p>` : ''}
        <div class="vie-tete">
          <span class="vie-num" aria-hidden="true">${a.num}</span>
          <div>
            <h1 tabindex="-1">${a.nom}</h1>
            <p class="titre-apotre">${a.titre}</p>
            <blockquote class="citation"><p>« ${a.citation} »</p></blockquote>
          </div>
        </div>
      </div></header>
      <section class="bloc" style="padding-top:0"><div class="cadre livre-ouvert">
        ${sommaire(a.chapitres)}
        <article>
          ${a.chapitres.map(function (c, n) {
            var corps = c.source
              ? h`<div class="ecriture"><p class="source">${c.source}</p>${paragraphes(c.texte)}</div>`
              : paragraphes(c.texte);
            return h`<section class="chapitre ${c.scelle ? 'scelle' : ''}" id="chapitre-${n + 1}">
              <span class="num">Chapitre ${ROMAINS[n]}</span>
              <h2>${c.titre}</h2>
              ${corps}
              ${c.lien ? h`<a class="lien-fleche" href="#/${c.lien.route}">${c.lien.texte}</a>` : ''}
            </section>`;
          })}
          <nav class="suite" aria-label="Autres Apôtres">
            <a href="#/apotres/${prec.id}"><small>Livre précédent</small><strong>${prec.nom}</strong></a>
            <a href="#/apotres/${suiv.id}"><small>Livre suivant</small><strong>${suiv.nom}</strong></a>
          </nav>
        </article>
      </div></section>`,
      apres: function () { suivreLecture(); },
    };
  }

  function sommaire(chapitres) {
    return h`<details class="sommaire" open>
      <summary>Sommaire</summary>
      <ol>${chapitres.map(function (c, n) {
        return h`<li><a href="#chapitre-${n + 1}" data-chapitre="${n + 1}"><span>${ROMAINS[n]}</span><span>${c.titre}</span></a></li>`;
      })}</ol>
    </details>`;
  }

  function vueReliques() {
    return {
      titre: 'Les Reliques',
      html: h`
      ${passage('reliques', null, 340)}
      ${tete('Les Reliques', 'Les objets sacrés', L.reliquesIntro)}
      <section class="bloc" style="padding-top:0"><div class="cadre">
        <ul class="reliquaire">
          ${L.reliques.map(function (r) {
            return h`<li class="${r.perdue ? 'est-perdue' : ''}"><a href="#/reliques/${r.id}">
              <span class="vitrine">${dessinRelique(r.forme)}</span>
              <span><h2>${r.nom}</h2><span class="statut">${r.statut}</span></span>
            </a></li>`;
          })}
        </ul>
      </div></section>`,
    };
  }

  function vueRelique(id) {
    var r = L.reliques.filter(function (x) { return x.id === id; })[0];
    if (!r) return null;
    return {
      titre: r.nom,
      html: h`
      ${tete(null, r.nom, null, ['#/reliques', 'Les objets sacrés'])}
      <section class="bloc" style="padding-top:0"><div class="cadre relique-detail ${r.perdue ? 'est-perdue' : ''}">
        <span class="vitrine">${dessinRelique(r.forme)}</span>
        <div class="prose">
          <span class="statut">${r.statut}</span>
          ${paragraphes(r.texte)}
          ${r.lien ? h`<a class="lien-fleche" href="#/${r.lien.route}">${r.lien.texte}</a>` : ''}
        </div>
      </div></section>
      <section class="bloc"><div class="cadre">
        <h2 class="bloc-titre" style="font-size:1.4rem">Les autres reliques</h2>
        <ul class="reliquaire">
          ${L.reliques.filter(function (x) { return x !== r; }).map(function (x) {
            return h`<li class="${x.perdue ? 'est-perdue' : ''}"><a href="#/reliques/${x.id}"><span class="vitrine">${dessinRelique(x.forme)}</span><span><h2>${x.nom}</h2><span class="statut">${x.statut}</span></span></a></li>`;
          })}
        </ul>
      </div></section>`,
    };
  }

  function vueChroniques() {
    return {
      titre: 'Les Chroniques',
      html: h`
      ${passage('chroniques', null, 320)}
      ${tete('Les Chroniques', 'Les récits de guerre', L.chroniquesIntro)}
      <section class="bloc" style="padding-top:0"><div class="cadre">
        <div class="guerres">
          ${L.chroniques.map(function (c) {
            return h`<a class="guerre" href="#/chroniques/${c.id}">
              <span class="rang-guerre">${c.guerre}</span>
              <span><h2>${c.titre}</h2><p>${c.resume}</p><span class="bilan">${c.bilan}</span></span>
              <span class="lien-fleche">Lire le récit</span>
            </a>`;
          })}
        </div>
      </div></section>`,
    };
  }

  function paragrapheRecit(p) {
    // « Le Bureau a gardé l'ordre. Il a rayé le juron. » : on montre la rature.
    if (p.indexOf('foutus psychopathes') >= 0) {
      var morceaux = p.split('foutus');
      return h`<p>${morceaux[0]}<span class="raye">foutus</span>${morceaux.slice(1).join('foutus')}</p>`;
    }
    return h`<p>${p}</p>`;
  }

  function vueChronique(id) {
    var i = L.chroniques.findIndex(function (c) { return c.id === id; });
    if (i < 0) return null;
    var c = L.chroniques[i];
    var suiv = L.chroniques[(i + 1) % L.chroniques.length];
    var prec = L.chroniques[(i + L.chroniques.length - 1) % L.chroniques.length];
    return {
      titre: c.titre,
      html: h`
      <div class="progression" aria-hidden="true"></div>
      ${tete(c.guerre, c.titre, c.resume, ['#/chroniques', 'Retour aux Chroniques'])}
      <section class="bloc recit" style="padding-top:0"><div class="cadre">
        <p class="devise" style="margin:-12px 0 48px">${c.bilan}</p>
        <div class="livre-ouvert">
          ${sommaire(c.chapitres)}
          <article>
            ${c.chapitres.map(function (ch, n) {
              return h`<section class="chapitre" id="chapitre-${n + 1}">
                <span class="num">Chapitre ${ROMAINS[n]}</span>
                <h2>${ch.titre}</h2>
                ${String(ch.texte).split(/\n\s*\n/).map(function (p) { return paragrapheRecit(p.trim()); })}
                ${ch.censure ? h`<div class="censure" role="img" aria-label="Passage censuré par le Bureau"><span></span><span></span><span></span><span></span></div>` : ''}
              </section>`;
            })}
            <nav class="suite" aria-label="Autres chroniques">
              <a href="#/chroniques/${prec.id}"><small>${prec.guerre}</small><strong>${prec.titre}</strong></a>
              <a href="#/chroniques/${suiv.id}"><small>${suiv.guerre}</small><strong>${suiv.titre}</strong></a>
            </nav>
          </article>
        </div>
      </div></section>`,
      apres: function () { suivreLecture(); },
    };
  }

  function vueCode(id) {
    var C = L.code;
    if (id === 'regles' || !id) id = 'bdb';
    var t = C.textes.filter(function (x) { return x.id === id; })[0];
    if (!t) return null;
    var total = t.sections.reduce(function (n, s) { return n + s.regles.length; }, 0);
    return {
      titre: t.nom,
      html: h`
      ${passage('code', null, 300)}
      ${tete(C.sous, C.titre, C.intro)}
      <section class="bloc" style="padding-top:0"><div class="cadre">
        <nav class="onglets" aria-label="Les deux textes">
          ${C.textes.map(function (x) { return h`<a href="#/code/${x.id}" ${x === t ? brut('aria-current="page"') : ''}>${x.nom}</a>`; })}
        </nav>
        <div class="recherche" role="search">
          <label for="chercher">Chercher dans le texte</label>
          <input id="chercher" type="search" autocomplete="off" placeholder="Par exemple : hiérarchie, arme, jugement">
          <output for="chercher" aria-live="polite">${total} ${t.unite}s</output>
        </div>
        <div class="code-corps">
          <ol class="code-sections" aria-label="Sections">
            ${t.sections.map(function (s) { return h`<li><button type="button" data-aller="section-${s.num}"><span>${s.num}</span><span>${s.titre}</span></button></li>`; })}
          </ol>
          <div>
            <div class="preambule"><h2>Préambule</h2>${t.preambule.map(function (p) { return h`<p>${p}</p>`; })}</div>
            <div data-sections>
              ${t.sections.map(function (s) {
                return h`<section class="section-code" id="section-${s.num}">
                  <header><span class="num">${s.num}</span><h2>${s.titre}</h2><small>${s.regles.length} ${t.unite}${s.regles.length > 1 ? 's' : ''}</small></header>
                  <ol class="regles">${s.regles.map(function (r) {
                    return h`<li class="regle"><span class="ref">${t.unite === 'article' ? 'Art. ' + r[0] : r[0]}</span><p data-texte="${r[1]}">${r[1]}</p></li>`;
                  })}</ol>
                </section>`;
              })}
            </div>
            <p class="vide" hidden data-vide>Aucune ${t.unite} ne contient ce mot. Essayez un autre terme, ou videz la recherche pour tout afficher.</p>
            <div class="avis"><h2>${t.final.titre}</h2><p>${t.final.texte}</p></div>
          </div>
        </div>
      </div></section>`,
      cibleMeme: '.onglets',
      apres: function () { brancherRecherche(t, total); },
    };
  }

  function vueIntrouvable() {
    return {
      titre: 'Page introuvable',
      html: h`<section class="introuvable"><div class="cadre">
        <h1 tabindex="-1">Cette page n'existe pas</h1>
        <p>Le lien est peut-être ancien. Revenez au seuil pour retrouver votre chemin.</p>
        <a class="bouton bouton-trait" href="#/">Revenir à l'accueil</a>
      </div></section>`,
    };
  }

  /* ------------------------------------------------------------------
     Navigation entre les pages
  ------------------------------------------------------------------ */
  function vuePour(chemin) {
    var p = chemin.split('/');
    switch (p[0]) {
      case '': case 'accueil': return vueAccueil();
      case 'foi': return vueFoi();
      case 'origines': return vueOrigines();
      case 'branches': return vueBranches(p[1]);
      case 'apotres': return p[1] ? vueApotre(p[1]) : vueApotres();
      case 'reliques': return p[1] ? vueRelique(p[1]) : vueReliques();
      case 'chroniques': return p[1] ? vueChronique(p[1]) : vueChroniques();
      case 'code': case 'regles': return vueCode(p[1]);
      default: return null;
    }
  }

  var dernierChemin = null;

  function afficher() {
    var adresse = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    // Une ancre interne (#chapitre-3) ne change pas de page.
    if (/^(chapitre|section)-/.test(adresse)) return;
    var chemin = adresse.replace(/\/+$/, '');
    if (chemin === dernierChemin) return;
    var memeSection = dernierChemin !== null && chemin.split('/')[0] === dernierChemin.split('/')[0] && /^(branches|code|regles)$/.test(chemin.split('/')[0]);
    dernierChemin = chemin;

    nettoyages.forEach(function (f) { f(); });
    nettoyages = [];
    fermerMenu();

    var vue = vuePour(chemin) || vueIntrouvable();
    document.body.className = vue.classe || '';
    main.innerHTML = vue.html.s;
    document.title = vue.titre === 'Le Bon du Bien' ? 'Le Bon du Bien' : vue.titre + ' · Le Bon du Bien';

    var section = chemin.split('/')[0];
    document.querySelectorAll('.nav-liens a[data-section]').forEach(function (a) {
      if (a.getAttribute('data-section') === section || (section === 'regles' && a.getAttribute('data-section') === 'code')) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    var passageEl = main.querySelector('.passage');
    if (passageEl && window.LBDB_PASSAGES) nettoyages.push(window.LBDB_PASSAGES.monter(passageEl, passageEl.getAttribute('data-passage'), RELIQUES_DESSINS));

    if (memeSection && vue.cibleMeme) {
      var garde = main.querySelector(vue.cibleMeme);
      if (garde) window.scrollTo(0, garde.getBoundingClientRect().top + window.scrollY - 140);
    } else if (vue.cible) {
      var cible = main.querySelector(vue.cible);
      if (cible) {
        cible.scrollIntoView({ block: 'start', behavior: memeSection && !mouvementReduit.matches ? 'smooth' : 'auto' });
        var titre = cible.querySelector('[tabindex="-1"]');
        if (titre) titre.focus({ preventScroll: true });
      }
    } else if (!memeSection) {
      window.scrollTo(0, 0);
      var h1 = main.querySelector('h1');
      if (h1 && dernierChemin !== '' && document.readyState === 'complete') h1.focus({ preventScroll: true });
    }
    if (vue.apres) vue.apres();
  }

  /* Liens de sommaire : on fait défiler sans changer de page. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#chapitre-"], a[href^="#section-"]');
    if (a) {
      e.preventDefault();
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) el.scrollIntoView({ behavior: mouvementReduit.matches ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    var b = e.target.closest('[data-aller]');
    if (b) {
      var s = document.getElementById(b.getAttribute('data-aller'));
      if (s) s.scrollIntoView({ behavior: mouvementReduit.matches ? 'auto' : 'smooth', block: 'start' });
    }
    if (e.target.closest('[data-passer]')) {
      var arrivee = document.getElementById('arrivee');
      if (arrivee) {
        window.scrollTo(0, arrivee.getBoundingClientRect().top + window.scrollY - 80);
        var t = arrivee.querySelector('h1, h2');
        if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
      }
    }
    if (e.target.closest('[data-evitement]')) {
      e.preventDefault();
      main.focus();
      main.scrollIntoView();
    }
  });

  /* ------------------------------------------------------------------
     Menu sur téléphone
  ------------------------------------------------------------------ */
  var menuBouton = document.querySelector('.menu-bouton');
  function fermerMenu() {
    document.body.classList.remove('menu-ouvert');
    document.documentElement.classList.remove('menu-ouvert');
    menuBouton.setAttribute('aria-expanded', 'false');
    menuBouton.setAttribute('aria-label', 'Ouvrir le menu');
  }
  menuBouton.addEventListener('click', function () {
    var ouvert = menuBouton.getAttribute('aria-expanded') === 'true';
    if (ouvert) { fermerMenu(); return; }
    document.documentElement.classList.add('menu-ouvert');
    menuBouton.setAttribute('aria-expanded', 'true');
    menuBouton.setAttribute('aria-label', 'Fermer le menu');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermerMenu(); });

  /* ------------------------------------------------------------------
     Rejoindre l'Éveil : choix de l'univers, retenu dans le navigateur.
  ------------------------------------------------------------------ */
  var CLE_UNIVERS = 'lbdb-univers';
  function universChoisi() {
    try {
      var v = localStorage.getItem(CLE_UNIVERS);
      if (v) { try { v = JSON.parse(v); } catch (err) { /* ancienne valeur brute */ } }
      return L.univers.some(function (u) { return u.id === v; }) ? v : 'neutre';
    } catch (err) { return 'neutre'; }
  }
  function retenirUnivers(id) {
    try { localStorage.setItem(CLE_UNIVERS, JSON.stringify(id)); } catch (err) { /* sans stockage */ }
    dessinerUnivers();
  }
  function dessinerUnivers() {
    var choisi = universChoisi();
    document.querySelector('[data-liste-univers]').innerHTML = L.univers.map(function (u) {
      return h`<li><a href="${u.lien}" target="_blank" rel="noopener noreferrer" data-univers="${u.id}" class="${u.id === choisi ? 'choisi' : ''}">${u.nom}<small>${u.id === choisi ? 'votre univers' : 'Discord'}</small></a></li>`.s;
    }).join('');
    var boutons = L.univers.map(function (u) {
      return h`<button type="button" data-choisir="${u.id}" aria-pressed="${u.id === choisi ? 'true' : 'false'}">${u.nom}</button>`.s;
    }).join('');
    document.querySelectorAll('[data-choix-univers], [data-plaques]').forEach(function (el) { el.innerHTML = boutons; });
    var lien = L.univers.filter(function (u) { return u.id === choisi; })[0].lien;
    document.querySelectorAll('[data-lien-univers]').forEach(function (a) { a.href = lien; });
  }
  var dialogue = document.getElementById('rejoindre');
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-rejoindre]')) {
      fermerMenu();
      if (typeof dialogue.showModal === 'function') dialogue.showModal();
      else window.open(L.univers.filter(function (u) { return u.id === universChoisi(); })[0].lien, '_blank', 'noopener');
      return;
    }
    var choix = e.target.closest('[data-choisir]');
    if (choix) { retenirUnivers(choix.getAttribute('data-choisir')); return; }
    var lien = e.target.closest('[data-univers]');
    if (lien) { retenirUnivers(lien.getAttribute('data-univers')); setTimeout(function () { dialogue.close(); }, 0); }
  });
  dialogue.querySelector('[data-fermer]').addEventListener('click', function () { dialogue.close(); });
  dialogue.addEventListener('click', function (e) { if (e.target === dialogue) dialogue.close(); });

  /* ------------------------------------------------------------------
     Les braises du seuil : quelques points de lumière qui montent.
  ------------------------------------------------------------------ */
  function lancerBraises(canvas) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, hh = 0, braises = [], raf = 0, visible = true;
    function dimensionner() {
      var r = canvas.getBoundingClientRect();
      w = r.width; hh = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(hh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, w / 18));
      braises = [];
      for (var i = 0; i < n; i++) braises.push(nouvelle(true));
    }
    function nouvelle(partout) {
      return {
        x: Math.random() * w,
        y: partout ? Math.random() * hh : hh + 10,
        r: .6 + Math.random() * 1.8,
        v: .15 + Math.random() * .45,
        derive: (Math.random() - .5) * .25,
        phase: Math.random() * Math.PI * 2,
        rouge: Math.random() < .55,
      };
    }
    function dessiner(t) {
      ctx.clearRect(0, 0, w, hh);
      for (var i = 0; i < braises.length; i++) {
        var b = braises[i];
        var a = (.35 + .35 * Math.sin(t / 700 + b.phase)) * Math.min(1, b.y / (hh * .35));
        ctx.fillStyle = b.rouge ? 'rgba(232,96,52,' + a.toFixed(3) + ')' : 'rgba(255,240,210,' + (a * .9).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    function avancer(t) {
      raf = requestAnimationFrame(avancer);
      if (!visible || document.hidden) return;
      for (var i = 0; i < braises.length; i++) {
        var b = braises[i];
        b.y -= b.v; b.x += b.derive + Math.sin(t / 1600 + b.phase) * .12;
        if (b.y < -10) braises[i] = nouvelle(false);
      }
      dessiner(t);
    }
    dimensionner();
    window.addEventListener('resize', dimensionner);
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }) : null;
    if (io) io.observe(canvas);
    if (mouvementReduit.matches) dessiner(0);
    else raf = requestAnimationFrame(avancer);
    nettoyages.push(function () {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', dimensionner);
      if (io) io.disconnect();
    });
  }

  /* La ligne des Origines s'embrase au fil de la lecture. */
  function suivreChronologie() {
    var liste = main.querySelector('.chronologie');
    var feu = main.querySelector('.chronologie-feu');
    if (!liste || !feu) return;
    function maj() {
      var r = liste.getBoundingClientRect();
      var parcouru = mouvementReduit.matches ? r.height : Math.max(0, Math.min(r.height, window.innerHeight * .6 - r.top));
      feu.style.height = parcouru + 'px';
    }
    maj();
    window.addEventListener('scroll', maj, { passive: true });
    window.addEventListener('resize', maj);
    nettoyages.push(function () { window.removeEventListener('scroll', maj); window.removeEventListener('resize', maj); });
  }

  /* Barre de progression et chapitre en cours, pour les Vies et les Chroniques. */
  function suivreLecture() {
    var barre = main.querySelector('.progression');
    var article = main.querySelector('.livre-ouvert article');
    var liens = Array.prototype.slice.call(main.querySelectorAll('.sommaire a'));
    var chapitres = Array.prototype.slice.call(main.querySelectorAll('.chapitre'));
    var etroit = window.matchMedia('(max-width: 900px)');
    var sommaire = main.querySelector('.sommaire');
    if (sommaire && etroit.matches) sommaire.removeAttribute('open');
    function maj() {
      if (barre && article) {
        var r = article.getBoundingClientRect();
        var p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - window.innerHeight * .7)));
        barre.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      }
      var actif = 0;
      for (var i = 0; i < chapitres.length; i++) if (chapitres[i].getBoundingClientRect().top < window.innerHeight * .35) actif = i;
      liens.forEach(function (a, i) { a.classList.toggle('actif', i === actif); });
    }
    maj();
    window.addEventListener('scroll', maj, { passive: true });
    window.addEventListener('resize', maj);
    nettoyages.push(function () { window.removeEventListener('scroll', maj); window.removeEventListener('resize', maj); });
  }

  /* Recherche dans le Code : filtre et surligne, accents compris. */
  function plier(c) {
    var p = c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    return p.length === 1 ? p : c.toLowerCase();
  }
  function surligner(texte, requete) {
    var plie = Array.prototype.map.call(texte, plier).join('');
    var q = Array.prototype.map.call(requete, plier).join('');
    var out = '', i = 0, j;
    while ((j = plie.indexOf(q, i)) >= 0) {
      out += esc(texte.slice(i, j)) + '<mark>' + esc(texte.slice(j, j + q.length)) + '</mark>';
      i = j + q.length;
    }
    return out + esc(texte.slice(i));
  }
  function brancherRecherche(t, total) {
    var champ = main.querySelector('#chercher');
    var sortie = main.querySelector('.recherche output');
    var vide = main.querySelector('[data-vide]');
    function filtrer() {
      var q = champ.value.trim();
      var qp = Array.prototype.map.call(q, plier).join('');
      var trouves = 0;
      main.querySelectorAll('.section-code').forEach(function (s) {
        var dansSection = 0;
        s.querySelectorAll('.regle').forEach(function (li) {
          var p = li.querySelector('p');
          var texte = p.getAttribute('data-texte');
          var ref = li.querySelector('.ref').textContent;
          var ok = !qp || Array.prototype.map.call(texte + ' ' + ref, plier).join('').indexOf(qp) >= 0;
          li.hidden = !ok;
          p.innerHTML = qp && ok ? surligner(texte, q) : esc(texte);
          if (ok) { dansSection++; trouves++; }
        });
        s.hidden = dansSection === 0;
      });
      vide.hidden = trouves > 0;
      sortie.textContent = qp ? trouves + ' ' + t.unite + (trouves > 1 ? 's' : '') + ' sur ' + total : total + ' ' + t.unite + 's';
    }
    champ.addEventListener('input', filtrer);
  }

  /* ------------------------------------------------------------------
     Démarrage
  ------------------------------------------------------------------ */
  document.querySelector('[data-pied-texte]').textContent = L.accueil.pied.join(' ');
  dessinerUnivers();
  window.addEventListener('hashchange', afficher);
  afficher();
})();
