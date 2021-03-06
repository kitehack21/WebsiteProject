const INITIAL_STATE = 
    {username: "", email: "", error:"", id: "", subscription: "inactive", cookieCheck: false}
;

//INITIAL_STATE => default parameter
export default (state = INITIAL_STATE, action) =>{
    switch(action.type){
        case "USER_LOGIN_SUCCESS" :
            return {...action.payload, cookieCheck: true};
        case "USER_LOGIN_FAIL":
            return {...state, error: "Authentication Error"}
        case "USER_REGISTER_FAIL":
            return {...state, error: "Username/E-mail is already used"}
        case "COOKIES_CHECKED":
            return {...state, cookieCheck: true}
        case "USER_LOGOUT" :
            return INITIAL_STATE;
        case "SUBSCRIBED":
            return {...state, subscription: "active"}
        case "UNSUBSCRIBED" :
            return {...state, subscription: "inactive"}
        default :   
            return state;
    }
}