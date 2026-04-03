const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

document.querySelector('.search').addEventListener('submit', async (e) => {
  e.preventDefault();

  const city = document.querySelector('#city_name').value.trim().toLowerCase();

  if (!city) {
    document.querySelector('#weather').classList.remove('show');
    showAlert('Digite o nome da cidade...');
    return;
  }

  localStorage.setItem('lastCity', city);

  await fetchWeather(city);
});

async function fetchWeather(city) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURI(city)}&lang=pt&days=5`;

  try {
    const results = await fetch(apiUrl);
    const json = await results.json();

    if (json.error) {
      document.querySelector('#weather').classList.remove('show');
      showAlert(`Cidade não encontrada: ${city} <br> <img src="src/img/error.svg"/>`);
      return;
    }

    showInfo({
      city: json.location.name,
      country: json.location.country,
      temp: json.current.temp_c,
      tempMax: json.forecast.forecastday[0].day.maxtemp_c,
      tempMin: json.forecast.forecastday[0].day.mintemp_c,
      humidity: json.current.humidity,
      wind: json.current.wind_kph,
      description: json.current.condition.text,
      tempIcon: json.current.condition.icon,
    });

    showForecast(json.forecast.forecastday);

  } catch (error) {
    showAlert('Erro de conexão. Verifique sua internet.');
  }
}

function showInfo(json) {
  showAlert('');
  document.querySelector('#weather').classList.add('show');

  document.querySelector('.title_city').innerHTML =
    `${json.city}, ${json.country}`;
  document.querySelector('.temp_value').innerHTML =
    `${json.temp.toFixed(1).replace('.', ',')} <span>°C</span>`;
  document.querySelector('.temp_description').innerHTML = json.description;

  document
    .querySelector('.temp_img')
    .setAttribute('src', `https:${json.tempIcon}`);

  document.querySelector('.temp_max').innerHTML =
    `${json.tempMax.toFixed(1).replace('.', ',')} °C`;
  document.querySelector('.temp_min').innerHTML =
    `${json.tempMin.toFixed(1).replace('.', ',')} °C`;

  document.querySelector('.humidity').innerHTML = `${json.humidity}%`;
  document.querySelector('.wind').innerHTML = `${json.wind.toFixed(1)} km/h`;
}

function showForecast(days) {
  const container = document.querySelector('#forecast');
  container.innerHTML = '';

  const today = new Date().toISOString().split('T')[0];
  const nextDays = days.filter(day => day.date > today).slice(0, 3);

  nextDays.forEach(day => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });

    container.innerHTML += `
      <div class="forecast_item">
        <p>${dayName}</p>
        <img src="https:${day.day.condition.icon}" />
        <p>${day.day.mintemp_c}° / ${day.day.maxtemp_c}°</p>
        <p>${day.day.condition.text}</p>
      </div>
    `;
  });
}

function showAlert(msg) {
  document.querySelector('.alert').innerHTML = msg;
}

window.addEventListener('load', () => {
  const lastCity = localStorage.getItem('lastCity');

  if (lastCity) {
    document.querySelector('#city_name').value = lastCity;
    fetchWeather(lastCity);
  }
});

navigator.geolocation.getCurrentPosition(async (pos) => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  await fetchWeather(`${lat},${lon}`);
});