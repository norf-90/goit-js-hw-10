import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
  if (event.target.value.trim().length > 0) {
    fetchCountries(event.target.value.trim())
      .then(result => {
        console.log(result);
        if (result.status === 404) {
          throw new Error(`Result status: ${result.status}`);
        }
        if (result.length > 10) {
          Notify.warning(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }
        createMarkup(result);
      })
      .catch(err => {
        console.error(err);
        Notify.failure('Oops, there is no country with that name.');
      });
  }
}

function createMarkup(counries) {
  if (counries.length > 1) {
    const markup = counries
      .map(country => {
        return `<li>
      <div class="country-item"><img class="country-flag" src="${country.flags.svg}" alt="${country.name.official} flag" height="50">
      <p class="country-name">${country.name.official}</p>
      </li>`;
      })
      .join('');
    refs.countryList.innerHTML = markup;
    return;
  }

  const markup = counries
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
