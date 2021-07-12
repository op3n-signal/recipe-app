import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ServingsService } from './servings.service';

@Component({
    selector: 'ingredients',
    templateUrl: 'ingredients.component.html',
    styleUrls: [`ingredients.component.css`]
})

export class IngredientsComponent implements OnInit, OnChanges {
    @Input() ingredient;

    servingService;

    count = 0;
    newAmountArr = [];
    newWholeNumber;
    newOriginalMixedDecimal;
    newMixedDecimalArr = [];
    newNewDecimal;
    newNumHold;
    newDenHold;
    newDifference;
    newOtherNumerator;
    newNumerator;
    newDenominator;
    index;
    
    measure
    amountArr = [];
    wholeNumber;
    numCounter = 1;
    denCounter = 1;
    originalMixedDecimal;
    mixedDecimalArr = [];
    newDecimal;
    numHold;
    denHold;
    difference;
    otherNumerator;
    numerator;
    denominator;

    newIngredients;

    newNumCounter = 1;
    newDenCounter = 1;

    public ngOnInit() {
        this.runIt(this.ingredient);
        this.measure = this.ingredient.measures.us.unitShort;
        
    }

    ngOnChanges(changes: SimpleChanges) {
        this.newIngredients = changes.ingredient.currentValue;
        
            document.addEventListener('change', (e) => {
                this.runAgain(this.newIngredients);
                //console.log(this.newIngredients);
                
            });    
    }

    runAgain(z) {
        this.count++;
        setTimeout(() => {
            this.newAmountArr = []; 
            //array of the amount in string version
            this.newAmountArr.push(z.amount.toString());
            if(this.newNumCounter != 1 || this.newDenCounter != 1) {
                this.newNumCounter = 1;
                this.newDenCounter = 1;
            }
        
            //if the number has a decimal
            if(this.newAmountArr[0].includes('.')) {
                //saving the original mixed decimal
                this.newOriginalMixedDecimal = this.newAmountArr[0][0];
            
                //if statement for mixed decimals

                


                if(this.newAmountArr[0][0] != 0) {
                    //pushing each string number into a new array
                    this.newMixedDecimalArr = [];
                    for(let i = 0; i < this.newAmountArr[0].length; i++) {
                        this.newMixedDecimalArr.push(this.newAmountArr[0][i]);
                    }
                    
                    //the whole number of the mixed decimal goes in this var
                    this.newWholeNumber = this.newAmountArr[0][0];
                
                    //here I am sending data to the service to be updated
                    //the decimal part goes in the updated array
                    this.newMixedDecimalArr.splice(0, 1, '0');
                    
                    //joining the string and putting it in a var
                    this.newNewDecimal = this.newMixedDecimalArr.join('');
                    this.newAmountArr[0] = this.newNewDecimal;
                }

                        //keep reverse engineering here
                        //statement which turns a decimal to a fraction
                  
                        let newToFraction = otherdecimal => {
                            //console.log(otherdecimal);
                            //bottom for denominator part only
                            this.newOtherNumerator = Math.round(otherdecimal * 100);//50
                            
                            //top for denominator part only
                            this.newNumerator = Math.round(otherdecimal * 100);//50
                            
                            this.newDenominator = 100;
                            //Here we hold the difference between numerator and 100 in two vars
                            this.newNumHold = 100 - this.newNumerator;//50
                            this.newDenHold = 100 - this.newNumerator;//50
                            this.newDifference = 100 - this.newNumerator;//50
                            //if the difference between the numerator and 100 is less than or equal to the numerator
                            //find how many times the difference goes into the numerator
                            if(this.newDifference <= this.newNumerator) {
                                //something so that 66 will not be added again and goes past 67 for example
                                

                                while(this.newNumHold < this.newNumerator && this.newNumHold != (this.newNumerator - 1)) {
                                    this.newNumHold += this.newDifference;
                                    this.newNumCounter++;
                            
                                }
                                //check how many times the difference goes into the denominator
                                while(this.newDenHold < 100 && (this.newDenHold != (100 - 1) || this.newDenHold < 100 - 1)) {
                                    this.newDenHold += this.newDifference;
                                    this.newDenCounter++;
                                   
                                }
                                
                            //if the difference between the numerator and 100 is greater than the numerator
                            } else {
                                //numCounter doesn't increase because the difference will not go into the numerator
                                //while loop to incease counter the amount of times that the numerator goes into 100
                                while(this.newOtherNumerator < this.newDenominator && this.newOtherNumerator != (this.newDenominator - 1)) {
                                    this.newOtherNumerator += this.newNumerator;
                                    this.newDenCounter++;
                                }
                               
                            }

                        
                        }
        

                        //method that turns number to a fraction
                        newToFraction(this.newAmountArr[0]);
        
                        //something is happening with the whole number
            /* 
            //if the number is whole
            */
            } else {
                //returns the original number since it is a whole number and sets the counters to 0 for the ngIf directive in the template
                this.newNumCounter = 0;
                this.newDenCounter = 0;
            }
        }, 40);
    }



    runIt(s) {
        //array of the amount in string version
        this.amountArr.push(s.amount.toString());
        
        
        /*
        //if the number has a decimal

        */
        if(this.amountArr[0].includes('.')) {
            
            //saving the original mixed decimal
            this.originalMixedDecimal = this.amountArr[0];

            /*
            //if statement for mixed decimals
            */

            if(this.amountArr[0][0] != 0) {
                //pushing each string number into a new array
                for(let i = 0; i < this.amountArr[0].length; i++) {
                    this.mixedDecimalArr.push(this.amountArr[0][i]);
                }
                //the whole number of the mixed decimal goes in this var
                this.wholeNumber = this.amountArr[0][0];
                //here I am sending data to the service to be updated
                this.servingService.sendData(3, this.wholeNumber);
                //the decimal part goes in the updated array
                this.mixedDecimalArr.splice(0, 1, '0');
                //joining the string and putting it in a var
                this.newDecimal = this.mixedDecimalArr.join('');
                this.amountArr[0] = this.newDecimal;
            }

                    /*
                    //statement which turns a decimal to a fraction
                    */
                    let toFraction = decimal => {
                        //bottom for denominator part only
                        this.otherNumerator = Math.round(decimal * 100);
                        //top for denominator part only
                        this.numerator = Math.round(decimal * 100);
                        this.denominator = 100;
                        //Here we hold the difference between numerator and 100 in two vars
                        this.numHold = 100 - this.numerator;
                        this.denHold = 100 - this.numerator;
                        this.difference = 100 - this.numerator;

                        //if the difference between the numerator and 100 is less than the numerator
                        //find how many times the difference goes into the numerator
                        if(this.difference <= this.numerator) {
                            //something so that 66 will not be added again and goes past 67 for example
                            while(this.numHold < this.numerator && this.numHold != (this.numerator - 1)) {
                                this.numHold += this.difference;
                                this.numCounter++;
                    
                            }
                            
                            //check how many times the difference goes into the denominator
                            while(this.denHold < 100 && this.denHold != (100 - 1)) {
                                this.denHold += this.difference;
                                this.denCounter++;
                                
                            }
                            
                            //here I am sending data to the service to be updated
                        //if the difference between the numerator and 100 is greater than the numerator
                        } else {
                            //numCounter doesn't increase because the difference will not go into the numerator

                            //while loop to incease counter the amount of times that the numerator goes into 100
                            while(this.otherNumerator < 100 && this.otherNumerator != (100 - 1)) {
                                this.otherNumerator += this.numerator;
                                this.denCounter++;
                            }

                        }
                    }
                    //here I am sending data to the service to be updated
                    this.servingService.sendData(2, this.amountArr[0]);
                    //next I will send back decimal data to be ran throught the statement again

                    //method that turns number to a fraction
                    toFraction(this.amountArr[0]);//maybe put this in service

        /* 
        //if the number is whole
        */
        } else {
            //returns the original number since it is a whole number and sets the counters to 0 for the ngIf directive in the template
            this.numCounter = 0;
            this.denCounter = 0;
            //here I am sending data to the service to be updated
            this.servingService.sendData(1, this.amountArr[0]);
            
        }
    }



    constructor(_servingsService: ServingsService) {
        this.servingService = _servingsService;
        //now find how to get updated on the servings
    }

    addToShopping(event) {
        event.target.classList.add('btn-add-active');
    }

}