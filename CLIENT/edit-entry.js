const MakeNetworkRequest = (input = {
  url: '',
  method: '',
  data: ''
}) => {
  const reqObject = {
    method: input.method,
    mode: 'cors',
  };

  if (input.method === 'get' || input.method === 'delete') {
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

const handlePayLoad = (message, payLoad) => {
  payLoad.innerHTML = `${message}`;
  payLoad.style.display = 'block';
};

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

class EditPageClient {
  init() {
    new EditPageClient().getSingleEntry();
    new EditPageClient().getAllCategories();
    new EditPageClient().updateEntry();
    new EditPageClient().logout();
    new EditPageClient().getUserDetails();
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
    const token = new EditPageClient().checkToken();
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

    const token = new EditPageClient().checkToken();
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
        console.log(err.toString());
      });
  }

  getSingleEntry() {
    const title = document.querySelector('.title');
    const description = document.querySelector('.description');
    const token = new EditPageClient().checkToken();
    const data = {
      token,
    }
    let entryId = location.search.split('entryid=')[1];
    const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/entries/${entryId}`;
    const method = 'get';
    MakeNetworkRequest({
        url,
        method,
        data
      }).then((response) => {
        if (response.message === 'Invalid authorization token') {
          window.location.href = 'login.html';
        }
        title.value = response.entry[0].title;
        description.value = response.entry[0].description;
      })
      .catch((err) => {
        console.log(err.toString());
      });
  }

  updateEntry() {
    const editEntry = document.querySelector('#edit-entry');
    const payLoad = document.querySelector('.display-payload');
    const btn = document.querySelector('.cta-btn');
    const spin = document.querySelector('.fa-spinner');
    editEntry.addEventListener('submit', (event) => {
      event.preventDefault();
      const body = getUserInput(event.target);
      const token = new EditPageClient().checkToken();
      const data = {
        token,
        body
      }
      animateSpin(btn, spin);
      let entryId = location.search.split('entryid=')[1];
      const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/entries/${entryId}`;
      const method = 'put';
      MakeNetworkRequest({
          url,
          method,
          data
        }).then((response) => {
          animateSpinDisabled(btn, spin);
          if (response.message === 'Invalid authorization token') {
            window.location.href = 'login.html';
          }
          handlePayLoad(response.message, payLoad);
          window.location.href = 'dashboard.html';
        })
        .catch((err) => {
          console.log(err.toString());
        });
    });
  }
}

new EditPageClient().init();