window.onload = () => {
    getRest()
}
function getRest() {
    getData().then(data => {
        renderForm(data);
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


//Рендер формы
function renderForm(records) {
    let countyArea = document.getElementById('countyArea');
    let temp = [0];
    console.log(records);
    records.forEach(record => {
        for (let i = 0; i < temp.length; i++) {
            if (record.admArea != temp[i]){
                temp.push(record.admArea);
                countyArea.append(renderOpt(record.admArea))
            }
        }
    });
}


function renderOpt(value){
    let opt = document.createElement('option');
    opt.innerHTML = value;
}