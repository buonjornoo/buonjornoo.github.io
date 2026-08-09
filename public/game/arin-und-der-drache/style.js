// ============================================
// STYLE.JS — Gemeinsames visuelles Vokabular
// ============================================
// Siehe STYLEGUIDE.md fuer die Begruendung jeder Regel hier.
// Abschnitte 0-9 = Grundlagen, Abschnitte 10-16 = "Lush-Ghibli"
// (Dichte, Wertstufen, Kontur, gemalter Ueberzug).
//
// Diese Datei wird VOR game.js geladen (siehe index.html) und
// VOR dem Aufruf von kaboom() ausgefuehrt. Deshalb duerfen hier
// oben im Datei-Scope KEINE Kaboom-Funktionen (rgb, add, drawX, ...)
// aufgerufen werden — nur definiert. Sie werden erst spaeter benutzt,
// wenn game.js laengst kaboom() gestartet hat.
//
// PALETTE-Werte sind bewusst einfache [r,g,b]-Arrays (wie bisher
// FARBEN in game.js), damit sie direkt in `color(...PALETTE.x)`
// gespreadet werden koennen. Fuer die Zeichen-Helfer unten, die
// echte Color-Objekte brauchen (drawPolygon/drawCircle/gradient),
// wird an der Aufrufstelle mit rgb(...PALETTE.x) umgewandelt.

// ============================================
// FARB-TOKENS
// ============================================
// Siehe STYLEGUIDE.md Abschnitt 2 fuer Herkunft und Verwendungszweck
// jeder Farbe. Die Tokens mit dem Vermerk "Wertstufe" sind in
// Abschnitt 11 dazugekommen: kein Landschaftselement wird mit
// weniger als drei Helligkeitsstufen gezeichnet.

const PALETTE = {
    // Himmel & Luft
    himmelZenit: [31, 169, 214],       // Wertstufe: dunkelster Himmelspunkt oben
    himmelTag1: [79, 195, 232],
    himmelTag2: [184, 232, 245],
    himmelAbend1: [46, 134, 171],
    himmelAbend2: [255, 217, 160],
    himmelNacht1: [13, 27, 62],
    himmelNacht2: [42, 47, 92],
    dunst: [238, 247, 240],            // kuehler Horizontdunst
    dunstWarm: [247, 240, 220],        // warmer Dunst direkt ueber dem Horizont
    wolkeHell: [255, 255, 255],
    wolkeMitte: [242, 248, 252],       // Wertstufe zwischen Kern und Schatten
    wolkeSchatten: [216, 232, 240],
    wolkeTief: [182, 203, 221],        // Wertstufe: Unterschatten der Wolke

    // Berge & Ferne
    bergFern: [143, 168, 196],
    bergNah: [93, 122, 158],
    bergGrat: [70, 97, 127],           // Wertstufe: Fallinien/Grate im Fels
    bergSchnee: [240, 245, 250],
    bergWald: [74, 111, 90],           // bewaldeter Bergfuss
    huegelFern: [127, 174, 122],
    huegelNah: [106, 156, 104],        // zweite, naehere Huegelreihe
    huegelLicht: [157, 199, 138],      // Streiflicht-Kante oben auf dem Huegel

    // Gras & Erde
    grasTief: [63, 122, 44],           // Wertstufe: Tiefschatten im Gras
    grasHell: [143, 209, 79],
    grasDunkel: [90, 158, 61],
    grasFranse: [168, 232, 106],
    grasLicht: [200, 240, 133],        // Wertstufe: hellste Halmspitzen
    erde: [139, 101, 68],
    erdeDunkel: [107, 74, 50],
    holz: [180, 131, 79],
    holzDunkel: [138, 98, 56],

    // Wasser
    wasserHell: [127, 216, 224],
    wasserDunkel: [58, 143, 168],

    // Bluten & warme Akzente
    blueteRosa: [245, 160, 192],
    blueteWeiss: [255, 245, 248],
    blueteGelb: [255, 217, 107],
    blueteMagenta: [239, 127, 174],
    blueteLila: [185, 143, 214],
    zinnober: [232, 93, 61],
    gold: [245, 197, 66],
    laterne: [255, 77, 141],
    fensterWarm: [255, 203, 107],

    // Charaktere
    arinIndigo: [51, 69, 158],
    arinTief: [32, 44, 107],           // Wertstufe: Schattenseite Arin
    arinLicht: [90, 112, 200],         // Wertstufe: Streiflicht Arin
    arinAkzent: [232, 93, 61],
    dracheOrange: [232, 107, 61],
    dracheTief: [180, 74, 38],         // Wertstufe: Schattenseite/Fluegel
    dracheLicht: [247, 154, 107],      // Wertstufe: Streiflicht Drache
    dracheBauch: [245, 220, 168],
    dracheHorn: [139, 74, 50],

    // Gegner & Gefahr
    gegnerSchiefer: [93, 90, 120],
    gegnerGlut: [255, 107, 77],
    lavaHell: [255, 140, 66],
    lavaDunkel: [196, 61, 31],

    // UI
    pergament: [245, 234, 214],
    pergamentRand: [212, 184, 150],
    tintenbraun: [90, 70, 50],
};

// ============================================
// STIMMUNGEN (Themes)
// ============================================
// Vollstaendige, in sich stimmige Farbsaetze je Level-Stimmung.
// STIMMUNG.TAG wird fuer das aktuelle Hauptlevel benutzt.
// ABEND und NACHT sind fuer kuenftige Level vorbereitet
// (siehe FEATURES.md Roadmap: "Mehrere Level").

const STIMMUNG = {
    TAG: {
        name: "Tag",
        himmelZenit: PALETTE.himmelZenit,
        himmel1: PALETTE.himmelTag1,
        himmel2: PALETTE.himmelTag2,
        himmelDunst: PALETTE.dunst,
        himmelDunstWarm: PALETTE.dunstWarm,
        // Wolken-Einfaerbung: Tag = reines Weiss, Abend/Nacht ziehen die
        // Wolken Richtung Horizontlicht (STYLEGUIDE.md Abschnitt 3 - eine
        // Stimmung ist in sich konsistent, keine Tagfarbe in der Nacht).
        wolkeTon: PALETTE.wolkeHell,
        wolkeMischung: 0,
        bergFern: PALETTE.bergFern,
        bergNah: PALETTE.bergNah,
        bergGrat: PALETTE.bergGrat,
        bergSpitze: PALETTE.bergSchnee,
        bergWald: PALETTE.bergWald,
        huegel: PALETTE.huegelFern,
        huegelNah: PALETTE.huegelNah,
        huegelLicht: PALETTE.huegelLicht,
        grasTief: PALETTE.grasTief,
        grasHell: PALETTE.grasHell,
        grasDunkel: PALETTE.grasDunkel,
        grasFranse: PALETTE.grasFranse,
        grasLicht: PALETTE.grasLicht,
        akzentWarm: PALETTE.blueteRosa,
        blueten: [
            PALETTE.blueteRosa,
            PALETTE.blueteWeiss,
            PALETTE.blueteGelb,
            PALETTE.blueteMagenta,
            PALETTE.blueteLila,
        ],
    },
    ABEND: {
        name: "Abend",
        himmelZenit: PALETTE.himmelNacht2,
        himmel1: PALETTE.himmelAbend1,
        himmel2: PALETTE.himmelAbend2,
        himmelDunst: PALETTE.blueteRosa,
        himmelDunstWarm: PALETTE.fensterWarm,
        wolkeTon: PALETTE.fensterWarm,
        wolkeMischung: 0.38,
        bergFern: PALETTE.bergNah,
        bergNah: PALETTE.erdeDunkel,
        bergGrat: PALETTE.erdeDunkel,
        bergSpitze: PALETTE.blueteRosa,
        bergWald: PALETTE.erdeDunkel,
        huegel: PALETTE.grasDunkel,
        huegelNah: PALETTE.erdeDunkel,
        huegelLicht: PALETTE.blueteRosa,
        grasTief: PALETTE.erdeDunkel,
        grasHell: PALETTE.grasDunkel,
        grasDunkel: PALETTE.erdeDunkel,
        grasFranse: PALETTE.blueteRosa,
        grasLicht: PALETTE.fensterWarm,
        akzentWarm: PALETTE.zinnober,
        blueten: [
            PALETTE.blueteRosa,
            PALETTE.blueteMagenta,
            PALETTE.zinnober,
            PALETTE.gold,
            PALETTE.blueteWeiss,
        ],
    },
    NACHT: {
        name: "Nacht",
        himmelZenit: PALETTE.himmelNacht1,
        himmel1: PALETTE.himmelNacht1,
        himmel2: PALETTE.himmelNacht2,
        himmelDunst: PALETTE.himmelNacht2,
        himmelDunstWarm: PALETTE.fensterWarm,
        wolkeTon: PALETTE.himmelNacht2,
        wolkeMischung: 0.6,
        bergFern: PALETTE.himmelNacht2,
        bergNah: PALETTE.erdeDunkel,
        bergGrat: PALETTE.himmelNacht1,
        bergSpitze: PALETTE.fensterWarm,
        bergWald: PALETTE.himmelNacht1,
        huegel: PALETTE.erdeDunkel,
        huegelNah: PALETTE.himmelNacht1,
        huegelLicht: PALETTE.gegnerSchiefer,
        grasTief: PALETTE.himmelNacht1,
        grasHell: PALETTE.erdeDunkel,
        grasDunkel: PALETTE.himmelNacht1,
        grasFranse: PALETTE.laterne,
        grasLicht: PALETTE.laterne,
        akzentWarm: PALETTE.laterne,
        blueten: [
            PALETTE.laterne,
            PALETTE.fensterWarm,
            PALETTE.blueteWeiss,
            PALETTE.gegnerSchiefer,
            PALETTE.gold,
        ],
    },
};

// Aktuelle Stimmung der laufenden Szene. Jede Szene setzt sie einmal
// zu Beginn (setzeStimmung), danach lesen alle Zeichen-Helfer daraus —
// so wechselt ein ganzes Level die Stimmung durch eine einzige Zeile
// (STYLEGUIDE.md Abschnitt 3).
let aktuelleStimmung = STIMMUNG.TAG;

function setzeStimmung(stimmung) {
    aktuelleStimmung = stimmung;
}

// ============================================
// EBENEN- UND PARALLAX-SYSTEM
// ============================================
// Siehe STYLEGUIDE.md Abschnitt 4 und die Erweiterung in Abschnitt 13
// (Horizont-Dunst, Waldband, Bluetenwiesen-Band schliessen die Luecke
// zwischen Huegel und Spielebene).

const Z = {
    himmel: -100,
    bergFern: -90,
    bergNah: -80,
    dunst: -75,        // NEU (Abschnitt 13)
    huegel: -70,
    wolken: -60,
    wald: -45,         // NEU (Abschnitt 13)
    wiesenband: -30,   // NEU (Abschnitt 13)
    bodenBlock: -2,    // Kollisionsbloecke des Levels
    bodenDeko: -1,     // Grasband/Franse/Blueten darueber
    level: 0,          // Spieler, Gegner, Plattformen, Sterne
    vordergrund: 10,
    partikel: 50,
    ui: 100,
};

const PARALLAX = {
    himmel: 0.0,
    bergFern: 0.08,
    dunst: 0.12,
    bergNah: 0.18,
    huegel: 0.35,
    wolken: 0.5,
    wald: 0.55,
    wiesenband: 0.75,
    level: 1.0,
    vordergrund: 1.3,
};

// ============================================
// PARALLAX-HILFSFUNKTIONEN
// ============================================

// Rechnet eine "Basis"-Weltposition in die tatsaechliche Zeichen-
// position um (faktor 0 = klebt am Bildschirm, faktor 1 = bewegt sich
// exakt wie die Spielwelt). Fuer EINZELNE Objekte, die an einer festen
// Weltposition haengen.
//
// Formel: renderPos = basisPos * faktor + kameraPos * (1 - faktor)
function parallaxPos(basisPos, faktor) {
    const kamera = camPos();
    return vec2(
        basisPos.x * faktor + kamera.x * (1 - faktor),
        basisPos.y * faktor + kamera.y * (1 - faktor)
    );
}

// --- Ebenen-Raum (fuer ganze Hintergrund-Ebenen) --------------------
//
// WARUM ES parallaxPos NICHT TUT (STYLEGUIDE.md Abschnitt 13,
// "Parallax-Warnung"): parallaxPos staucht die *Verteilung* einer Ebene
// um den Faktor. Vier ferne Berge, die in Basis-Koordinaten 700 px
// auseinander stehen, landen bei Faktor 0,08 nur 56 px auseinander —
// ein einziger Blob, der ueber das ganze Level kaum wandert.
//
// Deshalb werden Hintergrund-Ebenen im "Ebenen-Raum" entworfen: in
// Bildschirm-Pixeln (1024 x 576, genau wie das Mockup), und nur der
// Nullpunkt der Ebene wird pro Bild verschoben. Eine Ebene ist so breit
// wie Bildschirm + Gesamt-Wanderung (ebenenBreite()), also eine
// durchgehende Kette statt vier Einzelformen.
//
// Y bekommt bewusst KEINE Parallax: die Kamera folgt dem Spieler, der
// im Level ~340 px nach oben klettert. Mit vertikaler Parallax wuerde
// der ganze Mittelgrund (Faktor 0,75) dabei um ~250 px nach unten
// wandern und hinter dem Boden verschwinden. Die Kulisse bleibt
// stattdessen vertikal am Bildschirm — Standard fuer seitlich
// scrollende Spiele und die Voraussetzung dafuer, dass die Komposition
// ueber alle 4944 px des Levels haelt.

let EBENEN_BEZUG_X = 0;

// Kamera-X, bei der Ebenen-Koordinaten exakt Bildschirm-Koordinaten
// sind. Jede Szene setzt das einmal (Spiel: Kamera-Startposition,
// statische Bildschirme: width()/2).
function setzeEbenenBezug(x) {
    EBENEN_BEZUG_X = x;
}

// Nullpunkt einer Ebene in Weltkoordinaten fuer dieses Bild.
function ebenenAnker(faktor) {
    const k = camPos();
    return vec2(
        EBENEN_BEZUG_X - width() / 2 + (k.x - EBENEN_BEZUG_X) * (1 - faktor),
        k.y - height() / 2
    );
}

// Wie weit diese Ebene seit dem Bezugspunkt gewandert ist (in
// Bildschirm-Pixeln, nach links positiv).
function ebenenVersatz(faktor) {
    return (camPos().x - EBENEN_BEZUG_X) * faktor;
}

// Wie breit eine Ebene angelegt werden muss, damit sie ueber das ganze
// Level reicht.
function ebenenBreite(faktor, levelBreite) {
    return width() + (levelBreite - EBENEN_BEZUG_X) * faktor + 200;
}

// Sichtbarer X-Bereich in Ebenen-Koordinaten (mit 100 px Rand) —
// Grundlage fuer das Culling (STYLEGUIDE.md Abschnitt 12).
function sichtFenster(anker) {
    const k = camPos();
    return {
        von: k.x - width() / 2 - 100 - anker.x,
        bis: k.x + width() / 2 + 100 - anker.x,
    };
}

// Dasselbe in Weltkoordinaten — fuer die Spielebene (Faktor 1,0).
function sichtFensterWelt() {
    const k = camPos();
    return { von: k.x - width() / 2 - 100, bis: k.x + width() / 2 + 100 };
}

// Fuegt ein reines Hintergrund-Objekt hinzu: keine Position/Kollision, nur
// eine Zeichenfunktion auf der angegebenen Ebene. Wird von JEDER Szene
// benutzt (Spiel UND die statischen Bildschirme Auswahl/Gewonnen/Verloren),
// damit alle die gleiche Himmel/Berge/Wolken-Kulisse teilen. Fuer statische
// Szenen ohne Kamera-Bewegung: camPos() zu Szenenbeginn auf einen
// bekannten Wert setzen (z.B. width()/2, height()/2) und
// setzeEbenenBezug(width()/2) aufrufen — dann sind Ebenen-Koordinaten
// exakt Bildschirm-Koordinaten.
function hintergrundEbene(zeichnung, zEbene) {
    const obj = add([z(zEbene)]);
    obj.onDraw(zeichnung);
    return obj;
}

// ============================================
// FARB-HELFER
// ============================================

// Mischt zwei Farb-Arrays. Reines JS, kein Kaboom — darf also auch
// beim Szenenaufbau und im Datei-Scope benutzt werden.
function mische(aArr, bArr, t) {
    const k = Math.min(Math.max(t, 0), 1);
    return [
        aArr[0] + (bArr[0] - aArr[0]) * k,
        aArr[1] + (bArr[1] - aArr[1]) * k,
        aArr[2] + (bArr[2] - aArr[2]) * k,
    ];
}

// EIGENKONTUR (Comic-Regel, STYLEGUIDE.md Abschnitt 11): dieselbe
// Farbe, um f abgedunkelt — niemals reines Schwarz, niemals eine
// Fremdfarbe. Nur fuer Spielobjekte und Vordergrund; Hintergrund-
// ebenen bekommen KEINE Kontur (Kontur ist ein Naehe-Signal).
function kontur(farbeArr, f = 0.35) {
    return rgb(
        Math.round(farbeArr[0] * (1 - f)),
        Math.round(farbeArr[1] * (1 - f)),
        Math.round(farbeArr[2] * (1 - f))
    );
}

// Wie kontur(), aber als Array (fuer Weiterverarbeitung/mische()).
function konturArr(farbeArr, f = 0.35) {
    return [farbeArr[0] * (1 - f), farbeArr[1] * (1 - f), farbeArr[2] * (1 - f)];
}

// Mischt eine Vordergrundfarbe Richtung Himmelfarbe, je nach
// Tiefe (0 = vorne/keine Mischung, 1 = ganz hinten/volle Mischung).
// Umsetzung der Luftperspektive-Formel aus STYLEGUIDE.md Abschnitt 7.
// maxMischung: fuer die beiden Bergketten 0,6 (Abschnitt 7), fuer die
// neuen Mittelgrund-Ebenen hoechstens 0,2 (Korrektur in Abschnitt 13 —
// mehr Dunst frisst die Saettigung des ganzen Mittelgrunds).
function luftperspektive(farbeArr, himmelArr, tiefe, maxMischung = 0.6) {
    const t = Math.min(Math.max(tiefe, 0), 1) * maxMischung;
    return rgb(...mische(farbeArr, himmelArr, t));
}

// ============================================
// DETERMINISTISCHER ZUFALL
// ============================================
// HARTE REGEL (STYLEGUIDE.md Abschnitt 12): niemals rand() innerhalb
// von onDraw() — das erzeugt jedes Bild neue Positionen und flackert.
// Stattdessen: entweder einmal beim Szenenaufbau in ein Array
// vorberechnen (saatZufall + streuNester), oder aus einer festen Zahl
// ableiten (hashZahl) — beides liefert bei gleichem Eingabewert immer
// exakt denselben Wert.

// mulberry32 — kleiner, schneller Zufallsgenerator mit Saat.
function saatZufall(saat) {
    let s = saat | 0;
    return function () {
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Zustandsloser Hash: gleiche Zahl -> immer derselbe Wert 0..1.
// Fuer sehr dichte Deko (Grashalme, Franse), bei der die Position
// direkt aus dem Spalten-Index folgt — ein Array waere dort nur
// Speicher ohne Nutzen, und flackern kann es genauso wenig.
function hashZahl(n) {
    const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
}

// STREUUNG IN NESTERN (STYLEGUIDE.md Abschnitt 11): Blueten werden um
// Cluster-Zentren gestreut (Wurzel-Verteilung im Radius), nicht
// gleichverteilt — Gleichverteilung liest sich als Textur-Rauschen,
// Nester lesen sich als Wiese. 74 % einer Bluete tragen die Farbe
// ihres Nests.
//
// Rueckgabe: VORBERECHNETES Array [{x, y, g, t}], nach x sortiert
// (damit das Culling nach dem ersten Treffer rechts abbrechen kann).
//   g = Groessenfaktor 0,55..1,4
//   t = Index in die Bluetenfarben-Liste der Stimmung (0..4)
//
// NUR beim Szenenaufbau aufrufen, NIE in onDraw().
function streuNester(x0, x1, y0, y1, anzahl, saat) {
    const zuf = saatZufall(saat);
    const breite = x1 - x0;
    const nesterZahl = Math.max(3, Math.round(breite / 62));
    const nester = [];
    for (let i = 0; i < nesterZahl; i++) {
        nester.push({
            x: x0 + zuf() * breite,
            y: y0 + zuf() * (y1 - y0),
            rx: 26 + zuf() * 62,
            ry: 3 + (y1 - y0) * 0.42 * zuf() + 3,
            t: Math.floor(zuf() * 5),
        });
    }
    const punkte = [];
    for (let i = 0; i < anzahl; i++) {
        const n = nester[Math.floor(zuf() * nester.length)];
        const winkel = zuf() * Math.PI * 2;
        const u = Math.sqrt(zuf());
        const x = n.x + Math.cos(winkel) * n.rx * u;
        const y = n.y + Math.sin(winkel) * n.ry * u;
        if (x < x0 - 6 || x > x1 + 6 || y < y0 - 8 || y > y1 + 6) continue;
        punkte.push({
            x: x,
            y: y,
            g: 0.55 + zuf() * 0.85,
            t: zuf() < 0.74 ? n.t : Math.floor(zuf() * 5),
        });
    }
    punkte.sort((a, b) => a.x - b.x);
    return punkte;
}

// Vorberechnete Halm-Positionen (gleichverteilt, aber mit Hoehen- und
// Neigungsstreuung). Ebenfalls nur beim Szenenaufbau aufrufen.
function streuHalme(x0, x1, y, spanne, anzahl, hoehe, saat) {
    const zuf = saatZufall(saat);
    const punkte = [];
    for (let i = 0; i < anzahl; i++) {
        punkte.push({
            x: x0 + zuf() * (x1 - x0),
            y: y + zuf() * spanne,
            h: hoehe * (0.55 + zuf() * 0.9),
            n: (zuf() - 0.5) * hoehe * 0.62,
            hell: zuf() < 0.42,
        });
    }
    punkte.sort((a, b) => a.x - b.x);
    return punkte;
}

// ============================================
// SAMMLER — viele kleine Formen in EINEM Zeichenaufruf
// ============================================
// Kaboom schickt jeden drawX()-Aufruf einzeln durch den Batcher.
// Bei den Dichte-Zielen aus STYLEGUIDE.md Abschnitt 12 (mehrere hundert
// Blueten und Halme pro Bild) waeren das tausende Aufrufe pro Bild.
// Der Sammler haengt die Dreiecke stattdessen an EIN drawPolygon mit
// eigenen indices und Vertex-Farben.
//
// Grenze: Kaboom's Batch-Puffer fasst 8192 Vertizes / 12288 indices
// pro Aufruf. Der Sammler gibt vorher selbsttaetig zwischenab.

const SAMMLER_GRENZE = 4800;

function neuerSammler(deckkraft = 1) {
    return { pts: [], farben: [], indices: [], deckkraft: deckkraft };
}

// punkte: [{x, y}, ...] — wird als Dreiecks-Faecher ab punkte[0]
// angehaengt. punkte[0] muss also "innen" liegen (Kreis-Mittelpunkt,
// Halm-Fusspunkt).
function sammleForm(s, punkte, farbe) {
    if (s.pts.length + punkte.length > SAMMLER_GRENZE) zeichneSammler(s);
    const b = s.pts.length;
    for (const p of punkte) {
        s.pts.push(p);
        s.farben.push(farbe);
    }
    for (let i = 1; i < punkte.length - 1; i++) {
        s.indices.push(b, b + i, b + i + 1);
    }
}

function zeichneSammler(s) {
    if (s.indices.length === 0) return;
    drawPolygon({
        pts: s.pts,
        colors: s.farben,
        indices: s.indices,
        opacity: s.deckkraft,
    });
    s.pts.length = 0;
    s.farben.length = 0;
    s.indices.length = 0;
}

// ============================================
// FLAECHEN-HELFER (Silhouetten)
// ============================================
// Kaboom's drawPolygon trianguliert standardmaessig als Faecher ab
// pts[0] — fuer eine wellige Bergkamm- oder Huegelsilhouette (nicht
// konvex) gibt das Muell. Diese beiden Helfer bauen stattdessen einen
// Dreiecks-Streifen mit eigenen indices: EIN Zeichenaufruf, und
// beliebig zerklueftete Oberkanten sind erlaubt.

// Flaeche zwischen einer Oberkante (Punktliste) und einer Unterkante
// (Zahl = gerade Linie, oder Punktliste gleicher Laenge).
// farbeOben/farbeUnten erzeugen einen vertikalen Wertverlauf.
function zeichneFlaeche(oben, unten, farbeOben, farbeUnten, deckkraft = 1) {
    const n = oben.length;
    if (n < 2) return;
    const pts = [];
    const farben = [];
    const idx = [];
    const untenIstZahl = typeof unten === "number";
    for (let i = 0; i < n; i++) {
        pts.push(oben[i]);
        farben.push(farbeOben);
        pts.push(untenIstZahl ? { x: oben[i].x, y: unten } : unten[i]);
        farben.push(farbeUnten || farbeOben);
        if (i > 0) {
            const a = (i - 1) * 2;
            idx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
        }
    }
    drawPolygon({ pts: pts, colors: farben, indices: idx, opacity: deckkraft });
}

// Schmales Band entlang einer Kante — fuer die Streiflicht-Oberkante
// von Huegeln (STYLEGUIDE.md Abschnitt 7: Licht kommt von oben rechts).
function zeichneKantenband(kante, dicke, farbe, deckkraft = 1) {
    const unten = kante.map((p) => ({ x: p.x, y: p.y + dicke }));
    zeichneFlaeche(kante, unten, farbe, farbe, deckkraft);
}

// Kreis als Punktliste (Mittelpunkt zuerst) — Futter fuer den Sammler.
function kreisPunkte(cx, cy, r, segmente) {
    const pts = [{ x: cx, y: cy }];
    for (let i = 0; i <= segmente; i++) {
        const a = (i / segmente) * Math.PI * 2;
        pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    return pts;
}

// ============================================
// HIMMEL
// ============================================

// Schlieren-Wolkenfetzen im Himmel, als Bildschirm-Anteile hinterlegt
// (deterministisch, damit nichts flackert).
const HIMMEL_SCHLIEREN = (() => {
    const zuf = saatZufall(21);
    const liste = [];
    for (let i = 0; i < 9; i++) {
        liste.push({
            x: zuf(),
            y: 0.08 + zuf() * 0.4,
            rx: 0.11 + zuf() * 0.27,
            ry: 5 + zuf() * 11,
            o: 0.05 + zuf() * 0.09,
        });
    }
    return liste;
})();

// Vollflaechiger Himmel, klebt fest an der Kamera (Parallax 0).
// SECHS Verlaufsstopps statt zwei (STYLEGUIDE.md Abschnitt 11).
// Fallstrick: Kaboom's `gradient:` nimmt genau ZWEI Farben — mehr
// Stopps gibt es nur, indem man Baender stapelt.
function himmelVerlauf(stimmung = aktuelleStimmung) {
    const a = ebenenAnker(PARALLAX.himmel);
    const b = width() + 8;
    const h = height() + 8;
    const x = a.x - 4;
    const y = a.y - 4;

    const stopps = [
        [0.0, stimmung.himmelZenit],
        [0.3, stimmung.himmel1],
        [0.55, mische(stimmung.himmel1, stimmung.himmel2, 0.5)],
        [0.72, stimmung.himmel2],
        [0.84, stimmung.himmelDunst],
        [1.0, stimmung.himmelDunstWarm],
    ];
    for (let i = 0; i < stopps.length - 1; i++) {
        const y0 = y + stopps[i][0] * h;
        const y1 = y + stopps[i + 1][0] * h;
        drawRect({
            pos: vec2(x, y0),
            width: b,
            height: y1 - y0 + 1,
            gradient: [rgb(...stopps[i][1]), rgb(...stopps[i + 1][1])],
            horizontal: false,
        });
    }

    // Weiche Schlieren — nehmen dem Verlauf das Diagramm-Hafte.
    const weiss = rgb(...PALETTE.wolkeHell);
    for (const s of HIMMEL_SCHLIEREN) {
        drawEllipse({
            pos: vec2(x + s.x * b, y + s.y * h),
            radiusX: s.rx * b,
            radiusY: s.ry,
            color: weiss,
            opacity: s.o,
            resolution: 0.35,
        });
    }
}

// ============================================
// WOLKEN
// ============================================
// 5 Wertstufen (Dunst-Halo, Unterschatten, Schatten, Mittelton,
// Kernweiss) aus 14-22 Lappen, dazu 12-20 kleine Silhouetten-Beulen
// (STYLEGUIDE.md Abschnitt 11 + 12).
//
// Die komplette Wolkengeometrie wird EINMAL je (Saat, Groesse,
// Stimmung) gebaut und danach nur noch verschoben gezeichnet: ein
// einziger drawPolygon-Aufruf pro Wolke statt ~80 drawCircle.

const WOLKEN_CACHE = new Map();

function wolkenGeometrie(groesse, saat, stimmung) {
    const schluessel = saat + "|" + groesse + "|" + stimmung.name;
    if (WOLKEN_CACHE.has(schluessel)) return WOLKEN_CACHE.get(schluessel);

    const zuf = saatZufall(saat);
    const s = groesse * 46;
    const lappen = [];

    // Untere, breite Reihe
    const n = 8 + Math.floor(zuf() * 3);
    for (let i = 0; i < n; i++) {
        const t = n === 1 ? 0.5 : i / (n - 1);
        lappen.push({
            x: (t - 0.5) * s * 2.05,
            y: (0.16 + zuf() * 0.14) * s,
            r: (0.34 + zuf() * 0.2) * s,
        });
    }
    // Obere, aufgetuermte Reihe
    const m = 6 + Math.floor(zuf() * 3);
    for (let i = 0; i < m; i++) {
        const t = (i + 0.5) / m;
        lappen.push({
            x: (t - 0.5) * s * 1.5 + (zuf() - 0.5) * s * 0.24,
            y: -(0.14 + zuf() * 0.46) * s,
            r: (0.24 + zuf() * 0.26) * s,
        });
    }
    // Silhouetten-Beulen: kleine Ausbuchtungen auf der Sonnenseite —
    // "Silhouetten duerfen nie glatt sein".
    const beulen = [];
    for (let i = 0; i < 15; i++) {
        const l = lappen[Math.floor(zuf() * lappen.length)];
        const a = -Math.PI * 0.15 - zuf() * Math.PI * 0.7;
        beulen.push({
            x: l.x + Math.cos(a) * l.r * 0.86,
            y: l.y + Math.sin(a) * l.r * 0.86,
            r: l.r * (0.16 + zuf() * 0.2),
        });
    }

    const sammler = neuerSammler();
    const ton = (farbe) => mische(farbe, stimmung.wolkeTon, stimmung.wolkeMischung);
    const durchgang = (arr, farbe, dx, dy, k, seg) => {
        const c = rgb(...ton(farbe));
        for (const l of arr) {
            sammleForm(sammler, kreisPunkte(l.x * k + dx, l.y * k + dy, l.r * k, seg), c);
        }
    };
    // Reihenfolge = Wertstufen von hinten nach vorne
    durchgang(lappen, PALETTE.wolkeTief, 0, s * 0.14, 1.0, 10);
    durchgang(lappen, PALETTE.wolkeSchatten, 0, 0, 1.0, 10);
    durchgang(lappen, PALETTE.wolkeMitte, -s * 0.04, -s * 0.09, 0.94, 10);
    durchgang(lappen, PALETTE.wolkeHell, -s * 0.09, -s * 0.19, 0.8, 10);
    durchgang(beulen, PALETTE.wolkeHell, -s * 0.03, -s * 0.05, 1.0, 7);

    const geo = {
        koerper: { pts: sammler.pts, farben: sammler.farben, indices: sammler.indices },
        halo: { rx: s * 1.5, ry: s * 0.8, dy: s * 0.2, farbe: ton(PALETTE.wolkeHell) },
    };
    WOLKEN_CACHE.set(schluessel, geo);
    return geo;
}

// Weiche Wolke. xEbene/yBild sind Ebenen-Koordinaten (Bildschirm-Raster).
function zeichneWolke(xEbene, yBild, groesse = 1, faktor = PARALLAX.wolken, saat = 7) {
    const stimmung = aktuelleStimmung;
    const a = ebenenAnker(faktor);
    const f = sichtFenster(a);
    const g = wolkenGeometrie(groesse, saat, stimmung);
    if (xEbene + g.halo.rx < f.von || xEbene - g.halo.rx > f.bis) return;

    const px = a.x + xEbene;
    const py = a.y + yBild;
    // Stufe 1: weicher Dunst-Halo (eigener Durchgang wegen Deckkraft)
    drawEllipse({
        pos: vec2(px, py + g.halo.dy),
        radiusX: g.halo.rx,
        radiusY: g.halo.ry,
        color: rgb(...g.halo.farbe),
        opacity: 0.16,
        resolution: 0.4,
    });
    // Stufen 2-5 in einem Aufruf
    drawPolygon({
        pos: vec2(px, py),
        pts: g.koerper.pts,
        colors: g.koerper.farben,
        indices: g.koerper.indices,
    });
}

// ============================================
// BERGKETTEN
// ============================================
// EINE durchgehende Kette ueber die volle Ebenen-Breite statt vier
// Einzelpolygonen. Kamm aus 3-facher Mittelpunkt-Verschiebung
// (fraktal, 33-65 Punkte statt 5), Grat-Keile, unregelmaessige
// Schneegrenze, bewaldeter Fuss — 4 Wertstufen (Abschnitt 11).
//
// Auch hier: Geometrie einmal bauen, danach nur verschieben.
// Deckkraefte sind in die Farben eingerechnet (Grate liegen immer auf
// Fels, Waldtupfen immer auf Fels), damit alles in EINEN Aufruf passt.

const BERG_CACHE = new Map();

// Fraktaler Kamm: 3x Mittelpunkt-Verschiebung.
function kammPunkte(x0, x1, basisY, gipfel, rauheit, zuf) {
    let pts = [{ x: x0, y: basisY }, ...gipfel, { x: x1, y: basisY }];
    let r = rauheit;
    for (let it = 0; it < 3; it++) {
        const neu = [pts[0]];
        for (let i = 0; i < pts.length - 1; i++) {
            const a = pts[i];
            const b = pts[i + 1];
            const d = Math.hypot(b.x - a.x, b.y - a.y);
            neu.push({
                x: (a.x + b.x) / 2 + (zuf() - 0.5) * d * r * 0.22,
                y: Math.min(basisY, (a.y + b.y) / 2 - (zuf() - 0.5) * d * r),
            });
            neu.push(b);
        }
        pts = neu;
        r *= 0.5;
    }
    return pts;
}

function bergkettenGeometrie(o) {
    const schluessel = o.saat + "|" + Math.round(o.breite) + "|" + aktuelleStimmung.name;
    if (BERG_CACHE.has(schluessel)) return BERG_CACHE.get(schluessel);

    const zuf = saatZufall(o.saat);
    const basisY = o.basisY;

    // Gipfel gleichmaessig ueber die Breite verteilt, mit Streuung
    const gipfelZahl = Math.max(5, Math.round(o.breite / 230));
    const gipfel = [];
    for (let i = 0; i < gipfelZahl; i++) {
        const t = (i + 0.5) / gipfelZahl;
        gipfel.push({
            x: t * o.breite + (zuf() - 0.5) * (o.breite / gipfelZahl) * 0.5,
            y: basisY - o.hoeheMin - zuf() * (o.hoeheMax - o.hoeheMin),
        });
    }

    const kamm = kammPunkte(-60, o.breite + 60, basisY, gipfel, o.rauheit, zuf);

    const pts = [];
    const farben = [];
    const idx = [];
    const anhaengen = (punkte, farbenListe) => {
        const b = pts.length;
        for (let i = 0; i < punkte.length; i++) {
            pts.push(punkte[i]);
            farben.push(farbenListe[i]);
        }
        for (let i = 1; i < punkte.length - 1; i++) idx.push(b, b + i, b + i + 1);
    };
    const streifen = (oben, unten, farbeOben, farbeUnten) => {
        const b = pts.length;
        for (let i = 0; i < oben.length; i++) {
            pts.push(oben[i]);
            farben.push(farbeOben);
            pts.push(unten[i]);
            farben.push(farbeUnten);
            if (i > 0) {
                const a = b + (i - 1) * 2;
                idx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
            }
        }
    };

    // Stufe 1: Fels, mit vertikalem Wertverlauf nach unten
    const felsOben = rgb(...o.fels);
    const felsUnten = rgb(...mische(o.fels, o.grat, 0.4));
    streifen(kamm, kamm.map((p) => ({ x: p.x, y: basisY + 90 })), felsOben, felsUnten);

    // Stufe 2: Grate — dunklere Fallinien von den Gipfeln. Bewusst kurz
    // und flau (Deckkraft 0,26 eingerechnet), sonst lesen sie sich als
    // Kratzer statt als Fels. Nur ueber die oberen 45-75 %.
    const gratFarbe = rgb(...mische(o.fels, o.grat, 0.26));
    // Hoehe des TATSAECHLICH gezeichneten Kamms an einer x-Stelle, linear
    // zwischen den beiden umgebenden Kammpunkten interpoliert. gipfel[] sind
    // nur die angepeilten Zielpunkte - nach der fraktalen Verschiebung liegt
    // der Kamm daneben deutlich hoeher oder tiefer. Ohne diese Abfrage
    // ragten die Keile neben spitzen Gipfeln in den Himmel oder schwebten
    // losgeloest in der Flanke.
    const kammHoehe = (x) => {
        for (let i = 1; i < kamm.length; i++) {
            const a = kamm[i - 1];
            const b = kamm[i];
            if (x >= a.x && x <= b.x) {
                const t = b.x === a.x ? 0 : (x - a.x) / (b.x - a.x);
                return a.y + (b.y - a.y) * t;
            }
        }
        return x <= kamm[0].x ? kamm[0].y : kamm[kamm.length - 1].y;
    };
    for (const g of gipfel) {
        for (let k = 0; k < 3; k++) {
            const dx = (zuf() - 0.5) * o.gratBreite;
            const br = 11 + zuf() * 18;
            const gx = g.x + dx;
            // Spitze des Keils sitzt 10 px UNTER dem echten Kamm ...
            const oben = kammHoehe(gx) + 10;
            const ende = oben + (basisY - oben) * (0.24 + zuf() * 0.22);
            // ... und auch die beiden Fusspunkte werden unter ihre eigene
            // Kammhoehe gezogen, sonst treten sie in einer tiefer
            // liegenden Flanke wieder aus der Silhouette heraus.
            const fussLinks = Math.max(ende, kammHoehe(gx - br) + 6);
            const fussRechts = Math.max(ende, kammHoehe(gx + br * 0.5) + 6);
            anhaengen(
                [
                    { x: gx, y: oben },
                    { x: gx - br, y: fussLinks },
                    { x: gx + br * 0.5, y: fussRechts },
                ],
                [gratFarbe, gratFarbe, gratFarbe]
            );
        }
    }

    // Stufe 3: Schnee oberhalb einer WELLIGEN Grenze. Kaboom hat keinen
    // ClipPath — stattdessen ein zweiter Streifen, dessen Unterkante an
    // der Schneelinie liegt und dort, wo der Kamm schon darunter ist,
    // auf Hoehe null zusammenfaellt.
    const schneeOben = rgb(...o.schnee);
    const schneeUnten = rgb(...mische(o.schnee, o.fels, 0.35));
    const schneeKante = kamm.map((p, i) => {
        const grenze =
            o.schneeY + Math.sin(p.x * 0.07) * 7 + (hashZahl(i + o.saat) - 0.5) * 11;
        return { x: p.x, y: Math.max(p.y, grenze) };
    });
    streifen(kamm, schneeKante, schneeOben, schneeUnten);

    // Stufe 4: bewaldeter Fuss (Sockel)
    if (o.wald) {
        const waldFarbe = rgb(...mische(o.fels, o.wald, 0.55));
        const waldZahl = Math.round((o.breite / 1024) * 30);
        for (let i = 0; i < waldZahl; i++) {
            const x = zuf() * o.breite;
            const y = basisY - 3 - zuf() * 13;
            const r = 4 + zuf() * 8;
            const kp = kreisPunkte(x, y, r, 7);
            anhaengen(kp, kp.map(() => waldFarbe));
        }
    }

    const geo = { pts: pts, farben: farben, indices: idx };
    BERG_CACHE.set(schluessel, geo);
    return geo;
}

// o: { saat, breite, basisY, hoeheMin, hoeheMax, rauheit, schneeY,
//      gratBreite, fels, grat, schnee, wald, faktor }
// Alle Y-Werte sind Ebenen-Koordinaten (Bildschirm-Raster).
function zeichneBergkette(o) {
    const geo = bergkettenGeometrie(o);
    const a = ebenenAnker(o.faktor);
    drawPolygon({
        pos: a,
        pts: geo.pts,
        colors: geo.farben,
        indices: geo.indices,
    });
}

// ============================================
// HORIZONT-DUNST (NEU, Ebene Z -75)
// ============================================
// Loest die Bergfuesse auf. Bewusst schwach: Deckkraft <= 0,35 und nur
// ~74 px hoch (STYLEGUIDE.md Abschnitt 13) — zu viel Dunst frisst die
// Saettigung des gesamten Mittelgrunds.
function zeichneDunstband(breite, yOben, hoehe = 74, faktor = PARALLAX.dunst) {
    const stimmung = aktuelleStimmung;
    const a = ebenenAnker(faktor);
    const f = sichtFenster(a);
    const kuehl = rgb(...stimmung.himmelDunst);
    const warm = rgb(...stimmung.himmelDunstWarm);
    const stufen = [0.08, 0.2, 0.32, 0.18];
    const bandHoehe = hoehe / 4;
    const von = Math.max(0, f.von);
    const bis = Math.min(breite, f.bis);
    if (bis <= von) return;
    for (let i = 0; i < 4; i++) {
        drawRect({
            pos: vec2(a.x + von, a.y + yOben + i * bandHoehe),
            width: bis - von,
            height: bandHoehe + 1,
            color: i === 3 ? warm : kuehl,
            opacity: stufen[i],
        });
    }
    // Schwaden — machen aus dem Band eine Dunstschicht statt eines Streifens.
    const anzahl = Math.round(breite / 95);
    for (let i = 0; i < anzahl; i++) {
        const x = ((i + 0.5) / anzahl) * breite + (hashZahl(i * 3 + 1) - 0.5) * 90;
        if (x < f.von - 240 || x > f.bis + 240) continue;
        drawEllipse({
            pos: vec2(a.x + x, a.y + yOben + 28 + hashZahl(i * 3 + 2) * 32),
            radiusX: 70 + hashZahl(i * 3 + 3) * 150,
            radiusY: 6 + hashZahl(i * 5 + 4) * 11,
            color: kuehl,
            opacity: 0.14 + hashZahl(i * 7 + 5) * 0.18,
            resolution: 0.35,
        });
    }
}

// ============================================
// HUEGEL
// ============================================
// Zwei Reihen, Sinus-Kontur statt Halbellipse, mit Streiflicht-Kante
// oben (Abschnitt 13). Die hintere Reihe wird nur LEICHT Richtung
// Dunst gemischt (max. 0,2 — Korrektur zu Abschnitt 7).
function zeichneHuegel(breite, yBasis, faktor = PARALLAX.huegel) {
    const stimmung = aktuelleStimmung;
    const a = ebenenAnker(faktor);
    const f = sichtFenster(a);
    const unten = a.y + height() + 20;

    const reihe = (yMitte, amp, phase, flaeche, licht) => {
        const schritt = 18;
        const x0 = Math.floor(Math.max(f.von, -60) / schritt) * schritt;
        const x1 = Math.min(f.bis, breite + 60);
        const kante = [];
        for (let x = x0; x <= x1 + schritt; x += schritt) {
            kante.push({
                x: a.x + x,
                y:
                    a.y +
                    yMitte -
                    Math.sin(x * 0.0052 + phase) * amp -
                    Math.sin(x * 0.013 + phase * 2) * amp * 0.34,
            });
        }
        if (kante.length < 2) return;
        zeichneFlaeche(kante, unten, flaeche, flaeche);
        zeichneKantenband(kante, 3.5, licht, 0.7);
    };

    // Hintere Reihe: leicht im Dunst
    reihe(
        yBasis,
        30,
        0.6,
        luftperspektive(stimmung.huegel, stimmung.himmelDunst, 1, 0.14),
        luftperspektive(stimmung.huegelLicht, stimmung.himmelDunst, 1, 0.18)
    );
    // Vordere Reihe: volle Saettigung
    reihe(yBasis + 22, 22, 2.4, rgb(...stimmung.huegelNah), rgb(...stimmung.huegelLicht));
}

// ============================================
// WALDBAND (NEU, Ebene Z -45)
// ============================================
// Baumkrone mit 3 Gruenwerten (Abschnitt 11). Geometrie wird je
// (Saat, Groesse) einmal gebaut — ein Zeichenaufruf pro Baum.

const BAUM_CACHE = new Map();

function baumGeometrie(groesse, saat) {
    const schluessel = saat + "|" + Math.round(groesse) + "|" + aktuelleStimmung.name;
    if (BAUM_CACHE.has(schluessel)) return BAUM_CACHE.get(schluessel);

    const stimmung = aktuelleStimmung;
    const zuf = saatZufall(saat);
    const s = groesse;
    const sammler = neuerSammler();

    // Stamm
    sammleForm(
        sammler,
        [
            { x: -s * 0.09, y: -s * 0.75 },
            { x: s * 0.09, y: -s * 0.75 },
            { x: s * 0.09, y: s * 0.05 },
            { x: -s * 0.09, y: s * 0.05 },
        ],
        rgb(...PALETTE.erdeDunkel)
    );

    const blaetter = [];
    for (let i = 0; i < 7; i++) {
        blaetter.push({
            x: (zuf() - 0.5) * s * 1.15,
            y: -s * 0.85 - zuf() * s * 0.55,
            r: s * (0.26 + zuf() * 0.2),
        });
    }
    const durchgang = (farbe, dx, dy, k) => {
        const c = rgb(...farbe);
        for (const b of blaetter) {
            sammleForm(sammler, kreisPunkte(b.x + dx, b.y + dy, b.r * k, 9), c);
        }
    };
    // 3 Gruenwerte + Schattenmasse
    durchgang(konturArr(stimmung.huegelNah, 0.42), 0, 2, 1.0);
    durchgang(stimmung.huegelNah, 0, 0, 1.0);
    durchgang(stimmung.huegel, -s * 0.05, -s * 0.07, 0.82);
    durchgang(stimmung.huegelLicht, -s * 0.1, -s * 0.14, 0.5);

    const geo = { pts: sammler.pts, farben: sammler.farben, indices: sammler.indices };
    BAUM_CACHE.set(schluessel, geo);
    return geo;
}

function zeichneBaum(x, y, groesse, saat) {
    const geo = baumGeometrie(groesse, saat);
    drawPolygon({ pos: vec2(x, y), pts: geo.pts, colors: geo.farben, indices: geo.indices });
}

// baeume: vorberechnetes Array [{x, y, groesse, saat}] in Ebenen-Koordinaten.
function zeichneWaldband(baeume, faktor = PARALLAX.wald) {
    const a = ebenenAnker(faktor);
    const f = sichtFenster(a);
    for (const b of baeume) {
        if (b.x + 80 < f.von) continue;
        if (b.x - 80 > f.bis) break;
        zeichneBaum(a.x + b.x, a.y + b.y, b.groesse, b.saat);
    }
}

// ============================================
// BLUETENWIESEN-BAND (NEU, Ebene Z -30)
// ============================================
// Der Mittelgrund zwischen Huegel und Spielebene — genau dort entsteht
// in Referenz 1 die Ghibli-Tiefe (Abschnitt 13).
//
// daten: { halme: [...], blueten: [...], oberkanteY, breite } — alles
// beim Szenenaufbau ueber streuHalme()/streuNester() vorberechnet.
function zeichneWiesenband(daten, faktor = PARALLAX.wiesenband) {
    const stimmung = aktuelleStimmung;
    const a = ebenenAnker(faktor);
    const f = sichtFenster(a);
    const unten = a.y + height() + 20;

    // Grasflaeche mit welliger Oberkante
    const schritt = 24;
    const x0 = Math.floor(Math.max(f.von, -40) / schritt) * schritt;
    const x1 = Math.min(f.bis, daten.breite + 40);
    const kante = [];
    for (let x = x0; x <= x1 + schritt; x += schritt) {
        kante.push({ x: a.x + x, y: a.y + daten.oberkanteY - Math.sin(x * 0.009 + 1.1) * 9 });
    }
    if (kante.length < 2) return;
    // Luftperspektive fuer den Mittelgrund: hoechstens 0,2.
    // Kraeftiger Wertverlauf nach unten - dort, wo das Band durch eine
    // Boden-Luecke sichtbar wird, liest es sich sonst als flache gruene
    // Wand statt als entfernter Talgrund.
    const flaeche = luftperspektive(stimmung.grasHell, stimmung.himmelDunst, 1, 0.1);
    const flaecheTief = luftperspektive(stimmung.grasTief, stimmung.himmelDunst, 1, 0.04);
    zeichneFlaeche(kante, unten, flaeche, flaecheTief);

    // Halme
    const halmFarbe = luftperspektive(stimmung.grasDunkel, stimmung.himmelDunst, 1, 0.12);
    const halmSammler = neuerSammler();
    for (const h of daten.halme) {
        if (h.x < f.von) continue;
        if (h.x > f.bis) break;
        sammleHalm(halmSammler, a.x + h.x, a.y + h.y, h.h, h.n, 1.1, halmFarbe);
    }
    zeichneSammler(halmSammler);

    // Bluetentupfen — im Mittelgrund bewusst OHNE Kontur
    // (Kontur ist ein Naehe-Signal, Abschnitt 11).
    const farben = stimmung.blueten.map((c) =>
        luftperspektive(c, PALETTE.wolkeHell, 1, 0.14)
    );
    zeichneBluetenfeld(daten.blueten, a, farben, null, 1.5, false, f);
}

// ============================================
// GRAS, HALME, FRANSE, BLUETEN
// ============================================

// Ein gebogener Grashalm als 5-Punkt-Form (3 Dreiecke): unten breit,
// oben spitz, zur Seite gebogen. Ersetzt die alten geraden Dreiecke.
function sammleHalm(s, x, y, hoehe, neigung, breite, farbe) {
    const mx = x + neigung * 0.42;
    const my = y - hoehe * 0.58;
    sammleForm(
        s,
        [
            { x: x - breite, y: y },
            { x: x + breite, y: y },
            { x: mx + breite * 0.45, y: my },
            { x: x + neigung, y: y - hoehe },
            { x: mx - breite * 0.45, y: my },
        ],
        farbe
    );
}

// Wellige Oberkante eines Bodenblocks (nie eine gerade Linie).
function bodenKante(x, top) {
    return top - 4 - Math.sin(x * 0.021) * 2.4 - Math.sin(x * 0.061) * 1.6;
}

// Unregelmaessige Grasfranse an der Oberkante von Boden-Bloecken.
// NEU: gebogene Halme statt Dreiecke, Abstand 3,2 px statt 6 px
// (280-340 Halme je Bildschirmbreite, Abschnitt 12), 3 Hoehen,
// 2 Farben, und ein leichtes Wiegen im Wind (Abschnitt 6).
// Alle Halme eines Aufrufs gehen in EINEN Zeichenaufruf.
function zeichneGrasFranse(x, y, breite) {
    const stimmung = aktuelleStimmung;
    const schritt = 3.2;
    const franse = rgb(...stimmung.grasFranse);
    const licht = rgb(...stimmung.grasLicht);
    const s = neuerSammler();
    const t = time();
    const anzahl = Math.ceil(breite / schritt);
    const basisI = Math.round(x / schritt);
    for (let i = 0; i < anzahl; i++) {
        const idx = basisI + i;
        const r1 = hashZahl(idx);
        const r2 = hashZahl(idx + 7777);
        const bx = x + i * schritt;
        const h = 5 + Math.floor(r1 * 3) * 4;
        const n = (r2 - 0.5) * 6 + Math.sin(t * 1.6 + idx * 0.55) * 1.4;
        sammleHalm(s, bx, bodenKante(bx, y) + 4, h, n, 0.95, r1 < 0.42 ? licht : franse);
    }
    zeichneSammler(s);
}

// Kleines Grasbueschel als Vordergrund-Deko.
function zeichneGrasbueschel(x, y) {
    const stimmung = aktuelleStimmung;
    const s = neuerSammler();
    const farbe = rgb(...stimmung.grasDunkel);
    for (let i = -1; i <= 1; i++) {
        sammleHalm(s, x + i * 3, y, 11 + Math.abs(i) * 3, i * 3 + wiegen(x * 0.1, 2), 1.4, farbe);
    }
    zeichneSammler(s);
}

// BODENBAND — 6 Wertstufen fuer die Spielflaeche (Abschnitt 11):
// Tiefschatten, Schatten, Sonne, dunkle Halmstriche, helle
// Halmstriche, Trennlinie zur Erde. Weltkoordinaten (Ebene 1,0).
function zeichneBodenband(x, breite, top) {
    const stimmung = aktuelleStimmung;

    // 1 — Grasmasse mit welliger Oberkante (Tiefschatten). Die letzte
    // Stuetzstelle wird exakt auf die Blockkante geklemmt, sonst haengt
    // ein dunkelgruener Zipfel ueber den Boden hinaus.
    const schritt = 8;
    const kante = [];
    for (let bx = x; bx < x + breite; bx += schritt) {
        kante.push({ x: bx, y: bodenKante(bx, top) });
    }
    kante.push({ x: x + breite, y: bodenKante(x + breite, top) });
    zeichneFlaeche(kante, top + 34, rgb(...stimmung.grasTief), rgb(...stimmung.grasTief));

    // 2 — Schattenband
    drawRect({
        pos: vec2(x, top),
        width: breite,
        height: 30,
        color: rgb(...stimmung.grasDunkel),
    });
    // 3 — Sonnenband (Licht kommt von oben)
    drawRect({
        pos: vec2(x, top),
        width: breite,
        height: 15,
        color: rgb(...stimmung.grasHell),
    });

    // 4 + 5 — dunkle und helle Halmstriche (260-340 je Bildschirmbreite)
    const s = neuerSammler();
    const tief = rgb(...stimmung.grasTief);
    const franse = rgb(...stimmung.grasFranse);
    const abstand = 3.6;
    const anzahl = Math.ceil(breite / abstand);
    const basisI = Math.round(x / abstand);
    for (let i = 0; i < anzahl; i++) {
        const idx = basisI + i;
        const r1 = hashZahl(idx + 313);
        const r2 = hashZahl(idx + 991);
        const bx = x + i * abstand;
        if (r1 < 0.55) {
            sammleHalm(s, bx, top + 26 + r2 * 6, 8 + r1 * 10, (r2 - 0.5) * 7, 0.9, tief);
        } else {
            sammleHalm(s, bx, top + 14 + r2 * 5, 6 + r2 * 8, (r1 - 0.5) * 6, 0.8, franse);
        }
    }
    zeichneSammler(s);

    // 6 — Trennlinie zur Erde
    drawRect({
        pos: vec2(x, top + 30),
        width: breite,
        height: 3,
        color: kontur(stimmung.grasTief, 0.4),
        opacity: 0.55,
    });
}

// Ein Blueten-Tupfen als leicht ovales Sechseck (8 Vertizes, 6
// Dreiecke). Warum nicht drawCircle: Kaboom baut jeden Kreis aus 45
// Segmenten. Warum nicht drawRect mit `radius`: Kaboom baut jede
// abgerundete Ecke aus 12 Bogenpunkten — das waere bei 2-4 px grossen
// Tupfen sogar teurer als der Kreis. Und warum nicht das nackte
// Rechteck: bei diesen Groessen liest sich ein Feld aus Quadraten als
// Konfetti statt als Wiese (Abschnitt 12, Leistungs-Auflagen).
function bluetenPunkte(x, y, r) {
    const pts = [{ x: x, y: y }];
    for (let i = 0; i <= 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        pts.push({ x: x + Math.cos(a) * r * 1.15, y: y + Math.sin(a) * r * 0.85 });
    }
    return pts;
}

// BLUETENFELD — zeichnet ein mit streuNester() vorberechnetes Array.
// Ersetzt das alte zeichneBlume() als Massen-Deko. Alle sichtbaren
// Tupfen gehen gebuendelt in wenige Zeichenaufrufe.
function zeichneBluetenfeld(punkte, anker, farben, konturen, groesse, mitKontur, fenster) {
    const f = fenster || sichtFenster(anker);
    const s = neuerSammler();
    for (const p of punkte) {
        if (p.x < f.von) continue;
        if (p.x > f.bis) break;
        const r = groesse * p.g;
        const x = anker.x + p.x;
        const y = anker.y + p.y;
        // Eigenkontur erst ab einer Groesse, bei der sie auch traegt
        if (mitKontur && r > 1.7) {
            sammleForm(s, bluetenPunkte(x, y, r + 0.9), konturen[p.t]);
        }
        sammleForm(s, bluetenPunkte(x, y, r), farben[p.t]);
    }
    zeichneSammler(s);
}

// Einzelne, grosse 5-Blueten-Blume MIT Eigenkontur — fuer die
// Vordergrund-Ebene, wo einzelne Blueten gross genug sind, dass die
// Kontur traegt.
function zeichneBlume(x, y, farbeArr = PALETTE.blueteRosa, groesse = 1) {
    const s = neuerSammler();
    const f = rgb(...farbeArr);
    const k = kontur(farbeArr, 0.3);
    const r = 3.6 * groesse;
    for (let i = 0; i < 5; i++) {
        const w = (i / 5) * Math.PI * 2;
        const bx = x + Math.cos(w) * 5 * groesse;
        const by = y + Math.sin(w) * 5 * groesse;
        sammleForm(s, kreisPunkte(bx, by, r + 1.1, 8), k);
    }
    for (let i = 0; i < 5; i++) {
        const w = (i / 5) * Math.PI * 2;
        const bx = x + Math.cos(w) * 5 * groesse;
        const by = y + Math.sin(w) * 5 * groesse;
        sammleForm(s, kreisPunkte(bx, by, r, 8), f);
    }
    sammleForm(s, kreisPunkte(x, y, 2.6 * groesse, 8), rgb(...PALETTE.gold));
    zeichneSammler(s);
}

// ============================================
// LICHT & FIGUREN
// ============================================

// Weiches Gluehen als drei konzentrische, transparenter werdende
// Kreise — fuer Sterne, Laternen, Gegner-Augen.
function zeichneGluehen(pos, radius, farbe) {
    drawCircle({ pos, radius: radius * 2.2, color: rgb(...farbe), opacity: 0.15, resolution: 0.5 });
    drawCircle({ pos, radius: radius * 1.5, color: rgb(...farbe), opacity: 0.3, resolution: 0.5 });
    drawCircle({ pos, radius: radius, color: rgb(...farbe), opacity: 0.85, resolution: 0.6 });
}

// Streiflicht oben rechts + Schatten unten links auf einem
// Figuren-Koerper (STYLEGUIDE.md Abschnitt 7 und 11). Wird IMMER im
// onDraw() der Figur aufgerufen, nie als eigenes follow()-Objekt
// (Ursache von Bug #1, siehe BUGS.md und Abschnitt 5).
function zeichneKoerperLicht(breite, hoehe, lichtArr, schattenArr) {
    drawRect({
        pos: vec2(breite * 0.6, hoehe * 0.1),
        width: breite * 0.3,
        height: hoehe * 0.62,
        radius: 5,
        color: rgb(...lichtArr),
        opacity: 0.7,
    });
    drawRect({
        pos: vec2(breite * 0.06, hoehe * 0.42),
        width: breite * 0.24,
        height: hoehe * 0.5,
        radius: 5,
        color: rgb(...schattenArr),
        opacity: 0.45,
    });
}

// Weicher Kontaktschatten unter einer Figur — verankert sie im Boden.
function zeichneKontaktschatten(mx, my, breite) {
    drawEllipse({
        pos: vec2(mx, my),
        radiusX: breite * 0.58,
        radiusY: 4.5,
        color: rgb(...aktuelleStimmung.grasTief),
        opacity: 0.35,
        resolution: 0.5,
    });
}

// Fuenfzackiger Stern mit Eigenkontur. Der Faecher startet im
// Mittelpunkt, deshalb funktioniert er auch fuer die Zackenform.
function zeichneStern(x, y, radius, farbeArr = PALETTE.gold) {
    const zacken = (r) => {
        const pts = [{ x: x, y: y }];
        for (let i = 0; i <= 10; i++) {
            const a = ((i % 10) * 36 - 90) * (Math.PI / 180);
            const rr = i % 2 ? r * 0.44 : r;
            pts.push({ x: x + Math.cos(a) * rr, y: y + Math.sin(a) * rr });
        }
        return pts;
    };
    const s = neuerSammler();
    sammleForm(s, zacken(radius + 2), kontur(farbeArr, 0.4));
    sammleForm(s, zacken(radius), rgb(...farbeArr));
    zeichneSammler(s);
}

// Pergament-Panel fuer UI-Kästen (siehe STYLEGUIDE.md Abschnitt 8).
function zeichnePanel(pos, breite, hoehe) {
    drawRect({
        pos,
        width: breite,
        height: hoehe,
        radius: 12,
        color: rgb(...PALETTE.pergament),
        opacity: 0.85,
        outline: { width: 3, color: rgb(...PALETTE.pergamentRand) },
    });
}

// ============================================
// VORDERGRUND-DEKO (Ebene Z 10, Parallax 1,3)
// ============================================
// Grosse Halme mit Kontur am unteren Bildrand — rahmt das Bild und
// macht die Tiefenstaffelung nach vorne hin komplett.
// daten: { halme: [...], blumen: [...] } (vorberechnet)
function zeichneVordergrund(daten, faktor = PARALLAX.vordergrund) {
    const stimmung = aktuelleStimmung;
    const a = ebenenAnker(faktor);
    const f = sichtFenster(a);
    const s = neuerSammler();
    const dunkel = kontur(stimmung.grasTief, 0.18);
    const mittel = rgb(...stimmung.grasDunkel);
    const t = time();
    for (const h of daten.halme) {
        if (h.x < f.von) continue;
        if (h.x > f.bis) break;
        const wind = Math.sin(t * 1.2 + h.x * 0.02) * 4;
        sammleHalm(
            s,
            a.x + h.x,
            a.y + h.y,
            h.h,
            h.n + wind,
            h.hell ? 3 : 3.4,
            h.hell ? mittel : dunkel
        );
    }
    zeichneSammler(s);
    for (const b of daten.blumen) {
        if (b.x < f.von) continue;
        if (b.x > f.bis) break;
        zeichneBlume(a.x + b.x, a.y + b.y, stimmung.blueten[b.t], 1);
    }
}

// ============================================
// DER GEMALTE UEBERZUG (Post-Processing)
// ============================================
// Vier Effekte in einem Durchgang, Reihenfolge verbindlich
// (STYLEGUIDE.md Abschnitt 14): Bloom -> Warm-Kalt -> Papierkorn ->
// Vignette.
//
// - Bloom-Schwelle 0,72: nur echte Lichter (Gold-Sterne, Lava,
//   Gegner-Augen, Wolken-Kernweiss) bluten aus. Niedriger und die
//   ganze Wiese glueht.
// - Papierkorn ZWINGEND statisch (kein u_time im Hash) — zeitabhaengiges
//   Rauschen flimmert und strengt ein sechsjaehriges Auge an.
// - Vignette hoechstens 0,25 und erst ab Bilddistanz 0,55, damit
//   Spielobjekte an den Bildschirmraendern nicht verschluckt werden.
//
// Auflage: Wenn der Shader auf einem Rechner nicht kompiliert, muss das
// Spiel trotzdem laufen — loadShader in try/catch, usePostEffect nur
// bei Erfolg.

const UEBERZUG_FRAG = `
uniform float u_korn;
uniform float u_bloom;
uniform float u_vignette;
uniform vec2  u_aufloesung;

float hash(vec2 p){
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex){
  vec4 c = def_frag();
  vec2 px = 1.0 / u_aufloesung;

  // 1 - Bloom: nur echte Lichter bluten aus
  vec3 s = vec3(0.0);
  s += texture2D(tex, uv + vec2( 2.5, 0.0) * px).rgb;
  s += texture2D(tex, uv + vec2(-2.5, 0.0) * px).rgb;
  s += texture2D(tex, uv + vec2( 0.0, 2.5) * px).rgb;
  s += texture2D(tex, uv + vec2( 0.0,-2.5) * px).rgb;
  vec3 licht = max(s * 0.25 - 0.72, 0.0) / 0.28;
  c.rgb += licht * u_bloom;

  // 2 - Warm-Kalt: Lichter warm, Schatten kuehl
  float h = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  c.rgb += vec3( 0.05, 0.02, -0.03) * h;
  c.rgb += vec3(-0.02, 0.00,  0.04) * (1.0 - h);

  // 3 - Papierkorn, statisch, 2px-Raster
  float k = hash(floor(uv * u_aufloesung / 2.0)) - 0.5;
  c.rgb += k * u_korn;

  // 4 - weiche Vignette, spaet und flach
  float d = distance(uv, vec2(0.5));
  c.rgb *= 1.0 - smoothstep(0.55, 1.05, d) * u_vignette;

  return c;
}
`;

let ueberzugAktiv = false;

function ladeUeberzugShader() {
    try {
        loadShader("ueberzug", null, UEBERZUG_FRAG);
        usePostEffect("ueberzug", () => ({
            u_aufloesung: vec2(width(), height()),
            u_korn: 0.045,
            u_bloom: 0.35,
            u_vignette: 0.25,
        }));
        ueberzugAktiv = true;
    } catch (fehler) {
        // Kein Grund, das Spiel anzuhalten: ohne Ueberzug sieht es
        // etwas nuechterner aus, spielt sich aber identisch.
        ueberzugAktiv = false;
        console.warn("Ueberzug-Shader nicht geladen, Spiel laeuft ohne:", fehler);
    }
    return ueberzugAktiv;
}

// ============================================
// BEWEGUNGS-HELFER
// ============================================
// Siehe STYLEGUIDE.md Abschnitt 6 — nichts schnappt hart ein,
// alles federt sanft.

// Liefert einen sanft pulsierenden Skalierungsfaktor fuer ruhende
// Charaktere ("Atem-Idle").
function atem(basisSkalierung = 1) {
    return basisSkalierung * wave(0.98, 1.02, time() * 2);
}

// Liefert einen sanften Wiege-Offset (z.B. fuer Gras im Wind).
function wiegen(phase = 0, staerke = 3) {
    return Math.sin(time() * 2 + phase) * staerke;
}

// ============================================
// PARTIKEL-EFFEKTE
// ============================================
// Ersetzen bunte Rechteck-Partikel durch weiche Formen (siehe
// STYLEGUIDE.md Abschnitt 5 — keine nackten rect() fuer Organisches).

// Weiche, gluehende Funken — fuer Sprung-Staub, besiegte Gegner, Treffer.
function erzeugeFunken(x, y, farbe, anzahl) {
    for (let i = 0; i < anzahl; i++) {
        add([
            circle(rand(2, 5)),
            pos(x, y),
            color(
                farbe[0] + rand(-30, 30),
                farbe[1] + rand(-30, 30),
                farbe[2] + rand(-30, 30)
            ),
            opacity(1),
            move(rand(0, 360), rand(60, 200)),
            lifespan(0.5, { fade: 0.3 }),
            z(Z.partikel),
        ]);
    }
}

// Fallende, sich drehende Bluetenblaetter — fuer Sterne-Sammeln und Sieg.
function erzeugeBluetenblaetter(x, y, anzahl) {
    for (let i = 0; i < anzahl; i++) {
        const farbe = rand() < 0.6 ? PALETTE.blueteRosa : PALETTE.blueteWeiss;
        const p = add([
            pos(x + rand(-6, 6), y + rand(-6, 6)),
            opacity(1),
            lifespan(rand(0.8, 1.4), { fade: 0.4 }),
            z(Z.partikel),
        ]);
        p.geschwindigkeit = vec2(rand(-40, 40), rand(20, 70));
        p.drehung = rand(-180, 180);
        p.winkel = rand(0, 360);
        p.onUpdate(() => {
            p.pos.x += p.geschwindigkeit.x * dt();
            p.pos.y += p.geschwindigkeit.y * dt();
            p.winkel += p.drehung * dt();
        });
        p.onDraw(() => {
            pushTransform();
            pushRotate(p.winkel);
            drawEllipse({ pos: vec2(0, 0), radiusX: 5, radiusY: 2.5, color: rgb(...farbe) });
            popTransform();
        });
    }
}
