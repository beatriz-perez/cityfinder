// API info -----------------------------------------------------------

const requestURL = 'https://www.micole.net/api/regions';
const username = 'micoleAPI';
const password = 'M9^&yAzHTvVedh4=';

// CITY SEARCH - results info ----------------------------------------------------------

let regionsInfo = [];
let micoleregionslist;

let cityInfo = [];
let cityFilter = {
    region: 'Madrid',
    code: 'last',
    letter: 'vocal'
}

// CITY SEARCH - Functions ------------------------------------------------------------

function handleCities(list) {
    const orderedList = list.sort((a, b) => a.name > b.name ? 1 : -1);
    cityInfo = orderedList;
    const vocals = ['a', 'e', 'i', 'o', 'u'];
    for(let item of orderedList) {
        const nameArray = item.name.split('');
        const first = nameArray[0].toLowerCase();
        const last = nameArray[nameArray.length - 1].toLowerCase();
        let key = null;
        switch(cityFilter.code + cityFilter.letter) {
            case 'firstvocal':
                key = vocals.includes(first) === true ? true : false;
            break;
            case 'lastvocal':
                key = vocals.includes(last) === true ? true : false;
            break;
            case 'firstconsonant':
                key = vocals.includes(first) === false ? true : false;
            break;
            case 'lastconsonant':
                key = vocals.includes(last) === false ? true : false;
            break;
            default:
                key = true;
        };
        if (key === true) {
            $('#resultList').append(`
                <li class="cityListItem rounded bg-light p-2 m-2 d-flex justify-content-between align-items-center">
                    <p class="d-inline">
                        <span class="lead font-weight-bold">${item.name}</span>
                        <br>
                        ${cityFilter.region}
                    </p>
                    <a 
                        href="https://www.google.es/maps/place/${item.name},+${cityFilter.region}"
                        target="_blank"
                        class="btn btn-outline-primary btn-sm d-inline"
                        style="min-width: 120px;"
                    >
                        Ver en Google Maps
                    </a>
                </li>
            `);
        }
    }
};

function getCityList(cityCode) {
    cityRequestURL = `${requestURL}/${cityCode}`;
    getRegionsInfo(cityRequestURL, username, password, cityCode);
};

function createRegionsOptions(list) {
    $('#main').removeClass('justify-content-center');
    $('#main').addClass('justify-content-start');
    const orderedList = list.sort((a, b) => a.name > b.name ? 1 : -1);
    for(let item of orderedList) {
        if (item.name !== 'Desconocido'){
            if (item.name === 'Madrid'){
                $('#iRegion').append(`<option value=${item.id} selected>${item.name}</option>`);
                getCityList(item.id.toString())
            } else {
                $('#iRegion').append(`<option value=${item.id} data-name="${item.name}">${item.name}</option>`);
            }
        }
    }
};

function cleanInfo(list) {
    for(let item of list) {
        const initialName = item.name;
        const finalName = initialName.replace('Á','A').replace('É', 'E').replace('Í', 'I').replace('Ó', 'O').replace('Ú', 'U');
        console.log(initialName,finalName);
        const newItem = {
            name: finalName,
            id: item.id
        };
        regionsInfo.push(newItem);
    }
    localStorage.setItem('micoleregionslist', JSON.stringify(regionsInfo));
    createRegionsOptions(regionsInfo);
};

function getRegionsInfo(requestURL, username, password, code) {
    const url = `https://cors-anywhere.herokuapp.com/${requestURL}`;
    const authString = `${username}:${password}`
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(authString));
    fetch(url,{
        method: 'GET', 
        headers: headers,
    })
    .then(response => response.json())
    .then (data => {code === 0 ? cleanInfo(data) : handleCities(data);})
    .catch(error => {console.error('Request failed', error);})
};

// CITY SEARCH - Events - actions ----------------------------------------------------------------

$( "#findRegionsButton" ).click(function() {
    micoleregionslist = JSON.parse(localStorage.getItem('micoleregionslist'));
        if (!micoleregionslist) {
            getRegionsInfo(requestURL, username, password, 0);
        } else {
            createRegionsOptions(micoleregionslist);
        }
    $('#searchForm').removeClass('d-none');
    $('#findRegionsButton').addClass('d-none');
});

$('#iRegion').change(function(e){
    $(resultList).empty();
    const code = e.currentTarget.value;
    getCityList(code);
    const newRegion = micoleregionslist.find(item => item.id === parseInt(code));
    cityFilter.region = newRegion.name;
});

$('#iPosition').change(function(e){
    $(resultList).empty();
    cityFilter.code = e.currentTarget.value;
    handleCities(cityInfo);
});

$('#iLetter').change(function(e){
    $(resultList).empty();
    cityFilter.letter = e.currentTarget.value;
    handleCities(cityInfo);
});
