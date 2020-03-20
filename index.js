const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
      dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
      inputCitiesTo = formSearch.querySelector('.input__cities-to'),
      dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
      inputDateDepart = formSearch.querySelector('.input__date-depart');


const citiesAPI = 'http://api.travelpayouts.com/data/ru/cities.json',
      calendar = 'https://min-prices.aviasales.ru/calendar_preload',
      proxy = 'https://cors-anywhere.herokuapp.com/';

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

const renderCheapDay = (cheapTicket) => {

};

const renderCheapYear = (cheapTickets) => {
    const sorted = cheapTickets.sort((a, b) => a.value - b.value);
    console.log(sorted);
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
    const citiesFrom = cities.find((item) => inputCitiesFrom.value === item.name);
    const citiesTo = cities.find((item) => inputCitiesTo.value === item.name);
    if (!citiesFrom && !citiesTo) return;
    const formData = {
        from: citiesFrom.code,
        to: citiesTo.code,
        when: inputDateDepart.value
    };

    const requestString = `?depart_date=${formData.when}&origin=${formData.from}` +
                          `&destination=${formData.to}&one_way=true`;

    getData(calendar + requestString, (response) => {
        renderCheap(response, formData.when);
    });
});

getData(proxy + citiesAPI, (data) => {
    const dataCities = JSON.parse(data);
    cities = dataCities.filter(el => el.name);
});



/*
getData(proxy + calendar + '?origin=SVX&destination=KGD&depart_date=2020-05-25&one_way=true&token' + API_KEY, (data) => {
    const cheapTicket = JSON.parse(data).best_prices.filter(item => item.depart_date === '2020-05-29')
    console.log(cheapTicket);
});
*/