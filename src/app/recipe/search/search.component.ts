import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Recipe } from './recipe.model';

@Component({
    selector: 'app-search',
    templateUrl: 'search.component.html',
    styleUrls: [`search.component.css`]
})

export class SearchComponent {
    searchedRecipe = '';

    @Output() recipeSearched = new EventEmitter<{title: string, baseUri: string, image: string, id: number, time: number, servings: number, url: string, search: string}>();
    recipes: Recipe[];
    @Output() searchQuery = new EventEmitter<{value: string}>();
    @ViewChild('load') icon: ElementRef;

    search() {
 

        //sending the search query immediately
        this.searchQuery.emit({
          value: this.searchedRecipe
        });

            
            //fetch method to get the recipe
            fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?query=` + this.searchedRecipe, {
              method: 'GET',
              headers: {
                'x-rapidapi-key': '1220238f04msh2b872afd54c7e3ep10d404jsn8b9bf5649654',
                'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
              }
            })
              .then(response => response.json())
              .then((data) => {
                if(this.searchedRecipe != '') {
                  data.results.forEach(results => {
                            this.recipes = [
                              new Recipe(results.title, data.baseUri, results.image, results.id, results.readyInMinutes, results.servings, results.sourceUrl)
                            ];
                            //custom event sent to the RecipeView
                            this.recipeSearched.emit({
                                title: results.title,
                                baseUri: data.baseUri,
                                image: results.image,
                                id: results.id,
                                time: results.readyInMinutes, 
                                servings: results.servings,
                                url: results.sourceUrl,
                                search: this.searchedRecipe
                            });
                        }); 
                        
                }
              })
              .catch((error) => {
                console.error(error);
              });
     
    }
    
}