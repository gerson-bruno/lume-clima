
const apiKey = import.meta.env.VITE_WEATHER_API_KEY; 

document.querySelector('.search').addEventListener('submit', async (e) => {
    e.preventDefault();

    const city = document.querySelector('#city_name').value;
    
    if (!city) {
        document.querySelector('#weather').classList.remove('show');
        showAlert('Digite o nome da cidade...');
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${apiKey}&lang=pt_br&units=metric`;

    try {
        const results = await fetch(apiUrl);
        const json = await results.json();

        if (json.cod === 200) {
            showInfo({
                city: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempMax: json.main.temp_max,
                tempMin: json.main.temp_min,
                humidity: json.main.humidity,
                wind: json.wind.speed * 3.6, 
                description: json.weather[0].description,
                tempIcon: json.weather[0].icon
            });
        } else {
            document.querySelector('#weather').classList.remove('show');
            showAlert(`Não foi possível localizar a cidade: ${city} <br> <img src="src/img/error.svg"/>`);
        }
    } catch (error) {
        showAlert("Erro de conexão. Verifique sua internet.");
    }
});

function showInfo(json) {
    showAlert('');
    document.querySelector('#weather').classList.add('show');

    document.querySelector('.title').innerHTML = `${json.city}, ${json.country}`;
    document.querySelector('.temp_value').innerHTML = `${json.temp.toFixed(1).replace('.', ',')} <span>°C</span>`;
    document.querySelector('.temp_description').innerHTML = json.description;
    document.querySelector('.temp_img').setAttribute('src', `http://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
    document.querySelector('.temp_max').innerHTML = `${json.tempMax.toFixed(1).replace('.', ',')} °C`;
    document.querySelector('.temp_min').innerHTML = `${json.tempMin.toFixed(1).replace('.', ',')} °C`;
    document.querySelector('.humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('.wind').innerHTML = `${json.wind.toFixed(1)} km/h`;
}

function showAlert(msg) {
    document.querySelector('.alert').innerHTML = msg;
}