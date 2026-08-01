
interface customErrorMessagesInterface {
    text?: string;
    checkbox?: string;
    color?: string;
    datetime?: string;
    date?: string;
    'datetime-local'?: string;
    email: {
        empty ?: string;
        invalid ?: string;    
    },
    file?: string;
    hidden?: string;
    image?: string;
    month?: string;
    number?: string;
    password?: string;
    radio?: string;
    range?: string;
    reset?: string;
    search?: string;
    submit?: string;
    tel?: string;
    textarea?: string;
    time?: string;
    url?: {
        empty?: string;
        invalid?: string;
    };
    week?: string;
    zipcode?: {
        empty?: string;
        invalid?: string;
    };
};

export default customErrorMessagesInterface;