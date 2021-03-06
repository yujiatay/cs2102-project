import React from 'react';
import http from "http.js";

import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";

import Navbar from "components/Navbars/DarkNavbar.jsx";
import ArticleComment from "components/ArticleComment";
import EditArticleModal from "components/EditArticleModal";
import EditCommentModal from "components/EditCommentModal";
import { requireAuthentication } from "../../components/AuthenticatedComponent";

class ArticleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Article Title",
      username: "Unknown",
      createdAt: -1,
      body: "Loading",
      comments: [],
      postIsLoading: true,
      commentsIsLoading: true,
      commentEditModal: false,
      commentUsername: '',
      commentCreated: -2,
      editModal: false
    }

    this.handleArticleDelete = this.handleArticleDelete.bind(this);
    this.handleArticleEdit = this.handleArticleEdit.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);

  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    const { match: { params } } = this.props;
    this.setState({
      username: params.username,
      createdAt: parseInt(params.createdAt)
    })

    // Fetch article info
    this.fetchArticleBody(params.username, parseInt(params.createdAt));

    // Fetch comments
    this.fetchArticleComments(params.username, parseInt(params.createdAt));
  }

  getParams({ match }) {
    let { username, createdAt } = match.params;
    this.state.username = username;
    this.state.createdAt = createdAt;
  }

  fetchArticleBody(username, createdAt) {
    http.get(`/diners/${username}/articles/${createdAt}`)
      .then(response => response.data.data)
      .then(
        data => {
          this.setState({
            title: data.title,
            body: data.content.toString(),
            postIsLoading: false
          });
          console.log(data.toString());
        }
      )
      .catch(error => {
        alert("Error fetching article body :( " + error);
        this.setState({
          postIsLoading: false,
        });
      });
  }

  fetchArticleComments(username, createdAt) {
    http.get(`/diners/${username}/articles/${createdAt}/comments`)
      .then(response => response.data.data)
      .then(
        data => {
          this.setState({
            comments: data,
            commentsIsLoading: false
          });
          console.log("Comments: " + data.toString());
        }
      )
      .catch(error => {
        alert("Error fetching comments :( " + error);
        this.setState({
          commentsIsLoading: false,
        });
      });
  }

  toggleEditModal = () => {
    this.setState({ editModal: !this.state.editModal });
    console.log("TOGGLED!");
  }

  toggleCommentEditModal = (commentUser, commentCreatedAt) => {

    this.setState({ 
      commentUsername: commentUser,
      commentCreated: commentCreatedAt,
      commentEditModal: !this.state.commentEditModal 
    });
  }

  handleArticleDelete() {
    // AXIOS DELETE TO BE CONFIGURED
    http.delete(`/diners/${this.state.username}/articles/${this.state.createdAt}`);

    // REDIRECT TO ARTICLES LIST PAGE
  }

  handleArticleEdit() {
    this.toggleEditModal();
    // REFRESH THIS PAGE
  }

  handleCommentPost(e, username, createdAt) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const body = {}
    formData.forEach((value, property) => body[property] = value)
    console.table(body)
    // Request goes here.
    http.post(`/diners/${username}/articles/${createdAt}/comments`, { content: body.text })
      .then(res => {
        console.log(res);
        this.fetchArticleComments(username, createdAt);
      })
      .catch(error => {
        alert("Error posting new article: " + error);
      });
  }

  render() {
    const createdTimestamp = new Date(this.state.createdAt).toString();
    const { postIsLoading, commentsIsLoading, comments } = this.state;
    const { user } = this.props;
    const isOwner = user.username == this.state.username;
    return (
      <>
        <Navbar user={user} history={this.props.history}/>
        <main ref="main">
          <Container className="my-lg">
            <h2>{this.state.title}</h2>
            <h6>Posted By: {this.state.username}</h6>
            <h6>Posted On: {createdTimestamp}</h6>
            <div>
              {isOwner ? (
                <div>
                  <Button onClick={this.handleArticleEdit}>Edit</Button>
                  <Button onClick={this.handleArticleDelete}>Delete</Button>
                </div>
              ) : <p></p>}
            </div>
            <p></p>
            <div>
              {!postIsLoading ? <p>{this.state.body}</p> : (
                <p>Post Loading...</p>
              )}
            </div>
            <h3>Comments:</h3>
            <Form onSubmit={e => this.handleCommentPost(e, this.state.username, this.state.createdAt)}>
              <FormGroup>
                <Label for="exampleText">Add your comment here:</Label>
                <Input type="textarea" name="text" id="exampleText"/>
                <p></p>
                <Button>Submit</Button>
              </FormGroup>
            </Form>
            <div>
              {!commentsIsLoading ? (
                comments.map(comment => {
                  const { username, content, createdAt, updatedAt } = comment;
                  return (
                    <div key={createdAt}>
                      <ArticleComment ausername={this.state.username} acreatedAt={this.state.createdAt}
                                      username={username} createdAt={createdAt} updatedAt={createdAt} content={content}
                                      onDelete={() => this.fetchArticleComments(this.state.username, this.state.createdAt)}
                                      toggleCommentEditModal={this.toggleCommentEditModal} />
                    </div>
                  );
                })
              ) : (
                <p>Comments Loading...</p>
              )}
            </div>
          </Container>
          <EditArticleModal isOpen={this.state.editModal} toggleModal={this.toggleEditModal}
                            username={this.state.username} createdAt={this.state.createdAt}/>
          <EditCommentModal isOpen={this.state.commentEditModal} toggleModal={this.toggleCommentEditModal}
                            ausername={this.state.username} acreatedAt={this.state.createdAt}
                            commentUsername={this.state.commentUsername} commentCreatedAt={this.state.commentCreated}/>
        </main>
      </>
    );
  }
}

function checkAuth(user, userType) {
  return !!(user && userType === 1);
}

export default requireAuthentication(ArticleView, checkAuth);
