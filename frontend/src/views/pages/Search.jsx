import React from 'react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  CardImg,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Container,
  Label,
  Button,
  Modal
} from "reactstrap";
import ReactDatetime from "react-datetime";
import { Link } from "react-router-dom";

import Navbar from "components/Navbars/DarkNavbar.jsx";
import { cuisineTypes, cuisineTypesList } from "constants.js";
import http from "http.js";
import SearchCard from 'components/SearchCard';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      modal: false,
      searchName: '',
      searchCuisines: [],
      searchBudget: null,
      restaurants: []
    }
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }

  valid = (current) => {
    const yesterday = ReactDatetime.moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  }

  toggleModal = () => {
    this.setState({ modal: !this.state.modal});
  }

  handleChange = (value, event) => {
    if (value == "searchCuisines") {
      const selected = Array.from(event.target.options).filter(x => x.selected).map(x => x.value);
      this.setState({[value]: selected});
    } else {
      this.setState({[value]: event.target.value});
    }
  }

  handleSearch = () => {
    const params = {};
    if (this.state.searchName.length > 0) {
      params.name = this.state.searchName;
    }
    if (this.state.searchBudget !== null) {
      params.budget = parseFloat(this.state.searchBudget);
    }
    if (this.state.searchCuisines.length > 0) {
      params.cuisineTypes = this.state.searchCuisines.map(x => parseInt(x));
    }
    // console.log(params)
    http.get("/restaurants", {params})
    .then((res) => {
      // console.log(res.data.data)
      this.setState({ restaurants: res.data.data });
    })
  }

  render() {
    return (
      <>
        <Navbar history={this.props.history}/>
        <main ref="main">
          <section className="section">
            <Container className="pt-md">
              <Row>
                <Col xs="4">
                  <Card shadow>
                    <CardHeader>
                      Search criteria
                    </CardHeader>
                    <CardBody>
                      <Form>
                        {/* <FormGroup>
                          <Label for="date">Date</Label>
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-calendar-grid-58" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <ReactDatetime
                              inputProps={{
                                placeholder: "Choose a date"
                              }}
                              timeFormat={false}
                              isValidDate={this.valid}
                              defaultValue={new Date()}
                              onChange={e => this.setState({ date: e })}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <Label for="time">Time</Label>
                          <Input type="select" name="select" id="time">
                            <option>1030</option>
                            <option>1100</option>
                            <option>1130</option>
                            <option>1200</option>
                            <option>1230</option>
                          </Input>
                        </FormGroup> */}
                        {/* <FormGroup>
                          <Label for="pax">Pax</Label>
                          <Input type="select" name="select" id="pax">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </Input>
                        </FormGroup> */}
                        <FormGroup>
                          <Label for="name">Restaurant</Label>
                          <Input type="text" name="name" id="name" 
                            placeholder="Restaurant name" value={this.state.searchName}
                            onChange={(e) => this.handleChange('searchName', e)}>
                          </Input>
                        </FormGroup>
                        <FormGroup>
                          <Label for="cuisine">Cuisine</Label>
                          <Input type="select" name="selectMulti" id="cuisine" multiple
                            value={this.state.searchCuisines}
                            onChange={(e) => this.handleChange('searchCuisines', e)}>
                            <option value="" disabled selected hidden>Please Choose...</option>
                            {
                              cuisineTypesList.map(ct => (
                                <option value={ct[1]}>{ct[0]}</option>
                              ))
                            }
                          </Input>
                        </FormGroup>
                        <FormGroup>
                          <Label for="location">Budget</Label>
                          <Input type="select" name="select" id="budget"
                            value={this.state.searchBudget}
                            onChange={(e) => this.handleChange('searchBudget', e)}>
                            <option value="" disabled selected hidden>Please Choose...</option>
                            <option value={10}>$</option>
                            <option value={50}>$$</option>
                            <option value={100}>$$$</option>
                          </Input>
                        </FormGroup>
                        {/* <FormGroup>
                          <Label for="location">Location</Label>
                          <Input type="select" name="select" id="location">
                            <option value="" disabled selected hidden>Please Choose...</option>
                            <option>North</option>
                            <option>South</option>
                            <option>East</option>
                            <option>West</option>
                          </Input>
                        </FormGroup> */}
                        <Button color="primary" type="button" block onClick={this.handleSearch}>
                          Search
                        </Button>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
                <Col>
                  {
                    this.state.restaurants.map((r) => (
                      <SearchCard restaurant={r} toggleModal={this.toggleModal}/>
                    ))
                  }
                </Col>
              </Row>
            </Container>
          </section>
          <Modal
            className="modal-dialog-centered"
            isOpen={this.state.modal}
            onClick={this.toggleModal}
            >
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">
                Booking a reservation
              </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={this.toggleModal}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
            <div className="modal-body">
              You are making a reservation for
              1 people at Bread Street Kitchen on Thu, 31 Oct 2019, 11:45 am            
            </div>
            <div className="modal-footer">
              <Button
                color="secondary"
                data-dismiss="modal"
                type="button"
                onClick={this.toggleModal}
              >
                Cancel
              </Button>
              <Button color="primary" type="button">
                Book now
              </Button>
            </div>
          </Modal>
        </main>
      </>
    );
  }
}

export default Search;