/*
 * Les passages : en haut de chaque grande page, on avance au défilement
 * jusqu'à un lieu. L'accueil fait entrer dans l'église et remonter la nef ;
 * chaque section mène ailleurs (la verrière, la crypte, la bibliothèque…).
 *
 * Principe : chaque lieu est une suite de « plans » dessinés en SVG, posés à
 * une profondeur. Le défilement fait avancer une caméra ; chaque plan grandit
 * à mesure qu'on s'en approche (échelle = 1 / (1 + distance)), puis disparaît
 * quand on l'a franchi. Aucun fichier externe : tout marche en double-clic.
 */
window.LBDB_PASSAGES = (function () {
  'use strict';

  var L = window.LBDB;
  var VX = 800, VY = 560;                       // point de fuite, en unités de dessin (1600 × 1000)
  var OR = '#CFA54C', SANG = '#C62A20', LUM = '#FFF4DA', BLEU = '#7C9BD0', IVOIRE = '#EFE6D2';
  var ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

  function n(v) { return Math.round(v * 10) / 10; }
  var dernierVoile = null;                       // contour de la pierre du dernier mur dessiné (pour la pénombre)
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function alea(graine) {                       // hasard reproductible : les dessins restent identiques
    var s = graine >>> 0 || 7;
    return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 10000) / 10000; };
  }

  /* ------------------------------------------------------------------
     Matières partagées (dégradés, motifs)
  ------------------------------------------------------------------ */
  var DEFS = '<svg class="pg-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>' +
    '<linearGradient id="pg-pierre" gradientUnits="userSpaceOnUse" x1="0" y1="-700" x2="0" y2="1000">' +
      '<stop offset="0" stop-color="#120E0F"/><stop offset=".6" stop-color="#211A1B"/><stop offset="1" stop-color="#2E2425"/></linearGradient>' +
    '<linearGradient id="pg-pierre-crypte" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="1000">' +
      '<stop offset="0" stop-color="#0E0B0B"/><stop offset="1" stop-color="#2A211C"/></linearGradient>' +
    '<linearGradient id="pg-pilier-g" x1="0" x2="1"><stop offset="0" stop-color="#1A1415"/><stop offset=".7" stop-color="#2F2627"/><stop offset="1" stop-color="#4A3A33"/></linearGradient>' +
    '<linearGradient id="pg-pilier-d" x1="1" x2="0"><stop offset="0" stop-color="#1A1415"/><stop offset=".7" stop-color="#2F2627"/><stop offset="1" stop-color="#4A3A33"/></linearGradient>' +
    '<radialGradient id="pg-flamme"><stop offset="0" stop-color="#FFF8E6"/><stop offset=".3" stop-color="#FFD27A"/><stop offset=".65" stop-color="#E0392C" stop-opacity=".55"/><stop offset="1" stop-color="#E0392C" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="pg-halo"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".32"/><stop offset=".45" stop-color="#E08A3C" stop-opacity=".1"/><stop offset="1" stop-color="#E08A3C" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="pg-halo-blanc"><stop offset="0" stop-color="#FFF4DA" stop-opacity=".55"/><stop offset=".5" stop-color="#FFF4DA" stop-opacity=".12"/><stop offset="1" stop-color="#FFF4DA" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="pg-rayon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4DA" stop-opacity=".3"/><stop offset="1" stop-color="#FFF4DA" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="pg-bois" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A2E1E"/><stop offset="1" stop-color="#1E120C"/></linearGradient>' +
    '<linearGradient id="pg-or" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A5A22"/><stop offset=".5" stop-color="#E9CB7E"/><stop offset="1" stop-color="#7A5A22"/></linearGradient>' +
    '<linearGradient id="pg-sang" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A1812"/><stop offset=".5" stop-color="#C62A20"/><stop offset="1" stop-color="#6A140F"/></linearGradient>' +
    '<linearGradient id="pg-bleu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#26385C"/><stop offset=".5" stop-color="#4F6EA6"/><stop offset="1" stop-color="#1F2E4C"/></linearGradient>' +
    '<linearGradient id="pg-blanc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9D958A"/><stop offset=".5" stop-color="#EFE6D2"/><stop offset="1" stop-color="#8A8277"/></linearGradient>' +
    '<linearGradient id="pg-noir" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0D0B0B"/><stop offset=".5" stop-color="#2A2324"/><stop offset="1" stop-color="#0D0B0B"/></linearGradient>' +
    '<linearGradient id="pg-parchemin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C9B68E"/><stop offset=".48" stop-color="#EFE3C4"/><stop offset=".5" stop-color="#B8A47C"/><stop offset=".52" stop-color="#EFE3C4"/><stop offset="1" stop-color="#C9B68E"/></linearGradient>' +
    '<pattern id="pg-assises" width="180" height="90" patternUnits="userSpaceOnUse"><path d="M0 .5H180M0 45.5H180M45 0V45M135 45V90" stroke="#000" stroke-opacity=".38" stroke-width="2.5" fill="none"/><path d="M0 2.5H180M0 47.5H180" stroke="#FFF4DA" stroke-opacity=".035" stroke-width="2" fill="none"/></pattern>' +
    '<pattern id="pg-dalles" width="120" height="120" patternUnits="userSpaceOnUse"><path d="M0 .5H120M.5 0V120" stroke="#000" stroke-opacity=".45" stroke-width="2" fill="none"/></pattern>' +
    '</defs></svg>';

  /* ------------------------------------------------------------------
     Pièces de dessin
  ------------------------------------------------------------------ */

  // Le contour d'une ouverture (arche) : ogive, plein cintre, triangle ou linteau plat.
  function ouverture(o) {
    var g = VX - o.ouv, d = VX + o.ouv, p = o.pied, s = o.sommet;
    if (o.forme === 'plein') return 'M' + g + ' 1000V' + p + 'A' + o.ouv + ' ' + (p - s) + ' 0 0 1 ' + d + ' ' + p + 'V1000Z';
    if (o.forme === 'triangle') return 'M' + g + ' 1000V' + p + 'L' + VX + ' ' + s + 'L' + d + ' ' + p + 'V1000Z';
    if (o.forme === 'plat') return 'M' + g + ' 1000V' + s + 'H' + d + 'V1000Z';
    var h = p - s;
    return 'M' + g + ' 1000V' + p + 'C' + g + ' ' + n(p - h * .55) + ' ' + n(VX - o.ouv * .4) + ' ' + n(s + h * .1) + ' ' + VX + ' ' + s +
      'C' + n(VX + o.ouv * .4) + ' ' + n(s + h * .1) + ' ' + d + ' ' + n(p - h * .55) + ' ' + d + ' ' + p + 'V1000Z';
  }

  // Un mur percé d'une arche, avec ses piliers éclairés de l'intérieur.
  function mur(o) {
    var g = VX - o.ouv, d = VX + o.ouv;
    var trou = ouverture(o);
    var plein = 'M-3400 -3400H5000V1000H-3400Z' + trou;
    dernierVoile = plein;
    var larg = o.pilier || 120;
    var out = '<path d="' + plein + '" fill="url(#' + (o.pierre || 'pg-pierre') + ')" fill-rule="evenodd"/>' +
      '<path d="' + plein + '" fill="url(#pg-assises)" fill-rule="evenodd"/>';
    // piliers : la face tournée vers la nef prend la lumière
    out += '<rect x="' + (g - larg) + '" y="-1400" width="' + larg + '" height="2400" fill="url(#pg-pilier-g)"/>' +
      '<rect x="' + d + '" y="-1400" width="' + larg + '" height="2400" fill="url(#pg-pilier-d)"/>';
    if (o.forme !== 'plat') {
      out += '<rect x="' + (g - larg - 14) + '" y="' + (o.pied - 26) + '" width="' + (larg + 22) + '" height="26" fill="#3A2E2B"/>' +
        '<rect x="' + (d - 8) + '" y="' + (o.pied - 26) + '" width="' + (larg + 22) + '" height="26" fill="#3A2E2B"/>' +
        '<path d="M' + (g - larg - 14) + ' ' + (o.pied - 26) + 'h' + (larg + 22) + 'M' + (d - 8) + ' ' + (o.pied - 26) + 'h' + (larg + 22) + '" stroke="' + OR + '" stroke-opacity=".35" stroke-width="2"/>';
    }
    // bases des piliers
    out += '<rect x="' + (g - larg - 18) + '" y="940" width="' + (larg + 26) + '" height="60" fill="#2C2322"/>' +
      '<rect x="' + (d - 8) + '" y="940" width="' + (larg + 26) + '" height="60" fill="#2C2322"/>';
    // l'arête de l'arche, dorée par les flammes
    out += '<path d="' + trou + '" fill="none" stroke="#0A0808" stroke-width="22" stroke-opacity=".55"/>' +
      '<path d="' + trou + '" fill="none" stroke="' + (o.arete || OR) + '" stroke-opacity="' + (o.areteOpacite || .5) + '" stroke-width="3"/>';
    // clé de voûte gravée
    if (o.cle) {
      var y = (o.forme === 'plat' ? o.sommet : o.sommet) - 46;
      out += '<path d="M' + (VX - 46) + ' ' + (y - 34) + 'H' + (VX + 46) + 'L' + (VX + 34) + ' ' + (y + 44) + 'H' + (VX - 34) + 'Z" fill="#3A2E2B" stroke="' + OR + '" stroke-opacity=".5" stroke-width="2"/>' +
        '<text x="' + VX + '" y="' + (y + 22) + '" text-anchor="middle" class="pg-grave" font-size="40">' + esc(o.cle) + '</text>';
    }
    // joint du dallage au pied de ce plan
    out += '<path d="M-3400 1000H5000" stroke="' + OR + '" stroke-opacity=".14" stroke-width="2"/>';
    return out;
  }

  function flamme(x, y, t) {
    t = t || 1;
    return '<circle cx="' + x + '" cy="' + y + '" r="' + n(120 * t) + '" fill="url(#pg-halo)"/>' +
      '<g class="pg-flamme" style="transform-origin:' + x + 'px ' + (y + 16 * t) + 'px">' +
      '<ellipse cx="' + x + '" cy="' + y + '" rx="' + n(16 * t) + '" ry="' + n(30 * t) + '" fill="url(#pg-flamme)"/>' +
      '<ellipse cx="' + x + '" cy="' + n(y + 6 * t) + '" rx="' + n(5 * t) + '" ry="' + n(11 * t) + '" fill="#FFFBF0"/></g>';
  }

  function torche(x, y) {
    return '<path d="M' + (x - 10) + ' ' + (y + 30) + 'h20l-6 70h-8z" fill="#3A2A1E"/>' +
      '<path d="M' + (x - 22) + ' ' + (y + 30) + 'h44l-6 -12h-32z" fill="url(#pg-or)"/>' + flamme(x, y, 1.15);
  }

  function cierge(x, base, haut) {
    var top = base - haut;
    return '<path d="M' + (x - 34) + ' ' + base + 'h68l-14 -18h-40z" fill="url(#pg-or)"/>' +
      '<rect x="' + (x - 4) + '" y="' + (top + 40) + '" width="8" height="' + (haut - 58) + '" fill="url(#pg-or)"/>' +
      '<path d="M' + (x - 26) + ' ' + (top + 40) + 'h52l-8 -10h-36z" fill="url(#pg-or)"/>' +
      '<rect x="' + (x - 9) + '" y="' + (top - 4) + '" width="18" height="38" rx="3" fill="#EFE6D2"/>' + flamme(x, top - 22, .85);
  }

  function emblemeTriangle(x, y, t, couleur, trait) {
    var a = 'M' + x + ' ' + n(y - t) + 'L' + n(x + t * .9) + ' ' + n(y + t * .58) + 'H' + n(x - t * .9) + 'Z';
    return '<path d="' + a + '" fill="' + (couleur || 'none') + '"' + (trait ? ' stroke="' + trait + '" stroke-width="' + n(t * .09) + '" stroke-linejoin="round"' : '') + '/>';
  }

  function banniere(x, y, l, h, fond, motif, dechiree) {
    var bas = dechiree
      ? 'L' + (x + l) + ' ' + (y + h * .86) + 'L' + n(x + l * .8) + ' ' + (y + h) + 'L' + n(x + l * .62) + ' ' + n(y + h * .9) + 'L' + n(x + l * .44) + ' ' + n(y + h * .98) + 'L' + n(x + l * .28) + ' ' + n(y + h * .88) + 'L' + n(x + l * .12) + ' ' + n(y + h * .95) + 'L' + x + ' ' + n(y + h * .84)
      : 'L' + (x + l) + ' ' + (y + h) + 'L' + n(x + l / 2) + ' ' + n(y + h - l * .38) + 'L' + x + ' ' + (y + h);
    return '<path d="M' + (x - 12) + ' ' + (y - 4) + 'H' + (x + l + 12) + '" stroke="url(#pg-or)" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M' + x + ' ' + y + 'H' + (x + l) + bas + 'Z" fill="url(#' + fond + ')"/>' +
      '<path d="M' + (x + 8) + ' ' + y + 'V' + n(y + h * .8) + 'M' + (x + l - 8) + ' ' + y + 'V' + n(y + h * .8) + '" stroke="' + OR + '" stroke-opacity=".55" stroke-width="3"/>' +
      (motif || emblemeTriangle(x + l / 2, y + h * .36, l * .26, 'none', fond === 'pg-blanc' ? SANG : LUM));
  }

  function bancs(ouv) {
    var out = '';
    [-1, 1].forEach(function (c) {
      var x0 = c < 0 ? VX - ouv + 30 : VX + 140;
      var x1 = c < 0 ? VX - 140 : VX + ouv - 30;
      out += '<path d="M' + x0 + ' 1000V872H' + x1 + 'V1000Z" fill="url(#pg-bois)"/>' +
        '<path d="M' + x0 + ' 873H' + x1 + '" stroke="' + OR + '" stroke-opacity=".3" stroke-width="3"/>' +
        '<path d="M' + x0 + ' 912H' + x1 + '" stroke="#000" stroke-opacity=".4" stroke-width="3"/>';
      var bout = c < 0 ? x1 - 26 : x0;
      out += '<path d="M' + bout + ' 1000V846Q' + (bout + 13) + ' 826 ' + (bout + 26) + ' 846V1000Z" fill="#2A1A10" stroke="' + OR + '" stroke-opacity=".3" stroke-width="2"/>';
    });
    return out;
  }

  // Lancette de vitrail : une fenêtre étroite en ogive, plombée.
  function lancette(x, y, l, h, couleurs, graine) {
    var r = alea(graine), out = '';
    var forme = 'M' + x + ' ' + (y + h) + 'V' + n(y + l * .9) + 'Q' + x + ' ' + y + ' ' + n(x + l / 2) + ' ' + y + 'Q' + (x + l) + ' ' + y + ' ' + (x + l) + ' ' + n(y + l * .9) + 'V' + (y + h) + 'Z';
    out += '<path d="' + forme + '" fill="#0B0909"/>';
    var lignes = 7, cols = 2, ph = h / lignes;
    for (var i = 0; i < lignes; i++) for (var j = 0; j < cols; j++) {
      var c = couleurs[Math.floor(r() * couleurs.length)];
      out += '<rect x="' + n(x + j * l / cols) + '" y="' + n(y + i * ph) + '" width="' + n(l / cols) + '" height="' + n(ph) + '" fill="' + c + '" fill-opacity="' + n(.55 + r() * .4) + '"/>';
    }
    out += '<path d="' + forme + '" fill="none" stroke="#0B0909" stroke-width="10"/>';
    for (i = 1; i < lignes; i++) out += '<path d="M' + x + ' ' + n(y + i * ph) + 'h' + l + '" stroke="#0B0909" stroke-width="4"/>';
    out += '<path d="M' + n(x + l / 2) + ' ' + y + 'V' + (y + h) + '" stroke="#0B0909" stroke-width="4"/>';
    var id = 'pg-lancette-' + graine;
    return '<defs><clipPath id="' + id + '"><path d="' + forme + '"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')">' + out + '</g><path d="' + forme + '" fill="none" stroke="' + OR + '" stroke-opacity=".45" stroke-width="3"/>';
  }

  // Des rayonnages pleins de livres.
  function rayonnage(x0, x1, haut, bas, graine) {
    var r = alea(graine), out = '<rect x="' + x0 + '" y="' + haut + '" width="' + (x1 - x0) + '" height="' + (bas - haut) + '" fill="#160F0B"/>';
    var cuirs = ['#5E140F', '#3B2416', '#1F2E4C', '#4A3A1E', '#2A2324', '#6B4A22', '#3E1A14', '#C62A20'];
    var etage = 132;
    for (var y = haut + 12; y + etage - 12 <= bas; y += etage) {
      var x = x0 + 8;
      while (x < x1 - 30) {
        var l = 16 + Math.floor(r() * 18), hh = etage - 24 - Math.floor(r() * 26);
        if (x + l > x1 - 8) break;
        var c = cuirs[Math.floor(r() * cuirs.length)];
        out += '<rect x="' + x + '" y="' + (y + etage - 12 - hh) + '" width="' + l + '" height="' + hh + '" fill="' + c + '"/>';
        if (r() < .55) out += '<path d="M' + x + ' ' + (y + etage - 12 - hh + 14) + 'h' + l + 'M' + x + ' ' + (y + etage - 30) + 'h' + l + '" stroke="' + OR + '" stroke-opacity=".55" stroke-width="2"/>';
        x += l + 2;
        if (r() < .06) x += 18;
      }
      out += '<rect x="' + (x0 - 6) + '" y="' + (y + etage - 12) + '" width="' + (x1 - x0 + 12) + '" height="14" fill="url(#pg-bois)"/>';
    }
    out += '<rect x="' + (x0 - 14) + '" y="' + (haut - 18) + '" width="' + (x1 - x0 + 28) + '" height="22" fill="url(#pg-bois)"/>' +
      '<path d="M' + (x0 - 14) + ' ' + (haut - 18) + 'h' + (x1 - x0 + 28) + '" stroke="' + OR + '" stroke-opacity=".35" stroke-width="2"/>';
    return out;
  }

  function marche(ouv) {
    return '<path d="M' + (VX - ouv - 60) + ' 1000H' + (VX + ouv + 60) + 'V1046H' + (VX - ouv - 60) + 'Z" fill="#2A211C"/>' +
      '<path d="M' + (VX - ouv - 60) + ' 1001H' + (VX + ouv + 60) + '" stroke="' + OR + '" stroke-opacity=".28" stroke-width="3"/>';
  }

  /* ------------------------------------------------------------------
     Les lieux
  ------------------------------------------------------------------ */

  function img(cle, x, y, l) {
    var f = L.images[cle], h = l * 740 / 633;        // le blason fait 633 × 740
    return { svg: '<image href="images/' + esc(f) + '" data-enligne="' + esc(L.imagesEnLigne + f) + '" x="' + (x - l / 2) + '" y="' + n(y - h / 2) + '" width="' + l + '" height="' + n(h) + '" preserveAspectRatio="xMidYMid meet"/>' };
  }

  // L'église : le parvis, les portes, la nef, le chœur.
  function egliseFacade() {
    var trou = 'M520 1000L800 150L1080 1000Z';
    var mur = 'M-3400 -3400H5000V1000H-3400Z' + trou;
    var s = '<path d="' + mur + '" fill="url(#pg-pierre)" fill-rule="evenodd"/>' +
      '<path d="' + mur + '" fill="url(#pg-assises)" fill-rule="evenodd"/>';
    // le grand triangle sculpté autour du portail
    s += '<path d="M380 1000 800 -40 1220 1000" fill="none" stroke="#0A0808" stroke-width="44" stroke-opacity=".6"/>' +
      '<path d="M380 1000 800 -40 1220 1000" fill="none" stroke="' + OR + '" stroke-width="5" stroke-opacity=".7"/>' +
      '<path d="M450 1000 800 60 1150 1000" fill="none" stroke="' + OR + '" stroke-width="2" stroke-opacity=".35"/>';
    // ce qu'on voit derrière les portes : la lumière de la nef
    s += '<defs><clipPath id="pg-portail"><path d="' + trou + '"/></clipPath></defs>' +
      '<g clip-path="url(#pg-portail)">' +
        '<g data-porte="g"><path d="M520 1000L800 150V1000Z" fill="url(#pg-bois)"/>' +
          '<path d="M610 1000V730M690 1000V490M770 1000V250" stroke="#000" stroke-opacity=".45" stroke-width="4"/>' +
          '<path d="M800 150V1000" stroke="' + OR + '" stroke-width="6"/>' +
          '<circle cx="770" cy="640" r="12" fill="none" stroke="url(#pg-or)" stroke-width="6"/>' +
          '<path d="M800 420 742 520H800Z" fill="' + SANG + '"/></g>' +
        '<g data-porte="d"><path d="M1080 1000L800 150V1000Z" fill="url(#pg-bois)"/>' +
          '<path d="M990 1000V730M910 1000V490M830 1000V250" stroke="#000" stroke-opacity=".45" stroke-width="4"/>' +
          '<circle cx="830" cy="640" r="12" fill="none" stroke="url(#pg-or)" stroke-width="6"/>' +
          '<path d="M800 420 858 520H800Z" fill="' + SANG + '"/></g>' +
      '</g>' +
      '<path d="' + trou + '" fill="none" stroke="' + OR + '" stroke-width="4" stroke-opacity=".8"/>';
    // l'inscription du fronton, reprise de l'ancien seuil
    s += '<text x="800" y="-80" text-anchor="middle" class="pg-grave" font-size="34" letter-spacing="9">' + esc(L.accueil.engagements[0].texte.toUpperCase()) + '</text>';
    // torches de part et d'autre, marches du parvis
    s += torche(300, 520) + torche(1300, 520) + torche(-260, 560) + torche(1860, 560);
    s += '<path d="M200 1000H1400V1040H200Z M120 1040H1480V1090H120Z M40 1090H1560V1150H40Z" fill="#2A211C"/>' +
      '<path d="M200 1001H1400M120 1041H1480M40 1091H1560" stroke="' + OR + '" stroke-opacity=".25" stroke-width="3"/>';
    return s;
  }

  function egliseNef(i) {
    var o = { ouv: 640, pied: 300, sommet: -260, forme: 'ogive', pilier: 150 };
    var s = mur(o) + bancs(o.ouv);
    var couleurs = ['pg-sang', 'pg-noir', 'pg-sang', 'pg-blanc', 'pg-sang'];
    s += banniere(VX - o.ouv - 128, 360, 104, 380, couleurs[i % 5]) + banniere(VX + o.ouv + 24, 360, 104, 380, couleurs[(i + 2) % 5]);
    s += torche(VX - o.ouv - 76, 800) + torche(VX + o.ouv + 76, 800);
    return s;
  }

  function egliseChoeur() {
    var s = '<rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-pierre)"/>' +
      '<rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-assises)"/>';
    // rayons qui tombent de la verrière
    s += '<path d="M640 300 360 1000H660Z M960 300 1240 1000H940Z M800 260 620 1000H980Z" fill="url(#pg-rayon)"/>';
    // la verrière triangulaire, plombée en triangles
    var A = [800, -120], B = [1170, 600], C = [430, 600];
    function mil(p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }
    function tri(p, q, r, prof, out) {
      if (!prof) { out.push([p, q, r]); return; }
      var a = mil(p, q), b = mil(q, r), c = mil(r, p);
      tri(p, a, c, prof - 1, out); tri(a, q, b, prof - 1, out); tri(c, b, r, prof - 1, out); tri(a, b, c, prof - 1, out);
    }
    var morceaux = []; tri(A, B, C, 3, morceaux);
    var ra = alea(31), teintes = ['#C62A20', '#E0392C', '#FFF4DA', '#EFE6D2', '#8E1C15', '#2A2324', '#CFA54C'];
    s += '<path d="M800 -150 1205 620H395Z" fill="#0A0808"/>';
    morceaux.forEach(function (t) {
      s += '<path d="M' + n(t[0][0]) + ' ' + n(t[0][1]) + 'L' + n(t[1][0]) + ' ' + n(t[1][1]) + 'L' + n(t[2][0]) + ' ' + n(t[2][1]) + 'Z" fill="' + teintes[Math.floor(ra() * teintes.length)] + '" fill-opacity="' + n(.5 + ra() * .45) + '" stroke="#0A0808" stroke-width="5" stroke-linejoin="round"/>';
    });
    s += '<circle cx="800" cy="360" r="460" fill="url(#pg-halo-blanc)"/>' +
      '<path d="M800 -150 1205 620H395Z" fill="none" stroke="' + OR + '" stroke-width="8"/>';
    // l'autel, ses marches et ses cierges
    s += '<path d="M260 1000H1340V960H300Z M340 960H1260V920H380Z M420 920H1180V880H460Z" fill="#2E2425"/>' +
      '<path d="M300 960H1300M380 920H1220M460 880H1140" stroke="' + OR + '" stroke-opacity=".35" stroke-width="3"/>' +
      '<rect x="580" y="720" width="440" height="160" fill="#EFE6D2"/><rect x="580" y="720" width="440" height="22" fill="url(#pg-or)"/>' +
      '<rect x="760" y="742" width="80" height="138" fill="' + SANG + '"/>' + emblemeTriangle(800, 800, 26, 'none', LUM);
    s += cierge(520, 880, 300) + cierge(1080, 880, 300) + cierge(330, 960, 380) + cierge(1270, 960, 380);
    return s;
  }

  // La verrière (la Foi) : des lancettes de chaque côté, puis la grande verrière.
  function foiTravee(i) {
    var o = { ouv: 520, pied: 360, sommet: -200, forme: 'ogive', pilier: 130 };
    var s = mur(o);
    var c = ['#C62A20', '#EFE6D2', '#2A2324', '#E0392C', '#FFF4DA'];
    s += lancette(VX - o.ouv - 330, 40, 150, 620, c, 11 + i) + lancette(VX + o.ouv + 180, 40, 150, 620, c, 23 + i);
    // la lumière colorée des lancettes posée sur le dallage
    s += '<path d="M' + (VX - o.ouv - 200) + ' 520L' + (VX - o.ouv + 260) + ' 1000H' + (VX - o.ouv + 40) + 'Z" fill="' + (i % 2 ? '#C62A20' : '#FFF4DA') + '" fill-opacity=".12"/>' +
      '<path d="M' + (VX + o.ouv + 200) + ' 520L' + (VX + o.ouv - 260) + ' 1000H' + (VX + o.ouv - 40) + 'Z" fill="' + (i % 2 ? '#FFF4DA' : '#C62A20') + '" fill-opacity=".12"/>';
    return s;
  }

  function foiVerriere() {
    var s = '<rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-pierre)"/><rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-assises)"/>';
    var A = [800, -260], B = [1290, 640], C = [310, 640];
    s += '<path d="M800 -300 1330 665H270Z" fill="#0A0808"/>';
    // trois grands pans : rouge, blanc, noir — les couleurs de la foi
    var G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    var pans = [[A, B, '#C62A20'], [B, C, '#EFE6D2'], [C, A, '#2A2324']];
    var ra = alea(5);
    pans.forEach(function (p) {
      for (var k = 0; k < 6; k++) {
        var t0 = k / 6, t1 = (k + 1) / 6;
        var a = [p[0][0] + (p[1][0] - p[0][0]) * t0, p[0][1] + (p[1][1] - p[0][1]) * t0];
        var b = [p[0][0] + (p[1][0] - p[0][0]) * t1, p[0][1] + (p[1][1] - p[0][1]) * t1];
        s += '<path d="M' + n(a[0]) + ' ' + n(a[1]) + 'L' + n(b[0]) + ' ' + n(b[1]) + 'L' + n(G[0]) + ' ' + n(G[1]) + 'Z" fill="' + p[2] + '" fill-opacity="' + n(.55 + ra() * .4) + '" stroke="#0A0808" stroke-width="6" stroke-linejoin="round"/>';
      }
    });
    s += '<circle cx="' + n(G[0]) + '" cy="' + n(G[1]) + '" r="96" fill="#0A0808"/><circle cx="' + n(G[0]) + '" cy="' + n(G[1]) + '" r="82" fill="#FFF4DA"/>' +
      emblemeTriangle(G[0], G[1] + 6, 48, SANG) +
      '<circle cx="' + n(G[0]) + '" cy="' + n(G[1]) + '" r="520" fill="url(#pg-halo-blanc)"/>';
    s += '<path d="M800 -300 1330 665H270Z" fill="none" stroke="' + OR + '" stroke-width="9" stroke-linejoin="round"/>';
    // les trois mots de la devise gravés le long des côtés
    s += '<defs><path id="pg-v-g" d="M240 640 770 -300"/><path id="pg-v-d" d="M830 -300 1360 640"/><path id="pg-v-b" d="M270 730H1330"/></defs>';
    var mots = L.devise.split(/,\s*/);
    s += '<text class="pg-grave" font-size="40" letter-spacing="14"><textPath href="#pg-v-g" startOffset="50%" text-anchor="middle">' + esc(mots[0].toUpperCase()) + '</textPath></text>' +
      '<text class="pg-grave" font-size="40" letter-spacing="14"><textPath href="#pg-v-d" startOffset="50%" text-anchor="middle">' + esc(mots[1].toUpperCase()) + '</textPath></text>' +
      '<text class="pg-grave" font-size="40" letter-spacing="14"><textPath href="#pg-v-b" startOffset="50%" text-anchor="middle">' + esc(mots[2].toUpperCase()) + '</textPath></text>';
    s += '<path d="M120 1000 1480 1000 1380 820H220Z" fill="#FFF4DA" fill-opacity=".05"/>' + cierge(170, 1000, 420) + cierge(1430, 1000, 420);
    return s;
  }

  // La crypte (les Origines) : on descend sous des voûtes basses, une génération par arche.
  function crypteArche(i) {
    var o = { ouv: 470, pied: 620, sommet: 230, forme: 'plein', pilier: 110, pierre: 'pg-pierre-crypte', cle: ROM[i], areteOpacite: .3 };
    return mur(o) + marche(o.ouv) + torche(VX - o.ouv - 55, 470) + torche(VX + o.ouv + 55, 470);
  }

  function crypteFond() {
    var s = '<rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-pierre-crypte)"/><rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-assises)"/>';
    s += '<circle cx="800" cy="520" r="560" fill="url(#pg-halo)"/>';
    // la stèle du serment
    s += '<path d="M480 1000V250Q800 110 1120 250V1000Z" fill="#3A2F29" stroke="' + OR + '" stroke-opacity=".5" stroke-width="4"/>' +
      '<path d="M520 1000V280Q800 160 1080 280V1000Z" fill="none" stroke="#0A0808" stroke-opacity=".5" stroke-width="3"/>' +
      emblemeTriangle(800, 330, 70, 'none', OR);
    var mots = L.devise.split(/,\s*/);
    mots.forEach(function (m, k) {
      s += '<text x="800" y="' + (560 + k * 120) + '" text-anchor="middle" class="pg-grave" font-size="62" letter-spacing="10">' + esc(m.toUpperCase()) + '</text>';
    });
    s += '<path d="M600 900H1000" stroke="' + OR + '" stroke-opacity=".5" stroke-width="3"/>';
    s += torche(330, 420) + torche(1270, 420);
    return s;
  }

  // La croisée (les Branches) : bannières des trois branches, puis trois portes.
  function croiseeTravee(i) {
    var o = { ouv: 600, pied: 320, sommet: -240, forme: 'ogive', pilier: 140 };
    var fonds = ['pg-bleu', 'pg-blanc', 'pg-sang'];
    var s = mur(o);
    s += banniere(VX - o.ouv - 124, 300, 100, 440, fonds[i % 3]) + banniere(VX + o.ouv + 24, 300, 100, 440, fonds[i % 3]);
    s += cierge(VX - o.ouv + 70, 1000, 340) + cierge(VX + o.ouv - 70, 1000, 340);
    return s;
  }

  function croiseePortes() {
    var s = '<rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-pierre)"/><rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-assises)"/>';
    var portes = [[310, BLEU, 'pg-bleu'], [800, IVOIRE, 'pg-blanc'], [1290, SANG, 'pg-sang']];
    L.branches.liste.forEach(function (b, k) {
      var x = portes[k][0], c = portes[k][1];
      var forme = 'M' + (x - 150) + ' 1000V420C' + (x - 150) + ' 300 ' + (x - 70) + ' 200 ' + x + ' 160C' + (x + 70) + ' 200 ' + (x + 150) + ' 300 ' + (x + 150) + ' 420V1000Z';
      s += '<circle cx="' + x + '" cy="560" r="300" fill="url(#pg-halo)"/>' +
        '<path d="' + forme + '" fill="#0B0909" stroke="' + c + '" stroke-width="10"/>' +
        '<path d="' + forme + '" fill="none" stroke="' + OR + '" stroke-opacity=".4" stroke-width="3" transform="translate(0 0)"/>' +
        '<path d="M' + x + ' 160V1000" stroke="' + c + '" stroke-opacity=".35" stroke-width="3"/>' +
        banniere(x - 70, 300, 140, 300, portes[k][2]) +
        '<text x="' + x + '" y="-20" text-anchor="middle" class="pg-grave" font-size="36" letter-spacing="5">' + esc(b.nom.toUpperCase()) + '</text>';
    });
    return s;
  }

  // La bibliothèque (les Apôtres) : rayonnages, puis le rayon des neuf Vies.
  function bibliothequeTravee(i) {
    var o = { ouv: 470, pied: 420, sommet: 40, forme: 'plein', pilier: 90 };
    var s = mur(o);
    s += rayonnage(VX - o.ouv - 760, VX - o.ouv - 100, 60, 1000, 100 + i) + rayonnage(VX + o.ouv + 100, VX + o.ouv + 760, 60, 1000, 200 + i);
    // tables de lecture et leurs bougies
    s += '<path d="M' + (VX - o.ouv + 40) + ' 900H' + (VX - 150) + 'V920H' + (VX - o.ouv + 40) + 'Z M' + (VX + 150) + ' 900H' + (VX + o.ouv - 40) + 'V920H' + (VX + 150) + 'Z" fill="url(#pg-bois)"/>' +
      '<path d="M' + (VX - o.ouv + 60) + ' 920V1000M' + (VX - 170) + ' 920V1000M' + (VX + 170) + ' 920V1000M' + (VX + o.ouv - 60) + ' 920V1000" stroke="#2A1A10" stroke-width="12"/>' +
      flamme(VX - o.ouv + 120, 870, .6) + flamme(VX + o.ouv - 120, 870, .6);
    return s;
  }

  function bibliothequeRayon() {
    var s = '<rect x="-3400" y="-3400" width="8400" height="4400" fill="#140E0B"/>';
    s += rayonnage(-1200, 160, -200, 1000, 401) + rayonnage(1440, 2800, -200, 1000, 402);
    s += '<rect x="160" y="-200" width="1280" height="1200" fill="#1A120D"/><circle cx="800" cy="520" r="620" fill="url(#pg-halo)"/>';
    var cuirs = ['#5E140F', '#3B2416', '#1F2E4C', '#4A3A1E', '#2A2324', '#6B4A22', '#3E1A14', '#7A1812'];
    var hauteurs = [560, 520, 590, 545, 600, 510, 555, 580, 530];
    var x = 300;
    L.apotres.forEach(function (a, k) {
      var l = 104, hh = hauteurs[k], y = 880 - hh;
      var fond = a.dossier ? '#B8A47C' : cuirs[k % 8];
      s += '<rect x="' + x + '" y="' + y + '" width="' + l + '" height="' + hh + '" rx="4" fill="' + fond + '"/>' +
        '<path d="M' + x + ' ' + (y + 40) + 'h' + l + 'M' + x + ' ' + (y + hh - 46) + 'h' + l + '" stroke="' + (a.dossier ? '#5E140F' : OR) + '" stroke-width="5"/>' +
        '<text x="' + (x + l / 2) + '" y="' + (y + 110) + '" text-anchor="middle" class="pg-grave" font-size="46"' + (a.dossier ? ' style="fill:#5E140F"' : '') + '>' + esc(a.num) + '</text>' +
        emblemeTriangle(x + l / 2, y + hh - 110, 22, a.dossier ? '#5E140F' : OR);
      x += l + 14;
    });
    s += '<rect x="230" y="880" width="1140" height="28" fill="url(#pg-bois)"/><path d="M230 880H1370" stroke="' + OR + '" stroke-opacity=".5" stroke-width="3"/>' +
      '<rect x="230" y="908" width="1140" height="92" fill="#1E130D"/>';
    s += cierge(190, 1000, 360) + cierge(1410, 1000, 360);
    return s;
  }

  // Le trésor (les Reliques) : une porte de coffre, un couloir doré, les niches.
  function tresorPorte() {
    var s = '<path d="M-3400 -3400H5000V1000H-3400Z M800 120A420 420 0 1 0 800.1 120Z" fill="url(#pg-pierre)" fill-rule="evenodd"/>' +
      '<path d="M-3400 -3400H5000V1000H-3400Z M800 120A420 420 0 1 0 800.1 120Z" fill="url(#pg-assises)" fill-rule="evenodd"/>';
    s += '<defs><clipPath id="pg-coffre"><circle cx="800" cy="540" r="420"/></clipPath>' +
      '<clipPath id="pg-coffre-g"><rect x="300" y="100" width="500" height="900"/></clipPath>' +
      '<clipPath id="pg-coffre-d"><rect x="800" y="100" width="500" height="900"/></clipPath></defs>';
    function moitie(c) {
      var x = c < 0 ? 380 : 800;
      return '<g data-porte="' + (c < 0 ? 'g' : 'd') + '"><g clip-path="url(#pg-coffre-' + (c < 0 ? 'g' : 'd') + ')"><rect x="' + x + '" y="120" width="420" height="840" fill="url(#pg-noir)"/>' +
        '<circle cx="800" cy="540" r="360" fill="none" stroke="url(#pg-or)" stroke-width="10"/>' +
        '<circle cx="800" cy="540" r="250" fill="none" stroke="' + OR + '" stroke-opacity=".5" stroke-width="4"/>' +
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (k) {
          var a = k / 12 * Math.PI * 2;
          return '<circle cx="' + n(800 + Math.cos(a) * 395) + '" cy="' + n(540 + Math.sin(a) * 395) + '" r="9" fill="url(#pg-or)"/>';
        }).join('') +
        // chaque battant porte une moitié du triangle
        '<path d="M800 440L' + (c < 0 ? 700 : 900) + ' 610H800Z" fill="' + SANG + '" stroke="url(#pg-or)" stroke-width="5"/>' +
        '<path d="M800 120V960" stroke="#000" stroke-opacity=".6" stroke-width="4"/></g></g>';
    }
    s += '<g clip-path="url(#pg-coffre)">' + moitie(-1) + moitie(1) + '</g>' +
      '<circle cx="800" cy="540" r="420" fill="none" stroke="url(#pg-or)" stroke-width="16"/>';
    s += torche(260, 480) + torche(1340, 480);
    return s;
  }

  function tresorTravee(i) {
    var o = { ouv: 520, pied: 0, sommet: 120, forme: 'plat', pilier: 110, arete: '#E9CB7E', areteOpacite: .7 };
    var s = mur(o);
    s += '<path d="M' + (VX - o.ouv) + ' 120H' + (VX + o.ouv) + '" stroke="url(#pg-or)" stroke-width="14"/>';
    // faisceaux de lumière tombant du plafond
    s += '<path d="M' + (VX - 120) + ' 120L' + (VX - 260) + ' 1000H' + (VX + 260) + 'L' + (VX + 120) + ' 120Z" fill="url(#pg-rayon)" opacity=".6"/>';
    s += torche(VX - o.ouv - 55, 520) + torche(VX + o.ouv + 55, 520);
    return s;
  }

  function tresorNiches(dessins) {
    var s = '<rect x="-3400" y="-3400" width="8400" height="4400" fill="#17110F"/><rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-assises)"/>';
    s += '<circle cx="800" cy="500" r="700" fill="url(#pg-halo)"/>';
    L.reliques.forEach(function (r, k) {
      var col = k % 3, lig = Math.floor(k / 3);
      var x = 360 + col * 440, y = 120 + lig * 420;
      var niche = 'M' + (x - 150) + ' ' + (y + 340) + 'V' + (y + 110) + 'Q' + (x - 150) + ' ' + y + ' ' + x + ' ' + y + 'Q' + (x + 150) + ' ' + y + ' ' + (x + 150) + ' ' + (y + 110) + 'V' + (y + 340) + 'Z';
      s += '<path d="' + niche + '" fill="#0B0808" stroke="url(#pg-or)" stroke-width="7"' + (r.perdue ? ' stroke-dasharray="18 12" stroke-opacity=".6"' : '') + '/>';
      if (!r.perdue) s += '<path d="M' + (x - 70) + ' ' + y + 'L' + (x - 130) + ' ' + (y + 340) + 'H' + (x + 130) + 'L' + (x + 70) + ' ' + y + 'Z" fill="url(#pg-rayon)"/>';
      s += '<g transform="translate(' + (x - 90) + ' ' + (y + 70) + ') scale(1.8)" fill="none" stroke="' + (r.perdue ? '#6E6152' : '#E9CB7E') + '" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"' + (r.perdue ? ' stroke-dasharray="4 5"' : '') + '>' + (dessins[r.forme] || '') + '</g>' +
        '<rect x="' + (x - 170) + '" y="' + (y + 340) + '" width="340" height="26" fill="url(#pg-or)"/>';
    });
    return s;
  }

  // La salle des bannières (les Chroniques).
  function banniereTravee(i) {
    var o = { ouv: 560, pied: 0, sommet: -60, forme: 'plat', pilier: 170 };
    var s = mur(o);
    var fonds = ['pg-sang', 'pg-noir'];
    s += banniere(VX - o.ouv + 40, -60, 150, 720, fonds[i % 2], null, true) + banniere(VX + o.ouv - 190, -60, 150, 720, fonds[(i + 1) % 2], null, true);
    // boucliers sur les piliers
    [VX - o.ouv - 85, VX + o.ouv + 85].forEach(function (x) {
      s += '<path d="M' + (x - 58) + ' 380H' + (x + 58) + 'V470Q' + (x + 58) + ' 560 ' + x + ' 600Q' + (x - 58) + ' 560 ' + (x - 58) + ' 470Z" fill="url(#pg-sang)" stroke="url(#pg-or)" stroke-width="6"/>' +
        emblemeTriangle(x, 478, 30, 'none', LUM) +
        '<path d="M' + (x - 110) + ' 330L' + (x + 110) + ' 650M' + (x + 110) + ' 330L' + (x - 110) + ' 650" stroke="#8A8277" stroke-width="10" stroke-linecap="round" opacity=".7"/>';
    });
    s += torche(VX - o.ouv - 85, 760) + torche(VX + o.ouv + 85, 760);
    return s;
  }

  function banniereFond() {
    var s = '<rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-pierre)"/><rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-assises)"/>';
    s += '<circle cx="800" cy="460" r="700" fill="url(#pg-halo)"/>';
    L.chroniques.forEach(function (c, k) {
      var x = 290 + k * 510, fond = ['pg-sang', 'pg-noir', 'pg-sang'][k];
      s += banniere(x - 170, -40, 340, 860, fond, emblemeTriangle(x, 230, 80, 'none', LUM), true) +
        '<text x="' + x + '" y="480" text-anchor="middle" class="pg-grave" font-size="40" letter-spacing="4">' + esc(c.guerre.toUpperCase()) + '</text>';
    });
    // la table de guerre
    s += '<path d="M200 1000L300 860H1300L1400 1000Z" fill="url(#pg-bois)"/><path d="M300 860H1300" stroke="' + OR + '" stroke-opacity=".5" stroke-width="3"/>' +
      '<path d="M520 900H1080L1050 960H550Z" fill="#C9B68E" opacity=".85"/>' + cierge(250, 1000, 300) + cierge(1350, 1000, 300);
    return s;
  }

  // Le lutrin (le Code) : un scriptorium éclairé à la bougie, puis le grand livre ouvert.
  function lutrinTravee(i) {
    var o = { ouv: 560, pied: 340, sommet: -200, forme: 'ogive', pilier: 130 };
    var s = mur(o);
    s += cierge(VX - o.ouv + 70, 1000, 300) + cierge(VX - o.ouv + 170, 1000, 230) + cierge(VX + o.ouv - 70, 1000, 300) + cierge(VX + o.ouv - 170, 1000, 230);
    s += rayonnage(VX - o.ouv - 600, VX - o.ouv - 140, 380, 1000, 500 + i) + rayonnage(VX + o.ouv + 140, VX + o.ouv + 600, 380, 1000, 600 + i);
    return s;
  }

  function lutrinLivre() {
    var s = '<rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-pierre)"/><rect x="-3400" y="-3400" width="8400" height="4400" fill="url(#pg-assises)"/>';
    s += '<circle cx="800" cy="440" r="680" fill="url(#pg-halo)"/>';
    // le lutrin
    s += '<path d="M760 1000V700H840V1000Z" fill="url(#pg-bois)"/><path d="M620 1000H980L940 960H660Z" fill="url(#pg-bois)"/>';
    // le livre ouvert, ses deux pages : les deux textes
    s += '<path d="M180 690L230 160Q500 120 800 200Q1100 120 1370 160L1420 690Q1100 640 800 720Q500 640 180 690Z" fill="#3A1A10"/>' +
      '<path d="M220 660L260 190Q520 160 790 230V690Q520 620 220 660Z" fill="url(#pg-parchemin)"/>' +
      '<path d="M1380 660L1340 190Q1080 160 810 230V690Q1080 620 1380 660Z" fill="url(#pg-parchemin)"/>';
    var noms = L.code.textes.map(function (t) { return t.nom; });
    s += '<text x="525" y="300" text-anchor="middle" class="pg-encre" font-size="36">' + esc(noms[0]) + '</text>' +
      '<text x="1075" y="300" text-anchor="middle" class="pg-encre" font-size="36">' + esc(noms[1]) + '</text>';
    for (var k = 0; k < 7; k++) {
      var y = 360 + k * 38;
      s += '<path d="M' + (330 + (k === 0 ? 40 : 0)) + ' ' + y + 'H' + (720 - (k % 3) * 30) + 'M' + (880 + (k === 0 ? 40 : 0)) + ' ' + y + 'H' + (1270 - (k % 4) * 26) + '" stroke="#3A2A1E" stroke-opacity=".45" stroke-width="6" stroke-linecap="round"/>';
    }
    s += emblemeTriangle(525, 245, 18, SANG) + emblemeTriangle(1075, 245, 18, SANG);
    s += '<path d="M800 230V690" stroke="#3A2A1E" stroke-opacity=".5" stroke-width="4"/>';
    s += cierge(140, 1000, 470) + cierge(1460, 1000, 470) + cierge(330, 1000, 260) + cierge(1270, 1000, 260);
    return s;
  }

  /* ------------------------------------------------------------------
     Le programme de chaque lieu
  ------------------------------------------------------------------ */
  function suite(debut, pas, nombre, dessin) {
    var out = [];
    for (var i = 0; i < nombre; i++) {
      dernierVoile = null;
      var svg = dessin(i);
      out.push({ d: debut + i * pas, svg: svg, voile: dernierVoile });
    }
    return out;
  }

  var LIEUX = {
    accueil: function () {
      var plans = [{ d: .3, svg: egliseFacade(), voile: 'M-3400 -3400H5000V1000H-3400ZM520 1000L800 150L1080 1000Z' }]
        .concat(suite(1.15, .72, 5, egliseNef))
        .concat([{ d: 5.0, svg: egliseChoeur(), extra: [img('blason', 800, 380, 210)] }]);
      return { plans: plans, fin: 5.0, ouverture: [.02, .15], decalage: true, cles: [[0, 0], [.15, .2], [.94, 4.88], [1, 4.88]], lueur: '#FFE7B8' };
    },
    foi: function () {
      return { plans: suite(.5, .8, 4, foiTravee).concat([{ d: 3.9, svg: foiVerriere() }]), fin: 3.9, cles: [[0, 0], [.94, 3.72], [1, 3.72]], lueur: '#FFF4DA' };
    },
    origines: function () {
      return { plans: suite(.45, .62, 6, crypteArche).concat([{ d: 4.3, svg: crypteFond() }]), fin: 4.3, pente: .26, cles: [[0, 0], [.94, 4.16], [1, 4.16]], lueur: '#E9A35A' };
    },
    branches: function () {
      return { plans: suite(.5, .75, 3, croiseeTravee).concat([{ d: 3.1, svg: croiseePortes() }]), fin: 3.1, cles: [[0, 0], [.94, 2.92], [1, 2.92]], lueur: '#FFE7B8' };
    },
    apotres: function () {
      return { plans: suite(.45, .7, 4, bibliothequeTravee).concat([{ d: 3.5, svg: bibliothequeRayon() }]), fin: 3.5, cles: [[0, 0], [.94, 3.34], [1, 3.34]], lueur: '#F2C27A' };
    },
    reliques: function (dessins) {
      var plans = [{ d: .3, svg: tresorPorte(), voile: 'M-3400 -3400H5000V1000H-3400ZM800 120A420 420 0 1 0 800.1 120Z' }]
        .concat(suite(1.1, .62, 3, tresorTravee))
        .concat([{ d: 3.4, svg: tresorNiches(dessins) }]);
      return { plans: plans, fin: 3.4, ouverture: [.03, .2], cles: [[0, 0], [.2, .22], [.94, 3.25], [1, 3.25]], lueur: '#E9CB7E' };
    },
    chroniques: function () {
      return { plans: suite(.5, .78, 4, banniereTravee).concat([{ d: 3.8, svg: banniereFond() }]), fin: 3.8, cles: [[0, 0], [.94, 3.64], [1, 3.64]], lueur: '#E86A3C' };
    },
    code: function () {
      return { plans: suite(.5, .8, 3, lutrinTravee).concat([{ d: 3.2, svg: lutrinLivre() }]), fin: 3.2, cles: [[0, 0], [.94, 3.04], [1, 3.04]], lueur: '#FFE2A8' };
    },
  };

  /* ------------------------------------------------------------------
     Le moteur
  ------------------------------------------------------------------ */
  function lisse(t) { return t * t * (3 - 2 * t); }
  function camera(cles, p) {
    for (var i = 1; i < cles.length; i++) {
      if (p <= cles[i][0]) {
        var a = cles[i - 1], b = cles[i];
        var t = (p - a[0]) / Math.max(1e-6, b[0] - a[0]);
        return a[1] + (b[1] - a[1]) * lisse(Math.max(0, Math.min(1, t)));
      }
    }
    return cles[cles.length - 1][1];
  }

  // Monte le lieu dans une section .passage et renvoie la fonction qui l'arrête.
  function monter(section, nom, dessins) {
    var fabrique = LIEUX[nom];
    var scene = section.querySelector('.passage-scene');
    if (!fabrique || !scene) return function () {};
    var lieu = fabrique(dessins || {});
    var pente = lieu.pente || 0;

    // Tout le lieu tient dans un seul dessin, redessiné à la taille de l'écran à chaque image :
    // le coût reste le même quel que soit le nombre de plans, et rien ne devient flou en grandissant.
    var plans = lieu.plans.slice().sort(function (a, b) { return b.d - a.d; });
    var html = DEFS + '<svg class="pg-svg" aria-hidden="true" focusable="false"><defs>' +
      '<radialGradient id="pg-lueur-lieu"><stop offset="0" stop-color="' + lieu.lueur + '" stop-opacity=".3"/><stop offset=".55" stop-color="' + lieu.lueur + '" stop-opacity=".08"/><stop offset="1" stop-color="' + lieu.lueur + '" stop-opacity="0"/></radialGradient></defs>' +
      // le dallage : ses lignes filent vers le point de fuite, elles ne bougent pas quand on avance
      '<g class="pg-fond"><path d="M-3400 1000H5000V3400H-3400Z" fill="#1B1516"/>' +
      [-9, -7, -5, -3, -1.5, 1.5, 3, 5, 7, 9].map(function (k) {
        return '<path d="M' + VX + ' ' + VY + 'L' + n(VX + k * 440) + ' 3400" stroke="#000" stroke-opacity=".5" stroke-width="3"/>';
      }).join('') +
      (nom === 'accueil' || nom === 'branches' ? '<path d="M' + (VX - 6) + ' ' + VY + 'L' + (VX - 900) + ' 3400H' + (VX + 900) + 'L' + (VX + 6) + ' ' + VY + 'Z" fill="#5E140F" fill-opacity=".75"/>' +
        '<path d="M' + (VX - 6) + ' ' + VY + 'L' + (VX - 900) + ' 3400M' + (VX + 6) + ' ' + VY + 'L' + (VX + 900) + ' 3400" stroke="' + OR + '" stroke-opacity=".35" stroke-width="3"/>' : '') +
      '</g>' +
      plans.map(function (p, i) {
        var extra = (p.extra || []).map(function (e) { return e.svg; }).join('');
        var g = '<g class="pg-plan" style="display:none">' + p.svg + extra +
          '<path class="pg-brume" d="' + (p.voile || 'M-3400 -3400H5000V1000H-3400Z') + '" fill="#0A0808" fill-rule="evenodd" opacity="0"/></g>';
        // la lueur du lieu d'arrivée passe juste devant le dernier plan
        return g + (i === 0 ? '<circle class="pg-lueur" cx="' + VX + '" cy="' + VY + '" r="900" fill="url(#pg-lueur-lieu)"/>' : '');
      }).join('') +
      '</svg><div class="pg-voile"></div>';
    scene.innerHTML = html;
    scene.setAttribute('data-lieu', nom);

    var svg = scene.querySelector('.pg-svg');
    var groupes = Array.prototype.slice.call(svg.querySelectorAll('.pg-plan'));
    var brumes = groupes.map(function (g) { return g.querySelector('.pg-brume'); });
    var portes = { g: svg.querySelectorAll('[data-porte="g"]'), d: svg.querySelectorAll('[data-porte="d"]') };
    var lueur = svg.querySelector('.pg-lueur');
    var fond = svg.querySelector('.pg-fond');
    var visibles = groupes.map(function () { return false; });
    var b = 1, raf = 0, derniere = -1, W = 0, H = 0, vy = 0;

    // les images (le blason) : le dossier images/ d'abord, sinon la version en ligne
    Array.prototype.forEach.call(svg.querySelectorAll('image[data-enligne]'), function (im) {
      im.addEventListener('error', function () {
        if (!im.getAttribute('data-essai')) { im.setAttribute('data-essai', '1'); im.setAttribute('href', im.getAttribute('data-enligne')); }
        else im.style.display = 'none';
      });
    });

    function dimensionner() {
      W = scene.clientWidth; H = scene.clientHeight;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.setAttribute('width', W); svg.setAttribute('height', H);
      // on garde toujours au moins 1000 unités de large : les arches restent lisibles sur téléphone
      b = Math.min(Math.max(W / 1600, H / 1000), W / 1000);
      // en portrait, le point de fuite descend : moins de dallage vide en bas de l'écran
      vy = H / 2 + 60 * b + (H > W * 1.2 ? H * .07 : 0);
      derniere = -1;
      planifier();
    }

    function progression() {
      var r = section.getBoundingClientRect();
      var course = section.offsetHeight - scene.clientHeight;
      var haut = parseFloat(getComputedStyle(scene.parentNode).top) || 0;
      return Math.max(0, Math.min(1, (haut - r.top) / Math.max(1, course)));
    }

    function poser(el, x, y, k) {
      el.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + k.toFixed(5) + ') translate(-' + VX + ' -' + VY + ')');
    }

    function rendre() {
      raf = 0;
      var p = progression();
      if (Math.abs(p - derniere) < 1e-4) return;
      derniere = p;
      var z = camera(lieu.cles, p);
      section.style.setProperty('--p', p.toFixed(4));

      // À l'accueil, la caméra part décalée pour laisser la place au titre, puis se recentre.
      var ox = 0, oy = 0;
      if (lieu.decalage) {
        var k = 1 - lisse(Math.max(0, Math.min(1, (p - .03) / .2)));
        if (W >= 900) ox = W * .2 * k; else oy = -H * .22 * k;
      }
      var cx = W / 2 + ox, cy = vy + oy;
      poser(fond, cx, cy, b);

      for (var i = 0; i < groupes.length; i++) {
        var plan = plans[i], g = groupes[i];
        var r = plan.d - z;
        var s = 1 / (1 + r);
        var montre = r >= -.63 && r <= 8;
        if (montre !== visibles[i]) { g.style.display = montre ? '' : 'none'; visibles[i] = montre; }
        if (!montre) continue;
        var op = Math.max(0, Math.min(1, (2.75 - s) / .95, (8 - r) / 2.5));
        g.setAttribute('opacity', op.toFixed(3));
        brumes[i].setAttribute('opacity', (Math.min(1, Math.max(0, r) / 5) * .72).toFixed(3));   // la pénombre au loin
        poser(g, cx, cy + pente * r * s * 1000 * b, s * b);
      }

      if (lieu.ouverture) {
        var o = lisse(Math.max(0, Math.min(1, (p - lieu.ouverture[0]) / (lieu.ouverture[1] - lieu.ouverture[0]))));
        var dx = (nom === 'reliques' ? 430 : 290) * o;
        Array.prototype.forEach.call(portes.g, function (e) { e.setAttribute('transform', 'translate(' + (-dx).toFixed(1) + ' 0)'); });
        Array.prototype.forEach.call(portes.d, function (e) { e.setAttribute('transform', 'translate(' + dx.toFixed(1) + ' 0)'); });
      }
      if (lueur) {
        var proche = Math.max(0, Math.min(1, z / lieu.fin));
        lueur.setAttribute('opacity', (.35 + .65 * proche).toFixed(3));
        poser(lueur, cx, cy, b * (.6 + 1.1 * proche));
      }
    }

    function planifier() { if (!raf) raf = requestAnimationFrame(rendre); }

    dimensionner();
    rendre();
    window.addEventListener('scroll', planifier, { passive: true });
    window.addEventListener('resize', dimensionner);
    return function () {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', planifier);
      window.removeEventListener('resize', dimensionner);
    };
  }

  return { monter: monter };
})();
