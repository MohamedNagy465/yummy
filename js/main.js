document.getElementById("homeBtn").addEventListener("click", function () {
  getMeals();    
});
async function getMeals() {
  const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
  const data = await response.json();
  console.log(data);
  displayMeals(data.meals);
}

function displayMeals(meals) {
  let cartona = "";
  for (let i = 0; i < meals.length; i++) {
    cartona += `
      <div class="col-md-3 meal-item"onclick="getMealDetails('${meals[i].idMeal}')"">
        <div class="iner position-relative overflow-hidden rounded-2 cursor-pointer">
          <img class="w-100" src="${meals[i].strMealThumb}" alt="">
          <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
            <h3>${meals[i].strMeal}</h3>
          </div>
        </div>
      </div>
    `;
  }

  document.getElementById("rowData").innerHTML = cartona;
}

async function getMealDetails(mealId) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const dataMeal = await response.json();
  console.log(dataMeal);
  displayGetMeal(dataMeal.meals[0]);
}

function displayGetMeal(meal) {
    if (!meal) {
    document.getElementById("rowData").innerHTML = `<p class="text-danger">Meal data not found.</p>`;
    return;
  }
  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    let ingredient = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients += `<li class="alert alert-info m-2 p-2 rounded">${measure} ${ingredient}</li>`;
    }
  }

  let box = `
    <div class="col-md-4">
      <img class="w-100 rounded-3 mb-3" src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h2 class="text-white">${meal.strMeal}</h2>
    </div>
    <div class="col-md-8 text-white">
      <h3>Instructions</h3>
      <p>${meal.strInstructions}</p>
      <h3>Area: <span class="text-info">${meal.strArea}</span></h3>
      <h3>Category: <span class="text-warning">${meal.strCategory}</span></h3>
      
      <h3>Recipes :</h3>
      <ul class="list-unstyled d-flex flex-wrap">
        ${ingredients}
      </ul>
      <h3>Tags:</h3>

      <a href="${meal.strSource || '#'}" target="_blank" class="btn btn-success me-2">Source</a>
      <a href="${meal.strYoutube || '#'}" target="_blank" class="btn btn-danger">YouTube</a>

    </div>
  `;

  document.getElementById("rowData").innerHTML = box;
  console.log(meal); 

}
getMeals();
$(document).ready(function () {
  $(".open-close-icon").click(function () {
    $(".sideBar").toggleClass("active");

    $(this).toggleClass("fa-align-justify fa-xmark");
  });

  $(".nav-tab ul li").click(function () {
    $(".sideBar").removeClass("active");

    $(".open-close-icon").removeClass("fa-xmark").addClass("fa-align-justify");
  });
});

jQuery(function () {
  $(".loading").fadeOut(500, function () {
    $("body").css({ overflow: "auto" });
  });
});

async function getMeals() {
  $(".loading").fadeIn(2000);
  $("body").css("overflow", "hidden");

  const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
  const data = await response.json();

  $(".loading").fadeOut(500, function () {
    $("body").css("overflow", "auto");
    displayMeals(data.meals);
  });
}
$(document).on("click", ".meal-item", async function () {
  $(".loading").fadeIn(200); 
  $("body").css("overflow", "hidden");
  let mealName = $(this).find("h3").text().trim();
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
  const data = await response.json();
  $(".loading").fadeOut(500, function () {
    $("body").css("overflow", "auto");
  });
});
function showLoading() {
  $(".loading").fadeIn(200);
}

function hideLoading() {
  $(".loading").fadeOut(200);
}
$("#searchLi").click(function () {
  $("#homePage, #contactSection, .other-section").hide();
  const searchHTML = `
    <section id="searchPage" class="container py-5 text-white">
      <h2 class="mb-4 text-center">Search Meals</h2>
      <div class="row mb-4">
        <div class="col-md-6">
          <input type="text" id="searchByName" class="form-control mb-sm-2" placeholder="Search by name...">
        </div>
        <div class="col-md-6">
          <input type="text" id="searchByLetter" class="form-control" placeholder="Search by first letter..." maxlength="1">
        </div>
      </div>
      <div class="row" id="searchResults"></div>
    </section>
  `;
  $("#rowData").html(searchHTML).show();
});
$(document).on("input", "#searchByName", function () {
  let name = $(this).val().trim();
  if (name.length > 0) {
    showLoading()
    $.getJSON(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`, function (data) {
      hideLoading()
      displaySearchResults(data.meals);
    });
  } else {
    $("#searchResults").empty();
  }
});

$(document).on("input", "#searchByLetter", function () {
  let letter = $(this).val().trim().charAt(0);
  if (letter && /^[a-zA-Z]$/.test(letter)) {
    showLoading()
    $.getJSON(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`, function (data) {
      hideLoading()
      displaySearchResults(data.meals);
    });
  } else {
    $("#searchResults").empty();
  }
});
function displaySearchResults(meals) {
  let container = $("#searchResults");
  container.empty();
  setTimeout(() => {
    hideLoading();
    if (!meals) {
      container.html(`<p class="text-center text-danger">No meals found.</p>`);
      return;
    }
    meals.forEach(meal => {
      let mealCard = `
        <div class="col-md-3 mb-4">
          <div class="iner text-white h-100 cursor-pointer" data-id="${meal.idMeal}">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
            <div class="meal-layer">
              <h5 class="text-black">${meal.strMeal}</h5>
            </div>
          </div>
        </div>
      `;
      container.append(mealCard);
    });

  }, 300); 
}

$(document).on("click", ".iner", function () {
  let mealId = $(this).attr("data-id");
  showLoading();
  $.getJSON(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`, function (data) {
    hideLoading();
    if (data.meals) {
      let meal = data.meals[0];

      let ingredients = "";
      for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
          ingredients += `<li class="badge bg-primary text-white m-1">${measure} ${ingredient}</li>`;
        }
      }

      let tags = meal.strTags
        ? meal.strTags.split(",").map(tag => `<span class="badge bg-warning text-dark m-1">${tag}</span>`).join(" ")
        : "";

      let mealDetails = `
        <div class="container py-4 text-white">
          <div class="row">
            <div class="col-md-4">
              <img src="${meal.strMealThumb}" class="img-fluid rounded mb-3 shadow">
              <h3 class="mt-2">${meal.strMeal}</h3>
              <p><strong class="text-info">Category:</strong> ${meal.strCategory || 'N/A'}</p>
              <p><strong class="text-info">Area:</strong> ${meal.strArea || 'N/A'}</p>
              <div class="mb-2">${tags}</div>
              <a href="${meal.strSource}" target="_blank" class="btn btn-outline-light btn-sm me-2">Source</a>
              <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger btn-sm">YouTube</a>
            </div>
            <div class="col-md-8">
              <h4 class="text-warning">Instructions</h4>
              <p class="text-light">${meal.strInstructions}</p>
              <h5 class="text-success mt-4">Ingredients</h5>
              <ul class="list-unstyled d-flex flex-wrap">${ingredients}</ul>
            </div>
          </div>
        </div>
      `;

      $("#searchPage").hide();
      $("#rowData").html(mealDetails).show();
    }
  });
});
async function getCategories() {
  $(".loading").fadeIn(200);
  $("body").css("overflow", "hidden");

  const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  const data = await response.json();

  $(".loading").fadeOut(500, function () {
    $("body").css("overflow", "auto");
    displayCategories(data.categories);
  });
}
function displayCategories(categories) {
  let html = categories.map(cat => `
    <div class="col-md-3 category-item cursor-pointer">
      <div class="iner position-relative overflow-hidden rounded-2">
        <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}" class="w-100" />
        <div class="meal-layer position-absolute d-flex flex-column justify-content-center align-items-center text-black text-center p-2">
          <h5>${cat.strCategory}</h5>
          <p>${cat.strCategoryDescription.substring(0, 50)}...</p>
        </div>
      </div>
    </div>
  `).join("");
  $("#rowData").html(html);
}
async function getMealsByCategory(category) {
  $(".loading").fadeIn(200);
  $("body").css("overflow", "hidden");

  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  const data = await response.json();

  $(".loading").fadeOut(500, function () {
    $("body").css("overflow", "auto");
    displayMeals(data.meals);
  });
}
$(document).on("click", ".category-item", function () {
  let categoryName = $(this).find("h5").text();
  getMealsByCategory(categoryName);
});
function displayMeals(meals) {
  if (!meals) {
    $("#rowData").html("<h3 class='text-white text-center'>لا توجد نتائج</h3>");
    return;
  }

  let html = meals.map(meal => `
    <div class="col-md-3">
      <div class="meal-item cursor-pointer" onclick="getMealDetails(${meal.idMeal})">
        <div class="iner position-relative overflow-hidden rounded-2">
          <img src="${meal.strMealThumb}" class="w-100" alt="${meal.strMeal}">
          <div class="meal-layer position-absolute d-flex align-items-center justify-content-center text-black p-2">
            <h3>${meal.strMeal}</h3>
          </div>
        </div>
      </div>
    </div>
  `).join("");
  $("#rowData").html(html);
}
$(".nav-tab ul li:contains('Categories')").click(function () {
  getCategories();
  $("#homePage").hide();
  $("#searchPage").hide();
  $("#rowData").show(); 
});
// END Categories
// START Areas
async function getAreas() {
  $(".loading").fadeIn(200);
  $("body").css("overflow", "hidden");

  const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
  const data = await response.json();

  $(".loading").fadeOut(500, function () {
    $("body").css("overflow", "auto");
    displayAreas(data.meals);
  });
}
function displayAreas(areas) {
  let html = areas.map(area => `
    <div class="col-md-3 area-item cursor-pointer">
      <div class="iner position-relative overflow-hidden rounded-2 text-white text-center py-5">
        <i class="fa-solid fa-house-laptop fa-3x mb-2"></i>
        <h5>${area.strArea}</h5>
       
      </div>
    </div>
  `).join("");
  $("#rowData").html(html);
}

$(document).on("click", ".area-item", function () {
  let areaName = $(this).find("h5").text();
  getMealsByArea(areaName);
});

async function getMealsByArea(area) {
  $(".loading").fadeIn(200);
  $("body").css("overflow", "hidden");

  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  const data = await response.json();

  $(".loading").fadeOut(500, function () {
    $("body").css("overflow", "auto");
    displayMeals(data.meals);
  });
}
$(".nav-tab ul li:contains('Area')").click(function () {
  getAreas();
  $("#homePage").hide();
  $("#searchPage").hide();
  $("#rowData").show();
});
// end
async function getIngredients() {
  $(".loading").fadeIn(200);
  $("body").css("overflow", "hidden");

  const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
  const data = await response.json();

$(".loading").fadeOut(500, function () {
  $("body").css("overflow", "auto");
  displayIngredients(data.meals.slice(0, 20)); 
});

}

function displayIngredients(ingredients) {
  let html = ingredients.map(ingredient => `
    <div class="col-md-3 ingredient-item cursor-pointer">
      <div class="iner position-relative overflow-hidden rounded-2 bg-success text-white text-center py-5">
        <i class="fa-solid fa-drumstick-bite fa-3x mb-2"></i>
        <h5>${ingredient.strIngredient}</h5>
        <p style="font-size: 0.9rem;">${ingredient.strDescription ? ingredient.strDescription.split(" ").slice(0, 15).join(" ") + "..." : ""}</p>
      </div>
    </div>
  `).join("");
  $("#rowData").html(html);
}
$(document).on("click", ".ingredient-item", function () {
  let ingredientName = $(this).find("h5").text();
  getMealsByIngredient(ingredientName);
});

async function getMealsByIngredient(ingredient) {
  $(".loading").fadeIn(200);
  $("body").css("overflow", "hidden");

  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  const data = await response.json();

  $(".loading").fadeOut(500, function () {
    $("body").css("overflow", "auto");
    displayMeals(data.meals);        
  });
}
$(".nav-tab ul li:contains('Ingredients')").click(function () {
  getIngredients();
  $("#homePage").hide();
  $("#searchPage").hide();
  $("#rowData").show();
});
// end
// start
$("#contactLi").click(function () {
 $("#homePage, #searchPage, #rowData, .other-section").hide();
  const contactHTML = `
    <section id="contactSection">
      <div class="container py-5 text-white">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <h2 class="mb-4 text-center">Contact Us</h2>
            <form id="contactForm">
              <div class="row g-3">
<div class="col-md-6">
  <input type="text" class="form-control" id="nameInput" placeholder="Name" required>
  <div id="nameError" class="invalid-feedback d-none"></div>
</div>
<div class="col-md-6">
  <input type="email" class="form-control" id="emailInput" placeholder="Email" required>
  <div id="emailError" class="invalid-feedback d-none"></div>
</div>
<div class="col-md-6">
  <input type="tel" class="form-control" id="phoneInput" placeholder="Phone" required>
  <div id="phoneError" class="invalid-feedback d-none"></div>
</div>
<div class="col-md-6">
  <input type="number" class="form-control" id="ageInput" placeholder="Age" required>
  <div id="ageError" class="invalid-feedback d-none"></div>
</div>
<div class="col-md-6">
  <input type="password" class="form-control" id="passwordInput" placeholder="Password" required>
  <div id="passwordError" class="invalid-feedback d-none"></div>
</div>
<div class="col-md-6">
  <input type="password" class="form-control" id="rePasswordInput" placeholder="Re-enter Password" required>
  <div id="rePasswordError" class="invalid-feedback d-none"></div>
</div>
              </div>
             <button type="submit" id="submitBtn" class="btn btn-success w-100 mt-4" disabled>Send</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;

  $("#rowData").html(contactHTML).show();
});

$(document).on("submit", "#contactForm", function (e) {
  e.preventDefault();

  let name = $("#nameInput").val().trim();
  let email = $("#emailInput").val().trim();
  let phone = $("#phoneInput").val().trim();
  let age = $("#ageInput").val().trim();
  let password = $("#passwordInput").val();
  let rePassword = $("#rePasswordInput").val();

  if (password !== rePassword) {
    alert("Passwords do not match!");
    return;
  }

  if (!name || !email || !phone || !age || !password || !rePassword) {
    alert("Please fill in all fields.");
    return;
  }

  alert("Thank you! We received your contact.");
  this.reset();
});
function validateFieldWithMessageOnBlur(element, regex, msgId, errorMsg) {
  let val = element.val().trim();
  let messageElem = $("#" + msgId);

  if (regex.test(val)) {
    element.removeClass("is-invalid").addClass("is-valid");
    messageElem.text("").addClass("d-none");
    return true;
  } else {
    element.removeClass("is-valid").addClass("is-invalid");
    messageElem.text(errorMsg).removeClass("d-none");
    return false;
  }
}
function validatePasswordFields() {
  let pass = $("#passwordInput").val();
  let rePass = $("#rePasswordInput").val();
  let passValid = false;

  if (pass.length >= 6) {
    $("#passwordInput").removeClass("is-invalid").addClass("is-valid");
    $("#passwordError").addClass("d-none").text("");
    passValid = true;
  } else {
    $("#passwordInput").removeClass("is-valid").addClass("is-invalid");
    $("#passwordError").removeClass("d-none").text("Password must be at least 6 characters.");
    passValid = false;
  }

  if (pass === rePass && rePass.length >= 6) {
    $("#rePasswordInput").removeClass("is-invalid").addClass("is-valid");
    $("#rePasswordError").addClass("d-none").text("");
    passValid = passValid && true;
  } else {
    $("#rePasswordInput").removeClass("is-valid").addClass("is-invalid");
    $("#rePasswordError").removeClass("d-none").text("Passwords do not match.");
    passValid = false;
  }

  return passValid;
}
function checkAllValidWithoutMessages() {
  let nameValid = /^[A-Za-z ]{3,}$/.test($("#nameInput").val().trim());
  let emailValid = /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/.test($("#emailInput").val().trim());
  let phoneValid = /^[0-9]{10,15}$/.test($("#phoneInput").val().trim());
  let ageValid = /^(1[89]|[2-9]\d)$/.test($("#ageInput").val().trim());

  let pass = $("#passwordInput").val();
  let rePass = $("#rePasswordInput").val();
  let passValid = pass.length >= 6 && rePass.length >= 6 && pass === rePass;

  if (nameValid && emailValid && phoneValid && ageValid && passValid) {
    $("#submitBtn").removeAttr("disabled");
  } else {
    $("#submitBtn").attr("disabled", true);
  }
}
$(document).on("blur", "#contactForm input", function () {
  let id = $(this).attr("id");

  switch (id) {
    case "nameInput":
      validateFieldWithMessageOnBlur($(this), /^[A-Za-z ]{3,}$/, "nameError", "Name must be at least 3 letters and alphabets only.");
      break;
    case "emailInput":
      validateFieldWithMessageOnBlur($(this), /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/, "emailError", "Please enter a valid email.");
      break;
    case "phoneInput":
      validateFieldWithMessageOnBlur($(this), /^[0-9]{10,15}$/, "phoneError", "Phone must be 10-15 digits.");
      break;
    case "ageInput":
      validateFieldWithMessageOnBlur($(this), /^(1[89]|[2-9]\d)$/, "ageError", "Age must be 18 or above.");
      break;
    case "passwordInput":
    case "rePasswordInput":
      validatePasswordFields();
      break;
  }

  checkAllValidWithoutMessages();
});
$(document).on("input", "#contactForm input", function () {
  let id = $(this).attr("id");

  if (id === "passwordInput" || id === "rePasswordInput") {
    validatePasswordFields();  
  }

  checkAllValidWithoutMessages();
});

$(".open-close-icon").click(function () {
  $(".linkes ul li").each(function (index) {
    $(this).css("animation", "none");
    this.offsetHeight;
    $(this).css("animation", `slideIn 0.5s forwards ${index * 0.2}s`);
  });
});




