const userPic = document.querySelector('.thumbnail');
const userDropdown = document.querySelector('.user-dropdown');
const categoryBtn = document.querySelector('.modal-open');
const modalOlay = document.querySelector('.modal-olay');
const modalClose = document.querySelector('.modal-close');
const listDropdowns = document.querySelectorAll('.fa-ellipsis-h');

let showUserDropdown = false;
let showEntryDrawer = false;




const displayDropdownHandler = () => {
    if (showUserDropdown) {
        userDropdown.style.display = 'none';
        showUserDropdown = !showUserDropdown;
    } else {
        userDropdown.style.display = 'block';
        showUserDropdown = !showUserDropdown;
    }
}

const categoryModalShowHandler = (event) => {
    event.preventDefault();
    modalOlay.style.display = 'flex';
}

const categoryModalHideHandler = () => {
    modalOlay.style.display = 'none';
}

[].forEach.call(listDropdowns, (drop) => {
    drop.addEventListener('click', function () {
        if (showEntryDrawer) {
            drop.style.background = "none";
            this.parentNode.className = "edit";
            showEntryDrawer = !showEntryDrawer;

        } else {
            drop.style.background = "#eee";
            this.parentNode.className = "edit show-drawer";
            showEntryDrawer = !showEntryDrawer;
        }
    })
});

userPic.addEventListener('click', displayDropdownHandler);
categoryBtn.addEventListener('click', categoryModalShowHandler);
modalClose.addEventListener('click', categoryModalHideHandler);