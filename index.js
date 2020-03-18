const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
      dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
      inputCitiesTo = formSearch.querySelector('.input__cities-to'),
      dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
      inputDateDepart = formSearch.querySelector('.input__date-depart');

const cities = ['Москва', 'Санкт-Петербург', 'Минск', 'Караганда', 'Челябинск',
'Керчь', 'Волгоград', 'Самара', 'Днепропетровск', 'Екатеринбург', 'Одесса',
'Ухань', 'Нижний новгород', 'Калининград', 'Вроцлав', 'Ростов-на-Дону'];

const showCities = (input, list) => {
    list.textContent = '';
    if (input.value !== '') {
        const filterCity = cities.filter((item) => {
            const fixItem = item.toLowerCase();
            return fixItem.includes(input.value.toLowerCase());
        });
        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
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
}


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