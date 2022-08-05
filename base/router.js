class Router {
  #pages;
  #currentPage;
  #defaultPage;

  constructor() {
    window.addEventListener("popstate", (event) => {
      console.log(event);
      console.log(history);
      if (event.state) {
        this.#currentPage = event.state;
      } else {
        this.#currentPage = this.#defaultPage;
      }
      this.renderCorrectPage();
    });
  }

  setRoutes(pages) {
    if (this.#pages) {
      throw "Routes set twice!";
    }

    this.#pages = pages;
    this.#defaultPage = pages.Home;
    this.#currentPage = this.getCurrentPageFromUrl();
    
    history.replaceState(
      this.#currentPage,
      this.#currentPage.title,
      window.location.origin + this.#currentPage.path
    );

    this.renderCorrectPage();
  }

  renderCorrectPage() {
    const elementId = "CurrentPage";
    const prevPage = document.getElementById(elementId);
    prevPage?.remove();
    
    // while (document.body.firstChild) {
    //   document.body.firstChild.remove();
    // }

    const newPage = document.createElement(this.#currentPage.component);
    newPage.id = elementId;
    newPage.addEventListener("ChangePage", (event) =>
      this.gotoNewPage(event.detail)
    );
    document.body.appendChild(newPage);

    const title = this.#currentPage.title;
    document.title = title;
  }


  gotoNewPage(newPage) {
    this.#currentPage = newPage;
    this.addCurrentPageToHistory();
    this.renderCorrectPage();
  }

  addCurrentPageToHistory() {
    history.pushState(
      this.#currentPage,
      this.#currentPage.title,
      window.location.origin + this.#currentPage.path
    );
    console.log(history);
  }

  getCurrentPageFromUrl() {
    for (const current in this.#pages) {
      if (this.#pages[current].path === window.location.pathname) {
        return this.#pages[current];
      }
    }

    return this.#defaultPage;
  }
}


export default new Router();
