const API_KEY = 'AIzaSyCdPnAPE-Kqy_VWKiFtX8Zm4b0T7wyyZ38',
  API_PLACES_ROOT = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=' + API_KEY,
  API_GEOCODE_ROOT = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + API_KEY,
  API_DIRECTIONS_ROOT = 'https://maps.googleapis.com/maps/api/directions/json?key=' + API_KEY + '&mode=transit&unit=imperial';

var helpers = {
  getDirections: function(destinationStr, originStr){
    var qsDestination = destinationStr.replace(/,/g, '').split(' ').join('+');
    var qsOrigin = originStr.replace(/,/g, '').split(' ').join('+');
    let endpt = API_DIRECTIONS_ROOT + '&origin=' + qsOrigin + '&destination=' + qsDestination;
    console.log('THIS IS THE ENDPT: ' + endpt);

    return fetch(endpt, {
      method: 'GET'
    }).then(response => {
      let responseData = JSON.parse(response._bodyInit);
      let legs = responseData.routes[0].legs[0].steps;
      console.log('THIS IS THE LEGS IN HELPER');
      console.log(legs);
      let stepsArr = [];
      let directionsArr = [];
      let transitDetails = [];
      console.log("LEGS", legs)
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
          directionObj["key"] = el.html_instructions.replace(/<\w+>/g, '').replace(/<\/\w+>/g, '').replace(/<.+>/g, '. ');
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
              directionObj["key"] = step.html_instructions.replace(/<\w+>/g, '').replace(/<\/\w+>/g, '').replace(/<.+>/g, '. ');
              directionsArr.push(directionObj);
            }
          });
        } // closes else if
      }); // closes legs forEach
        var returnObj = {
          directionsArr: directionsArr,
          stepsArr: stepsArr,
          transitDetails: transitDetails
        };
        console.log('this is returnObj in helper');
        console.log(returnObj);
        return returnObj;
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
