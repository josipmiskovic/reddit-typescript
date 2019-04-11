
import React, { Component } from 'react';

export interface IPost {
    title: string;
    url: string;
}
export interface PostData { 
    data: IPost;
}

class Post extends Component<PostData> {
    render() {
        const { title, url } = this.props.data;
        return(
            <a className="App-link" href={ url } target="_blank">
                <h3 className="post-title">{ title }</h3>
            </a>
        );
    }
  }
  export default Post;