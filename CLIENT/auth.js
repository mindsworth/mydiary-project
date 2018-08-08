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
    firstName: formInput.get('fname'),
    lastName: formInput.get('lname'),
    email: formInput.get('email'),
    password: formInput.get('password'),
    password_confirmation: formInput.get('confirmPassword'),
  };
  return data;
}

const displayErrors = (errorLog) => {
  const errfield = document.querySelectorAll("label");

  for (const err of errfield) {
    err.innerHTML = "";
  }

  for (const err in errorLog) {
    if (err === 'email') {
      errfield[0].innerHTML = errorLog[err][0];
    } else if (err === 'firstName') {
      errfield[1].innerHTML = errorLog[err][0];
    } else if (err === 'lastName') {
      errfield[2].innerHTML = errorLog[err][0];
    } else if (err === 'password') {
      errfield[3].innerHTML = errorLog[err][0];
    } else if (err === 'password_confirmation') {
      errfield[4].innerHTML = errorLog[err][0];
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

const handlePayLoad = (message) => {
  const payLoad = document.querySelector('.display-payload');

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
    new AuthenticationClient().SignupUser();
  }

  SignupUser() {
    const form = document.querySelector('form');
    const btn = document.querySelector('button');
    const spin = document.querySelector('.fa-spinner');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      animateSpin(btn, spin);

      const url = 'https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/auth/signup';
      const data = getUserInput(event.target);
      const method = 'post';

      const fetchedData = MakeNetworkRequest({
          url,
          method,
          data
        }).then((response) => {

          animateSpinDisabled(btn, spin);

          if (typeof response.message === 'object') {
            displayErrors(response.message);
          } else {
            if (response.message === 'Registration Successful') {
              handlePayLoad(response.message);
              redirect(response);
            } else {
              console.log('Error', response.message);
              handlePayLoad(response.message);
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