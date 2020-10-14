import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/**
 * - Search Object
 * - Current recipe object
 * - Shopping list object 
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
*/
const controlSearch = async () => {
    // 1) Get the query from the view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state 
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();
    
            // 5) Render results to UI
            clearLoader();
            searchView.renderResult(state.search.result);
        } catch(err) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', event => {
    const btn = event.target.closest('.btn-inline');
    
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResult(state.search.result, goToPage);
    }
});


/**
 * RECIPE CONTROLLER
*/
const controlRecipe = async () => {
    // Get ID from the URL
    const id = window.location.hash.replace('#', '');
    //console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            

            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            // Calculate time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render the recipe
            clearLoader();
            //console.log(state.recipe);
            recipeView.renderRecipe(state.recipe);

        } catch(err) {
            alert('Error processing Recipe!');
            console.log(err);
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

