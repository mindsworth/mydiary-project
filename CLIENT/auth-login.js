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
    };
    reqObject.body = JSON.stringify(input.data);
  }

  return fetch(input.url, reqObject)
    .then(response => response.json())
    .catch(err => err);
};

const getUserInput = function (input) {
  const formInput = new FormData(input);
  const data = {
    email: formInput.get('email'),
    password: formInput.get('password'),
  };
  return data;
}

const displayErrors = (errorLog, errfield) => {
  for (const err in errorLog) {
    if (err === 'email') {
      errfield[0].innerHTML = errorLog[err][0];
    } else if (err === 'password') {
      errfield[1].innerHTML = errorLog[err][0];
    }
  }
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

const redirect = (response) => {
  if (response.token) {
    localStorage.setItem('token', response.token);
    window.location.href = 'dashboard.html';
  }
};

class AuthenticationClient {
  init() {
    new AuthenticationClient().loginUser();
  }

  loginUser() {
    const signup = document.querySelector('#login');
    const btn = document.querySelector('button');
    const spin = document.querySelector('.fa-spinner');
    const payLoad = document.querySelector('.display-payload');
    const errfield = document.querySelectorAll("label");

    signup.addEventListener('submit', (event) => {
      event.preventDefault();
      payLoad.style.display = 'none';
      for (const err of errfield) {
        err.innerHTML = "";
      }

      animateSpin(btn, spin);

      const url = 'https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/auth/login';
      const data = getUserInput(event.target);
      const method = 'post';

      MakeNetworkRequest({
          url,
          method,
          data
        }).then((response) => {

          animateSpinDisabled(btn, spin);

          if (typeof response.message === 'object') {
            displayErrors(response.message, errfield);
          } else {
            if (response.message === 'Logged in successfully.') {
              handlePayLoad(response.message, payLoad);
              redirect(response);
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

new AuthenticationClient().init();