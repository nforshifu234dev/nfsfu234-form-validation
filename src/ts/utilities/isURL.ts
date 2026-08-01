const isURL = (url:string) => {

    // Regular expression to check for 'http://' or 'https://' at the beginning
    // and support formats like https://www.domain.com/ or https://domain.com/ or https://www.domain.com/?param1=1&param2=2
    const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(:\d{1,5})?(\/[^\s]*)?(\?.*)?$/;

    // If the input is a string, test it against the regular expression.
    return typeof url === 'string' ? urlPattern.test(url) : false;

};

export default isURL;