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
      'content-type': 'application/json',
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

class ProfileClient {
  init() {
    new ProfileClient().addCategory();
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return null;
    }
    return token;
  }

  addCategory() {
    const categoryForm = document.querySelector('#category-form');
    const btn = document.querySelector('.btn');
    const payLoad = document.querySelector('.display-payload');
    const spin = document.querySelector('.fa-spinner');
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
}

new ProfileClient().init();