const ingredientsData = {"data.json"};

let selectedIngredients = [];
let totalCalories = 0;

const ingredientSelect = document.getElementById('ingredient-select');
const weightInput = document.getElementById('weight-input');
const addIngredientBtn = document.getElementById('add-ingredient');
const selectedIngredientsDiv = document.getElementById('selected-ingredients');
const totalCaloriesSpan = document.getElementById('total-calories');
const clearAllBtn = document.getElementById('clear-all');

function initApp() {
  populateIngredientSelect();
  addEventListeners();
  updateDisplay();
}

function populateIngredientSelect() {
  ingredientsData.FoundationFoods.forEach((ingredient, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = ingredient.description;
    ingredientSelect.appendChild(option);
  });
}

function addEventListeners() {
  addIngredientBtn.addEventListener('click', addIngredient);
  clearAllBtn.addEventListener('click', clearAllIngredients);
  weightInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addIngredient();
    }
  });
}

function addIngredient() {
  const selectedIndex = ingredientSelect.value;
  const weight = parseFloat(weightInput.value);

  if (!selectedIndex || !weight || weight <= 0) {
    alert('Vui lòng chọn nguyên liệu và nhập khối lượng hợp lệ!');
    return;
  }

  const ingredient = ingredientsData.FoundationFoods[selectedIndex];
  const calories = Math.round((ingredient.calories * weight) / 100 * 10) / 10;

  const ingredientItem = {
    id: Date.now(),
    name: ingredient.description,
    weight: weight,
    caloriesPer100g: ingredient.calories,
    totalCalories: calories
  };

  selectedIngredients.push(ingredientItem);
  updateDisplay();
  resetForm();
}

function resetForm() {
  ingredientSelect.value = '';
  weightInput.value = '';
}

function removeIngredient(id) {
  selectedIngredients = selectedIngredients.filter(item => item.id !== id);
  updateDisplay();
}

function clearAllIngredients() {
  if (selectedIngredients.length === 0) return;

  if (confirm('Bạn có chắc chắn muốn xóa tất cả nguyên liệu?')) {
    selectedIngredients = [];
    updateDisplay();
  }
}

function updateDisplay() {
  updateIngredientsList();
  updateTotalCalories();
}

function updateIngredientsList() {
  if (selectedIngredients.length === 0) {
    selectedIngredientsDiv.innerHTML = '<p class="empty-state">Chưa có nguyên liệu nào được thêm</p>';
    return;
  }

  const ingredientsHTML = selectedIngredients.map(item => `
    <div class="ingredient-item">
      <div class="ingredient-info">
        <div class="ingredient-name">${item.name}</div>
        <div class="ingredient-details">${item.weight}g • ${item.caloriesPer100g} kcal/100g</div>
      </div>
      <div class="ingredient-calories">${item.totalCalories} kcal</div>
      <button class="remove-btn" onclick="removeIngredient(${item.id})">Xóa</button>
    </div>
  `).join('');

  selectedIngredientsDiv.innerHTML = ingredientsHTML;
}

function updateTotalCalories() {
  totalCalories = selectedIngredients.reduce((sum, item) => sum + item.totalCalories, 0);
  totalCaloriesSpan.textContent = Math.round(totalCalories * 10) / 10;
}

document.addEventListener('DOMContentLoaded', initApp);
