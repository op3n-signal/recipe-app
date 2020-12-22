import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecipeViewComponent } from './recipe/recipe.component';
import { SearchComponent } from './recipe/search/search.component';
import { ShoppingListComponent } from './recipe/shopping-list/shopping-list.component';

import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';
import { IngredientsComponent } from './recipe/ingredients/ingredients.component';

import { ServingsService } from './recipe/ingredients/servings.service';

@NgModule({
  declarations: [
    AppComponent,
    RecipeViewComponent,
    SearchComponent,
    ShoppingListComponent,
    RecipeListComponent,
    IngredientsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [ServingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
