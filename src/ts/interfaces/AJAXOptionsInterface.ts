// src/ts/interfaces/AJAXOptionsInterface.ts

/**
 Request configuration accepted by {@link NFSFU234FormValidation.ajax} and
 its instance counterpart.
*/
interface AJAXOptionsInterface {
    /** The request URL. */
    url: string;

    /** The HTTP method. Defaults to "GET" if omitted. */
    RequestMethod?: "GET" | "POST" | "PUT" | "PATCH" | "UPDATE" | "DELETE";

    /** Request headers, keyed by header name. */
    RequestHeader?: { [key: string]: string };

    /** The request body - a plain object, FormData, or JSON-serializable value. */
    RequestBody?: object | FormData | JSON;

    /**
     When true, skips the "empty body on a POST/PUT/DELETE/UPDATE request"
     guard - use for requests that intentionally send no body.
    */
    RequestBodyIgnore?: boolean;
}

export default AJAXOptionsInterface;