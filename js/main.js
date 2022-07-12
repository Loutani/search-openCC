import dishes from './../data/recipes.js';

let filters = {
    ingredients : [],
    appareils   : [],
    ustensiles  : [],
}

let dishesTemplate = createDishesTemplate();

renderDishes(dishesTemplate);

//create dishes template
function createDishesTemplate() {

    let dishesTemplate = ``,
        ingredientsTempFilters = [],
        appareilsTempFilters = [],
        ustensilesTempFilters = [];
    
    //loop through all the dishes to create dishes template
    dishes.forEach(dish => {

        let dishIngredientTemplate = ``;

        //push the appliance to filter list
        appareilsTempFilters.push(dish.appliance.toLowerCase());

        //push the ustensil to filter list
        dish.ustensils.forEach(ustensil => {
            ustensilesTempFilters.push(ustensil.toLowerCase())
        });

        //loop through all the dish ingredients to create template for it
        dish.ingredients.forEach(ingredient => {

            //push the ingredient to filter list
            ingredientsTempFilters.push(ingredient.ingredient.toLowerCase())

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

    //remove the repetition of ingredient, appareils and ustensiles using Set
    filters.ingredients = new Set(ingredientsTempFilters);
    filters.appareils   = new Set(appareilsTempFilters);
    filters.ustensiles  = new Set(ustensilesTempFilters);

    return dishesTemplate;
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

//fix dishes content height when resize the window
window.addEventListener('resize', function(){
    document.querySelectorAll('.dishe-container').forEach(item => {
        item.removeAttribute('style')
    });

    fixDishContentHeight()
});

//open or close ingredient drop down filter
document.querySelector('.drop-down-filter.drop-down-primary').addEventListener('click', function(e) {
    //check if the clicked element is up arrow icon to close drop down
    if(this.classList.contains('active') && e.target === this.querySelector('.fa-chevron-up')) {
        this.classList.remove('active')
        this.querySelector('input').value = ''
    }else{
        //show the click drop down element and hide the other
        this.classList.add('active');
        document.querySelector('.drop-down-filter.drop-down-success').classList.remove('active');
        document.querySelector('.drop-down-filter.drop-down-danger').classList.remove('active');
    }
});

//open or close Appareils drop down filter
document.querySelector('.drop-down-filter.drop-down-success').addEventListener('click', function(e) {
    //check if the clicked element is up arrow icon to close drop down
    if(this.classList.contains('active') && e.target === this.querySelector('.fa-chevron-up')) {
        this.classList.remove('active')
        this.querySelector('input').value = ''
    }else{
        //show the click drop down element and hide the other
        this.classList.add('active');
        document.querySelector('.drop-down-filter.drop-down-primary').classList.remove('active');
        document.querySelector('.drop-down-filter.drop-down-danger').classList.remove('active');
    }
});

//open or close Ustensiles drop down filter
document.querySelector('.drop-down-filter.drop-down-danger').addEventListener('click', function(e) {
    //check if the clicked element is up arrow icon to close drop down
    if(this.classList.contains('active') && e.target === this.querySelector('.fa-chevron-up')) {
        this.classList.remove('active')
        this.querySelector('input').value = ''
    }else{
        //show the click drop down element and hide the other
        this.classList.add('active');
        document.querySelector('.drop-down-filter.drop-down-success').classList.remove('active');
        document.querySelector('.drop-down-filter.drop-down-primary').classList.remove('active');
    }
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
        document.querySelectorAll('.drop-down-filter.active').forEach(item => {
            item.classList.remove('active')
        })
    }
});