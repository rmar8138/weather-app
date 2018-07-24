import axios from 'axios';

export default class Result {
    constructor(woeid) {
        this.woeid = woeid;
    }

    async getWeather() {
        try {
            const weatherData = await axios(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${this.woeid}`);
            this.weather = weatherData;

        } catch (error) {
            alert(error);
        }
    }
}