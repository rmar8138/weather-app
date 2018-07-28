import { elements } from './base';
import { Spinner } from 'spin.js';

export const displayWeather = (icon, description, date, temp, lo, hi, place) => {
    const weatherCardTemplate = `
        <div class="card__place-name">
            <h2 class="heading-secondary">${place}</h2>
        </div>
        <div class="card__temp">
            <span class="card__temp--date">${date}</span>
            <span class="card__temp--main">${Math.round(temp)}&deg;C</span>
            <span class="card__temp--hi-lo">${Math.round(lo)}&deg;C | ${Math.round(hi)}&deg;C</span>
        </div>
        <div class="card__icon">
            <img class="card__icon__img" src="https://www.metaweather.com/static/img/weather/${icon}.svg" alt="${description}">
            <span class="card__icon__description">${description}</span>
        </div>
    `;

    const listContainer = `
        <div class="card__next-five">
            <ul class="card__next-five__list"></ul>
        </div>
    `;

    // while (elements.card.firstChild) {
    //     elements.card.removeChild(elements.card.firstChild);
    // }

    elements.card.removeChild(elements.cardPlaceName);
    elements.card.removeChild(elements.cardTemp);
    elements.card.removeChild(elements.cardIcon);
    elements.card.removeChild(elements.cardNextFive);

    elements.card.insertAdjacentHTML('beforeend', weatherCardTemplate);
    elements.card.insertAdjacentHTML('beforeend', listContainer);
};

export const displayNextFive = (icon, description, date, temp, lo, hi) => {
    const nextFiveTemplate = `
        <li class="card__next-five__list-item">
            <img class="card__next-five__list-item__img" src="https://www.metaweather.com/static/img/weather/${icon}.svg" alt="${description}">
            <div class="card__next-five__list-item__temp">
                <span class="card__next-five__list-item__temp--main">${Math.round(temp)}&deg;C</span>
                <span class="card__next-five__list-item__temp--hi-lo">${Math.round(lo)}&deg;C ${Math.round(hi)}&deg;C</span>
                <span class="card__next-five__list-item__temp--date">${date}</span>
            </div>
        </li>
    `;

    document.querySelector('.card__next-five__list').insertAdjacentHTML('beforeend', nextFiveTemplate);
};

export const displaySpinner = (target) => {
    // SPINNER SETTINGS (powered by spin.js)
    let opts = {
        lines: 13, // The number of lines to draw
        length: 38, // The length of each line
        width: 17, // The line thickness
        radius: 45, // The radius of the inner circle
        scale: 0.4, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#dbdbde', // CSS color or array of colors
        fadeColor: 'transparent', // CSS color or array of colors
        speed: 1, // Rounds per second
        rotate: 0, // The rotation offset
        animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
        direction: 1, // 1: clockwise, -1: counterclockwise
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: '0 0 1px transparent', // Box-shadow for the lines
        position: 'absolute' // Element positioning
    };

    let spinner = new Spinner(opts).spin(target);
};

export const removeSpinner = () => {
    document.querySelector('.spinner').remove();
};

export const setBackground = todaysWeather => {
    const weatherAbbrv = todaysWeather.weather_state_abbr;
    // remove existing weather bg class
    elements.card.classList.remove(elements.card.classList[1]);
    elements.card.classList.add(`bg-${weatherAbbrv}`);
};

export const addBlur = () => {
    // blur background during loading + modal popup
    elements.card.classList.add('blur');
};

export const removeBlur = () => {
    // remove blur background 
    elements.card.classList.remove('blur');
};


