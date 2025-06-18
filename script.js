const ingredientsData = "data.json"
let selectedIngredients = [];
let totalCalories = 0;

// DOM Elements
const ingredientSelect = document.getElementById('ingredient-select');
const weightInput = document.getElementById('weight-input');
const addIngredientBtn = document.getElementById('add-ingredient');
const selectedIngredientsDiv = document.getElementById('selected-ingredients');
const totalCaloriesSpan = document.getElementById('total-calories');
const clearAllBtn = document.getElementById('clear-all');

// Khởi tạo ứng dụng
function initApp() {
    populateIngredientSelect();
    addEventListeners();
    updateDisplay();
}

// Điền dữ liệu vào select
function populateIngredientSelect() {
    ingredientsData.FoundationFoods.forEach((ingredient, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = ingredient.description;
        ingredientSelect.appendChild(option);
    });
}

// Thêm event listeners
function addEventListeners() {
    addIngredientBtn.addEventListener('click', addIngredient);
    clearAllBtn.addEventListener('click', clearAllIngredients);
    
    // Thêm ingredient khi nhấn Enter
    weightInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addIngredient();
        }
    });
}

// Thêm nguyên liệu
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

// Reset form
function resetForm() {
    ingredientSelect.value = '';
    weightInput.value = '';
}

// Xóa nguyên liệu
function removeIngredient(id) {
    selectedIngredients = selectedIngredients.filter(item => item.id !== id);
    updateDisplay();
}

// Xóa tất cả nguyên liệu
function clearAllIngredients() {
    if (selectedIngredients.length === 0) return;
    
    if (confirm('Bạn có chắc chắn muốn xóa tất cả nguyên liệu?')) {
        selectedIngredients = [];
        updateDisplay();
    }
}

// Cập nhật hiển thị
function updateDisplay() {
    updateIngredientsList();
    updateTotalCalories();
}

// Cập nhật danh sách nguyên liệu
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

// Cập nhật tổng calories
function updateTotalCalories() {
    totalCalories = selectedIngredients.reduce((sum, item) => sum + item.totalCalories, 0);
    totalCaloriesSpan.textContent = Math.round(totalCalories * 10) / 10;
}

// Chạy ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', initApp);
