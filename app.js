
const forme = document.querySelector('.form')

const wrappform = document.querySelector('.wrapform')
const formgrp = document.querySelector('.form-group')


//GET CELLS

const nbrvu = document.querySelector('.vu')
const nbriterh = document.querySelector('.iterationh')
const nbriterhv = document.querySelector('.iterationv')
const calcpacing = document.querySelector('.pacing')
const totaltir = document.querySelector('.dureetir')
const inputcells = document.querySelectorAll("#input")
const nomscript = document.querySelector('.ns')
const itemsTab = document.querySelector('#tableau')
const tabhead = document.querySelector('.tdlist')
const removeList = document.querySelector('.rmlist')
const elementList = document.querySelector(".liste")
const msg = document.querySelector('.message')

//BUTTONS SUBMIT Event listeners
document.addEventListener('DOMContentLoaded', loadLocalStorage)


document.querySelector('.calcBtn').addEventListener('click', getInputPacing)
document.querySelector('.calciterationh').addEventListener('click', getInputiterationh)
document.querySelector('.calciterationhv').addEventListener('click', getInputiterationhv)
document.querySelector('.add').addEventListener('click', addInput)


// les différents calculs
function execHeure(a, b) {
    return a * b
}
function execHeureparVu(x, y) {
    return x / y
}
function calcPacing(z, v) {
    return z / v
}

//vérifier les inputs 
function verifyInput() {
    if (
        isNaN(calcpacing.value) || !calcpacing.value === "" || calcpacing.value <= 0
        && isNaN(totaltir.value) || !totaltir.value === "" || totaltir.value <= 0
        && isNaN(nbrvu.value) || !nbrvu.value === "" || nbrvu.value <= 0
        && isNaN(nbriterh.value) || !nbriterh.value === "" || nbriterh.value <= 0
        && isNaN(nbriterhv.value) || !nbriterhv.value === "" || nbriterhv.value <= 0
        && !nomscript.value === ""

    ) {
        displayMessage('Merci de remplir les champs ou rentrer de nombre valide !!', 'danger')
    }
}
//display error
function displayMessage(txt, color) {
    msg.textContent = txt
    msg.classList.add(color)
    setTimeout(() => {
        msg.textContent = ''
        msg.classList.remove(color)
    }, 2000)

}
//Initialisation des variables des résultats des calculs
let resultpacing = calcpacing.value
let resultChargeh = nbriterh.value
let resultChargehv = nbriterhv.value
let nameScript = nomscript.value
let nbrVusers = nbrvu.value
let resultTir = totaltir.value
let items


//GET PACING
function getInputPacing(e) {
    e.preventDefault()
    verifyInput()
    if (totaltir.value === "") {
        displayMessage("Je ne connais pas la durée de ton tir", 'danger')
    } else if (nbriterhv.value === "") {
        displayMessage("Je ne connais pas ton nombre d'itération/heure/vu", 'danger')
    }
    else {
        let resultpacing = calcPacing(totaltir.value, nbriterhv.value)
        calcpacing.value = resultpacing
    }


}
//GET CHARGE INPUT par heure
function getInputiterationh(e) {
    e.preventDefault()
    verifyInput()
    if (nbriterhv.value === "") {
        displayMessage("Merci de renseigner ta charge ou le nombre d'itération/heure", 'danger')
    }
    else {
        let resultChargeh = execHeure(nbrvu.value, nbriterhv.value)
        nbriterh.value = resultChargeh
    }
   

}
//GET IERATION PAR HEURE PAR VU
function getInputiterationhv(e) {
    e.preventDefault()
    verifyInput()
    if (nbriterh.value === "") {
        displayMessage("Je ne connais pas ton nombre d'itération/heure", 'danger')
    } else {
        let resultChargehv = execHeureparVu(nbriterh.value, nbrvu.value)
        
        nbriterhv.value = resultChargehv
    }


}

//CREATE INPUT ELEMENTS

function createElementInput(id, nameScript, nbrVusers, resultChargeh, resultChargehv, resultpacing, resultTir) {

    let elList = document.createElement('tbody')
    let inputid = document.createAttribute('data-id')
    inputid.value = id
    elList.setAttributeNode(inputid)

    elList.innerHTML = `
    <tr>
    <td class="ns">${nameScript}</td>
    <td>${nbrVusers}</td>
    <td>${resultChargeh}</td>
    <td>${resultChargehv}</td>
    <td>${resultpacing}</td>
    <td>${resultTir}</td>
    <td class="rmlist rm" title="remove">X</td>
    </tr>
    `
    itemsTab.appendChild(elList)
    tabhead.classList.remove('tdlist')
    const removeEl = elList.querySelector('.rm')
    removeEl.addEventListener('click', removeElements)
}

//remove Elements
function removeElements(e) {
    const parentEl = e.currentTarget.parentElement.parentElement
    const id = parentEl.dataset.id
    if (confirm('Voulez vous supprimer vraiment ce script?')) {
        itemsTab.removeChild(parentEl)
        displayMessage('Script supprimé avec succès', 'success') 
        removeFromLocalStorage(id)   
    }
   
    if(tabhead.children.length === 1){
  window.location.href = 'index.html'
 
    }
   
}



//ADD INPUT
function addInput(e) {
    e.preventDefault()

    const id = new Date().getTime().toString()
    if (nomscript.value === ""
        || nbrvu.value === ""
        || nbriterh.value === ""
        || nbriterhv.value === ""
        || calcpacing.value === ""
        || totaltir.value === ""

    ) {
        displayMessage('Tous les champs sont requis!', 'danger')
    }
    else if (isNaN(calcpacing.value) || calcpacing.value <= 0
        && isNaN(totaltir.value) || totaltir.value <= 0 && isNaN(nbrvu.value) || nbrvu.value <= 0
        && isNaN(nbriterh.value) || nbriterh.value <= 0 && isNaN(nbriterhv.value) || nbriterhv.value <= 0
    ) {
        displayMessage('Merci de rentrer des chiffres valides ou supérieurs à 0 !', 'danger')
    }
    else {

        createElementInput(id, nomscript.value, nbrvu.value, nbriterh.value, nbriterhv.value, calcpacing.value, totaltir.value)

        addLocalStorage(id, nomscript.value, nbrvu.value, nbriterh.value, nbriterhv.value, calcpacing.value, totaltir.value)


        displayMessage("Charge ajoutée avec succès", 'success')
        resetInput()

    }

}
//ADD TO LOCALSTORAGE
function addLocalStorage(id, nameScript, nbrVusers, resultChargeh, resultChargehv, resultpacing, resultTir) {
    const taches = { id, nameScript, nbrVusers, resultChargeh, resultChargehv, resultpacing, resultTir }
    let items = getLocalStorage()
    items.push(taches)
    localStorage.setItem('tache', JSON.stringify(items))
}
//GET LOCAL STORAGE
function getLocalStorage() {
    return localStorage.getItem('tache') ? JSON.parse(localStorage.getItem('tache')) : items = []
}
//RemoveFromLocalStorage
function removeFromLocalStorage(id) {
    let items = getLocalStorage()
    items = items.filter(item => {
        if (item.id !== id) {
            return item

        }

    })
    localStorage.setItem('tache', JSON.stringify(items))
}
//loadLocalStorage
function loadLocalStorage() {
    let items = getLocalStorage()
    if (items.length > 0) {
        items.forEach(item => {
            items.join('')
            createElementInput(
                item.id,
                item.nameScript,
                item.nbrVusers,
                item.resultChargeh,
                item.resultChargehv,
                item.resultpacing,
                item.resultTir)

        })
    }
}

//Je reset tous les input
function resetInput() {

    nbrvu.value = ""
    nbriterh.value = ""
    nbriterhv.value = ""
    calcpacing.value = ""
    totaltir.value = ""
    nomscript.value = ""
}
