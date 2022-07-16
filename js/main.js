import dishes from './../data/recipes.js';

let filters = {
    ingredients : [],
    appareils   : [],
    ustensiles  : [],
},
chosenFilters = {
    ingredients : [],
    appareils   : [],
    ustensiles  : [],
};

let dishesTemplate = createDishesAndFiltersTemplate(dishes);

renderDishes(dishesTemplate);

//fix dishes content height when resize the window
window.addEventListener('resize', function(){
    document.querySelectorAll('.dishe-container').forEach(item => {
        item.removeAttribute('style')
    });

    fixDishContentHeight()
});

//open or close ingredient drop down filter
document.querySelector('.drop-down-filter.drop-down-primary').addEventListener('click', function(e) {
    toggleDropDownFilter(e, this)
});

//open or close Appareils drop down filter
document.querySelector('.drop-down-filter.drop-down-success').addEventListener('click', function(e) {
    toggleDropDownFilter(e, this)
});

//open or close Ustensiles drop down filter
document.querySelector('.drop-down-filter.drop-down-danger').addEventListener('click', function(e) {
    toggleDropDownFilter(e, this)
});

//close the drop down menu when click outside of it
window.addEventListener('click', function(e){
    if(
        e.target.closest('.drop-down-filter') !== document.querySelector('.drop-down-filter.drop-down-primary')
        && 
        e.target.closest('.drop-down-filter') !== document.querySelector('.drop-down-filter.drop-down-success')
        &&
        e.target.closest('.drop-down-filter') !== document.querySelector('.drop-down-filter.drop-down-danger')
    ) {

        emptyDropDownSearchText('');

        document.querySelectorAll('.drop-down-filter.active').forEach(item => {
            item.classList.remove('active')
        });

        document.querySelectorAll('.drop-down-filter.drop-down-primary .drop-down-filter-content div').forEach(item => {
            if(!item.classList.contains('tagged')) {
                item.classList.remove('hidden')
            }
        });

        document.querySelectorAll('.drop-down-filter.drop-down-success .drop-down-filter-content div').forEach(item => {
            if(!item.classList.contains('tagged')) {
                item.classList.remove('hidden')
            }
        });

        document.querySelectorAll('.drop-down-filter.drop-down-danger .drop-down-filter-content div').forEach(item => {
            if(!item.classList.contains('tagged')) {
                item.classList.remove('hidden')
            }
        });
    }
});

//add click on drop down filter element
document.querySelectorAll('.clickable').forEach(clickable => {
    clickable.addEventListener('click', function(e) {

        let searchIn = e.target.getAttribute('data-search-in');

        renderClickDropDownFilterAsTag(this);

        updateDropDownFilters(searchIn, this.innerText);

        this.closest('div').classList.add('hidden');
        this.closest('div').classList.add('tagged');
    });
});

//remove the tag when click on close
window.addEventListener('click', function(e){
    
    //if the clicked element contain the tag close clicked
    if(e.target.classList.contains('fa-times-circle')) {
        let pattern = e.target.getAttribute('pattern'),
            id = e.target.getAttribute('for-id'),
            searchIn = e.target.getAttribute('data-search-in'),
            tagContent = e.target.closest('.search-filter-tag').querySelector('.search-filter-tag-title').innerText.trim();
        
        //get the original click filter from drop down
        document.querySelector(`.drop-down-${pattern} #${id}`).closest('div').classList.remove('hidden');
        document.querySelector(`.drop-down-${pattern} #${id}`).closest('div').classList.remove('tagged');

        //remove the clicked tag
        e.target.closest('.search-filter-tag').remove();

        //remove the tag from chosen filter
        let tagIndexInChosenFilters = chosenFilters[searchIn].indexOf(tagContent);

        if(tagIndexInChosenFilters > -1) {
            chosenFilters[e.target.getAttribute('data-search-in')].splice(tagIndexInChosenFilters, 1)
        }
    }
});

//ingredient filter
document.querySelector('.drop-down-filter-input-search-ingredient').addEventListener('keyup', filter);

//appareil filter
document.querySelector('.drop-down-filter-input-search-appareil').addEventListener('keyup', filter);

//ustensile filter
document.querySelector('.drop-down-filter-input-search-ustensile').addEventListener('keyup', filter);

//create dishes template and render the drop down filter search
function createDishesAndFiltersTemplate(dishes) {

    //remove the repetition of ingredient, appareils and ustensiles using Set
    let dishesTemplate = createDishesTemplates(dishes);

    //render the drop down search filter content
    renderDropDownSearchFilterTemplate(filters.ingredients, document.querySelector('.drop-down-filter.drop-down-primary .drop-down-filter-content'))
    renderDropDownSearchFilterTemplate(filters.appareils, document.querySelector('.drop-down-filter.drop-down-success .drop-down-filter-content'))
    renderDropDownSearchFilterTemplate(filters.ustensiles, document.querySelector('.drop-down-filter.drop-down-danger .drop-down-filter-content'))

    return dishesTemplate;
}

//create dishes Templates
function createDishesTemplates(dishes) {
    let dishesTemplate = ``,
    ingredientsTempFilters = [],
    appareilsTempFilters = [],
    ustensilesTempFilters = [];

    //loop through all the dishes to create dishes template
    dishes.forEach(dish => {

        let dishIngredientTemplate = ``;

        //push the appliance to filter list
        let tempAppliance = dish.appliance.toLowerCase();

        appareilsTempFilters.push(tempAppliance.charAt(0).toUpperCase() + tempAppliance.slice(1));

        //push the ustensil to filter list
        dish.ustensils.forEach(ustensil => {
            let tempUstensil = ustensil.toLowerCase()
            ustensilesTempFilters.push(tempUstensil.charAt(0).toUpperCase() + tempUstensil.slice(1))
        });

        //loop through all the dish ingredients to create template for it
        dish.ingredients.forEach(ingredient => {

            //push the ingredient to filter list
            let tempIngredient = ingredient.ingredient.toLowerCase()
            ingredientsTempFilters.push(tempIngredient.charAt(0).toUpperCase() + tempIngredient.slice(1))

            //create ingredients template
            dishIngredientTemplate += `<p class="fs-12 ln-14 mb-0">
                                            <strong>
                                                ${ingredient.ingredient}
                                            </strong>
                                            ${ingredient.quantity || ingredient.unit ? ': ' : ''}
                                            <span>
                                                ${ingredient.quantity ? ingredient.quantity : ''} ${ingredient.unit ? ingredient.unit : ''}
                                            </span>
                                        </p>`
        });

        //create dishes template
        dishesTemplate += `<div class="col-sm-6 col-lg-4">
                        <div class="row">
                            <div class="col-12 dishe-image-container">
                                <img class="img-fluid" src="/assets/images/${dish.id}.jpg" alt="${dish.name}">
                            </div>
                        </div>
                        <div class="dishe-container mb-5">
                            <div class="dishe-content px-2 py-2">
                                <div class="dishe-title">
                                    <span>${dish.name}</span>
                                </div>
                                <div class="dishe-time">
                                    <i class="far fa-clock"></i>
                                    <span class="ps-1 fw-700">${dish.time} min</span>
                                </div>
                            </div>
                            <div class="dishe-ingredients px-2 py-2">
                                <div class="dishe-ingredients-list">
                                    ${dishIngredientTemplate}
                                </div>
                                <div class="dishe-description">
                                    <p class="fs-12 fm-roboto">
                                        ${dish.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>`
    });

    filters.ingredients = new Set(ingredientsTempFilters);
    filters.appareils = new Set(appareilsTempFilters);
    filters.ustensiles = new Set(ustensilesTempFilters);
    return dishesTemplate
}

//render the dishes content
function renderDishes(dishesTemplate) {
    document.querySelector('.dishes').innerHTML = dishesTemplate;

    fixDishContentHeight()
}

//fix dish content height
function fixDishContentHeight() {
    let dishesContent = document.querySelectorAll('.dishe-container'),
        dishesContentHeight = [];

    dishesContent.forEach(item => {
        dishesContentHeight.push(item.clientHeight)
    });

    let max = dishesContentHeight.sort( (a, b) => b - a)[0]

    dishesContent.forEach(item => {
        item.style.height = `${max}px`
    });
}

//empty drop down search text except given name element
function emptyDropDownSearchText(exceptElement) {
    if(exceptElement !== "ingredients") {
        document.querySelector('.drop-down-filter.drop-down-primary input').value = ""
    }

    if(exceptElement !== "appareils") {
        document.querySelector('.drop-down-filter.drop-down-success input').value = ""
    }


    if(exceptElement !== "ustensiles") {
        document.querySelector('.drop-down-filter.drop-down-danger input').value = ""
    }
}

//render drop down search filter
function renderDropDownSearchFilterTemplate(data, element) {
    let dropDownSearchTextTemplate = ``,
        pattern = 'primary',
        searchIn = 'ingredients';

        if(element === document.querySelector('.drop-down-filter.drop-down-success .drop-down-filter-content')) {
            pattern = 'success';
            searchIn = 'appareils'
        }

        if(element === document.querySelector('.drop-down-filter.drop-down-danger .drop-down-filter-content')) {
            pattern = 'danger';
            searchIn = 'ustensiles'
        }

    //cast type 'Set' to 'Array' using spread operator
    data = [...data]

    data.forEach((filter, index) => {
        dropDownSearchTextTemplate += `<div><p data-type="${pattern}" data-search-in="${searchIn}" class="clickable mb-0 py-2" id="${pattern}-${index}">${filter}</p></div>`
    })

    element.innerHTML = dropDownSearchTextTemplate
}

//render clicked drop down filter as tag
function renderClickDropDownFilterAsTag(element) {
    //create template
    let template = `<div class="search-filter-tag px-2 py-1 search-filter-tag-${element.getAttribute('data-type')} me-1" id="${element.id}">
                        <div class="search-filter-tag-title me-2">
                            ${element.innerText}
                        </div>
                        <div class="search-filter-tag-icon btn-remove-tag">
                            <i class="far fa-times-circle" pattern="${element.getAttribute('data-type')}" data-search-in="${element.getAttribute('data-search-in')}" for-id="${element.id}"></i>
                        </div>
                    </div>`

    //append the tag to tags list
    document.querySelector('.search-filter-tags').innerHTML += template;
}

//do filter for drop down filter search
function filter(e) {
    let type = e.target.getAttribute('data-search');

    if(e.target.value === "") {
        document.querySelectorAll(`.drop-down-filter.drop-down-${type} .drop-down-filter-content div`).forEach(item => {
            if(!item.classList.contains('tagged')) {
                item.classList.remove('hidden')
            }
        });
    }else{
        renderDropDrownFilterOnSearch(e, type)
    }
}

//render the drop down filter search when we have search
function renderDropDrownFilterOnSearch(element, type) {
    document.querySelectorAll(`.drop-down-filter.drop-down-${type} .drop-down-filter-content div:not(.tagged) .clickable`).forEach(item => {

        let itemText = item.innerText;

        if(itemText.toLowerCase().indexOf(element.target.value) < 0 && itemText.indexOf(element.target.value) < 0) {
            item.closest('div').classList.add('hidden')
        }else{
            item.closest('div').classList.remove('hidden')
        }
    });
}

function updateDropDownFilters(searchFilterKey, contentText) {

    chosenFilters[searchFilterKey].push(contentText)

    let newDishes = updateDishesData();

    let newDishesTemplate = createDishesTemplates(newDishes);
}

//create new dishes array from filtred ingredient, appareils and ustensiles
function updateDishesData() {

    let dishesFromFilter = [];

    dishes.forEach(dish => {
        let dishIngredients = dish.ingredients,
            dishAppareils = dish.appliance,
            dishUstensiles = dish.ustensils;

        //dish had all the ingredients, appareils and ustensiles
        if(
            dishContainFiltredIngredients(dishIngredients) && 
            dishContainFiltredAppareils(dishAppareils) && 
            dishContainFiltredUstensiles(dishUstensiles)
        ) {
            dishesFromFilter.push(dish)
        }
    });

    return dishesFromFilter
}

//check if the filter ingredient is in dish ingredients
function dishContainFiltredIngredients(dishIngredients) {
    let foundedIngredient = [];

    for(let ingredientIndex = 0; ingredientIndex < dishIngredients.length; ingredientIndex++) {
        for(let filtersIngredientIndex = 0; filtersIngredientIndex < chosenFilters['ingredients'].length; filtersIngredientIndex++) {
            if(dishIngredients[ingredientIndex].ingredient.toLowerCase() === chosenFilters.ingredients[filtersIngredientIndex].toLowerCase()) {
                foundedIngredient.push(dishIngredients[ingredientIndex].ingredient);
                break;
            }
        }
    }


    return foundedIngredient.length === chosenFilters.ingredients.length
}

//check if the filter appareils is in dish appareils
function dishContainFiltredAppareils(dishAppareils) {
    let foundAppareils = false;

    if(chosenFilters.appareils.length === 0) {
        return true;
    }
    
    for(let ingredientIndex = 0; ingredientIndex < dishAppareils.length; ingredientIndex++) {
        if(chosenFilters.appareils === dishAppareils[ingredientIndex]) {
            foundAppareils = true
        }
    }

    return foundAppareils
}

//check if the ustensiles is in  dish ustensiles
function dishContainFiltredUstensiles(dishUstensiles) {
    let foundedUstensiles = [];

    for(let ingredientIndex = 0; ingredientIndex < dishUstensiles.length; ingredientIndex++) {
        for(let ustensileIndex; ustensileIndex < chosenFilters.ustensiles.length; ustensileIndex++) {
            if(chosenFilters.ustensiles[ustensileIndex] === dishUstensiles[ingredientIndex]) {
                foundedUstensiles.push(dishUstensiles[ingredientIndex]);
                break;
            }
        }
    }

    return foundedUstensiles.length === chosenFilters.ustensiles.length
}

//open or close drop down filter
function toggleDropDownFilter(event, element) {
    let searchType = element.getAttribute('data-filter-type');

    emptyDropDownSearchText(searchType);

    //check if the clicked element is up arrow icon to close drop down
    if(element.classList.contains('active') && event.target === element.querySelector('.fa-chevron-up')) {
        element.classList.remove('active');
        element.querySelector('input').value = "";
    }else{
        //show the click drop down element and hide the other
        element.classList.add('active');

        if(searchType !== "ingredients") {
            document.querySelector('.drop-down-filter.drop-down-primary').classList.remove('active');
        }

        if(searchType !== "appareils") {
            document.querySelector('.drop-down-filter.drop-down-success').classList.remove('active');
        }

        if(searchType !== "ustensiles") {
            document.querySelector('.drop-down-filter.drop-down-danger').classList.remove('active');
        }
    }
}