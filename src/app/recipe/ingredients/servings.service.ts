import { Injectable } from '@angular/core';

@Injectable()
export class ServingsService {
    data;
    ingLength;
    index;
    exportArr = [];
    multBy;
    
    //ths object is to split the incoming information into their own categories
    //I can write codes on the incoming info and detect the code in the paramter of the method, nad insert based on that code.
    //1,2,3,4 are the codes and will go into the respected indexe
    ingreds: {
        wholes: any[],
        fractions: any[],
        mixedWhole: any[]
    } = {
        wholes: [],
        fractions: [],
        mixedWhole: []
    };

    //original recipe ingredient measures will be kept here
    og: {
        wholes: any[],
        fractions: any[],
        mixedWhole: any[]
    } = {
        wholes: [],
        fractions: [],
        mixedWhole: []
    };


    setServing(serving, index) {
        this.data = serving;
        this.index = index + 1;
        this.updateMeasures();
        return this.exportArr;
    }

    setLength(length) {
        this.ingLength = length;
    }

    incomingRecipe() {
        this.delete();
    }

    sendData(code, x) {
        //if code is == 1, 3, then the y value will be 0
        //if code is == 2, the that mean that it is a fraction and the y value is the denominator
        //note that the mixed decimal that belongs to the mixed whole is one index ahead

        if(code == '1') {
            this.ingreds.wholes.push(parseInt(x));
            this.ingreds.fractions.push(0);
            this.ingreds.mixedWhole.push(0);

            this.og.wholes.push(parseInt(x));
            this.og.fractions.push(0);
            this.og.mixedWhole.push(0);
        } else if(code == '2') {
            this.ingreds.fractions.push(parseFloat(x));
            this.ingreds.wholes.push(0);
            this.ingreds.mixedWhole.push(0);

            this.og.fractions.push(parseFloat(x));
            this.og.wholes.push(0);
            this.og.mixedWhole.push(0);
        } else if(code == '3') {
            this.ingreds.mixedWhole.push(parseInt(x));
            this.ingreds.fractions.push(0);
            this.ingreds.wholes.push(0);

            this.og.mixedWhole.push(parseInt(x));
            this.og.fractions.push(0);
            this.og.wholes.push(0);
        }

        //we are splcing the row of empty 0's in both objects
        if(this.ingLength < this.og.mixedWhole.length || this.ingLength < this.ingreds.mixedWhole.length) {
            for(let z = 0; z < this.ingLength; z++) {
                if(this.og.mixedWhole[z] > 0 && this.og.mixedWhole.length > this.ingLength) {
                    this.og.fractions.splice(z, 1);
                    this.og.mixedWhole.splice(z + 1, 1);
                    this.og.wholes.splice(z + 1, 1);

                    this.ingreds.fractions.splice(z, 1);
                    this.ingreds.mixedWhole.splice(z + 1, 1);
                    this.ingreds.wholes.splice(z + 1, 1);
                }
            }
        }

        //access the og values and multiply by that
        if(this.og.mixedWhole.length > this.ingLength + 1) {
            this.og.wholes.splice(this.ingLength + 1);
            this.og.fractions.splice(this.ingLength + 1);
            this.og.mixedWhole.splice(this.ingLength + 1);
        }
        if(this.ingreds.mixedWhole.length > this.ingLength + 1) {
            this.ingreds.wholes.splice(this.ingLength + 1);
            this.ingreds.fractions.splice(this.ingLength + 1);
            this.ingreds.mixedWhole.splice(this.ingLength + 1);
        }

        //console.log(this.og);
        //console.log(this.ingreds);

    }

    delete() {
        this.ingreds.wholes.splice(0, this.ingreds.wholes.length);
        this.ingreds.fractions.splice(0, this.ingreds.fractions.length);
        this.ingreds.mixedWhole.splice(0, this.ingreds.mixedWhole.length);

        this.og.wholes.splice(0, this.og.wholes.length);
        this.og.fractions.splice(0, this.og.fractions.length);
        this.og.mixedWhole.splice(0, this.og.mixedWhole.length);

        this.exportArr.splice(0);
    }

    editMeasures() {
        //here is where the calcs will be
        //console.log('multiplying by: ' + this.index);
        for(let i = 0; i < this.ingLength; i++) {
            this.ingreds.wholes[i] = this.og.wholes[i] * this.index;
            this.ingreds.mixedWhole[i] = this.og.mixedWhole[i] * this.index;
            this.ingreds.fractions[i] = this.og.fractions[i] * this.index;
        }
    }


    updateMeasures() {
        if(this.data) {
            //here is the control for updating and deleting items will be
            this.editMeasures();
            this.bringEmOut();     
        }
    }

    bringEmOut() {
        for(let j = 0; j < this.ingreds.wholes.length; j++) {
            if(this.ingreds.wholes[j] != 0) {
                this.exportArr.push(this.ingreds.wholes[j]);
            } else if(this.ingreds.mixedWhole[j] != 0) {
                this.exportArr.push(this.ingreds.mixedWhole[j] + this.ingreds.fractions[j]);
            } else if(this.ingreds.fractions[j] != 0) {
                this.exportArr.push(this.ingreds.fractions[j]);
            }
        }

        if(this.exportArr.length > this.ingLength) {
            this.exportArr.splice(0, this.ingLength);
        }
    }

}