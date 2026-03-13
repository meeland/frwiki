// ВСТАВЬТЕ СЮДА ВАШУ ССЫЛКУ НА ОПУБЛИКОВАННЫЙ CSV ИЗ GOOGLE ТАБЛИЦ
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdmbzqrG9lvrFbpVSc31KSEPUoovTzZRnErTYHSCXdv_FbBB47m6ndLbfj9Ms6QrU7KihaArcNpF0l/pub?output=csv';

let database = []; // Здесь будут храниться все данные

// Функция инициализации
async function init() {
    // Для тестирования без гугл таблицы раскомментируйте loadMockData() и закомментируйте loadDataFromGoogle()
    // loadMockData();
    await loadDataFromGoogle();
}

async function loadDataFromGoogle() {
    Papa.parse(SHEET_CSV_URL, {
        download: true,
        header: true, // Первая строка таблицы станет ключами объектов
        complete: function(results) {
            database = results.data.filter(item => item.Name); // Убираем пустые строки
            buildNavigation();
        }
    });
}

// Заглушка, если таблица еще не готова
function loadMockData() {
    database = [
        { Category: "Фракции", Name: "Галактическая Республика", Description: "Демократический союз звездных систем.", Icon: "🏛️", Image: "" },
        { Category: "Фракции", Name: "Конфедерация Независимых Систем", Description: "Альянс сепаратистов.", Icon: "⚙️", Image: "" },
        { Category: "Оружие", Name: "Бластерная винтовка", Description: "Стандартное оружие пехоты.", Icon: "🔫", Image: "" },
        { Category: "Ресурсы", Name: "Коаксиум", Description: "Высокоэнергетическое топливо для гипердвигателей.", Icon: "💎", Image: "" }
    ];
    buildNavigation();
}

function buildNavigation() {
    const navList = document.getElementById('nav-list');
    navList.innerHTML = ''; // Очищаем список

    // Получаем уникальные категории из базы данных
    const categories = [...new Set(database.map(item => item.Category))];

    categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category;
        li.addEventListener('click', () => renderCategory(category));
        navList.appendChild(li);
    });
}

function renderCategory(categoryName) {
    document.getElementById('category-title').textContent = categoryName;
    document.getElementById('category-description').textContent = `Элементы раздела: ${categoryName}`;
    
    // Скрываем панель деталей при смене категории
    document.getElementById('item-details').classList.add('hidden');

    const grid = document.getElementById('items-grid');
    grid.innerHTML = '';

    // Фильтруем элементы нужной категории
    const items = database.filter(item => item.Category === categoryName);

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'game-item';
        
        itemDiv.innerHTML = `
            <div class="item-icon">${item.Icon || '📦'}</div>
            <div class="item-name">${item.Name}</div>
        `;

        itemDiv.addEventListener('click', () => showDetails(item));
        grid.appendChild(itemDiv);
    });
}

function showDetails(item) {
    const detailsPanel = document.getElementById('item-details');
    detailsPanel.classList.remove('hidden');

    document.getElementById('detail-name').textContent = item.Name;
    document.getElementById('detail-text').textContent = item.Description;

    const imgEl = document.getElementById('detail-image');
    if (item.Image && item.Image.trim() !== '') {
        imgEl.src = item.Image;
        imgEl.classList.remove('hidden');
    } else {
        imgEl.classList.add('hidden');
    }
}

document.getElementById('close-details').addEventListener('click', () => {
    document.getElementById('item-details').classList.add('hidden');
});

// Запускаем приложение
document.addEventListener('DOMContentLoaded', init);