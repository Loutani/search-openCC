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

//open or close drop down filter
document.querySelectorAll('.drop-down-filter.drop-down-primary, .drop-down-filter.drop-down-success, .drop-down-filter.drop-down-danger').forEach(dropDown => dropDown.addEventListener('click', function(e) {
    toggleDropDownFilter(e, this)
}));

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

        document.querySelectorAll('.no-result-message ').forEach(item => {
            item.classList.add('hidden')
        });

        document.querySelectorAll('.drop-down-filter-content').forEach(item => {
            item.classList.remove('hidden')
        })
    }
});

//remove the tag when click on close
window.addEventListener('click', function(e){
    
    //if the clicked element contain the tag close clicked
    if(e.target.classList.contains('fa-times-circle')) {
        let pattern = e.target.getAttribute('pattern'),
            id = e.target.getAttribute('for-id'),
            searchIn = e.target.getAttribute('data-search-in'),
            tagContent = e.target.closest('.search-filter-tag').querySelector('.search-filter-tag-title').innerText.trim();

        //remove the clicked tag
        e.target.closest('.search-filter-tag').remove();

        //remove the tag from chosen filter
        let tagIndexInChosenFilters = chosenFilters[searchIn].indexOf(tagContent);

        if(tagIndexInChosenFilters > -1) {
            chosenFilters[e.target.getAttribute('data-search-in')].splice(tagIndexInChosenFilters, 1)
        }

        renderDishesFilter(getCompatibledishWithFilters());

        //get the original click filter from drop down
        document.querySelector(`.drop-down-${pattern} #${id}`).closest('div').classList.remove('hidden');
        document.querySelector(`.drop-down-${pattern} #${id}`).closest('div').classList.remove('tagged');

        document.querySelectorAll('.fa-times-circle').forEach(element => {
            document.querySelector(`p#${element.getAttribute('for-id')}`).closest('div').classList.add('hidden')
            document.querySelector(`p#${element.getAttribute('for-id')}`).closest('div').classList.add('tagged')
        });
    }
});

//search inside drop down filter
document.querySelectorAll('.drop-down-filter-input-search-ingredient, .drop-down-filter-input-search-appareil, .drop-down-filter-input-search-ustensile').forEach(inputSearch => inputSearch.addEventListener('keyup', filter));

//on click add filter to tags and update filters to be compatible
window.addEventListener('click', function(e) {
    if(e.target.classList.contains('clickable')) {
        let searchIn = e.target.getAttribute('data-search-in'),
            filterText = e.target.innerText;

        renderClickDropDownFilterAsTag(e.target);
        
        updateDropDownFilters(searchIn, filterText, getCompatibledishWithFilters());
        
        renderDishesFilter(getCompatibledishWithFilters());

        let item = document.querySelector(`p[data-value="${filterText}"]`)

        if(item) {
            item.closest('div').classList.add('hidden');
            item.closest('div').classList.add('tagged');
        }
    
        //hide the chosen filter
        document.querySelectorAll('.search-filter-tag').forEach(tag => {
            let item = document.querySelector(`.clickable#${tag.id}`);

            if(item) {
                item.closest('div').classList.add('hidden');
                item.closest('div').classList.add('tagged')
            }
        });

        //empty search input
        document.querySelector(`input[data-search="${e.target.getAttribute('data-type')}"]`).value = ""
    }
});

//create dishes template and render the drop down filter search
function createDishesAndFiltersTemplate(dishes) {

    //remove the repetition of ingredient, appareils and ustensiles using Set
    let dishesTemplate = createDishesTemplates(dishes);

    //render the drop down search filter content
    renderDishesFilter(getCompatibledishWithFilters())

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

        appareilsTempFilters.push(makeFirstCharacterUpperCase(tempAppliance));

        //push the ustensil to filter list
        dish.ustensils.forEach(ustensil => {
            let tempUstensil = ustensil.toLowerCase()
            ustensilesTempFilters.push(makeFirstCharacterUpperCase(tempUstensil))
        });

        //loop through all the dish ingredients to create template for it
        dish.ingredients.forEach(ingredient => {

            //push the ingredient to filter list
            let tempIngredient = ingredient.ingredient.toLowerCase()
            ingredientsTempFilters.push(makeFirstCharacterUpperCase(tempIngredient))

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
        let filterText = makeFirstCharacterUpperCase(filter.toLowerCase());

        dropDownSearchTextTemplate += `<div><p data-value="${filterText}" data-type="${pattern}" data-search-in="${searchIn}" class="clickable mb-0 py-2" id="${pattern}-${index}">${filter}</p></div>`
    })

    element.innerHTML = dropDownSearchTextTemplate
}

//render clicked drop down filter as tag
function renderClickDropDownFilterAsTag(element) {
    //create template
    let template = `<div class="search-filter-tag px-2 py-1 search-filter-tag-${element.getAttribute('data-type')} me-1 mb-1" id="${element.id}">
                        <div class="search-filter-tag-title me-2">
                            ${element.innerText}
                        </div>
                        <div class="search-filter-tag-icon btn-remove-tag">
                            <i class="far fa-times-circle" data-value="${element.innerText}" pattern="${element.getAttribute('data-type')}" data-search-in="${element.getAttribute('data-search-in')}" for-id="${element.id}"></i>
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

        //hide no filter search found
        toggleNoSearchFilterFound(type)
    }else{
        renderDropDrownFilterOnSearch(e, type)
        //check before show no filter search found
        let searchFilterContainer = e.target.closest('.drop-down-filter').querySelector('.drop-down-filter-content');

        let searchFilterLength = searchFilterContainer.querySelectorAll('div:not(.hidden)').length;

        toggleNoSearchFilterFound(type, searchFilterLength)
    }
}

function toggleNoSearchFilterFound(type, show = true) {
    if(show) {
        document.querySelector(`.drop-down-${type} .drop-down-filter-content`).classList.remove("hidden");
        document.querySelector(`.${type}-no-result`).classList.add('hidden')
    }else{
        document.querySelector(`.drop-down-${type} .drop-down-filter-content`).classList.add("hidden");
        document.querySelector(`.${type}-no-result`).classList.remove('hidden')
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

function updateDropDownFilters(searchFilterKey, text, dishesList) {

    chosenFilters[searchFilterKey].push(text)

    let newDishesTemplate = createDishesTemplates(dishesList);
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

    return dishesFromFilter.length === 0 ? [] : dishesFromFilter
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
    
    for(let ingredientIndex = 0; ingredientIndex < chosenFilters.appareils.length; ingredientIndex++) {
        if(chosenFilters.appareils[ingredientIndex] === dishAppareils) {
            foundAppareils = true
        }
    }

    return foundAppareils
}

//check if the ustensiles is in  dish ustensiles
function dishContainFiltredUstensiles(dishUstensiles) {
    let foundedUstensiles = [];

    for(let ingredientIndex = 0; ingredientIndex < dishUstensiles.length; ingredientIndex++) {
        for(let ustensileIndex = 0; ustensileIndex < chosenFilters.ustensiles.length; ustensileIndex++) {
            if(chosenFilters.ustensiles[ustensileIndex].toLowerCase() === dishUstensiles[ingredientIndex].toLowerCase()) {
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

        document.querySelectorAll('.no-result-message ').forEach(item => {
            item.classList.add('hidden')
        });

        document.querySelectorAll('.drop-down-filter-content').forEach(item => {
            item.classList.remove('hidden')
        })

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

function renderDishesFilter(dishes) {
    //render the filter drop down
    renderDropDownSearchFilterTemplate(
        getIngredientsFromDishes(dishes),
        document.querySelector('.drop-down-filter.drop-down-primary .drop-down-filter-content')
    );

    renderDropDownSearchFilterTemplate(
        getAppliancesFromDishes(dishes), 
        document.querySelector('.drop-down-filter.drop-down-success .drop-down-filter-content')
    );

    renderDropDownSearchFilterTemplate(
        getUstensilesFromDishes(dishes),
        document.querySelector('.drop-down-filter.drop-down-danger .drop-down-filter-content')
    );
}

//get the dishes include the filtered ingredients, appareils and ustensiles
function getCompatibledishWithFilters() {
    let dishList = dishes.filter(dish => {

        if(chosenFilters.ingredients.length === 0) {
            return dish
        }

        let dishIngredientArray = dish.ingredients.map(ingredient => ingredient.ingredient);

        let allIngredientIncluded = chosenFilters.ingredients.every(item => {
            return dishIngredientArray.includes(item)
        });

        if(allIngredientIncluded) {
            return dish;
        }
    });

    dishList = chosenFilters.appareils.length === 0 ? dishList : dishList.filter(dish => 
        chosenFilters.appareils.find(
            appareil => appareil.includes(makeFirstCharacterUpperCase(dish.appliance.toLowerCase()))
        )
    )

    dishList = dishList.filter(dish => {

        if(chosenFilters.ustensiles.length === 0) {
            return dish;
        }

        let dishUstensilesArray = dish.ustensils.map(ustensil => makeFirstCharacterUpperCase(ustensil.toLowerCase()));

        let allUstensilesIncluded = chosenFilters.ustensiles.every(item => {
            return dishUstensilesArray.includes(item)
        });

        if(allUstensilesIncluded) {
            return dish;
        }
    })

    return dishList
}

//get ingredients from listed dish
function getIngredientsFromDishes(dishesList) {
    let dishIngredientList = [];

    dishesList.map(dish => {
        dish.ingredients.map(dishIngredient => {
            let ingredient = makeFirstCharacterUpperCase(dishIngredient.ingredient.toLowerCase());
            dishIngredientList.push(ingredient);
        })
    });

    return new Set(dishIngredientList)
}

//get appliances from listed dish
function getAppliancesFromDishes(dishesList) {
    let dishApplianceList = [];

    dishesList.map(dish => {
        let appliance = makeFirstCharacterUpperCase(dish.appliance.toLowerCase());
        dishApplianceList.push(appliance);
    });

    return new Set(dishApplianceList)
}

//get ustensiles from listed dish
function getUstensilesFromDishes(dishesList) {
    let dishUstensileList = [];

    dishesList.map(dish => {
        dish.ustensils.map(dishUstensil => {
            let ustensil = makeFirstCharacterUpperCase(dishUstensil.toLowerCase());
            dishUstensileList.push(ustensil)
        });
    })
    
    return new Set(dishUstensileList)
}

//make only the first character of the string uppercase
function makeFirstCharacterUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}