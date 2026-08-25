// ============================================
// FIGUREN.JS — Handgezeichnete Ghibli-Figuren
// ============================================
// Siehe .claude/briefs/ghibli-figuren-brief.md fuer Design-Spec und den
// Funktions-Vertrag. Ersetzt die alten Rechteck-Figuren (game.js) durch
// weiche, organische Silhouetten im Stil der Lush-Ghibli-Kulisse (style.js).
//
// Vertraege (Koordinatenursprung = OBEN-LINKS der Kollisionsbox, der
// Aufrufer kuemmert sich nur um Squash&Stretch via pushScale):
//   zeichneArin(breite, hoehe, opt)    Box 30x38
//   zeichneDrache(breite, hoehe, opt)  Box 38x42
//   zeichneGeist(breite, hoehe, opt)   Box 32x32
//     opt = { blickrichtung: 1|-1, zeit: sekunden, inLuft: bool,
//             laufen: 0..1 (nur Arin) }
//   zeichneArinVorschau(mx, my, sk) / zeichneDracheVorschau(mx, my, sk)
//     fuer den Auswahl-Bildschirm (atmet leicht, Zeit läuft weiter).
//
// Wie style.js: Diese Datei wird VOR kaboom() geladen — im Datei-Scope
// steht deshalb KEIN Kaboom-Aufruf, nur Definitionen.

// Neue Farb-Tokens bewusst LOKAL (keine Aenderung an style.js):
const FIGUR_FARBEN = {
    arinHaut: [255, 224, 196],          // warmes Gesicht unter der Kapuze
    arinHautSchatten: [236, 193, 158],
    geistLila: [178, 132, 214],         // "lila Gegner" (siehe README)
    geistLilaTief: [136, 95, 174],
    geistLilaLicht: [206, 168, 234],
};

// ============================================
// FORM-HELFER (rein rechnerisch, kein Kaboom)
// ============================================

// Ellipse als Punktliste (geschlossen: letzter Punkt = erster).
function ellipsenPunkte(cx, cy, rx, ry, segmente) {
    const pts = [];
    for (let i = 0; i <= segmente; i++) {
        const a = (i / segmente) * Math.PI * 2;
        pts.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry });
    }
    return pts;
}

// Abgerundetes Rechteck als Punktliste im Uhrzeigersinn (geschlossen).
// Konvex — darf als Fächer ab pts[0] trianguliert werden.
function rundeKonturPunkte(x, y, w, h, r, seg = 4) {
    const pts = [];
    const ecken = [
        { cx: x + w - r, cy: y + r, von: -Math.PI / 2 },
        { cx: x + w - r, cy: y + h - r, von: 0 },
        { cx: x + r, cy: y + h - r, von: Math.PI / 2 },
        { cx: x + r, cy: y + r, von: Math.PI },
    ];
    for (const e of ecken) {
        for (let i = 0; i <= seg; i++) {
            const a = e.von + (i / seg) * (Math.PI / 2);
            pts.push({ x: e.cx + Math.cos(a) * r, y: e.cy + Math.sin(a) * r });
        }
    }
    pts.push(pts[0]);
    return pts;
}

// Band entlang einer Mittellinie: fuer jedes Segment drei Fächer-
// Dreiecke ab punkte[i] (Senkrechte je Segmentrichtung). Damit sind
// auch geschwungene, nicht-konvexe Streifen sauber gefuellt —
// Stirnband-Zipfel, Drachenschwanz, Geist-Mündchen.
function bandStreifen(s, punkte, breiten, farbe) {
    for (let i = 0; i < punkte.length - 1; i++) {
        const a = punkte[i];
        const b = punkte[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const l = Math.hypot(dx, dy) || 1;
        const nx = -dy / l;
        const ny = dx / l;
        const wa = breiten[i];
        const wb = breiten[i + 1];
        sammleForm(s, [a, { x: a.x + nx * wa, y: a.y + ny * wa }, { x: b.x + nx * wb, y: b.y + ny * wb }], farbe);
        sammleForm(s, [a, { x: b.x + nx * wb, y: b.y + ny * wb }, { x: b.x - nx * wb, y: b.y - ny * wb }], farbe);
        sammleForm(s, [a, { x: b.x - nx * wb, y: b.y - ny * wb }, { x: a.x - nx * wa, y: a.y - ny * wa }], farbe);
    }
}

// Weiche Geist-Silhouette: obere Kreisbögen, wellig-zackige Unterkante
// (Geister-Tuch). skala > 1 liefert die aufgeblähte Form fuer die
// Eigenkontur. Geschlossen und sternfoermig ab dem obersten Punkt.
function geistBlobPunkte(cx, cy, r, skala) {
    const roh = [];
    for (let a = -90; a <= 45; a += 15) {
        const rad = (a * Math.PI) / 180;
        roh.push({ x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r });
    }
    const spanne = 1.414 * r;
    for (let i = 1; i <= 5; i++) {
        roh.push({
            x: cx + 0.707 * r - (i / 6) * spanne,
            y: cy + 0.84 * r + Math.sin(i * 2.4) * r * 0.15,
        });
    }
    for (let a = 135; a <= 270; a += 15) {
        const rad = (a * Math.PI) / 180;
        roh.push({ x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r });
    }
    roh.push(roh[0]);
    if (skala === 1) return roh;
    return roh.map((p) => ({
        x: cx + (p.x - cx) * skala,
        y: cy + (p.y - cy) * skala,
    }));
}

// ============================================
// ARIN — Ghibli-Fantasy-Ninja (Chibi)
// ============================================
// Grosser runder Kapuzenkopf (~60 % der Hoehe), sichtbares freundliches
// Gesicht, winziger Gi darunter. Blickrichtung wird ueber Spiegelung
// der ganzen Figur geloest — gezeichnet wird immer nach rechts.
function zeichneArin(breite, hoehe, opt) {
    opt = opt || {};
    const v = opt.blickrichtung === -1 ? -1 : 1;
    const z = opt.zeit !== undefined ? opt.zeit : time();
    const inLuft = !!opt.inLuft;
    const laufen = Math.min(Math.max(opt.laufen || 0, 0), 1);

    // Massstab: alle unten stehenden Werte sind fuer die 30x38-Box
    // entworfen und skalieren proportional mit.
    const mx = breite / 30;
    const my = hoehe / 38;

    pushTransform();
    if (v < 0) {
        pushTranslate(breite, 0);
        pushScale(-1, 1);
    }
    pushScale(mx, my);

    const indigo = rgb(...PALETTE.arinIndigo);
    const tief = rgb(...PALETTE.arinTief);
    const haut = rgb(...FIGUR_FARBEN.arinHaut);
    const akzent = rgb(...PALETTE.arinAkzent);
    const gold = rgb(...PALETTE.gold);

    // Kontaktschatten vor der Spiegelung ist symmetrisch — hier ok.
    if (!inLuft) zeichneKontaktschatten(15, 39.5, 26);

    // --- Eigenkontur: ein Aufkleber hinter der GESAMTEN Silhouette ---
    const stKontur = kontur(PALETTE.arinIndigo, 0.42);
    const sticker = neuerSammler();
    sammleForm(sticker, kreisPunkte(15, 8, 15.3, 14), stKontur);
    sammleForm(sticker, rundeKonturPunkte(4, 20.5, 22, 13.5, 4.5), stKontur);
    sammleForm(sticker, kreisPunkte(11.75, 34.5, 5, 8), stKontur);
    sammleForm(sticker, kreisPunkte(18.25, 34.5, 5, 8), stKontur);
    // Stirnband-Zipfel ragen hinten heraus — im Aufkleber mitdenken.
    bandStreifen(
        sticker,
        [
            { x: 3.5, y: 7 },
            { x: -4 + Math.sin(z * 6) * 1.2, y: 9.5 + Math.sin(z * 6 + 1) * 1.8 },
            { x: -10.5 + Math.sin(z * 6 + 2) * 1.6, y: 13 + Math.sin(z * 6 + 2.2) * 2 },
        ],
        [4.6, 3.4, 2.4],
        stKontur
    );
    zeichneSammler(sticker);

    // --- Stirnband-Baender HINTER dem Kopf, flattern in der Zeit ---
    const baender = neuerSammler();
    const akzentTief = kontur(PALETTE.arinAkzent, 0.3);
    bandStreifen(
        baender,
        [
            { x: 3.5, y: 6.8 },
            { x: -3 + Math.sin(z * 6) * 1.2, y: 9 + Math.sin(z * 6 + 1) * 1.8 },
            { x: -9.5 + Math.sin(z * 6 + 2) * 1.6, y: 12.5 + Math.sin(z * 6 + 2.2) * 2 },
        ],
        [3, 2.1, 1.3],
        akzent
    );
    bandStreifen(
        baender,
        [
            { x: 3.5, y: 8.6 },
            { x: -2 + Math.sin(z * 6 + 0.7) * 1.2, y: 11.5 + Math.sin(z * 6 + 1.7) * 1.6 },
            { x: -7.5 + Math.sin(z * 6 + 2.6) * 1.4, y: 14.8 + Math.sin(z * 6 + 2.9) * 1.8 },
        ],
        [2.3, 1.6, 1],
        akzentTief
    );
    zeichneSammler(baender);

    // --- Beine: stubby, mit simpler Lauf-Animation ---
    const phase = z * 11;
    const beinFarbe = tief;
    const beinHebung1 = inLuft ? 0 : Math.max(0, Math.sin(phase)) * 3 * laufen;
    const beinHebung2 = inLuft ? 0 : Math.max(0, -Math.sin(phase)) * 3 * laufen;
    const beinZieher = inLuft ? -1.6 : 0; // in der Luft angezogen
    const beinKurz = inLuft ? 4.2 : 5.6;
    drawPolygon({
        pts: rundeKonturPunkte(9.75 + beinZieher, 33 - beinHebung1, 4, beinKurz + beinHebung1, 2),
        color: beinFarbe,
    });
    drawPolygon({
        pts: rundeKonturPunkte(16.25 - beinZieher, 33 - beinHebung2, 4, beinKurz + beinHebung2, 2),
        color: beinFarbe,
    });

    // --- Koerper: kurzer Gi, leicht trapezfoermig wirken lassen ---
    drawPolygon({ pts: rundeKonturPunkte(5.5, 21.5, 19, 11.5, 3), color: indigo });
    // Streiflicht rechts, Schatten links (Licht von oben rechts)
    drawPolygon({
        pts: [
            { x: 21.5, y: 22 }, { x: 24.5, y: 23 }, { x: 24.5, y: 32.5 }, { x: 20.5, y: 32.5 },
        ],
        color: rgb(...PALETTE.arinLicht),
        opacity: 0.45,
    });
    drawPolygon({
        pts: [
            { x: 5.5, y: 23 }, { x: 8, y: 22.4 }, { x: 8, y: 32.5 }, { x: 5.5, y: 32.5 },
        ],
        color: tief,
        opacity: 0.35,
    });

    // Guertel mit Knoten und heraushängenden Enden
    drawPolygon({ pts: rundeKonturPunkte(5.5, 27.4, 19, 3.4, 1.7), color: gold });
    drawCircle({ pos: vec2(21, 29.1), radius: 2, color: gold });
    const guertelEnd = neuerSammler();
    bandStreifen(
        guertelEnd,
        [
            { x: 20.6, y: 30.4 },
            { x: 21.4 + Math.sin(z * 3) * 0.5, y: 33 },
            { x: 20.8 + Math.sin(z * 3 + 1) * 0.7, y: 35.2 },
        ],
        [1.5, 1.2, 0.9],
        kontur(PALETTE.gold, 0.25)
    );
    zeichneSammler(guertelEnd);

    // --- Aermel + Haende (schwingen gegenphasig zu den Beinen) ---
    const handWip = Math.sin(phase + Math.PI) * 1.6 * laufen;
    drawEllipse({ pos: vec2(7.2, 25.3), radiusX: 2.7, radiusY: 2.3, color: indigo });
    drawCircle({ pos: vec2(6.6, 27 + handWip), radius: 1.9, color: haut });
    drawEllipse({ pos: vec2(22.8, 25.3), radiusX: 2.7, radiusY: 2.3, color: indigo });
    drawCircle({ pos: vec2(23.4, 27 - handWip), radius: 1.9, color: haut });

    // --- Kopf: runde Kapuze mit Licht-Sichel (Carve-Trick) ---
    drawEllipse({ pos: vec2(15, 8), radiusX: 13.5, radiusY: 13, color: indigo });
    drawEllipse({
        pos: vec2(17.5, 6.5), radiusX: 11, radiusY: 10.5,
        color: rgb(...PALETTE.arinLicht), opacity: 0.5,
    });
    drawEllipse({ pos: vec2(14, 10), radiusX: 13.3, radiusY: 12.8, color: indigo });

    // Gesichtsfenster
    drawEllipse({ pos: vec2(15, 12.8), radiusX: 8.6, radiusY: 7, color: haut });
    // sanfte Schattierung am unteren Fensterrand
    drawEllipse({
        pos: vec2(15, 14.6), radiusX: 8.2, radiusY: 5.6,
        color: rgb(...FIGUR_FARBEN.arinHautSchatten), opacity: 0.35,
    });
    drawEllipse({ pos: vec2(15, 12.2), radiusX: 8.4, radiusY: 6.4, color: haut });

    // Grosse freundliche Augen mit Glanzpunkt, Pupillen in Blickrichtung
    for (const ex of [11.8, 18.2]) {
        drawCircle({ pos: vec2(ex + 0.4, 12.8), radius: 1.9, color: tief });
        drawCircle({ pos: vec2(ex, 12.2), radius: 0.75, color: rgb(...PALETTE.wolkeHell) });
    }
    // Rosabacken
    drawEllipse({ pos: vec2(9.3, 15.8), radiusX: 1.8, radiusY: 1.1, color: rgb(...PALETTE.blueteRosa), opacity: 0.55 });
    drawEllipse({ pos: vec2(20.7, 15.8), radiusX: 1.8, radiusY: 1.1, color: rgb(...PALETTE.blueteRosa), opacity: 0.55 });
    // Kleiner Smile
    const mund = neuerSammler();
    bandStreifen(
        mund,
        [{ x: 13.6, y: 16.8 }, { x: 15, y: 17.5 }, { x: 16.4, y: 16.8 }],
        [0.7, 0.7, 0.7],
        kontur(FIGUR_FARBEN.arinHaut, 0.55)
    );
    zeichneSammler(mund);

    // --- Stirnband ueber der Kapuze, leicht geschwungen, mit Knoten ---
    // Band als Flaeche zwischen Ober- und Unterkante (Quad-Streifen)
    const obereKante = [];
    const untereKante = [];
    for (let i = 0; i <= 4; i++) {
        const bx = 2.5 + i * 6.25;
        const woelb = Math.sin((i / 4) * Math.PI) * 0.9;
        obereKante.push({ x: bx, y: 3.2 + woelb });
        untereKante.push({ x: bx, y: 8.2 + woelb });
    }
    const bandFlaeche = neuerSammler();
    for (let i = 0; i < obereKante.length - 1; i++) {
        const o1 = obereKante[i];
        const o2 = obereKante[i + 1];
        const u1 = untereKante[i];
        const u2 = untereKante[i + 1];
        sammleForm(bandFlaeche, [o1, o2, u2], akzent);
        sammleForm(bandFlaeche, [o1, u2, u1], akzent);
    }
    zeichneSammler(bandFlaeche);
    drawCircle({ pos: vec2(3.2, 6.6), radius: 2.1, color: akzent });

    popTransform();
}

// ============================================
// DRACHE — freundlicher Ghibli-Drache
// ============================================
// Runder Plueschkoerper (fast ein Ei), cremefarbene Bauchplatten, grosse
// sanfte Augen, Mini-Fluegel mit Schlag, Hoernchen, sich wiegender
// Schwanz. Bewusst NICHTS glueht — kein Monster, ein Kumpel.
function zeichneDrache(breite, hoehe, opt) {
    opt = opt || {};
    const v = opt.blickrichtung === -1 ? -1 : 1;
    const z = opt.zeit !== undefined ? opt.zeit : time();
    const inLuft = !!opt.inLuft;

    const mx = breite / 38;
    const my = hoehe / 42;

    pushTransform();
    if (v < 0) {
        pushTranslate(breite, 0);
        pushScale(-1, 1);
    }
    pushScale(mx, my);

    const orange = rgb(...PALETTE.dracheOrange);
    const tief = rgb(...PALETTE.dracheTief);
    const bauch = rgb(...PALETTE.dracheBauch);

    if (!inLuft) zeichneKontaktschatten(19, 43.5, 34);

    // --- Eigenkontur um Koerper, Schwanz, Hoerner und Fluegel ---
    const stKontur = kontur(PALETTE.dracheOrange, 0.42);
    const sticker = neuerSammler();
    sammleForm(sticker, ellipsenPunkte(19, 24, 18.8, 19.8, 18), stKontur);
    bandStreifen(
        sticker,
        [
            { x: 7, y: 36 },
            { x: 1, y: 39.5 },
            { x: -5, y: 38.5 + Math.sin(z * 2) * 1.5 },
            { x: -9, y: 34 + Math.sin(z * 2) * 1.5 },
        ],
        [7.2, 6, 4.6, 3.2],
        stKontur
    );
    // Hörner-Spitzen mitdenken (Hörner streichen nach hinten)
    sammleForm(sticker, kreisPunkte(8, 0.8, 3.4, 8), stKontur);
    sammleForm(sticker, kreisPunkte(17.8, 0.6, 3.2, 8), stKontur);
    zeichneSammler(sticker);
    // Fluegel-Aufkleber (rotierter Ellipsen-Blob hinter der Fluegelfläche)
    pushTransform();
    pushTranslate(2.5, 14.5 + Math.sin(z * 4) * 2.5);
    pushRotate(32);
    drawEllipse({ pos: vec2(0, 0), radiusX: 10.5, radiusY: 7, color: stKontur });
    popTransform();

    // --- Kurze, dicke, nach hinten gestrichene Hörnchen (Band-Streifen
    // entlang einer gebogenen Mittellinie, warm getönt — Stummel statt
    // Insekten-Fühler) ---
    const hoerner = neuerSammler();
    const hornTon = rgb(...mische(PALETTE.dracheHorn, PALETTE.dracheOrange, 0.3));
    const hornTief = rgb(...mische(PALETTE.dracheHorn, PALETTE.dracheOrange, 0.12));
    bandStreifen(
        hoerner,
        [{ x: 12.5, y: 6.5 }, { x: 10, y: 3.2 }, { x: 8, y: 0.8 }],
        [3.4, 2.8, 2],
        hornTon
    );
    bandStreifen(
        hoerner,
        [{ x: 21.5, y: 6 }, { x: 19.5, y: 3 }, { x: 17.8, y: 0.6 }],
        [3.1, 2.5, 1.8],
        hornTief
    );
    zeichneSammler(hoerner);
    drawCircle({ pos: vec2(8, 0.8), radius: 1.8, color: hornTon });
    drawCircle({ pos: vec2(17.8, 0.6), radius: 1.6, color: hornTief });

    // --- Fluegel HINTER dem Koerper, an der Hinterkante: kompakt,
    // heller getönt, schräg nach hinten oben ---
    const schlag = Math.sin(z * 4) * (inLuft ? 6 : 3) + (inLuft ? -3 : 0);
    const fluegelTon = rgb(...mische(PALETTE.dracheTief, PALETTE.dracheOrange, 0.4));
    // Hinterer Fluegel als dunklere Andeutung
    drawPolygon({
        pts: [
            vec2(9, 17), vec2(-1, 8 + schlag * 0.8), vec2(-6, 13 + schlag * 0.8),
            vec2(-2, 17.5), vec2(5, 20),
        ],
        color: kontur(PALETTE.dracheTief, 0.28),
    });
    // Vorderer Fluegel mit zwei weichen Scallops (freundlich, nicht
    // zackig wie eine Fledermaus)
    drawPolygon({
        pts: [
            vec2(10, 17.5),
            vec2(0, 7.5 + schlag),
            vec2(-6.5, 13.5 + schlag),
            vec2(-3.5, 17.5 + schlag * 0.4),
            vec2(-0.5, 15.5),
            vec2(1.5, 19),
            vec2(10.5, 22),
        ],
        color: fluegelTon,
        outline: { width: 1.5, color: kontur(PALETTE.dracheTief, 0.3) },
    });

    // --- Schwanz: geschwungener Band-Streifen mit heller Spitze ---
    const schwanzWip = Math.sin(z * 2) * 1.5;
    const schwanz = neuerSammler();
    bandStreifen(
        schwanz,
        [
            { x: 7, y: 36 },
            { x: 1, y: 39.5 },
            { x: -5, y: 38.5 + schwanzWip },
            { x: -9, y: 34 + schwanzWip },
        ],
        [5.5, 4.3, 3, 1.6],
        orange
    );
    zeichneSammler(schwanz);
    drawCircle({ pos: vec2(-9, 34 + schwanzWip), radius: 2.6, color: bauch });

    // --- Koerper: Ei-foermige Plueschform mit Wertstufen ---
    drawEllipse({ pos: vec2(19, 24), radiusX: 17, radiusY: 18, color: orange });
    // Schatten unten links (Carve-Trick)
    drawEllipse({ pos: vec2(15.5, 27), radiusX: 16, radiusY: 17, color: tief, opacity: 0.25 });
    drawEllipse({ pos: vec2(18.5, 24.5), radiusX: 16.6, radiusY: 17.6, color: orange });
    // Streiflicht oben rechts
    drawEllipse({ pos: vec2(21.5, 20), radiusX: 13.5, radiusY: 14.5, color: rgb(...PALETTE.dracheLicht), opacity: 0.5 });
    drawEllipse({ pos: vec2(18.5, 23), radiusX: 16.4, radiusY: 17.4, color: orange });

    // Cremefarbener Bauch mit zwei Platten-Bogen
    drawEllipse({ pos: vec2(17, 29.5), radiusX: 10.5, radiusY: 10.8, color: bauch });
    const platten = neuerSammler();
    const plattenFarbe = kontur(PALETTE.dracheBauch, 0.3);
    bandStreifen(platten, [{ x: 8.5, y: 27.5 }, { x: 17, y: 28.8 }, { x: 25, y: 27.2 }], [0.9, 0.9, 0.9], plattenFarbe);
    bandStreifen(platten, [{ x: 9.5, y: 33.5 }, { x: 17, y: 34.8 }, { x: 24, y: 33.2 }], [0.9, 0.9, 0.9], plattenFarbe);
    zeichneSammler(platten);

    // --- Stummelmaeulchen mit Nuestern und Smile ---
    drawEllipse({ pos: vec2(32.5, 21), radiusX: 5.8, radiusY: 4.6, color: orange });
    drawCircle({ pos: vec2(34.6, 20.2), radius: 0.75, color: kontur(PALETTE.dracheHorn, 0.3) });
    drawCircle({ pos: vec2(32.4, 19.4), radius: 0.75, color: kontur(PALETTE.dracheHorn, 0.3) });
    const mund = neuerSammler();
    bandStreifen(mund, [{ x: 30.5, y: 25 }, { x: 33, y: 25.8 }, { x: 35.5, y: 24.9 }], [0.8, 0.8, 0.8], kontur(PALETTE.dracheHorn, 0.25));
    zeichneSammler(mund);

    // Rosabacken
    drawEllipse({ pos: vec2(27.8, 19.3), radiusX: 2.4, radiusY: 1.4, color: rgb(...PALETTE.blueteRosa), opacity: 0.5 });
    drawEllipse({ pos: vec2(34, 19.8), radiusX: 1.3, radiusY: 0.9, color: rgb(...PALETTE.blueteRosa), opacity: 0.4 });

    // --- Grosse sanfte Augen (weiss / warmbraun / Glanzpunkt) ---
    const iris = rgb(...mische(PALETTE.dracheHorn, PALETTE.wolkeHell, 0.3));
    for (const e of [
        { x: 21, y: 12.5 },
        { x: 28, y: 13.5 },
    ]) {
        drawCircle({ pos: vec2(e.x, e.y), radius: 4, color: rgb(...PALETTE.wolkeHell) });
        drawCircle({ pos: vec2(e.x + 0.7, e.y + 0.2), radius: 2.5, color: iris });
        drawCircle({ pos: vec2(e.x + 0.8, e.y + 0.3), radius: 1.3, color: kontur(PALETTE.dracheHorn, 0.45) });
        drawCircle({ pos: vec2(e.x - 0.4, e.y - 1.2), radius: 1, color: rgb(...PALETTE.wolkeHell) });
    }

    popTransform();
}

// ============================================
// GEIST — lila Waldgeist (Gegner)
// ============================================
// Ersetzt den grauen Block: rundes Flausch-Tuch mit welliger Unterkante,
// stubby Fuesschen, schlafig-grimmige Glut-Augen (bleiben Lesbarkeits-
// signal "Gegner"), Blaettchen auf dem Kopf, sanftes Schweb-Bobbing.
function zeichneGeist(breite, hoehe, opt) {
    opt = opt || {};
    const v = opt.blickrichtung === -1 ? -1 : 1;
    const z = opt.zeit !== undefined ? opt.zeit : time();

    const mx = breite / 32;
    const my = hoehe / 32;

    pushTransform();
    if (v < 0) {
        pushTranslate(breite, 0);
        pushScale(-1, 1);
    }
    pushScale(mx, my);

    const lila = rgb(...FIGUR_FARBEN.geistLila);
    const lilaTief = rgb(...FIGUR_FARBEN.geistLilaTief);

    zeichneKontaktschatten(16, 31.5, 28);

    // Sanftes Schweb-Bobbing (Kontaktschatten bleibt am Boden)
    pushTranslate(0, Math.sin(z * 2.2) * 1.8);

    // --- Eigenkontur: aufgeblaehte Blob-Form hinter dem Koerper ---
    const stKontur = kontur(FIGUR_FARBEN.geistLila, 0.4);
    drawPolygon({ pts: geistBlobPunkte(16, 15, 15.6, 1), color: stKontur });

    // --- Stubby Fuesschen mit Watscheln ---
    const watschel = Math.sin(z * 7);
    drawEllipse({ pos: vec2(11, 29.6 - watschel * 0.8), radiusX: 3, radiusY: 2, color: lilaTief });
    drawEllipse({ pos: vec2(21, 29.6 + watschel * 0.8), radiusX: 3, radiusY: 2, color: lilaTief });

    // --- Koerper: Flausch-Blob mit welliger Unterkante ---
    drawPolygon({ pts: geistBlobPunkte(16, 15, 14, 1), color: lila });
    // Schatten unten links (Carve)
    drawEllipse({ pos: vec2(13, 18), radiusX: 12, radiusY: 11.5, color: lilaTief, opacity: 0.25 });
    drawEllipse({ pos: vec2(15.5, 15.5), radiusX: 13, radiusY: 12.5, color: lila });
    // Streiflicht oben rechts
    drawEllipse({ pos: vec2(19, 11), radiusX: 10, radiusY: 9.5, color: rgb(...FIGUR_FARBEN.geistLilaLicht), opacity: 0.5 });
    drawEllipse({ pos: vec2(16, 14), radiusX: 13.2, radiusY: 12.7, color: lila });

    // --- Schlafig-grimmige Glut-Augen (halblidig) ---
    for (const ex of [11.5, 20.5]) {
        drawEllipse({ pos: vec2(ex, 13), radiusX: 3, radiusY: 2.3, color: rgb(...PALETTE.wolkeHell) });
        // Lid: obere Haelfte in Koerperfarbe -> schlafig
        drawEllipse({ pos: vec2(ex, 11.7), radiusX: 3.3, radiusY: 1.8, color: lila });
        zeichneGluehen(vec2(ex, 13.8), 1.4, PALETTE.gegnerGlut);
        drawCircle({ pos: vec2(ex, 13.8), radius: 0.7, color: rgb(...PALETTE.tintenbraun) });
    }

    // Knuffmund (kleines Grummeln) + Rosabacken
    const mund = neuerSammler();
    bandStreifen(
        mund,
        [{ x: 14.3, y: 19 }, { x: 16, y: 18.4 }, { x: 17.7, y: 19 }],
        [0.7, 0.7, 0.7],
        kontur(FIGUR_FARBEN.geistLilaTief, 0.45)
    );
    zeichneSammler(mund);
    drawEllipse({ pos: vec2(8.7, 16.5), radiusX: 1.9, radiusY: 1.1, color: rgb(...PALETTE.blueteRosa), opacity: 0.4 });
    drawEllipse({ pos: vec2(23.3, 16.5), radiusX: 1.9, radiusY: 1.1, color: rgb(...PALETTE.blueteRosa), opacity: 0.4 });

    // --- Blaettchen auf dem Kopf (kodama-Anklang), wiegt im Wind ---
    const schwank = Math.sin(z * 3);
    const stiel = neuerSammler();
    bandStreifen(stiel, [{ x: 16, y: 2 }, { x: 16 + schwank * 0.5, y: -2.5 }], [1, 0.8], rgb(...PALETTE.grasDunkel));
    zeichneSammler(stiel);
    pushTransform();
    pushTranslate(16 + schwank * 0.5, -2.5);
    pushRotate(-30 + schwank * 6);
    drawEllipse({ pos: vec2(2.4, 0), radiusX: 3.1, radiusY: 1.5, color: rgb(...PALETTE.grasHell) });
    const rippe = neuerSammler();
    bandStreifen(rippe, [{ x: -0.4, y: 0 }, { x: 5, y: 0 }], [0.4, 0.4], rgb(...PALETTE.grasDunkel));
    zeichneSammler(rippe);
    popTransform();

    popTransform();
}

// ============================================
// VORSCHAUEN (Auswahl-Bildschirm)
// ============================================
// Dieselben Figuren, vergroessert und zentriert, mit Atem-Idle.

function zeichneArinVorschau(mx, my, skalierung) {
    pushTransform();
    pushTranslate(mx, my);
    const at = atem(skalierung);
    pushScale(at, at);
    pushTranslate(-15, -18);
    zeichneArin(30, 38, { zeit: time(), laufen: 0 });
    popTransform();
}

function zeichneDracheVorschau(mx, my, skalierung) {
    pushTransform();
    pushTranslate(mx, my);
    const at = atem(skalierung);
    pushScale(at, at);
    pushTranslate(-19, -20);
    zeichneDrache(38, 42, { zeit: time() });
    popTransform();
}
