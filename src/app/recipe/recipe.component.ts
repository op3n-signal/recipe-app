import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ServingsService } from './ingredients/servings.service';

@Component({
    selector: 'recipe',
    templateUrl: 'recipe.component.html',
    styleUrls: [`recipe.component.css`]
})

export class RecipeViewComponent implements OnInit {
    data = [];
    service;
    ingredients;
    servings: number;
    newSearch = true;
    searchQueries = [];
    recipeItems;
    recipeName;
    ingLength;
    update;
    timer;
    spinner;
    mql;

    @ViewChild('items') recipeItemsHolder: ElementRef; 
    
    //vars to hold clicks from Recipe List
    //this holds the previous clicks
    recipesClickedArr: string[] = [];
    currentRecipeClick: string;
    //this holds the a tag
    recipesTagElement = [];
    //this holds the div element
    recipesDivElement = [];
	
	ngOnInit() {
		window.addEventListener('resize', (e) => {
			//need to fix here, when I resize the divs are not in block display
			this.mql = window.matchMedia('(max-width: 991px)');
			console.log(this.mql);
			if(this.mql.matches == true) {
				document.getElementById('uno').style.display = 'block';
				document.getElementById('dos').style.display = 'block';
				document.getElementById('tres').style.display = 'block';
			}	
		});
		
	}
    
    constructor(_servingsService: ServingsService) {
        this.service = _servingsService;
    }
    
    getRecipe(event) {
        //an array to hold all info about the current recipe found
        this.data.push(event);

        this.recipeItems = this.recipeItemsHolder.nativeElement.children;
        //this deletes the previous results from the recipe list view when search something new
        if(this.recipeItems.length > 1) {
            for(let i = this.recipeItems.length - 1; i > 0; i--) {
                this.recipeItems[i].parentElement.removeChild(this.recipeItems[i]);
            }
            this.data.splice(0, 10);
        } 
    }

    getSearchQuery(query) {
        //function to delete the recipe list in the view
        let deleteList = () => {
            this.recipeItems = this.recipeItemsHolder.nativeElement.children;
             //this deletes the previous results from the recipe list view when search something new
             if(this.recipeItems.length > 1) {
                 for(let i = this.recipeItems.length - 1; i >= 1; i--) {
                     this.recipeItems[i].parentElement.removeChild(this.recipeItems[i]);
                 }
                 this.data.splice(0, 10);
             } 
         }
         //pushing the queries into a array
        this.searchQueries.push(query.value);

        if(this.searchQueries[this.searchQueries.length - 1] == '') {
            //insert a blank recipe list here
            deleteList();
        }
        
        //when clicking on a recipe after searching again, the ingredient component does not show
        if(this.searchQueries.length >= 2) {
            this.searchQueries.shift();
            if(this.searchQueries[this.searchQueries.length - 1] != this.searchQueries[this.searchQueries.length - 2]) {
                this.newSearch = false;     
                deleteList();
            }
        }
		
    }

    //method triggered by the RecipeList Component, to change back the previous item selected
    revert(data) {
        //we finally get an event each time a recipe is clicked, now we need to change the previous clicked, back to the original version
        //This keeps the array at a length of 2
        if(this.recipesClickedArr.length > 1) {
            this.recipesClickedArr.shift();
            this.recipesTagElement.shift();
            this.recipesDivElement.shift();
        }
        //Putting all clicks in a array
        this.recipesClickedArr.push(data.value);
        //Putting all current clicked a elements in a array
        this.recipesTagElement.push(data.tag.nativeElement);
        //Putting the Current clicked Div in a array
        this.recipesDivElement.push(data.div.nativeElement);

        //Putting just the current click in a var
        this.currentRecipeClick = data.value;
        //If the array first item in the array and the current click do not match
        if(this.currentRecipeClick != this.recipesClickedArr[0]) {
            //find a way to change the previous click back to normal
            //Go through each item's title in Data and check if the title matches the previous clicked item's title
            for(let i = 0; i < this.data.length; i++) {
                if(this.recipesClickedArr[0] == this.data[i].title) {
                    //edit the recipes a and div element to revert to original.
                    this.recipesTagElement[0].classList.remove('disable-link');
                    this.recipesDivElement[0].classList.remove('highlight');
                }
            }
        }
    }

    //The event triggered when we fetched the ingredients after clicking an item
    ingCourier(data) {
        this.newSearch = true;
        //The ingredients array we recieved from recipe list is being stored in the ingredients var
        //and servings stored in there as well
        this.servings = null;
        setTimeout(() => {
            this.servings = data.servings;
        }, 0);
        this.ingredients = data.value;
        this.ingLength = this.ingredients.length;
        this.service.setLength(this.ingLength);

        this.recipeName = data.title;
		
		this.mql = window.matchMedia('(max-width: 991px)');
        if(this.mql.matches == true) {
			console.log('gg');
			//here I need to fix this, this is what I want on small deviced but not desktop view
			//
            document.getElementById('uno').style.display = 'none';
			document.getElementById('dos').style.display = 'block';
			document.getElementById('tres').style.display = 'none';
        }
        

        document.addEventListener('change', (e: any) => {
            if(document.getElementById('servings-select')) {
                setTimeout(() => {
                    let newValue = parseInt(document.getElementById('servings-select').children[e.srcElement.options.selectedIndex].textContent);
                    this.update = this.service.setServing(newValue, e.srcElement.options.selectedIndex);
                        for(let i = 0; i < 1; i++) {
                            for(let j = 0; j < this.update.length; j++) {
                                this.ingredients[j].amount = this.update[j];
                            }              
                        }
                }, 20); 
                
            }
            
        });
    }

    goLeftRec() {
        if(window.matchMedia('(max-width: 991px)')) {
            document.getElementById('uno').style.display = 'block';
            document.getElementById('dos').style.display = 'none';
        }
        
    }

    goRight() {
        if(window.matchMedia('(max-width: 991px)')) {
            document.getElementById('tres').style.display = 'block';
            document.getElementById('dos').style.display = 'none';
        }
        
    }

    goLeftIng() {
        if(window.matchMedia('(max-width: 991px)')) {
            document.getElementById('tres').style.display = 'none';
            document.getElementById('dos').style.display = 'block';
        }
        
    }

}