const closeModalAnimals = document.querySelector('.close-modal-animals')
const numberAnimal = document.querySelector('.number-animal')
const currentAnimal = document.querySelector('.current-animal')
const valueAnimals = document.querySelector('input.value-animals')
closeModalAnimals.addEventListener('click', (e) => {
    e.preventDefault()
    closeModalAnimals.parentElement.parentElement.style.display = 'none'
    valueAnimals.value = ''
});
valueAnimals.addEventListener('keyup', (e) => {
    if (e.target.value > 20) e.target.value = 20; // Valor máximo de apuesta por animal
})
// Form Animals Only
const formModal = document.querySelector('.main-modal-animals .form-modal')
const formFinalContent = document.querySelector('.main-modal-animals .form-final-content')
const myBalance = 40; // Acá es mi balance
const balance = document.querySelector('.form-total .balance span') // Acá es donde aárecerá mi balance
balance.innerHTML = myBalance + ',00'
let animalsSelected = []
const animalsSelectedForm = document.querySelector('.animals-selected-form')
const sendOnlyAnimals = document.querySelector('.main-modal-animals .btn-play-game.trigger-only-animals')
let totalForm = document.querySelector('.total-balance span')
sendOnlyAnimals.addEventListener('click', (e) => {
    e.preventDefault()
    const modal = sendOnlyAnimals.parentElement.parentElement.parentElement
    const input = sendOnlyAnimals.parentElement.querySelector('input')
    const alert = sendOnlyAnimals.parentElement.parentElement.querySelector('.alert')
    const path = sendOnlyAnimals.parentElement.parentElement.querySelector('.current-animal').getAttribute('src')
    const name = sendOnlyAnimals.parentElement.parentElement.querySelector('.current-animal').getAttribute('alt')
    if (input.value < 1 || input.value > 20) { // Valor mínimo y máximo de apuesta por animal
        modal.style.boxShadow = '0 15px 40px red'
        alert.style.display = 'block'
        setTimeout(() => {
            modal.style.boxShadow = '0px 10px 20px #131915'
            alert.style.display = 'none'
        }, 3000)
    } else {
        animalsSelected.push({
            path,
            name,
            value: input.value
        })
        animalsChecked() // Animals checked
        modal.style.boxShadow = '0px 15px 40px var(--green)'
        setTimeout(() => {
            modal.style.boxShadow = '0px 10px 20px #131915'
            modal.parentElement.style.display = 'none'
            input.value = ''
        }, 500)
        animalsSelectedFunc()
    }
})
// Data Animals
const dataAnimalsContent = document.querySelector('.data-animals-content')
dataAnimals.map((el, index) => {
    dataAnimalsContent.innerHTML += `
    <div class="item-animals">
        <img src="./assets/img/animals/${el.number}.png" alt="${el.name}">
        <img class="icon" src="./assets/img/animals/helpers/checked.png">
    </div>`
})
const itemsAnimals = [...document.querySelectorAll('.grid-animals .item-animals')]
function animalsChecked() {
    itemsAnimals.map((el, index) => {
        const animal = el.children[0].getAttribute('alt')
        animalsSelected.map(x => {
            if (animal.trim() == x.name.trim()) {
                if (el.children[1].style.opacity == '' || el.children[1].style.opacity == '0') {
                    el.children[1].style.opacity = '1'
                }
            }
        })
    })
}
function animalsUnChecked(name) {
    itemsAnimals.map((el, index) => {
        const animal = el.children[0].getAttribute('alt')
        if (animal == name) {
            el.children[1].style.opacity = '0'
        }
    })
}
// Data Hours
const dataHoursContent = document.querySelector('.data-hours-content')
dataHours.map((el, index) => {
    dataHoursContent.innerHTML += `
    <div class="item-hour active" time="${el.hour}">
        <img src="./assets/img/animals/helpers/checked.png">
        ${el.hour} ${el.time}
    </div>`
})
let hoursSelected = []
const itemsHours = [...document.querySelectorAll('.grid-animals .item-hour.active')]
const hoursSelectedForm = document.querySelector('.hours-selected-form')
const stopHours = [
    '8:50am',
    '9:50am',
    '10:50am',
    '11:50am',
    '12:50pm',
    '1:50pm',
    '2:50pm',
    '3:50pm',
    '4:50pm',
    '5:50pm',
    '6:50pm'
];
itemsHours.map((el, index) => {
    const time = el.textContent.trim()
    const img = el.children[0]
    // Acá el restar las horas 
    let timeVnzlaCurrent = moment().tz("America/Caracas").format('h:mma')
    let timesPointsExp = moment(stopHours[index], 'h:mma');
    let firstExp = new moment(timeVnzlaCurrent, 'h:mma')
    let twoExp = new moment(timesPointsExp._i, 'h:mma')
    // console.log(moment().tz("America/Caracas").format('h:mma'))
    setInterval(() => {
        let timesPoints = moment(stopHours[index], 'h:mma');
        let timeVnzlaCurrent = moment().tz("America/Caracas").format('h:mma')
        let first = new moment(timeVnzlaCurrent, 'h:mma')
        let two = new moment(timesPoints._i, 'h:mma')
        if (first > two) {
            el.textContent = '-- : --'
            el.setAttribute('time', '-- : --')
            el.classList.add('inactive')
            el.classList.remove('active')
        } else if (first < two) {}
    }, 1000);

    el.addEventListener('click', (e) => {
        e.preventDefault()
        if (img.style.opacity == '' || img.style.opacity == '0') {
            img.style.opacity = '1'
            if (firstExp < twoExp) {
                hoursSelected.push(time)
            }
        } else {
            img.style.opacity = '0'
            hoursSelected = hoursSelected.filter(x => {
                if (x != time) {
                    return x
                }
            })
        }
        hoursSelectedFunc()
    })
})

function hoursSelectedFunc() {
    hoursSelectedForm.innerHTML = ''
    hoursSelected.map(el => {
        const itemHourSelected = document.createElement('div')
        itemHourSelected.classList.add('item-hour-selected')
        itemHourSelected.textContent = el
        hoursSelectedForm.appendChild(itemHourSelected)
    })
    animalsSelectedFunc()
}
function deleteItem(e, name) {
    if (confirm(`¿Seguro que quiere eliminar al ${ name } de sus apuestas?`)) {
        e.target.parentElement.remove()
        animalsSelected = animalsSelected.filter(x => {
            if (x.name != name) {
                return x
            }
        })
        const total = animalsSelected.reduce((previous, current) => {
            return parseInt(previous) + parseInt(current.value);
        }, 0);
        animalsUnChecked(name)
        totalForm.innerHTML = (total * hoursSelected.length) + ',00'
    }
}

function animalsSelectedFunc() {
    animalsSelectedForm.innerHTML = ''
    animalsSelected.map(el => {
        animalsSelectedForm.innerHTML += `
        <div class="item-animals-selected">
            <img src="${ el.path }">
            <div>${ el.name }</div>
            <span>${ (hoursSelected.length * el.value) }</span>
            <i class="material-icons" onclick="deleteItem(event, '${ el.name }')">delete</i>
        </div>`
    })
    const total = animalsSelected.reduce((previous, current) => {
        return parseInt(previous) + parseInt(current.value);
    }, 0);
    totalForm.innerHTML = (total * hoursSelected.length) + ',00'

}

// Show Modal Animals
itemsAnimals.map((el, index) => {
    el.addEventListener('click', (e) => {
        if (hoursSelected.length > 0) {
            e.preventDefault()
            const pathAnimalCurrent = el.querySelector('img').getAttribute('src')
            const name = el.querySelector('img').getAttribute('alt')
            closeModalAnimals.parentElement.parentElement.style.display = 'flex'
            currentAnimal.setAttribute('src', pathAnimalCurrent)
            currentAnimal.setAttribute('alt', name)
            formModal.style.display = 'block'
            formFinalContent.style.display = 'none'
        } else {
            alert('Debe seleccionar al menos una hora primero')
        }
    })
})
// Selected Items Animals

// Today Date
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${day}-${month}-${year}`;
const dateCurrentDom = document.querySelector('.form-total .date span')
dateCurrentDom.innerHTML = currentDate

// Final Form Total
const btnSendFormTotal = document.querySelector('.form-total .btn-send')
btnSendFormTotal.addEventListener('click', (e) => {
    e.preventDefault();
    const itemsAnimalsSelected = [...document.querySelectorAll('.main-animals .item-animals-selected')]
    const itemsAnimalsSelectedFinal = [...document.querySelectorAll('.form-total .item-animals-selected')]
    const itemsHoursSelectedFinal = [...document.querySelectorAll('.form-total .item-hour-selected')]
    let valueTotal = []
    let animalsFinal = []
    let hoursSelectedFinal = []
    itemsAnimalsSelectedFinal.map(el => {
        valueTotal.push(parseInt(el.querySelector('span').textContent.trim()))
        animalsFinal.push(el.querySelector('div').textContent.trim())
    })
    itemsHoursSelectedFinal.map(el => {
        hoursSelectedFinal.push(el.textContent)
    })
    const total = valueTotal.reduce((previous, current) => {
        return parseInt(previous) + parseInt(current);
    }, 0);
    if (hoursSelected.length > 0) {
        if (animalsFinal.length > 0) {
            if (total <= myBalance) {
                const formFinal = [hoursSelectedFinal, animalsFinal, currentDate] // Acá está un array donde puede ver todos los datos que ha enviado en usuario 'formFinal'
                let finalFormText = `+ Fecha: `
                finalFormText += formFinal[2] + ' \n'
                finalFormText += `+ Horarios: \n`
                formFinal[0].map(hour => finalFormText += `- ${hour} \n`)
                finalFormText += `+ Jugadas: \n`
                formFinal[1].map(animal => finalFormText += `- ${animal} Procesado \n`)
                finalFormText += `+ Total: ${total}\n`
                finalFormText += '¡¡Gracias por su compra!!'
                alert(finalFormText)
            } else {
                alert('Debe recargar su saldo para hacer las apuestas, verifique su balance por favor...')
            }
        } else {
            alert('Debe seleccionar un animalito')
        }
    }  else {
        alert('Debe seleccionar una hora')
    }
})