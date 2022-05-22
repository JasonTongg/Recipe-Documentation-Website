const state = {
    list: [],
    page: 1,
    recipe:[],
    id: 0,
    bookmark: [],
    limit: 10,
}

let getApi = async function(query) {
    try {
        loadingSpinner();
        let data = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`);
        let finalData = await data.json();
        if(finalData.results === 0){
            throw new Error('Data Not Found');
        }
        displayList(finalData);
    } catch (error) {
        ErrorList(error);
    }
}

let getRecipeApi = async function(id){
    try {
        // loadingSpinner();
        let data = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
        let finalData = await data.json();
        if(finalData.results === 0){
            throw new Error('Data Not Found');
        }
        displayRecipe(await finalData.data.recipe);
    } catch (error) {
        console.log(error);
    }
}

let loadingSpinner = async function(){
    let parent = document.querySelector(".body__list");
    document.querySelector(".body__pagination").innerHTML = "";
    parent.innerHTML = "";
    let markup = '<div class="body__spinner"></div>';
    parent.insertAdjacentHTML("afterbegin", markup);
}

let getQuery = async function(){
    let form = document.querySelector(".nav__searchBar");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let query = document.querySelector(".nav__searchBar-input");
        getApi(query.value);
    })
}

let displayList = async function(data){
    try {
        let rawData = await data;
        let completeData = rawData.data.recipes;
        completeData.forEach((item, index) => {
            state.list[index] = {
                publisher: completeData[index].publisher,
                image: completeData[index].image_url,
                title: completeData[index].title.split(' ').slice(0,2).join(' '),
                id: completeData[index].id
            }
        })
        state.page = 1;
        
        limitData(state.list, state.page);
    } catch (error) {
        console.log(error);
    }
}

let displayRecipe = async function(data){
    try {
        let completeData = data;
        state.recipe = {
            publisher: completeData.publisher,
            image: completeData.image_url,
            title: completeData.title.split(' ').slice(0,2).join(' '),
            id: completeData.id,
            cookingTime: completeData.cooking_time,
            servings: completeData.servings,
            sourceUrl: completeData.source_url,
            ingredient: completeData.ingredients,
        }
        state.recipe.ingredient.forEach((item, index) => {
            if(item.quantity === null){
                item.quantity = '';
            }
        })
        renderRecipe();
    } catch (error) {
        console.log(error);
    }
}

let displayRecipeBookmark = async function(data){
    try {
        let completeData = data;
        state.recipe = {
            publisher: completeData.publisher,
            image: completeData.image,
            title: completeData.title.split(' ').slice(0,2).join(' '),
            id: completeData.id,
            cookingTime: completeData.cookingTime,
            servings: completeData.servings,
            sourceUrl: completeData.sourceUrl,
            ingredient: completeData.ingredient,
        }
        state.recipe.ingredient.forEach((item, index) => {
            if(item.quantity === null){
                item.quantity = '';
            }
        })
        renderRecipe();
    } catch (error) {
        console.log(error);
    }
}

let limitData = function(data, page){
    let start;
    if(page===1){
        start = 0;
    }
    else{
        start = (page-1)*state.limit;
    }
    let limit = data.slice(start, start+state.limit);
    renderList(limit)
}

let getMaxPage = function(){
    let max = state.list.length;
    return Math.ceil(max/10);
}

let changePage = function(){
    let parent = document.querySelector(".body__pagination");
    parent.addEventListener("click", (e) => {
        let clicked = e.target.closest('.bodyPagination');
        if(!clicked) return;
        if(clicked.classList.contains('body__pagination-prev') === true){
            if(state.page>1) state.page--;
        }
        else if(clicked.classList.contains('body__pagination-next') === true){
            if(state.page<getMaxPage()) state.page++;
        }
        limitData(state.list, state.page);
    })
}

let renderList = function(data){
    let parent = document.querySelector(".body__list");
    parent.innerHTML = '';
    document.querySelector(".nav__searchBar-input").value = "";
    data.forEach((item, index) => {
        let markup = `
        <div class="body__list-item" data-id="${item.id}">
            <div class="body__list-item-left">
                <img
                    class="body__list-item-image"
                    src="${item.image}"
                    alt=""
                />
                <div class="body__list-item-text">
                    <h1>${item.title}</h1>
                    <p>${item.publisher}</p>
                </div>
            </div>
        </div>
        `;

        parent.insertAdjacentHTML("beforeend", markup);
    })

    let parent2 = document.querySelector(".body__pagination");

    if(state.page === 1 && getMaxPage() > 1){
        let markup2 =`
            <div class="body__pagination-next bodyPagination">PAGE ${state.page+1} &#8594;</div>
        `
        parent2.innerHTML = '';
        parent2.insertAdjacentHTML('afterbegin', markup2);
    }
    else if(state.page>1 && state.page<getMaxPage() && getMaxPage() > 2){
        let markup2 =`
            <div class="body__pagination-prev bodyPagination">&#8592; PAGE ${state.page-1}</div>
            <div class="body__pagination-next bodyPagination">PAGE ${state.page+1} &#8594;</div>
        `
        parent2.innerHTML = '';
        parent2.insertAdjacentHTML('afterbegin', markup2);
    }
    else if(state.page === getMaxPage() && getMaxPage() > 1){
        let markup2 =`
            <div class="body__pagination-prev bodyPagination">&#8592; PAGE ${state.page-1}</div>
        `
        parent2.innerHTML = '';
        parent2.insertAdjacentHTML('afterbegin', markup2);
    }
    listListener();
}

let renderRecipe = function(){
    let parent = document.querySelector(".body__recipe");
    let markup = `
        <div class="body__recipe-imageContainer">
          <img
            src="${state.recipe.image}"
            alt="${state.recipe.title}"
            class="body__recipe-image"
          />
        </div>
        <div class="body__recipe-overlay"></div>
        <h1 class="body__recipe-title">${state.recipe.title}</h1>
        <div class="body__recipe-servings">
          <div class="body__recipe-servings-info">
            <div class="body__recipe-servings-infoTime">
              <svg class="nav__items-icon">
                <use href="../image/icons.svg#icon-clock"></use>
                <p>${state.recipe.cookingTime} MINUTES</p>
              </svg>
            </div>
            <div class="body__recipe-servings-infoQty">
              <svg class="nav__items-icon body__recipe-servings-icon">
                <use href="./image/icons.svg#icon-users"></use>
                <p>${state.recipe.servings} SERVINGS</p>
              </svg>
              <svg
                class="nav__items-icon body__recipe-servings-icon body__recipe-servings-addmin min"
              >
                <use href="./image/icons.svg#icon-minus-circle"></use>
              </svg>
              <svg class="nav__items-icon body__recipe-servings-addmin max">
                <use href="./image/icons.svg#icon-plus-circle"></use>
              </svg>
            </div>
          </div>
          <div class="body__recipe-servings-btn">
            <svg class="body__recipe-servings-btn-icon bookmark">
              <use href="./image/icons.svg#icon-bookmark"></use>
            </svg>
          </div>
        </div>
        <div class="body__recipe-ingredient">
          <h1 class="body__recipe-ingredient-header">RECIPE INGREDIENTS</h1>
          <ul class="body__recipe-ingredient-list">`
        
        state.recipe.ingredient.forEach((item, index) => {
            markup+=`
            <li class="body__recipe-ingredient-listItem">
              <svg class="body__recipe-ingredient-icon">
                <use href="./image/icons.svg#icon-check"></use>
                <p>${state.recipe.ingredient[index].quantity} ${state.recipe.ingredient[index].description}</p>
              </svg>
            </li>
            `
        })

        markup+=`
          </ul>
        </div>
        <div class="body__recipe-howToCook">
          <h1 class="body__recipe-howToCook-header">HOW TO COOK</h1>
          <p class="body__recipe-howToCook-text">
            This recipe was carefully designed and tested by
            <span>${state.recipe.publisher}</span>. Please check out directions at their
            website.
          </p>
          <button class="body__recipe-howToCook-btn">Directions &#8594;</button>
        </div>
    `;

    parent.innerHTML = '';
    parent.insertAdjacentHTML('afterbegin', markup);
    bookmarkListener();
    addServingsListener();
}

let renderBookmark = function(){
    let parent = document.querySelector(".nav__items-popup");
    let markup = `
    <div class="nav__items-popup-item" data-id = "${state.bookmark[0].id}">
        <div class="nav__items-popup-item-left">
        <img
            class="nav__items-popup-item-image"
            src="${state.bookmark[0].image}"
            alt="${state.bookmark[0].title}"
        />
        <div class="nav__items-popup-item-text">
            <h1>${state.bookmark[0].title}</h1>
            <p>${state.bookmark[0].publisher}</p>
        </div>
        </div>
    </div>
    `;

    if(state.bookmark.length > 1){
        state.bookmark.forEach((item, index) => {
            if(index !== 0){
                markup+=`
                <div class="nav__items-popup-item" data-id = "${state.bookmark[index].id}">
                    <div class="nav__items-popup-item-left">
                    <img
                        class="nav__items-popup-item-image"
                        src="${state.bookmark[index].image}"
                        alt="${state.bookmark[index].title}"
                    />
                    <div class="nav__items-popup-item-text">
                        <h1>${state.bookmark[index].title}</h1>
                        <p>${state.bookmark[index].publisher}</p>
                    </div>
                    </div>
                </div>
                `;
            }
        })
    }

    console.log("tes");
    parent.innerHTML = '';
    parent.insertAdjacentHTML("afterbegin", markup);
}

let ErrorList = function(error){
    let parent = document.querySelector(".body__list");
    parent.innerHTML = '';
    let markup = `
    <div class="body__list-item">
        <div class="body__list-item-text">
            <h1>${error}</h1>
            <p>Please Try Again!!</p>
        </div>
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin', markup);
    document.querySelector(".body__pagination").innerHTML = '';
}

let bookmarkListener = function(){
    let bookmark = document.querySelector(".bookmark");
    bookmark.addEventListener("click", (e) => {
        // console.log();
        if(!state.bookmark.find(item => item.title === state.recipe.title)){
            state.bookmark = [...state.bookmark, {
                publisher: state.recipe.publisher,
                image: state.recipe.image,
                title: state.recipe.title,
                id: state.recipe.id,
                cookingTime: state.recipe.cookingTime,
                servings: state.recipe.servings,
                sourceUrl: state.recipe.sourceUrl,
                ingredient: state.recipe.ingredient,
            }]
            renderBookmark();
        }
    })

}

let listListener = function(){
    let listParent = document.querySelector(".body__list");
    let list;
    listParent.addEventListener("click", (e) => {
        list = e.target.closest(".body__list-item");
        if(!list) return;
        state.id = list.dataset.id;
        getRecipeApi(state.id);
    })
}

let navBookmarkListener = function(){
    let parent = document.querySelector(".nav__items-bookmark");
    parent.addEventListener("click", (e) => {
        document.querySelector(".nav__items-popup").classList.toggle('hidden');
    })
    bookmarkClickListener();
}

let bookmarkClickListener = function(){
    let parent = document.querySelector(".nav__items-popup");
    parent.addEventListener("click", (e) => {
        let item = e.target.closest(".nav__items-popup-item");
        if(!item) return;
        state.bookmark.forEach((items, index) => {
            if(items.id === item.dataset.id){
                displayRecipeBookmark(state.bookmark[index]);
            }
        })
    })
}

let addServingsListener = function(){
    let btn = document.querySelectorAll(".body__recipe-servings-addmin");
    Array.from(btn).forEach(item => {
        item.addEventListener("click", (e) => {
            if(item.classList.contains("min")){
                if(state.recipe.servings>1){
                    state.recipe.ingredient.forEach(item => {
                        if(item.quantity !== ''){
                            item.quantity = item.quantity*((state.recipe.servings-1)/state.recipe.servings);
                            item.quantity = item.quantity.toFixed(2);
                        }
                    })
                    state.recipe.servings-=1;
                }
                renderRecipe();
            }
            else if(e.target.classList.contains("max")){
                state.recipe.ingredient.forEach(item => {
                    if(item.quantity !== ''){
                        item.quantity = item.quantity*((state.recipe.servings+1)/state.recipe.servings);
                        item.quantity = item.quantity.toFixed(2);   
                    }
                })
                state.recipe.servings+=1;
                renderRecipe();
            }
        })
    })
}

let displaySizeListener = function(){
    window.addEventListener("resize", (e) => {
        if(screen.width < 1100){
            state.limit = 2;
            limitData(state.list, state.page);
        }
        else{
            state.limit = 10;
            limitData(state.list, state.page);
        }
    })
}

let recipeToggle = function(){
    let btn = document.querySelector(".nav__items-addRecipe");
    let overlay = document.querySelector(".overlay");
    btn.addEventListener("click", (e) => {
        overlay.classList.remove("hidden");
    })

    document.querySelector(".overlay__form-close").addEventListener("click", (e) => {
        overlay.classList.add("hidden");
    })
}

let bodySize = function() {
    let navHeight = document.querySelector(".nav").getBoundingClientRect().height;
    let footerHeight = document.querySelector(".footer").getBoundingClientRect().height;

    console.log(navHeight, footerHeight);

    document.querySelector(".body__recipe").style.minHeight = `calc(100vh - ${navHeight}px - ${footerHeight}px)`;
}

let addRecipe = function(){
    let form = document.querySelector(".overlay__form");
    let formValue={};
    let ingredient = [];
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        Array.from(form.elements).forEach((item, index) => {
            if(index===0){
                formValue.title = item.value;
            }
            else if(index ===1){
                formValue.sourceUrl = item.value
            }
            else if(index ===2){
                formValue.imageUrl = item.value
            }
            else if(index ===3){
                formValue.publisher = item.value
            }
            else if(index ===4){
                formValue.cookingTime = item.value
            }
            else if(index ===5){
                formValue.servings = item.value
            }
            else if(index >= 6){
                ingredient.push(item.value)
            }
        })
        let final = []
        ingredient.filter(item => item !== '').forEach(item => {
            [quantity, unit, description] = item.split(";");
            final.push({quantity, unit, description});
        })

        formValue.ingredient = final;
        state.recipe = formValue;
        renderRecipe();
        state.bookmark.push(state.recipe);
        renderBookmark();
        document.querySelector(".overlay").classList.add("hidden");
    })
}

let init = async function(){
    getQuery();
    changePage();
    navBookmarkListener();
    displaySizeListener();
    recipeToggle();
    bodySize();
    addRecipe();
}

init();