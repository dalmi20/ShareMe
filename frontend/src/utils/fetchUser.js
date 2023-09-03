import jwt_decode from 'jwt-decode'
export const fetchUser=()=>{
    const userInfo= localStorage.getItem('user') !== 'undefined' ?jwt_decode(JSON.parse(localStorage.getItem('user'))) :localStorage.clear()
    return userInfo;
    /* 3lah dernaha hnaya pasque wlat fonction mliha util nsha9oha sh3al mn 5tra aya besh mndlosh nhawsso win rah line li nsha9oh ndir fi function ou n3aytolo  */
}