const API_KEY = 'AIzaSyCdPnAPE-Kqy_VWKiFtX8Zm4b0T7wyyZ38',
  API_PLACES_ROOT = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=' + API_KEY,
  API_GEOCODE_ROOT = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + API_KEY,
  API_DIRECTIONS_ROOT = 'https://maps.googleapis.com/maps/api/directions/json?key=' + API_KEY + '&mode=transit&unit=imperial';



var helpers = {
  getDirections: function(selectText){
    var qsDestination = selectText.split(' ').join('+');
    var qsOrigin = selectText.split(' ').join('+');
    let endpt = API_DIRECTIONS_ROOT + '&origin=' + qsOrigin + '&destination=' + qsDestination;
    fetch(endpt, {
      method: 'GET'
    }).then(response => {
      let responseData = JSON.parse(response._bodyInit);
      let legs = responseData.routes[0].legs[0].steps;
      let stepsArr = [];
      let directionsArr = [];
      let transitDetails = [];

      legs.forEach(el => {
        if (el.travel_mode === 'TRANSIT'){
          stepsArr.push({
            latitude: el.start_location.lat,
            longitude: el.start_location.lng
          });
          stepsArr.push({
            latitude: el.end_location.lat,
            longitude: el.end_location.lng
          });

          var directionObj = {};
          directionObj["key"] = el.html_instructions;
          directionsArr.push(
            directionObj
          );
          transitDetails.push(el.transit_details);
        }

        // else if
        else if (el.travel_mode === 'WALKING'){
          el.steps.forEach(step => {
            stepsArr.push({
              latitude: step.start_location.lat,
              longitude: step.start_location.lng
            });
            stepsArr.push({
              latitude: step.end_location.lat,
              longitude: step.end_location.lng
            });
            if (step.html_instructions){
              var directionObj = {};
              directionObj["key"] = step.html_instructions;
              directionsArr.push(directionObj);
            }
          });
        } // closes else if
        return directionsArr;
        // this.setState({
        //   directionsArr: directionsArr
        // }); // closes setState
      }); // closes legs forEach
    }); // closes then for fetch


  }, // closes getDirections

  getPredictions: function(selectText){
    var qs = selectText.split(' ').join('+');
    return fetch(API_PLACES_ROOT + '&input=' + qs, {
      method: 'GET'
    }).then((response) => {
      var predictionsArr = JSON.parse(response._bodyInit).predictions;
      return predictionsArr;
    });
  }

} // closes helpers


module.exports = helpers;
