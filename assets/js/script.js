'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar contacts: open on the About page, collapsed elsewhere, toggle button always works
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
const sidebarBtnText = document.querySelector("[data-sidebar-btn-text]");

const setSidebarOpen = function (open) {
  if (!sidebar) return;
  sidebar.classList.toggle("active", open);
  if (sidebarBtn) sidebarBtn.setAttribute("aria-expanded", open);
  if (sidebarBtnText) sidebarBtnText.innerText = open ? "Hide Contacts" : "Show Contacts";
}

if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    setSidebarOpen(!sidebar.classList.contains("active"));
  });
}



// tools filter
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    const match = selectedValue === "all" || selectedValue === filterItems[i].dataset.category;
    filterItems[i].classList.toggle("active", match);
  }
}

const setActiveFilterBtn = function (value) {
  for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].classList.toggle("active", filterBtn[i].innerText.toLowerCase() === value);
  }
}

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });

  // close the dropdown when clicking elsewhere
  document.addEventListener("click", function (event) {
    if (!select.contains(event.target)) select.classList.remove("active");
  });
}

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    select.classList.remove("active");
    setActiveFilterBtn(selectedValue);
    filterFunc(selectedValue);
  });
}

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    setActiveFilterBtn(selectedValue);
    filterFunc(selectedValue);
  });
}



// page navigation
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

const showPage = function (name) {
  let found = false;
  for (let i = 0; i < pages.length; i++) {
    const isActive = pages[i].dataset.page === name;
    pages[i].classList.toggle("active", isActive);
    if (isActive) found = true;
  }
  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].classList.toggle("active", navigationLinks[i].innerText.trim().toLowerCase() === name);
  }
  if (found) setSidebarOpen(name === "about");
  return found;
}

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const name = this.innerText.trim().toLowerCase();
    if (showPage(name)) {
      history.replaceState(null, "", "#" + name);
      window.scrollTo(0, 0);
    }
  });
}

// open the tab named in the URL hash, e.g. kipergil.github.io/#tools
if (location.hash) showPage(location.hash.slice(1).toLowerCase());



// copy tool links to the clipboard
const copyText = function (text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise(function (resolve, reject) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    ok ? resolve() : reject(new Error("copy failed"));
  });
}

const copyButtons = document.querySelectorAll("[data-copy-url]");

for (let i = 0; i < copyButtons.length; i++) {
  copyButtons[i].addEventListener("click", function () {
    const btn = this;
    const icon = btn.querySelector("ion-icon");
    copyText(btn.dataset.copyUrl).then(function () {
      btn.classList.add("copied");
      if (icon) icon.setAttribute("name", "checkmark-outline");
      clearTimeout(btn.copyTimer);
      btn.copyTimer = setTimeout(function () {
        btn.classList.remove("copied");
        if (icon) icon.setAttribute("name", "copy-outline");
      }, 1600);
    }).catch(function () {
      window.prompt("Copy this link:", btn.dataset.copyUrl);
    });
  });
}
