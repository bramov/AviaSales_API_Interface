const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
      dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
      inputCitiesTo = formSearch.querySelector('.input__cities-to'),
      dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
      inputDateDepart = formSearch.querySelector('.input__date-depart'),
      cheapestTicket = document.getElementById('cheapest-ticket'),
      otherCheapTickets = document.getElementById('other-cheap-tickets');


const citiesAPI = 'http://api.travelpayouts.com/data/ru/cities.json',
      calendar = 'https://min-prices.aviasales.ru/calendar_preload',
      proxy = 'https://cors-anywhere.herokuapp.com/',
      MAX_COUNT = 10;

let cities = [];

const getData = (url, callback) => {
  const request = new XMLHttpRequest();

  request.open('GET', url);
  request.addEventListener('readystatechange', () => {
      if (request.readyState !== 4) return;
      if (request.status === 200) {
          callback(request.response);
      } else {
          console.error(request.status);
      }
  });
  request.send();
};


const showCities = (input, list) => {
    list.textContent = '';
    if (input.value !== '') {
        const filterCity = cities.filter((item) => {
            const fixItem = item.name.toLowerCase();
            return fixItem.startsWith(input.value.toLowerCase());
        });
        filterCity.sort((a, b) => a.name.localeCompare(b.name));
        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        })
    }
};

const clickOnCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toUpperCase() === 'LI'){
        input.value = target.textContent;
        list.textContent = '';
    }
};

const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getNameCity = (code) => {
    const objCity = cities.find(item => item.code === code);
    return objCity.name;
};

const getChanges = (num) => {

    if (num) {
        return num === 1 ? 'С одной пересадкой' :
            (num === 2 ? 'С двумя пересадками' : 'Три и более пересадок');
    } else {
        return 'Без пересадок';
    }
};

const getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search/';
    link += data.origin;
    const date = new Date(data.depart_date);

    const day = date.getDate();
    const month = date.getMonth() + 1;

    link += day < 10 ? '0' + day : day;
    link += month < 10 ? '0' + month : month;
    link += data.destination;
    link += '1';
    return link;
};

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');
    let deep = '';
    if (data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviasales(data)}" class="button button__buy" target="_blank">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getNameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                </div>

                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getNameCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        deep = '<h3>К сожалению на данную дату билетов не нашлось!</h3>'
    }

    ticket.insertAdjacentHTML('afterbegin', deep);
    return ticket;
};

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
    const ticket = createCard(cheapTicket[0]);

    cheapestTicket.append(ticket);
};

const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2> Дешевые билеты на другие даты</h2>';
    cheapTickets.sort((a, b) => a.value - b.value);

    for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.append(ticket);
    }


};

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    const cheapTicketDay = cheapTicketYear.filter(el => el.depart_date === date);
    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
};


inputCitiesFrom.addEventListener('input', () => {
    showCities(inputCitiesFrom, dropdownCitiesFrom);
});
document.body.addEventListener('click', (event) => {
    if (event.target.className !== 'dropdown__city'){
        dropdownCitiesFrom.textContent = '';
        dropdownCitiesTo.textContent = '';
    }
});
inputCitiesTo.addEventListener('input', () => {
    showCities(inputCitiesTo, dropdownCitiesTo);
});
dropdownCitiesFrom.addEventListener('click', (event) => {
    clickOnCity(event, inputCitiesFrom, dropdownCitiesFrom);
});
dropdownCitiesTo.addEventListener('click', (event) => {
    clickOnCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const err = document.getElementById('error_input');
    if (err) {
        err.remove();
    }

    const citiesFrom = cities.find((item) => inputCitiesFrom.value === item.name);
    const citiesTo = cities.find((item) => inputCitiesTo.value === item.name);

    const formData = {
        from: citiesFrom,
        to: citiesTo,
        when: inputDateDepart.value
    };
    if (citiesFrom && citiesTo) {
        const requestString = `?depart_date=${formData.when}&origin=${formData.from.code}` +
            `&destination=${formData.to.code}&one_way=true`;

        getData(calendar + requestString, (response) => {
            renderCheap(response, formData.when);
        });
    } else {
        const button = document.querySelector('.wrapper__button');
        const errText = '<h2 id="error_input">Некорректное название города!</h2>';
        button.insertAdjacentHTML('beforebegin', errText);

    }
});

getData(proxy + citiesAPI, (data) => {
    const dataCities = JSON.parse(data);
    cities = dataCities.filter(el => el.name);
});



