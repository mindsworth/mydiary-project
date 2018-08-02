const email = document.querySelector("#email");
const password = document.querySelector('#password');
const btn = document.querySelector('form');
const errfield = document.querySelectorAll("label");

const url = 'http://localhost:3000/api/v1/auth/login';

const getData = async (e) => {
  e.preventDefault();

  for (const err of errfield) {
    err.innerHTML = "";
  }

  const data = {
    email: email.value,
    password: password.value,
  };

  const request = {
    method: 'POST',
    headers: {
      'content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  console.log(data);

  const dataFetched = await fetch(url, request);
  const result = await dataFetched.json();

  console.log(result);
  console.log(result.message);

  const errLog = result.message;

  for (const err in errLog) {
    if (err === 'email') {
      errfield[0].innerHTML = errLog[err][0];
    } else if (err === 'password') {
      errfield[1].innerHTML = errLog[err][0];
    }
  }
};

btn.addEventListener('submit', getData);