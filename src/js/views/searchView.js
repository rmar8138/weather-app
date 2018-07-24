import { elements } from './base';

export const getSearch = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const displaySearch = () => {
    // set display of search list to block from none
    elements.searchResults.classList.add('active');
};

export const removeSearch = () => {
    // remove search list
    elements.searchResults.classList.remove('active');
};

export const generateSearchList = (location, woeid) => {
    const listItemTemplate = `
        <li class="search__results__item" data-woeid="${woeid}">${location}</li>
    `;

    elements.searchResults.insertAdjacentHTML('beforeend', listItemTemplate);
};
