window.onload = function(){

    const search = document.querySelector('#search');
    const list = document.querySelector('#list');

    const input$ = rxjs.fromEvent(search, 'input');
    input$
        .pipe(
            rxjs.operators.map(event => event.target.value),
            rxjs.operators.filter(text => text.length > 2),
            rxjs.operators.debounceTime(200),
            rxjs.operators.switchMap(getUsers),
            rxjs.operators.map(x => x.items),
            //то же самое что
            //rxjs.operators.pluck('items'),
        )
        .subscribe(data => {
            renderFn(data);
            console.log(data);
        });

    function getUsers(text) {
        const response =  fetch(`https://api.github.com/search/users?q=${text}`)
            .then(resp => resp.json());
        return rxjs.from(response)
    }

    function renderFn(arrData){
        arrData.map(elem => {
            const template = `
                <div class="content__user">
                    <h2 class="content__login">${elem.login}</h2>
                    <img class="content__avatar" src="${elem.avatar_url}" alt="${elem.login}">
                    <p class="content__link">${elem.avatar_url +' ** '+ elem.events_url}</p>
                </div>
             `;
            list.insertAdjacentHTML('afterbegin', template);
        });
    }
};

// const { range, of } = rxjs;
// const { map, filter } = rxjs.operators;
