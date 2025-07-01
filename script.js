let ingredientsData = {};
let selectedIngredients = [];
let totalCalories = 0;

// DOM Elements
const ingredientSelect = document.getElementById('ingredient-select');
const weightInput = document.getElementById('weight-input');
const addIngredientBtn = document.getElementById('add-ingredient');
const selectedIngredientsDiv = document.getElementById('selected-ingredients');
const totalCaloriesSpan = document.getElementById('total-calories');
const clearAllBtn = document.getElementById('clear-all');

// Tải dữ liệu từ file JSON và khởi tạo app
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    ingredientsData = data;
    initApp();
  })
  .catch(error => {
    console.error('Error data.json:', error);
    alert('Can't download the ingredients');
  });

// Khởi tạo ứng dụng
function initApp() {
  populateIngredientSelect();
  addEventListeners();
  updateDisplay();
}

// Điền dữ liệu vào dropdown
function populateIngredientSelect() {
  ingredientsData.FoundationFoods.forEach((ingredient, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = ingredient.description;
    ingredientSelect.appendChild(option);
  });
}

// Gắn sự kiện
function addEventListeners() {
  addIngredientBtn.addEventListener('click', addIngredient);
  clearAllBtn.addEventListener('click', clearAllIngredients);
  
  weightInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addIngredient();
    }
  });
}

// Thêm nguyên liệu vào danh sách
function addIngredient() {
  const selectedIndex = ingredientSelect.value;
  const weight = parseFloat(weightInput.value);

  if (!selectedIndex || !weight || weight <= 0) {
    alert('Please select ingredients and enter valid weight!');
    return;
  }

  const ingredient = ingredientsData.FoundationFoods[selectedIndex];
  const energyNutrient = ingredient.foodNutrients.find(n => n.nutrient?.id === 1008);
  const caloriesPer100g = energyNutrient ? energyNutrient.amount : 0;

  const calories = Math.round((caloriesPer100g * weight) / 100 * 10) / 10;

  const ingredientItem = {
    id: Date.now(),
    name: ingredient.description,
    weight: weight,
    caloriesPer100g: caloriesPer100g,
    totalCalories: calories
  };


  selectedIngredients.push(ingredientItem);
  updateDisplay();
  resetForm();
}

// Reset form nhập liệu
function resetForm() {
  ingredientSelect.value = '';
  weightInput.value = '';
}

// Xoá một nguyên liệu khỏi danh sách
function removeIngredient(id) {
  selectedIngredients = selectedIngredients.filter(item => item.id !== id);
  updateDisplay();
}

// Xoá toàn bộ nguyên liệu
function clearAllIngredients() {
  if (selectedIngredients.length === 0) return;

  if (confirm('Are you sure about delete all of that?')) {
    selectedIngredients = [];
    updateDisplay();
  }
}

// Cập nhật hiển thị
function updateDisplay() {
  updateIngredientsList();
  updateTotalCalories();
}

// Hiển thị danh sách nguyên liệu đã chọn
function updateIngredientsList() {
  if (selectedIngredients.length === 0) {
    selectedIngredientsDiv.innerHTML = '<p class="empty-state">No ingredients added yet</p>';
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

// Cập nhật tổng số calories
function updateTotalCalories() {
  totalCalories = selectedIngredients.reduce((sum, item) => sum + item.totalCalories, 0);
  totalCaloriesSpan.textContent = Math.round(totalCalories * 10) / 10;
}
