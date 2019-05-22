import axios from "axios";
//import firebase from "../firebase";

export default class ElasticSearchApi {
  static geoSearch(nw, se, loc) {
    //return firebase.auth().currentUser.getToken().then(token => {    });
    return axios
      .get(`${process.env.REACT_APP_API_HOST}/elasticsearch/bounds`, {
        params: {
          nw: `${nw.lat},${nw.lng}`,
          se: `${se.lat},${se.lng}`,
          loc: `${loc.lat},${loc.lng}`
        }
        //headers: {'Authentication': `Bearer ${token}`}
      })
      .then(response => {
        debugger;
        return response.data;
      });
  }
  static autoCompleteSearch(input) {
    const searchText = input.split(" ").join("+");
    return axios
      .get(`${process.env.REACT_APP_API_HOST}/elasticsearch/suggest`, {
        params: {
          q: searchText
        }
      })
      .then(response => {
        return Promise.resolve(response.data);
      });
  }
}
