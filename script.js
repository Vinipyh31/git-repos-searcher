'use strict'

function Init() {
    window.addEventListener('keydown', (e) => {
        if (e.key == "Enter") {
            console.log('enter');
            onSubmit();
        }
    });
}

function onSubmit() {
    const repoName = document.getElementById('repoName').value;
    const validation = document.getElementById('validation-error');
    if (repoName.trim()) {
        searchRepos(repoName);
        validation.textContent = "";
    } else {
        validation.textContent = "Укажите название репозитория";
    }
}

async function searchRepos(repoName) {
    const loader = document.createElement('div');
    loader.className = 'lds-default'
    loader.id = 'loader'
    loader.innerHTML = `<div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>`
    const div = document.getElementById('loader-wrapper')

    div.append(loader);
    const req = await fetch(`https://api.github.com/search/repositories?q=${repoName}+in:name&sort=stars&order=desc`).then(req => req.json())
    div.removeChild(document.getElementById('loader'));

    let list = req.total_count > 10 ? req.items.filter((v, i) => i < 10) : req.items;
    addToRepoList(list)
}

function addToRepoList(list) {
    document.getElementById('repo-list').innerHTML = '';
    list.forEach(el => {
        const repository = document.createElement('div');
        const repoHtml = `<div class='repo__row'> <h3>Имя пользователя:<br>${el.owner.login}</h3> <h3 class="repo-name-h3">Название репозитория:<br><a href="${el.html_url}" target="_blank">${el.name}</a></h3></div><p>${el.description ? el.description : "Описание отсутствует"}</p><span>Язык программирования: ${el.language ? el.language : "Не известно"}</span>`;
        repository.className = 'repo-list__item'
        repository.innerHTML = repoHtml;
        document.getElementById('repo-list').append(repository)
    });
    if (list.length === 0) {
        const notification = document.createElement('div');
        const emptyListHtml = `<h1>Ничего не найдено :(</h1>`;
        notification.className = 'empty-list';
        notification.innerHTML = emptyListHtml;
        document.getElementById('repo-list').append(notification);
    }
}

window.onload = Init;