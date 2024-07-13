const cardsAll = document.querySelector(".cards-all");
const btnContainer = document.querySelector(".btn-container");
const clearBtn = document.querySelector(".clear");
const filteredCard = document.querySelector(".filtered-card");

const dataArray = [];
const filteredCardBtnsArray = [];

//! fetch the data
const fetchData = async () => {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    dataArray.push(...data);
    //console.log(dataArray);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  //!display the cards dynamically
  const displayMainCards = () =>
    dataArray.map((item) => {
      const card = document.createElement("div");
      card.setAttribute("class", "card container");
      card.innerHTML = `<div class="card-main">
          <div class="logo">
            <img src=${item.logo} alt="" />
          </div>
          <div class="card-main-top">
            <div class="company">${item.company}</div>
           
          </div>
          <div class="card-main-position position">
            <h1>${item.position}</h1>
          </div>
          <div class="card-main-bottom">
            <div class="postedAt">${item.postedAt}</div>
            <div class="dot"></div>
            <div class="contract">${item.contract}</div>
            <div class="dot"></div>
            <div class="location">${item.location}</div>
          </div>
        </div>
        <div class="card-languages">
          
        </div>`;

      //! dynamically display all the buttons
      if (item.new) {
        const btnNew = document.createElement("button");
        btnNew.setAttribute("class", "btn-new");
        btnNew.textContent = "new!";
        card.querySelector(".card-main-top").appendChild(btnNew);
      }

      if (item.featured) {
        card.setAttribute("class", "card container featured");
        const btnFeatured = document.createElement("button");
        btnFeatured.setAttribute("class", "btn-featured");
        btnFeatured.textContent = "Featured";
        card.querySelector(".card-main-top").appendChild(btnFeatured);
      }

      const btnRole = document.createElement("button");
      btnRole.setAttribute("class", "btn-main-card");
      btnRole.dataset.type = item.role;
      btnRole.textContent = item.role;
      card.querySelector(".card-languages").appendChild(btnRole);

      const btnLevel = document.createElement("button");
      btnLevel.setAttribute("class", "btn-main-card");
      btnLevel.dataset.type = item.level;
      btnLevel.textContent = item.level;
      card.querySelector(".card-languages").appendChild(btnLevel);

      item.languages.forEach((lang) => {
        const btnLanguages = document.createElement("button");
        btnLanguages.setAttribute("class", "btn-main-card");
        btnLanguages.dataset.type = lang;
        btnLanguages.textContent = lang;
        card.querySelector(".card-languages").appendChild(btnLanguages);
      });

      item.tools.forEach((tool) => {
        const btnTools = document.createElement("button");
        btnTools.setAttribute("class", "btn-main-card");
        btnTools.dataset.type = tool;
        btnTools.textContent = tool;
        card.querySelector(".card-languages").appendChild(btnTools);
      });

      cardsAll.appendChild(card);
    });

  displayMainCards();

  //! get all the btn-languages that appear in the cards
  //! when we click them - create another of them WITH a remove-btn and display them in the filteredCard
  const btns = Array.from(document.querySelectorAll(".btn-main-card"));
  //console.log(btns);
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const thisBtn = btn.dataset.type;
      // console.log(thisBtn);
      //! now we create and push btns into the filteredCardBtnsArray
      //! doing it this way we will not get repeats of the same word
      if (!filteredCardBtnsArray.includes(thisBtn)) {
        filteredCardBtnsArray.push(thisBtn);

        //! now we must create and display the filtered card
        displayFilteredCard();
      }
      updateMainCard(); //!this will move out the cards according to if they have a btn-language btn which matches the one we clicked
    });
  });
};
fetchData();

const displayFilteredCard = () => {
  //! for each btn of the filteredCardBtnsArray we create a btn and put it in the btn-container which will go into the filtered card
  btnContainer.innerHTML = "";
  filteredCardBtnsArray.forEach((selectedBtn) => {
    const btnFiltered = document.createElement("div");
    btnFiltered.setAttribute("class", "btn-filtered");
    btnFiltered.innerHTML = `<div>${selectedBtn}</div>
            <button class="btn-remove">
              <img src="images/icon-remove.svg" alt="" />
            </button>`;
    btnContainer.appendChild(btnFiltered);

    filteredCard.style.visibility = "visible";

    //! now get the btnsRemove into an array - so the btn-remove and its img - X - we need this so that we can do a forEach loop on each X and remove its parent which is the btn-filtered
    let btnsRemove = [];
    btnsRemove.push(btnFiltered.querySelector("button"));
    //console.log(btnsRemove);

    //console.log(filteredCardBtnsArray);

    btnsRemove.forEach((btn) => {
      btn.addEventListener("click", () => {
        btnContainer.removeChild(btn.parentElement);
        //e.target.parentElement.parentElement.style.visibility = "hidden"; this does remove the grandparent BUT it leaves the Clear btn if its the last one - why? b/c we are just hiding it and not removing the child??

        //!this will remove one element at the index of the item the selectedBtn not the btn
        //console.log(filteredCardBtnsArray.indexOf(selectedBtn));
        filteredCardBtnsArray.splice(
          filteredCardBtnsArray.indexOf(selectedBtn),
          1
        );
        //console.log(filteredCardBtnsArray);

        updateMainCard();

        if (btnContainer.innerHTML) {
          //!so if there is something (at least 1 btn ) in the btnContainer keep its parent (filteredCard) but if there are no btns  - remove its parent - this way the filteredCard will not sit empty with just the clear btn in it
          btnContainer.parentElement.style.visibility = "visible";
        } else {
          btnContainer.parentElement.style.visibility = "hidden";
          const cards = document.querySelectorAll(".card");
          cards.forEach((card) => {
            card.classList.remove("remove");
          });
        }
      });
    });
  });
};

//! this is really the FILTER part
//! we must link the textContent/dataset.type of the btns in the main cards with the btns in the filteredCard and we already have all the filteredCard btns in an array called filteredCardBtnsArray from above so now we will get an array of all the btns in each main card
const updateMainCard = () => {
  //! first get all the cards
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    //console.log(card);
    const mainCardBtns = card.querySelectorAll(".btn-main-card");
    let arrayOfAllBtnsInMainCard = [];
    mainCardBtns.forEach((btn) => {
      arrayOfAllBtnsInMainCard.push(btn.dataset.type);
      console.log(arrayOfAllBtnsInMainCard);
    });

    //! if the btn in the filteredCardBtnsArray is not included in the arrayOfAllBtnsInMainCard we remove the card - as in, we filter it out
    let isInArray = true;
    filteredCardBtnsArray.forEach((btn) => {
      console.log(btn);
      if (!arrayOfAllBtnsInMainCard.includes(btn)) {
        isInArray = false;
      }
      if (!isInArray) {
        card.classList.add("remove"); //! this is the animation
      } else {
        card.classList.remove("remove"); //! bring the cards back in
      }
    });
  });
};

clearBtn.addEventListener("click", () => {
  filteredCardBtnsArray = []; //! 1st we empty the array
  btnContainer.innerHTML = ""; //! clear out the btnContainer so we don't get doubles of the same one
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.classList.remove("remove");
    //! this removes the animation of all the cards we created or in other words it brings back all the cards
  });
  filteredCard.style.display = "none";
});
