fetch('package.json').then(res => res.json().then(package => {
    document.querySelector('.js-version').innerHTML = `v${package.version}`;
}));