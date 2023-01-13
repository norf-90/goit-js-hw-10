import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const warningMessage =
  'Too many matches found. Please enter a more specific name.';
const failureMessage = 'Oops, there is no country with that name.';

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
  deleteMarkup();

  if (!event.target.value.trim()) {
    return;
  }

  fetchCountries(event.target.value.trim())
    .then(result => {
      if (result.length > 10) {
        Notify.warning(warningMessage);
        return;
      }

      if (result.length > 1) {
        createMarkupForFew(result);
        return;
      }
      createMarkupForOne(result);
    })
    .catch(err => {
      console.error(err);
      if (err.message.includes('404')) {
        Notify.failure(failureMessage);
      }
    });
}

function createMarkupForFew(countries) {
  const markup = countries
    .map(country => {
      return `<li>
        <div class="country-item"><img class="country-flag" src="${country.flags.svg}" alt="${country.name.official} flag" height="50">
        <p class="country-name">${country.name.official}</p>
        </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function createMarkupForOne(countries) {
  const markup = countries
    .map(country => {
      const languages = Object.values(country.languages).join(', ');
      return ` <div class="country-info__wrapper"><img src="${country.flags.svg}" alt="${country.name.official} flag" height="50">
      <h1>${country.name.official}</h1></div>
      <p><span class ="counry-info--bold">Capital:</span> ${country.capital}</p>
      <p><span class ="counry-info--bold">Population:</span> ${country.population}</p>
      <p><span class ="counry-info--bold">Languages:</span> ${languages}</p>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}

function deleteMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
