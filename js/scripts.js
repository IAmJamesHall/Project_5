/*
 * James Hall
 * Team Treehouse Project 5 - APIs
 * Started Jan 9, 2020
 */

/**
 * getUsers()
 * showUsersOnPage()
 * showUserModal()
 * 
 */
let masterUserArray = [];
getUsers()
    .then(data => masterUserArray = data)
    .then(masterUserArray => showUsersOnPage(masterUserArray));
let currentUserArray = masterUserArray;
createSearchBar();
let currentShownUser;
let fired = false;

window.addEventListener('keydown', e => {
    if (e.which > 64 && e.which < 91) {
        const searchBar = document.querySelector('#search-input');
        searchBar.focus();
    }
    if (e.which === 27) {
        removeModal();
    }
});

 /**
  * get users from random user API
  * @return {array} array of user objects
  */
 async function getUsers() {
     const userArray = [];
     for (let i = 0; i < 12; i++) {
        await fetch('https://randomuser.me/api/?nat=us')
            .then(data => data.json())
            .then(data => userArray.push(data.results[0]));
     }
     return userArray;

 }


/** 
 * create HTML markup for card
 * @param {object} user object from API
*/
function createCard(user) {
    const html = `
    <div class="card" id="${user.name.first}-${user.name.last}">
        <div class="card-img-container">
            <img class="card-img" src="${user.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}
        </div>
    </div>`
    return html;
}



/**
 * displays a list of user objects in the gallery
 * @param {array} users 
 */
function showUsersOnPage(users) {
    const $gallery = $('#gallery')
    
    $gallery.empty();
    for (let i = 0; i < users.length; i++) {
        let card = createCard(users[i]);
        $gallery.append(card);
    }
    currentUserArray = users;
}

/**
 * create a model to show user details
 * @param {object} user
 */
function createModal(user) {
    currentShownUser = user;
    let firstCard = lastCard = false;
    if (user === currentUserArray[0]) {
        firstCard = true;
    } 
    if (user === currentUserArray[currentUserArray.length - 1]) {
        lastCard = true;
    }
    let html = `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap"> ${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</pp>
                <p class="modal-text cap">${user.location.city}, ${user.location.state}</p>
                <hr>
                <p class="modal-text">${user.cell}</p>
                <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${extractDate(user.dob.date)}
            </div>`
            if (!firstCard || !lastCard) {
                html += `<div class="modal-btn-container">`
                if (!firstCard) {
                    html += `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>`;
                } 
                if (!lastCard) {
                    html += `<button type="button" id="modal-next" class="modal-next btn">Next</button>`;
                }
                html += '</div>';
            }
            
            html += '</div>';
                
                
        $('body').append(html);
        

        const closeBtn = document.querySelector('#modal-close-btn');
        closeBtn.addEventListener('click', removeModal);

        const prevButton = document.querySelector('.modal-prev');
        if (prevButton) {
            prevButton.addEventListener('click', viewPrev);
        }

        const nextButton = document.querySelector('.modal-next');
        if (nextButton) {
            nextButton.addEventListener('click', viewNext);
        }


        window.addEventListener('keydown', (e) => {
            if (fired === false) {
                if (e.which === 37) {
                    viewPrev();
                    console.log('viewPrev')
                } else if (e.which === 39) {
                    viewNext();
                    console.log('viewNext')
                }
            } 
            fired = true;
        });

        window.addEventListener('keyup', () => {
            fired = false;
        });
       
}


function createSearchBar() {
    const html = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`

    $searchContainer = $('.search-container');
    $searchContainer.append(html);

}

const searchInput = document.querySelector('#search-input');
searchInput.addEventListener('keyup', () => {
    showUsersOnPage(searchName(searchInput.value));
})

/**
 * searches a particular user field (i.e. name) for a search phrase
 * @param {string} searchTerm - string to search for
 * @param {array} array array to search through
 * @return {array} - users found with search term
 */
function searchName(searchTerm, array) {
    array = array || masterUserArray;
    searchTerm = searchTerm.replace('-', " ");
    const foundNames = [];
    searchTerm = searchTerm.toLowerCase();
    for (let i = 0; i < array.length; i++) {
        let name = `${array[i].name.first} ${array[i].name.last}`;
        name = name.toLowerCase();
        if (name.includes(searchTerm)) {
            foundNames.push(array[i]);
        }
    }

    return foundNames;
}


function removeModal() {
    const modal = document.querySelector('.modal-container');
    modal.parentElement.removeChild(modal);
}


function viewNext(e) {
    const thisUserCard = document.querySelector(`#${currentShownUser.name.first}-${currentShownUser.name.last}`);
    const nextUserCard = thisUserCard.nextElementSibling;
    if (nextUserCard) {
        removeModal();
        createModal(searchName(nextUserCard.id, currentUserArray)[0]);
    }
    
}

function viewPrev() {
    const thisUserCard = document.querySelector(`#${currentShownUser.name.first}-${currentShownUser.name.last}`);
    const prevUserCard = thisUserCard.previousElementSibling;
    if (prevUserCard) {
        removeModal();
        createModal(searchName(prevUserCard.id, currentUserArray)[0]);
    }
}


/**
 * returns date as user-friendly string
 * Ex: 1986-09-04T11:37:56.355Z
 * Ex: Sep 04, 1986
 * Ex: 09-04-1986
 * @param {string} dateString - birthday string provided by randomuser.me
 */
function extractDate(dateString) {
    const regex = /(\d{4})-(\d{2})-(\d{2})/;
    const match = dateString.match(regex);
    return `${match[2]}-${match[3]}-${match[1]}`
}



/************************
 * Event Listeners
 */

const gallery = document.querySelector('#gallery');
gallery.addEventListener('click', e => {
    if (e.target.className != "gallery") {
        const card = e.target.closest('.card');
        const user = searchName(card.id)[0];

        const modalHTML = createModal(user);
        $('body').append(modalHTML);
    }
});



