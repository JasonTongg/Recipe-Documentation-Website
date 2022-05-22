const state = {
    list: [],
    page: 1,
    recipe:[],
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
        displayRecipe(finalData);
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
                title: completeData[index].title,
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
        let rawData = await data;
        let completeData = rawData.data.recipe;
        state.recipe = {
            publisher: completeData.publisher,
            image: completeData.image_url,
            title: completeData.title,
            id: completeData.id,
            cookingTime: completeData.cooking_time,
            servings: completeData.servings,
            sourceUrl: completeData.source_url,
            ingredient: completeData.ingredients,
        }
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
        start = (page-1)*10;
    }
    let limit = data.slice(start, start+10);
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
        <div class="body__list-item">
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
        console.log("sjdhvbjfdh");
        parent2.insertAdjacentHTML('afterbegin', markup2);
    }
    else if(state.page === getMaxPage() && getMaxPage() > 1){
        let markup2 =`
            <div class="body__pagination-prev bodyPagination">&#8592; PAGE ${state.page-1}</div>
        `
        parent2.innerHTML = '';
        parent2.insertAdjacentHTML('afterbegin', markup2);
    }
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
                class="nav__items-icon body__recipe-servings-icon body__recipe-servings-addmin"
              >
                <use href="./image/icons.svg#icon-minus-circle"></use>
              </svg>
              <svg class="nav__items-icon body__recipe-servings-addmin">
                <use href="./image/icons.svg#icon-plus-circle"></use>
              </svg>
            </div>
          </div>
          <div class="body__recipe-servings-btn">
            <svg class="body__recipe-servings-btn-icon">
              <use href="./image/icons.svg#icon-user"></use>
            </svg>
            <svg class="body__recipe-servings-btn-icon">
              <use href="./image/icons.svg#icon-bookmark"></use>
            </svg>
          </div>
        </div>
        <div class="body__recipe-ingredient">
          <h1 class="body__recipe-ingredient-header">RECIPE INGREDIENTS</h1>
          <ul class="body__recipe-ingredient-list">
            <li class="body__recipe-ingredient-listItem">
              <svg class="body__recipe-ingredient-icon">
                <use href="./image/icons.svg#icon-check"></use>
                <p>4 Chocolate Powder</p>
              </svg>
            </li>
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

let init = async function(){
    getQuery();
    getRecipeApi('5ed6604591c37cdc054bcfcc');
    changePage();
}

init();