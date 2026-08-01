interface AJAXOptionsInterface {
    url: string;
    RequestMethod: 'GET' | 'POST' | 'PUT' | 'UPDATE' | 'DELETE';
    RequestType: 'json' | 'xml';
    RequestHeader?: { [key: string] : string };
    RequestBody?: any;
}

export default AJAXOptionsInterface;