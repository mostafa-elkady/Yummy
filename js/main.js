$(document).ready(function () {
  //Start Show/hide side menu
  let menuWidth = $(".sidebar-menu").outerWidth();
  $("#showMenu").click(function () {
    if ($(".sidebar").css("left") === "0px") {
      closeNav();
    } else {
      openNav();
    }
  });

  function closeNav() {
    $(".sidebar").animate({ left: `-${menuWidth}px` }, 500, function () {
      $(".icon-close").addClass("icon-menu").removeClass("icon-close");
    });
    $(".links li").animate(
      {
        top: 300,
      },
      200
    );
  }
  function openNav() {
    $(".icon-menu").addClass("icon-close").removeClass("icon-menu");
    $(".sidebar").animate({ left: "0px" }, 200);
    // links animation
    for (let i = 0; i < 6; i++) {
      $(".links li")
        .eq(i)
        .animate(
          {
            top: 0,
          },
          (i + 5) * 100
        );
    }
  }
  // End  Show/hide side menu
  // SHow animation
  function showAnimation() {
    $("#animation").css("display", "flex");
    $("#view").html("");
  }
  // Hide Animation
  function hideAnimation() {
    $("#animation").css("display", "none");
  }

  // GetHome Function
  async function getHome() {
    showAnimation();
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s`,
      { method: "GET" }
    );
    let data = await response.json();
    hideAnimation();
    closeNav();
    displayMeals(data);
  }
  // Display Meals Function
  function displayMeals(data) {
    let meals = data.meals;
    let box = "";
    const searchTerm = $("#searchByName").val();
    const searchByFL = $("#searchByFL").val();
    for (let i = 0; i < meals.length; i++) {
      if (
        (!searchTerm ||
          meals[i].strMeal.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!searchByFL ||
          meals[i].strMeal.charAt(0).toLowerCase() === searchByFL.toLowerCase())
      ) {
        box += `
          <div class="col-sm-6 col-md-3 overflow-hidden mb-4 rounded-2">
            <div class=" box  position-relative cursor-pointer" id="${meals[i].idMeal}">
              <img id="${meals[i].idMeal}" src="${meals[i].strMealThumb}" alt="image" class="img-fluid">
              <div id="${meals[i].idMeal}" class="overlay position-absolute h-100 w-100  left-0 d-flex justify-content-center align-items-center">
                <h3 id="${meals[i].idMeal}" class="fw-bold">${meals[i].strMeal}</h3>
              </div>
            </div>
          </div>
        `;
      }
    }
    $("#view").html(box);
    $(".box").click(function (e) {
      getMeal(e.target.id);
    });
  }

  (function () {
    getHome();
  })();
  $("#home").click(function () {
    $("#searchview").html("");
    getHome();
  });
  $(".logo").click(function () {
    $("#searchview").html("");
    getHome();
  });
  async function getMeal(id) {
    showAnimation();
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await response.json();
    hideAnimation();
    showMeal(data.meals[0]);
  }

  function showMeal(data) {
    $("#animation").fadeOut(600);
    let box = `  
     <section id="mealInfo" class="row text-white pb-5">
  <div id="mealImg" class="d-flex flex-column col-md-4">
    <img src=${data.strMealThumb} alt="" class=" rounded-3">
    <h2 class="text-center mt-3">${data.strMeal}</h2>
  </div>
  <div id="mealIns" class="col-md-8">
    <h2>Instructions</h2>
    <p>${data.strInstructions}</p>
    <h3><span class="fw-bolder">Area : </span>${data.strArea}</h3>
    <h3><span class="fw-bolder">Category : </span>${data.strCategory}</h3>
    <h3>Recipes : </h3>
    <ul id="receipes" class="d-flex flex-wrap">
    </ul>
    <div class="mb-3">
    <h3 class="d-inline-block">Tags :</h3>
    <span class="badge text-bg-info  px-2 mb-0">${
      data.strTags || "Author"
    }</span> 
    </div>
    <a id="source" class="btn btn-warning me-2" href="${
      data.strSource
    }" target="_blank">Source</a>
    <a id="youtube" class="btn btn-danger" href="${
      data.strYoutube
    }" target="_blank">Youtube</a>
  </div>
    </section>`;

    $("#view").html(box);

    let ul = "";
    for (var i = 1; i <= 20; i++) {
      if (data[`strMeasure${i}`] && data[`strMeasure${i}`].trim() !== "") {
        ul += `<li class="badge text-bg-success p-2 m-2 fs-6 fw-normal">${
          data[`strMeasure${i}`]
        }  ${data[`strIngredient${i}`]}</li>`;
      }
    }
    $("#receipes").html(ul);
  }

  // Search
  async function getMealsByFullSearch(searched) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searched}`
    );
    const data = await response.json();

    closeNav();
    displayMeals(data);
  }

  async function getMealsByFirstLetter(searched) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${searched}`
    );
    const data = await response.json();

    closeNav();
    displayMeals(data);
  }
  function showSearch() {
    let box = `<div class="d-flex justify-content-center border-bottom border-danger">
<input id="searchByName" type="text" class="form-control m-4 w-50" placeholder="Search By Name">
<input id="searchByFL" type="text" class="form-control m-4 w-50" placeholder="Search By First Letter" maxlength="1" >
</div>`;

    $("#searchview").html(box);
    $("#view").html("");
    $("#searchByName").on("input", () => {
      const searchTerm = $("#searchByName").val();
      getMealsByFullSearch(searchTerm);
    });

    $("#searchByFL").on("input", () => {
      const searchTerm = $("#searchByFL").val();
      getMealsByFirstLetter(searchTerm);
    });
  }

  $("#search").click(function (e) {
    e.preventDefault();
    closeNav();
    showSearch();
    if ($("#searchByFL").val() == "" && $("#searchByName").val() == "") {
      $("#view").html("");
    }
    console.log($("#searchByFL").val());
  });
  //************************Strat Category
  async function getMealCategories() {
    showAnimation();
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const data = await response.json();
    hideAnimation();
    displayCategories(data);
    closeNav();
  }

  async function filterMealsByCategory(category) {
    showAnimation();
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    const data = await response.json();
    displayMeals(data);
    hideAnimation();
  }

  function displayCategories(data) {
    let cat = data.categories;
    let box = "";
    for (let i = 0; i < cat.length; i++) {
      box += `    <div id="${
        cat[i].strCategory
      }"  class="col-md-3 mb-4  position-relative box">
  <img id="${cat[i].strCategory}" class="w-100 rounded-3" src="${
        cat[i].strCategoryThumb
      }" alt="${cat[i].strCategory}" >
  <div id="${
    cat[i].strCategory
  }"class="overlay d-flex flex-column align-items-center rounded-3 ps-2">
    <h3 id="${cat[i].strCategory}">${cat[i].strCategory}</h3>
    <p id="${cat[i].strCategory}" class="fw-normal">${cat[
        i
      ].strCategoryDescription
        .split(" ")
        .slice(0, 20)
        .join(" ")}</p>
  </div>
</div>`;
    }
    $("#view").html(box);
    $("#searchview").html("");
    $(".box").click(function (e) {
      filterMealsByCategory(e.target.id);
    });
  }

  $("#categories").click(function (e) {
    e.preventDefault();
    getMealCategories();
    closeNav();
  });
  //************************End Category
  //************************Strat Areas
  async function getAreas() {
    showAnimation();
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    const data = await response.json();
    hideAnimation();
    displayAreas(data);
  }

  function displayAreas(data) {
    $("#contactForm").removeClass("vh-100");
    let areas = data.meals;
    let box = "";
    for (let i = 0; i < areas.length; i++) {
      box += `   <div id="${areas[i].strArea}" class="text-white btn col-md-3 mb-4 area">
        <i id="${areas[i].strArea}" class="fa-solid fa-house-laptop fa-4x w-100 "></i>
        <h3 id="${areas[i].strArea}">${areas[i].strArea}</h3>
      </div>   `;
    }
    $("#view").html(box);
    $("#searchview").html("");
    $(".area").click(function (e) {
      getMealsByArea(e.target.id);
      console.log(e.target.id);
    });
  }

  $("#areas").click(function (e) {
    getAreas();
    closeNav();
  });

  async function getMealsByArea(area) {
    showAnimation();
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
    const response = await fetch(url);
    const data = await response.json();
    hideAnimation();
    displayMeals(data);
  }
  //************************End Areas
  //************************Start Ingrediants
  async function getIngrediants() {
    showAnimation();
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );
    const data = await response.json();
    hideAnimation();
    closeNav();
    displayIngrediants(data);
  }

  function displayIngrediants(data) {
    let ingrediants = data.meals;
    let box = "";
    for (let i = 0; i < 20; i++) {
      box += `   <div id="${
        ingrediants[i].strIngredient
      }" class="text-white btn col-md-3 mb-4 overfolw-hidden ing">
      <i id="${
        ingrediants[i].strIngredient
      }" class="icon-ingredient  w-100 "></i>
      <h3 id="${ingrediants[i].strIngredient}">${
        ingrediants[i].strIngredient
      }</h3>
      <p id="${ingrediants[i].strIngredient}">${ingrediants[i].strDescription
        .split(" ")
        .slice(0, 20)
        .join(" ")}</p>
    </div>   `;
    }
    $("#view").html(box);
    $("#searchview").html("");
    $(".ing").click(function (e) {
      getMealsByIngrediant(e.target.id);
      console.log(e.target.id);
    });
  }

  $("#ingredients").click(function (e) {
    e.preventDefault();
    getIngrediants();
  });

  async function getMealsByIngrediant(mainIngrediant) {
    showAnimation();
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngrediant}`;
    const response = await fetch(url);
    const data = await response.json();
    hideAnimation();
    displayMeals(data);
  }

  //************************End Ingrediants
  //************************Start Contact Form
  function showForm() {
    let box = "";
    box += `<div class="form">
    <h2 class="text-center">Fill Form </h2>
    <div class="row">
      <div class="col-md-12 d-flex justify-content-around flex-column">
        <div class="mb-3">
          <input
            id="name"
            type="text"
            class="form-control"
            placeholder="Enter Your Name"
          />
          <div
            id="nameWarning"
            class="d-none warningBG warningColor justify-content-center p-3 mt-2 rounded-3"
          >
            Special characters and numbers not allowed
          </div>
        </div>
  
        <div class="mb-3">
          <input
            id="email"
            type="text"
            class="form-control"
            placeholder="Enter Your Email"
          />
          <div
            id="emailWarning"
            class="d-none warningBG warningColor justify-content-center p-3 mt-2 rounded-3"
          >
            Email not valid *exemple@yyy.zzz
          </div>
        </div>
      </div>
  
      <div class="col-md-12 d-flex justify-content-around flex-column">
        <div class="mb-3">
          <input
            id="phone"
            type="text"
            class="form-control"
            placeholder="Enter Your Phone"
          />
          <div
            id="phoneWarning"
            class="d-none warningBG warningColor justify-content-center p-3 mt-2 rounded-3"
          >
            Enter valid Phone Number
          </div>
        </div>
  
        <div class="mb-3">
          <input
            id="age"
            type="number"
            class="form-control"
            placeholder="Enter Your Age"
          />
          <div
            id="ageWarning"
            class="d-none warningBG warningColor justify-content-center p-3 mt-2 rounded-3"
          >
            Enter valid age
          </div>
        </div>
      </div>
      <div class="col-md-12 d-flex justify-content-around flex-column">
        <div class="mb-3">
          <input
            id="pass"
            type="password"
            class="form-control"
            placeholder="Enter Your Password"
          />
          <div
            id="passWarning"
            class="d-none warningBG warningColor justify-content-center p-3 mt-2 rounded-3"
          >
            Enter valid password *Minimum eight characters, at least one letter
            and one number:*
          </div>
        </div>
  
        <div class="mb-3">
          <input
            id="repass"
            type="password"
            class="form-control"
            placeholder="Repassword"
          />
          <div
            id="repassWarning"
            class="d-none warningBG warningColor justify-content-center p-3 mt-2 rounded-3"
          >
            Enter valid repassword
          </div>
        </div>
      </div>
    </div>
    <button id="formSubmitBtn" class="btn btn-outline-success mx-auto mt-3 d-block" disabled>Submit</button>
  </div>
  

  
  `;

    $("#view").html(box);
    $("#searchview").html("");               
    closeNav();
    let nameRegFlag = false,
      emailRegFlag = false,
      ageRegFlag = false,
      phoneRegFlag = false,
      passRegFlag = false,
      repassRegFlag = false;

    $("#name").on("input", () => {
      const searchTerm = $("#name").val();
      if (nameRegex(searchTerm)) {
        nameRegFlag = true;
        $("#nameWarning").removeClass("d-flex");
        $("#nameWarning").addClass("d-none");
      } else {
        nameRegFlag = false;
        $("#nameWarning").removeClass("d-none");
        $("#nameWarning").addClass("d-flex");
      }

      if (
        nameRegFlag &&
        emailRegFlag &&
        ageRegFlag &&
        phoneRegFlag &&
        passRegFlag &&
        repassRegFlag
      ) {
        $("#formSubmitBtn").prop("disabled", false);
      } else {
        $("#formSubmitBtn").prop("disabled", true);
      }
    });

    $("#email").on("input", () => {
      const searchTerm = $("#email").val();
      if (emailRegex(searchTerm)) {
        emailRegFlag = true;
        $("#emailWarning").removeClass("d-flex");
        $("#emailWarning").addClass("d-none");
      } else {
        emailRegFlag = false;
        $("#emailWarning").removeClass("d-none");
        $("#emailWarning").addClass("d-flex");
      }

      if (
        nameRegFlag &&
        emailRegFlag &&
        ageRegFlag &&
        phoneRegFlag &&
        passRegFlag &&
        repassRegFlag
      ) {
        $("#formSubmitBtn").prop("disabled", false);
      } else {
        $("#formSubmitBtn").prop("disabled", true);
      }
    });

    $("#phone").on("input", () => {
      const searchTerm = $("#phone").val();
      if (phoneRegex(searchTerm)) {
        phoneRegFlag = true;
        $("#phoneWarning").removeClass("d-flex");
        $("#phoneWarning").addClass("d-none");
      } else {
        phoneRegFlag = false;
        $("#phoneWarning").removeClass("d-none");
        $("#phoneWarning").addClass("d-flex");
      }

      if (
        nameRegFlag &&
        emailRegFlag &&
        ageRegFlag &&
        phoneRegFlag &&
        passRegFlag &&
        repassRegFlag
      ) {
        $("#formSubmitBtn").prop("disabled", false);
      } else {
        $("#formSubmitBtn").prop("disabled", true);
      }
    });

    $("#age").on("input", () => {
      const searchTerm = $("#age").val();
      if (ageRegex(searchTerm)) {
        ageRegFlag = true;
        $("#ageWarning").removeClass("d-flex");
        $("#ageWarning").addClass("d-none");
      } else {
        ageRegFlag = false;
        $("#ageWarning").removeClass("d-none");
        $("#ageWarning").addClass("d-flex");
      }

      if (
        nameRegFlag &&
        emailRegFlag &&
        ageRegFlag &&
        phoneRegFlag &&
        passRegFlag &&
        repassRegFlag
      ) {
        $("#formSubmitBtn").prop("disabled", false);
      } else {
        $("#formSubmitBtn").prop("disabled", true);
      }
    });

    $("#pass").on("input", () => {
      const searchTerm = $("#pass").val();
      if (passRegex(searchTerm)) {
        passRegFlag = true;
        $("#passWarning").removeClass("d-flex");
        $("#passWarning").addClass("d-none");
      } else {
        passRegFlag = false;
        $("#passWarning").removeClass("d-none");
        $("#passWarning").addClass("d-flex");
      }

      if (
        nameRegFlag &&
        emailRegFlag &&
        ageRegFlag &&
        phoneRegFlag &&
        passRegFlag &&
        repassRegFlag
      ) {
        $("#formSubmitBtn").prop("disabled", false);
      } else {
        $("#formSubmitBtn").prop("disabled", true);
      }
    });

    $("#repass").on("input", () => {
      const searchTerm = $("#repass").val();
      if (searchTerm == $("#pass").val()) {
        repassRegFlag = true;
        $("#repassWarning").removeClass("d-flex");
        $("#repassWarning").addClass("d-none");
      } else {
        repassRegFlag = false;
        $("#repassWarning").removeClass("d-none");
        $("#repassWarning").addClass("d-flex");
      }

      if (
        nameRegFlag &&
        emailRegFlag &&
        ageRegFlag &&
        phoneRegFlag &&
        passRegFlag &&
        repassRegFlag
      ) {
        $("#formSubmitBtn").prop("disabled", false);
      } else {
        $("#formSubmitBtn").prop("disabled", true);
      }
    });

    $("#formSubmitBtn").click(function (e) {
      e.preventDefault();
    });
  }
  // Form REGEX
  function nameRegex(input) {
    let regex = /^[a-zA-Z\s]+$/;
    if (regex.test(input)) return true;
    else return false;
  }

  function emailRegex(input) {
    let regex = /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (regex.test(input)) return true;
    else return false;
  }

  function phoneRegex(input) {
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (regex.test(input)) return true;
    else return false;
  }

  function ageRegex(input) {
    let regex = /^(?:[1-9]|[1-9][0-9])$/;
    if (regex.test(input)) return true;
    else return false;
  }

  function passRegex(input) {
    let regex = /^(?=.*[a-zA-Z])(?=.*\d)[\w]{8,}$/;
    if (regex.test(input)) return true;
    else return false;
  }

  $("#contact").click(function (e) {
    e.preventDefault();
    showForm();
  });

  //************************End Contact Form
});
