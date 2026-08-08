// ============================================
// ARIN UND DER DRACHE
// Ein 2D-Platformer fuer Kinder
// ============================================

// --- Kaboom.js initialisieren ---
kaboom({
    width: 1024,
    height: 576,
    background: PALETTE.himmelTag1, // Taghimmel-Blau statt dunklem Navy
    scale: 1,
    crisp: true,
});

// ============================================
// KONSTANTEN - Spieleinstellungen
// ============================================

// Bewegungs-Geschwindigkeiten
const ARIN_SPEED = 280;             // Arin ist schnell (Ninja!)
const DRACHE_SPEED = 230;           // Drache ist etwas langsamer
const ARIN_JUMP = 520;              // Arin springt normal hoch
const DRACHE_JUMP = 620;            // Drache springt hoeher (Fluegel!)
const GEGNER_SPEED = 80;            // Gegner bewegen sich langsam
const SCHWERKRAFT = 1600;           // Wie stark die Schwerkraft zieht

// Blockgroesse fuer das Level (jeder Block ist 48x48 Pixel)
const BLOCK = 48;

// Farben fuer Charaktere und Objekte kommen aus PALETTE
// (definiert in style.js, siehe STYLEGUIDE.md fuer Herkunft jeder Farbe).

// --- Globale Variable: welcher Charakter gewaehlt wurde ---
let gewaehlterCharakter = "arin";

// ============================================
// LEVEL-KARTE
// ============================================
// Jedes Zeichen steht fuer einen Block:
//   = : Boden/Mauer (solide)
//   - : Plattform (man kann drauf stehen)
//   ^ : Stacheln/Lava (Gefahr!)
//   G : Gegner (Boesewicht)
//   S : Start (Spieler-Startposition)
//   Z : Ziel (Ende des Levels)
//   * : Stern (Bonus zum Einsammeln)
//   . : Leer (Luft)

const LEVEL_KARTE = [
    "=......................................................................................................=",
    "=......................................................................................................=",
    "=......................................................................................................=",
    "=......................................................................................................=",
    "=......................................................................................................=",
    "=......................................................................................................=",
    "=......................................................................................................=",
    "=...................................................................................................*..=",
    "=.....................................................................................................Z=",
    "=.................................................................................................======",
    "=..................................................................................*............========",
    "=...............................................................*.................---.........==========",
    "=.....................................*........................---.........G.........G......============",
    "=..................*.................---............G...................========..======^=..============",
    "=.................---.......G............G......=======^==..==========..========..========..============",
    "=S..............G.......==========..==========..==========..==========..========..========..============",
    "==========..==========..==========..==========..==========..==========..========..========..============",
    "==========..==========..==========..==========..==========..==========..========..========..============",
    "==========..==========..==========..==========..==========..==========..========..========..============",
    "==========..==========..==========..==========..==========..==========..========..========..============",
    "==========..==========..==========..==========..==========..==========..========..========..============",
];

// ============================================
// SZENE: STARTBILDSCHIRM / CHARAKTER-AUSWAHL
// ============================================

scene("auswahl", () => {
    // Kamera zuruecksetzen - kann nach einer Partie noch irgendwo im Level
    // stehen (siehe STYLEGUIDE.md - durchgaengige Konsistenz der Screens).
    camPos(width() / 2, height() / 2);
    camScale(1, 1);

    const stimmung = STIMMUNG.TAG;

    // --- Ruhige Himmel-Kulisse (gleiche Helfer wie im Spiel, siehe style.js) ---
    hintergrundEbene(() => himmelVerlauf(stimmung), Z.himmel);
    const bergListe = [
        { x: width() * 0.12, breite: 420, hoehe: 200 },
        { x: width() * 0.5, breite: 520, hoehe: 250 },
        { x: width() * 0.88, breite: 400, hoehe: 190 },
    ];
    for (const berg of bergListe) {
        hintergrundEbene(() => zeichneBerg(
            vec2(berg.x, height() * 0.78), berg.breite, berg.hoehe,
            stimmung.bergFern, stimmung.bergSpitze, 1
        ), Z.bergFern);
    }
    hintergrundEbene(() => zeichneHuegel(
        vec2(width() / 2, height() * 0.9), width() * 1.3, 100, stimmung.huegel, 1
    ), Z.huegel);
    const wolkenListe = [
        { x: width() * 0.18, y: 70, groesse: 1.0 },
        { x: width() * 0.8, y: 100, groesse: 1.2 },
    ];
    for (const w of wolkenListe) {
        const wolke = hintergrundEbene(
            () => zeichneWolke(vec2(wolke.basisX, w.y), w.groesse, 1), Z.wolken
        );
        wolke.basisX = w.x;
        wolke.onUpdate(() => {
            wolke.basisX -= 4 * dt();
            if (wolke.basisX < -150) wolke.basisX = width() + 150;
        });
    }

    // --- Titel ---
    add([
        text("ARIN UND DER DRACHE", { size: 42 }),
        pos(width() / 2, 42),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui),
    ]);

    // --- Untertitel ---
    add([
        text("Ein Ninja-Abenteuer!", { size: 20 }),
        pos(width() / 2, 78),
        anchor("center"),
        color(...PALETTE.zinnober),
        fixed(),
        z(Z.ui),
    ]);

    // --- Statische Mini-Vorschau der Charaktere (gleicher Stil wie im
    // Spiel, siehe Session 4) ---
    function zeichneVorschauArin(mx, my) {
        drawRect({ pos: vec2(mx - 20, my - 25), width: 40, height: 50, radius: 8, color: rgb(...PALETTE.arinIndigo) });
        drawRect({ pos: vec2(mx - 24, my - 19), width: 48, height: 6, radius: 2, color: rgb(...PALETTE.arinAkzent) });
        for (const ex of [mx - 10, mx + 6]) {
            drawCircle({ pos: vec2(ex, my - 8), radius: 3.5, color: rgb(...PALETTE.blueteWeiss) });
            drawCircle({ pos: vec2(ex + 1, my - 8), radius: 1.6, color: rgb(...PALETTE.tintenbraun) });
        }
    }
    function zeichneVorschauDrache(mx, my) {
        drawRect({ pos: vec2(mx - 25, my - 27), width: 50, height: 55, radius: 10, color: rgb(...PALETTE.dracheOrange) });
        drawEllipse({ pos: vec2(mx, my + 12), radiusX: 17, radiusY: 11, color: rgb(...PALETTE.dracheBauch) });
        drawPolygon({ pts: [vec2(mx - 15, my - 27), vec2(mx - 9, my - 27), vec2(mx - 12, my - 42)], color: rgb(...PALETTE.dracheHorn) });
        drawPolygon({ pts: [vec2(mx + 9, my - 27), vec2(mx + 15, my - 27), vec2(mx + 12, my - 42)], color: rgb(...PALETTE.dracheHorn) });
        for (const ex of [mx - 9, mx + 9]) {
            zeichneGluehen(vec2(ex, my - 10), 4, PALETTE.gold);
        }
    }

    // --- Arin-Box (links) ---
    const arinMitteX = width() / 2 - 160;
    add([
        rect(200, 220, { radius: 14 }),
        pos(arinMitteX, 200),
        anchor("center"),
        color(...PALETTE.pergament),
        opacity(0.92),
        outline(3, rgb(...PALETTE.arinIndigo)),
        fixed(),
        z(Z.ui),
    ]);
    const arinVorschau = add([pos(arinMitteX, 195), fixed(), z(Z.ui)]);
    arinVorschau.onDraw(() => zeichneVorschauArin(0, 0));

    add([
        text("ARIN", { size: 22 }),
        pos(arinMitteX, 246),
        anchor("center"),
        color(...PALETTE.arinIndigo),
        fixed(),
        z(Z.ui),
    ]);
    add([
        text("(Ninja)", { size: 14 }),
        pos(arinMitteX, 264),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui),
    ]);
    add([
        text("Schnell!", { size: 14 }),
        pos(arinMitteX, 280),
        anchor("center"),
        color(...PALETTE.grasDunkel),
        fixed(),
        z(Z.ui),
    ]);
    add([
        text("Druecke [1]", { size: 16 }),
        pos(arinMitteX, 300),
        anchor("center"),
        color(...PALETTE.zinnober),
        fixed(),
        z(Z.ui),
    ]);

    // --- Drache-Box (rechts) ---
    const dracheMitteX = width() / 2 + 160;
    add([
        rect(200, 220, { radius: 14 }),
        pos(dracheMitteX, 200),
        anchor("center"),
        color(...PALETTE.pergament),
        opacity(0.92),
        outline(3, rgb(...PALETTE.dracheOrange)),
        fixed(),
        z(Z.ui),
    ]);
    const dracheVorschau = add([pos(dracheMitteX, 195), fixed(), z(Z.ui)]);
    dracheVorschau.onDraw(() => zeichneVorschauDrache(0, 0));

    add([
        text("DRACHE", { size: 22 }),
        pos(dracheMitteX, 246),
        anchor("center"),
        color(...PALETTE.dracheOrange),
        fixed(),
        z(Z.ui),
    ]);
    add([
        text("(Feuerdrache)", { size: 14 }),
        pos(dracheMitteX, 264),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui),
    ]);
    add([
        text("Springt hoch!", { size: 14 }),
        pos(dracheMitteX, 280),
        anchor("center"),
        color(...PALETTE.grasDunkel),
        fixed(),
        z(Z.ui),
    ]);
    add([
        text("Druecke [2]", { size: 16 }),
        pos(dracheMitteX, 300),
        anchor("center"),
        color(...PALETTE.zinnober),
        fixed(),
        z(Z.ui),
    ]);

    // --- Steuerungshinweis (dezente Pergament-Leiste) ---
    add([
        rect(540, 100, { radius: 12 }),
        pos(width() / 2, 452),
        anchor("center"),
        color(...PALETTE.pergament),
        opacity(0.8),
        fixed(),
        z(Z.ui),
    ]);
    add([
        text("Pfeiltasten: Bewegen + Springen", { size: 16 }),
        pos(width() / 2, 420),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui + 1),
    ]);
    add([
        text("Springe auf Gegner um sie zu besiegen!", { size: 16 }),
        pos(width() / 2, 450),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui + 1),
    ]);
    add([
        text("Erreiche das goldene Ziel!", { size: 16 }),
        pos(width() / 2, 480),
        anchor("center"),
        color(...PALETTE.zinnober),
        fixed(),
        z(Z.ui + 1),
    ]);

    // --- Tastendruck: Charakter waehlen ---
    onKeyPress("1", () => {
        gewaehlterCharakter = "arin";
        go("spiel");
    });

    onKeyPress("2", () => {
        gewaehlterCharakter = "drache";
        go("spiel");
    });
});

// ============================================
// SZENE: HAUPTSPIEL
// ============================================

scene("spiel", () => {

    // --- Schwerkraft einstellen ---
    setGravity(SCHWERKRAFT);

    // ============================================
    // HIMMEL & ATMOSPHAERE (Parallax-Hintergrund)
    // ============================================
    // Siehe STYLEGUIDE.md Abschnitt 4 (Ebenen/Parallax) und 7 (Licht &
    // Atmosphaere). Zeichen-Helfer kommen aus style.js.

    const stimmung = STIMMUNG.TAG;
    const HORIZONT_Y = 620;

    // hintergrundEbene() kommt jetzt aus style.js (wird auch von den
    // Auswahl-/Gewonnen-/Verloren-Bildschirmen benutzt).

    // Himmel-Verlauf: deckt das Bild jeden Frame komplett ab (Faktor 0 -
    // bewegt sich nie relativ zur Kamera).
    hintergrundEbene(() => himmelVerlauf(stimmung), Z.himmel);

    // Ferne Bergkette (heller, entsaettigt - liegt "weit hinten")
    const ferneBerge = [
        { x: -250, breite: 500, hoehe: 260 },
        { x: 350, breite: 600, hoehe: 320 },
        { x: 1000, breite: 500, hoehe: 240 },
        { x: 1700, breite: 550, hoehe: 300 },
    ];
    for (const berg of ferneBerge) {
        hintergrundEbene(() => zeichneBerg(
            vec2(berg.x, HORIZONT_Y),
            berg.breite, berg.hoehe,
            stimmung.bergFern, stimmung.bergSpitze,
            PARALLAX.bergFern
        ), Z.bergFern);
    }

    // Nahe Bergkette (dunkler, kleiner, bewegt sich etwas schneller)
    const naheBerge = [
        { x: -100, breite: 420, hoehe: 160 },
        { x: 500, breite: 480, hoehe: 190 },
        { x: 1200, breite: 400, hoehe: 150 },
        { x: 1900, breite: 460, hoehe: 175 },
    ];
    for (const berg of naheBerge) {
        hintergrundEbene(() => zeichneBerg(
            vec2(berg.x, HORIZONT_Y + 40),
            berg.breite, berg.hoehe,
            stimmung.bergNah, stimmung.bergFern,
            PARALLAX.bergNah
        ), Z.bergNah);
    }

    // Sanfte Huegel, nah am Boden
    const huegelListe = [
        { x: 100, breite: 500, hoehe: 90 },
        { x: 700, breite: 600, hoehe: 110 },
        { x: 1400, breite: 450, hoehe: 80 },
        { x: 2000, breite: 520, hoehe: 100 },
    ];
    for (const huegel of huegelListe) {
        hintergrundEbene(() => zeichneHuegel(
            vec2(huegel.x, HORIZONT_Y + 90),
            huegel.breite, huegel.hoehe,
            stimmung.huegel,
            PARALLAX.huegel
        ), Z.huegel);
    }

    // Wolken, ziehen langsam und stetig nach links (siehe STYLEGUIDE.md
    // Abschnitt 6 - Wolkenzug).
    const wolkenListe = [
        { x: -200, y: 120, groesse: 1.2 },
        { x: 300, y: 80, groesse: 0.9 },
        { x: 900, y: 150, groesse: 1.4 },
        { x: 1500, y: 100, groesse: 1.0 },
        { x: 2100, y: 130, groesse: 1.1 },
    ];
    for (const w of wolkenListe) {
        const wolke = hintergrundEbene(
            () => zeichneWolke(vec2(wolke.basisX, w.y), w.groesse, PARALLAX.wolken),
            Z.wolken
        );
        wolke.basisX = w.x;
        wolke.onUpdate(() => {
            wolke.basisX -= 4 * dt();
        });
    }

    // --- Charakter-Eigenschaften basierend auf Auswahl ---
    const spielerSpeed = gewaehlterCharakter === "arin" ? ARIN_SPEED : DRACHE_SPEED;
    const spielerJump = gewaehlterCharakter === "arin" ? ARIN_JUMP : DRACHE_JUMP;
    const spielerFarbe = gewaehlterCharakter === "arin" ? PALETTE.arinIndigo : PALETTE.dracheOrange;
    const spielerBreite = gewaehlterCharakter === "arin" ? 30 : 38;
    const spielerHoehe = gewaehlterCharakter === "arin" ? 38 : 42;
    const spielerName = gewaehlterCharakter === "arin" ? "Arin" : "Drache";

    // --- Zaehler fuer Gegner ---
    let gegnerBesiegt = 0;
    let gegnerGesamt = 0;
    let sterneSammlung = 0;
    let sterneGesamt = 0;

    // --- Level aus der Karte erstellen ---
    // Wir gehen durch jedes Zeichen der Karte und erstellen Spielobjekte

    for (let zeile = 0; zeile < LEVEL_KARTE.length; zeile++) {
        for (let spalte = 0; spalte < LEVEL_KARTE[zeile].length; spalte++) {
            const zeichen = LEVEL_KARTE[zeile][spalte];
            const x = spalte * BLOCK;
            const y = zeile * BLOCK;

            switch (zeichen) {
                // Solide Mauer / Boden
                case "=":
                    // Nur der oberste sichtbare Block einer Saeule bekommt
                    // Gras - darunter liegende Bloecke sind Erde (siehe
                    // STYLEGUIDE.md Abschnitt 5).
                    const zeichenOben = zeile > 0 ? LEVEL_KARTE[zeile - 1][spalte] : ".";
                    const istOberflaeche = zeichenOben !== "=";
                    add([
                        rect(BLOCK, BLOCK),
                        pos(x, y),
                        color(...(istOberflaeche ? PALETTE.grasDunkel : PALETTE.erdeDunkel)),
                        area(),
                        body({ isStatic: true }),
                        "boden",
                    ]);
                    if (istOberflaeche) {
                        // Helle Grasflaeche oben
                        add([
                            rect(BLOCK, 10),
                            pos(x, y),
                            color(...PALETTE.grasHell),
                        ]);
                        // Unregelmaessige Grasfranse an der Oberkante
                        const franse = add([pos(x, y)]);
                        franse.onDraw(() => zeichneGrasFranse(0, 0, BLOCK));
                        // Gelegentliches Grasbueschel oder Bluete als Deko
                        if (rand() < 0.25) {
                            const deko = add([pos(x + rand(8, BLOCK - 8), y)]);
                            if (rand() < 0.5) {
                                deko.onDraw(() => zeichneGrasbueschel(0, 0));
                            } else {
                                deko.onDraw(() => zeichneBlume(0, 0));
                            }
                        }
                    }
                    break;

                // Plattform (durchlaessig von unten)
                case "-":
                    add([
                        rect(BLOCK, 12),
                        pos(x, y + BLOCK - 12),
                        color(...PALETTE.holz),
                        area(),
                        body({ isStatic: true }),
                        "plattform",
                    ]);
                    // Dunklere Unterkante fuer etwas Tiefe
                    add([
                        rect(BLOCK, 3),
                        pos(x, y + BLOCK - 3),
                        color(...PALETTE.holzDunkel),
                    ]);
                    break;

                // Stacheln / Lava (toedlich)
                case "^":
                    add([
                        rect(BLOCK, BLOCK),
                        pos(x, y),
                        color(...PALETTE.lavaDunkel),
                        area(),
                        body({ isStatic: true }),
                        "gefahr",
                    ]);
                    // Weiches, pulsierendes Gluehen statt harter Stachel-
                    // Spitzen (siehe STYLEGUIDE.md - "weichere Gefahren-Zone")
                    const gluehObj = add([pos(x + BLOCK / 2, y + BLOCK / 2)]);
                    gluehObj.onDraw(() => {
                        const puls = 8 + Math.sin(time() * 3) * 2;
                        zeichneGluehen(vec2(0, 0), puls, PALETTE.lavaHell);
                    });
                    break;

                // Gegner
                case "G":
                    gegnerGesamt++;
                    const gegner = add([
                        rect(32, 32, { radius: 6 }),
                        pos(x + 8, y + 16),
                        color(...PALETTE.gegnerSchiefer),
                        area(),
                        body(),
                        "gegner",
                        {
                            // Gegner-Richtung: 1 = rechts, -1 = links
                            richtung: 1,
                            // Startposition merken fuer Patrouille
                            startX: x,
                            // Wie weit der Gegner laufen soll
                            reichweite: 100,
                        },
                    ]);
                    // Weich gluehende Glut-Augen statt harter roter Quadrate
                    // (im eigenen onDraw() - siehe STYLEGUIDE.md Abschnitt 5:
                    // niemals follow() fuer Charakter-Details verwenden)
                    gegner.onDraw(() => {
                        const versatz = gegner.richtung * 3;
                        zeichneGluehen(vec2(10 + versatz, 14), 3.5, PALETTE.gegnerGlut);
                        zeichneGluehen(vec2(20 + versatz, 14), 3.5, PALETTE.gegnerGlut);
                    });
                    break;

                // Spieler-Startposition
                case "S":
                    // Wird spaeter verwendet
                    break;

                // Ziel (goldene Flagge)
                case "Z":
                    // Ziel-Plattform
                    add([
                        rect(BLOCK * 2, BLOCK),
                        pos(x - BLOCK / 2, y),
                        color(...PALETTE.gold),
                        area(),
                        body({ isStatic: true }),
                        opacity(0.6),
                        "ziel",
                    ]);
                    // Flagge
                    add([
                        rect(6, BLOCK * 2),
                        pos(x + 10, y - BLOCK * 2),
                        color(...PALETTE.holz),
                    ]);
                    add([
                        rect(30, 20),
                        pos(x + 16, y - BLOCK * 2),
                        color(...PALETTE.zinnober),
                    ]);
                    // "ZIEL" Text
                    add([
                        text("ZIEL", { size: 16 }),
                        pos(x + 8, y - BLOCK * 2 - 20),
                        color(...PALETTE.gold),
                    ]);
                    break;

                // Stern (Bonus)
                case "*":
                    sterneGesamt++;
                    const stern = add([
                        rect(20, 20, { radius: 4 }),
                        pos(x + 14, y + 14),
                        color(...PALETTE.gold),
                        area(),
                        anchor("center"),
                        "stern",
                    ]);
                    // Weiches Gluehen um den Stern (siehe STYLEGUIDE.md)
                    stern.onDraw(() => {
                        zeichneGluehen(vec2(0, 0), 14, PALETTE.gold);
                    });
                    // Stern dreht und pulsiert
                    stern.onUpdate(() => {
                        stern.angle = time() * 120;
                        stern.scale = vec2(1 + Math.sin(time() * 4) * 0.2);
                    });
                    break;
            }
        }
    }

    // --- Spieler-Startposition finden ---
    let startX = 2 * BLOCK;
    let startY = 9 * BLOCK;
    for (let z = 0; z < LEVEL_KARTE.length; z++) {
        const idx = LEVEL_KARTE[z].indexOf("S");
        if (idx !== -1) {
            startX = idx * BLOCK;
            startY = z * BLOCK;
            break;
        }
    }

    // --- Spieler erstellen ---
    // WICHTIG: Die Kollisionsbox bleibt IMMER exakt spielerBreite x
    // spielerHoehe, unskaliert. Kaboom berechnet die tatsaechliche
    // Kollisionsflaeche (worldArea()) aus dem VOLLEN Objekt-Transform
    // inklusive .scale - wuerde man .scale fuer Squash/Stretch animieren,
    // wuerde sich die Trefferflaeche jeden Frame mitveraendern und "von
    // oben getroffen" wuerde zufaellig mal klappen, mal nicht. Deshalb:
    // rect() hier nur fuer die (unsichtbare) Kollisionsform, fill:false.
    // Das sichtbare, squash-and-stretchende Aussehen wird komplett separat
    // in onDraw() gezeichnet, mit einer rein lokalen pushScale()/
    // popScale(), die die Kollision nicht beeinflusst.
    const spieler = add([
        rect(spielerBreite, spielerHoehe, { radius: 8, fill: false }),
        pos(startX, startY),
        area(),
        body(),
        "spieler",
    ]);

    spieler.blickrichtung = 1;
    let animScaleX = 1;
    let animScaleY = 1;

    if (gewaehlterCharakter === "arin") {
        spieler.onDraw(() => {
            pushTransform();
            pushScale(animScaleX, animScaleY);
            // Koerper
            drawRect({
                pos: vec2(0, 0),
                width: spielerBreite,
                height: spielerHoehe,
                radius: 8,
                color: rgb(...spielerFarbe),
            });
            // Stirnband
            drawRect({
                pos: vec2(-4, 6),
                width: spielerBreite + 8,
                height: 6,
                radius: 2,
                color: rgb(...PALETTE.arinAkzent),
            });
            // Augen - Pupillen ruecken leicht in Blickrichtung
            const v = spieler.blickrichtung;
            for (const ex of [spielerBreite * 0.25, spielerBreite * 0.7]) {
                drawCircle({ pos: vec2(ex, spielerHoehe * 0.35), radius: 3.5, color: rgb(...PALETTE.blueteWeiss) });
                drawCircle({ pos: vec2(ex + v, spielerHoehe * 0.35), radius: 1.6, color: rgb(...PALETTE.tintenbraun) });
            }
            popTransform();
        });
    } else {
        spieler.onDraw(() => {
            pushTransform();
            pushScale(animScaleX, animScaleY);
            // Koerper
            drawRect({
                pos: vec2(0, 0),
                width: spielerBreite,
                height: spielerHoehe,
                radius: 8,
                color: rgb(...spielerFarbe),
            });
            // Helle Bauch-Unterseite
            drawEllipse({
                pos: vec2(spielerBreite / 2, spielerHoehe * 0.75),
                radiusX: spielerBreite * 0.35,
                radiusY: spielerHoehe * 0.22,
                color: rgb(...PALETTE.dracheBauch),
            });
            // Hoerner
            drawPolygon({
                pts: [vec2(4, 0), vec2(10, 0), vec2(7, -12)],
                color: rgb(...PALETTE.dracheHorn),
            });
            drawPolygon({
                pts: [vec2(spielerBreite - 10, 0), vec2(spielerBreite - 4, 0), vec2(spielerBreite - 7, -12)],
                color: rgb(...PALETTE.dracheHorn),
            });
            // Goldig gluehende Feuerdrachen-Augen
            for (const ex of [spielerBreite * 0.28, spielerBreite * 0.68]) {
                zeichneGluehen(vec2(ex, spielerHoehe * 0.32), 4, PALETTE.gold);
            }
            popTransform();
        });
    }

    // Squash & Stretch, Atem-Idle und Blickrichtung (siehe STYLEGUIDE.md
    // Abschnitt 6 - nichts schnappt hart ein, alles federt). Beeinflusst
    // nur animScaleX/Y (rein visuell, siehe oben), nie spieler.scale.
    let warGeerdet = true;
    let squashZeit = 0;
    const SQUASH_DAUER = 0.15;
    spieler.onUpdate(() => {
        if (spieler.vel.x > 5) spieler.blickrichtung = 1;
        else if (spieler.vel.x < -5) spieler.blickrichtung = -1;

        const geradeGelandet = !warGeerdet && spieler.isGrounded();
        if (geradeGelandet) squashZeit = SQUASH_DAUER;
        warGeerdet = spieler.isGrounded();

        if (squashZeit > 0) {
            squashZeit = Math.max(0, squashZeit - dt());
            const t = squashZeit / SQUASH_DAUER;
            animScaleX = 1 + 0.22 * t;
            animScaleY = 1 - 0.18 * t;
        } else if (!spieler.isGrounded()) {
            const strecke = Math.min(Math.max(-spieler.vel.y / 900, -0.16), 0.16);
            animScaleY = 1 + strecke;
            animScaleX = 1 - strecke * 0.5;
        } else {
            animScaleY = atem(1);
            animScaleX = 1 + (1 - animScaleY) * 0.4;
        }
    });

    // --- Kamera folgt dem Spieler (geglaettet) ---
    // Ruhende Koerper "zittern" in Kaboom leicht (Schwerkraft und Boden-
    // Kollisionsausgleich heben sich nicht exakt auf, ca. 1-2px pro Frame,
    // auch im Original-Level schon vorhanden). Bei fein gezeichneten
    // Details (Grasfranse, Bergkanten) faellt das sofort als Zittern der
    // ganzen Welt auf, weil ALLES relativ zur Kamera gezeichnet wird. Fix:
    // die Kamera nicht 1:1 an die (leicht zittrige) Spielerposition
    // haengen, sondern sanft hinterherfedern lassen.
    let kameraPos = vec2(spieler.pos.x, spieler.pos.y - 50);
    spieler.onUpdate(() => {
        const ziel = vec2(spieler.pos.x, spieler.pos.y - 50);
        kameraPos = kameraPos.lerp(ziel, Math.min(1, dt() * 18));
        camPos(kameraPos);
    });

    // ============================================
    // STEUERUNG
    // ============================================

    // Links/Rechts bewegen
    onKeyDown("left", () => {
        spieler.move(-spielerSpeed, 0);
    });

    onKeyDown("right", () => {
        spieler.move(spielerSpeed, 0);
    });

    // Springen (nur wenn auf dem Boden)
    onKeyPress("up", () => {
        if (spieler.isGrounded()) {
            spieler.jump(spielerJump);
            // Kleine Sprung-Funken
            erzeugeFunken(spieler.pos.x, spieler.pos.y + spielerHoehe, spielerFarbe, 5);
        }
    });

    // Auch mit Leertaste springen
    onKeyPress("space", () => {
        if (spieler.isGrounded()) {
            spieler.jump(spielerJump);
            erzeugeFunken(spieler.pos.x, spieler.pos.y + spielerHoehe, spielerFarbe, 5);
        }
    });

    // ============================================
    // GEGNER-BEWEGUNG (Patrouillieren)
    // ============================================

    onUpdate("gegner", (g) => {
        // Gegner bewegt sich hin und her
        g.move(g.richtung * GEGNER_SPEED, 0);

        // Richtung wechseln wenn Reichweite erreicht
        if (g.pos.x > g.startX + g.reichweite) {
            g.richtung = -1;
        }
        if (g.pos.x < g.startX - g.reichweite) {
            g.richtung = 1;
        }
    });

    // ============================================
    // KOLLISIONEN
    // ============================================

    // Spieler trifft Gegner
    spieler.onCollide("gegner", (gegner) => {
        // Pruefen ob der Spieler VON OBEN auf den Gegner springt
        if (spieler.pos.y + spielerHoehe - 10 < gegner.pos.y) {
            // Gegner besiegt! (von oben getroffen)
            gegnerBesiegt++;
            // Sieges-Funken erzeugen (Glut-Farbe, passend zu den Augen)
            erzeugeFunken(gegner.pos.x + 16, gegner.pos.y + 16, PALETTE.gegnerGlut, 15);
            // Gegner entfernen
            destroy(gegner);
            // Spieler springt leicht nach oben (Bounce)
            spieler.jump(spielerJump * 0.5);
            // Zaehler aktualisieren
            zeigeNachricht("POFF! (" + gegnerBesiegt + "/" + gegnerGesamt + ")", 1);
        } else {
            // Spieler wurde seitlich getroffen - Schaden!
            spielerGetroffen();
        }
    });

    // Spieler faellt in Lava/Stacheln
    spieler.onCollide("gefahr", () => {
        spielerGetroffen();
    });

    // Spieler sammelt Stern ein
    spieler.onCollide("stern", (stern) => {
        sterneSammlung++;
        erzeugeBluetenblaetter(stern.pos.x, stern.pos.y, 8);
        destroy(stern);
        zeigeNachricht("Stern! (" + sterneSammlung + "/" + sterneGesamt + ")", 1);
    });

    // Spieler erreicht das Ziel
    spieler.onCollide("ziel", () => {
        if (gegnerBesiegt >= gegnerGesamt) {
            // Alle Gegner besiegt UND Ziel erreicht = GEWONNEN!
            go("gewonnen", {
                charakter: spielerName,
                sterne: sterneSammlung,
                sterneMax: sterneGesamt,
            });
        } else {
            // Noch nicht alle Gegner besiegt
            const fehlend = gegnerGesamt - gegnerBesiegt;
            zeigeNachricht("Noch " + fehlend + " Gegner uebrig!", 2);
        }
    });

    // Spieler faellt aus dem Level
    spieler.onUpdate(() => {
        if (spieler.pos.y > LEVEL_KARTE.length * BLOCK + 100) {
            spielerGetroffen();
        }
    });

    // ============================================
    // HILFSFUNKTIONEN
    // ============================================

    // Spieler wurde getroffen oder ist gefallen
    function spielerGetroffen() {
        // Funken-Effekt
        erzeugeFunken(spieler.pos.x, spieler.pos.y, spielerFarbe, 20);
        // Level neu starten
        go("verloren", { charakter: spielerName });
    }

    // Kurze Nachricht auf dem Bildschirm anzeigen (Pergament-Pille, siehe
    // STYLEGUIDE.md Abschnitt 8 - UI-Stil).
    function zeigeNachricht(text_inhalt, dauer) {
        const nachrichtBreite = Math.max(160, text_inhalt.length * 11);
        add([
            rect(nachrichtBreite, 34, { radius: 8 }),
            pos(width() / 2, 50),
            anchor("center"),
            color(...PALETTE.pergament),
            opacity(0.9),
            outline(2, rgb(...PALETTE.pergamentRand)),
            lifespan(dauer, { fade: 0.5 }),
            fixed(),
            z(99),
        ]);
        add([
            text(text_inhalt, { size: 22 }),
            pos(width() / 2, 50),
            anchor("center"),
            color(...PALETTE.tintenbraun),
            lifespan(dauer, { fade: 0.5 }),
            fixed(),
            z(100),
        ]);
    }

    // ============================================
    // UI - Anzeige oben auf dem Bildschirm
    // ============================================
    // Pergament-Panel als Hintergrund fuer die Stats (siehe STYLEGUIDE.md
    // Abschnitt 8).
    add([
        rect(176, 82, { radius: 10 }),
        pos(8, 8),
        color(...PALETTE.pergament),
        opacity(0.88),
        outline(2, rgb(...PALETTE.pergamentRand)),
        fixed(),
        z(99),
    ]);

    // Charakter-Name Anzeige
    add([
        text(spielerName, { size: 18 }),
        pos(20, 16),
        color(...spielerFarbe),
        fixed(),
        z(100),
    ]);

    // Gegner-Zaehler
    const gegnerAnzeige = add([
        text("Gegner: 0/" + gegnerGesamt, { size: 15 }),
        pos(20, 42),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(100),
    ]);

    // Sterne-Zaehler
    const sterneAnzeige = add([
        text("Sterne: 0/" + sterneGesamt, { size: 15 }),
        pos(20, 63),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(100),
    ]);

    // Steuerungstipps (dezente Pergament-Leiste unten)
    add([
        rect(width(), 26, { radius: 0 }),
        pos(0, height() - 26),
        color(...PALETTE.pergament),
        opacity(0.75),
        fixed(),
        z(99),
    ]);
    add([
        text("[Pfeiltasten] Bewegen  [R] Neustart  [ESC] Menue", { size: 12 }),
        pos(width() / 2, height() - 13),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(100),
    ]);

    // UI jeden Frame aktualisieren
    onUpdate(() => {
        gegnerAnzeige.text = "Gegner: " + gegnerBesiegt + "/" + gegnerGesamt;
        sterneAnzeige.text = "Sterne: " + sterneSammlung + "/" + sterneGesamt;
    });

    // ============================================
    // TASTEN-BELEGUNG (Neustart, Menue)
    // ============================================

    // R = Level neu starten
    onKeyPress("r", () => {
        go("spiel");
    });

    // ESC = Zurueck zur Charakter-Auswahl
    onKeyPress("escape", () => {
        go("auswahl");
    });
});

// ============================================
// SZENE: GEWONNEN!
// ============================================

scene("gewonnen", (daten) => {
    camPos(width() / 2, height() / 2);
    camScale(1, 1);

    const stimmung = STIMMUNG.TAG;
    hintergrundEbene(() => himmelVerlauf(stimmung), Z.himmel);
    hintergrundEbene(() => zeichneHuegel(
        vec2(width() / 2, height() * 0.88), width() * 1.3, 110, stimmung.huegel, 1
    ), Z.huegel);
    const wolkenListe = [
        { x: width() * 0.22, y: 80, groesse: 1.1 },
        { x: width() * 0.75, y: 55, groesse: 0.9 },
    ];
    for (const w of wolkenListe) {
        const wolke = hintergrundEbene(
            () => zeichneWolke(vec2(wolke.basisX, w.y), w.groesse, 1), Z.wolken
        );
        wolke.basisX = w.x;
        wolke.onUpdate(() => { wolke.basisX -= 4 * dt(); });
    }

    // Feiernde Bluetenblaetter statt buntem Rechteck-Feuerwerk (siehe
    // STYLEGUIDE.md - Partikel)
    loop(0.25, () => {
        erzeugeBluetenblaetter(rand(0, width()), -20, 3);
    });
    erzeugeFunken(width() / 2, height() / 2, PALETTE.gold, 24);

    // Pergament-Panel hinter dem Text
    add([
        rect(560, 300, { radius: 16 }),
        pos(width() / 2, 300),
        anchor("center"),
        color(...PALETTE.pergament),
        opacity(0.9),
        outline(3, rgb(...PALETTE.gold)),
        fixed(),
        z(Z.ui),
    ]);

    // Grosser Gewinn-Text (auf dem Himmel, oberhalb des Panels)
    add([
        text("DU HAST GEWONNEN!", { size: 40 }),
        pos(width() / 2, 110),
        anchor("center"),
        color(...PALETTE.zinnober),
        fixed(),
        z(Z.ui + 1),
    ]);

    // Charakter-Info
    add([
        text(daten.charakter + " hat das Abenteuer bestanden!", { size: 20 }),
        pos(width() / 2, 200),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui + 1),
    ]);

    // Sterne gesammelt
    add([
        text("Sterne gesammelt: " + daten.sterne + " / " + daten.sterneMax, { size: 20 }),
        pos(width() / 2, 240),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui + 1),
    ]);

    // Super-Nachricht fuer alle Sterne
    if (daten.sterne === daten.sterneMax) {
        add([
            text("PERFEKT! Alle Sterne gesammelt!", { size: 22 }),
            pos(width() / 2, 280),
            anchor("center"),
            color(...PALETTE.grasDunkel),
            fixed(),
            z(Z.ui + 1),
        ]);
    }

    // Neustart-Hinweis
    add([
        text("Druecke [R] fuer Neustart", { size: 20 }),
        pos(width() / 2, 370),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui + 1),
    ]);

    add([
        text("Druecke [ESC] fuer Charakter-Auswahl", { size: 18 }),
        pos(width() / 2, 405),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui + 1),
    ]);

    // Tasten
    onKeyPress("r", () => go("spiel"));
    onKeyPress("escape", () => go("auswahl"));
});

// ============================================
// SZENE: VERLOREN
// ============================================

scene("verloren", (daten) => {
    camPos(width() / 2, height() / 2);
    camScale(1, 1);

    // Abendstimmung statt Taghimmel - passt zum ruhigeren "Versuch's
    // nochmal"-Moment, ohne duester/erschreckend zu wirken (siehe
    // STYLEGUIDE.md Abschnitt 3 - Stimmungen).
    const stimmung = STIMMUNG.ABEND;
    hintergrundEbene(() => himmelVerlauf(stimmung), Z.himmel);
    hintergrundEbene(() => zeichneHuegel(
        vec2(width() / 2, height() * 0.88), width() * 1.3, 110, stimmung.huegel, 1
    ), Z.huegel);
    const wolke = hintergrundEbene(
        () => zeichneWolke(vec2(wolke.basisX, 90), 1.0, 1), Z.wolken
    );
    wolke.basisX = width() * 0.3;
    wolke.onUpdate(() => { wolke.basisX -= 4 * dt(); });

    // Pergament-Panel
    add([
        rect(520, 280, { radius: 16 }),
        pos(width() / 2, 300),
        anchor("center"),
        color(...PALETTE.pergament),
        opacity(0.9),
        outline(3, rgb(...PALETTE.pergamentRand)),
        fixed(),
        z(Z.ui),
    ]);

    add([
        text("Oh nein!", { size: 44 }),
        pos(width() / 2, 130),
        anchor("center"),
        color(...PALETTE.zinnober),
        fixed(),
        z(Z.ui + 1),
    ]);

    add([
        text(daten.charakter + " wurde erwischt!", { size: 20 }),
        pos(width() / 2, 220),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui + 1),
    ]);

    add([
        text("Versuch es nochmal!", { size: 22 }),
        pos(width() / 2, 270),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui + 1),
    ]);

    add([
        text("Druecke [R] fuer Neustart", { size: 20 }),
        pos(width() / 2, 340),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui + 1),
    ]);

    add([
        text("Druecke [ESC] fuer Charakter-Auswahl", { size: 18 }),
        pos(width() / 2, 375),
        anchor("center"),
        color(...PALETTE.tintenbraun),
        fixed(),
        z(Z.ui + 1),
    ]);

    onKeyPress("r", () => go("spiel"));
    onKeyPress("escape", () => go("auswahl"));
});

// ============================================
// SPIEL STARTEN - Charakter-Auswahl zuerst zeigen
// ============================================
go("auswahl");
