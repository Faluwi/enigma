// Visualisierung der Enigma Verschluesselung
// Andreas Kudenko, Fabian Lucas Wild, Erik Ruthmann

// Notwendige globale Variablen:
let maschine = {
    ukw: "UKWB",
    wLinks: "I",
    wMitte: "II",
    wRechts: "III",
};

//Deklaration der Chiffrierwalzen, bzw. ihrer Verschaltung & Deklaration der Verschaltung der Umkehrwalzen
let walzen ={
    I:  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        [5, 11, 13,  6, 12,  7,  4, 17, 22, 26, 14, 20, 15, 23, 25,  8, 24, 21, 19, 16,  1,  9,  2, 18, 3, 10]],
    II: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        [1, 10,  4, 11, 19,  9, 18, 21, 24,  2, 12,  8, 23, 20, 13,  3, 17,  7, 26, 14, 16, 25,  6, 22, 15, 5]],
    III: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        [2,  4,  6,  8, 10, 12,  3, 16, 18, 20, 24, 22, 26, 14, 25,  5, 9, 23,  7,  1, 11, 13, 21, 19, 17, 15]],
    IV:  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        [5, 19, 15, 22, 16, 26, 10,  1, 25, 17, 21,  9, 18,  8, 24, 12, 14,  6, 20,  7, 11,  4,  3, 13, 23,  2]],
    V:  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        [22, 26,  2, 18,  7,  9, 20, 25, 21, 16, 19,  4, 14,  8, 12, 24, 1, 23, 13, 10, 17, 15,  6,  5, 3, 11]],
    UKWA:  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        [5, 10, 13, 26,  1, 12, 25, 24, 22,  2, 23,  6,  3, 18, 17, 21, 15, 14, 20, 19, 16,  9, 11,  8,  7,  4]],
    UKWB: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        [25, 18, 21,  8, 17, 19, 12,  4, 16, 24, 14,  7, 15, 11, 13,  9,  5,  2,  6, 26,  3, 23, 22, 10,  1, 20]],
    UKWC: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        [6, 22, 16, 10,  9,  1, 15, 25,  5,  4, 18, 26, 24, 23,  7,  3, 20, 11, 21, 17, 19,  2, 14, 13,  8, 12]],
    SV: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]]
    //   A; B; C  D  E  F  G  H  I   J   K   L   M   N   O   P  Q    R   S   T   U   V   W   X   Y   Z
};

//Übertragskerben für die Einzelnen Walzen
let kerben = {
    I: 17, // Q ->R
    II: 5, // E-> F
    III: 22,//V->W
    IV: 10,//J->K
    V: 26, //Z->A
};

let path_in =[];
let path_out = [];
let lamp_on = null;
let lines = [];

function init(){
    updateWalzenView(true);
}

//***************************************************
// EINSTELLUNGEN AN DER MASCHINE
//***************************************************

//Löscht/Fügt eine Steckverbindung von Buchstabe A zu B ein
function steck(paramA, paramB) {
    walzen.SV[1] [paramA.charCodeAt(0) - 65] = paramB.charCodeAt(0)- 64;
    walzen.SV[1] [paramB.charCodeAt(0) - 65] = paramA.charCodeAt(0)- 64;
}

function changeUKW(){
    const ukw = document.querySelector("#ukwSelector");
    if(maschine.ukw !== ukw.value){
        maschine.ukw = ukw.value;
        updateWalzenView();
    }
}

//Einstellung der verdrahtung innerhalb der Walze
function adjustRingstellung(walze, ringstellung) {
    ringstellung--; //Ringstellung 1 = normal;
    for(let i = 0; i <ringstellung; i++){
        walzen[walze][0].push(walzen[walze][0].shift());
    }
    kerben[walze] += ringstellung;
    if(kerben[walze] > 26){
        kerben[walze] -= 26;
    }
}

function changeLinks(){
    const wl = document.querySelector("#linksSelector");
    console.log(wl);
    if(maschine.wLinks !== wl.value && wl.value !== maschine.wMitte && wl.value !== maschine.wRechts) {
        maschine.wLinks = wl.value;
        adjustRingstellung(maschine.wLinks, document.querySelector("#RSLSelector").value);
        updateWalzenView();
    }else {
        alert("Jede Walze wird höchstens ein Mal benutzt!");
        wl.value = maschine.wLinks;
    }
}

function changeMitte(){
    const wm = document.querySelector("#mittelSelector");
    if(maschine.wLinks !== wm.value && wm.value !== maschine.wMitte && wm.value !== maschine.wRechts) {
        maschine.wMitte = wm.value;
        adjustRingstellung(maschine.wMitte, document.querySelector("#RSMSelector").value);
        updateWalzenView();
    }else {
        alert("Jede Walze wird höchstens ein Mal benutzt!");
        wm.value = maschine.wMitte;
    }
}

function changeRechts(){
    const wr = document.querySelector("#rechtsSelector");
    if(maschine.wLinks !== wr.value && wr.value !== maschine.wMitte && wr.value !== maschine.wRechts) {
        maschine.wRechts = wr.value;
        adjustRingstellung(maschine.wRechts, document.querySelector("#RSRSelector").value);
        updateWalzenView();
    }else {
        alert("Jede Walze wird höchstens ein Mal benutzt!");
        wr.value = maschine.wRechts;
    }

}

function changeSteck(){
    const tArea = document.querySelector("#input");
    let input = tArea.value;
    if(input.length === 2){
        let a = input.charCodeAt(0)-64;
        let b = input.charCodeAt(1) -64;
        if(0 < a && a <27){
            if(0< b && b <27){
                steck(getLetter(a), getLetter(b));
                updateWalzenView();
                tArea.value = '';
                return;
            }
        }
    }
    alert("Keine valide Eingabe. (Format:'AB'; für eine Verbindung von A und B");
    tArea.value = '';
}

function changeSpruch(){
    const tArea = document.querySelector("#spKey");
    let input = tArea.value;
    if(input.length === 3){
        let a = input.charCodeAt(0)-64;
        let b = input.charCodeAt(1) -64;
        let c = input.charCodeAt(2) -64;
        if(0 < a && a <27){
            if(0< b && b <27){
                if(0 < c && c < 27) {
                    while(walzen[maschine.wLinks][0][0] !== a || walzen[maschine.wMitte][0][0]!== b
                    || walzen[maschine.wRechts][0][0] !== c){
                        walzeDrehen(maschine.wRechts);
                    }
                    updateWalzenView();
                    return;
                }
            }
        }
    }
    alert("Keine valide Eingabe. (Format:'ABC'");
    tArea.value = '';
}


//****************************************************************
//Bedienen der Maschine/Drehen der Walzen
//****************************************************************

//Dreht eine Walze um einen Schritt weiter.
function walzeDrehen(walze){
    let uebertrag = walzen[walze][0].shift();
    walzen[walze][0].push(uebertrag);
    walzen[walze][1].push(walzen[walze][1].shift());
    if(uebertrag === kerben[walze]){
        if(walze === maschine.wRechts){
            walzeDrehen(maschine.wMitte);
        }
        if(walze === maschine.wMitte) {
            walzeDrehen(maschine.wLinks);
        }
    }
}

function chiffriere(buchstabe){
    walzeDrehen(maschine.wRechts);
    //Alten Pfad löschen
    for(let e of path_in){
        e.classList.remove("label_hin");
    }
    for(let e of path_out) {
        e.classList.remove("label_zur");
    }
    path_in= [];
    path_out= [];

    //neuer Pfad
    let inputIndex = buchstabe.charCodeAt(0) - 65; //A = 0
    let htmlSV = document.getElementById("steckverbindung");
    let htmlWRechts = document.getElementById("walzeRechts");
    let htmlWMitte = document.getElementById("walzeMitte");
    let htmlWLinks = document.getElementById("walzeLinks");
    let htmlUKW = document.getElementById("umkehrwalze");
    let nextIndex = pfad_hin("SV",   htmlSV,           inputIndex);
    nextIndex = pfad_hin(maschine.wRechts, htmlWRechts,      nextIndex);
    nextIndex = pfad_hin(maschine.wMitte,  htmlWMitte,       nextIndex);
    nextIndex = pfad_hin(maschine.wLinks,  htmlWLinks,       nextIndex);
    nextIndex = pfad_hin(maschine.ukw,     htmlUKW,          nextIndex);
    nextIndex = pfad_zurueck(maschine.wLinks,  htmlWLinks,   nextIndex);
    nextIndex = pfad_zurueck(maschine.wMitte,  htmlWMitte,   nextIndex);
    nextIndex = pfad_zurueck(maschine.wRechts, htmlWRechts,  nextIndex);
    nextIndex = pfad_zurueck("SV",       htmlSV,        nextIndex);
    return getLetter(walzen.SV[1][nextIndex]);
}


function pfad_hin(walze,wElement, inputIndex){
    //rechnung für Modell
    let inputLetter = walzen[walze][1][inputIndex];
    let outputIndex = walzen[walze][0].indexOf(inputLetter);
    //ViewUpdate
    wElement.children.item(1+2*inputIndex).classList.add("label_hin");
    path_in.push(wElement.children[1+2*inputIndex]);

    wElement.children.item(2*outputIndex).classList.add("label_hin");
    path_in.push(wElement.children[2*outputIndex]);

    if(walze === maschine.ukw){
        wElement.children.item(1+2*outputIndex).classList.add("label_zur");
        path_out.push(wElement.children[1+2*outputIndex]);
    }
    return outputIndex;
}

function pfad_zurueck(walze,wElement, inputIndex){
    //rechnung für Modell
    let inputLetter = walzen[walze][0][inputIndex];
    let outputIndex = walzen[walze][1].indexOf(inputLetter);
    //ViewUpdate
    wElement.children.item(2*inputIndex).classList.add("label_zur");
    path_out.push(wElement.children[2*inputIndex]);
    wElement.children.item(1+ 2*outputIndex).classList.add("label_zur");
    path_out.push(wElement.children[1+ 2*outputIndex]);
    return outputIndex;
}

function updateWalzenView(init_bool) {
    let umkehr = document.getElementById("umkehrwalze");
    let walzeLinks = document.getElementById("walzeLinks");
    let walzeMitte = document.getElementById("walzeMitte");
    let walzeRechts = document.getElementById("walzeRechts");
    let steckverbindung = document.getElementById("steckverbindung");
    if(init_bool) {
        for(let i = 0; i <26; i++){
            addViewColumn(umkehr, maschine.ukw, i);
            addViewColumn(walzeLinks, maschine.wLinks, i);
            addViewColumn(walzeMitte, maschine.wMitte, i);
            addViewColumn(walzeRechts, maschine.wRechts, i);
            addViewColumn(steckverbindung, 'SV', i);
        }
    }
    for(let i = 0; i < 26; i++) {
        updateZeile(umkehr, maschine.ukw, i);
        updateZeile(walzeLinks, maschine.wLinks, i);
        updateZeile(walzeMitte, maschine.wMitte, i);
        updateZeile(walzeRechts, maschine.wRechts, i);
        updateZeile(steckverbindung, "SV", i);
    }
}

function addViewColumn(wElement, walze, columnIndex){
    let child1 = document.createElement('label');
    child1.classList.add("label_normal");
    child1.textContent = getLetter(walzen[walze][0][columnIndex]);
    let child2 = document.createElement('label');
    child2.classList.add("label_normal");
    child2.textContent = getLetter(walzen[walze][1][columnIndex]);
    wElement.appendChild(child1);
    wElement.appendChild(child2);
}

function updateZeile(wElement,walze, column){
    wElement.children[2*column].textContent = getLetter(walzen[walze][0][column]);
    wElement.children[1+ 2*column].textContent = getLetter(walzen[walze][1][column]);
}


//schaltet bereits Leuchtende Lampen aus und die Lampe des Parameters an
function updateLampenView(letter){
    if(lamp_on != null) {
        lamp_on.classList.remove("lamp_on");
        lamp_on = null;
    }
    let lampen = document.getElementsByClassName("lamp");
    let tast = "QWERTZUIOASDFGHJKPYXCVBNML";
    lampen[tast.indexOf(letter)].classList.add("lamp_on");
    lamp_on = lampen[tast.indexOf(letter)];
}

function codeTaste(value) {
    let chif = chiffriere(value);
    document.getElementById("eingabeFeld").textContent += value;
    document.getElementById("ausgabeFeld").textContent += chif;
    updateWalzenView();
    updateLampenView(chif);
    drawLines();
}

function getLetter(charCode){
    return String.fromCharCode(charCode +64);
}

function drawLines(){
    //delete all lines
    for(let e of lines){
        document.getElementById("main").removeChild(e);
    }
    lines = [];
    draw(path_in, "green");
    draw([path_out[0], path_in.reverse()[0]], "orange");
    draw(path_out.reverse(), "red");
}

function draw(nodeList, color){
    for(let i = 0; i < nodeList.length-1; i++){
        let startElement = nodeList[i];
        let endElement = nodeList[i+1];

        let line = document.createElement("div");
        line.classList.add("linie_in");

        let offTopStart = startElement.getBoundingClientRect().top + document.documentElement.scrollTop +10;
        let offLeftStart = startElement.getBoundingClientRect().left + document.documentElement.scrollLeft;

        let offTopEnd = endElement.getBoundingClientRect().top + document.documentElement.scrollTop +10;
        let offLeftEnd = endElement.getBoundingClientRect().left + document.documentElement.scrollLeft + 15;

        let offTopDiff = offTopEnd - offTopStart;
        let offLeftDiff = offLeftEnd - offLeftStart;

        let width = Math.floor(Math.abs(offLeftDiff));
        let top = Math.floor((offTopStart + offTopEnd)/2);
        let left = offLeftEnd;

        let steigung = offTopDiff/offLeftDiff;
        let degr = Math.floor(Math.atan(steigung)*57.2957);
        let height = 2;
        if(Math.abs(degr) > 45){
            height = 4;
        }
        line.setAttribute("style", "top:"+ top +"px;"
                                        +"left:"+ left+"px;"
                                        +"transform: skewY(" + degr +"deg);"
                                        +"width:" + width +"px;"
                                        +"height:" + height +"px;"
                                        + "position: absolute; "
                                        + "background: "+ color +";");
        document.getElementById("main").appendChild(line);
        lines.push(line);
    }

}