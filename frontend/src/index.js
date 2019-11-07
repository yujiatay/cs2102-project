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
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store';

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss";

import Landing from "views/pages/Landing.jsx";
import Login from "views/pages/Login.jsx";
import Profile from "views/pages/Profile.jsx";
import Register from "views/pages/Register.jsx";
import Search from "views/pages/Search";
import Restaurant from "views/pages/Restaurant";
import MyBookings from "views/pages/MyBookings";
import ArticlesList from "views/pages/ArticlesList";
import ArticleView from "views/pages/ArticleView";
import Dashboard from "views/pages/Restaurant/Dashboard";
import RestaurantProfile from "views/pages/Restaurant/RestaurantProfile";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route
          path="/"
          exact
          render={props => <Landing {...props} />}
        />
        <Route path="/login" exact render={props => <Login {...props} />} />
        <Route
          path="/profile"
          exact
          render={props => <Profile {...props} />}
        />
        <Route
          path="/register"
          exact
          render={props => <Register {...props} />}
        />
        <Route 
          path="/search"
          render={props => <Search {...props}/>}
        />
        <Route 
          path="/restaurants/:username"
          render={props => <Restaurant {...props}/>}
        />
        <Route 
          path="/myBookings"
          render={props => <MyBookings {...props}/>}
        />
        <Route 
          path="/articles"
          render={props => <ArticlesList {...props}/>}
        />
        <Route 
          path="/articleView"
          render={props => <ArticleView {...props}/>}
        />
        <Route
          path="/dashboard"
          render={props => <Dashboard {...props}/>}
        />
        <Route
          path="/restaurant-details"
          render={props => <RestaurantProfile {...props}/>}
        />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  </Provider>
  ,
  document.getElementById("root")
);
