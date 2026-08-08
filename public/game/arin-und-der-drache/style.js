// ============================================
// STYLE.JS — Gemeinsames visuelles Vokabular
// ============================================
// Siehe STYLEGUIDE.md fuer die Begruendung jeder Regel hier.
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
// jeder Farbe.

const PALETTE = {
    // Himmel & Luft
    himmelTag1: [79, 195, 232],
    himmelTag2: [184, 232, 245],
    himmelAbend1: [46, 134, 171],
    himmelAbend2: [255, 217, 160],
    himmelNacht1: [13, 27, 62],
    himmelNacht2: [42, 47, 92],
    wolkeHell: [255, 255, 255],
    wolkeSchatten: [216, 232, 240],

    // Berge & Ferne
    bergFern: [143, 168, 196],
    bergNah: [93, 122, 158],
    bergSchnee: [240, 245, 250],
    huegelFern: [127, 174, 122],

    // Gras & Erde
    grasHell: [143, 209, 79],
    grasDunkel: [90, 158, 61],
    grasFranse: [168, 232, 106],
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
    zinnober: [232, 93, 61],
    gold: [245, 197, 66],
    laterne: [255, 77, 141],
    fensterWarm: [255, 203, 107],

    // Charaktere
    arinIndigo: [51, 69, 158],
    arinAkzent: [232, 93, 61],
    dracheOrange: [232, 107, 61],
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
        himmel1: PALETTE.himmelTag1,
        himmel2: PALETTE.himmelTag2,
        bergFern: PALETTE.bergFern,
        bergNah: PALETTE.bergNah,
        bergSpitze: PALETTE.bergSchnee,
        huegel: PALETTE.huegelFern,
        grasHell: PALETTE.grasHell,
        grasDunkel: PALETTE.grasDunkel,
        grasFranse: PALETTE.grasFranse,
        akzentWarm: PALETTE.blueteRosa,
    },
    ABEND: {
        name: "Abend",
        himmel1: PALETTE.himmelAbend1,
        himmel2: PALETTE.himmelAbend2,
        bergFern: PALETTE.bergNah,
        bergNah: PALETTE.erdeDunkel,
        bergSpitze: PALETTE.blueteRosa,
        huegel: PALETTE.grasDunkel,
        grasHell: PALETTE.grasDunkel,
        grasDunkel: PALETTE.erdeDunkel,
        grasFranse: PALETTE.blueteRosa,
        akzentWarm: PALETTE.zinnober,
    },
    NACHT: {
        name: "Nacht",
        himmel1: PALETTE.himmelNacht1,
        himmel2: PALETTE.himmelNacht2,
        bergFern: PALETTE.himmelNacht2,
        bergNah: PALETTE.erdeDunkel,
        bergSpitze: PALETTE.fensterWarm,
        huegel: PALETTE.erdeDunkel,
        grasHell: PALETTE.erdeDunkel,
        grasDunkel: PALETTE.himmelNacht1,
        grasFranse: PALETTE.laterne,
        akzentWarm: PALETTE.laterne,
    },
};

// ============================================
// EBENEN- UND PARALLAX-SYSTEM
// ============================================
// Siehe STYLEGUIDE.md Abschnitt 4.

const Z = {
    himmel: -100,
    bergFern: -90,
    bergNah: -80,
    huegel: -70,
    wolken: -60,
    level: 0,
    vordergrund: 10,
    partikel: 50,
    ui: 100,
};

const PARALLAX = {
    himmel: 0.0,
    bergFern: 0.08,
    bergNah: 0.18,
    huegel: 0.35,
    wolken: 0.5,
    level: 1.0,
    vordergrund: 1.3,
};

// ============================================
// PARALLAX-HILFSFUNKTION
// ============================================
// Rechnet eine "Basis"-Weltposition in die tatsaechliche Zeichen-
// position um, abhaengig davon wie stark sich die Ebene relativ
// zur Kamera bewegt (faktor 0 = bewegt sich nie / bleibt am
// Bildschirm kleben, faktor 1 = bewegt sich exakt wie die Spielwelt).
//
// Formel: renderPos = basisPos * faktor + kameraPos * (1 - faktor)

function parallaxPos(basisPos, faktor) {
    const kamera = camPos();
    return vec2(
        basisPos.x * faktor + kamera.x * (1 - faktor),
        basisPos.y * faktor + kamera.y * (1 - faktor)
    );
}

// Fuegt ein reines Hintergrund-Objekt hinzu: keine Position/Kollision, nur
// eine Zeichenfunktion auf der angegebenen Ebene. Wird von JEDER Szene
// benutzt (Spiel UND die statischen Bildschirme Auswahl/Gewonnen/Verloren),
// damit alle die gleiche Himmel/Berge/Wolken-Kulisse teilen. Fuer statische
// Szenen ohne Kamera-Bewegung: camPos() zu Szenenbeginn auf einen
// bekannten Wert setzen (z.B. width()/2, height()/2), sonst kann die
// Kulisse an der Kamera-Position aus der vorherigen Szene haengen.
function hintergrundEbene(zeichnung, zEbene) {
    const obj = add([z(zEbene)]);
    obj.onDraw(zeichnung);
    return obj;
}

// ============================================
// ZEICHEN-HELFER
// ============================================
// Erzwingen die Formensprache aus STYLEGUIDE.md Abschnitt 5.
// Alle Funktionen hier nutzen Kaboom-Zeichenfunktionen (drawX) und
// duerfen deshalb erst NACH kaboom() aufgerufen werden — z.B. aus
// einem onDraw()-Callback oder innerhalb einer scene()-Definition.

// Vollflaechiger Himmel-Farbverlauf, klebt fest an der Kamera
// (Parallax-Faktor 0), deckt das Bild immer komplett ab.
function himmelVerlauf(stimmung) {
    const kamera = camPos();
    drawRect({
        pos: vec2(kamera.x, kamera.y),
        width: width() + 8,
        height: height() + 8,
        anchor: "center",
        gradient: [rgb(...stimmung.himmel1), rgb(...stimmung.himmel2)],
        horizontal: false,
    });
}

// Weiche Wolke aus mehreren ueberlappenden Kreisen (nie eine
// einzelne Ellipse — siehe Formensprache-Regel).
function zeichneWolke(basisPos, groesse = 1, faktor = PARALLAX.wolken) {
    const p = parallaxPos(basisPos, faktor);
    const kreise = [
        { dx: -0.5, dy: 0.15, r: 0.6 },
        { dx: 0, dy: -0.1, r: 0.8 },
        { dx: 0.5, dy: 0.15, r: 0.65 },
        { dx: -0.18, dy: 0.28, r: 0.5 },
        { dx: 0.22, dy: 0.3, r: 0.55 },
    ];
    for (const k of kreise) {
        drawCircle({
            pos: vec2(p.x + k.dx * groesse * 60, p.y + k.dy * groesse * 60),
            radius: k.r * groesse * 40,
            gradient: [rgb(...PALETTE.wolkeHell), rgb(...PALETTE.wolkeSchatten)],
        });
    }
}

// Bergkette als Polygon mit Vertex-Farbverlauf (dunkel unten,
// hell/schneeweiss an der Spitze).
function zeichneBerg(basisPos, breite, hoehe, farbBasis, farbSpitze, faktor) {
    const p = parallaxPos(basisPos, faktor);
    const punkte = [
        vec2(p.x - breite / 2, p.y),
        vec2(p.x - breite * 0.25, p.y - hoehe * 0.7),
        vec2(p.x - breite * 0.05, p.y - hoehe),
        vec2(p.x + breite * 0.15, p.y - hoehe * 0.75),
        vec2(p.x + breite / 2, p.y),
    ];
    const farben = [
        rgb(...farbBasis),
        rgb(...farbBasis),
        rgb(...farbSpitze),
        rgb(...farbBasis),
        rgb(...farbBasis),
    ];
    drawPolygon({ pts: punkte, colors: farben });
}

// Sanfte, gerundete Huegelsilhouette (Halbellipse).
function zeichneHuegel(basisPos, breite, hoehe, farbe, faktor) {
    const p = parallaxPos(basisPos, faktor);
    drawEllipse({
        pos: p,
        radiusX: breite / 2,
        radiusY: hoehe,
        start: 180,
        end: 360,
        color: rgb(...farbe),
    });
}

// Unregelmaessige Grasfranse fuer die Oberkante von Boden-Bloecken —
// nie eine gerade Linie (Formensprache-Regel).
function zeichneGrasFranse(x, y, breite) {
    const anzahl = Math.ceil(breite / 6);
    for (let i = 0; i < anzahl; i++) {
        const bx = x + i * 6;
        const h = 4 + (i % 3) * 2;
        drawPolygon({
            pts: [vec2(bx, y), vec2(bx + 3, y - h), vec2(bx + 6, y)],
            color: rgb(...PALETTE.grasFranse),
        });
    }
}

// Kleines Grasbueschel als Vordergrund-Deko.
function zeichneGrasbueschel(x, y) {
    for (let i = -1; i <= 1; i++) {
        drawLine({
            p1: vec2(x + i * 3, y),
            p2: vec2(x + i * 4, y - 10 - Math.abs(i) * 3),
            width: 2,
            color: rgb(...PALETTE.grasDunkel),
        });
    }
}

// Einfache 5-Blueten-Blume als Vordergrund-Deko.
function zeichneBlume(x, y, farbe = PALETTE.blueteRosa) {
    for (let i = 0; i < 5; i++) {
        const winkel = (i / 5) * 360;
        const bx = x + Math.cos((winkel * Math.PI) / 180) * 4;
        const by = y + Math.sin((winkel * Math.PI) / 180) * 4;
        drawCircle({ pos: vec2(bx, by), radius: 3, color: rgb(...farbe) });
    }
    drawCircle({ pos: vec2(x, y), radius: 2.5, color: rgb(...PALETTE.gold) });
}

// Weiches Gluehen als drei konzentrische, transparenter werdende
// Kreise — fuer Sterne, Laternen, Gegner-Augen.
function zeichneGluehen(pos, radius, farbe) {
    drawCircle({ pos, radius: radius * 2.2, color: rgb(...farbe), opacity: 0.15 });
    drawCircle({ pos, radius: radius * 1.5, color: rgb(...farbe), opacity: 0.3 });
    drawCircle({ pos, radius: radius, color: rgb(...farbe), opacity: 0.85 });
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

// Mischt eine Vordergrundfarbe Richtung Himmelfarbe, je nach
// Tiefe (0 = vorne/keine Mischung, 1 = ganz hinten/volle Mischung).
// Umsetzung der Luftperspektive-Formel aus STYLEGUIDE.md Abschnitt 7.
function luftperspektive(farbeArr, himmelArr, tiefe) {
    const t = Math.min(Math.max(tiefe, 0), 1) * 0.6;
    return rgb(...farbeArr).lerp(rgb(...himmelArr), t);
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
