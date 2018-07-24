import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${this.query}`);
            this.result = res.data;
        
        } catch (error) {
            alert(error);
        }
    
    }
} 


