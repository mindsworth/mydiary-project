const userPic = document.querySelector('.thumbnail');
const userDropdown = document.querySelector('.user-dropdown');
const categoryBtn = document.querySelector('.modal-open');
const modalOlay = document.querySelector('.modal-olay');
const modalClose = document.querySelector('.modal-close');

let show = false;




const displayDropdownHandler = () => {
    if (show) {
        userDropdown.style.display = 'none';
        show = !show;
        console.log(show);
    } else {
        userDropdown.style.display = 'block';
        show = !show;
        console.log(show);
    }
}

const categoryModalShowHandler = (event) => {
    event.preventDefault();
    modalOlay.style.display = 'flex';
}

const categoryModalHideHandler = () => {
    modalOlay.style.display = 'none';
}


userPic.addEventListener('click', displayDropdownHandler);
categoryBtn.addEventListener('click', categoryModalShowHandler);
modalClose.addEventListener('click', categoryModalHideHandler);