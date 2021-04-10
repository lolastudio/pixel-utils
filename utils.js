function getDate() {
    let date = new Date();

    let day = pad(date.getDate());
    let month = pad(date.getMonth());
    let year = date.getFullYear();

    let hours = pad(date.getHours());
    let minutes = pad(date.getMinutes());
    let seconds = pad(date.getSeconds());

    return `${month}_${day}_${year}-${hours}_${minutes}_${seconds}`;
}

function pad(value, padding = -2) {
    return ('0' + value).slice(padding);
}

function showLoader(cb) {
    document.querySelector('.overlayer-loader').classList.remove('__hidden');

    if(cb) {
        setTimeout(() => {
            try {
                cb()
            } catch(err) {}
        }, 200);
    }
}

function hideLoader() {
    document.querySelector('.overlayer-loader').classList.add('__hidden');
}