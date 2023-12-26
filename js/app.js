(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
                return;
            }
            if (paramsWatch.threshold === "prx") {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Спостерігач]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    const body = document.body;
    const popupButton = document.querySelector(".header__button");
    let limit = 4;
    window.addEventListener("resize", resizer);
    document.addEventListener("click", globalClick);
    document.addEventListener("touchstart", globaltouch);
    document.addEventListener("touchend", globaltouch);
    window.addEventListener("load", docload);
    function removeBodyClass(classRemove) {
        let bodyClasses = Array.from(body.classList);
        if (bodyClasses.includes(classRemove)) body.classList.remove(classRemove);
    }
    function hideSpan(button) {
        let spanList = button.querySelectorAll("span");
        spanList[0].classList.toggle("hide--text");
        spanList[1].classList.toggle("hide--text");
    }
    function docload() {
        dataload();
        setTimeout((() => {
            body.classList.add("load");
        }), 1200);
    }
    function globalClick(e) {
        if (e.target.closest(".burger")) body.classList.toggle("burger--open");
        if (e.target.closest(".lesson__button") || e.target.closest(".lesson__title")) {
            let parentLesson = e.target.closest(".lesson");
            let spollerButton = parentLesson.querySelector(".lesson__button");
            let lessonHead = parentLesson.querySelector(".lesson__head");
            let lessonContent = parentLesson.querySelector(".lesson__content");
            let parentClasses = Array.from(parentLesson.classList);
            lessonContent.style.top = `${lessonHead.offsetHeight}px`;
            parentLesson.style.paddingBottom = `${lessonContent.offsetHeight}px`;
            if (parentClasses.includes("active--spoller")) parentLesson.style.paddingBottom = `0px`;
            hideSpan(spollerButton);
            parentLesson.classList.toggle("active--spoller");
        }
        if (e.target.closest(".menu__item")) removeBodyClass("burger--open");
        if (e.target.closest('a[href*="#"]')) {
            e.preventDefault();
            let anhor = e.target.closest('a[href*="#"]');
            let href = anhor.getAttribute("href");
            let hrefTarget = document.querySelector("" + href);
            hrefTarget.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
        if (e.target.closest("[data-popup]")) {
            body.classList.toggle("popup--open");
            hideSpan(popupButton);
            const pop = document.querySelector(".popup");
            pop.scrollTo(0, 0);
        }
        if (!e.target.closest(".popup__body") && !e.target.closest("[data-popup]")) {
            const popActive = document.querySelector(".popup--open");
            if (popActive) {
                removeBodyClass("popup--open");
                hideSpan(popupButton);
            }
        }
        if (e.target.closest(".popup__button")) e.preventDefault();
    }
    function resizer() {
        const activeSpollerList = document.querySelectorAll(".active--spoller");
        if (activeSpollerList.length > 0) activeSpollerList.forEach((item => {
            let spollerHead = item.querySelector(".lesson__head");
            let spollerContent = item.querySelector(".lesson__content");
            spollerContent.style.top = `${spollerHead.offsetHeight}px`;
            item.style.paddingBottom = `${spollerContent.offsetHeight}px`;
        }));
    }
    function globaltouch(e) {
        if (e.type == "touchstart") {
            if (e.target.closest("a")) e.target.closest("a").classList.add("clicked");
            if (e.target.closest("button")) e.target.closest("button").classList.add("clicked");
            if (e.target.closest("label")) e.target.closest("label").classList.add("clicked");
        }
        if (e.type == "touchend") {
            if (e.target.closest("a")) e.target.closest("a").classList.remove("clicked");
            if (e.target.closest("button")) e.target.closest("button").classList.remove("clicked");
            if (e.target.closest("label")) e.target.closest("label").classList.remove("clicked");
        }
    }
    async function dataload() {
        const dataPath = "files/data.json";
        const response = await fetch(dataPath, {
            metod: "GET"
        });
        if (response.ok) {
            const generalData = await response.json();
            let data = generalData.lessons;
            setLesson(data);
            const watchMore = document.querySelector(".shedule__watch-more");
            watchMore.addEventListener("click", changeLimit);
            function changeLimit(e) {
                hideSpan(watchMore);
                if (limit < 100) {
                    limit = 100;
                    setLesson(data);
                } else {
                    limit = 4;
                    setLesson(data);
                    let lessonBox = document.querySelector(".shedule");
                    lessonBox.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        }
    }
    function setLesson(data) {
        const wrapper = document.querySelector(".shedule__body");
        if (wrapper) {
            let template = ``;
            wrapper.innerHTML = ``;
            data.forEach(((elem, index) => {
                if (index < limit) if (elem.show) {
                    let templateList = ``;
                    let templateListItem = ``;
                    elem.list.forEach((listitem => {
                        templateListItem = `<li class="lesson__item">${listitem}</li>`;
                        templateList += templateListItem;
                    }));
                    if (elem.text) {
                        template = `\n                        <div class="shedule__item lesson">\n                        <section class="lesson__head">\n                            <div class="lesson__number">${elem.number}</div>\n                            <h3 class="lesson__title"><button type="button">${elem.title}</button></h3>\n                            <button type="button" class="lesson__button"><span>відкрити</span><span\n                                    class="hide--text">закрити</span><span class="icon--right"></span></button>\n                        </section>\n                        <div class="lesson__content">\n                            <ul class="lesson__list">\n                                ${templateList}\n                            </ul>\n                            <p class="lesson__text">${elem.text}</p>\n                        </div>\n        \n                    </div>`;
                        wrapper.insertAdjacentHTML("beforeend", template);
                    } else {
                        template = `\n                        <div class="shedule__item lesson">\n                        <section class="lesson__head">\n                            <div class="lesson__number">${elem.number}</div>\n                            <h3 class="lesson__title"><button type="button">${elem.title}</button></h3>\n                            <button type="button" class="lesson__button"><span>відкрити</span><span\n                                    class="hide--text">закрити</span><span class="icon--right"></span></button>\n                        </section>\n                        <div class="lesson__content">\n                            <ul class="lesson__list">\n                                ${templateList}\n                            </ul>\n                        </div>\n        \n                    </div>`;
                        wrapper.insertAdjacentHTML("beforeend", template);
                    }
                } else {
                    template = `\n                    <div class="shedule__item lesson">\n                    <section class="lesson__head">\n                        <div class="lesson__number">${elem.number}</div>\n                        <h3 class="lesson__title">${elem.title}</h3>\n                    </section>\n                </div>`;
                    wrapper.insertAdjacentHTML("beforeend", template);
                }
            }));
        }
    }
    window["FLS"] = true;
    isWebp();
})();