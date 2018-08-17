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
    description: formInput.get('description'),
    categoryId: formInput.get('category'),
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

const displayErrors = (errorLog, errfield) => {
  for (const err in errorLog) {
    if (err === 'title') {
      errfield[0].innerHTML = errorLog[err][0];
    } else if (err === 'description') {
      errfield[1].innerHTML = errorLog[err][0];
    }
  }
};

const handlePayLoad = (message, payLoad) => {
  payLoad.innerHTML = `${message}`;
  payLoad.style.display = 'block';
};

class EntryClient {
  init() {
    new EntryClient().getAllCategories();
    new EntryClient().addEntry();
    new EntryClient().logout();
    new EntryClient().getUserDetails();
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

  getUserDetails() {
    const token = new EntryClient().checkToken();
    const method = 'get';
    const url = 'https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/user';
    const data = {
      token,
    };
    MakeNetworkRequest({
        url,
        method,
        data
      })
      .then((response) => {
        const userFirstName = document.querySelector('.user-fname');
        userFirstName.innerHTML = response.user[0].first_name;
        // console.log('User: ', response.user);
      })
      .catch(err => err);
  }

  getAllCategories() {
    const category = document.querySelector('#category');
    const token = new EntryClient().checkToken();
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
          const opt = document.createElement('option');
          opt.setAttribute('value', item.category_id);
          opt.innerText = item.title;
          category.append(opt);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addEntry() {
    const create = document.querySelector('#create');
    const btn = document.querySelector('.cta-btn');
    const spin = document.querySelector('.fa-spinner');
    const payLoad = document.querySelector('.display-payload');
    const errfield = document.querySelectorAll("label");

    create.addEventListener('submit', (event) => {
      event.preventDefault();
      payLoad.style.display = 'none';
      for (const err of errfield) {
        err.innerHTML = "";
      }

      animateSpin(btn, spin);
      const token = new EntryClient().checkToken();
      const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/entries`;
      const body = getUserInput(event.target);
      const data = {
        token,
        body
      }
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
            if (response.message === 'ENTRY CREATED SUCCESSFULLY.') {
              handlePayLoad(response.message, payLoad);
              window.location.reload(true);
            } else {
              handlePayLoad(response.message, payLoad);
              if (response.message === 'Invalid authorization token') {
                window.location.href = 'login.html';
              }
            }
          }
        })
        .catch((err) => {
          console.log(err.toString());
        });
    });
  }
}

new EntryClient().init();