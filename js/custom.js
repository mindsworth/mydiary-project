const userPic = document.querySelector('.thumbnail');
const userDropdown = document.querySelector('.user-dropdown');
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

userPic.addEventListener('click', displayDropdownHandler);