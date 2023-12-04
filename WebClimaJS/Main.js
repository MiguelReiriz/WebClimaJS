const result = document.querySelector('.result');
const form = document.querySelector('.get-weather');
const nameCity = document.querySelector('#city');


form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (nameCity.value === '') {
        showError('Campo obligatorio...');
        return;
    }

    callAPI(nameCity.value);
    
})

function callAPI(city){
    
    const apiKey = 'e39d4d090d33a0abbafee2231a563322';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(url)
        .then(data => {
            return data.json();
        })
        .then(dataJSON => {
            if (dataJSON.cod === '404') {
                showError('Ciudad no encontrada...');
            } else if (dataJSON.sys.country !== 'ES') {
                showError('Ciudad fuera de España');
            } else {
                clearHTML();
                showWeather(dataJSON);
            }
           
        })
        .catch(error => {
            console.log(error);
        })
}

function showWeather(data){
    const {name, main:{temp, temp_min, temp_max, humidity}, weather:[arr]} = data;

    const degrees = kelvinCentigrados(temp);
    const min = kelvinCentigrados(temp_min);
    const max = kelvinCentigrados(temp_max);
    const hum = humidity;
   

    const content = document.createElement('div');
    content.innerHTML = `
        <h5>Clima en ${name}</h5>
        <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="icono">
        <h2>${degrees}°C</h2>
        <p>Max: ${max}°C</p>
        <p>Min: ${min}°C</p>
        <p>Humedad: ${hum} %</p>`;

    result.appendChild(content);

}

function showError(message){
    const alert = document.createElement('p');
    alert.classList.add('alert-message');
    alert.innerHTML = message;

    form.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function kelvinCentigrados(temp){
    return parseInt(temp - 273.15);
}

function clearHTML(){
    result.innerHTML = '';
}