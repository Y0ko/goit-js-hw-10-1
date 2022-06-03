import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
// import { render } from 'sass';

const DEBOUNCE_DELAY = 300;
const debounce = require('lodash.debounce');
const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onTextInput, DEBOUNCE_DELAY));

function onTextInput(e) {
  const inputValue = e.target.value.trim();
  if (inputValue === '') {
    clearInterface();
    return;
  }
  fetchCountries(inputValue)
    .then(renderCountries)
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearInterface();
    });
}

function renderCountries(countries) {
  if (countries.length > 10) {
    clearInterface();
    return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }
  if ((countries.length >= 2) & (countries.length <= 10)) {
    const markup = countries
      .map(country => {
        const { flags, name } = country;
        return `<li>
      <img src="${flags.svg}" alt="${name.official}" width="50">
      <span>${name.official}</span>
        </li>`;
      })
      .join('');
    refs.countryList.innerHTML = markup;
    refs.countryInfo.innerHTML = '';
  }

  if (countries.length === 1) {
    refs.countryList.innerHTML = '';
    const markup = countries
      .map(country => {
        const { flags, name, capital, population, languages } = country;
        return `<p>
      <img src="${flags.svg}" alt="${name.official}" width="70">
      <h2>${name.official}</h2>
        </p>
        <p><b>Capital:</b>${capital}</p>
        <p><b>Population:</b>${population}</p>
        <p><b>Languages:</b>${Object.values(languages)}</p>`;
      })
      .join('');
    refs.countryInfo.innerHTML = markup;
  }
}

function clearInterface() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
