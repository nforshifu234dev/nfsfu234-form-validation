import { ExceptionHandler, LogLevelInterface } from "../errorHandling/ExceptionHandler";
import ErrorMessageInterface from "../interfaces/ErrorMessagesInterface";
import { checkVariableType } from "../utilities";
import getPageUrl from "../utilities/getPageUrl";

const makeAjaxRequest = async (url:string, options:any)   => {
    let individualResponseMessage: ErrorMessageInterface = {};
    try {
        console.log("AJAX Loading....");


        let response = await fetch(url, options);

        // console.log(response);
        

        if (response.ok) {
            console.log("AJAX Finished....");
            return await response.json();
            // try {
            //     const responseData = await response.json();
            //     console.log(responseData);
        
            //     if (checkVariableType(responseData) === 'object') {
            //         individualResponseMessage.code = response.status;
            //         individualResponseMessage.message = responseData.message || response.statusText;
            //         individualResponseMessage.data = responseData;
            //     } else {
            //         individualResponseMessage.code = 400;
            //         individualResponseMessage.message = "Response is not a valid JSON object.";
            //         throw individualResponseMessage;
            //     }
        
            //     return individualResponseMessage;
            // } catch (error) {
            //     // console.error(error);
        
            //     individualResponseMessage.code = 400;
            //     individualResponseMessage.message = "Response is not a valid JSON object.";
            //     individualResponseMessage.data = null;
        
            //     throw individualResponseMessage;
            // }
        } else {

            if ( response.status === 404 )
            {
                individualResponseMessage.code = response.status ?? 404;
                individualResponseMessage.message = "Resource Not Found";
                individualResponseMessage.data = {
                    headers: response.headers,
                    url: response.url,
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.ok
                };
                throw individualResponseMessage;

            }

            // if (response.ok) {
                // console.log("AJAX Finished....");
                // return await response.json();
            // } else {
                try {
                    const responseData = await response.json();
                    // console.log(responseData);
            
                    if (checkVariableType(responseData) === 'object') {
                        individualResponseMessage.code = response.status;
                        individualResponseMessage.message = responseData.message || response.statusText;
                        individualResponseMessage.data = responseData;
                    } else {

                        // if ( response.status === 404 )
                        // {
                        //     individualResponseMessage.code = response.status;
                        //     individualResponseMessage.message = response.statusText;
                        //     individualResponseMessage.data = {
                        //         headers: response.headers,
                        //         url: response.url,
                        //         status: response.status,
                        //         statusText: response.statusText,
                        //         ok: response.ok
                        //     };
                        //     throw individualResponseMessage;
                
                        // }

                        individualResponseMessage.code = 400;
                        individualResponseMessage.message = "Response is not a valid JSON object 2.";
                        throw individualResponseMessage;
                    }
            
                    return individualResponseMessage;
                } catch (error: any) {
                    // console.error(error);

                    // if ( error.status === 404 )
                    // {
                    //     individualResponseMessage.code = error.status;
                    //     individualResponseMessage.message = error.statusText;
                    //     individualResponseMessage.data = {
                    //         headers: error.headers,
                    //         url: error.url,
                    //         status: error.status,
                    //         statusText: error.statusText,
                    //         ok: error.ok
                    //     };
                    //     throw individualResponseMessage;
            
                    // }
            
                    individualResponseMessage.code = 400;
                    individualResponseMessage.message = "Response is not a valid JSON object. 1";
                    individualResponseMessage.data = null;
            
                    throw individualResponseMessage;
                }
            // }
            

            // try {
                
            //     response = await response.json();

            //     console.log(response);
                
    
            //     // throw new Error("AJAX Failed");
            //     // ExceptionHandler("AJAX FAILED", "error_1")
    
            //     individualResponseMessage.code = response.status
            //     individualResponseMessage.message = response.message || response.statusText
            //     individualResponseMessage.data = null
    
            //     // console.log(individualResponseMessage);
                
            //     // ExceptionHandler(individualResponseMessage)
    
            //     // return individualResponseMessage
            //     throw individualResponseMessage;
    

            // } catch (error) {
                
            //     individualResponseMessage.code = 400
            //     individualResponseMessage.message = "Response is not a valid JSON object."
            //     individualResponseMessage.data = null

            //     throw individualResponseMessage;
    

            // }

           
        }

    } catch (error: any) {


        // if ( error.status === 404 )
        // {
        //     individualResponseMessage.code = error.status;
        //     individualResponseMessage.message = error.statusText;
        //     individualResponseMessage.data = {
        //         headers: error.headers,
        //         url: error.url,
        //         status: error.status,
        //         statusText: error.statusText,
        //         ok: error.ok
        //     };
        //     throw individualResponseMessage;

        // }

        // console.error("AJAX Error From Main Function:", error.message);
        individualResponseMessage.code = error.code || 400;
        individualResponseMessage.message = error.message || error.statusText || "An error occurred";
        individualResponseMessage.data = error.data || null;

        // console.log(individualResponseMessage);
        

        throw individualResponseMessage;
    }
};

const prepareAjaxOptions = (AJAXOptions: any) => {
    let individualResponseMessage: ErrorMessageInterface = {};
    const method = AJAXOptions.RequestMethod || 'GET';
    const headers = AJAXOptions.RequestHeader || {};
    const ignoreBodyMessage = AJAXOptions.RequestBodyIgnore || false;
    const type = AJAXOptions.RequestType || 'json';

    let body;
    if (['POST', 'PUT', 'DELETE', 'UPDATE'].includes(method)) {
        body = AJAXOptions.RequestBody || '';

        if ( body === '' && ignoreBodyMessage !== true )
        {
            individualResponseMessage.code = 400
            individualResponseMessage.message = `The body of this "${method}" request you made is empty. If this was intentionional, then add the RequestBodyIgnore attribute and set it to true.`;
            throw individualResponseMessage;
        }


    }


    return {
        method,
        headers,
        body: JSON.stringify(body)
    };
};

const ajax = async (AJAXOptions: any) => {
    let individualResponseMessage: ErrorMessageInterface = {};
    try {
        const url = AJAXOptions && AJAXOptions.url ? AJAXOptions.url : getPageUrl();
        const options = prepareAjaxOptions(AJAXOptions);
        const responseData = await makeAjaxRequest(url, options);

        return responseData;
    } catch (error:any) {

        

        // console.error("AJAX Error From Main Function:", error);
        individualResponseMessage.code = error.code || 400;
        individualResponseMessage.message = error.message ||  "An error occurred";
        individualResponseMessage.data = error.data ?? null;

        // console.log(individualResponseMessage);

        // console.error("AJAX ERROR: ", error);
        console.error("AJAX Failed: ", error.message);

        ExceptionHandler(error.message, LogLevelInterface.THROW)

        // return individualResponseMessage;
        throw error;
    }
};

export default ajax;
