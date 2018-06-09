'use strict'
import {on, off, isDom} from '../src/event'
import _ from 'lodash'

// 闭包变量
let prePage = null;

const touchPoint = {
    stPoint: 0,
    edPoint: 0
};

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
    touchStart: function (e) {
        touchPoint.stPpoint = e.targetTouches[0].clientY;
    },
    touchMove: function (e) {
        touchPoint.edPoint = e.targetTouches[0].clientY;
    },
    touchEnd: function () {
        if (touchPoint.edPoint === 0) {
            return false;
        }
        if ((touchPoint.edPoint - touchPoint.stPpoint) < -60) {
            this.page++
        } else if ((touchPoint.edPoint - touchPoint.stPpoint) > 60) {
            this.page--
        }
        touchPoint.stPpoint = 0;
        touchPoint.edPoint = 0;
    },
    transitionEnd: function() {
        this.isScrolling = false
    },
    goAnimation: function goAnimation(index) {
        this.sections[index].style.display = 'none';
        const that = this;
        const timer = window.setTimeout(() => {
            that.sections[index].style.display = '';
            clearTimeout(timer)
        }, 200)
    },
    initEvent: function initEvent() {
        this.sections[this.page - 1].style.transform = 'translate3d(0, 0, 0)';
        // pc滚轮事件
        const wheelFunc = methods.wheelFunc.bind(this);
        if (this.options.isPc) {
            on(this.container, 'DOMMouseScroll', wheelFunc);
            on(this.container, 'mousewheel', wheelFunc);
        }

        // 移动端滑动事件
        const touchStart = methods.touchStart.bind(this);
        const touchMove = methods.touchMove.bind(this);
        const touchEnd = methods.touchEnd.bind(this);
        const transitionEnd = methods.transitionEnd.bind(this);
        if (this.options.isMobile) {
            on(this.container, 'touchstart', touchStart);
            on(this.container, 'touchmove', touchMove);
            on(this.container, 'touchend', touchEnd);
        }

        on(this.container, 'transitionend', transitionEnd)
        /**
         * 取消滚动事件的监听
         * 因为bind缘故，放在这里定义
         */
        SlideFullPage.prototype.destroy = function destroy() {
            // 滚轮事件
            if (this.options.isPc) {
                off(this.container, 'DOMMouseScroll', wheelFunc);
                off(this.container, 'mousewheel', wheelFunc);
            }

            // 滑动事件
            if (this.options.isMobile) {
                off(this.container, 'touchstart', touchStart);
                off(this.container, 'touchmove', touchMove);
                off(this.container, 'touchend', touchEnd);
            }
        };
    },
    slideTo: function slideTo(page) {
        this.isScrolling = true
        if (page < this.page) {
            this.sections[this.page - 1].style.transform = 'translate3d(0, 100%, 0)';
            for (let i = this.page - 1; i > page; i--) {
                methods.goAnimation.call(this, i - 1);
                this.sections[i - 1].style.transform = 'translate3d(0, 100%, 0)';
            }
            this.sections[page - 1].style.transform = 'translate3d(0, 0, 0)';
        } else if (page > this.page) {
            this.sections[this.page - 1].style.transform = 'translate3d(0, -100%, 0)';
            for (let i = this.page + 1; i < page; i++) {
                methods.goAnimation.call(this, i - 1);
                this.sections[i - 1].style.transform = 'translate3d(0, -100%, 0)';
            }
            this.sections[page - 1].style.transform = 'translate3d(0, 0, 0)';
        }
        return true
    }
};

// todo 考虑左右方向控制
/**
 * 全屏滚动插件
 * @param {Object} options
 * @param options.container 父元素,Element、NodeList、HTMLCollection
 * @param options.sections 子元素列表,Element、NodeList、HTMLCollection
 * @param {number} options.initPage 初始在哪一页
 * @constructor
 */
function SlideFullPage(options = {}) {
    const default_options = {
        containerEl: '#container',
        sectionEl: '.section',
        initPage: 1,
        isPc: true,
        isMobile: true,
        direction: 'vertical',
    };
    this.options = Object.assign({}, default_options, options);
    // 初始化this
    this.container = isDom(this.options.containerEl) ? this.options.containerEl : document.querySelector(this.options.containerEl);
    this.sections = isDom(this.options.sectionEl) ? this.options.sectionEl : this.container.querySelectorAll(this.options.sectionEl);
    this.count = this.sections.length; // 总页数
    this.isScrolling = false;

    // 代表当前页码，以0开始--滚动开始的入口
    Object.defineProperty(this, 'page', {
        set(val) {
            if (this.isScrolling) {
                return
            }
            if (val === prePage) { // 相同页码
                return
            }
            if (val < 1) { // 小于最小页码
                this.page = 1;
                return
            }
            if (val > this.count) { // 大于最大页码
                this.page = this.count;
                return
            }
            // 调用滚动事件，slideTo唯一入口
            if (methods.slideTo.call(this, val)) {
                prePage = val
            }
        },
        get() {
            return prePage
        }
    });
    // 代表滚动的状态
    Object.defineProperty(this, 'scrollStatus', {
        get() {
            const that = this;
            return function (page) {
                const section = that.sections[page - 1] || {};
                const childrens = section.children || [];
                const children = childrens[0] || {};
                const itemheight = children.offsetHeight;
                const windowH = window.innerHeight;
                const canScroll = (itemheight <= windowH) && (itemheight - windowH) < 20;
                return {
                    canPre: canScroll || section.scrollTop === 0,
                    canNext: canScroll || (itemheight - section.scrollTop) <= windowH
                }
            };

        }
    });
    // 初始化页码
    prePage = this.options.initPage;
    // this.page = this.options.initPage;
    // 初始化事件
    methods.initEvent.call(this)
}

/**
 * 向下滚动1页
 */
SlideFullPage.prototype.slideNext = function slideNext() {
    return (this.page <= this.count) && this.scrollStatus(this.page).canNext && this.page++
};

/**
 * 向上滚动1页
 */
SlideFullPage.prototype.slidePre = function slidePre() {
    return this.page >= 1 && this.scrollStatus(this.page).canPre && this.page--
};

/**
 * 滚动到指定页码
 * @param {number} index 页码下标，从0开始
 */
SlideFullPage.prototype.setPage = function setPage(index) {
    return this.page = index
};

export default SlideFullPage;