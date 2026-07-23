import axios from 'axios';

export default class ApiService {
    URL = 'http://127.0.0.1:5000';
    
    async getHealth() {
        try {
            const response = await axios.get(`${this.URL}/health`)  
            const data = response.data;
            console.log(data);
            return data.status;    
        } catch (error) {
            return false;
        }
    }
}