import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import './App.css';
import { performSearch, changeSubreddit} from './actions';
import Post from './components/Post';
import ErrorBox from './components/ErrorBox';
import { IPost } from './components/Post';

interface Props {
  error: string;
  posts: IPost[];
  lastFetch: number;
  fetchingReddit: boolean;
  subreddit: string;
  subreddits: { [key: string]: { posts: IPost[], lastFetch: boolean } } ;
  dispatch: Dispatch<any>;
  performSearch: (subreddit: string, force: boolean) => Dispatch;
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
    const { subreddits, performSearch, changeSubreddit, fetchingReddit} = this.props
    const { searchValue, forceFetch } = this.state; 

    performSearch(searchValue, forceFetch);
  }

  forceChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ forceFetch: event.target.checked});
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({searchValue: event.target.value});
  }

  render() {

    const { error, subreddit, subreddits, fetchingReddit, posts, lastFetch} = this.props;

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

          { fetchingReddit && "Loading..."

          }

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
                  Fetch time: { lastFetch.toString() }
                </span>
              }
              <ul className="subreddits">
                { posts && posts.map((post, i) =>
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
  const { error, subreddit, subreddits, fetchingReddit} = state


  const { posts, lastFetch } = subreddits[subreddit] || { posts:[], lastFetch: 0}


  return {
    error,
    posts,
    subreddit,
    subreddits,
    lastFetch,
    fetchingReddit
  }
}

const mapDispatchToProps = (dispatch) => ({
  performSearch: (subreddit: string, force: boolean): Dispatch<Action> => dispatch(performSearch(subreddit, force)),
  changeSubreddit: (subreddit: string): Dispatch<Action> => dispatch(changeSubreddit(subreddit)),
  dispatch
});

export default connect(mapStateToProps,mapDispatchToProps)(App);