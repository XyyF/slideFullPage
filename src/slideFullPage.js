import {on} from './event'

function SlideFullPage(params) {
    this.container = document.querySelector('#container')
    this.sections = this.container.querySelectorAll('.section')
    this.count = this.sections.length // 总页数
    this.page = 0 // 当前页数
    this.direction = 'next' // 滑动方向

    // 事件处理函数
    var eventHandler = {
        wheelFunc: (function (e) {
            var e = e || window.event
            if (e.wheelDeltaY < 0 || e.wheelDelta < 0 || e.detail) {
                this.slideNext()
            } else {
                this.slidePre()
            }
        }).bind(this),
    }

    // 通用方法

    // 初始化事件
    var init = function initEvent() {
        on(document, 'DOMMouseScroll', eventHandler.wheelFunc.bind(this))
        on(document, 'mousewheel', eventHandler.wheelFunc.bind(this))
    }
    init()
}

SlideFullPage.prototype.slideScroll = function slideScroll(index) {
    var itemHeight = this.sections[index].offsetHeight
    var windowH = window.innerHeight
    if ((itemHeight - windowH) > 20) {
        if (this.direction === 'next') {
            this.sections[index].scrollTop = 0
        } else {
            this.sections[index].scrollTop = itemHeight - windowH
        }
    }
}

SlideFullPage.prototype.slideNext = function slideNext() {
    if (this.count <= (this.page + 1)) {
        return false
    }
    this.direction = 'next';
    this.slideScroll(this.page)
    this.sections[this.page].style.transform = 'translate3d(0, -100%, 0)'
    this.sections[this.page + 1].style.transform = 'translate3d(0, 0, 0)'
    this.page++
}

SlideFullPage.prototype.slidePre = function slidePre() {
    if (this.page <= 0) {
        return false
    }
    this.direction = 'prev'
    this.slideScroll(this.page)
    this.sections[this.page].style.transform = 'translate3d(0, 100%, 0)';
    this.sections[this.page - 1].style.transform = 'translate3d(0, 0, 0)';
    this.page--
}

new SlideFullPage()