import '../scss/main.scss'
import Search from './models/Search';
import Result from './models/Result';
import { elements } from './views/base';
import * as searchView from './views/searchView';
import * as resultView from './views/resultView';
import * as menuView from './views/menuView';

const state = {};

state.scale = 'c'; // default scale is celsius as per MetaWeather API
menuView.scaleButtonBackground(state.scale); // set default scale button to celsius

// Search Controller

const controlSearch = async () => {

    // Get search value
    const query = searchView.getSearch();

    if (query) {
        //Instantiate new search object within state
        state.search = new Search(query);

        // Clear search input
        searchView.clearInput();

        // display spinner
        resultView.displaySpinner(elements.container);

        // add card background blur
        // resultView.addBlur();

        try {
            await state.search.getResults();
            console.log(state.search.result);
            if (state.search.result.length === 1) {
                // If only one result

                // call Search model with woeid to receive weather data
                controlResult();
                console.log(state.search.result[0].woeid);


            } else if (state.search.result.length > 1) {
                // If more than one result
                //generate search items
                for (let i = 0; i < state.search.result.length; i++) {
                    searchView.generateSearchList(state.search.result[i].title, state.search.result[i].woeid);
                }

                // call searchview to display search list
                searchView.displaySearch();

            } else {
                // If no result

                // Display message saying no results found
            }

            // remove spinner
            resultView.removeSpinner(elements.card);

            // remove card background blur
            // resultView.removeBlur();
        } catch (error) {
            alert(error);
        }
    }
}

// Result Controller

const controlResult = async (ID = state.search.result[0].woeid) => {

    state.result = new Result(ID);
    try {
        // display spinner, will be removed by resultView.displayWeather
        resultView.displaySpinner(elements.container);

        // add card background blur
        // resultView.addBlur();

        await state.result.getWeather();
        // console.log(state.result.weather);
        // call searchview to display results in dom

        // remove spinner
        resultView.removeSpinner();

        // remove card background blur
        // resultView.removeBlur();
        
        for (let i = 0; i < 6; i++) {
            let dataArr = [
                /* Icon symbol:*/ state.result.weather.data.consolidated_weather[i].weather_state_abbr,
                /* Weather description:*/ state.result.weather.data.consolidated_weather[i].weather_state_name,
                /* Date:*/ state.result.weather.data.consolidated_weather[i].applicable_date,
                /* Main temp:*/ state.result.weather.data.consolidated_weather[i].the_temp,
                /* Min temp:*/ state.result.weather.data.consolidated_weather[i].min_temp,
                /* Max temp:*/ state.result.weather.data.consolidated_weather[i].max_temp,
                /* Place name:*/ state.result.weather.data.title
            ];

            if (i === 0) {
                // Display todays weather 
                resultView.displayWeather(...dataArr);

                // set background color to match weather
                resultView.setBackground(state.result.weather.data.consolidated_weather[i]);
            } else {
                // Display next five days of weather
                resultView.displayNextFive(...dataArr);
            }
        }

        if (state.scale === 'f') {
            // convert temp to farenheit
            resultView.changeScale(state.scale);
        }

    } catch (error) {
        alert(error);
    }
}

elements.searchForm.addEventListener('submit', e => {
    // Regular search
    e.preventDefault();
    controlSearch();
});

elements.searchResults.addEventListener('click', e => {
    // User selects list item
    searchView.removeSearch();
    controlResult(e.target.dataset.woeid);
});

window.addEventListener('click', e => {
    // If user clicks outside results list, remove
    if (!elements.searchResults.contains(e.target)) {
        searchView.removeSearch();
    }
});

window.addEventListener('keyup', e => {
    // if user presses escape key while search result list is present, remove search list
    if (e.which === 27) {
        if (elements.searchResults) {
            searchView.removeSearch();
        }
    }
});


// Display menu

document.querySelector('.search__menu-icon').addEventListener('click', menuView.showMenu);

// Hide menu

document.querySelector('.menu__close').addEventListener('click', menuView.hideMenu);

// If Farenheit is selected, change current DOM to F and state to F, so future API calls are converted to F
document.querySelector('.menu__scale--f').addEventListener('click', () => {
    
    // Only convert temp if user is switching from one scale to another
    if (state.scale === 'c') {
        resultView.changeScale('f');
    }
    
    state.scale = 'f';

    // Add highlight to button in dom, disable click 
    menuView.scaleButtonBackground(state.scale);
})

// If Celsius is selected, change current DOM to C and state to C, so API temp calls are back to default (C)
document.querySelector('.menu__scale--c').addEventListener('click', () => {

    // Add highlight to button in dom, disable click 

    // Only convert temp if user is switching from one scale to another
    if (state.scale === 'f') {
        resultView.changeScale('c');
    }

    state.scale = 'c';

    // Add highlight to button in dom, disable click 
    menuView.scaleButtonBackground(state.scale);
})