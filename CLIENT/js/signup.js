const email = document.querySelector("#email");
const firstName = document.querySelector('#fname');
const lastName = document.querySelector('#lname');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm-password');
const btn = document.querySelector('form');
const errfield = document.querySelectorAll("label");

let url = 'https://chigoziem-mydiary-bootcamp-';
url += 'app.herokuapp.com/api/v1/signup';

btn.addEventListener('submit', (e) => {
  e.preventDefault();
  for (const err of errfield) {
    err.innerHTML = "";
  }

  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    password_confirmation: confirmPassword.value,
  };

  const fetchData = {
    method: 'POST',
    headers: {
      'content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  const getData = async () => {
    const dataFetched = await fetch(
      'http://localhost:3000/api/v1/auth/signup',
      fetchData,
    );
    const result = await dataFetched.json();
    // console.log(result);
    // console.log(data);
    // console.log(result.message);
    console.log(result.token);

    if (result.token) {
      localStorage.setItem('token', result.token);
      window.location.href = './dashboard.html';
    }

    const errLog = result.message;
    console.log(errLog);

    for (const err in errLog) {
      if (err === 'email') {
        errfield[0].innerHTML = errLog[err][0];
      } else if (err === 'firstName') {
        errfield[1].innerHTML = errLog[err][0];
      } else if (err === 'lastName') {
        errfield[2].innerHTML = errLog[err][0];
      } else if (err === 'password') {
        errfield[3].innerHTML = errLog[err][0];
      } else if (err === 'password_confirmation') {
        errfield[4].innerHTML = errLog[err][0];
      }
    }
  };

  getData();
});