let plateau = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 }, () => [" ", ""])
);

["T", "C", "F", "D", "R", "F", "C", "T"].forEach((piece, i) => {
  plateau[0][i] = [piece, "N"];
  plateau[7][i] = [piece, "B"];
});

for (let i = 0; i < 8; i++) {
  plateau[1][i] = ["P", "N"];
  plateau[6][i] = ["P", "B"];
}

function draw_plateau(plateau) {
  for (let i = 0; i < 8; i++) {
    console.log(plateau[i]);
  }
}

const pieceMap = {
  "P": "p", // pion
  "T": "r", // tour
  "C": "n", // cavalier
  "F": "b", // fou
  "D": "q", // dame
  "R": "k", // roi
};

function afficherPlateau(plateau, colorier_x = null, colorier_y = null, colorier_x2 = null, colorier_y2 = null, colorier_x3 = null, colorier_y3 = null) {
  const echiquier = document.getElementById("echiquier");

  // Supprime les anciennes pièces et surbrillances
  document.querySelectorAll(".piece").forEach(el => el.remove());
  document.querySelectorAll(".surbrillance").forEach(el => el.remove());
  const anciensPoints = document.querySelectorAll(".dot-plein, .dot-cercle");
  anciensPoints.forEach(dot => dot.remove());
  // Fonction pour ajouter une case jaune
  function colorierCase(x, y) {
    if (x !== null && y !== null) {
      const div = document.createElement("div");
      div.classList.add("surbrillance");
      div.style.top = `${x * 80}px`;
      div.style.left = `${y * 80}px`;
      echiquier.appendChild(div);
    }
  }

  // Ajoute les cases jaune
  colorierCase(colorier_y, colorier_x);
  colorierCase(colorier_y2, colorier_x2);
  colorierCase(colorier_y3, colorier_x3);

  // Ajoute les pièces
  for (let ligne = 0; ligne < 8; ligne++) {
    for (let col = 0; col < 8; col++) {
      const [pieceFr, couleur] = plateau[ligne][col];

      if (pieceFr !== " ") {
        const img = document.createElement("img");
        img.classList.add("piece");

        const pieceEn = pieceMap[pieceFr];
        const colorCode = couleur === "N" ? "b" : "w";

        img.src = `Pieces/${colorCode}${pieceEn}.png`;
        img.style.top = `${ligne * 80}px`;
        img.style.left = `${col * 80}px`;

        echiquier.appendChild(img);
      }
    }
  }
}
function afficherDot(
  plateau,
  n_case_1,
  l_case_1,
  joueur,
  is_en_passant_possible,
  en_passant_colonne,
  is_rock_possible,
  legal_cases_no_echecs_liste_copy = null,
  ne_pas_calculer_cases = 0

) {
  const anciensPoints = document.querySelectorAll(".dot-plein, .dot-cercle");
  anciensPoints.forEach(dot => dot.remove());
  if (ne_pas_calculer_cases === 0){
  const legalCases = liste_moov(
    plateau,
    n_case_1,
    l_case_1,
    joueur,
    is_en_passant_possible,
    en_passant_colonne,
    is_rock_possible
  );}
  else{
    legalCases = legal_cases_no_echecs_liste_copy
  }
  console.log(legalCases)
  legalCases.forEach(([row, col]) => {
    const x = col;
    const y = row;

    const div = document.createElement("div");

    const isEmpty = plateau[row][col][0] === " " && plateau[row][col][1] === "";

    if (isEmpty) {
      div.classList.add("dot-plein"); // case vide
      div.style.top = `${y * 80 + 25}px`; // ajusté pour centrer
      div.style.left = `${x * 80 + 25}px`;
    } else {
      div.classList.add("dot-cercle"); // pièce à capturer
      div.style.top = `${y * 80 }px`; // ajusté pour centrer
      div.style.left = `${x * 80}px`;
    }

    

    echiquier.appendChild(div);
  });
}
function afficher_resultat_fin_partie(plateau, resultat, joueur) {
  setTimeout(() => {
    let roiBlancPos = null;
    let roiNoirPos = null;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const [piece, couleur] = plateau[i][j];
        if (piece === "R") {
          if (couleur === "B") roiBlancPos = [i, j];
          else if (couleur === "N") roiNoirPos = [i, j];
        }
      }
    }

    if (!roiBlancPos || !roiNoirPos) {
      console.error("Erreur : roi blanc ou noir introuvable.");
      return;
    }

    // Nettoyer les anciennes images
    const echiquier = document.getElementById("echiquier");
    echiquier.querySelectorAll(".resultat-image").forEach(img => img.remove());

    const noms = {
      victoire: "gagnant.png",
      defaite: "perdant.png",
      nul: "nul - Copie.png"
    };

    function afficherImageDansCase(i, j, src) {
      const img = document.createElement("img");
      img.src = `Pieces/${src}`;
      img.classList.add("resultat-image");
      img.style.position = "absolute";
      img.style.width = "80px";
      img.style.height = "80px";

      const caseSize = 80;
      let x = j * caseSize + caseSize * 0.5;
      let y = i * caseSize - caseSize * 0.5;

      if (y < 0) y = -26;
      if (x > 682) x = 664;

      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      img.style.zIndex = 10;
      img.style.pointerEvents = "none";

      echiquier.appendChild(img);
    }

    if (resultat === 1) {
      // Match nul → image sur les 2 rois
      [roiBlancPos, roiNoirPos].forEach(([i, j]) => {
        afficherImageDansCase(i, j, noms.nul);
      });
    } else {
      const gagnant = joueur;
      const perdant = joueur === "B" ? "N" : "B";
      const positions = { B: roiBlancPos, N: roiNoirPos };

      const [gi, gj] = positions[gagnant];
      const [pi, pj] = positions[perdant];

      afficherImageDansCase(gi, gj, noms.victoire);
      afficherImageDansCase(pi, pj, noms.defaite);
    }
  }, 100);
}



function is_legal_pion(plateau, n_case_1, l_case_1, n_case_2, l_case_2, is_en_passant_possible, en_passant_collone) {
    if (plateau[n_case_1][l_case_1][1] === "B") { // Pion blanc

        if (n_case_1 - n_case_2 === 1 && l_case_1 === l_case_2) { // Avance d'une case
            if (plateau[n_case_2][l_case_2][0] !== " ") { // Case suivante pleine
                return false;
            }
        } else if (n_case_2 === 4 && l_case_1 === l_case_2 && n_case_1 === 6) { // Avance de 2 cases
            if (!(plateau[n_case_2][l_case_2][0] === " " && plateau[n_case_2 + 1][l_case_2][0] === " ")) { // Cases pleines
                return false;
            }
        } else if (n_case_1 - n_case_2 === 1 && (l_case_2 - l_case_1 === 1 || l_case_2 - l_case_1 === -1)) { // Diagonale
            if (is_en_passant_possible && n_case_1 === 3 && l_case_2 === en_passant_collone) { // En passant
                return true;
            } else if (plateau[n_case_2][l_case_2][0] === " ") { // Case en diagonale vide
                return false;
            }
        } else {
            return false;
        }

    } else { // Pion noir

        if (n_case_2 - n_case_1 === 1 && l_case_1 === l_case_2) { // Avance d'une case
            if (!(plateau[n_case_2][l_case_2][0] === " ")) { // Case suivante pleine
                return false;
            }
        } else if (n_case_2 - n_case_1 === 2 && l_case_1 === l_case_2) { // Avance de 2 cases
            if (!(plateau[n_case_2][l_case_2][0] === " " && plateau[n_case_2 - 1][l_case_2][0] === " ")) {
                return false;
            }
        } else if (n_case_2 - n_case_1 === 1 && (l_case_2 - l_case_1 === 1 || l_case_2 - l_case_1 === -1)) { // Diagonale
            if (is_en_passant_possible && n_case_1 === 4 && l_case_2 === en_passant_collone) { // En passant
                return true;
            } else if (plateau[n_case_2][l_case_2][0] === " ") { // Case en diagonale vide
                return false;
            }
        } else {
            return false;
        }
    }

    return true;
}
function is_legal_tour(plateau, n_case_1, l_case_1, n_case_2, l_case_2) {
    let cases;

    if (n_case_1 === n_case_2) {
        cases = plateau[n_case_1].slice(
            Math.min(l_case_1, l_case_2) + 1,
            Math.max(l_case_1, l_case_2)
        );
    } else if (l_case_1 === l_case_2) {
        cases = [];
        for (let i = Math.min(n_case_1, n_case_2) + 1; i < Math.max(n_case_1, n_case_2); i++) {
            cases.push(plateau[i][l_case_1]);
        }
    } else {
        return false;
    }

    return cases.every(case_ => case_[0] === " ");
}


function is_legal_fou(plateau, n_case_1, l_case_1, n_case_2, l_case_2) {
    if (Math.abs(n_case_1 - n_case_2) !== Math.abs(l_case_1 - l_case_2)) {
        return false; // Pas un mouvement diagonal
    }

    const step_n = n_case_2 > n_case_1 ? 1 : -1;
    const step_l = l_case_2 > l_case_1 ? 1 : -1;

    for (let i = 1; i < Math.abs(n_case_1 - n_case_2); i++) {
        if (plateau[n_case_1 + i * step_n][l_case_1 + i * step_l][0] !== " ") {
            return false;
        }
    }

    return true;
}
function is_legal_roi(plateau, n_case_1, l_case_1, n_case_2, l_case_2, joueur, is_rock_possible) {
    if (joueur === "B") {
        if (is_rock_possible[3] === true &&
            l_case_1 - l_case_2 === 2 &&
            n_case_2 === 7 &&
            plateau[7][l_case_1 - 1][0] === " " &&
            plateau[7][l_case_1 - 2][0] === " " &&
            plateau[7][l_case_1 - 3][0] === " ") {
            return true;
        }
        if (is_rock_possible[2] === true &&
            l_case_2 - l_case_1 === 2 &&
            n_case_2 === 7 &&
            plateau[7][l_case_1 + 1][0] === " " &&
            plateau[7][l_case_1 + 2][0] === " ") {
            return true;
        }
    } else {
        if (is_rock_possible[0] === true &&
            l_case_1 - l_case_2 === 2 &&
            n_case_2 === 0 &&
            plateau[0][l_case_1 - 1][0] === " " &&
            plateau[0][l_case_1 - 2][0] === " " &&
            plateau[0][l_case_1 - 3][0] === " ") {
            return true;
        }
        if (is_rock_possible[1] === true &&
            l_case_2 - l_case_1 === 2 &&
            n_case_2 === 0 &&
            plateau[0][l_case_1 + 1][0] === " " &&
            plateau[0][l_case_1 + 2][0] === " ") {
            return true;
        }
    }

    if (Math.abs(n_case_1 - n_case_2) > 1 || Math.abs(l_case_1 - l_case_2) > 1) {
        return false;
    }

    return true;
}
function is_legal_cavalier(n_case_1, l_case_1, n_case_2, l_case_2) {
    if (!(
        (Math.abs(n_case_2 - n_case_1) === 2 && Math.abs(l_case_2 - l_case_1) === 1) ||
        (Math.abs(n_case_2 - n_case_1) === 1 && Math.abs(l_case_2 - l_case_1) === 2)
    )) {
        return false;
    }
    return true;
}
function is_legal(plateau, n_case_1, l_case_1, n_case_2, l_case_2, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible, check_eat) {
    if (
        plateau[n_case_1][l_case_1][0] === " " ||
        plateau[n_case_1][l_case_1][1] === plateau[n_case_2][l_case_2][1] ||
        plateau[n_case_1][l_case_1][1] !== joueur ||
        (n_case_1 === n_case_2 && l_case_1 === l_case_2) ||
        (!check_eat && plateau[n_case_2][l_case_2][0] !== " ") ||
        (plateau[n_case_1][l_case_1][0] === "P" && !is_legal_pion(plateau, n_case_1, l_case_1, n_case_2, l_case_2, is_en_passant_possible, en_passant_collone)) ||
        (plateau[n_case_1][l_case_1][0] === "T" && !is_legal_tour(plateau, n_case_1, l_case_1, n_case_2, l_case_2)) ||
        (plateau[n_case_1][l_case_1][0] === "F" && !is_legal_fou(plateau, n_case_1, l_case_1, n_case_2, l_case_2)) ||
        (plateau[n_case_1][l_case_1][0] === "D" &&
            !is_legal_tour(plateau, n_case_1, l_case_1, n_case_2, l_case_2) &&
            !is_legal_fou(plateau, n_case_1, l_case_1, n_case_2, l_case_2)) ||
        (plateau[n_case_1][l_case_1][0] === "R" &&
            !is_legal_roi(plateau, n_case_1, l_case_1, n_case_2, l_case_2, joueur, is_rock_possible)) ||
        (plateau[n_case_1][l_case_1][0] === "C" &&
            !is_legal_cavalier(n_case_1, l_case_1, n_case_2, l_case_2))
    ) {
        return false;
    }

    return true;
}
async function move(plateau, x_case, y_case, second_time, n_case_1, l_case_1, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible) {
    let legal_cases_no_echecs_liste_copy = liste_moov(plateau, n_case_1, l_case_1, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible);
    let good_second_selected_case = false;
    
    while (!good_second_selected_case) {
        if (second_time === true) {
            afficherDot(plateau,n_case_1,l_case_1,joueur,is_en_passant_possible,en_passant_colonne,is_rock_possible,legal_cases_no_echecs_liste_copy,1)}
        await new Promise(resolve => {
        const echiquier = document.getElementById("echiquier");

        function handleClick(event) {
            const rect = echiquier.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Calcule x_case et y_case selon 80px par case
            x_case = Math.floor(x / 80);
            y_case = Math.floor(y / 80);

            echiquier.removeEventListener("click", handleClick);
            resolve();
        }

        echiquier.addEventListener("click", handleClick);
        });

        if (second_time === true) {
            //for (let legals_cases of legal_cases_no_echecs_liste_copy) {
                // Pass — afficher les cases possibles si tu veux
            //}

            if (
                legal_cases_no_echecs_liste_copy.some(
                ([y, x]) => y === y_case && x === x_case
                    ) ||
                (y_case === n_case_1 && x_case === l_case_1) ||
                plateau[y_case][x_case][1] === joueur
            ) {
                
                good_second_selected_case = true;
            }
            else {
                good_second_selected_case = false;
            }
        } else {
            good_second_selected_case = true;
        }
    }

    return [x_case, y_case, legal_cases_no_echecs_liste_copy];
}
function is_echecs(plateau, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible, invert_joueur = false) {
    if (invert_joueur === true) {
        joueur = (joueur === "N") ? "B" : "N";
    }

    let coord_roi = [];

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (plateau[i][j][0] === "R" && plateau[i][j][1] !== joueur) {
                coord_roi = [i, j];
            }
        }
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (is_legal(plateau, i, j, coord_roi[0], coord_roi[1], joueur, is_en_passant_possible, en_passant_collone, is_rock_possible, true)) {
                return true;
            }
        }
    }

    return false;
}
function liste_moov(plateau, n_case_1, l_case_1, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible) {
    let legal_cases_no_echecs_liste = [];

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (is_legal(plateau, n_case_1, l_case_1, i, j, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible, true)) {
                legal_cases_no_echecs_liste.push([i, j]);
            }
        }
    }

    let legal_cases_no_echecs_liste_copy = legal_cases_no_echecs_liste.map(row => [...row]);
    console.log(legal_cases_no_echecs_liste_copy)
    if (plateau[n_case_1][l_case_1][0] === "R" && plateau[n_case_1][l_case_1][1] === joueur && is_echecs(plateau, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible)) {
        for (let legals_cases of legal_cases_no_echecs_liste_copy) {
            if (legals_cases[1] === l_case_1 + 2 || legals_cases[1] === l_case_1 - 2) {
                legal_cases_no_echecs_liste = legal_cases_no_echecs_liste.filter(c => !(c[0] === legals_cases[0] && c[1] === legals_cases[1]));
            }
        }
    }

    for (let legals_cases of legal_cases_no_echecs_liste) {
        let plateau_temp = plateau.map(row => row.map(cell => [...cell]));

        if (is_en_passant_possible === true && n_case_1 === 3 && legals_cases[1] === en_passant_collone && plateau_temp[n_case_1][l_case_1][0] === "P" && joueur === "B") {
            plateau_temp[n_case_1][legals_cases[1]] = [" ", ""];
        }
        if (is_en_passant_possible === true && n_case_1 === 4 && legals_cases[1] === en_passant_collone && plateau_temp[n_case_1][l_case_1][0] === "P" && joueur === "N") {
            plateau_temp[n_case_1][legals_cases[1]] = [" ", ""];
        }

        if (joueur === "B") {
            if (plateau_temp[n_case_1][l_case_1][0] === "R" && l_case_1 - legals_cases[1] === 2) {
                plateau_temp[7][0] = [" ", ""];
                plateau_temp[7][3] = ["T", "B"];
            }
            if (plateau_temp[n_case_1][l_case_1][0] === "R" && legals_cases[1] - l_case_1 === 2) {
                plateau_temp[7][7] = [" ", ""];
                plateau_temp[7][5] = ["T", "B"];
            }
        } else {
            if (plateau_temp[n_case_1][l_case_1][0] === "R" && l_case_1 - legals_cases[1] === 2) {
                plateau_temp[0][0] = [" ", ""];
                plateau_temp[0][3] = ["T", "N"];
            }
            if (plateau_temp[n_case_1][l_case_1][0] === "R" && legals_cases[1] - l_case_1 === 2) {
                plateau_temp[0][7] = [" ", ""];
                plateau_temp[0][5] = ["T", "N"];
            }
        }

        plateau_temp[legals_cases[0]][legals_cases[1]] = plateau_temp[n_case_1][l_case_1];
        plateau_temp[n_case_1][l_case_1] = [" ", ""];

        let invert_joueur = (joueur === "N") ? "B" : "N";

        if (is_echecs(plateau_temp, invert_joueur, is_en_passant_possible, en_passant_collone, is_rock_possible)) {
            legal_cases_no_echecs_liste_copy = legal_cases_no_echecs_liste_copy.filter(c => !(c[0] === legals_cases[0] && c[1] === legals_cases[1]));

            if (plateau[n_case_1][l_case_1][0] === "R" && plateau[n_case_1][l_case_1][1] === joueur) {
                if (
                    legal_cases_no_echecs_liste_copy.some(c => c[0] === legals_cases[0] && c[1] === legals_cases[1] - 1) &&
                    n_case_1 === legals_cases[0]
                ) {
                    legal_cases_no_echecs_liste_copy = legal_cases_no_echecs_liste_copy.filter(c => !(c[0] === legals_cases[0] && c[1] === legals_cases[1] - 1));
                }

                if (
                    legal_cases_no_echecs_liste_copy.some(c => c[0] === legals_cases[0] && c[1] === legals_cases[1] + 1) &&
                    n_case_1 === legals_cases[0]
                ) {
                    legal_cases_no_echecs_liste_copy = legal_cases_no_echecs_liste_copy.filter(c => !(c[0] === legals_cases[0] && c[1] === legals_cases[1] + 1));
                }
            }
        }
    }

    return legal_cases_no_echecs_liste_copy;
}
function can_moov(plateau, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible) {
    let liste_pieces_joueur = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (plateau[i][j][1] === joueur) {
                liste_pieces_joueur.push([i, j]);
            }
        }
    }
    for (let pieces of liste_pieces_joueur) {
        if (liste_moov(plateau, pieces[0], pieces[1], joueur, is_en_passant_possible, en_passant_collone, is_rock_possible).length !== 0) {
            return true;
        }
    }
    return false;
}
function promotion() {
    let pieces = ["D", "F", "T", "C"];
    let piece = prompt("rang dans les pieces ['D','F','T','C']  :");
    // Convertir la saisie en nombre et vérifier validité
    let index = parseInt(piece, 10);
    if (isNaN(index) || index < 0 || index >= pieces.length) {
        return null; // ou tu peux relancer la demande ou gérer l'erreur autrement
    }
    return pieces[index];
}
function est_nulle_par_manque_de_materiel(liste_blanc, liste_noire) {
    // Comparaison simple des objets en JS nécessite une fonction de comparaison
    function equals(obj1, obj2) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) return false;
        for (let key of keys1) {
            if (obj1[key] !== obj2[key]) return false;
        }
        return true;
    }

    if (equals(liste_blanc, {R:1, D:0, P:0, F:0, C:0, T:0}) && equals(liste_noire, {R:1, D:0, P:0, F:0, C:0, T:0})) {
        return true;
    }

    if ((equals(liste_blanc, {R:1, D:0, P:0, F:1, C:0, T:0}) && equals(liste_noire, {R:1, D:0, P:0, F:0, C:0, T:0})) ||
        (equals(liste_noire, {R:1, D:0, P:0, F:1, C:0, T:0}) && equals(liste_blanc, {R:1, D:0, P:0, F:0, C:0, T:0}))) {
        return true;
    }

    if ((equals(liste_blanc, {R:1, D:0, P:0, F:0, C:1, T:0}) && equals(liste_noire, {R:1, D:0, P:0, F:0, C:0, T:0})) ||
        (equals(liste_noire, {R:1, D:0, P:0, F:0, C:1, T:0}) && equals(liste_blanc, {R:1, D:0, P:0, F:0, C:0, T:0}))) {
        return true;
    }

    const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

    if (liste_blanc.F === 1 && liste_noire.F === 1 && sumValues(liste_blanc) === 2 && sumValues(liste_noire) === 2) {
        return true;
    }

    return false;
}
let joueur = "B";
let x_case = 0;
let y_case = 0;

let is_en_passant_possible = false;
let en_passant_collone = 0;
// [haut gauche, haut droite, bas droite, bas gauche]
let is_rock_possible = [true, true, true, true];
let legal_cases_no_echecs_liste_copy = [];
let n_case_2;
let l_case_2;
let en_passant_colonne = 0;
afficherPlateau(plateau);
draw_plateau(plateau)
let last_two_cases = [[0,0],[0,0]]
let first_play = true
async function gameLoop() {
let end_game = false;
while (end_game === false) {
    
    let good_second_case = false;

    while (good_second_case === false) {
        var n_case_1 = 0;
        var l_case_1 = 0;
        if (joueur === "B") {
            console.log("Au blancs de jouer");
        } else {
            console.log("Au noirs de jouer");
        }

        let good_selected_case = false;
        while (!good_selected_case) {
            if (first_play){
                afficherPlateau(plateau)}
            else{
                afficherPlateau(plateau, null, null, last_two_cases[0][0], last_two_cases[0][1], last_two_cases[1][0], last_two_cases[1][1])}
            let result = await move(plateau, x_case, y_case, false, 0, 0, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible);
            
            y_case_ = result[1];
            n_case_1 = result[1];
            x_case_ = result[0];
            l_case_1 = result[0];
            
            y_case = y_case_;
            x_case = x_case_;
            
            if (plateau[n_case_1][l_case_1][0] !== " " && plateau[n_case_1][l_case_1][1] === joueur) {
                good_selected_case = true;
            }
            console.log("case sélectionée : ", x_case, " ", y_case);
            
        }
        if (first_play) {
            afficherPlateau(plateau, x_case, y_case);
            } else {
            afficherPlateau(plateau,x_case,y_case,last_two_cases[0][0],last_two_cases[0][1],last_two_cases[1][0],last_two_cases[1][1]);
            }
        let selected_same_color = true;
        while (selected_same_color === true) {
            if (first_play) {
                afficherPlateau(plateau, x_case, y_case);
                } else {
                afficherPlateau(plateau,x_case,y_case,last_two_cases[0][0],last_two_cases[0][1],last_two_cases[1][0],last_two_cases[1][1]);
                }
            //afficherDot(plateau,n_case_1,l_case_1,joueur,is_en_passant_possible,en_passant_colonne,is_rock_possible)
            let result = await move(plateau, x_case, y_case, true, n_case_1, l_case_1, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible);
            y_case_ = result[1];
            n_case_2 = result[1];
            x_case_ = result[0];
            l_case_2 = result[0];
            legal_cases_no_echecs_liste_copy = result[2];

            y_case = y_case_;
            x_case = x_case_;

            if (plateau[y_case][x_case][1] !== joueur || (y_case === n_case_1 && x_case === l_case_1)) {
                selected_same_color = false;
            } else {
                n_case_1 = y_case;
                l_case_1 = x_case;
            }

            for (const i of legal_cases_no_echecs_liste_copy) {
                // comparer deux tableaux en JS (ici par contenu)
                if (i[0] === y_case && i[1] === x_case) {
                    good_second_case = true;
                }
            }
        }
         if (first_play) {
            afficherPlateau(plateau, x_case, y_case);
            } 
            else {
            afficherPlateau(plateau,x_case,y_case,last_two_cases[0][0],last_two_cases[0][1],last_two_cases[1][0],last_two_cases[1][1]);
            }
    }
    if ((is_en_passant_possible === true && n_case_1 === 3 && l_case_2 === en_passant_collone && plateau[n_case_1][l_case_1][0] === "P" && joueur === "B") ||
    (is_en_passant_possible === true && n_case_1 === 4 && l_case_2 === en_passant_collone && plateau[n_case_1][l_case_1][0] === "P" && joueur === "N")) {
    plateau[n_case_1][l_case_2] = [" ", ""];
}

if (joueur === "B") {
    if (plateau[n_case_1][l_case_1][0] === "P" && n_case_1 - n_case_2 === 2) {  // En passant
        is_en_passant_possible = true;
        en_passant_collone = l_case_1;
    } else {
        is_en_passant_possible = false;
    }

    if (plateau[n_case_1][l_case_1][0] === "R") { // Roque
        is_rock_possible[2] = false;
        is_rock_possible[3] = false;
    }

    if ((plateau[n_case_1][l_case_1][0] === "R" && n_case_1 === 7 && l_case_1 === 0) || (n_case_2 === 7 && l_case_2 === 0)) {
        is_rock_possible[3] = false;
    }

    if ((plateau[n_case_1][l_case_1][0] === "R" && n_case_1 === 7 && l_case_1 === 7) || (n_case_2 === 7 && l_case_2 === 7)) {
        is_rock_possible[2] = false;
    }

    if (plateau[n_case_1][l_case_1][0] === "R" && l_case_1 - l_case_2 === 2) {
        plateau[7][0] = [" ", ""];
        plateau[7][3] = ["T", "B"];
    }

    if (plateau[n_case_1][l_case_1][0] === "R" && l_case_2 - l_case_1 === 2) {
        plateau[7][7] = [" ", ""];
        plateau[7][5] = ["T", "B"];
    }
} else {
    if (plateau[n_case_1][l_case_1][0] === "P" && n_case_2 - n_case_1 === 2) {
        is_en_passant_possible = true;
        en_passant_collone = l_case_1;
    } else {
        is_en_passant_possible = false;
    }

    if (plateau[n_case_1][l_case_1][0] === "R") { // Roque
        is_rock_possible[0] = false;
    }
    if ((plateau[n_case_1][l_case_1][0] === "R" && n_case_1 === 0 && l_case_1 === 0) || (n_case_2 === 0 && l_case_2 === 0)) {
        is_rock_possible[0] = false;
    }
    if ((plateau[n_case_1][l_case_1][0] === "R" && n_case_1 === 0 && l_case_1 === 7) || (n_case_2 === 0 && l_case_2 === 7)) {
        is_rock_possible[1] = false;
    }

    if (plateau[n_case_1][l_case_1][0] === "R" && l_case_1 - l_case_2 === 2) {
        plateau[0][0] = [" ", ""];
        plateau[0][3] = ["T", "N"];
    }

    if (plateau[n_case_1][l_case_1][0] === "R" && l_case_2 - l_case_1 === 2) {
        plateau[0][7] = [" ", ""];
        plateau[0][5] = ["T", "N"];
    }
}
// Déplacement de la pièce sur le plateau
plateau[n_case_2][l_case_2] = plateau[n_case_1][l_case_1];
plateau[n_case_1][l_case_1] = [" ", ""];

// Promotion si un pion arrive sur la dernière rangée
if (plateau[0][l_case_2][0] === "P" || plateau[7][l_case_2][0] === "P") {
    plateau[n_case_2][l_case_2] = promotion(joueur);
}

// Changement de joueur
joueur = (joueur === "B") ? "N" : "B";

// Vérification si le joueur peut encore bouger
if (can_moov(plateau, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible)) {
    if (is_echecs(plateau, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible, true)) {
        console.log("échecs");
    }
} else {
    if (is_echecs(plateau, joueur, is_en_passant_possible, en_passant_collone, is_rock_possible, true)) {
        console.log("Victoire");
        if (joueur === "N") {
            console.log("des blancs");
            afficher_resultat_fin_partie(plateau, resultat=0, joueur="B")
        } else {
            console.log("des noirs");
            afficher_resultat_fin_partie(plateau, resultat=0, joueur="N")
        }
    } else {
        console.log("nul");
        afficher_resultat_fin_partie(plateau, resultat=1, joueur=null)
    }
    end_game = true;
}

// Comptage des pièces restantes pour chaque camp
const liste_blanc = {"R": 0, "D": 0, "P": 0, "F": 0, "C": 0, "T": 0};
const liste_noire = {"R": 0, "D": 0, "P": 0, "F": 0, "C": 0, "T": 0};

for (let row of plateau) {
    for (let cases of row) {
        if (cases[1] === "B") {
            liste_blanc[cases[0]]++;
        }
        if (cases[1] === "N") {
            liste_noire[cases[0]]++;
        }
    }
}

// Vérification de la nulle par manque de matériel
if (est_nulle_par_manque_de_materiel(liste_blanc, liste_noire)) {
    end_game = true;
    console.log("nul");
    afficher_resultat_fin_partie(plateau, resultat=1, joueur=null)
}

// Redessine le plateau
afficherPlateau(plateau)
await new Promise(resolve => setTimeout(resolve, 50)); // pause pour forcer le rendu
last_two_cases = [
  [l_case_1, n_case_1],
  [l_case_2, n_case_2]
];

afficherPlateau(
  plateau,
  null,
  null,
  last_two_cases[0][0],
  last_two_cases[0][1],
  last_two_cases[1][0],
  last_two_cases[1][1]
);

first_play = false;

}
}



window.onload = () => {
  afficherPlateau(plateau);
  setTimeout(() => {gameLoop()}, 100);
  ; // Appelle ta boucle principale ici
};