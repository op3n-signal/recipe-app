import { Component, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { ServingsService } from '../ingredients/servings.service';

@Component({
    selector: 'recipe-list',
    templateUrl: 'recipe-list.component.html',
    styleUrls: [`./recipe-list.component.css`]
})

export class RecipeListComponent {
    @ViewChild('name') title: ElementRef;
    @ViewChild('item') div: ElementRef;
    service;

    @Input() recipes: {
            title: string, 
            baseUri: string, 
            image: string, 
            id: number, 
            time: number, 
            servings: number,
            url: string
        };
    
    @Output() recipeClicked = new EventEmitter<{value: string, tag, div}>();
    @Output() awaitIngredients = new EventEmitter<{value, servings: number, title: string}>();
    
    constructor(_servingService: ServingsService){
        this.service = _servingService;
    }

    getIngredients() {
        this.service.incomingRecipe();
        //this holds an instance of awaitIngredients so that we can access it in the async function
        let hold = this.awaitIngredients;
        //manually adding classes to the elements
        this.div.nativeElement.classList.add('highlight');
        this.title.nativeElement.classList.add('disable-link');
        //sending some info from the current clicked recipe item
        this.recipeClicked.emit({
            value: this.title.nativeElement.alt,
            tag: this.title,
            div: this.div
            //here I am passing the original title, a element, and div element
        });

        //async function to get the ingredients
        async function fetchRecipe(url) {
            let response = await fetch('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract?url=' + url, {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '1220238f04msh2b872afd54c7e3ep10d404jsn8b9bf5649654',
                    'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
                }
            })
            if(response.status == 200) {
                let data = await response.json();
                
                //sending the current items ingredients to the main recipe view, which will be sent to the ingredient component
                hold.emit({
                    value: data.extendedIngredients,
                    servings: data.servings,
                    title: data.title
                 });
                 
            }
            if(response.status == 400) {
                console.log('error');
            }
        }
        //calling the async function with the current clicked recipes url
        fetchRecipe(this.title.nativeElement.url);

    }
}