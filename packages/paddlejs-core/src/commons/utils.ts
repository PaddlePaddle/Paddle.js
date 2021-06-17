/**
 * @file utils
 */

/**
 * getGlobalInterface
 *
 * @returns ns
 */
export function getGlobalInterface(): any {
    let ns: any;
    if (typeof (window) !== 'undefined') {
        ns = window;
    }
    else if (typeof (global) !== 'undefined') {
        ns = global;
    }
    else if (typeof (self) !== 'undefined') {
        ns = self;
    }
    else {
        throw new Error('Could not find a global object');
    }
    return ns;
}


/**
 * getOrMakeGlobalProperty
 * @param {string} key property key
 * @param { any } value property value
 * @returns { any } global property
 */
export function getOrMakeGlobalProperty(key: string, value?: Object | String | Number | Boolean)
    : any {
    const globalInterface = getGlobalInterface();
    if (globalInterface[key]) {
        return globalInterface[key];
    }
    globalInterface[key] = value;
    return globalInterface[key];
}