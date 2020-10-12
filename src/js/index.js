import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
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

        // 4) Search for recipes
        await state.search.getResults();

        // 5) Render results to UI
        clearLoader();
        searchView.renderResult(state.search.result);
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
const r = new Recipe(47746);
r.getRecipe();
console.log(r);

