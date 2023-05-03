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
            el.style.display = 'none'
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
        animalsFinal.push({
            name: el.querySelector('div').textContent.trim(),
            imgPath: el.querySelector('img').getAttribute('src') 
        })
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
                // const formFinal = [hoursSelectedFinal, animalsFinal, currentDate] // Acá está un array donde puede ver todos los datos que ha enviado en usuario 'formFinal'
                const itemsHoursFormFinal = document.querySelector('.hours-final-form')
                const itemsAnimalsFormFinal = document.querySelector('.animals-final-form')
                const fechaFinal = document.querySelector('.fecha-final span')
                const finalTotal = document.querySelector('.final-total')
                closeModalAnimals.parentElement.parentElement.style.display = 'flex'
                formModal.style.display = 'none'
                formFinalContent.style.display = 'block'
                fechaFinal.innerHTML = ''
                itemsHoursFormFinal.innerHTML = ''
                itemsAnimalsFormFinal.innerHTML = ''
                finalTotal.innerHTML = ''
                fechaFinal.innerHTML = formFinal[2]
                formFinal[0].map(x => {
                    itemsHoursFormFinal.innerHTML += `
                    <div class="item-hour-selected">
                        ${ x }
                    </div>`
                })
                formFinal[1].map(x => {
                    itemsAnimalsFormFinal.innerHTML += `
                    <div class="item-animals-selected">
                        <img src="${ x.imgPath }">
                        <div>${ x.name } <span><small>procesado</small></span></div>
                    </div>`
                })
                finalTotal.innerHTML = ' Total: ' + total + ',00'
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
// Final Form Validate
const btnSendFinalForm = document.querySelector('.form-final-content .btn-send-final-form')
btnSendFinalForm.addEventListener('click', (e) => {
    e.preventDefault();
    formFinalContent.innerHTML = `
    <div class='checkmark-animals'>
        <svg class='confetti' height='19' viewBox='0 0 19 19' width='19' xmlns='http://www.w3.org/2000/svg'>
            <path d='M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z' fill='#00C8E5'>
        </svg>
        <svg class='confetti' height='19' viewBox='0 0 19 19' width='19' xmlns='http://www.w3.org/2000/svg'>
            <path d='M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z' fill='#00C8E5'>
        </svg>
        <svg class='confetti' height='19' viewBox='0 0 19 19' width='19' xmlns='http://www.w3.org/2000/svg'>
            <path d='M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z' fill='#00C8E5'>
        </svg>
        <svg class='confetti' height='19' viewBox='0 0 19 19' width='19' xmlns='http://www.w3.org/2000/svg'>
            <path d='M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z' fill='#00C8E5'>
        </svg>
        <svg class='confetti' height='19' viewBox='0 0 19 19' width='19' xmlns='http://www.w3.org/2000/svg'>
            <path d='M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z' fill='#00C8E5'>
        </svg>
        <svg class='confetti' height='19' viewBox='0 0 19 19' width='19' xmlns='http://www.w3.org/2000/svg'>
            <path d='M8.296.747c.532-.972 1.393-.973 1.925 0l2.665 4.872 4.876 2.66c.974.532.975 1.393 0 1.926l-4.875 2.666-2.664 4.876c-.53.972-1.39.973-1.924 0l-2.664-4.876L.76 10.206c-.972-.532-.973-1.393 0-1.925l4.872-2.66L8.296.746z' fill='#00C8E5'>
        </svg>
        <svg class='checkmark__check' height='36' viewBox='0 0 48 36' width='48' xmlns='http://www.w3.org/2000/svg'>
            <path d='M47.248 3.9L43.906.667a2.428 2.428 0 0 0-3.344 0l-23.63 23.09-9.554-9.338a2.432 2.432 0 0 0-3.345 0L.692 17.654a2.236 2.236 0 0 0 .002 3.233l14.567 14.175c.926.894 2.42.894 3.342.01L47.248 7.128c.922-.89.922-2.34 0-3.23'>
        </svg>
        <svg class='checkmark__back' height='115' viewBox='0 0 120 115' width='120' xmlns='http://www.w3.org/2000/svg'>
            <path d='M107.332 72.938c-1.798 5.557 4.564 15.334 1.21 19.96-3.387 4.674-14.646 1.605-19.298 5.003-4.61 3.368-5.163 15.074-10.695 16.878-5.344 1.743-12.628-7.35-18.545-7.35-5.922 0-13.206 9.088-18.543 7.345-5.538-1.804-6.09-13.515-10.696-16.877-4.657-3.398-15.91-.334-19.297-5.002-3.356-4.627 3.006-14.404 1.208-19.962C10.93 67.576 0 63.442 0 57.5c0-5.943 10.93-10.076 12.668-15.438 1.798-5.557-4.564-15.334-1.21-19.96 3.387-4.674 14.646-1.605 19.298-5.003C35.366 13.73 35.92 2.025 41.45.22c5.344-1.743 12.628 7.35 18.545 7.35 5.922 0 13.206-9.088 18.543-7.345 5.538 1.804 6.09 13.515 10.696 16.877 4.657 3.398 15.91.334 19.297 5.002 3.356 4.627-3.006 14.404-1.208 19.962C109.07 47.424 120 51.562 120 57.5c0 5.943-10.93 10.076-12.668 15.438z' fill='#00C8E5'>
        </svg>
    </div>
    <h2 class="text-center text-white mt-5">¡Gracias por su compra!</h2>`
    setTimeout(() => {
        window.location.reload();
    }, 2000);
})

document.addEventListener('click', (e) => {
    e.preventDefault();

    alert('Hola Daniel Teran! Este es el ejemplo que te quería mostrar. Tomando en cuenta que al registrarse puedas ver los datos de los usuarios y su compra: Ejmplo: Nombre Apellido. Animal 00 - Ballena 15bs - Animal 0 - Delfín 20bs y así... Y alfinal puedas avisarle al usuario por Whatsapp según sea su número: +58 412 297 4011 y así sucesivamente con los demás usuarios. Si estás de acuerdo con el ejemplo me respondes por Workana que: No me gusta ese ejemplo, puedes darme otro? Ahora, si no te gusta el ejemplo: me dices que si te gusta. Esto para minimizar comisiones a los usuarios que usen la web')
})