document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generate-button').addEventListener('click', generateRecipes);
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('recipe-modal').style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('recipe-modal')) {
            document.getElementById('recipe-modal').style.display = 'none';
        }
    });
});

async function generateRecipes() {
    const ingredient = document.getElementById('ingredient').value.trim().toLowerCase();
    if (ingredient === "") {
        document.getElementById('recipe-output').innerHTML = "<p>Please enter an ingredient.</p>";
        return;
    }

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.meals) {
            displayRecipeCards(data.meals);
        } else {
            document.getElementById('recipe-output').innerHTML = "<p>No recipes found for the given ingredient.</p>";
        }
    } catch (error) {
        console.error("Error fetching data from TheMealDB API:", error);
        document.getElementById('recipe-output').innerHTML = "<p>There was an error fetching the recipe. Please try again later.</p>";
    }
}

function displayRecipeCards(meals) {
    const recipeOutput = document.getElementById('recipe-output');
    recipeOutput.innerHTML = '';
    meals.forEach(meal => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
        `;
        recipeCard.addEventListener('click', () => displayRecipe(meal.idMeal));
        recipeOutput.appendChild(recipeCard);
    });
}

async function displayRecipe(mealId) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const recipe = data.meals[0];

        const recipeOutput = `
            <h3>${recipe.strMeal}</h3>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" style="width:100%; max-width:300px;">
            <p><strong>Category:</strong> ${recipe.strCategory}</p>
            <p><strong>Cuisine:</strong> ${recipe.strArea}</p>
            <p><strong>Instructions:</strong> ${recipe.strInstructions}</p>
            <h4>Ingredients:</h4>
            <ul>
                ${getIngredientsList(recipe)}
            </ul>
        `;
        document.getElementById('modal-recipe-content').innerHTML = recipeOutput;
        document.getElementById('recipe-modal').style.display = 'block';
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        document.getElementById('modal-recipe-content').innerHTML = "<p>There was an error fetching the recipe details. Please try again later.</p>";
    }
}

function getIngredientsList(recipe) {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient) {
            ingredientsList += `<li>${ingredient} - ${measure}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
}
