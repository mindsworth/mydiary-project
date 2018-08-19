const MakeNetworkRequest = (input = {
  url: '',
  method: '',
  data: ''
}) => {
  const reqObject = {
    method: input.method,
    mode: 'cors',
  };

  if (input.method === 'get') {
    reqObject.headers = {
      'content-type': 'application/json',
      'x-access-token': input.data.token,
    };
  } else {
    reqObject.headers = {
      'content-Type': 'application/json',
      'x-access-token': input.data.token,
    };
    reqObject.body = JSON.stringify(input.data.body);
  }

  return fetch(input.url, reqObject)
    .then(response => response.json())
    .catch(err => err);
};

const getUserInput = function (input) {
  const formInput = new FormData(input);
  const data = {
    title: formInput.get('title'),
    colorId: formInput.get('color'),
  };
  return data;
}

const animateSpin = (btn, spin) => {
  btn.disabled = true;
  btn.style.cursor = "progress";
  btn.style.color = "rgba(255, 255, 255, .3)";
  spin.style.display = "block";
}

const animateSpinDisabled = (btn, spin) => {
  btn.disabled = false;
  btn.style.cursor = "pointer";
  btn.style.color = "#ffffff";
  spin.style.display = "none";
}

const handlePayLoad = (message, payLoad) => {
  payLoad.innerHTML = `${message}`;
  payLoad.style.display = 'block';
}

let aboutStatus = true;
let telStatus = true;
let dpImage;

class ProfileClient {
  init() {
    new ProfileClient().addCategory();
    new ProfileClient().getUserDetails();
    new ProfileClient().handleAboutBox();
    new ProfileClient().handleTelBox();
    new ProfileClient().updateTel();
    new ProfileClient().updateAbout();
    new ProfileClient().getAllCategories();
    new ProfileClient().getAllEntry();
    new ProfileClient().logout();
    new ProfileClient().handlePreviewImage();
    new ProfileClient().updateProfileImage();
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return null;
    }
    return token;
  }

  logout() {
    const logout = document.querySelector('#logout');
    logout.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  }

  handleAboutBox() {
    const aboutEdit = document.querySelector('.about-edit');
    const aboutBox = document.querySelector('#about');
    const saveBtn = document.querySelector('.about-save');

    aboutEdit.addEventListener('click', () => {
      if (aboutStatus) {
        aboutBox.disabled = false;
        aboutBox.style.border = '1px solid #f7f7f7';
        aboutBox.style.padding = '1rem';
        saveBtn.style.display = 'inline-block';
        aboutStatus = !aboutStatus;
      } else {
        aboutBox.disabled = true;
        aboutBox.style.border = '0';
        aboutBox.style.padding = '0';
        saveBtn.style.display = 'none';
        aboutStatus = !aboutStatus;
      }
    });
  }
  handleTelBox() {
    const telEdit = document.querySelector('.tel-edit');
    const telBox = document.querySelector('#tel');
    const saveBtn = document.querySelector('.tel-save');

    telEdit.addEventListener('click', () => {
      if (telStatus) {
        telBox.disabled = false;
        telBox.style.border = '1px solid #f7f7f7';
        telBox.style.padding = '1rem';
        saveBtn.style.display = 'inline-block';
        telStatus = !telStatus;
      } else {
        telBox.disabled = true;
        telBox.style.border = '0';
        telBox.style.padding = '0';
        saveBtn.style.display = 'none';
        telStatus = !telStatus;
      }
    });
  }

  previewImage(event) {
    const reader = new FileReader();
    const imageField = document.querySelector('#image-field');
    const imageSave = document.querySelector('.profile-image-save');
    reader.onload = function () {
      if (reader.readyState == 2) {

        imageField.setAttribute('src', reader.result);
        imageSave.style.display = 'inline-block';
      }
    };

    dpImage = event.target.files[0];

    reader.readAsDataURL(event.target.files[0]);
  }

  handlePreviewImage() {
    const profileImage = document.querySelector('#profile-image');
    profileImage.addEventListener('change', (event) => {
      new ProfileClient().previewImage(event);
    });
  }


  getUserDetails() {
    const url = 'https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/user';
    const token = new ProfileClient().checkToken();
    const method = 'get';
    const data = {
      token,
    }

    MakeNetworkRequest({
        url,
        method,
        data
      }).then((response) => {
        if (response.message === 'Invalid authorization token') {
          window.location.href = 'login.html';
        }
        const userFirstName = document.querySelector('.user-fname');
        const dpFirstName = document.querySelector('.dp-fname');
        const dplastName = document.querySelector('.dp-lname');
        const telBox = document.querySelector('#tel');
        const aboutBox = document.querySelector('#about');
        const dpEmail = document.querySelector('.dp-email');
        const dpImage = document.querySelector('#image-field');
        const thumbnail = document.querySelector('#thumbnail');

        const userDp = response.user[0].profile_image ? response.user[0].profile_image : './imgs/userface.png';

        userFirstName.innerHTML = response.user[0].first_name;
        dpFirstName.innerHTML = response.user[0].first_name;
        dplastName.innerHTML = response.user[0].last_name;
        dpEmail.innerHTML = response.user[0].email;
        dpImage.setAttribute('src', userDp);
        thumbnail.setAttribute('src', userDp);

        if (response.user[0].phone_number) {
          telBox.value = response.user[0].phone_number;
        } else {
          telBox.value = "";
        }
        if (response.user[0].about) {
          aboutBox.value = response.user[0].about;
        } else {
          aboutBox.value = "";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateProfileImage() {
    const dpImageSaveBtn = document.querySelector('.profile-image-save');
    const dpSpin = document.querySelector('.dp-spin');

    dpImageSaveBtn.addEventListener('click', (e) => {
      const token = new ProfileClient().checkToken();
      const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/user/update`;
      const formData = new FormData();
      formData.append('profileImage', dpImage)

      animateSpin(dpImageSaveBtn, dpSpin);

      fetch(url, {
          method: 'put',
          body: formData,
          mode: 'cors',
          headers: {
            'x-access-token': token,
          }
        })
        .then(res => res.json())
        .then((response) => {
          animateSpinDisabled(dpImageSaveBtn, dpSpin);
          if (response.message === 'Invalid authorization token') {
            window.location.href = 'login.html';
          }
          window.location.href = 'profile.html';
          dpImageSaveBtn.style.display = 'none';
        })
        .catch(err => err);
    });
  }

  updateTel() {
    const telSave = document.querySelector('.tel-save');
    const telSpin = document.querySelector('.tel-spin');
    telSave.addEventListener('click', () => {
      const telBox = document.querySelector('#tel');
      const url = 'https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/user/update';
      const token = new ProfileClient().checkToken();
      const method = 'put';
      const body = {
        tel: telBox.value,
      }
      const data = {
        token,
        body,
      }

      animateSpin(telSave, telSpin);

      MakeNetworkRequest({
          url,
          method,
          data
        }).then((response) => {
          animateSpinDisabled(telSave, telSpin);
          if (response.message === 'Invalid authorization token') {
            window.location.href = 'login.html';
          }
          console.log(response);
          window.location.href = 'profile.html';
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
  updateAbout() {
    const aboutSave = document.querySelector('.about-save');
    const aboutSpin = document.querySelector('.about-spin');
    aboutSave.addEventListener('click', () => {
      const aboutBox = document.querySelector('#about');
      const url = 'https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/user/update';
      const token = new ProfileClient().checkToken();
      const method = 'put';
      const body = {
        about: aboutBox.value,
      }
      const data = {
        token,
        body,
      }

      animateSpin(aboutSave, aboutSpin);

      MakeNetworkRequest({
          url,
          method,
          data
        }).then((response) => {
          animateSpinDisabled(aboutSave, aboutSpin);
          if (response.message === 'Invalid authorization token') {
            window.location.href = 'login.html';
          }
          window.location.href = 'profile.html';
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getAllCategories() {
    const category = document.querySelector('.category-wrap');
    const colors = ['#81ecec', '#fd79a8', '#fdcb6e', '#00b894', '#cd84f1'];
    const token = new ProfileClient().checkToken();
    const data = {
      token,
    }
    const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/categories`;
    const method = 'get';

    MakeNetworkRequest({
        url,
        method,
        data
      }).then((response) => {
        if (response.message === 'Invalid authorization token') {
          window.location.href = 'login.html';
        }
        response.categories.map((item) => {
          // const opt = document.createElement('li');
          // opt.setAttribute('value', item.category_id);
          // opt.innerText = item.title;
          // category.append(opt);
          const list = `<l1 class="items" style="background-color: ${colors[item.color_id]}">${item.title}
                            <i class="fas fa-times-circle"></i>
                        </l1>`;
          category.innerHTML += list;
        });
      })
      .catch((err) => {
        console.log(err.toString());
      });
  }

  addCategory() {
    const categoryForm = document.querySelector('#category-form');
    const btn = document.querySelector('.btn');
    const payLoad = document.querySelector('.display-payload');
    const spin = document.querySelector('.category-spin');
    const errfield = document.querySelector('.errfield');
    categoryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      errfield.innerHTML = "";
      payLoad.style.display = 'none';

      animateSpin(btn, spin);

      const url = 'https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/categories';
      const body = getUserInput(event.target);
      const token = new ProfileClient().checkToken();
      const method = 'post';
      const data = {
        token,
        body
      }

      MakeNetworkRequest({
          url,
          method,
          data
        }).then((response) => {
          if (response.message === 'Invalid authorization token') {
            window.location.href = 'login.html';
          }

          animateSpinDisabled(btn, spin);

          if (typeof response.message === 'object') {
            errfield.innerHTML = response.message.title[0];
          } else {
            if (response.message === 'Category created successufully!') {
              handlePayLoad(response.message, payLoad);
              window.location.reload(true);
            } else {
              handlePayLoad(response.message, payLoad);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getAllEntry() {
    const totalEntries = document.querySelector('.total-entries');
    const token = new ProfileClient().checkToken();
    const data = {
      token,
    }

    const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/entries`;
    const method = 'get';
    MakeNetworkRequest({
        url,
        method,
        data
      }).then((response) => {
        if (response.message === 'Invalid authorization token') {
          window.location.href = 'login.html';
        }
        if (response.message === 'There\'s no entry to display') {
          totalEntries.innerHTML = '0';
        } else {
          totalEntries.innerHTML = response['Number of entries added'];
        }

      })
      .catch((err) => {
        console.log(err);
      });
  }
}

new ProfileClient().init();