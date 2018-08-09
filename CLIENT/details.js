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

class DetailsClient {
  init() {
    new DetailsClient().getSingleEntry();
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return null;
    }
    return token;
  }

  getSingleCategory() {

  }

  getSingleEntry() {
    const title = document.querySelector('.title');
    const category = document.querySelector('.category');
    const description = document.querySelector('.description');
    const token = new DetailsClient().checkToken();
    const data = {
      token,
    }
    const entryId = localStorage.getItem('entry_id');
    const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/entries/${entryId}?token=${token}`;
    const method = 'get';
    MakeNetworkRequest({
        url,
        method,
        data
      }).then((response) => {
        if (response.message === 'Invalid authorization token') {
          window.location.href = 'login.html';
        }
        console.log(response);
        title.innerHTML = response.entry[0].title;
        category.innerHTML = response.entry[0].category;
        description.innerHTML = response.entry[0].description;
        // response.categories.map((item) => {
        //   const opt = document.createElement('option');
        //   opt.setAttribute('value', item.category_id);
        //   opt.innerText = item.title;
        //   category.append(opt);
        // });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

new DetailsClient().init();