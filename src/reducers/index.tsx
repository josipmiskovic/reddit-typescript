import { RECEIVE_POSTS, SEND_ERROR, START_FETCHING, CHANGE_SUBREDDIT } from '../types';

import { ReceivedPostsAction, SendErorAction} from '../actions';


const initialState = {
    subreddits: {},
    fetchingReddit: false,
};

const mainReducer = (state = initialState, action: ReceivedPostsAction & SendErorAction) => {
    switch (action.type) {
        case RECEIVE_POSTS:
            return {
                ...state,
                subreddit: action.subreddit,
                subreddits: {
                    ...state.subreddits, 
                    [action.subreddit]: { 
                        posts: action.posts, 
                        lastFetch: action.receivedAt
                    }
                }
            }
        case SEND_ERROR:
            return {
                ...state,
                posts: [],
                subreddit: '',
                error: action.error
            }
        case START_FETCHING:
            return {
                ...state,
                error: action.error,
                fetchingReddit: action.fetchingReddit

            }
        case CHANGE_SUBREDDIT:
            return {
                ...state,
                error: '',
                subreddit: action.subreddit
            }
        default:
            return state
    }
};

export default mainReducer;


