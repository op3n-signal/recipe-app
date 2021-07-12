import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ServingsService } from './ingredients/servings.service';

@Component({
    selector: 'recipe',
    templateUrl: 'recipe.component.html',
    styleUrls: [`recipe.component.css`]
})

export class RecipeViewComponent implements OnInit {
    data = [];
    shoppingListArr = [];
    shoppingListAmount = [];
    shoppingListSize = [];
    shoppingListName = [];

    ingredientSearcher;
    service;
    shoppingService;
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

    hold;
    item;
    singleAmount;
    singleSize;
    singleName;

    @ViewChild('items') recipeItemsHolder: ElementRef; 
    @ViewChild('ings') ingrs: ElementRef;
    @ViewChild('servingSize') servingSize: ElementRef;
    
    //vars to hold clicks from Recipe List
    //this holds the previous clicks
    recipesClickedArr: string[] = [];
    currentRecipeClick: string;
    //this holds the a tag
    recipesTagElement = [];
    //this holds the div element
    recipesDivElement = [];
	
	ngOnInit() {}
    
    constructor(_servingsService: ServingsService) {
        this.service = _servingsService;

        //this click event listener is for "only" "add" btn clicks
        document.addEventListener('click', (event) => {
            this.hold = event;
            
            if(this.hold.target.closest('a') && this.hold.target.classList.contains('btn-add-active')) {
                if(this.hold.target.parentElement.parentElement.childNodes[4]) {
                    this.item = this.hold.target.parentElement.parentElement.childNodes;
                    //getting all values of item clicked
                    if(this.item[0].innerText) {
                        this.singleAmount = this.item[0].innerText;
                    } else {
                        this.singleAmount = this.item[1].innerText;
                    }
                    this.singleSize = this.item[3].innerText;
                    this.singleName = this.item[4].innerText;
                    //now that I have values from ING comp, send them to shopping comp via input and ngChanges
                }
            }
                
        });
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
            document.getElementById('tres').style.display = 'none';
        }
        
    }

    goRight() {
        if(window.matchMedia('(max-width: 991px)')) {
            document.getElementById('tres').style.display = 'block';
            document.getElementById('dos').style.display = 'none';
            document.getElementById('uno').style.display = 'none';
        }
        
    }

    goLeftIng() {
        if(window.matchMedia('(max-width: 991px)')) {
            document.getElementById('tres').style.display = 'none';
            document.getElementById('dos').style.display = 'block';
            document.getElementById('uno').style.display = 'none';
        }
    }

    //this whole function is for only "add all" btn clicks
    addIngredients() {
        //holding the ingredients in the ing component
        this.ingredientSearcher = this.ingrs.nativeElement.childNodes;

        let getValues = () => {
            if(this.shoppingListArr.length > 0) {
                this.shoppingListArr.splice(0);
                this.shoppingListAmount.splice(0);
                this.shoppingListSize.splice(0);
                this.shoppingListName.splice(0);
            }
            //getting only ingredients from the child nodes array
            for(let i = 0; i < this.ingredientSearcher.length; i++) {
                if(this.ingredientSearcher[i].nodeName == 'INGREDIENTS') {
                    this.shoppingListArr.push(this.ingredientSearcher[i].childNodes[0].childNodes[0].childNodes);
                }
            }
        }
        getValues();

        //now send this variable to the shopping list comp
        //I have the values but still do not have them when they change
        for(let j = 0; j < this.shoppingListArr.length; j++) {
            //I need to make this switch from index 0 to 1
            //and make it so that only the first instance goes into the 0 index of j
            if(this.shoppingListArr[j][0].innerText) {
                this.shoppingListAmount.push(this.shoppingListArr[j][0].innerText);
            } else {
                this.shoppingListAmount.push(this.shoppingListArr[j][1].innerText);
            }
            this.shoppingListSize.push(this.shoppingListArr[j][3].innerText);
            this.shoppingListName.push(this.shoppingListArr[j][4].innerText);
        }

        if(window.matchMedia('(max-width: 991px)')) {
            document.getElementById('tres').style.display = 'block';
            document.getElementById('dos').style.display = 'none';
            document.getElementById('uno').style.display = 'none';
        }
    }

}