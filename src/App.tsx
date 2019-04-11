import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import './App.css';
import { fetchPosts, changeSubreddit} from './actions';
import Post from './components/Post';
import ErrorBox from './components/ErrorBox';
import { IPost } from './components/Post';

interface Props {
  error: string;
  posts: IPost[];
  subreddit: string;
  subreddits: { [key: string]: { posts: IPost[], lastFetch: boolean } } ;
  dispatch: Dispatch<any>;
  fetchPosts: (subreddit: string) => Dispatch;
  changeSubreddit: (subreddit: string) => Dispatch;
}

interface State {
  forceFetch: boolean;
  searchValue: string;
}

class App extends Component<Props, State> {

  constructor(props){
    super(props);

    this.state = {
      searchValue: '',
      forceFetch: false
    }

    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.forceChange = this.forceChange.bind(this);

  }

  handleSearchClick(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const { dispatch, subreddits, fetchPosts, changeSubreddit } = this.props
    const { searchValue, forceFetch } = this.state; 

    if(forceFetch){
      fetchPosts(searchValue);
    }
    else{ 
      if(subreddits[searchValue]){ //It's already in "cache" so just get it from there
        changeSubreddit(searchValue);
      }
      else { //Fetch the data from the API
        fetchPosts(searchValue);
      }
    }
  }

  forceChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ forceFetch: event.target.checked});
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({searchValue: event.target.value});
  }

  render() {

    const { error, subreddit, subreddits } = this.props;

    return (
      <div className="App"> 
        <header className="App-header">


        <form onSubmit={this.handleSearchClick}>
          <input placeholder="Subreddit name" onChange={ this.handleChange }></input>
          
          <button type="submit">
            Load the Subreddit
          </button>
          <br/>
          <label>
            <input type="checkbox" name="forceLoad" onChange={ this.forceChange } />
            Force load
          </label>
        </form>


          {  error && 
             <ErrorBox errorCode={error} message="There was an error fetching your request."/>
          }

          { !error && 

            <div>
              { subreddit && 
                <h1> { subreddit } </h1>
              }

              { subreddits && subreddits[subreddit] && 
                
                <span className="fetch-time">
                  Fetch time: { subreddits[subreddit].lastFetch.toString() }
                </span>
              }
              <ul className="subreddits">
                { subreddits && subreddits[subreddit] && subreddits[subreddit].posts.map((post, i) =>
                  <li key={i}>
                    <Post data={post}/>              
                  </li>
                )}
              </ul>
            </div>
          }
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state: Props) => {
  const { error, posts, subreddit, subreddits} = state
  return {
    error,
    posts,
    subreddit,
    subreddits
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchPosts: (subreddit: string): Dispatch<Action> => dispatch(fetchPosts(subreddit)),
  changeSubreddit: (subreddit: string): Dispatch<Action> => dispatch(changeSubreddit(subreddit)),
  dispatch
});

export default connect(mapStateToProps,mapDispatchToProps)(App);