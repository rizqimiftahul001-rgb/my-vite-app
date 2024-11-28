export default class DataHandler {

    static SESSION_DATA = {
        AccessToken: 'accessToken',
        FederationService: 'FederationService',
        userID: 'userID',
        UserEmail: 'UserEmail'
    }


    static setToSession(name, value) {
        sessionStorage.setItem(name, value);
        localStorage.setItem(name,value)
    }

    static getFromSession(name) {
        // return sessionStorage.getItem(name);
        return localStorage.getItem(name)
    }

    static clearSession() {
        sessionStorage.clear();
        localStorage.clear();
    }
}