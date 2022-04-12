import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './api/fetchCountries.js';
import debounce from 'lodash.debounce';
import { func } from 'joi';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  event.preventDefault;

  const searchName = event.target.value.trim();

  console.log(searchName);
  fetchCountries(searchName)
    .then(countries => {
      if (countries.length >= 10) {
        searchingInfo();
        refs.countryInfo.innerHTML = '';
      } else if (countries.length === 1) {
        renderInfo(countries);
        refs.countryList.innerHTML = '';
      } else if (countries.length <= 10) {
        renderList(countries);
        refs.countryInfo.innerHTML = '';
        setTimeout(() => {
          refs.countryList.innerHTML = '';
        }, 3000);
      } else if (countries.length === undefined) {
        onFetchError();
      }
      if (searchName === '') {
        refs.countryInfo.innerHTML = '';
        refs.countryList.innerHTML = '';
      }
    })

    .catch(error => {
      console.log(error);
    });
}

function renderList(countries) {
  const markupList = countries
    .map(({ name, flags }) => {
      return ` <li>
      <span class="flag__list"><img class="flag__mini" src="${flags.svg}" alt="img"></span>
      <span class="country">${name.official}</span>
    </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markupList;
  return markupList;
}

function renderInfo(countries) {
  const markupInfo = countries
    .map(({ capital, population, languages, flags }) => {
      return ` <p class="country"><span class="flag"><img class="flag__info" src="${
        flags.svg
      }" alt="img"></span></p>
        <p class="capital">Capital: ${capital}</p>
        <p class="population">Population: ${population}</p>
        <p class="languages">Languages: ${Object.values(languages).join(', ')}</p> `;
    })
    .join('');

  refs.countryInfo.innerHTML = markupInfo;
  return markupInfo;
}

function searchingInfo() {
  setTimeout(() => {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }, 1000);
}

function onFetchError() {
  setTimeout(() => {
    Notify.failure('Oops, there is no country with that name');
  }, 1000);
}
