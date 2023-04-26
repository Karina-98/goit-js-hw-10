import './css/styles.css';
import debounce from 'lodash.debounce';
import fetchCountries from './js/fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('input');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');


input.addEventListener("input", debounce(onInputSource, DEBOUNCE_DELAY))

function onInputSource(e) {
    e.preventDefault()
    const inputValue = e.target.value;
    fetchCountries(inputValue).then((data) => {
        if (data === undefined) {
            Notify.failure('Oops, there is no country with that name')
        } else if (data.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.')
        } else if (data.length > 2 && data.length <= 10) {
             data.reduce((markup, form)=> createMarkup(form), "")
        } else if (data.length === 1) {
            data.reduce((markup, form)=> createMarkupAll(form), "")
        } else if (data.status === 404) {
            console.log(data)
            Notiflix.Notify.failure('Oops, there is no country with that name')
        }
    })

    
}

function createMarkup({name, flags }) {
    return countryList.innerHTML = `
    <li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="flag of ${name.official}"  width="40" height="30" />
        <p class="country-list__text">${name.official}</p>
      </li>`;
    console.log(form);
    
}


function createMarkupAll({ name, capital, population, flags, languages }) {
    return countryList.innerHTML = `<div class="country__flag">
        <img class="country__img" src="${flags.svg}" alt="flag of ${name.official}" width="40" height="30">
        <p class="country__name">${name.official}</p>
    </div>
    <ul class="country__info">
        <li class="country__item"> <b>Capital</b>:
        <span class="country__span">${capital}</span>
        </li>
        <li class="country__item"> <b>Population</b>:
        <span class="country__span">${population}</span>
        </li>
        <li class="country__item"> <b>Languages</b>:
        <span class="country__span">${Object.values(languages).join(', ')}</span>
        </li>
    </ul>`
}

function clearHtml() {
    countryList.innerHTML = "";
    countryInfo.innerHTML = ""
}