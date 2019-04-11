
import React, { Component } from 'react';

export interface IErrorBox {
    message: string;
    errorCode: string;
}
class Post extends Component<IErrorBox> {
    render() {
        const { message, errorCode } = this.props;

        return(
        <span className="error" title={ errorCode }>
            { message }
        </span>
        );
    }
  }
  export default Post;