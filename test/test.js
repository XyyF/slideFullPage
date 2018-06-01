import {on, isDom} from '../src/event'
import _ from 'lodash'

/**
 * 方法
 * @param methods.wheelFunc 滚动事件
 * @param methods.goAnimation 触发滚动时的隐藏
 * @param methods.initEvent 初始化事件
 * @param methods.slideTo 滚动行为
 */
const methods = {
    wheelFunc: function wheelFunc(e) {
        e = e || window.event;
        if (e.wheelDeltaY < 0 || e.wheelDelta < 0 || e.detail) {
            this.slideNext()
        } else {
            this.slidePre()
        }
    },
    goAnimation: function goAnimation(index) {
        this.sections[index].style.display = 'none';
        const that = this;
        const timer = window.setTimeout(() => {
            that.sections[index].style.display = '';
            clearTimeout(timer)
        }, 700)
    },
    initEvent: function initEvent() {
        on(document, 'DOMMouseScroll', _.throttle(methods.wheelFunc.bind(this), 700));
        on(document, 'mousewheel', _.throttle(methods.wheelFunc.bind(this), 700));
    },
    slideTo: function slideTo(page) {
        if (page < 0 || page >= this.count || this.page === page) {
            return false
        }
        if (page < this.page) {
            this.sections[this.page].style.transform = 'translate3d(0, 100%, 0)';
            for (let i = this.page - 1; i > page; i--) {
                methods.goAnimation.call(this, i);
                this.sections[i].style.transform = 'translate3d(0, 100%, 0)';
            }
        } else {
            this.sections[this.page].style.transform = 'translate3d(0, -100%, 0)';
            for (let i = this.page + 1; i < page; i++) {
                methods.goAnimation.call(this, i);
                this.sections[i].style.transform = 'translate3d(0, -100%, 0)';
            }
        }
        this.sections[page].style.transform = 'translate3d(0, 0, 0)';
    }
};

// todo 考虑左右方向控制
/**
 * 全屏滚动插件
 * @param {Object} params
 * @param params.container 父元素,DOM
 * @param params.sections 子元素列表,DOM
 * @param {number} params.initPage 初始在哪一页
 * @constructor
 */
function SlideFullPage(params = {}) {
    // 初始化this
    Object.assign(this, {
        container: isDom(params.container) ? params.container : document.querySelector('#container'),
        sections: isDom(params.sections) ? params.sections : document.querySelectorAll('.section'),
    });
    this.count = this.sections.length; // 总页数

    // 闭包变量
    let prePage = 0;

    // 代表当前页码，以0开始--滚动开始的入口
    Object.defineProperty(this, 'page', {
        set(val) {
            if (val >= 0 && val < this.count) {
                methods.slideTo.call(this, val)
                prePage = val
            }
        },
        get() {
            return prePage
        }
    });
    this.page = params.initPage || 0;

    methods.initEvent.call(this)
}

/**
 * 向下滚动1页
 */
SlideFullPage.prototype.slideNext = function slideNext() {
    if (this.page >= this.count - 1) {
        return false
    }
    this.page++
};

/**
 * 向上滚动1页
 */
SlideFullPage.prototype.slidePre = function slidePre() {
    if (this.page <= 0) {
        return false
    }
    this.page--
};

/**
 * 滚动到指定页码
 * @param {number} index 页码下标，从0开始
 */
SlideFullPage.prototype.setPage = function setPage(index) {
    if (index < 0 || index > this.count) {
        return false
    }
    this.page = index
};

window.SlideFullPage = SlideFullPage;