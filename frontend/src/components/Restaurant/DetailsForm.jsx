import React from 'react';
import { Alert, Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { cuisineTypesList } from "constants.js";
import http from "http.js";
import TagMultiSelect from "components/TagMultiSelect";

class DetailsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      cuisineType: 1,
      name: "",
      branchLocation: "",
      openingHours: "",
      capacity: "",
      tags: [],
      allTags: [],

      alert: {
        visible: false,
        color: "primary",
        msg: ""
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { name, cuisineType, branchLocation, openingHours, capacity, tags } = this.props.details;
    const { allTags } = this.props;
    if (prevProps.allTags.length !== this.props.allTags.length || prevProps.details !== this.props.details) {
      this.setState({
        name,
        cuisineType,
        branchLocation,
        openingHours,
        capacity,
        tags,
        allTags
      });
    }
  }

  onValueChange(key) {
    return (e) => {
      const { target: { value } } = e;
      this.setState({
        [key]: value
      })
    }
  }

  startEdit = () => {
    this.setState({ editing: true });
  };

  setAlertVisible = (visible, color, msg) => {
    this.setState({
      alert: { visible, color, msg }
    });
  };

  submitEdit = () => {
    const { name, cuisineType, branchLocation, openingHours, capacity, tags } = this.state;
    const body = {
      name,
      cuisineType,
      branchLocation,
      openingHours,
      capacity,
      tags
    };
    http.patch(`/restaurants/${this.props.details.username}`, body)
      .then((res) => {
        this.setAlertVisible(true, "success", res.data.msg);
        this.setState({
          editing: false
        })
      })
      .catch((err) => {
        if (err.response) {
          this.setAlertVisible(true, "danger", err.response.data.msg);
        }
      })
  };

  render() {
    const { editing, name, cuisineType, branchLocation, openingHours, capacity, tags, allTags } = this.state;

    return (
      <>
        <Alert isOpen={this.state.alert.visible} color={this.state.alert.color}
               toggle={() => this.setState({ alert: { visible: false } })}
               style={{ zIndex: 1001, marginBottom: 0 }}
        >
          <span className="alert-inner--text">
            {this.state.alert.msg}
          </span>
        </Alert>
        <Form>
          <FormGroup>
            <Label for="name">Restaurant Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={this.onValueChange("name")}
              disabled={!editing}
            />
          </FormGroup>
          <FormGroup>
            <Label for="cuisine">Cuisine Type</Label>
            <Input
              type="select"
              name="select"
              id="cuisine"
              onChange={this.onValueChange("cuisineType")}
              value={cuisineType}
              disabled={!editing}>
              {
                cuisineTypesList.map(entry => {
                  const [name, value] = entry;
                  return <option value={value} key={value}>{name}</option>
                })
              }
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="address">Address</Label>
            <Input
              id="address"
              type="text"
              value={branchLocation}
              onChange={this.onValueChange("branchLocation")}
              disabled={!editing}
            />
          </FormGroup>
          <FormGroup>
            <Label for="opening">Opening Hours</Label>
            <Input
              id="opening"
              type="textarea"
              value={openingHours}
              onChange={this.onValueChange("openingHours")}
              disabled={!editing}
            />
          </FormGroup>
          <FormGroup>
            <Label for="capacity">Maximum Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={this.onValueChange("capacity")}
              disabled={!editing}
            />
          </FormGroup>
          <FormGroup>
            <Label for="tags">Tags</Label>
              <TagMultiSelect
                id="tags"
                tags={allTags}
                selectedTags={tags}
                onSelectChange={this.onValueChange("tags")}
                disabled={!editing}
              />
          </FormGroup>
          {
            editing
              ? (
                <>
                  <Button>Cancel</Button>
                  <Button onClick={this.submitEdit}>Submit</Button>
                </>
              )
              : <Button onClick={this.startEdit} block>Edit</Button>
          }
        </Form>
      </>
    );
  }
}

export default DetailsForm;