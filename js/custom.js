const categoryBtn = document.querySelector('.modal-open');
const modalOlay = document.querySelector('.model-add');
const modalClose = document.querySelector('.modal-close');

const categoryModalShowHandler = (event) => {
    event.preventDefault();
    modalOlay.style.display = 'flex';
}

const categoryModalHideHandler = () => {
    modalOlay.style.display = 'none';
}

categoryBtn.addEventListener('click', categoryModalShowHandler);
modalClose.addEventListener('click', categoryModalHideHandler);