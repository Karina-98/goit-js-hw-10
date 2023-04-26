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
    if (inputValue.trim() === 0) {
        Notiflix.Notify.warning('Please enter country name.');
        clearHtml();
        return;
    }



    fetchCountries(inputValue).then((data) => {
        clearHtml();
        if (data.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
        } else if (data.length > 2 && data.length <= 10) {
            createMarkup(data)
            
        } else if (data.length === 1) {
            createMarkupAll(data)
           
        } else if (data.status === 404) {
            console.log(data);
        Notiflix.Notify.failure('Oops, there is no country with that name')
        }
    }).catch(error => {error});

    
}

function createMarkup(data) {
    const markup = data.map(({ name, flags }) => `
    <li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="flag of ${name.official}"  width="40" height="30" />
        <p class="country-list__text">${name.official}</p>
      </li>`).join('');

    return countryList.innerHTML = markup;
}


function createMarkupAll(data) {
    const markup = data.map(({ name, capital, population, flags, languages }) =>
        `<div class="country__flag">
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
    </ul>`).join('');

    return countryInfo.innerHTML = markup;

}

function clearHtml() {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
}