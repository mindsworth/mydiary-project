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

const redirect = (response) => {
  if (response.newEntry) {
    localStorage.setItem('entry_id', response.newEntry[0].entry_id);
    window.location.href = 'details.html';
  }
};

class EntryClient {
  init() {
    new EntryClient().getAllCategories();
    new EntryClient().addEntry();
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return null;
    }
    return token;
  }

  getAllCategories() {
    const category = document.querySelector('#category');
    const token = new EntryClient().checkToken();
    const data = {
      token,
    }
    const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/categories?token=${token}`;
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
          // const opt = `<option value="${item.category_id}">${item.title}</option>`;
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
      const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/entries?token=${token}`;
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
            if (response.message === 'ENTRY CREATED SUCCESSFULLY.') {
              handlePayLoad(response.message, payLoad);
              redirect(response);
            } else {
              handlePayLoad(response.message, payLoad);
              if (response.message === 'Invalid authorization token') {
                window.location.href = 'login.html';
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}

new EntryClient().init();