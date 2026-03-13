const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdmbzqrG9lvrFbpVSc31KSEPUoovTzZRnErTYHSCXdv_FbBB47m6ndLbfj9Ms6QrU7KihaArcNpF0l/pub?output=csv';

let database = [];
let currentCategoryItems = [];

async function init() {
    const loader = document.getElementById('loader');
    loader.classList.remove('hidden');

    if (SHEET_CSV_URL) {
        await loadDataFromGoogle();
    } else {
        loadMockData(); // Используем расширенные тестовые данные
    }
    
    loader.classList.add('hidden');
    document.getElementById('search-input').disabled = false;
    setupSearch();
}

function loadDataFromGoogle() {
    return new Promise((resolve) => {
        Papa.parse(SHEET_CSV_URL, {
            download: true,
            header: true,
            complete: function(results) {
                database = results.data.filter(item => item.Name);
                buildNavigation();
                resolve();
            },
            error: function() {
                alert("Ошибка подключения к терминалу базы данных.");
                resolve();
            }
        });
    });
}

function loadMockData() {
    database = [
        { Category: "Фракции", Name: "Галактическая Республика", Description: "Демократический союз звездных систем, управляемый Сенатом. Опирается на миротворческие силы для поддержания порядка в ядре и на средних рубежах.", Icon: "🏛️", Image: "" },
        { Category: "Фракции", Name: "КНС (Сепаратисты)", Description: "Конфедерация Независимых Систем. Мощный альянс корпораций и звездных систем, обладающий огромной армией дроидов.", Icon: "⚙️", Image: "" },
        { Category: "Персонажи", Name: "Тви'лек-наемник", Description: "Специалист по скрытному проникновению и саботажу. Отличается высокой ловкостью и способностью выживать в суровых условиях Внешнего Кольца.", Icon: "👤", Image: "" },
        { Category: "Флот", Name: "Кореллианский корвет", Description: "Многоцелевой корабль, известный своей скоростью и способностью прорывать блокады. Часто используется для контрабанды и дипломатических миссий.", Icon: "🚀", Image: "" },
        { Category: "Флот", Name: "Тяжелый крейсер", Description: "Основа ударного флота. Несет на борту эскадрильи перехватчиков и мощные турболазерные батареи.", Icon: "🛸", Image: "" },
        { Category: "Оружие", Name: "Тяжелый бластер", Description: "Стандартное энергетическое оружие пехоты. Обладает высокой пробивной способностью, но склонно к перегреву при длительной стрельбе.", Icon: "🔫", Image: "" }
    ];
    buildNavigation();
}

function buildNavigation() {
    const navList = document.getElementById('nav-list');
    navList.innerHTML = '';
    const categories = [...new Set(database.map(item => item.Category))];

    categories.forEach((category, index) => {
        const li = document.createElement('li');
        li.textContent = category;
        li.dataset.category = category;
        li.addEventListener('click', (e) => {
            document.querySelectorAll('#nav-list li').forEach(el => el.classList.remove('active'));
            e.target.classList.add('active');
            renderCategory(category);
        });
        navList.appendChild(li);
        
        // Открываем первую категорию по умолчанию
        if (index === 0) {
            li.classList.add('active');
            renderCategory(category);
        }
    });
}

function renderCategory(categoryName) {
    document.getElementById('category-title').textContent = `Архив: ${categoryName}`;
    document.getElementById('category-description').textContent = `Доступ открыт. Найдено записей: ${database.filter(i => i.Category === categoryName).length}`;
    
    closeDetails();
    document.getElementById('search-input').value = '';

    currentCategoryItems = database.filter(item => item.Category === categoryName);
    renderGrid(currentCategoryItems);
}

function renderGrid(items) {
    const grid = document.getElementById('items-grid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p class="glitch-text" style="color: var(--neon-pink)">Совпадений в базе не найдено.</p>';
        return;
    }

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'game-item';
        itemDiv.innerHTML = `
            <div class="item-icon">${item.Icon || '💠'}</div>
            <div class="item-name">${item.Name}</div>
        `;
        itemDiv.addEventListener('click', () => showDetails(item));
        grid.appendChild(itemDiv);
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = currentCategoryItems.filter(item => 
            item.Name.toLowerCase().includes(query) || 
            item.Description.toLowerCase().includes(query)
        );
        renderGrid(filtered);
    });
}

function showDetails(item) {
    const panel = document.getElementById('item-details');
    
    document.getElementById('detail-icon').textContent = item.Icon || '💠';
    document.getElementById('detail-name').textContent = item.Name;
    document.getElementById('detail-text').textContent = item.Description;

    const imgEl = document.getElementById('detail-image');
    if (item.Image && item.Image.trim() !== '') {
        imgEl.src = item.Image;
        imgEl.classList.remove('hidden');
    } else {
        imgEl.classList.add('hidden');
    }

    panel.classList.add('open');
}

function closeDetails() {
    document.getElementById('item-details').classList.remove('open');
}

document.getElementById('close-details').addEventListener('click', closeDetails);
document.addEventListener('DOMContentLoaded', init);
