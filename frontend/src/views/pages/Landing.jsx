/*!

=========================================================
* Argon Design System React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import { Link } from "react-router-dom";

// reactstrap components
import {
  Button,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import Navbar from "components/Navbars/Navbar.jsx";
import Background from '../../assets/img/restaurant.jpg';
import { requireAuthentication } from "../../components/AuthenticatedComponent";

class Landing extends React.Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }

  render() {
    const { user } = this.props;
    return (
      <>
        <Navbar user={user} history={this.props.history} />
        <main ref="main">
          <section className="section section-lg"
            style={{
              backgroundImage: `url(${Background})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              height: '100vh',
              opacity: 0.85,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Container className="py-lg-md d-flex">
              <div className="col px-0">
                <Row>
                  <Col lg="6">
                    <h1 className="display-3 text-white">
                      Get seats for your next meal now
                    </h1>
                    <Row className="row-grid">
                      <Col>
                        <Link to="/search">
                          <Button 
                            className="btn-icon btn-2"
                            color="info"
                            type="button"
                          >
                            <span className="btn-inner--icon">
                              <i className="fa fa-search" />
                            </span>
                            <span className="nav-link-inner--text ml-1">
                              Find one now
                            </span>
                          </Button>
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Container>
          </section>
          <section className="section section-sm">
            <Container>
              <Row className="align-items-center justify-content-md-between">
                <Col md="6">
                  <div className=" copyright">
                    Created by CS2102 Team 17.
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        </main>
      </>
    );
  }
}

function checkAuth() {
  return true;
}

export default requireAuthentication(Landing, checkAuth);