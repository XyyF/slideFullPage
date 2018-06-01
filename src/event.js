export default {
    on,
    off,
    isDom
}

export function on(el, eventName, handle) {
    if (!el || !eventName || !handle) {
        return null
    }
    if (document.addEventListener) {
        el.addEventListener(eventName, handle, false)
    } else {
        el.attachEvent(`on${eventName}`, handle)
    }
}

export function off(el, eventName, handle) {
    if (!el || !eventName || !handle) {
        return null
    }
    if (document.removeEventListener) {
        el.removeEventListener(eventName, handle)
    } else {
        el.detachEvent(`on${eventName}`, handle)
    }
}

export function isDom(node) {
    // querySelector为NodeLit，getElementsByClassName为HTMLCollection
    if ((node instanceof NodeList || node instanceof HTMLCollection) && node.length > 0) {
        let trueNum = 0
        const len = node.length
        for (let i = 0; i < len; i++) {
            (node[i] instanceof Element) && (trueNum++)
        }
        return trueNum === len
    } else {
        return (node instanceof Element)
    }
}