import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'shopping-list',
    templateUrl: 'shopping-list.component.html',
    styleUrls: [`shopping-list.component.css`]
})

export class ShoppingListComponent implements OnChanges, AfterViewInit {
    @Input() amount;
    @Input() size;
    @Input() name;
    amounts;
    names;
    sizes;

    hold;
    first =  false;
    itemValueName;
    recipeName;
    recipeNameArr = [];
    deleteAllBtn;
    deleteLength;
    parent;
    child;
    paragraphText;
    holdItemName;
    printBtn;
    printBtnLast;

    @ViewChild('list') listy: ElementRef;
    //variables for the info coming from the single item clicked
    //problem is here, need to find why it is undefined
    @Input() itemAmount;
    @Input() itemSize;
    @Input() itemName;
    itemAmounts;
    itemSizes;
    itemNames;

    itemsArray: Array<{a: string, s: string, n: string}> = [];

    constructor() {
        document.addEventListener('click', (event) => {
            this.hold = event;
            if(this.hold.target.classList.contains('btn-primary')) {
                if(this.hold.target.classList.contains('btn-add-active')) {
                    this.amounts.splice(0);
                    this.first = true;
                    this.itemValueName = this.hold.target.parentElement.parentElement.childNodes[4].innerText;
                    this.recipeName = this.hold.target.parentElement.parentElement.parentElement.parentElement.parentElement.childNodes[0].childNodes[2].innerText;
                    this.recipeNameArr.unshift(this.recipeName);
                    //keeping the array short
                    if(this.recipeNameArr.length > 1) {
                        this.recipeNameArr.splice(2);
                    }
            
                    //go through the array except the first item and erase any matching objects
                    for(let i = 1; i < this.itemsArray.length; i++) {
                        if(this.itemsArray[i].n === this.itemValueName) {
                            this.itemsArray.splice(i, 1);
                            //erase all matching values except the first
                        }
                    }
                    if(this.recipeNameArr.length == 2 && this.recipeNameArr[1] != this.recipeNameArr[0]) {
                        this.itemsArray.splice(1);
                    }
                    
                } else {
                    this.first = false;
                    this.itemsArray.splice(0);
                }
             
                if(this.amounts.length > 5) {
                    //add delete all btn here for the add all
                    this.deleteAllBtn = document.querySelectorAll('.btn-danger');
                    this.deleteLength = this.deleteAllBtn[this.deleteAllBtn.length - 1]
                    this.deleteLength.classList.remove('hidden');

                    this.printBtn = document.querySelectorAll('.btn');
                    this.printBtnLast = this.printBtn[this.printBtn.length - 1];
                    this.printBtnLast.classList.remove('hidden');
                }
            } 
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        //console.log(changes);
        //this is for the add all btn
        if(changes.amount) {
            this.amounts = changes.amount.currentValue;
            this.sizes = changes.size.currentValue;
            this.names = changes.name.currentValue;
        }
        
        //this is for each add item
        if(changes.itemAmount === undefined) {
      
        } else {
            this.itemAmounts = changes.itemAmount.currentValue;
        } 

        if(changes.itemName === undefined) {

        } else {
            this.itemNames = changes.itemName.currentValue;
        }

        if(changes.itemSize === undefined) {

        } else {
            //console.log(changes.itemSize);
            this.itemSizes = changes.itemSize.currentValue;
        }
        //I have all the values here in variables
        //now I need to display them in the shopping list area.
        this.itemsArray.unshift({a : this.itemAmounts, s : this.itemSizes, n : this.itemNames});
        if(this.itemsArray[0].a == undefined) {
            this.itemsArray.splice(0, 1);
        }

        if(this.itemsArray.length == 2) {
            this.deleteAllBtn = document.querySelectorAll('.btn-danger');
            this.deleteLength = this.deleteAllBtn[this.deleteAllBtn.length - 1];
            this.deleteLength.classList.remove('hidden');

            this.printBtn = document.querySelectorAll('.btn');
            this.printBtnLast = this.printBtn[this.printBtn.length - 1];
            this.printBtnLast.classList.remove('hidden');
        } else if(this.itemsArray.length < 2) {
            this.deleteAllBtn = document.querySelectorAll('.btn-danger');
            this.deleteLength = this.deleteAllBtn[this.deleteAllBtn.length - 1]
            this.deleteLength.classList.add('hidden');

            this.printBtn = document.querySelectorAll('.btn');
            this.printBtnLast = this.printBtn[this.printBtn.length - 1];
            this.printBtnLast.classList.add('hidden');
        }
   
    }

    ngAfterViewInit() {
    }

    deleteItem(item) {
        //when someone hits the add all btn and then uses the delete item
        if(this.itemsArray.length === 0) {
            this.first = true;
            for(let z = 0; z < this.amounts.length; z++) {
                this.itemsArray.push({a : this.amounts[z], s : this.sizes[z], n : this.names[z]});
            }
            this.amounts.splice(0);
        }

        //getting the parent element of the item to be deleted here
        this.parent = item.target.parentElement.parentElement.parentElement.parentElement;
        //getting the element to be deleted
        this.child = item.target.parentElement.parentElement.parentElement;
        //the elements text is here
        this.paragraphText = item.target.parentElement.children[2].innerText;
        //removing the element from the parent
        this.parent.removeChild(this.child);

        //going through the items and check which matches up with what has been clicked
        for(let j = 0; j < this.itemsArray.length; j++) {
            if(this.itemsArray[j].n == this.paragraphText) {
                this.itemsArray.splice(j, 1);
            }
        }

        if(this.itemsArray.length < 2) {
            //should make this into a function because I am using it multiple times
            //for the sake of finishing the stream I will do later
            this.deleteAllBtn = document.querySelectorAll('.btn-danger');
            this.deleteLength = this.deleteAllBtn[this.deleteAllBtn.length - 1]
            this.deleteLength.classList.add('hidden');

            this.printBtn = document.querySelectorAll('.btn');
            this.printBtnLast = this.printBtn[this.printBtn.length - 1];
            this.printBtnLast.classList.add('hidden');
        }

    }   

    deleteAll() {
        this.amounts.splice(0); //now to delete the button when empty
        if(this.amounts.length < 5) {
            //add delete all btn here for the add all
            this.deleteAllBtn = document.querySelectorAll('.btn-danger');
            this.deleteLength = this.deleteAllBtn[this.deleteAllBtn.length - 1]
            this.deleteLength.classList.add('hidden');

            this.printBtn = document.querySelectorAll('.btn');
            this.printBtnLast = this.printBtn[this.printBtn.length - 1];
            this.printBtnLast.classList.add('hidden');
        }
        //for when items are added individually
        if(this.itemsArray.length > 0) {
            this.itemsArray.splice(0);
        }
    }

    print() {
        window.print();
    }
}