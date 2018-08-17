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

const bindEntryData = (entry, itemColor, itemTitle) => {
  let title = entry.title;
  let description = entry.description;
  const updatedAt = timeSince(new Date(entry.updatedat));
  const entry_id = entry.entry_id;
  if (entry.title.length > 18) {
    title = `${entry.title.substring(0, 18)}...`;
  }
  if (entry.description.length > 100) {
    description = `${entry.description.substring(0, 120)}...`;
  }
  const entryWrap = `<div class="diary-entry" style="border-top-color: ${itemColor}">
                    <div class="header">
                        <h4 class="title">${title}</h4>
                        <div class="edit">
                            <i class="fas fa-ellipsis-h">
                                <div class="drawer">
                                    <ul>
                                        <li>
                                            <a href="./editentry.html?entryid=${entry_id}">
                                                <i class="fas fa-pencil-alt"></i>Edit</a>
                                        </li>
                                        <li>
                                            <a data-entryId="${entry_id}" href="#">
                                                <i class="fas fa-trash-alt"></i>Delete</a>
                                        </li>
                                    </ul>
                                </div>
                            </i>
                        </div>
                    </div>
                    <h5 class="category">${itemTitle}</h5>
                    <a href="./details.html?entryid=${entry_id}">
                        <p class="description">${description}</p>
                    </a>
                    <div class="notice">
                        <div class="fav">
                            <i data-favEntryId="${entry_id}" class="fas fa-heart"></i>
                        </div>
                        <div class="timer">Last updated - ${updatedAt}</div>
                    </div>
                </div>`;
  return entryWrap;
};

let status = false;

class DashboardClient {
  init() {
    new DashboardClient().getAllEntry();
    new DashboardClient().handleModal();
    new DashboardClient().getUserDetails();
    new DashboardClient().handleFavorite();
    new DashboardClient().logout();
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

  handEditIcon() {
    const pencil = document.querySelector('.fa-pencil-alt');

    pencil.addEventListener('click', () => {
      localStorage.setItem('entry_id', '');
    });
  }

  handleModal() {
    const modalOlay = document.querySelector('.modal-olay');
    const modalClose = document.querySelector('.cancel');
    document.addEventListener('click', (event) => {

      if (event.target.dataset.entryid) {
        const entryId = event.target.dataset.entryid;
        modalOlay.style.display = 'flex';
        new DashboardClient().deleteEntry(entryId);
      }
    });

    modalClose.addEventListener('click', () => {
      modalOlay.style.display = 'none';
    });
  }

  getSingleCategory(item) {
    const content = document.querySelector('.content');
    const colors = ['#81ecec', '#fd79a8', '#fdcb6e', '#00b894', '#cd84f1'];
    const token = new DashboardClient().checkToken();
    const data = {
      token,
    }

    const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/categories/${item.category_id}`;
    const method = 'get';
    MakeNetworkRequest({
        url,
        method,
        data
      }).then((response) => {
        const itemColor = colors[response.category[0].color_id];
        const itemTitle = response.category[0].title;
        content.innerHTML += bindEntryData(item, itemColor, itemTitle);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteEntry(entryId) {
    const accept = document.querySelector('.accept');

    accept.addEventListener('click', (event) => {
      event.preventDefault();

      const token = new DashboardClient().checkToken();
      const data = {
        token,
      }

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
          window.location.reload(true);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getUserDetails() {
    const token = new DashboardClient().checkToken();
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

  getAllEntry() {
    const content = document.querySelector('.content');
    const token = new DashboardClient().checkToken();
    const data = {
      token,
    }

    const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/entries`;
    const method = 'get';
    MakeNetworkRequest({
        url,
        method,
        data
      }).then((response) => {
        if (response.message === 'Invalid authorization token') {
          window.location.href = 'login.html';
        }
        if (response.entries.length > 0) {
          content.innerHTML = "";
        }
        if (response.entries.length < 3) {
          content.style.gridTemplateColumns = 'repeat(auto-fit, minmax(22rem, 27rem))';
        }
        response.entries.map((item) => {
          new DashboardClient().getSingleCategory(item);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleFavorite() {
    document.addEventListener('click', (event) => {
      if (event.target.className === 'fas fa-heart') {
        const entryId = parseInt(event.target.dataset.faventryid, 10);
        const token = new DashboardClient().checkToken();
        status = !status;
        console.log(typeof entryId);
        const body = {
          favStatus: status,
        };
        const data = {
          token,
          body,
        };
        console.log(data);

        const url = `https://chigoziem-mydiary-bootcamp-app.herokuapp.com/api/v1/favorite/${entryId}`;
        const method = 'put';
        MakeNetworkRequest({
            url,
            method,
            data
          }).then((response) => {
            if (response.message === 'Invalid authorization token') {
              window.location.href = 'login.html';
            }
            console.log(response)
            // if (response.entries.length > 0) {
            //   content.innerHTML = "";
            // }
            // if (response.entries.length < 3) {
            //   content.style.gridTemplateColumns = 'repeat(auto-fit, minmax(22rem, 27rem))';
            // }
            // response.entries.map((item) => {
            //   new DashboardClient().getSingleCategory(item);
            // });
          })
          .catch((err) => {
            console.log(err.toString());
          });
      }
    });
  }
}

new DashboardClient().init();