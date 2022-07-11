import dishes from './../data/recipes.js';


let dishesTemplate = createDishesTemplate();

renderDishes(dishesTemplate);

//show all the dishes (render)
function createDishesTemplate() {

    let dishesTemplate = ``;

    dishes.forEach(dish => {

        let dishIngredientTemplate = ``;

        dish.ingredients.forEach(ingredient => {
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

        dishesTemplate += `<div class="col-4">
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

    return dishesTemplate;
}

//render the dishes template
function renderDishes(dishesTemplate) {
    document.querySelector('.dishes').innerHTML = dishesTemplate;
}