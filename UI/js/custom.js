const categoryBtn = document.querySelector('.modal-open');
const modalOlay = document.querySelector('.modal-olay');
const modalClose = document.querySelector('.modal-close');

let showUserDropdown = false;
let showEntryDrawer = false;

const categoryModalShowHandler = (event) => {
    event.preventDefault();
    modalOlay.style.display = 'flex';
}

const categoryModalHideHandler = () => {
    modalOlay.style.display = 'none';
}

categoryBtn.addEventListener('click', categoryModalShowHandler);
modalClose.addEventListener('click', categoryModalHideHandler);