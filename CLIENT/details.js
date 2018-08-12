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
    };
    reqObject.body = JSON.stringify(input.data);
  }

  return fetch(input.url, reqObject)
    .then(response => response.json())
    .catch(err => err);
};

const redirect = (response) => {
  if (response.newEntry) {
    localStorage.setItem('entry_id', response.newEntry[0].entry_id);
    window.location.href = 'details.html';
  }
};

const formatDate = (nDate) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const d = nDate.split('T')[0];
  const date = new Date(d)
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const formatedDate = `${month} ${day}, ${year}`;
  return formatedDate;
}

const timeSince = function (date) {
  if (typeof date !== 'object') {
    date = new Date(date);
  }

  const seconds = Math.floor((new Date() - date) / 1000);
  let intervalType;

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'year';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'month';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'day';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "hour";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minute";
          } else {
            interval = seconds;
            intervalType = "second";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's';
  }

  return `${interval}${intervalType} ago`;
};

let entryId;

class DetailsClient {
  init() {
    new DetailsClient().getSingleEntry();
    new DetailsClient().handleModal();
    new DetailsClient().deleteEntry();
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return null;
    }
    return token;
  }

  handEditIcon() {
    const pencil = document.querySelector('.fa-pencil-alt');

    pencil.addEventListener('click', () => {
      localStorage.setItem('entry_id', '');
    });
  }

  handleModal() {
    const trash = document.querySelector('.fa-trash-alt');
    const modalOlay = document.querySelector('.modal-olay');
    const modalClose = document.querySelector('.cancel');

    trash.addEventListener('click', () => {
      modalOlay.style.display = 'flex';
    });

    modalClose.addEventListener('click', () => {
      modalOlay.style.display = 'none';
    });
  }

  getSingleCategory(categoryId) {
    const category = document.querySelector('.category');
    const color = document.querySelector('.color');
    const colors = ['#81ecec', '#fd79a8', '#fdcb6e', '#00b894', '#cd84f1'];
    const token = new DetailsClient().checkToken();
    const data = {
      token,
    }

    const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/categories/${categoryId}`;
    const method = 'get';
    MakeNetworkRequest({
        url,
        method,
        data
      }).then((response) => {
        category.innerHTML = response.category[0].title;
        color.style.backgroundColor = colors[response.category[0].color_id];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteEntry() {
    const accept = document.querySelector('.accept');

    accept.addEventListener('click', () => {
      console.log('Hello');

      const token = new DetailsClient().checkToken();
      const data = {
        token,
      }
      const entryId = location.search.split('entryid=')[1];
      const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/entries/${entryId}`;
      const method = 'delete';

      MakeNetworkRequest({
          url,
          method,
          data
        }).then((response) => {
          if (response.message === 'Invalid authorization token') {
            window.location.href = 'login.html';
          }
          localStorage.setItem('entry_id', '');
          window.location.href = 'dashboard.html';
          console.log(response)
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getSingleEntry() {
    const title = document.querySelector('.title');
    const createdAt = document.querySelector('.createdat');
    const updatedAt = document.querySelector('.updatedat');
    const description = document.querySelector('.description');
    const token = new DetailsClient().checkToken();
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
        title.innerHTML = response.entry[0].title;
        entryId = response.entry[0].entry_id;
        const categoryId = response.entry[0].category_id;
        description.innerHTML = response.entry[0].description;
        new DetailsClient().getSingleCategory(categoryId);
        createdAt.innerHTML = formatDate(response.entry[0].createdat);
        updatedAt.innerHTML = timeSince(new Date(response.entry[0].updatedat));
        redirect(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

new DetailsClient().init();