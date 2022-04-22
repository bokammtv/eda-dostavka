

function getRest(page) {
    getData().then(data => {
        let form = document.querySelector('form');
        renderForm(data, form);
        renderTable(data, page);
        
        if (location.href == 'http://dostavka-eda.std-346.ist.mospolytech.ru/admin.html') {
            showInfo();
            createRest();
        }
    });
}

//Получение данных
const api_key = '?api_key=b9d9ecfa-2c7e-4294-b01d-b1c7943ce284'
const url = 'http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants'
async function getData() {
    let response = await fetch(url + api_key);
    let data = await response.json();
    return data
}

async function getDataRestaurant(id) {
    let response = await fetch(url + '/' + id + api_key);
    let data = await response.json();
    return data
}

//function putRest(fields){
//    let fullURL = new URL(url + api_key);
//    
//    for(let field in fields){
//        fullURL.searchParams.append(field, fields[field]);
//    }
//    let xhr = new XMLHttpRequest();
//    xhr.open('POST', fullURL);
//    xhr.responseType = 'json';
//    xhr.onload = function () {
//        
//    }
//    xhr.send();
//
//    return xhr
//}

async function putRest(fields) {
    let response = await fetch(url + api_key, {
        method: 'POST',
        body: fields,
        headers: {
            'content-type': 'application/json'
        }
    });
    let data = await response.json();
    return data
}

function createRest() {
    let taskModal = document.getElementById('rest-new');
    taskModal.addEventListener('show.bs.modal', function (event) {
        let form = this.closest('.modal').querySelector('form');
        getData().then(data => {
            renderForm(data, form);
        });
        document.getElementById('new-btn').onclick = function () {
            let newRest = {}
            newRest.name = form.elements['name'].value;

            let isNetObjectContT = form.elements['isNetObject-true'];
            let isNetObjectContF = form.elements['isNetObject-false'];

            if (isNetObjectContT.checked) {
                newRest.isNetObject = true;
            }
            if (isNetObjectContF.checked) {
                newRest.isNetObject = false;
            }
            newRest.district = form.elements['district'].value;
            newRest.operatingCompany = form.elements['netArea'].value;
            newRest.typeObject = form.elements['typeObject'].value;
            newRest.admArea = form.elements['admArea'].value;
            newRest.address = form.elements['address'].value;
            newRest.seatsCount = form.elements['seatsCount'].value;

            let socialPrivilegesT = form.elements['socialPrivileges-true'];
            let socialPrivilegesF = form.elements['socialPrivileges-false'];
            if (socialPrivilegesT.checked) {
                newRest.socialPrivileges = true;
            }
            if (socialPrivilegesF.checked) {
                newRest.socialPrivileges = false;
            }

            newRest.publicPhone = form.elements['publicPhone'].value;
            response = putRest(newRest);
            console.log(response);
        }
    });

}

//отображение данных через таблицу
function showInfo() {
    let showModal = document.getElementById('rest-show');
    showModal.addEventListener('show.bs.modal', function (event) {
        let restaurantInfo = event.relatedTarget.closest('.restaurantInfo');
        getDataRestaurant(restaurantInfo.dataset.id).then(data => {
            renderInfo(data)
        });
    });
}

function renderInfo(restaurant) {
    let table = document.getElementById('info-table');
    table.innerHTML = '';
    for (value in restaurant) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.append(value, ': ', restaurant[value]);
        tr.append(td)
        table.append(tr);
    }
}


//Рендер формы
let areaList = ['admArea', 'districtArea', 'typeArea', 'netArea']

function renderForm(records, form) {
    let temp = [];
    records.forEach(record => {
        for (let k = 0; k < 4; k++) {
            let value;
            switch (k) {
                case 0:
                    value = record.admArea;
                    break;
                case 1:
                    value = record.district;
                    break;
                case 2:
                    value = record.typeObject;
                    break;
                case 3:
                    value = record.operatingCompany;
                    if (!record.isNetObject) {
                        value = 'Нет'
                    }
                    break;
            }
            let found;
            if (temp.length == 0) {
                temp[0] = value;
                renderOption(value, areaList[k], form);
            }
            for (let i = 0; i < temp.length; i++) {
                if (value != temp[i]) {
                    found = false;
                } else {
                    found = true;
                    break;
                }
            }
            if (!found) {
                renderOption(value, areaList[k], form);
                temp.push(value);
                found = true;
            }
        }
    });
}

function renderOption(selValue, areaName, form) {
    let area = form.elements[areaName];
    let opt = document.createElement('option');
    opt.innerHTML = selValue;
    area.append(opt);
}

//поиск по форме

function searchData(data){
    let form = document.querySelector('form');
    for (let elem in form.elements){
        if(form.elements[elem].value != 'Не выбрано'){
            console.log(form.elements[elem]);
            console.log(form.elements[elem].value);
        };
    }
    return data
}

function searchBtnHandler(data){
    let result = searchData(data);
    renderTable(result, 1);
}

// Создание таблицы
function renderTable(restaurants, page) {
    let amount = JSON.parse(JSON.stringify(restaurants)).length
    let lastPage = Math.ceil(amount / 10);
    let firstElem = (page - 1) * 10;
    renderPaginationElement(page, lastPage);
    let lastElem = firstElem + 10;
    if (lastElem > amount) {
        lastElem = amount + 1;
    }
    let tableRestaurant = document.getElementById('table-restaurant');
    tableRestaurant.innerHTML = '';
    for (; firstElem < lastElem; firstElem++) {
        tableRestaurant.append(tableElement(restaurants[firstElem]));
    }
}

function tableElement(restaurant) {
    let itemTableRestaurants = document.createElement('tr');
    itemTableRestaurants.classList.add('align-middle');
    itemTableRestaurants.classList.add('restaurantInfo');
    itemTableRestaurants.dataset.id = restaurant.id;
    itemTableRestaurants.append(elName(restaurant));
    itemTableRestaurants.append(elType(restaurant));
    itemTableRestaurants.append(elAddress(restaurant));
    itemTableRestaurants.append(elButton());
    return itemTableRestaurants;
}

function elName(restaurant) {
    let itemName = document.createElement('td');
    itemName.innerHTML = restaurant.name;
    return itemName;
}

function elType(restaurant) {
    let itemType = document.createElement('td');
    itemType.innerHTML = restaurant.typeObject;
    return itemType;
}

function elAddress(restaurant) {
    let itemAddress = document.createElement('td');
    itemAddress.innerHTML = restaurant.address;
    return itemAddress;
}

function elButton() {
    if (location.href == 'http://dostavka-eda.std-346.ist.mospolytech.ru/admin.html') {
        let row = document.createElement('td');
        let containerButtons = document.createElement('div');
        row.append(containerButtons);
        containerButtons.classList.add('actions');
        containerButtons.classList.add('d-flex');
        containerButtons.classList.add('text-end');
        let icon = [
            'file-o',
            'edit',
            'trash',
            'eye'
        ]
        let actions = [
            'new',
            'edit',
            'delete',
            'show'
        ]
        for (let i = 0; i < 4; i++) {
            let iconElem = document.createElement('i');
            let link = document.createElement('a');
            link.classList.add('m-1');
            link.dataset.action = actions[i];
            link.setAttribute("data-bs-toggle", "modal");
            link.setAttribute("data-bs-target", "#rest-" + actions[i]);
            iconElem.classList.add('fa');
            iconElem.classList.add('fa-' + icon[i]);
            iconElem.setAttribute('style', 'font-family: FontAwesome')
            link.append(iconElem);
            containerButtons.append(link);
            row.append(containerButtons);
        }
        return row;
    } else {
        let itemButton = document.createElement('td');
        let elementButton = document.createElement('button');
        elementButton.setAttribute("data-bs-toggle", "modal");
        elementButton.setAttribute("data-bs-target", "#rest-modal");
        elementButton.innerHTML = 'Выбрать';
        const list = ['btn', 'btn-success'];
        elementButton.classList.add(...list);
        itemButton.append(elementButton);
        return itemButton;
    }
}

//Pagination
function pageBtnHandler(event) {
    if (event.target.dataset.page) {
        getRest(event.target.dataset.page);
    }
}

function createPageBtn(page, isCurrent, isLast) {
    let paginationContainer = document.querySelector('.pagination');
    let buttonsContainer = document.createElement('li');
    let link = document.createElement('button');
    link.classList.add("page-link");
    if (page == 'firstPage') {
        link.dataset.page = 1;
        link.innerHTML = '&laquo;'
    } else if (isLast) {
        link.dataset.page = page;
        link.innerHTML = '&raquo;'
    } else {
        if (isCurrent) {
            buttonsContainer.classList.add('active');
        }
        link.innerHTML = String(page);
        link.dataset.page = page;
        link.innerHTML = page;
    }
    buttonsContainer.classList.add('page-item');
    buttonsContainer.append(link);
    paginationContainer.append(buttonsContainer);
}

function renderPaginationElement(currentPage, lastPage) {
    let btn;
    let firstPage = 'firstPage';
    let isLast = true;
    let isCurrent = false;
    let paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    btn = createPageBtn(firstPage);

    let start = parseInt(currentPage) - 2;
    if (start < 1) {
        start = 1;
    }
    let end = start + 5;
    if (end > lastPage) {
        end = lastPage + 1;
        start = end - 5;
    }
    for (; start < end; start++) {
        if (start == currentPage) {
            isCurrent = true;
        }
        btn = createPageBtn(start, isCurrent);
        isCurrent = false;
    }

    btn = createPageBtn(lastPage, isCurrent, isLast);
}


//main call
window.onload = () => {
    getRest(1);
    document.querySelector('.pagination').onclick = pageBtnHandler;
    //document.querySelector('.searchBtn').onclick = searchBtnHandler(getData());
    
}