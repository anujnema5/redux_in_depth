import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import axios from 'axios';

// ACTION NAME CONSTANTS 
const ACTION_TYPE = {
    // INIT: "account/init",
    INCREMENT: "account/increment",
    DECREMENT: "account/decrement",
    INCREMENT_BY_AMOUNT: "account/incrementByAmount",
    INCREASE_BONUS : "bonus/increment",
    GET_ACC_USER_PENDING : "account/getUser/pending",
    GET_ACC_USER_FULFILLED : "account/getUser/fulfilled",
    GET_ACC_USER_REJECTED : "account/getUser/rejected",

}

// ACCOUNT REDUCER
function accountReducer(state = { amount: 0 }, action) {
    switch (action.type) {
        case ACTION_TYPE.GET_ACC_USER_PENDING : 
            return {...state, pending : true}

        case ACTION_TYPE.GET_ACC_USER_FULFILLED : 
            return {amount : action.payload, pending : false}

        case ACTION_TYPE.GET_ACC_USER_REJECTED : 
            return {...state, error : action.error, pending : false}

        case ACTION_TYPE.INCREMENT:
            return {amount: state.amount + 1}

        case ACTION_TYPE.DECREMENT:
            return {amount: state.amount - 1}

        case ACTION_TYPE.INCREMENT_BY_AMOUNT:
            return {amount: state.amount + action.payload}

        default:
            return state;
    }
}

//  BONUS REDUCER
function bonusReducer(state= {points : 0}, action) {
    switch (action.type) {
        case ACTION_TYPE.INCREMENT :
            return {points: state.points + 1}
            break;

        case ACTION_TYPE.INCREMENT_BY_AMOUNT :
            if(action.payload>=100) {
                return {points: state.points + 1}
            }

        case ACTION_TYPE.INCREASE_BONUS : 
        return {points: state.points + 1}
        
        default:
            return state;
    }
}

// STORE
const store = createStore(combineReducers({
    account : accountReducer,
    bonus : bonusReducer
}), 
   applyMiddleware(logger.default, thunk.default))

// ACTION CREATORS
function getUserAccount(id) {
    return async (dispatch, getState)=>{
        try {
            dispatch(getAccUserPending())
            const {data} = await axios.get(`http://localhost:3000/accounts/${id}`);
            dispatch(getAccUserFulfilled(data.amount));
        } catch (error) {
            dispatch(getAccUserRejected(error.message))
        }
    }
}

function getAccUserFulfilled(value) {
   return { type: ACTION_TYPE.GET_ACC_USER_FULFILLED, payload : value}
}

function getAccUserRejected(error) {
    return { type: ACTION_TYPE.GET_ACC_USER_REJECTED, error : error}
 }

 function getAccUserPending() {
    return { type: ACTION_TYPE.GET_ACC_USER_PENDING}
 } 

function incrementByAmount(value) {
    return { type: ACTION_TYPE.INCREMENT_BY_AMOUNT, payload: value }
}

function decrement() {
    return { type: ACTION_TYPE.DECREMENT }
}

function increment() {
    return { type: ACTION_TYPE.INCREMENT }
}

function incrementBonus(value) {
    return {type : ACTION_TYPE.INCREASE_BONUS}
}

// GOLBAL STATE
// setInterval(() => {
    // }, 5000)

    setTimeout(()=>{
        store.dispatch(getUserAccount(2));
        // store.dispatch(incrementBonus(200))
        // store.dispatch(incrementBonus())
    },1000)

// ASYNC API CALLING
// async function getUser () {
    
//     console.log(data);
// }

// getUser();

// store.dispatch({type : 'incremnt'});

// store.subscribe(()=>{
//     history.push(store.getState());
//     console.log(history);
// })
