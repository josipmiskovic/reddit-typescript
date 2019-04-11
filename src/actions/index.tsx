import { Action, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import IPost from '../components/Post';

import { RECEIVE_POSTS, SEND_ERROR, START_FETCHING, CHANGE_SUBREDDIT, FINISH_FETCHING } from '../types';


export interface ReceivedPostsAction {
    type: string;
    subreddit: string;
    fetchingReddit: boolean;
    posts: IPost[];
    receivedAt: Date;
}

export interface SendErorAction {
    type: string;
    error: string;
}

export const performSearch = (subreddit: string, force: boolean) => (dispatch, getState) => {
    if(getState().fetchingReddit){
        return;
    }
    if(getState().subreddits[subreddit]){
        return force ? dispatch(fetchPosts(subreddit)) : dispatch(changeSubreddit(subreddit));
    } 
    else {
        dispatch(fetchPosts(subreddit));
    }
}


export const fetchPosts = (subreddit: string): ThunkAction<Promise<ReceivedPostsAction | SendErorAction>, void, void, Action<any>> => async dispatch => {
    dispatch(startFetching());
    try {
        const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
        dispatch(finishFetching());
        if(response.ok) {
            const json = await response.json();
            return dispatch(receivePosts(subreddit, json));
        }
        else {
            return dispatch(sendError(response.status.toString()));
        }
        
    } catch (err) {
        dispatch(finishFetching());
        return dispatch(sendError(err.message));
    }
}


export const changeSubreddit = (subreddit: string) => ({
    type: CHANGE_SUBREDDIT,
    subreddit
})

export const startFetching = () => ({
    type: START_FETCHING,
    fetchingReddit: true,
    error: ""
})

export const finishFetching = () => ({
    type: FINISH_FETCHING,
    fetchingReddit: false,
    error: ""
})

export const receivePosts = (subreddit: string, json) => ({
    type: RECEIVE_POSTS,
    subreddit,
    fetchingReddit: false,
    posts: json.data.children.map(child => child.data),
    receivedAt: new Date()
})

export const sendError = (error: string) => ({
    type: SEND_ERROR,
    error,
})