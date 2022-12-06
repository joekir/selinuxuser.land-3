const popUpShownProperty = 'selinuxuserland.popup.shown';
const stubEvent = new Event('stub');
const dataField = document.createElement('data');
dataField.setAttribute('data-token', 'd23a6a4ef6b2290d0107a109ff67e745');

const launchSubscriptionPopin = function(){
    // Only ask if we haven't already
    if (window.localStorage && localStorage.getItem(popUpShownProperty) == null){
        localStorage.setItem(popUpShownProperty, true);
        mjOpenPopin(stubEvent, dataField);
    }
}

// If someone has browsed around the course for 10 seconds, see if they're interested to hear more
setTimeout(launchSubscriptionPopin, 10000); 