const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
      dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
      inputCitiesTo = formSearch.querySelector('.input__cities-to'),
      dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
      inputDateDepart = formSearch.querySelector('.input__date-depart');


const citiesAPI = 'http://api.travelpayouts.com/data/ru/cities.json',
      aviasalesAPI = 'https://api.travelpayouts.com/v2/prices/latest?currency=usd&period_type=year&page=1&limit=30&show_to_affiliates=true&sorting=price&trip_class=0&token=';
      keyAPI = '738929f7df0e5eff21f6cb943423a2f3';
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


inputCitiesFrom.addEventListener('input', () => {
    showCities(inputCitiesFrom, dropdownCitiesFrom);
});
inputCitiesTo.addEventListener('input', () => {
    showCities(inputCitiesTo, dropdownCitiesTo);
});
dropdownCitiesFrom.addEventListener('click', () => {
    clickOnCity(event, inputCitiesFrom, dropdownCitiesFrom);
});
dropdownCitiesTo.addEventListener('click', () => {
    clickOnCity(event, inputCitiesTo, dropdownCitiesTo);
});


/*
getData(proxy + citiesAPI, (data) => {
    const dataCities = JSON.parse(data);
    cities = dataCities.filter(el => el.name);
});
*/
getData(proxy + 'http://min-prices.aviasales.ru/calendar_preload?origin=SVX&destination=KGD&depart_date=2020-05-25&one_way=true', (data) => {
    const objArr = (JSON.parse(data))['best_prices'];
    console.log(objArr[0]);
});
