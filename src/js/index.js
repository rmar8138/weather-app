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

//////////////////////////
// Search Controller
//////////////////////////

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

        try {
            await state.search.getResults();

            if (state.search.result.length === 1) {
                // If only one result

                // call Search model with woeid to receive weather data
                controlResult();
                console.log(state.search.result[0].woeid);


            } else if (state.search.result.length > 1) {
                // If more than one result
                // generate search items
                for (let i = 0; i < state.search.result.length; i++) {
                    searchView.generateSearchList(state.search.result[i].title, state.search.result[i].woeid);
                }

                // call searchview to display search list
                searchView.displaySearch();

            } else {
                // If no result, display message saying no results found
                elements.error.classList.toggle('error-active');
            }

            // remove spinner
            resultView.removeSpinner(elements.card);

        } catch (error) {
            alert(error);
        }
    }
}

//////////////////////////
// Result Controller
//////////////////////////

const controlResult = async (ID = state.search.result[0].woeid) => {

    state.result = new Result(ID);
    try {
        // display spinner, will be removed by resultView.displayWeather
        resultView.displaySpinner(elements.container);

        await state.result.getWeather();
        // call searchview to display results in dom

        // remove spinner
        resultView.removeSpinner();
        
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

//////////////////////////
// Event Listeners
//////////////////////////

// Search when user submits search form
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// Display result when user clicks on search item
elements.searchResults.addEventListener('click', e => {
    searchView.removeSearch();
    controlResult(e.target.dataset.woeid);
});

// Close error message
elements.errorClose.addEventListener('click', () => {
    elements.error.classList.toggle('error-active');
});

// Remove search list when user clicks outside of it
window.addEventListener('click', e => {
    if (!elements.searchResults.contains(e.target)) {
        searchView.removeSearch();
    }
});

// Remove search list when user hits the esc button
window.addEventListener('keyup', e => {
    if (e.which === 27) {
        if (elements.searchResults) {
            searchView.removeSearch();
        }
    }
});

// Display menu when user clicks menu icon
document.querySelector('.search__menu-icon').addEventListener('click', menuView.showMenu);

// Hide menu when user clicks menu close icon
document.querySelector('.menu__close').addEventListener('click', menuView.hideMenu);

// If Farenheit is selected, change current DOM to F and global state to 'f', so future API calls are converted to F
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

    // Only convert temp if user is switching from one scale to another
    if (state.scale === 'f') {
        resultView.changeScale('c');
    }

    state.scale = 'c';

    // Add highlight to button in dom, disable click 
    menuView.scaleButtonBackground(state.scale);
})