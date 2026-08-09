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

// --- Gemalter Ueberzug (Bloom, Warm-Kalt, Papierkorn, Vignette) ---
// Einmal global nach kaboom() setzen. Kompiliert der Shader auf einem
// Rechner nicht, laeuft das Spiel ohne ihn weiter (siehe style.js /
// STYLEGUIDE.md Abschnitt 14).
ladeUeberzugShader();

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

// Gesamtbreite des Levels in Pixeln. Braucht jede Hintergrund-Ebene,
// um zu wissen, wie weit sie reichen muss (siehe ebenenBreite() in
// style.js — eine Ebene mit Parallax 0,08 wandert ueber das ganze
// Level nur ~390 px, eine mit 0,75 aber ~3600 px).
const LEVEL_BREITE = LEVEL_KARTE[0].length * BLOCK;

// ============================================
// SZENE: STARTBILDSCHIRM / CHARAKTER-AUSWAHL
// ============================================

scene("auswahl", () => {
    // Kamera zuruecksetzen - kann nach einer Partie noch irgendwo im Level
    // stehen (siehe STYLEGUIDE.md - durchgaengige Konsistenz der Screens).
    camPos(width() / 2, height() / 2);
    camScale(1, 1);

    const stimmung = STIMMUNG.TAG;
    setzeStimmung(stimmung);
    // Statischer Bildschirm ohne Kamerafahrt: Ebenen-Koordinaten sind
    // hier exakt Bildschirm-Koordinaten (siehe style.js, Ebenen-Raum).
    setzeEbenenBezug(width() / 2);

    // --- Ruhige Himmel-Kulisse (gleiche Helfer wie im Spiel, siehe style.js) ---
    hintergrundEbene(() => himmelVerlauf(stimmung), Z.himmel);
    hintergrundEbene(() => zeichneBergkette({
        saat: 303,
        breite: width(),
        basisY: 344,
        hoeheMin: 120,
        hoeheMax: 235,
        rauheit: 0.6,
        schneeY: 196,
        gratBreite: 34,
        fels: stimmung.bergFern,
        grat: stimmung.bergGrat,
        schnee: stimmung.bergSpitze,
        wald: stimmung.bergWald,
        faktor: 1,
    }), Z.bergFern);
    hintergrundEbene(() => zeichneDunstband(width(), 304, 74, 1), Z.dunst);
    hintergrundEbene(() => zeichneHuegel(width(), 396, 1), Z.huegel);
    const wolkenListe = [
        { x: width() * 0.18, y: 78, groesse: 1.0, saat: 7 },
        { x: width() * 0.8, y: 108, groesse: 1.2, saat: 19 },
    ];
    for (const w of wolkenListe) {
        const wolke = hintergrundEbene(
            () => zeichneWolke(wolke.ebeneX, w.y, w.groesse, 1, w.saat), Z.wolken
        );
        wolke.ebeneX = w.x;
        wolke.onUpdate(() => {
            wolke.ebeneX -= 4 * dt();
            if (wolke.ebeneX < -180) wolke.ebeneX = width() + 180;
        });
    }
    // Kleines Bluetenband vor den Huegeln, damit auch der Titelbildschirm
    // die neue Dichte zeigt.
    const auswahlWiese = {
        breite: width() + 40,
        oberkanteY: 450,
        halme: streuHalme(-20, width() + 20, 446, 22, 200, 10, 61),
        blueten: streuNester(-20, width() + 20, 444, 476, 320, 71),
    };
    hintergrundEbene(() => zeichneWiesenband(auswahlWiese, 1), Z.wiesenband);

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
    setzeStimmung(stimmung);

    // --- Spieler-Startposition finden (wird schon hier gebraucht: sie ist
    // der Bezugspunkt des Ebenen-Rasters) ---
    let startX = 2 * BLOCK;
    let startY = 9 * BLOCK;
    for (let zn = 0; zn < LEVEL_KARTE.length; zn++) {
        const idx = LEVEL_KARTE[zn].indexOf("S");
        if (idx !== -1) {
            startX = idx * BLOCK;
            startY = zn * BLOCK;
            break;
        }
    }

    // Bei dieser Kamera-X entsprechen Ebenen-Koordinaten exakt
    // Bildschirm-Koordinaten (siehe style.js, "Ebenen-Raum"). Alle
    // Kulissen-Werte unten sind daher im 1024x576-Raster gedacht —
    // genau wie im Mockup.
    setzeEbenenBezug(startX);

    // Der Boden unter dem Spieler liegt immer bei rund y = 376 auf dem
    // Bildschirm (die Kamera folgt ihm), darueber wird die Kulisse
    // gestapelt: Berge -> Dunst -> Huegel -> Wald -> Wiese -> Boden.
    const Y_BERG_FERN = 304;
    const Y_BERG_NAH = 318;
    const Y_DUNST = 256;
    const Y_HUEGEL = 322;
    const Y_WALD = 352;
    const Y_WIESE = 352;

    // hintergrundEbene() kommt jetzt aus style.js (wird auch von den
    // Auswahl-/Gewonnen-/Verloren-Bildschirmen benutzt).

    // Himmel-Verlauf mit sechs Stopps, deckt das Bild jeden Frame
    // komplett ab (Faktor 0 - bewegt sich nie relativ zur Kamera).
    hintergrundEbene(() => himmelVerlauf(stimmung), Z.himmel);

    // EINE durchgehende ferne Bergkette ueber die volle Ebenen-Breite.
    // Frueher waren das vier Einzelpolygone - die lagen bei Parallax 0,08
    // faktisch uebereinander und wanderten ueber das ganze Level nur
    // ~156 px (STYLEGUIDE.md Abschnitt 13, "Parallax-Warnung").
    const breiteBergFern = ebenenBreite(PARALLAX.bergFern, LEVEL_BREITE);
    hintergrundEbene(() => zeichneBergkette({
        saat: 101,
        breite: breiteBergFern,
        basisY: Y_BERG_FERN,
        hoeheMin: 130,
        hoeheMax: 245,
        rauheit: 0.62,
        schneeY: Y_BERG_FERN - 158,
        gratBreite: 36,
        fels: stimmung.bergFern,
        grat: stimmung.bergGrat,
        schnee: stimmung.bergSpitze,
        wald: null,
        faktor: PARALLAX.bergFern,
    }), Z.bergFern);

    // Nahe Bergkette: dunkler, niedriger, mit bewaldetem Fuss
    const breiteBergNah = ebenenBreite(PARALLAX.bergNah, LEVEL_BREITE);
    hintergrundEbene(() => zeichneBergkette({
        saat: 202,
        breite: breiteBergNah,
        basisY: Y_BERG_NAH,
        hoeheMin: 85,
        hoeheMax: 175,
        rauheit: 0.55,
        schneeY: Y_BERG_NAH - 118,
        gratBreite: 30,
        fels: stimmung.bergNah,
        grat: stimmung.bergGrat,
        schnee: mische(stimmung.bergSpitze, stimmung.bergNah, 0.18),
        wald: stimmung.bergWald,
        faktor: PARALLAX.bergNah,
    }), Z.bergNah);

    // NEU: Horizont-Dunst loest die Bergfuesse auf (Abschnitt 13)
    const breiteDunst = ebenenBreite(PARALLAX.dunst, LEVEL_BREITE);
    hintergrundEbene(
        () => zeichneDunstband(breiteDunst, Y_DUNST, 74, PARALLAX.dunst),
        Z.dunst
    );

    // Sanfte Huegel in zwei Reihen, mit Streiflicht-Oberkante
    const breiteHuegel = ebenenBreite(PARALLAX.huegel, LEVEL_BREITE);
    hintergrundEbene(
        () => zeichneHuegel(breiteHuegel, Y_HUEGEL, PARALLAX.huegel),
        Z.huegel
    );

    // Wolken, ziehen langsam und stetig nach links (siehe STYLEGUIDE.md
    // Abschnitt 6 - Wolkenzug). Anzahl bleibt bei 5, aber jede Wolke hat
    // jetzt 5 Wertstufen aus ~16 Lappen und 15 Silhouetten-Beulen.
    const WOLKEN_SPANNE = width() + 520;
    const wolkenListe = [
        { x: 90, y: 108, groesse: 1.2, saat: 7 },
        { x: 430, y: 74, groesse: 0.9, saat: 13 },
        { x: 700, y: 148, groesse: 1.4, saat: 19 },
        { x: 980, y: 96, groesse: 1.0, saat: 23 },
        { x: 1240, y: 130, groesse: 1.1, saat: 29 },
    ];
    for (const w of wolkenListe) {
        const wolke = hintergrundEbene(
            () => zeichneWolke(wolke.ebeneX, w.y, w.groesse, PARALLAX.wolken, w.saat),
            Z.wolken
        );
        wolke.ebeneX = w.x;
        wolke.onUpdate(() => {
            wolke.ebeneX -= 4 * dt();
            // Rundlauf: bei Parallax 0,5 waeren die Wolken sonst nach
            // zwei Bildschirmbreiten endgueltig nach links hinausgeschoben
            // und der restliche Himmel bliebe leer.
            const s = wolke.ebeneX - ebenenVersatz(PARALLAX.wolken);
            if (s < -260) wolke.ebeneX += WOLKEN_SPANNE;
            else if (s > width() + 260) wolke.ebeneX -= WOLKEN_SPANNE;
        });
    }

    // NEU: Waldband (Abschnitt 13) - 7-11 Baeume je Bildschirmbreite
    const breiteWald = ebenenBreite(PARALLAX.wald, LEVEL_BREITE);
    const baeume = [];
    {
        const zuf = saatZufall(41);
        const anzahl = Math.round((breiteWald / 1024) * 9);
        for (let i = 0; i < anzahl; i++) {
            baeume.push({
                x: (i + 0.5) * (breiteWald / anzahl) + (zuf() - 0.5) * 44,
                y: Y_WALD + zuf() * 6,
                groesse: 18 + zuf() * 14,
                saat: 50 + i,
            });
        }
        baeume.sort((a, b) => a.x - b.x);
    }
    hintergrundEbene(() => zeichneWaldband(baeume, PARALLAX.wald), Z.wald);

    // NEU: Bluetenwiesen-Band im Mittelgrund (Abschnitt 13).
    // Positionen einmalig vorberechnet - NIE rand() im onDraw().
    const breiteWiese = ebenenBreite(PARALLAX.wiesenband, LEVEL_BREITE);
    const wiesenDaten = {
        breite: breiteWiese,
        oberkanteY: Y_WIESE,
        halme: streuHalme(
            -20, breiteWiese, Y_WIESE - 4, 16,
            Math.round((breiteWiese / 1024) * 130), 9, 61
        ),
        blueten: streuNester(
            -20, breiteWiese, Y_WIESE - 6, Y_WIESE + 16,
            Math.round((breiteWiese / 1024) * 210), 71
        ),
    };
    hintergrundEbene(
        () => zeichneWiesenband(wiesenDaten, PARALLAX.wiesenband),
        Z.wiesenband
    );

    // Vordergrund-Ebene (Parallax 1,3): grosse Halme mit Kontur am
    // unteren Bildrand - rahmt das Bild und macht die Tiefenstaffelung
    // nach vorne hin komplett.
    const breiteVorn = ebenenBreite(PARALLAX.vordergrund, LEVEL_BREITE);
    const vordergrundDaten = {
        halme: streuHalme(
            -20, breiteVorn, height() - 2, 0,
            Math.round((breiteVorn / 1024) * 60), 34, 121
        ),
        blumen: [],
    };
    {
        const zuf = saatZufall(131);
        const anzahl = Math.round((breiteVorn / 1024) * 8);
        for (let i = 0; i < anzahl; i++) {
            vordergrundDaten.blumen.push({
                x: zuf() * breiteVorn,
                y: height() - 10 - zuf() * 26,
                t: Math.floor(zuf() * 5),
            });
        }
        vordergrundDaten.blumen.sort((a, b) => a.x - b.x);
    }
    hintergrundEbene(
        () => zeichneVordergrund(vordergrundDaten, PARALLAX.vordergrund),
        Z.vordergrund
    );

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

    // Oberflaechen-Bloecke werden nur gesammelt und danach zu
    // durchgehenden Baendern verschmolzen (siehe unten) - frueher bekam
    // JEDER Block sein eigenes onDraw-Objekt fuer die Grasfranse.
    const oberflaechen = [];

    for (let zeile = 0; zeile < LEVEL_KARTE.length; zeile++) {
        for (let spalte = 0; spalte < LEVEL_KARTE[zeile].length; spalte++) {
            const zeichen = LEVEL_KARTE[zeile][spalte];
            const x = spalte * BLOCK;
            const y = zeile * BLOCK;

            switch (zeichen) {
                // Solide Mauer / Boden
                case "=": {
                    // Nur der oberste sichtbare Block einer Saeule bekommt
                    // Gras - darunter liegende Bloecke sind Erde (siehe
                    // STYLEGUIDE.md Abschnitt 5). Das Grasband selbst wird
                    // spaeter gebuendelt gezeichnet (siehe bodenLaeufe).
                    const zeichenOben = zeile > 0 ? LEVEL_KARTE[zeile - 1][spalte] : ".";
                    const istOberflaeche = zeichenOben !== "=";
                    // Leichte, feste Farbstreuung je Block statt einer
                    // toten Einheitsflaeche - kostet keinen einzigen
                    // zusaetzlichen Zeichenaufruf. hashZahl() statt rand():
                    // beim Neustart sieht die Erde wieder genauso aus.
                    const erdTon = hashZahl(spalte * 7 + zeile * 13) * 0.22;
                    add([
                        rect(BLOCK, BLOCK),
                        pos(x, y),
                        color(...(istOberflaeche
                            ? mische(PALETTE.erde, PALETTE.holz, erdTon)
                            : mische(PALETTE.erdeDunkel, PALETTE.erde, erdTon))),
                        area(),
                        body({ isStatic: true }),
                        z(Z.bodenBlock),
                        "boden",
                    ]);
                    if (istOberflaeche) oberflaechen.push({ x: x, y: y });
                    break;
                }

                // Plattform (durchlaessig von unten)
                case "-": {
                    // Eigenkontur als dunkler "Aufkleber" HINTER dem Brett
                    // (billiger und weicher als ein Linien-Umriss).
                    add([
                        rect(BLOCK + 4, 17, { radius: 6 }),
                        pos(x - 2, y + BLOCK - 14),
                        color(...konturArr(PALETTE.holz, 0.38)),
                        z(Z.bodenBlock),
                    ]);
                    add([
                        rect(BLOCK, 12, { radius: 5 }),
                        pos(x, y + BLOCK - 12),
                        color(...PALETTE.holz),
                        area(),
                        body({ isStatic: true }),
                        "plattform",
                    ]);
                    // Warmes Streiflicht oben (Licht kommt von oben rechts)
                    add([
                        rect(BLOCK - 10, 3, { radius: 1.5 }),
                        pos(x + 5, y + BLOCK - 11),
                        color(...mische(PALETTE.holz, PALETTE.gold, 0.4)),
                        opacity(0.7),
                    ]);
                    // Dunklere Unterkante fuer etwas Tiefe
                    add([
                        rect(BLOCK, 3),
                        pos(x, y + BLOCK - 3),
                        color(...PALETTE.holzDunkel),
                    ]);
                    break;
                }

                // Stacheln / Lava (toedlich)
                case "^": {
                    add([
                        rect(BLOCK, BLOCK, { radius: 5 }),
                        pos(x, y),
                        color(...PALETTE.lavaDunkel),
                        outline(2, kontur(PALETTE.lavaDunkel, 0.35)),
                        area(),
                        body({ isStatic: true }),
                        "gefahr",
                    ]);
                    // Weiches, pulsierendes Gluehen plus drei Flammenzungen
                    // statt harter Stachel-Spitzen (siehe STYLEGUIDE.md -
                    // "weichere Gefahren-Zone")
                    const gluehObj = add([pos(x + BLOCK / 2, y + BLOCK / 2)]);
                    gluehObj.onDraw(() => {
                        const puls = 8 + Math.sin(time() * 3) * 2;
                        zeichneGluehen(vec2(0, 0), puls, PALETTE.lavaHell);
                        const flamme = rgb(...PALETTE.lavaHell);
                        for (let i = -1; i <= 1; i++) {
                            const h = 11 + Math.sin(time() * 4 + i * 1.7) * 4;
                            drawPolygon({
                                pts: [
                                    vec2(i * 13 - 5, -18),
                                    vec2(i * 13 + 5, -18),
                                    vec2(i * 13, -18 - h),
                                ],
                                color: flamme,
                            });
                        }
                    });
                    break;
                }

                // Gegner
                case "G": {
                    gegnerGesamt++;
                    // rect() hier nur als (unsichtbare) Kollisionsform -
                    // das gesamte Aussehen entsteht im onDraw() darunter.
                    const gegner = add([
                        rect(32, 32, { radius: 6, fill: false }),
                        pos(x + 8, y + 16),
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
                    const gegnerKontur = kontur(PALETTE.gegnerSchiefer, 0.4);
                    const gegnerLicht = mische(PALETTE.gegnerSchiefer, PALETTE.wolkeHell, 0.32);
                    const gegnerSchatten = konturArr(PALETTE.gegnerSchiefer, 0.35);
                    // Eigenkontur, Streiflicht und weich gluehende Glut-Augen
                    // (alles im eigenen onDraw() - siehe STYLEGUIDE.md
                    // Abschnitt 5: niemals follow() fuer Charakter-Details)
                    gegner.onDraw(() => {
                        zeichneKontaktschatten(16, 33, 32);
                        drawRect({
                            pos: vec2(-2, -2), width: 36, height: 36,
                            radius: 8, color: gegnerKontur,
                        });
                        drawRect({
                            pos: vec2(0, 0), width: 32, height: 32,
                            radius: 6, color: rgb(...PALETTE.gegnerSchiefer),
                        });
                        zeichneKoerperLicht(32, 32, gegnerLicht, gegnerSchatten);
                        const versatz = gegner.richtung * 3;
                        zeichneGluehen(vec2(10 + versatz, 14), 3.5, PALETTE.gegnerGlut);
                        zeichneGluehen(vec2(20 + versatz, 14), 3.5, PALETTE.gegnerGlut);
                    });
                    break;
                }

                // Spieler-Startposition
                case "S":
                    // Wird spaeter verwendet
                    break;

                // Ziel (goldene Flagge)
                case "Z": {
                    // Kontur-Unterbau: leicht groessere, dunklere Form HINTER
                    // der Plattform - dasselbe Muster wie bei den Holz-
                    // plattformen und den Gegnern (siehe oben).
                    add([
                        rect(BLOCK * 2 + 6, BLOCK + 5, { radius: 11 }),
                        pos(x - BLOCK / 2 - 3, y - 3),
                        color(...konturArr(PALETTE.gold, 0.35)),
                        z(Z.bodenBlock),
                    ]);
                    // Ziel-Plattform: fast deckend statt durchscheinend -
                    // vorher schien Gras/Blueten/Levelwand hindurch und das
                    // wichtigste Objekt im Level las sich als Nebelfleck.
                    add([
                        rect(BLOCK * 2, BLOCK, { radius: 8 }),
                        pos(x - BLOCK / 2, y),
                        color(...PALETTE.gold),
                        area(),
                        body({ isStatic: true }),
                        opacity(0.95),
                        "ziel",
                    ]);
                    // Flaggenmast: heller Ton, sonst verschwindet das Holz
                    // vor der braunen Erdwand direkt dahinter.
                    const mastFarbe = mische(PALETTE.holz, PALETTE.wolkeHell, 0.35);
                    add([
                        rect(6, BLOCK * 2, { radius: 3 }),
                        pos(x + 10, y - BLOCK * 2),
                        color(...mastFarbe),
                        outline(2, kontur(mastFarbe, 0.4)),
                    ]);
                    // Fahne mit weicher Ecke und Eigenkontur
                    add([
                        rect(30, 20, { radius: 4 }),
                        pos(x + 16, y - BLOCK * 2),
                        color(...PALETTE.zinnober),
                        outline(2, kontur(PALETTE.zinnober, 0.35)),
                    ]);
                    // "ZIEL" auf einer kleinen Pergament-Pille (dasselbe
                    // Muster wie zeigeNachricht(), nur in Miniatur). Gold auf
                    // blaugrauem Berghimmel war zu kontrastarm, und der
                    // linksbuendige Anker lief nach rechts ueber die
                    // Levelwand hinaus.
                    const schildX = x + 13;
                    const schildY = y - BLOCK * 2 - 26;
                    add([
                        rect(66, 28, { radius: 8 }),
                        pos(schildX, schildY),
                        anchor("center"),
                        color(...PALETTE.pergament),
                        opacity(0.92),
                        outline(2, rgb(...PALETTE.pergamentRand)),
                        z(Z.level),
                    ]);
                    add([
                        text("ZIEL", { size: 16 }),
                        pos(schildX, schildY),
                        anchor("center"),
                        color(...PALETTE.tintenbraun),
                        z(Z.level),
                    ]);
                    break;
                }

                // Stern (Bonus)
                case "*": {
                    sterneGesamt++;
                    const stern = add([
                        rect(20, 20, { radius: 4, fill: false }),
                        pos(x + 14, y + 14),
                        area(),
                        anchor("center"),
                        "stern",
                    ]);
                    // Echte Zackenform mit Eigenkontur, dazu zwei weiche
                    // Gluehringe (siehe STYLEGUIDE.md Abschnitt 7 + 11)
                    const gold = rgb(...PALETTE.gold);
                    stern.onDraw(() => {
                        drawCircle({ pos: vec2(0, 0), radius: 38, color: gold, opacity: 0.07, resolution: 0.5 });
                        drawCircle({ pos: vec2(0, 0), radius: 28, color: gold, opacity: 0.12, resolution: 0.5 });
                        drawCircle({ pos: vec2(0, 0), radius: 19, color: gold, opacity: 0.2, resolution: 0.5 });
                        zeichneStern(0, 0, 13, PALETTE.gold);
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
    }

    // ============================================
    // BODENBAND, GRASFRANSE UND BLUETEN (gebuendelt)
    // ============================================
    // Frueher bekam jeder einzelne Oberflaechenblock ein eigenes
    // onDraw-Objekt (~90 Fransen-Objekte + ~22 Deko-Objekte). Jetzt
    // werden benachbarte Oberflaechenbloecke zu durchgehenden Baendern
    // verschmolzen, und es gibt genau EIN Objekt fuer alle Fransen und
    // EINES fuer alle Blueten - beide mit Culling gegen die Kamera
    // (STYLEGUIDE.md Abschnitt 12: das Level ist 4944 px breit).
    oberflaechen.sort((a, b) => (a.y - b.y) || (a.x - b.x));
    const bodenLaeufe = [];
    for (const o of oberflaechen) {
        const letzter = bodenLaeufe[bodenLaeufe.length - 1];
        if (letzter && letzter.top === o.y && letzter.x + letzter.breite === o.x) {
            letzter.breite += BLOCK;
        } else {
            bodenLaeufe.push({ x: o.x, breite: BLOCK, top: o.y });
        }
    }
    bodenLaeufe.sort((a, b) => a.x - b.x);

    // Blueten EINMALIG in Nestern vorberechnen - niemals rand() im
    // onDraw() (das wuerde jedes Bild neu wuerfeln und flackern).
    let bodenBlueten = [];
    for (const l of bodenLaeufe) {
        const anzahl = Math.round((l.breite / 1024) * 300);
        bodenBlueten = bodenBlueten.concat(streuNester(
            l.x + 2, l.x + l.breite - 2, l.top - 2, l.top + 26,
            anzahl, Math.round(l.x + l.top * 7)
        ));
    }
    bodenBlueten.sort((a, b) => a.x - b.x);

    // EIN Objekt fuer Bodenband + Grasfranse
    const bodenDeko = add([z(Z.bodenDeko)]);
    bodenDeko.onDraw(() => {
        const f = sichtFensterWelt();
        for (const l of bodenLaeufe) {
            if (l.x + l.breite < f.von) continue;
            if (l.x > f.bis) break;
            zeichneBodenband(l.x, l.breite, l.top);
            zeichneGrasFranse(l.x, l.top, l.breite);
        }
    });

    // EIN Objekt fuer alle Blueten
    const bluetenFarben = stimmung.blueten.map((c) => rgb(...c));
    const bluetenKonturen = stimmung.blueten.map((c) => kontur(c, 0.34));
    const bluetenDeko = add([z(Z.bodenDeko)]);
    bluetenDeko.onDraw(() => {
        zeichneBluetenfeld(
            bodenBlueten, vec2(0, 0), bluetenFarben, bluetenKonturen,
            2.0, true, sichtFensterWelt()
        );
    });

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

    // Farben und Konturen einmal vorbereiten (nicht jedes Bild neu).
    // Eigenkontur = eigene Farbe um 42 % abgedunkelt, nie Schwarz
    // (STYLEGUIDE.md Abschnitt 11 - Comic-Regel).
    const spielerKontur = kontur(spielerFarbe, 0.42);
    const hornKontur = kontur(PALETTE.dracheHorn, 0.3);
    const fluegelFarbe = rgb(...PALETTE.dracheTief);
    const fluegelKontur = kontur(PALETTE.dracheTief, 0.3);

    if (gewaehlterCharakter === "arin") {
        spieler.onDraw(() => {
            pushTransform();
            pushScale(animScaleX, animScaleY);
            // Kontaktschatten - verankert Arin im Boden
            zeichneKontaktschatten(spielerBreite / 2, spielerHoehe + 2, spielerBreite);
            // Eigenkontur als dunklerer "Aufkleber" hinter dem Koerper
            drawRect({
                pos: vec2(-2, -2),
                width: spielerBreite + 4,
                height: spielerHoehe + 4,
                radius: 10,
                color: spielerKontur,
            });
            // Koerper
            drawRect({
                pos: vec2(0, 0),
                width: spielerBreite,
                height: spielerHoehe,
                radius: 8,
                color: rgb(...spielerFarbe),
            });
            // Streiflicht oben rechts, Schatten unten links
            zeichneKoerperLicht(spielerBreite, spielerHoehe, PALETTE.arinLicht, PALETTE.arinTief);
            // Stirnband mit Eigenkontur (sitzt bewusst oberhalb der Augen)
            drawRect({
                pos: vec2(-5, 2),
                width: spielerBreite + 10,
                height: 8,
                radius: 2,
                color: kontur(PALETTE.arinAkzent, 0.35),
            });
            drawRect({
                pos: vec2(-4, 3),
                width: spielerBreite + 8,
                height: 6,
                radius: 2,
                color: rgb(...PALETTE.arinAkzent),
            });
            // Flatternde Stirnband-Baender hinten
            const v = spieler.blickrichtung;
            const flatter = Math.sin(time() * 6) * 3;
            drawPolygon({
                pts: [
                    vec2(v > 0 ? -4 : spielerBreite + 4, 4),
                    vec2(v > 0 ? -16 : spielerBreite + 16, 11 + flatter),
                    vec2(v > 0 ? -13 : spielerBreite + 13, 17 + flatter),
                    vec2(v > 0 ? -4 : spielerBreite + 4, 9),
                ],
                color: rgb(...PALETTE.arinAkzent),
            });
            // Augen - Pupillen ruecken leicht in Blickrichtung
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
            const v = spieler.blickrichtung;
            // Kontaktschatten
            zeichneKontaktschatten(spielerBreite / 2, spielerHoehe + 2, spielerBreite);
            // Fluegel HINTER dem Koerper, an der Hinterkante, mit
            // leichtem Flattern (Faecher ab der Schulter - deshalb
            // darf die Form ruhig ausgebuchtet sein)
            const sx = v > 0 ? -1 : 1;
            const ax = v > 0 ? spielerBreite * 0.25 : spielerBreite * 0.75;
            const schlag = Math.sin(time() * 4) * 3;
            drawPolygon({
                pts: [
                    vec2(ax, spielerHoehe * 0.28),
                    vec2(ax + sx * 14, spielerHoehe * 0.28 - 16 - schlag),
                    vec2(ax + sx * 29, spielerHoehe * 0.3 - 6 - schlag),
                    vec2(ax + sx * 27, spielerHoehe * 0.3 + 7),
                    vec2(ax + sx * 17, spielerHoehe * 0.3 + 3),
                    vec2(ax + sx * 8, spielerHoehe * 0.3 + 6),
                ],
                color: fluegelFarbe,
                outline: { width: 1.5, color: fluegelKontur },
            });
            // Hoerner (mit Eigenkontur)
            drawPolygon({
                pts: [vec2(4, 0), vec2(10, 0), vec2(7, -13)],
                color: rgb(...PALETTE.dracheHorn),
                outline: { width: 1.2, color: hornKontur },
            });
            drawPolygon({
                pts: [vec2(spielerBreite - 10, 0), vec2(spielerBreite - 4, 0), vec2(spielerBreite - 7, -13)],
                color: rgb(...PALETTE.dracheHorn),
                outline: { width: 1.2, color: hornKontur },
            });
            // Eigenkontur als "Aufkleber" hinter dem Koerper
            drawRect({
                pos: vec2(-2, -2),
                width: spielerBreite + 4,
                height: spielerHoehe + 4,
                radius: 12,
                color: spielerKontur,
            });
            // Koerper
            drawRect({
                pos: vec2(0, 0),
                width: spielerBreite,
                height: spielerHoehe,
                radius: 10,
                color: rgb(...spielerFarbe),
            });
            // Streiflicht oben rechts, Schatten unten links
            zeichneKoerperLicht(spielerBreite, spielerHoehe, PALETTE.dracheLicht, PALETTE.dracheTief);
            // Helle Bauch-Unterseite
            drawEllipse({
                pos: vec2(spielerBreite / 2, spielerHoehe * 0.75),
                radiusX: spielerBreite * 0.35,
                radiusY: spielerHoehe * 0.22,
                color: rgb(...PALETTE.dracheBauch),
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
    setzeStimmung(stimmung);
    setzeEbenenBezug(width() / 2);

    hintergrundEbene(() => himmelVerlauf(stimmung), Z.himmel);
    hintergrundEbene(() => zeichneBergkette({
        saat: 404,
        breite: width(),
        basisY: 360,
        hoeheMin: 100,
        hoeheMax: 200,
        rauheit: 0.58,
        schneeY: 230,
        gratBreite: 30,
        fels: stimmung.bergFern,
        grat: stimmung.bergGrat,
        schnee: stimmung.bergSpitze,
        wald: stimmung.bergWald,
        faktor: 1,
    }), Z.bergFern);
    hintergrundEbene(() => zeichneDunstband(width(), 320, 74, 1), Z.dunst);
    hintergrundEbene(() => zeichneHuegel(width(), 416, 1), Z.huegel);
    const wolkenListe = [
        { x: width() * 0.22, y: 84, groesse: 1.1, saat: 13 },
        { x: width() * 0.75, y: 58, groesse: 0.9, saat: 29 },
    ];
    for (const w of wolkenListe) {
        const wolke = hintergrundEbene(
            () => zeichneWolke(wolke.ebeneX, w.y, w.groesse, 1, w.saat), Z.wolken
        );
        wolke.ebeneX = w.x;
        wolke.onUpdate(() => {
            wolke.ebeneX -= 4 * dt();
            if (wolke.ebeneX < -180) wolke.ebeneX = width() + 180;
        });
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
    setzeStimmung(stimmung);
    setzeEbenenBezug(width() / 2);

    hintergrundEbene(() => himmelVerlauf(stimmung), Z.himmel);
    hintergrundEbene(() => zeichneBergkette({
        saat: 505,
        breite: width(),
        basisY: 360,
        hoeheMin: 100,
        hoeheMax: 200,
        rauheit: 0.58,
        schneeY: 230,
        gratBreite: 30,
        fels: stimmung.bergFern,
        grat: stimmung.bergGrat,
        schnee: stimmung.bergSpitze,
        wald: stimmung.bergWald,
        faktor: 1,
    }), Z.bergFern);
    hintergrundEbene(() => zeichneDunstband(width(), 320, 74, 1), Z.dunst);
    hintergrundEbene(() => zeichneHuegel(width(), 416, 1), Z.huegel);
    const wolke = hintergrundEbene(
        () => zeichneWolke(wolke.ebeneX, 92, 1.0, 1, 19), Z.wolken
    );
    wolke.ebeneX = width() * 0.3;
    wolke.onUpdate(() => {
        wolke.ebeneX -= 4 * dt();
        if (wolke.ebeneX < -180) wolke.ebeneX = width() + 180;
    });

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
