/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/

// Add variables that store DOM elements you will need to reference and/or manipulate

// Centralize selectors and vars that can be changed 
const UICtrl = (() => {
  const UISelectors = {
    studentItem: '.student-item',
    studentList: '.student-list',
    studentName: '.student-details h3',
    page: '.page',
    anchor: '.pagination li a',
    pagination: '.pagination',
    paginationLI: '.pagination ul',
    pageHeader: '.page-header',
    searchInput: '.student-search input',
    searchButton: '.student-search button',
    noRecords: '.no-records'
  }
  // You can adjust recordsPerPage
  const UIConfig = {
    recordsPerPage: 10,
    currentPage: 1
  }
  return {
    // used for mapping the selectors
    getSelectors: () => UISelectors,

    // used for getting config values
    getConfig: () => UIConfig,

    // Create a function to hide all of the items in the list excpet for the ten you want to show
    // Tip: Keep in mind that with a list of 54 studetns, the last page will only display four
    showPage: (list, page, recordsPerPage) => {
      for (let i = 0; i < list.length; i++) {
        if (i >= (page * recordsPerPage) - recordsPerPage && i < (page * recordsPerPage)) {
          // if records are within range display
          list[i].style.display = 'block';
        } else {
          // if records fall outside of range hide
          list[i].style.display = 'none';
        }
      }
    },

    // Pagination magic 
    appendPageLinks: (list, currentPage, recordsPerPage) => {
      console.log(list);
      // Get UI selectors
      const UISelectors = UICtrl.getSelectors();
      // determine how many pages are needed for the list by deviding the total number of list items by the max number of items per page
      let pagesNeeded = Math.ceil(list.length / recordsPerPage);
      console.log(`Pages needed: ${pagesNeeded}`);

      // if pagination already exists, remove it,
      if (document.querySelector(UISelectors.pagination)) {
        document.querySelector(UISelectors.pagination).remove();
      }

      // create a div, give it the "pagination" class, and append to the .page div


      // create outer div 
      const div = document.createElement('div')
      div.className = 'pagination';
      document.querySelector(UISelectors.page).appendChild(div);

      // create ul
      const ul = document.createElement('ul');
      div.appendChild(ul);


      for (let i = 0; i < pagesNeeded; i++) {
        // Show pagination links if pages needed is greater then 1
        if (pagesNeeded > 1) {
          let anchor = `<a href="#">${i + 1}</a>`
          let li = document.createElement('li');
          li.innerHTML = anchor;

          // append each link inside the ul
          ul.appendChild(li);
          document.querySelector(UISelectors.paginationLI)
            .getElementsByTagName('a')[currentPage - 1]
            .classList.add('active');
        }
      }


      // Event listener for when pagination buttons are clicked
      document.querySelector(UISelectors.paginationLI).addEventListener('click', e => {
        e.preventDefault();
        let anchors = document.querySelectorAll(UISelectors.anchor);
        // loop over pagination links to remove active class from all
        for (let i = 0; i < anchors.length; i++) {
          anchors[i].classList.remove('active');
          //  Assign active to button clicked
          e.target.classList.add('active');
        }
        currentPage = e.target.innerHTML;
        UICtrl.showPage(list, currentPage, recordsPerPage);
      });
    },

    search: (searchList, listItem, currentPage, recordsPerPage) => {
      // Create search bar
      const searchBar = document.createElement('div');
      searchBar.className = 'student-search';
      searchBar.innerHTML = `
        <input placeholder="Search for students...">
        <button>Search</button>
      `
      // the logic to filter out the records to be displayed
      document.querySelector(UISelectors.pageHeader).appendChild(searchBar);
      const search = document.querySelector(UISelectors.searchInput);
      const searchButton = document.querySelector(UISelectors.searchButton);

      searchButton.addEventListener('click', e => {
        e.preventDefault();
        for (let i = 0; i < searchList.length; i++) {
          let input = document.querySelector(UISelectors.searchInput);
          if (searchList[i].textContent.toLowerCase().includes(input.value.toLowerCase())) {
            if (listItem[i].classList.contains('hide')) {
              listItem[i].classList.remove('hide');
            }
            listItem[i].classList.add('show');
            listItem[i].style.display = 'block';
            let highlightLetters = searchList[i].textContent.replace(input.value.toLowerCase(), `<span class="highlight">${input.value.toLowerCase()}</span>`);
            searchList[i].innerHTML = highlightLetters;
          } else {
            if (listItem[i].classList.contains('show')) {
              listItem[i].classList.remove('show');
            }
            listItem[i].classList.add('hide');
            listItem[i].style.display = 'none';
          }
        }
        filtered = document.querySelectorAll(".show");
        if (filtered.length === 0) {
          UICtrl.noRecords();
        } else {
          if (document.querySelector(UISelectors.noRecords)) {
            document.querySelector(UISelectors.noRecords).remove();
          }
        }
        UICtrl.showPage(filtered, currentPage, recordsPerPage);
        UICtrl.appendPageLinks(filtered, currentPage, recordsPerPage);
      });

      // Search button
      search.addEventListener('keyup', e => {
        e.preventDefault();
        // loop through all list items
        for (let i = 0; i < searchList.length; i++) {
          // if the value in the input box matches
          if (searchList[i].textContent.toLowerCase().includes(e.target.value.toLowerCase())) {
            // check if class is already applied
            if (listItem[i].classList.contains('hide')) {
              listItem[i].classList.remove('hide');
            }
            // display item
            listItem[i].classList.add('show');
            listItem[i].style.display = 'block';
            let highlightLetters = searchList[i].textContent.replace(e.target.value.toLowerCase(), `<span class="highlight">${e.target.value.toLowerCase()}</span>`);
            searchList[i].innerHTML = highlightLetters;

          } else {
            // check if class is already applied
            if (listItem[i].classList.contains('show')) {
              listItem[i].classList.remove('show');
            }
            // hide item
            listItem[i].classList.add('hide');
            listItem[i].style.display = 'none';
          }
        }
        // create new list by looping through all items with class of show
        filtered = document.querySelectorAll(".show");
        // if no records display message
        if (filtered.length === 0) {
          UICtrl.noRecords();
        } else {
          // check if message exists if so remove once filtered is greater then 0
          if (document.querySelector(UISelectors.noRecords)) {
            document.querySelector(UISelectors.noRecords).remove();
          }
        }
        // update the displayed results and pagination
        UICtrl.showPage(filtered, currentPage, recordsPerPage);
        UICtrl.appendPageLinks(filtered, currentPage, recordsPerPage);
      });
    },

    noRecords: () => {
      // the no records object to be displayed pending on the search filter logic
      if (document.querySelector(UISelectors.noRecords)) {
        document.querySelector(UISelectors.noRecords).remove();
      }
      let input = document.querySelector(UISelectors.searchInput);
      const output = `Sorry, no records match for: ${input.value.toLocaleLowerCase()}`
      let h2 = document.createElement('h2');
      h2.className = 'no-records'
      h2.innerHTML = output
      if (input.value !== '') {
        document.querySelector(UISelectors.studentList).appendChild(h2);
      }
    }
  }
})();

const App = ((UICtrl) => {
  return {
    init: () => {
      // Get UI config
      const UIConfig = UICtrl.getConfig();
      // Get UI selectors
      const UISelectors = UICtrl.getSelectors();

      // initial lists
      let list = document.querySelectorAll(UISelectors.studentItem);
      let searchList = document.querySelectorAll(UISelectors.studentName);

      // initial variables 
      let currentPage = UIConfig.currentPage;
      const recordsPerPage = UIConfig.recordsPerPage;

      // initial method calls
      UICtrl.showPage(list, currentPage, recordsPerPage);
      UICtrl.appendPageLinks(list, currentPage, recordsPerPage);
      UICtrl.search(searchList, list, currentPage, recordsPerPage);
    }
  }
})(UICtrl);

// Ititialize App
App.init();